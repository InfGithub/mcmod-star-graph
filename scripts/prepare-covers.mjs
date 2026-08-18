// scripts/prepare-covers.mjs
// CI 步骤：从 graph.json 提取核心节点的封面 URL，下载缩略图到 covers/，
// 生成 covers/manifest.json 供前端静态加载。
// 缓存策略：manifest 记录每个 key 的来源 URL，URL 未变且文件存在则复用
// （跨构建由 GitHub Actions cache 持久化 covers/ 目录）。
// 用法：COVER_LIMIT=50 COVER_CONCURRENCY=12 node scripts/prepare-covers.mjs
import { access, mkdir, readFile, writeFile, readdir, unlink, rename, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const graphPath = path.join(root, "graph.json");
const coversDir = path.join(root, "covers");
const limit = Math.max(0, Number.parseInt(process.env.COVER_LIMIT || "0", 10) || 0);
const concurrency = Math.max(1, Number.parseInt(process.env.COVER_CONCURRENCY || "12", 10) || 12);
const retries = Math.max(0, Number.parseInt(process.env.COVER_RETRIES || "2", 10) || 2);
const refreshAll = /^(1|true|yes)$/i.test(process.env.COVER_REFRESH_ALL || "");

const graph = JSON.parse(await readFile(graphPath, "utf8"));
const nodes = (graph.nodes || [])
  .filter((n) => n.type === "core" && n.cover_url)
  .sort((a, b) => (b.views || 0) - (a.views || 0));
const selected = limit > 0 ? nodes.slice(0, limit) : nodes;

await mkdir(coversDir, { recursive: true });

let previous = {};
try {
  previous = JSON.parse(await readFile(path.join(coversDir, "manifest.json"), "utf8"));
} catch {
  // 首次运行或缓存为空
}
const previousItems = previous.items && typeof previous.items === "object" ? previous.items : {};
const legacyKeys = new Set(Array.isArray(previous.keys) ? previous.keys.map(String) : []);

// 请求方正的 300x300 缩略图（MC 百科 CDN 支持尺寸后缀）
function thumbnailUrl(value) {
  let url = String(value).trim();
  if (url.startsWith("//")) url = "https:" + url;
  return url.replace(/@\d+x\d+\.jpg$/i, "@300x300.jpg");
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

const selectedKeys = new Set(selected.map((n) => String(n.key)));
// 清理不再需要的封面文件，避免缩小 COVER_LIMIT 后旧资产泄漏进站点
for (const name of await readdir(coversDir)) {
  if (/^\d+\.jpg$/i.test(name) && !selectedKeys.has(name.slice(0, -4))) {
    await unlink(path.join(coversDir, name));
  }
}

const reusable = new Map();
const pending = [];
for (const node of selected) {
  const key = String(node.key);
  const url = thumbnailUrl(node.cover_url);
  const old = previousItems[key];
  const sameSource = old && old.url ? old.url === url : legacyKeys.has(key);
  const file = path.join(coversDir, `${key}.jpg`);
  if (!refreshAll && sameSource && (await exists(file))) {
    reusable.set(key, { url, bytes: (await stat(file)).size });
  } else {
    pending.push({ key, url });
  }
}

console.log(`[covers] reuse ${reusable.size}/${selected.length}, pending ${pending.length}`);

async function download(item) {
  const file = path.join(coversDir, `${item.key}.jpg`);
  const temp = `${file}.tmp`;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const resp = await fetch(item.url, {
        headers: {
          "User-Agent": "mcmod-star-graph cover builder",
          Referer: "https://www.mcmod.cn/",
        },
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const type = resp.headers.get("content-type") || "";
      if (!type.startsWith("image/")) throw new Error(`not image: ${type}`);
      const bytes = Buffer.from(await resp.arrayBuffer());
      if (bytes.length < 100) throw new Error("empty image");
      await writeFile(temp, bytes);
      try {
        await unlink(file);
      } catch {
        /* 首次下载，文件不存在 */
      }
      await rename(temp, file);
      return { url: item.url, bytes: bytes.length };
    } catch (error) {
      try {
        await unlink(temp);
      } catch {
        /* 无残留 */
      }
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
    }
  }
  console.warn(`[covers] skip ${item.key}`);
  return null;
}

let cursor = 0;
const downloaded = new Map();
const workers = Array.from(
  { length: Math.min(concurrency, Math.max(1, pending.length)) },
  async () => {
    while (cursor < pending.length) {
      const item = pending[cursor++];
      const result = await download(item);
      if (result) downloaded.set(item.key, result);
    }
  },
);
await Promise.all(workers);

const items = {};
for (const node of selected) {
  const key = String(node.key);
  const item = reusable.get(key) || downloaded.get(key);
  if (item) items[key] = { url: item.url, path: `covers/${key}.jpg`, bytes: item.bytes };
}
const keys = Object.keys(items).sort((a, b) => Number(a) - Number(b));
await writeFile(
  path.join(coversDir, "manifest.json"),
  `${JSON.stringify(
    {
      schema: 2,
      generatedAt: new Date().toISOString(),
      limit,
      total: selected.length,
      reused: reusable.size,
      downloaded: downloaded.size,
      refreshAll,
      keys,
      items,
    },
    null,
    2,
  )}\n`,
  "utf8",
);
console.log(`[covers] ready ${keys.length}/${selected.length} (${reusable.size} reused, ${downloaded.size} downloaded)`);