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

### 服务器参数

```bash
python server.py [--data 文件] [--mode enhanced|upstream] [端口] [host] [clean]
```

- **默认**：`python server.py`，服务根目录的 `graph.json`
- **`--data 文件`**：把指定数据文件映射为 `/graph.json` 加载，下载的 release 资产免改名
- **端口 / host**：`python server.py 8080 0.0.0.0`
- **`--mode enhanced`**：增强模式（默认），支持本地 covers 保存、焦点反代懒加载和后台批量保存
- **`--mode upstream`**：上游兼容模式，只提供静态文件与 `/cover_proxy` 反代，不保存本地封面
- **`clean`**：清理兼容缓存标记

### 封面尺寸

修改 `server.py` 顶部的 `COVER_SIZE`，然后用 `python server.py clean` 启动一次以清缓存重下。

## 声明

- 本项目的图数据来源于 MC 百科（mcmod.cn）公开页面，抓取日期见各 Release 说明。
- 模组信息与封面图片的版权归原作者及 MC 百科所有。
- 本项目仅用于学习研究，请勿用于商业用途。
