# mcmod-star-graph

NeoForge 1.21.1 模组生态关系图：7245 个模组、8166 条依赖边、5018 条联动边。
基于 sigma.js + graphology 渲染，支持搜索、右键关系浏览、六度分隔、超大图导出。

数据来源：MC 百科（mcmod.cn），仅用于学习研究。

## 快速开始

1. 从 [Releases](https://github.com/InfGithub/mcmod-star-graph/releases) 下载最新数据包（`graph-YYYYMMDD.json`），放入项目根目录，重命名为 `graph.json`（或用 `?data=graph-YYYYMMDD.json` 参数加载，免改名）
2. 启动本地服务器：
   ```bash
   python server.py          # 127.0.0.1:1119
   ```
3. 浏览器打开 <http://127.0.0.1:1119/>

首次打开需下载模组封面（强制）：点击"确定下载"，封面将缓存到浏览器 IndexedDB，下次无需重复下载。

## 常见操作

| 操作 | 说明 |
|------|------|
| 调整封面清晰度 | 修改 `server.py` 的 `COVER_SIZE`（默认 300），然后 `python server.py clean` 清缓存重下 |
| 服务器参数 | `python server.py [端口] [host]`，如 `python server.py 8080 0.0.0.0` |
| 节点/边 LoD | 侧边栏两个滑块分别控制显隐密度（0 = 全量渲染） |

## 开发

```bash
npm install
npm run build    # esbuild → main.bundle.js
```

## 协议

[MIT](LICENSE)
