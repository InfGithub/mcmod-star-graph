# mcmod-star-graph

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-222?logo=github)
![JavaScript ES2020](https://img.shields.io/badge/JavaScript-ES2020-yellow)

NeoForge 1.21.1 模组生态关系图。数据来自 MC 百科（mcmod.cn），仅用于学习研究。

## 在线静态站点

本项目已改造成**无后端 GitHub Pages 站点**：

- 图数据直接读取仓库中的 `graph.json`
- 封面由 GitHub Actions 在部署前预生成到 `covers/`
- 页面只请求 GitHub Pages 同源静态资源，不依赖 `/cover_proxy`、Python 服务或运行时跨域下载
- 某个封面下载失败时，该节点自动回退为彩色圆点，图谱仍可正常使用

部署地址：<https://huntersxy.github.io/mcmod-star-graph/>

## GitHub Pages 部署

推送到 `main` 分支会触发 `.github/workflows/deploy-pages.yml`：

1. 安装 Node.js 依赖并构建 `main.bundle.js`
2. 从 `graph.json` 读取封面 URL，下载静态封面到 `covers/`
3. 生成 `covers/manifest.json`
4. 使用 GitHub Pages artifact 部署整个静态站点

也可以在 Actions 页面手动运行工作流，通过 `cover_limit` 控制封面数量；`0` 表示下载全部封面。封面下载失败不会使部署失败，便于在源站限流时仍发布可用的图谱。

> 首次启用时，请在仓库 Settings → Pages → Build and deployment 中将 Source 设为 **GitHub Actions**。

## 本地预览

```bash
npm ci
npm run build
npm run prepare:covers       # 可选；下载全部封面
python -m http.server 1119   # GitHub Pages 同样的静态服务方式
```

然后打开 <http://127.0.0.1:1119/>。如果只想快速预览图谱而不下载封面，直接创建一个空的 `covers/manifest.json` 即可，节点会使用纯色回退样式。

可用环境变量限制本地预生成规模：

```bash
$env:COVER_LIMIT=200
npm run prepare:covers
```

## 开发

```bash
npm ci
npm run build
```

`server.py` 保留为旧版本地封面代理/数据映射工具，不再是 GitHub Pages 部署的一部分。

## 数据

`graph.json` 是静态发布数据包，包含节点坐标、关系、统计信息和原始封面 URL。更新数据后重新运行 GitHub Actions 即可发布新版本。
