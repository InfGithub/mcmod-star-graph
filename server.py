"""
star_graph/server.py - 本地服务器：静态文件服务 + 封面代理

用途
----
    代替 ``python -m http.server`` 提供静态文件服务，并额外提供
    ``/cover_proxy`` 端点用于下载模组封面。

为什么需要代理
--------------
    MC 百科图片 CDN（i.mcmod.cn / www.mcmod.cn）有防盗链：只放行
    mcmod.cn 域名的 Referer/Origin。浏览器 fetch 跨域请求必定携带
    Origin（JS 无法移除），直连会被 403 拒绝。代理在服务端用 urllib
    转发（无 Origin，带伪装 Referer），从而绕过防盗链。

用法
----
    python server.py                # 127.0.0.1:1119
    python server.py 8080           # 自定义端口
    python server.py 8080 0.0.0.0   # 自定义端口 + 绑定地址（局域网访问）

安全说明
--------
    /cover_proxy 仅允许转发白名单内的 host（i.mcmod.cn / www.mcmod.cn），
    防止被当作开放代理（SSRF）。
"""

import json
import os
import re
import shutil
import subprocess
import sys
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 1119
PROXY_PATH = "/cover_proxy"
CLEAN_PATH = "/clean"
HEALTH_PATH = "/health"
DOWNLOAD_START_PATH = "/cover_download/start"
DOWNLOAD_STATUS_PATH = "/cover_download/status"
EXISTING_COVERS_PATH = "/cover_download/existing"
# 前端固定请求的图数据文件名；--data 参数可把其他文件映射到这个名字
DATA_ALIAS = "graph.json"
# SSRF 防护：只允许转发 mcmod 封面域名（老封面在 www.mcmod.cn/pages/class/images/cover/）
ALLOWED_HOSTS = {"i.mcmod.cn", "www.mcmod.cn"}
# 封面边长（正方形）：对应 CDN 的 @NxN.jpg 缩略图后缀，下载时统一构造
COVER_SIZE = 300
REQUEST_TIMEOUT = 15
ROOT_DIR = Path(__file__).resolve().parent
COVERS_DIR = ROOT_DIR / "covers"
STATIC_FALLBACK_BASE = "https://stargraph.xiey.work"

# clean 模式：一次性标志，下次页面加载时前端清空封面缓存
_CLEAN_CACHE = False
# --data 指定的图数据文件（以 DATA_ALIAS 名字服务），None 时直接服务根目录同名文件
_DATA_FILE = None
_DOWNLOAD_JOBS = {}
_DOWNLOAD_LOCK = threading.Lock()
_COVER_LOCKS = {}
_COVER_LOCKS_GUARD = threading.Lock()
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0"
)
# 伪装 Referer：CDN 只放行 mcmod.cn 域名的 Referer（裸请求也放行，伪装双保险）
REFERER = "https://www.mcmod.cn/"


def _normalize_cover_url(value):
    url = str(value or "").strip()
    if url.startswith("//"):
        url = "https:" + url
    return re.sub(r"@\d+x\d+\.jpg$", f"@{COVER_SIZE}x{COVER_SIZE}.jpg", url)


def _cover_lock(key):
    with _COVER_LOCKS_GUARD:
        return _COVER_LOCKS.setdefault(str(key), threading.Lock())


def _download_cover_one(item):
    key = str(item.get("key", ""))
    with _cover_lock(key):
        return _download_cover_one_unlocked(item)


def _download_cover_one_unlocked(item):
        key = str(item["key"])
        url = _normalize_cover_url(item.get("cover_url"))
        if not re.fullmatch(r"\d+", key) or not Handler._is_allowed(url):
            return key, "failed"
        COVERS_DIR.mkdir(parents=True, exist_ok=True)
        target = COVERS_DIR / f"{key}.jpg"
        if target.exists() and target.stat().st_size > 0:
            return key, "skipped"
        # MC CDN 在部分 Python/OpenSSL 环境会出现 SSL EOF；回退到已部署的静态封面，
        # 仍然保存到本地 covers，不使用浏览器反代。
        sources = [url, f"{STATIC_FALLBACK_BASE}/covers/{key}.jpg"]
        for source in sources:
            temp = COVERS_DIR / f".{key}.{uuid.uuid4().hex}.tmp"
            try:
                req = urllib.request.Request(source, headers={"User-Agent": USER_AGENT, "Referer": REFERER})
                with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                    content_type = resp.headers.get("Content-Type", "")
                    data = resp.read()
                if len(data) < 100 or (content_type and not content_type.startswith("image/")):
                    raise ValueError("not an image")
                temp.write_bytes(data)
                temp.replace(target)
                return key, "downloaded"
            except Exception:
                try:
                    temp.unlink(missing_ok=True)
                except OSError:
                    pass
        return key, "failed"

def _existing_cover_keys():
    keys = []
    if COVERS_DIR.exists():
        for file in COVERS_DIR.glob("*.jpg"):
            if re.fullmatch(r"\d+", file.stem) and file.is_file() and file.stat().st_size > 0:
                keys.append(file.stem)
    return sorted(keys, key=lambda value: int(value))


def _write_cover_manifest(nodes):
    """按当前已落盘文件写清单；单个图片文件在下载完成时就已原子保存。"""
    items = {}
    for item in nodes:
        key = str(item["key"])
        target = COVERS_DIR / f"{key}.jpg"
        if target.exists() and target.stat().st_size > 0:
            items[key] = {
                "path": f"covers/{key}.jpg",
                "orig": f"covers/{key}.jpg",
                "bytes": target.stat().st_size,
            }
    manifest = {
        "schema": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "total": len(items),
        "keys": sorted(items, key=lambda value: int(value)),
        "items": items,
    }
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    temp_manifest = COVERS_DIR / f".manifest.{uuid.uuid4().hex}.tmp"
    temp_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    temp_manifest.replace(COVERS_DIR / "manifest.json")


def _record_download_result(job, result, manifest_nodes):
    key = str(result.get("key", ""))
    status = result.get("status", "failed")
    with _DOWNLOAD_LOCK:
        job["done"] += 1
        job[status] += 1
        done_count = job["done"]
        if status in ("downloaded", "skipped"):
            job["ready_keys"].append(key)
    # 图片已逐个原子落盘；manifest 按小批次 checkpoint，支持中途恢复。
    if done_count % 16 == 0 or done_count == job["total"]:
        _write_cover_manifest(manifest_nodes)


def _run_node_cover_download(job, nodes, manifest_nodes):
    node_bin = shutil.which("node")
    if not node_bin:
        return False
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    input_path = COVERS_DIR / f".download.{job['id']}.json"
    input_path.write_text(json.dumps(nodes, ensure_ascii=False), encoding="utf-8")
    script_path = ROOT_DIR / "scripts" / "download-covers-local.mjs"
    try:
        process = subprocess.Popen(
            [node_bin, str(script_path), str(input_path), str(COVERS_DIR)],
            cwd=str(ROOT_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        for line in process.stdout or ():
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            if event.get("type") == "progress":
                _record_download_result(job, event, manifest_nodes)
        return process.wait() == 0
    except Exception:
        return False
    finally:
        try:
            input_path.unlink(missing_ok=True)
        except OSError:
            pass


def _run_cover_download(job_id, nodes, manifest_nodes):
    with _DOWNLOAD_LOCK:
        job = _DOWNLOAD_JOBS[job_id]
    if not nodes:
        _write_cover_manifest(manifest_nodes)
        with _DOWNLOAD_LOCK:
            job["status"] = "done"
        return
    if _run_node_cover_download(job, nodes, manifest_nodes):
        _write_cover_manifest(manifest_nodes)
        with _DOWNLOAD_LOCK:
            job["status"] = "done"
        return

    # Node 不可用时保留 Python 兜底下载器。
    def done(result):
        key, status = result
        _record_download_result(job, {"key": key, "status": status}, manifest_nodes)

    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(_download_cover_one, item) for item in nodes]
        for future in as_completed(futures):
            done(future.result())
    _write_cover_manifest(manifest_nodes)
    with _DOWNLOAD_LOCK:
        job["status"] = "done"


class _NullLock:
    def __enter__(self): return self
    def __exit__(self, exc_type, exc, tb): return False


class Handler(SimpleHTTPRequestHandler):
    """静态文件（继承 SimpleHTTPRequestHandler，自带目录穿越防护）+ /cover_proxy 代理。"""

    def end_headers(self):
        # 允许在线页面探测/使用本机 server.py（不携带凭据）。
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == DOWNLOAD_START_PATH:
            self._handle_download_start()
        else:
            self.send_error(404)

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == HEALTH_PATH:
            self._handle_health()
        elif parsed.path == PROXY_PATH:
            self._handle_proxy(parsed)
        elif parsed.path == CLEAN_PATH:
            self._handle_clean()
        elif parsed.path == DOWNLOAD_STATUS_PATH:
            self._handle_download_status(parsed)
        elif parsed.path == EXISTING_COVERS_PATH:
            self._handle_existing_covers()
        elif _DATA_FILE and parsed.path == "/" + DATA_ALIAS:
            self._handle_data()
        else:
            super().do_GET()

    def _send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _handle_download_start(self):
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > 20 * 1024 * 1024:
                raise ValueError("invalid request size")
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            raw_nodes = payload.get("nodes", [])
            nodes = []
            seen = set()
            for item in raw_nodes:
                key = str(item.get("key", ""))
                if key in seen or not re.fullmatch(r"\d+", key):
                    continue
                if not item.get("cover_url"):
                    continue
                seen.add(key)
                nodes.append({"key": key, "cover_url": item.get("cover_url")})
            if not nodes:
                self._send_json(400, {"error": "no cover nodes"})
                return
            existing = set(_existing_cover_keys())
            pending = [node for node in nodes if str(node["key"]) not in existing]
            job_id = uuid.uuid4().hex
            job = {
                "id": job_id,
                "status": "running",
                "total": len(nodes),
                "done": len(existing.intersection({str(node["key"]) for node in nodes})),
                "downloaded": 0,
                "skipped": len(existing.intersection({str(node["key"]) for node in nodes})),
                "failed": 0,
                "ready_keys": sorted(existing.intersection({str(node["key"]) for node in nodes}), key=lambda value: int(value)),
            }
            with _DOWNLOAD_LOCK:
                _DOWNLOAD_JOBS[job_id] = job
            threading.Thread(target=_run_cover_download, args=(job_id, pending, nodes), daemon=True).start()
            self._send_json(202, job)
        except Exception as error:
            self._send_json(400, {"error": str(error)})

    def _handle_existing_covers(self):
        keys = _existing_cover_keys()
        # 启动下载前先把已有文件同步到清单，避免 manifest 落后于 covers 目录。
        _write_cover_manifest([{"key": key} for key in keys])
        self._send_json(200, {"count": len(keys), "keys": keys})

    def _handle_download_status(self, parsed):
        query = urllib.parse.parse_qs(parsed.query)
        job_id = query.get("id", [""])[0]
        try:
            since = max(0, int(query.get("since", ["0"])[0]))
        except ValueError:
            since = 0
        with _DOWNLOAD_LOCK:
            job = dict(_DOWNLOAD_JOBS.get(job_id, {}))
            ready = list(job.pop("ready_keys", [])) if job else []
        if not job:
            self._send_json(404, {"error": "job not found"})
            return
        job["ready_keys"] = ready[since:]
        job["ready_cursor"] = len(ready)
        self._send_json(200, job)

    def _handle_health(self):
        body = json.dumps({"ok": True, "service": "star-graph-server"}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _handle_data(self):
        """把 --data 指定的文件以 /graph.json 名字返回。"""
        try:
            with open(_DATA_FILE, "rb") as f:
                data = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except OSError as e:
            print(f"[ERROR] read data file: {_DATA_FILE} -> {e}")
            self.send_error(500)

    def _handle_clean(self):
        """clean 模式探测：首次返回 true 并复位，之后返回 false（一次性）。"""
        global _CLEAN_CACHE
        body = json.dumps({"clean": _CLEAN_CACHE}).encode("utf-8")
        _CLEAN_CACHE = False
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _handle_proxy(self, parsed):
        """焦点懒加载反代：返回图片的同时按 key 原子保存到本地 covers。"""
        qs = urllib.parse.parse_qs(parsed.query)
        url = qs.get("url", [""])[0]
        key = qs.get("key", [""])[0]
        if not url:
            self.send_error(400, "url param required")
            return
        if key and not re.fullmatch(r"\d+", key):
            self.send_error(400, "invalid key")
            return
        if not self._is_allowed(url):
            self.send_error(403, "host not allowed")
            return
        url = _normalize_cover_url(url)
        target = COVERS_DIR / f"{key}.jpg" if key else None
        content_type = "image/jpeg"
        data = None
        with _cover_lock(key) if key else _NullLock():
            if target and target.exists() and target.stat().st_size > 0:
                data = target.read_bytes()
            else:
                sources = [url]
                if key:
                    sources.append(f"{STATIC_FALLBACK_BASE}/covers/{key}.jpg")
                for source in sources:
                    try:
                        req = urllib.request.Request(source, headers={"User-Agent": USER_AGENT, "Referer": REFERER})
                        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                            candidate = resp.read()
                            candidate_type = resp.headers.get("Content-Type", "image/jpeg")
                        if len(candidate) < 100 or (candidate_type and not candidate_type.startswith("image/")):
                            continue
                        data = candidate
                        content_type = candidate_type
                        if target:
                            COVERS_DIR.mkdir(parents=True, exist_ok=True)
                            temp = COVERS_DIR / f".{key}.{uuid.uuid4().hex}.tmp"
                            temp.write_bytes(data)
                            temp.replace(target)
                        break
                    except Exception:
                        continue
        if data is None:
            self.send_error(502, "cover download failed")
            return
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    @staticmethod
    def _is_allowed(url: str) -> bool:
        """仅允许 http(s) 且 host 在白名单内的 URL。"""
        try:
            parts = urllib.parse.urlsplit(url)
        except ValueError:
            return False
        if parts.scheme not in ("http", "https"):
            return False
        return parts.netloc.lower() in ALLOWED_HOSTS

    def log_message(self, fmt, *args):
        # 静默：封面代理请求量大，不打访问日志
        pass


def main():
    args = sys.argv[1:]
    port = DEFAULT_PORT
    host = DEFAULT_HOST
    clean_mode = False
    data_file = None
    i = 0
    while i < len(args):
        arg = args[i]
        if arg == "clean":
            clean_mode = True
        elif arg == "--data":
            i += 1
            if i >= len(args):
                raise SystemExit("[ERROR] --data 需要一个文件路径")
            data_file = args[i]
        elif arg.isdigit():
            port = int(arg)
        else:
            host = arg
        i += 1
    if data_file and not os.path.exists(data_file):
        raise SystemExit(f"[ERROR] 数据文件不存在: {data_file}")
    global _CLEAN_CACHE, _DATA_FILE
    _CLEAN_CACHE = clean_mode
    _DATA_FILE = data_file
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"[START] star_graph server running at http://{host}:{port}/")
    print(f"[INFO] cover proxy endpoint: http://{host}:{port}{PROXY_PATH}?url=...")
    if data_file:
        print(f"[INFO] serving data file as /{DATA_ALIAS}: {data_file}")
    if clean_mode:
        print("[INFO] clean mode: browser cover cache will be cleared on next page load")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[STOP] server stopped")


if __name__ == "__main__":
    main()
