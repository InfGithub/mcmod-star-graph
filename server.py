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


class Handler(SimpleHTTPRequestHandler):
    """静态文件（继承 SimpleHTTPRequestHandler，自带目录穿越防护）+ /cover_proxy 代理。"""

    def do_GET(self):
        parsed = urllib.parse.urlsplit(self.path)
        if parsed.path == PROXY_PATH:
            self._handle_proxy(parsed)
        elif parsed.path == CLEAN_PATH:
            self._handle_clean()
        elif _DATA_FILE and parsed.path == "/" + DATA_ALIAS:
            self._handle_data()
        else:
            super().do_GET()

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
        # 真实浏览器 UA（前端传 navigator.userAgent）：版本/平台永远真实，
        # 避免固定 UA 版本号过时被 WAF 识别为伪造；非法或缺省回退默认 UA
        ua = qs.get("ua", [""])[0]
        if not ua or len(ua) > 512 or "\r" in ua or "\n" in ua:
            ua = USER_AGENT
        # 按 COVER_SIZE 构造缩略图（@170x115.jpg → @300x300.jpg；无后缀的老封面原样转发）
        url = re.sub(r"@\d+x\d+\.jpg$", "@{}x{}.jpg".format(COVER_SIZE, COVER_SIZE), url)
        req = urllib.request.Request(url, headers={"User-Agent": ua, "Referer": REFERER})
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
