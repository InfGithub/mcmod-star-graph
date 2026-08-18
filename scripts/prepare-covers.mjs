import { mkdir, readFile, writeFile, readdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const graphPath = path.join(root, "graph.json");
const coversDir = path.join(root, "covers");
const limit = Math.max(0, Number.parseInt(process.env.COVER_LIMIT || "0", 10) || 0);
const concurrency = Math.max(1, Number.parseInt(process.env.COVER_CONCURRENCY || "12", 10) || 12);
const retries = Math.max(0, Number.parseInt(process.env.COVER_RETRIES || "2", 10) || 2);
const timeoutMs = Math.max(1000, Number.parseInt(process.env.COVER_TIMEOUT_MS || "20000", 10) || 20000);

const graph = JSON.parse(await readFile(graphPath, "utf8"));
const nodes = graph.nodes
  .filter((node) => node.type === "core" && node.cover_url)
  .sort((a, b) => (b.views || 0) - (a.views || 0));
const selected = limit > 0 ? nodes.slice(0, limit) : nodes;

await mkdir(coversDir, { recursive: true });

// Remove old generated images so a lower COVER_LIMIT cannot leave stale files in the deploy artifact.
for (const name of await readdir(coversDir)) {
  if (/^\d+\.jpg$/i.test(name)) await unlink(path.join(coversDir, name));
}

function normalizeUrl(value) {
  let url = String(value).trim();
  if (url.startsWith("//")) url = `https:${url}`;
  // Request a square thumbnail where the source supports MC百科's size suffix.
  return url.replace(/@\d+x\d+\.jpg$/i, "@300x300.jpg");
}

async function download(node) {
  const url = normalizeUrl(node.cover_url);
  let lastError = "unknown error";
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "mcmod-star-graph static cover builder",
          Referer: "https://www.mcmod.cn/",
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) throw new Error(`unexpected content-type: ${contentType}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 100) throw new Error("empty image response");
      await writeFile(path.join(coversDir, `${node.key}.jpg`), bytes);
      return { key: String(node.key), ok: true };
    } catch (error) {
      lastError = error?.message || String(error);
      if (attempt < retries) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    } finally {
      clearTimeout(timer);
    }
  }
  console.warn(`[cover] skip ${node.key}: ${lastError}`);
  return { key: String(node.key), ok: false };
}

let cursor = 0;
let completed = 0;
const successful = [];
async function worker() {
  while (true) {
    const index = cursor++;
    if (index >= selected.length) return;
    const result = await download(selected[index]);
    if (result.ok) successful.push(result.key);
    completed += 1;
    if (completed % 100 === 0 || completed === selected.length) {
      console.log(`[cover] ${completed}/${selected.length}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, selected.length) }, worker));

successful.sort((a, b) => Number(a) - Number(b));
await writeFile(
  path.join(coversDir, "manifest.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), limit, total: selected.length, keys: successful }, null, 2)}\n`,
  "utf8",
);
console.log(`[cover] generated ${successful.length}/${selected.length} static covers`);
