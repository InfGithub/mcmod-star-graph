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
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 1119
PROXY_PATH = "/cover_proxy"
CLEAN_PATH = "/clean"
# 本地封面缓存目录（相对项目根）；命中直接返回，未命中代理下载后落盘
COVER_CACHE_DIR = "covers"
COVER_PATH = "/cover/"              # GET /cover/<key>：本地命中直接返回，未命中代理下载并缓存
IMPORT_PATH = "/api/cache/import/"  # POST /api/cache/import/<key>：浏览器存量迁移写入本地
STATUS_PATH = "/api/cache/status"   # GET：{total, cached}
# 前端固定请求的图数据文件名；--data 参数可把其他文件映射到这个名字
DATA_ALIAS = "graph.json"
# SSRF 防护：只允许转发 mcmod 封面域名（老封面在 www.mcmod.cn/pages/class/images/cover/）
ALLOWED_HOSTS = {"i.mcmod.cn", "www.mcmod.cn"}
# 封面边长（正方形）：对应 CDN 的 @NxN.jpg 缩略图后缀，下载时统一构造
COVER_SIZE = 300
REQUEST_TIMEOUT = 15

# clean 模式：一次性标志，下次页面加载时前端清空封面缓存
_CLEAN_CACHE = False
# --data 指定的图数据文件（以 DATA_ALIAS 名字服务），None 时直接服务根目录同名文件
_DATA_FILE = None
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0"
)
# 伪装 Referer：CDN 只放行 mcmod.cn 域名的 Referer（裸请求也放行，伪装双保险）
REFERER = "https://www.mcmod.cn/"
# key -> 规范化 cover_url（启动时从图数据加载）
_COVER_URLS = {}


def _normalize_cover_url(u: str):
    if u.startswith("//"):
        return "https:" + u
    return u


def _load_cover_urls(data_file):
    """从图数据提取 core 节点的 cover_url 映射，供 /cover/<key> 使用。"""
    urls = {}
    try:
        with open(data_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        for n in data.get("nodes", []):
            if n.get("type") != "core":
                continue
            u = n.get("cover_url")
            if not u:
                continue
            urls[str(n.get("key"))] = _normalize_cover_url(u)
    except Exception as e:
        print(f"[WARN] load cover urls from {data_file}: {e}")
    return urls


class Handler(SimpleHTTPRequestHandler):
    """静态文件（继承 SimpleHTTPRequestHandler，自带目录穿越防护）+ /cover_proxy 代理。"""

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == PROXY_PATH:
            self._handle_proxy(parsed)
        elif parsed.path == CLEAN_PATH:
            self._handle_clean()
        elif parsed.path.startswith(COVER_PATH):
            self._handle_cover(parsed)
        elif parsed.path == STATUS_PATH:
            self._handle_cache_status()
        elif _DATA_FILE and parsed.path == "/" + DATA_ALIAS:
            self._handle_data()
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path.startswith(IMPORT_PATH):
            self._handle_import(parsed)
        else:
            self.send_error(404)

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

    def _handle_cover(self, parsed):
        """本地封面缓存优先：命中 covers/<key>.jpg 直接返回；
        未命中则从图数据取 cover_url 代理下载，落盘后返回（增量缓存）。"""
        key = parsed.path[len(COVER_PATH):].strip("/")
        if not key.isdigit():
            self.send_error(400, "bad key")
            return
        cache_file = os.path.join(COVER_CACHE_DIR, key + ".jpg")
        if os.path.exists(cache_file):
            self._serve_file(cache_file, "image/jpeg")
            return
        url = _COVER_URLS.get(key)
        if not url:
            self.send_error(404, "no cover url for key")
            return
        data = self._fetch_cover(url)
        if data is None:
            self.send_error(502, "proxy fetch failed")
            return
        try:
            os.makedirs(COVER_CACHE_DIR, exist_ok=True)
            with open(cache_file, "wb") as f:
                f.write(data)
        except OSError as e:
            print(f"[ERROR] cover cache write: {cache_file} -> {e}")
        self._serve_bytes(data, "image/jpeg")

    def _handle_import(self, parsed):
        """浏览器存量迁移：POST 原始图片字节，写入 covers/<key>.jpg。"""
        key = parsed.path[len(IMPORT_PATH):].strip("/")
        if not key.isdigit():
            self.send_error(400, "bad key")
            return
        length = int(self.headers.get("Content-Length", 0) or 0)
        if length <= 0 or length > 5 * 1024 * 1024:
            self.send_error(400, "bad content-length")
            return
        body = self.rfile.read(length)
        try:
            os.makedirs(COVER_CACHE_DIR, exist_ok=True)
            with open(os.path.join(COVER_CACHE_DIR, key + ".jpg"), "wb") as f:
                f.write(body)
        except OSError as e:
            print(f"[ERROR] cover import: {key} -> {e}")
            self.send_error(500)
            return
        self._serve_bytes(b"ok", "text/plain")

    def _handle_cache_status(self):
        """返回本地缓存统计：cached = 数据所需 key 的本地命中数（而非文件总数，
        避免 covers/ 里存在无关 key 时误判"已齐"而漏掉缺失封面）。"""
        cached = 0
        missing = []
        for k in _COVER_URLS:
            if os.path.exists(os.path.join(COVER_CACHE_DIR, k + ".jpg")):
                cached += 1
            else:
                missing.append(k)
        body = json.dumps({"total": len(_COVER_URLS), "cached": cached, "missing": missing}).encode("utf-8")
        self._serve_bytes(body, "application/json")

    def _serve_file(self, path, ctype):
        with open(path, "rb") as f:
            data = f.read()
        self._serve_bytes(data, ctype)

    def _serve_bytes(self, data, ctype):
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def _handle_proxy(self, parsed):
        """旧端点：转发封面图片（兼容保留）。"""
        qs = urllib.parse.parse_qs(parsed.query)
        url = qs.get("url", [""])[0]
        if not url:
            self.send_error(400, "url param required")
            return
        if not self._is_allowed(url):
            self.send_error(403, "host not allowed")
            return
        url = _normalize_cover_url(url)
        data = self._fetch_cover(url)
        if data is None:
            self.send_error(502, "proxy fetch failed")
            return
        self._serve_bytes(data, "image/jpeg")

    def _fetch_cover(self, url):
        """按 COVER_SIZE 构造缩略图并抓取；失败返回 None。"""
        # @170x115.jpg → @300x300.jpg；无后缀的老封面原样转发
        url = re.sub(r"@\d+x\d+\.jpg$", "@{}x{}.jpg".format(COVER_SIZE, COVER_SIZE), url)
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Referer": REFERER})
        try:
            with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            print(f"[ERROR] cover fetch: {url} -> HTTP {e.code}")
        except Exception as e:
            print(f"[ERROR] cover fetch: {url} -> {e}")
        return None

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

    def end_headers(self):
        # 本地开发服务：禁用缓存，避免浏览器拿到旧版 html/js
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


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
    if not data_file and os.path.exists(DATA_ALIAS):
        data_file = DATA_ALIAS
    global _CLEAN_CACHE, _DATA_FILE, _COVER_URLS
    _CLEAN_CACHE = clean_mode
    _DATA_FILE = data_file
    if data_file:
        _COVER_URLS = _load_cover_urls(data_file)
        print(f"[INFO] cover url map loaded: {len(_COVER_URLS)} entries")
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
