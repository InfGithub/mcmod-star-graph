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
    python server.py 8080 0.0.0.0   # 自定义端口 + 绑定地址，支持局域网访问

安全说明
--------
    /cover_proxy 仅允许转发白名单内的 host（i.mcmod.cn / www.mcmod.cn），
    防止被当作开放代理（SSRF）。
"""

import hashlib
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, List, Optional

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 1119
PROXY_PATH = "/cover_proxy"
CLEAN_PATH = "/clean"
# 前端固定请求的图数据文件名；--data 参数可把其他文件映射到这个名字
DATA_ALIAS = "graph.json"
# SSRF 防护：只允许转发 mcmod 封面域名，老封面在 www.mcmod.cn/pages/class/images/cover/ 路径下
ALLOWED_HOSTS = {"i.mcmod.cn", "www.mcmod.cn"}
# 封面边长：正方形，对应 CDN 的 @NxN.jpg 缩略图后缀、下载时统一构造
COVER_SIZE = 300
REQUEST_TIMEOUT = 15
# 封面磁盘缓存：跨浏览器/跨设备共享，命中直接回文件不再请求 mcmod
COVER_CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "covers")
COVER_CACHE_TTL = 7 * 24 * 3600  # 缓存有效期 7 天，CDN 图片可能更新
# 缓存文件名按真实图片格式命名，由 Content-Type 决定扩展名
EXT_BY_TYPE = {"image/jpeg": "jpg", "image/png": "png", "image/gif": "gif", "image/webp": "webp"}

# clean 模式：一次性标志，下次页面加载时前端清空封面缓存
_clean_cache = False
# --data 指定的图数据文件以 DATA_ALIAS 名字服务，None 时直接服务根目录同名文件
_data_file: Optional[str] = None
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36 Edg/151.0.0.0"
)
# 伪装 Referer：CDN 只放行 mcmod.cn 域名的 Referer，裸请求也放行、伪装双保险
REFERER = "https://www.mcmod.cn/"


class Handler(SimpleHTTPRequestHandler):
    """静态文件（继承 SimpleHTTPRequestHandler，自带目录穿越防护）+ /cover_proxy 代理。"""

    # HTTP/1.1 keep-alive：复用连接，避免每张封面一次 TCP 建连，1.9 万请求即 1.9 万连接
    protocol_version = "HTTP/1.1"

    def do_GET(self) -> None:
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == PROXY_PATH:
            self._handle_proxy(parsed)
        elif parsed.path == CLEAN_PATH:
            self._handle_clean()
        elif _data_file and parsed.path == "/" + DATA_ALIAS:
            self._handle_data()
        else:
            super().do_GET()

    def _handle_data(self) -> None:
        """把 --data 指定的文件以 /graph.json 名字返回。"""
        data_file = _data_file
        if data_file is None:
            self.send_error(500)
            return
        try:
            with open(data_file, "rb") as f:
                data = f.read()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)
        except OSError as e:
            print(f"[ERROR] read data file: {data_file} -> {e}")
            self.send_error(500)

    def _handle_clean(self) -> None:
        """clean 模式探测：首次返回 true 并复位，之后返回 false（一次性）。"""
        global _clean_cache
        body = json.dumps({"clean": _clean_cache}).encode("utf-8")
        _clean_cache = False
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def _handle_proxy(self, parsed: "urllib.parse.SplitResult") -> None:
        """转发封面图片：校验 host → urllib 抓取 → 字节流回传。"""
        qs: Dict[str, List[str]] = urllib.parse.parse_qs(parsed.query)
        url: str = qs.get("url", [""])[0]
        if not url:
            self.send_error(400, "url param required")
            return
        if not self._is_allowed(url):
            self.send_error(403, "host not allowed")
            return
        # 真实浏览器 UA，前端传 navigator.userAgent；版本/平台永远真实，
        # 避免固定 UA 版本号过时；非法或缺省回退默认 UA
        ua: str = qs.get("ua", [""])[0]
        if not ua or len(ua) > 512 or "\r" in ua or "\n" in ua:
            ua = USER_AGENT
        # 按 COVER_SIZE 构造缩略图，@170x115.jpg 统一为 @300x300.jpg；无后缀的老封面原样转发
        url = re.sub(r"@\d+x\d+\.jpg$", "@{0}x{0}.jpg".format(COVER_SIZE), url)
        # 磁盘缓存：命中且未过期直接回文件，未命中下载后落盘，临时文件 + 原子改名防并发写坏
        digest = hashlib.sha1(url.encode("utf-8")).hexdigest()
        cache: Optional[str] = None
        for ext in EXT_BY_TYPE.values():
            p = os.path.join(COVER_CACHE_DIR, digest + "." + ext)
            if os.path.exists(p) and time.time() - os.path.getmtime(p) < COVER_CACHE_TTL:
                cache = p
                break
        data: Optional[bytes] = None
        content_type: Optional[str] = None
        if cache:
            with open(cache, "rb") as f:
                data = f.read()
            ext = cache.rsplit(".", 1)[-1]
            content_type = "image/" + ("jpeg" if ext == "jpg" else ext)
        else:
            req = urllib.request.Request(url, headers={"User-Agent": ua, "Referer": REFERER})
            try:
                with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
                    body = resp.read()
                    ctype = resp.headers.get("Content-Type", "image/jpeg").split(";")[0].strip().lower()
                ext = EXT_BY_TYPE.get(ctype, "jpg")
                cache = os.path.join(COVER_CACHE_DIR, digest + "." + ext)
                os.makedirs(COVER_CACHE_DIR, exist_ok=True)
                tmp = cache + ".tmp"
                with open(tmp, "wb") as f:
                    f.write(body)
                os.replace(tmp, cache)
                data = body
                content_type = ctype
            except urllib.error.HTTPError as e:
                print(f"[ERROR] cover proxy: {url} -> HTTP {e.code}")
                self.send_error(e.code)
                return
            except Exception as e:
                print(f"[ERROR] cover proxy: {url} -> {e}")
                self.send_error(502, "proxy fetch failed")
                return
        if data is None or content_type is None:
            self.send_error(502, "proxy fetch failed")
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

    def log_message(self, format: str, *args: Any) -> None:
        # 静默：封面代理请求量大，不打访问日志
        pass


def main() -> None:
    args = sys.argv[1:]
    port = DEFAULT_PORT
    host = DEFAULT_HOST
    clean_mode = False
    data_file: Optional[str] = None
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
    global _clean_cache, _data_file
    _clean_cache = clean_mode
    _data_file = data_file
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"[START] star_graph server running at http://{host}:{port}/")
    print(f"[INFO] cover proxy endpoint: http://{host}:{port}{PROXY_PATH}?url=...")
    if data_file:
        print(f"[INFO] serving data file as /{DATA_ALIAS}: {data_file}")
    if clean_mode:
        print("[INFO] clean mode: browser + disk cover cache will be cleared")
        if os.path.isdir(COVER_CACHE_DIR):
            for f in os.listdir(COVER_CACHE_DIR):
                os.remove(os.path.join(COVER_CACHE_DIR, f))
            print("[INFO] cover disk cache cleared")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[STOP] server stopped")


if __name__ == "__main__":
    main()
