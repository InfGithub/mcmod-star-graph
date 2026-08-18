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
import sys
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor
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
# 前端固定请求的图数据文件名；--data 参数可把其他文件映射到这个名字
DATA_ALIAS = "graph.json"
# SSRF 防护：只允许转发 mcmod 封面域名（老封面在 www.mcmod.cn/pages/class/images/cover/）
ALLOWED_HOSTS = {"i.mcmod.cn", "www.mcmod.cn"}
# 封面边长（正方形）：对应 CDN 的 @NxN.jpg 缩略图后缀，下载时统一构造
COVER_SIZE = 300
REQUEST_TIMEOUT = 15
ROOT_DIR = Path(__file__).resolve().parent
COVERS_DIR = ROOT_DIR / "covers"

# clean 模式：一次性标志，下次页面加载时前端清空封面缓存
_CLEAN_CACHE = False
# --data 指定的图数据文件（以 DATA_ALIAS 名字服务），None 时直接服务根目录同名文件
_DATA_FILE = None
_DOWNLOAD_JOBS = {}
_DOWNLOAD_LOCK = threading.Lock()
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


def _download_cover_one(item):
    key = str(item["key"])
    url = _normalize_cover_url(item.get("cover_url"))
    if not re.fullmatch(r"\d+", key) or not Handler._is_allowed(url):
        return key, "failed"
    COVERS_DIR.mkdir(parents=True, exist_ok=True)
    target = COVERS_DIR / f"{key}.jpg"
    if target.exists() and target.stat().st_size > 0:
        return key, "skipped"
    temp = COVERS_DIR / f".{key}.{uuid.uuid4().hex}.tmp"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Referer": REFERER})
        with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
            data = resp.read()
        if len(data) < 100:
            return key, "failed"
        temp.write_bytes(data)
        temp.replace(target)
        return key, "downloaded"
    except Exception:
        try:
            temp.unlink(missing_ok=True)
        except OSError:
            pass
        return key, "failed"


def _run_cover_download(job_id, nodes):
    with _DOWNLOAD_LOCK:
        job = _DOWNLOAD_JOBS[job_id]
    def done(result):
        key, status = result
        with _DOWNLOAD_LOCK:
            job["done"] += 1
            job[status] += 1

    with ThreadPoolExecutor(max_workers=8) as pool:
        for result in pool.map(_download_cover_one, nodes):
            done(result)

    items = {}
    for item in nodes:
        key = str(item["key"])
        target = COVERS_DIR / f"{key}.jpg"
        if target.exists() and target.stat().st_size > 0:
            items[key] = {"path": f"covers/{key}.jpg", "orig": f"covers/{key}.jpg", "bytes": target.stat().st_size}
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
    with _DOWNLOAD_LOCK:
        job["status"] = "done"


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
            job_id = uuid.uuid4().hex
            job = {"id": job_id, "status": "running", "total": len(nodes), "done": 0, "downloaded": 0, "skipped": 0, "failed": 0}
            with _DOWNLOAD_LOCK:
                _DOWNLOAD_JOBS[job_id] = job
            threading.Thread(target=_run_cover_download, args=(job_id, nodes), daemon=True).start()
            self._send_json(202, job)
        except Exception as error:
            self._send_json(400, {"error": str(error)})

    def _handle_download_status(self, parsed):
        query = urllib.parse.parse_qs(parsed.query)
        job_id = query.get("id", [""])[0]
        with _DOWNLOAD_LOCK:
            job = dict(_DOWNLOAD_JOBS.get(job_id, {}))
        if not job:
            self._send_json(404, {"error": "job not found"})
            return
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
        """转发封面图片：校验 host → urllib 抓取 → 字节流回传。"""
        qs = urllib.parse.parse_qs(parsed.query)
        url = qs.get("url", [""])[0]
        if not url:
            self.send_error(400, "url param required")
            return
        if not self._is_allowed(url):
            self.send_error(403, "host not allowed")
            return
        # 按 COVER_SIZE 构造缩略图（@170x115.jpg → @300x300.jpg；无后缀的老封面原样转发）
        url = re.sub(r"@\d+x\d+\.jpg$", "@{}x{}.jpg".format(COVER_SIZE, COVER_SIZE), url)
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Referer": REFERER})
        try:
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                data = resp.read()
                self.send_response(200)
                self.send_header("Content-Type", resp.headers.get("Content-Type", "image/jpeg"))
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Cache-Control", "no-store")
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            print(f"[ERROR] cover proxy: {url} -> HTTP {e.code}")
            self.send_error(e.code)
        except Exception as e:
            print(f"[ERROR] cover proxy: {url} -> {e}")
            self.send_error(502, "proxy fetch failed")

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
