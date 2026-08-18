// scripts/prepare-thumbs.mjs
// 从 covers/ 的原图生成 96x96 展示缩略图到 covers/small/，供前端视口懒加载
// 使用（WebGL 纹理内存约缩小 16 倍；配合懒加载，显存只随可见节点走）。
// 原图 covers/*.jpg 保留不动（导出大图用）。
// 输出 covers/small-manifest.json：{ keys, items: { key: { path, orig, bytes } } }
//
// 转换器（环境变量 THUMB_CONVERTER 可注入带 {in} {out} 占位符的命令模板）：
//   默认按 magick → convert（ImageMagick）→ ffmpeg 顺序探测（CI runner 均预装）。
//   本地测试：THUMB_CONVERTER="node scripts/thumb-stub.mjs {in} {out}" 桩复制。
import { access, mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileP = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const coversDir = path.join(root, "covers");
const smallDir = path.join(coversDir, "small");
const manifestPath = path.join(coversDir, "manifest.json");
const smallManifestPath = path.join(coversDir, "small-manifest.json");
const size = Math.max(16, Number.parseInt(process.env.THUMB_SIZE || "96", 10) || 96);
const concurrency = Math.max(1, Number.parseInt(process.env.THUMB_CONCURRENCY || "8", 10) || 8);
const refreshAll = /^(1|true|yes)$/i.test(process.env.THUMB_REFRESH || "");
const sizeArg = `${size}x${size}`;

async function findConverter() {
  if (process.env.THUMB_CONVERTER) return process.env.THUMB_CONVERTER;
  const probes = [
    ["magick", `magick {in} -resize ${sizeArg} {out}`],
    ["convert", `convert {in} -resize ${sizeArg} {out}`],
    ["ffmpeg", `ffmpeg -y -loglevel error -i {in} -vf scale=${sizeArg} -frames:v 1 {out}`],
  ];
  for (const [bin, tpl] of probes) {
    try {
      await execFileP(bin, ["-version"], { timeout: 15000 });
      return tpl;
    } catch {
      /* 非可用工具，继续探测 */
    }
  }
  return null;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function statOrNull(file) {
  try {
    return await stat(file);
  } catch {
    return null;
  }
}

const template = await findConverter();
if (!template) {
  throw new Error("未找到可用的缩略图转换器（magick/convert/ffmpeg）；请安装其一或设置 THUMB_CONVERTER");
}

let manifest = { keys: [] };
try {
  manifest = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {
  // 无封面清单（没有核心节点封面），直接结束
  console.log("[thumbs] 无 covers/manifest.json，跳过");
  process.exit(0);
}
const keys = Array.isArray(manifest.keys) ? manifest.keys : [];
if (!keys.length) {
  console.log("[thumbs] 清单为空，跳过");
  process.exit(0);
}

let previous = {};
try {
  previous = JSON.parse(await readFile(smallManifestPath, "utf8"));
} catch {
  // 首次生成
}
const prevItems = previous.items && typeof previous.items === "object" ? previous.items : {};

await mkdir(smallDir, { recursive: true });

const pending = [];
for (const key of keys) {
  const src = path.join(coversDir, `${key}.jpg`);
  const dst = path.join(smallDir, `${key}.png`);
  const stSrc = await statOrNull(src);
  if (!stSrc) continue;
  const stDst = await statOrNull(dst);
  const old = prevItems[key];
  // 缓存命中：缩略图存在且不旧于原图，且路径未变
  if (!refreshAll && old && old.path && stDst && stDst.mtimeMs >= stSrc.mtimeMs) {
    continue;
  }
  pending.push({ key, src, dst });
}

let converted = 0;
let failed = 0;
let cursor = 0;
async function worker() {
  while (cursor < pending.length) {
    const job = pending[cursor++];
    const cmd = template.replaceAll("{in}", job.src).replaceAll("{out}", job.dst);
    const parts = cmd.split(" ");
    try {
      await execFileP(parts[0], parts.slice(1), { timeout: 30000 });
      converted += 1;
    } catch (e) {
      failed += 1;
      console.warn(`[thumbs] 失败 ${job.key}: ${e.message}`);
    }
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, Math.max(1, pending.length)) }, worker));

const items = {};
for (const key of keys) {
  const st = await statOrNull(path.join(smallDir, `${key}.png`));
  if (st) {
    items[key] = { path: `covers/small/${key}.png`, orig: `covers/${key}.jpg`, bytes: st.size };
  }
}
const outKeys = Object.keys(items).sort((a, b) => Number(a) - Number(b));
await writeFile(
  smallManifestPath,
  JSON.stringify(
    { schema: 1, generatedAt: new Date().toISOString(), size, total: outKeys.length, keys: outKeys, items },
    null,
    2,
  ) + "\n",
  "utf8",
);
console.log(
  `[thumbs] ready ${outKeys.length}/${keys.length} (${converted} converted, ${failed} failed, ${
    outKeys.length - converted - failed
  } cached) -> ${smallManifestPath}`,
);