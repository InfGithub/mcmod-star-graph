// scripts/thumb-stub.mjs — 本地测试用桩转换器：直接把原图复制为“缩略图”。
// 仅验证管线和清单逻辑，不产生真实缩放。用法：
//   THUMB_CONVERTER="node scripts/thumb-stub.mjs {in} {out}" node scripts/prepare-thumbs.mjs
import { copyFile } from "node:fs/promises";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error("usage: node scripts/thumb-stub.mjs <in> <out>");
  process.exit(1);
}
await copyFile(input, output);
console.log(`[stub] ${input} -> ${output}`);