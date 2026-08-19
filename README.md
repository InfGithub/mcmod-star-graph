# mcmod-star-graph

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Python 3.8+](https://img.shields.io/badge/Python-3.8%2B-blue)
![JavaScript ES2020](https://img.shields.io/badge/JavaScript-ES2020-yellow)

数据来源：MC 百科（mcmod.cn），仅用于学习研究。

## 快速开始

1. 从 [Releases](https://github.com/InfGithub/mcmod-star-graph/releases) 下载最新数据包 `graph-YYYYMMDD.json`，放入项目根目录
2. 启动本地服务器：
   ```bash
   python server.py --data graph-YYYYMMDD.json
   ```
3. 浏览器打开 <http://127.0.0.1:1119/>

首次打开需下载模组封面：点击"确定下载"，封面将缓存到浏览器 IndexedDB，下次无需重复下载。

## 用法

### 封面缓存（本地化）

- 封面缓存存在项目根目录 `covers/`（key.jpg），**不依赖浏览器 IndexedDB**。
- 首次启动：浏览器 IndexedDB 存量自动迁移到 `covers/`（幂等，只补缺失）。
- 增量下载：`GET /cover/<key>` 本地命中直接返回；未命中才代理抓取 mcmod 并落盘。
- 新数据缺的封面只需下载差异部分；换浏览器/清缓存不影响本地缓存。

## 渲染优化（封面纹理按需加载）

- 节点默认以 circle 轻量渲染，**不再一次性加载全部封面纹理**（旧版 1.1 万张纹理会把浏览器渲染进程压崩）。
- 相机缩放驱动：缩小时全部圆点；放大后视口内节点按 size 取前 N 切换封面纹理，N 随缩放深度自适应（`IMAGE_RATIO_MIN`→500，`IMAGE_RATIO_DEEP`→`IMAGE_MAX_NODES_DEEP` 3000）。
- 缩小不消失：rank 靠后节点淡化（`NODE_DIM_ALPHA`=0.18）而非完全隐藏。
- 边去重：相同 source+target+kind 只保留一条（原数据含 4300+ 重复边）。
- 常量均在 main.js 顶部。

## 服务器参数

```bash
python server.py [--data 文件] [端口] [host] [clean]
```

- **默认**：`python server.py`，服务根目录的 `graph.json`
- **`--data 文件`**：把指定数据文件映射为 `/graph.json` 加载，下载的 release 资产免改名
- **端口 / host**：`python server.py 8080 0.0.0.0`
- **`clean`**：清空浏览器封面缓存

### 封面尺寸

修改 `server.py` 顶部的 `COVER_SIZE`，然后用 `python server.py clean` 启动一次以清缓存重下。

## 声明

- 本项目的图数据来源于 MC 百科（mcmod.cn）公开页面，抓取日期见各 Release 说明。
- 模组信息与封面图片的版权归原作者及 MC 百科所有。
- 本项目仅用于学习研究，请勿用于商业用途。
