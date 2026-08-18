// scripts/merge-release-graphs.mjs
// 从上游 InfGithub/mcmod-star-graph 的 Releases 拉取全部 graph-*.json 资产，
// 合并为并集（节点按 key、边按 source+target+type 去重，最新版本信息优先），
// 写入仓库根目录 graph.json 供封面预生成与前端使用。
//
// 缓存：下载的资产暂存于 release-cache/（跨构建由 GitHub Actions cache 持久化，
// 键 = 全部资产名集合的哈希），已缓存的资产不重复下载；过期资产自动清理。
//
// 环境变量：
//   GH_TOKEN       GitHub API 令牌（CI 中由 GITHUB_TOKEN 自动注入，提高限流配额）
//   MERGE_API_URL  覆盖 releases 列表 API 地址（本地测试用）
import { access, mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cacheDir = path.join(root, "release-cache");
const outPath = path.join(root, "graph.json");
const OWNER = "InfGithub";
const REPO = "mcmod-star-graph";
const API_URL =
  process.env.MERGE_API_URL ||
  `https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=100`;
const HEADERS = {
  "User-Agent": "mcmod-star-graph merge builder",
  Accept: "application/vnd.github+json",
  ...(process.env.GH_TOKEN ? { Authorization: `Bearer ${process.env.GH_TOKEN}` } : {}),
};

async function listReleases() {
  const res = await fetch(API_URL, { headers: HEADERS });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${API_URL}`);
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error(`GitHub API 返回异常: ${JSON.stringify(data).slice(0, 200)}`);
  return data;
}

async function ensureAsset(url, name) {
  const file = path.join(cacheDir, name);
  try {
    await access(file);
    return file;
  } catch {
    /* 未缓存，下载 */
  }
  console.log(`[merge] download ${name}`);
  const res = await fetch(url, { headers: { "User-Agent": "mcmod-star-graph merge builder" } });
  if (!res.ok) throw new Error(`download ${name} HTTP ${res.status}`);
  await writeFile(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

// 数字/字母混合 key 的整体比较（稳定排序，非纯数字也能处理）
function cmpKeys(a, b) {
  return a.length - b.length || (a < b ? -1 : a > b ? 1 : 0);
}

const releases = await listReleases();
// 收集全部 graph-*.json 资产，按发布时间倒序（最新在前）
const items = [];
for (const r of releases) {
  for (const a of r.assets || []) {
    if (/^graph-.*\.json$/.test(a.name)) {
      items.push({
        tag: r.tag_name,
        name: a.name,
        url: a.browser_download_url,
        published: r.published_at || "",
      });
    }
  }
}
// 旧 → 新排序（同时间按资产名兜底，保证确定性）；合并时后写的覆盖先写的
items.sort(
  (a, b) =>
    (a.published < b.published ? -1 : a.published > b.published ? 1 : 0) ||
    a.name.localeCompare(b.name),
);
if (!items.length) throw new Error("上游 Releases 没有 graph-*.json 资产");

await mkdir(cacheDir, { recursive: true });
// 清理缓存中已不再发布的旧资产
const wanted = new Set(items.map((i) => i.name));
for (const name of await readdir(cacheDir)) {
  if (!wanted.has(name)) {
    try {
      await unlink(path.join(cacheDir, name));
    } catch {
      /* 忽略清理失败 */
    }
  }
}

// 并集 + 新覆盖旧：旧→新顺序遍历；重复的节点（按 key）/边（按 source+target+type）
// 以最新 release 的详细信息逐字段覆盖旧值，新数据未提供的字段沿用旧值；
// 仅存在于旧发行版的节点/边原样保留（并集语义）。
const nodes = new Map();
const edges = new Map();
for (const item of items) {
  const file = await ensureAsset(item.url, item.name);
  const g = JSON.parse(await readFile(file, "utf8"));
  for (const n of g.nodes || []) {
    const key = String(n.key);
    const prev = nodes.get(key);
    nodes.set(key, prev ? { ...prev, ...n } : n);
  }
  for (const e of g.edges || []) {
    const id = `${e.source}\u0000${e.target}\u0000${e.type}`;
    const prev = edges.get(id);
    edges.set(id, prev ? { ...prev, ...e } : e);
  }
}

const mergedNodes = [...nodes.values()].sort((a, b) => cmpKeys(String(a.key), String(b.key)));
const mergedEdges = [...edges.values()].sort(
  (a, b) => cmpKeys(String(a.source), String(b.source)) || cmpKeys(String(a.target), String(b.target)),
);
const graph = {
  meta: {
    source: `https://github.com/${OWNER}/${REPO}/releases`,
    mergedFrom: items.map((i) => i.name),
    nodeCount: mergedNodes.length,
    edgeCount: mergedEdges.length,
    mergedAt: new Date().toISOString(),
  },
  nodes: mergedNodes,
  edges: mergedEdges,
};
await writeFile(outPath, JSON.stringify(graph), "utf8");
console.log(
  `[merge] ready ${outPath}: ${mergedNodes.length} nodes, ${mergedEdges.length} edges, merged ${items.length} releases (${items.map((i) => i.name).join(", ")})`,
);