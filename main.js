/*
 * star_graph/main.js - NeoForge 1.21.1 生态关系图前端
 *
 * 基于 sigma.js v3 + graphology，数据来自 graph.json（GitHub Releases 分发）。
 * 封面通过 /cover_proxy 同源代理下载（绕过 CDN 防盗链），缓存到 IndexedDB，
 * 以 blob URL 渲染并用于 PNG 导出（避免 canvas 污染）。
 *
 * 构建：npm run build（esbuild → main.bundle.js），需先 npm install。
 * 运行：python server.py，然后访问 http://127.0.0.1:1119/
 */
import Graph from "graphology";
import Sigma from "sigma";
import { createNodeImageProgram } from "@sigma/node-image";

// 支持封面透明度淡入淡出的图像节点程序。
// sigma 使用预乘 alpha 混合（blendFunc(ONE, ONE_MINUS_SRC_ALPHA)），
// 因此颜色 RGB 必须先乘以 alpha，否则降低 alpha 会变成加色混合（变亮）而不是变透明。
// 纹理强制 max 128px：封面以 128px 入图集（每图集约 961 张），
// 避免封面多时图集数超 WebGL MAX_TEXTURE_IMAGE_UNITS(16)；导出用原始 blob 不受影响。
let FadingNodeImageProgram = null;
try {
  FadingNodeImageProgram = class FadingNodeImageProgram extends createNodeImageProgram({
    size: { mode: "max", value: 128 },
  }) {
  getDefinition() {
    const def = super.getDefinition();
    def.FRAGMENT_SHADER_SOURCE = def.FRAGMENT_SHADER_SOURCE
      // 封面默认 alpha 取 max(texel.a, v_color.a)，会强制不透明，改成跟随 v_color.a 才能淡出
      .replace("max(texel.a, v_color.a)", "v_color.a")
      // 在裁剪前统一预乘，覆盖「无纹理 / 纹理缺失 / 正常贴图」所有分支
      .replace(
        "  #endif\n\n  // Crop in a circle when u_keepWithinCircle is truthy:",
        "  color.rgb *= v_color.a;\n  #endif\n\n  // Crop in a circle when u_keepWithinCircle is truthy:"
      );
    return def;
  }
  };
} catch (e) {
  console.warn("[警告] WebGL 初始化失败，封面纹理功能禁用（纯圆点模式）", e);
}

// 自定义节点标签绘制：支持 \n 换行（第一行名称，第二行 class id）。
// sigma 默认只在节点右上角画单行文字，这里按行拆分并围绕节点中心垂直居中。
function drawNodeLabel(context, data, settings) {
  if (!data.label) return;
  const lines = String(data.label).split("\n");
  const size = settings.labelSize;
  const weight = settings.labelWeight;
  const color = settings.labelColor.attribute
    ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000"
    : settings.labelColor.color;
  const lineHeight = size * 1.25;
  const x = data.x + data.size + 3;
  const totalHeight = lineHeight * lines.length;
  const firstBaseline = data.y - totalHeight / 2 + lineHeight / 2;
  context.font = weight + " " + size + "px " + settings.labelFont;
  context.textAlign = "left";
  context.textBaseline = "middle";

  // 半透明背景（让文字在深色图上可读）
  let maxWidth = 0;
  for (const line of lines) {
    maxWidth = Math.max(maxWidth, context.measureText(line).width);
  }
  const padX = size * 0.4;
  const padY = size * 0.25;
  const bx = x - padX;
  const by = data.y - totalHeight / 2 - padY;
  const bw = maxWidth + padX * 2;
  const bh = totalHeight + padY * 2;
  context.fillStyle = "rgba(0, 0, 0, 0.3)";
  context.fillRect(bx, by, bw, bh);

  context.fillStyle = color;
  for (let i = 0; i < lines.length; i++) {
    context.fillText(lines[i], x, firstBaseline + i * lineHeight);
  }
}

// 图数据路径固定为 graph.json；可用服务器参数 --data 映射其他文件（见 server.py）
const GRAPH_URL = "graph.json";

const PALETTE = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabed4",
  "#469990", "#dcbeff", "#9a6324", "#fffac8", "#800000",
  "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9",
];

const EXTERNAL_COLOR = "#9e9e9e";
const ISOLATED_COLOR = "#d6d6d6";
const EDGE_ALPHA = 0.3;
const DEPENDENCY_EDGE_RGB = [255, 182, 193];  // 依赖：粉
const INTERACTION_EDGE_RGB = [173, 216, 230]; // 联动：浅蓝
// sigma 是预乘 alpha 混合，颜色字符串的 RGB 必须先乘 alpha，否则会变亮
function premulRgba(rgb, alpha) {
  return (
    "rgba(" +
    Math.round(rgb[0] * alpha) +
    "," +
    Math.round(rgb[1] * alpha) +
    "," +
    Math.round(rgb[2] * alpha) +
    "," +
    alpha.toFixed(4) +
    ")"
  );
}
const DEPENDENCY_EDGE_COLOR = premulRgba(DEPENDENCY_EDGE_RGB, EDGE_ALPHA);
const INTERACTION_EDGE_COLOR = premulRgba(INTERACTION_EDGE_RGB, EDGE_ALPHA);

// 2D Canvas 用直通（非预乘）alpha；WebGL 才需要预乘
function rgbaString(rgb, alpha) {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")";
}

// 边 LoD：ratio 越大（缩到最小）阈值越高，只留骨干边
const LOD_MAX_THRESHOLD = 50;
const LOD_FULL_ZOOM_RATIO = 0.05;
const LOD_THROTTLE_MS = 33;
const NODE_LOD_MIN_VISIBLE = 1000;
const NODE_LOD_ENABLED = true;
// sigma 3 相机 ratio：大 = 缩小(全图)，小 = 放大(细节)。
// 封面纹理按需加载：ratio <= IMAGE_RATIO_MAX(初始视图及放大)才加载封面；
// 放大越深上限越高，深度放大(ratio<=IMAGE_RATIO_DEEP)上限 5000。
const IMAGE_RATIO_MAX = 0.95; // 缩小到接近全图即降回圆点(初始视图特判显示封面)
const IMAGE_RATIO_DEEP = 0.08;
const IMAGE_MAX_NODES = 500;
const IMAGE_MAX_NODES_DEEP = 6000;
// rank 靠后节点缩小时的淡化透明度（>0 表示可见但不消失）
const NODE_DIM_ALPHA = 0.18;
const NODE_DIAMETER_SCREEN_RATIO = 0.1; // 跳转后节点直径占屏幕宽度的比例
const LABEL_FONT_SIZE = 14; // 导出标签字号（固定，不随节点/图幅变化）
const HIGHLIGHT_NODE_COLOR = "#ffd700"; // 六度分隔路径高亮色（节点）
const HIGHLIGHT_EDGE_RGB = [255, 215, 0]; // 六度分隔路径高亮色（边）
const HIGHLIGHT_EDGE_COLOR = premulRgba(HIGHLIGHT_EDGE_RGB, 1.0);

// 封面：IndexedDB 缓存 + 强制下载门槛
const COVER_DB_NAME = "mcmod-graph-covers";
const COVER_STORE = "covers";
const COVER_CONCURRENCY = 4;    // 并发下载数(原20;高并发会打爆移动网络+触发 mcmod WAF)
const COVER_INTERVAL_MS = 200;  // 每个 worker 完成一张后的固定间隔
const COVER_RETRIES = 2;        // 每张失败后的额外重试次数
const COVER_PROXY = "/cover_proxy?url="; // 旧代理（兼容保留）
const COVER_BASE = "/cover/";            // 本地封面缓存：GET /cover/<key>
const STATUS_PATH = "/api/cache/status";   // 本地缓存统计
const IMPORT_PATH = "/api/cache/import/";  // 迁移写入：POST /api/cache/import/<key>

function communityColor(community, type) {
  if (type === "external") return EXTERNAL_COLOR;
  if (community < 0) return ISOLATED_COLOR;
  return PALETTE[community % PALETTE.length];
}

function nodeSize(inDegree, type) {
  // 半径 = 2 + sqrt(被依赖次数)，面积正比于评分
  const d = Math.max(0, inDegree || 0);
  const s = 2 + Math.sqrt(d);
  return type === "external" ? Math.min(s, 10) : Math.min(s, 48);
}

function formatNum(n) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  return String(n);
}

function formatDuration(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return s + "s";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + "m" + r + "s";
}

function edgeColorFor(rgb, alpha) {
  return premulRgba(rgb, EDGE_ALPHA * alpha);
}

function hexToRgba(hex, alpha, premul) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rr = premul ? Math.round(r * alpha) : r;
  const gg = premul ? Math.round(g * alpha) : g;
  const bb = premul ? Math.round(b * alpha) : b;
  return "rgba(" + rr + "," + gg + "," + bb + "," + alpha.toFixed(4) + ")";
}

async function loadGraph() {
  const res = await fetch(GRAPH_URL);
  if (!res.ok) throw new Error("加载 graph.json 失败: " + res.status);
  return res.json();
}

// 渲染侧边栏底部的图元数据面板（字段独立一行，值为 null 原样显示）
function renderMetaPanel(meta) {
  const el = document.getElementById("panel-meta");
  if (!el || !meta) return;
  const w = meta.weights || {};
  const rows = [
    ["版本", meta.mc_version],
    ["加载器", meta.api],
    ["节点", meta.node_count],
    ["依赖边", meta.dependency_edges],
    ["联动边", meta.interaction_edges],
    ["社区", meta.community_count],
    ["连通分量", meta.component_count],
    ["生成时间", meta.generated_at],
    ["布局", meta.layout],
    ["依赖权重", w.dependency],
    ["联动权重", w.interaction],
    ["数据源", meta.source_db],
  ];
  const html =
    '<div class="meta-title">图元数据</div>' +
    rows
      .map((row) => '<div class="meta-row"><span>' + row[0] + "</span><b>" + String(row[1]) + "</b></div>")
      .join("");
  el.innerHTML = html;
}

// ==================== 封面：IndexedDB 缓存 + 强制下载 ====================

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function openCoverDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(COVER_DB_NAME, 2);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(COVER_STORE)) {
        db.createObjectStore(COVER_STORE); // key = class_id
      } else {
        // 版本 1 → 2：旧数据是纯 blob，无 url 字段可校验，作废重下
        req.transaction.objectStore(COVER_STORE).clear();
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbGet(db, key) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(COVER_STORE, "readonly").objectStore(COVER_STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(db, key, value) {
  return new Promise((resolve, reject) => {
    const req = db.transaction(COVER_STORE, "readwrite").objectStore(COVER_STORE).put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function idbClear(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(COVER_STORE, "readwrite");
    tx.objectStore(COVER_STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// 协议补全（尺寸由后端 COVER_SIZE 控制，见 server.py）
function normalizeCoverUrl(url) {
  if (!url) return null;
  let u = String(url).trim();
  if (u.startsWith("//")) u = "https:" + u;
  return u;
}

// 读取全部封面缓存并校验 URL；返回 { blobUrls, staleKeys }
// staleKeys：缺失或 URL 已变化的条目（需重新下载）
async function loadAllCovers(db, items) {
  const blobUrls = new Map();
  const staleKeys = [];
  for (const item of items) {
    try {
      const entry = await idbGet(db, item.key);
      if (entry && entry.url === item.url && entry.blob) {
        blobUrls.set(item.key, URL.createObjectURL(entry.blob));
      } else {
        staleKeys.push(item.key);
      }
    } catch (e) { staleKeys.push(item.key); }
  }
  return { blobUrls, staleKeys };
}

// 清理当前图不需要的缓存条目（旧图残留）
function purgeStaleKeys(db, items) {
  return new Promise((resolve, reject) => {
    const keep = new Set(items.map((it) => it.key));
    const tx = db.transaction(COVER_STORE, "readwrite");
    const store = tx.objectStore(COVER_STORE);
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        if (!keep.has(cursor.key)) cursor.delete();
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// 并发下载封面，每张重试 COVER_RETRIES 次；返回 { failed, failedKeys, errors }
async function downloadCovers(db, items, onProgress) {
  let idx = 0;
  let done = 0;
  let failed = 0;
  const failedKeys = [];
  const errors = [];

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const item = items[i];
      let ok = false;
      let lastErr = "";
      for (let attempt = 0; attempt <= COVER_RETRIES && !ok; attempt++) {
        try {
          const resp = await fetch(COVER_PROXY + encodeURIComponent(item.url));
          if (!resp.ok) throw new Error("HTTP " + resp.status);
          const blob = await resp.blob();
          await idbPut(db, item.key, { url: item.url, blob });
          ok = true;
        } catch (e) {
          lastErr = String((e && e.message) || e);
          if (!ok && attempt < COVER_RETRIES) {
            await sleep(300 * (attempt + 1));
          }
        }
      }
      if (!ok) {
        failed++;
        failedKeys.push(item.key);
        errors.push({ key: item.key, url: item.url, error: lastErr });
        console.error("[错误] 封面下载失败", item.key, lastErr, item.url);
      }
      done++;
      if (onProgress) onProgress(done, items.length, failed);
      await sleep(COVER_INTERVAL_MS);
    }
  }

  const workers = [];
  for (let w = 0; w < COVER_CONCURRENCY; w++) workers.push(worker());
  await Promise.all(workers);
  return { failed, failedKeys, errors };
}

// 强制下载门槛 modal（下载 downloadItems 差异部分，完成后加载 allItems 全量）。
// resolve({ blobUrls }) 表示可进入星图。
function showCoverModal(db, downloadItems, allItems) {
  return new Promise((resolve) => {
    const coverByKey = new Map(downloadItems.map((it) => [it.key, it.url]));

    const modal = document.createElement("div");
    modal.className = "cover-modal";
    modal.innerHTML =
      '<div class="cover-box">' +
      '  <div class="cover-head">' +
      '    <span class="cover-title"></span>' +
      '    <button class="cover-close" title="拒绝下载">×</button>' +
      "  </div>" +
      '  <div class="cover-desc"></div>' +
      '  <div class="cover-progress hidden">' +
      '    <div class="cover-track"><div class="cover-fill"></div></div>' +
      '    <div class="cover-label"></div>' +
      "  </div>" +
      '  <div class="cover-actions">' +
      '    <button class="cover-btn primary"></button>' +
      '    <button class="cover-btn ghost hidden"></button>' +
      "  </div>" +
      "</div>";
    document.body.appendChild(modal);

    const titleEl = modal.querySelector(".cover-title");
    const descEl = modal.querySelector(".cover-desc");
    const closeEl = modal.querySelector(".cover-close");
    const progressEl = modal.querySelector(".cover-progress");
    const fillEl = modal.querySelector(".cover-fill");
    const labelEl = modal.querySelector(".cover-label");
    const primaryBtn = modal.querySelector(".cover-btn.primary");
    const ghostBtn = modal.querySelector(".cover-btn.ghost");

    let state = "confirm";
    let pending = downloadItems.slice();
    let doneCount = 0;
    let failedCount = 0;
    let failedKeys = [];
    let failErrors = [];
    let elapsedStart = 0;

    function showState() {
      closeEl.classList.toggle("hidden", state !== "confirm");
      progressEl.classList.toggle("hidden", state !== "downloading");
      ghostBtn.classList.toggle("hidden", state !== "failed");
      if (state === "confirm") {
        titleEl.textContent = "下载封面";
        descEl.textContent =
          "本图需要下载 " + downloadItems.length + " 张模组封面才能正常使用。" +
          "封面将缓存到浏览器本地，下次打开无需重复下载。";
        primaryBtn.textContent = "确定下载";
        primaryBtn.classList.remove("hidden");
      } else if (state === "refuse") {
        titleEl.textContent = "未下载封面";
        descEl.textContent = "封面是本图的核心视觉元素，未下载无法使用。";
        primaryBtn.textContent = "重新下载封面";
        primaryBtn.classList.remove("hidden");
      } else if (state === "downloading") {
        titleEl.textContent = "正在下载封面";
        descEl.textContent = "下载完成后自动进入星图。";
        primaryBtn.classList.add("hidden");
        updateProgress();
      } else if (state === "failed") {
        titleEl.textContent = "部分封面下载失败";
        const reasons = Array.from(new Set(failErrors.map((e) => e.error))).slice(0, 3);
        let desc =
          failedCount + " 张封面未能下载（模组可能已删除或网络错误）。";
        if (reasons.length) desc += "\n原因：" + reasons.join("；");
        descEl.textContent = desc;
        primaryBtn.textContent = "进入图";
        primaryBtn.classList.remove("hidden");
        ghostBtn.textContent = "重试下载";
      }
    }

    function updateProgress() {
      const total = pending.length;
      const pct = total ? Math.round((doneCount / total) * 100) : 100;
      fillEl.style.width = pct + "%";
      const elapsed = (Date.now() - elapsedStart) / 1000;
      const speed = doneCount / Math.max(1, elapsed);
      const eta = speed > 0 ? formatDuration(((total - doneCount) / speed) * 1000) : "--";
      let text = "已下载 " + doneCount + " / " + total + " (" + pct + "%)";
      if (failedCount > 0) text += " · 失败 " + failedCount;
      text += " · 剩余约 " + eta;
      labelEl.textContent = text;
    }

    function finish(blobUrls) {
      modal.remove();
      resolve({ blobUrls });
    }

    async function startDownload(items) {
      state = "downloading";
      pending = items;
      doneCount = 0;
      failedCount = 0;
      failedKeys = [];
      elapsedStart = Date.now();
      showState();

      const result = await downloadCovers(db, items, (done, total, failed) => {
        doneCount = done;
        failedCount = failed;
        updateProgress();
      });
      failedKeys = result.failedKeys;
      failedCount = result.failed;
      failErrors = result.errors;

      if (result.failed > 0) {
        state = "failed";
        showState();
      } else {
        const loaded = await loadAllCovers(db, allItems);
        finish(loaded.blobUrls);
      }
    }

    primaryBtn.addEventListener("click", async () => {
      if (state === "confirm") {
        startDownload(pending);
      } else if (state === "refuse") {
        startDownload(downloadItems.slice());
      } else if (state === "failed") {
        const loaded = await loadAllCovers(db, allItems);
        const urls = loaded.blobUrls;
        finish(urls);
      }
    });

    ghostBtn.addEventListener("click", () => {
      const retryItems = failedKeys.map((k) => ({ key: k, url: coverByKey.get(k) }));
      startDownload(retryItems);
    });

    closeEl.addEventListener("click", () => {
      if (state === "confirm") {
        state = "refuse";
        showState();
      }
    });

    showState();
  });
}

// 探测 clean 标志（python server.py clean）：true 时清空封面缓存（一次性）
async function checkCleanFlag() {
  try {
    const resp = await fetch("/clean");
    if (!resp.ok) return false;
    const data = await resp.json();
    return !!data.clean;
  } catch (e) {
    return false;
  }
}

// 探测封面代理：ok=可用；missing=服务器存在但不支持代理(404)；unreachable=无服务器
async function checkCoverProxy() {
  try {
    const resp = await fetch(COVER_PROXY);
    // server.py 对无参请求返回 400，非法 host 返回 403——都是端点存在
    return resp.status === 404 ? "missing" : "ok";
  } catch (e) {
    return "unreachable";
  }
}

// 代理不可用时的提示页（不提供服务）
function showProxyErrorModal(status) {
  return new Promise((resolve) => {
    const msg = status === "missing"
      ? "当前服务器不支持封面代理。请使用 <b>python server.py</b> 启动本服务。"
      : "无法连接本地服务器。请先运行 <b>python server.py</b>，然后访问 http://127.0.0.1:1119/";
    const modal = document.createElement("div");
    modal.className = "cover-modal";
    modal.innerHTML =
      '<div class="cover-box">' +
      '  <div class="cover-head">' +
      '    <span class="cover-title">无法下载封面</span>' +
      "  </div>" +
      '  <div class="cover-desc">' + msg + "</div>" +
      '  <div class="cover-actions">' +
      '    <button class="cover-btn primary">刷新页面</button>' +
      "  </div>" +
      "</div>";
    document.body.appendChild(modal);
    modal.querySelector(".cover-btn").addEventListener("click", () => location.reload());
  });
}

// 把 IndexedDB 里的封面存量迁移到 server 本地 covers/ 目录（一次性、幂等）。
// 只补 server 本地缺失的项；单张失败不阻塞。之后封面不再依赖浏览器缓存。
async function migrateCoversToLocal(db, coverItems) {
  let status;
  try {
    const resp = await fetch(STATUS_PATH);
    status = await resp.json();
  } catch (e) {
    console.warn("[警告] 无法获取本地封面缓存状态，跳过迁移", e);
    return;
  }
  if (!status || status.cached >= status.total) return; // 本地已齐

  // 只迁移真正缺失的 key（本地 covers/ 没有的），避免对已有封面重复 POST
  const missingSet = new Set(status.missing || []);
  const items = coverItems.filter((it) => missingSet.has(it.key));
  const total = items.length;
  if (!total) {
    console.log("[信息] 本地缓存已完整，无需迁移");
    return;
  }

  // 带 5s 超时的 POST，防止单次请求挂起拖死整个迁移
  async function postBlob(key, blob) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    try {
      const resp = await fetch(IMPORT_PATH + key, { method: "POST", body: blob, signal: ctrl.signal });
      return resp.ok;
    } catch (e) {
      return false;
    } finally {
      clearTimeout(timer);
    }
  }

  let idx = 0;
  let done = 0;
  let migrated = 0;

  async function worker() {
    while (idx < total) {
      const i = idx++;
      const item = items[i];
      try {
        const entry = await idbGet(db, item.key);
        if (entry && entry.blob) {
          if (await postBlob(item.key, entry.blob)) migrated++;
        }
      } catch (e) { /* 单张失败不阻塞 */ }
      done++;
      if (done % 20 === 0) {
        // 直接更新 DOM（setProgress 在 boot 闭包内，此处不可见）
        const pct = 12 + Math.round((done / total) * 8);
        document.getElementById("status-text").textContent = `迁移本地封面缓存 ${migrated}/${total}……`;
        document.getElementById("progress-fill").style.width = Math.max(0, Math.min(100, pct)) + "%";
        await new Promise((r) => setTimeout(r, 0));
      }
    }
  }

  const workers = [];
  for (let w = 0; w < 4; w++) workers.push(worker());
  await Promise.all(workers);
  console.log(`[信息] 封面迁移完成：${migrated}/${total} 张写入本地 covers/`);
  // 迁移后复查：仍缺失的封面（本地和 IndexedDB 都没有）等 mcmod 可用时
  // 通过 /cover/<key> 按需自动补齐（未命中时 server 会代理下载并落盘）
  try {
    const resp = await fetch(STATUS_PATH);
    const st = await resp.json();
    const left = (st && st.total || 0) - (st && st.cached || 0);
    if (left > 0) {
      console.warn(`[警告] 本地仍缺 ${left} 张封面（mcmod 恢复后刷新页面，缺失封面会按需自动补齐）`);
    }
  } catch (e) { /* 忽略 */ }
}

function buildGraph(data) {
  const graph = new Graph({ multi: true });
  const labelIndex = new Map(); // lowercase name -> [keys]
  const degMap = new Map();

  for (const n of data.nodes) {
    degMap.set(n.key, n.in_degree);
    const isCore = n.type === "core";
    graph.addNode(n.key, {
      x: typeof n.x === "number" ? n.x : Math.random() * 100,
      y: typeof n.y === "number" ? n.y : Math.random() * 100,
      size: nodeSize(n.in_degree, n.type),
      color: communityColor(n.community, n.type),
      label: n.label + "\nclass " + n.key,
      name: n.label,
      name_en: n.name_en,
      description: n.description,
      kind: n.type,
      type: "circle", // 默认 circle 轻量渲染；封面纹理按缩放/视口按需切换为 image（updateImageNodes）
      image: isCore ? COVER_BASE + n.key : null,
      views: n.views,
      favorites: n.favorites,
      category: n.category,
      status: n.status,
      in_degree: n.in_degree,
      out_degree: n.out_degree,
      pagerank: n.pagerank,
      community: n.community,
      rank: n.rank,
      density: n.density,
    });
    if (n.label) {
      const k = n.label.toLowerCase();
      if (!labelIndex.has(k)) labelIndex.set(k, []);
      labelIndex.get(k).push(n.key);
    }
  }

  const seenEdges = new Set();
  for (const e of data.edges) {
    // 去重：相同 source+target+kind 的重复边只保留一条（数据里存在 2800+ 重复对）
    const kind = e.type === "interaction" ? "interaction" : "dependency";
    const dedupeKey = e.source + "\u0000" + e.target + "\u0000" + kind;
    if (seenEdges.has(dedupeKey)) continue;
    seenEdges.add(dedupeKey);
    const importance = Math.min(degMap.get(e.source) || 0, degMap.get(e.target) || 0);
    const rgb = kind === "interaction" ? INTERACTION_EDGE_RGB : DEPENDENCY_EDGE_RGB;
    graph.addEdge(e.source, e.target, {
      size: 0.5,
      color: kind === "interaction" ? INTERACTION_EDGE_COLOR : DEPENDENCY_EDGE_COLOR,
      type: "line",
      kind,
      rgb,
      importance,
      group_name: e.group_name || "",
    });
  }

  return { graph, data, labelIndex };
}

function buildSearch(data) {
  const index = new Map();
  const add = (term, n) => {
    if (!term) return;
    const k = term.toLowerCase();
    if (!index.has(k)) index.set(k, new Set());
    index.get(k).add(n);
  };
  for (const n of data.nodes) {
    add(n.label, n);
    add(n.name_en, n);
    add(n.key, n);
  }
  return index;
}

function buildPagination(pageCount, current, onPage) {
  const wrap = document.createElement("div");
  wrap.className = "pagination";

  const prev = document.createElement("button");
  prev.textContent = "上一页";
  prev.disabled = current <= 0;
  prev.addEventListener("click", (e) => {
    e.stopPropagation();
    if (current > 0) onPage(current - 1);
  });

  const info = document.createElement("span");
  info.textContent = (current + 1) + " / " + pageCount;

  const next = document.createElement("button");
  next.textContent = "下一页";
  next.disabled = current >= pageCount - 1;
  next.addEventListener("click", (e) => {
    e.stopPropagation();
    if (current < pageCount - 1) onPage(current + 1);
  });

  wrap.appendChild(prev);
  wrap.appendChild(info);
  wrap.appendChild(next);
  return wrap;
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes, start, end) {
  let c = 0xFFFFFFFF;
  for (let i = start; i < end; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const len = data.length;
  const out = new Uint8Array(len + 12);
  const view = new DataView(out.buffer);
  view.setUint32(0, len);
  out[4] = type.charCodeAt(0);
  out[5] = type.charCodeAt(1);
  out[6] = type.charCodeAt(2);
  out[7] = type.charCodeAt(3);
  out.set(data, 8);
  view.setUint32(8 + len, crc32(out, 4, 8 + len));
  return out;
}

async function encodePNG(width, height, getScanlines) {
  const parts = [new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])];

  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, width);
  dv.setUint32(4, height);
  ihdr[8] = 8;   // 位深
  ihdr[9] = 6;   // RGBA
  ihdr[10] = 0;  // 压缩
  ihdr[11] = 0;  // 过滤
  ihdr[12] = 0;  // 隔行
  parts.push(pngChunk("IHDR", ihdr));

  const cs = new CompressionStream("deflate");
  const writer = cs.writable.getWriter();
  const reader = cs.readable.getReader();

  const producer = (async () => {
    for await (const row of getScanlines()) {
      await writer.write(row);
    }
    await writer.close();
  })();

  const consumer = (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value && value.length) parts.push(pngChunk("IDAT", value));
    }
  })();

  await Promise.all([producer, consumer]);
  parts.push(pngChunk("IEND", new Uint8Array(0)));
  return new Blob(parts, { type: "image/png" });
}

function main() {
  const container = document.getElementById("container");
  const statusEl = document.getElementById("status");
  const tooltipEl = document.getElementById("tooltip");
  const contextMenu = document.getElementById("context-menu");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchList = document.getElementById("search-list");
  const searchPagination = document.getElementById("search-pagination");
  const statusText = document.getElementById("status-text");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const lodSlider = document.getElementById("lod-slider");
  const lodValue = document.getElementById("lod-value");
  const edgeLodSlider = document.getElementById("edge-lod-slider");
  const edgeLodValue = document.getElementById("edge-lod-value");
  const panel = document.getElementById("panel");
  const panelToggle = document.getElementById("panel-toggle");
  const edgeDependency = document.getElementById("edge-dependency");
  const edgeInteraction = document.getElementById("edge-interaction");
  const showLabels = document.getElementById("show-labels");
  const exportWidth = document.getElementById("export-width");
  const exportHeight = document.getElementById("export-height");
  const exportButton = document.getElementById("export-button");
  const exportWarning = document.getElementById("export-warning");
  const exportLodSlider = document.getElementById("export-lod-slider");
  const exportLodValue = document.getElementById("export-lod-value");

  let renderer = null;
  let graph = null;
  let searchIndex = null;
  let lodThresholdValue = 0;
  let lodTimer = null;
  let culledEdges = new Set();
  let nodeVisibleCount = 0;
  let edgeAlpha = new Map();
  let nodeAlpha = new Map();
  let fadeTimer = null;
  let searchMatches = [];
  let searchPage = 0;
  let allNodes = [];
  let nodeLodStrength = 1;
  let edgeLodStrength = 1;
  let showDependency = true;
  let showInteraction = true;
  let highlightNodes = new Set();
  let highlightEdges = new Set();

  function setProgress(pct, text, label) {
    statusText.textContent = text;
    progressFill.style.width = Math.max(0, Math.min(100, pct)) + "%";
    progressLabel.textContent = label || "";
  }

  function finishLoading() {
    statusEl.classList.add("fade-out");
    const onEnd = () => {
      statusEl.style.display = "none";
      statusEl.removeEventListener("transitionend", onEnd);
    };
    statusEl.addEventListener("transitionend", onEnd);
    // 兜底：个别环境可能不触发 transitionend
    setTimeout(() => {
      if (statusEl.style.display !== "none") statusEl.style.display = "none";
    }, 700);
  }

  async function boot() {
    setProgress(0, "加载数据中……", "graph.json");
    const data = await loadGraph();
    renderMetaPanel(data.meta);
    setProgress(10, "检查封面缓存……", "");
    await new Promise((r) => setTimeout(r, 30));

    // 封面清单（仅核心节点 + 有 URL 的）
    const coverItems = [];
    for (const n of data.nodes) {
      if (n.type !== "core") continue;
      const url = normalizeCoverUrl(n.cover_url);
      if (url) coverItems.push({ key: n.key, url });
    }

    // 封面缓存本地化：启动时把浏览器 IndexedDB 存量迁移到 server 本地 covers/，
    // 之后封面由 server 按需代理并落盘，只下载缺失部分（增量）。
    if (coverItems.length) {
      const db = await openCoverDB();
      await migrateCoversToLocal(db, coverItems);
    } else {
      console.warn("[警告] graph.json 无封面 URL，节点将显示为纯色圆");
    }

    setProgress(20, "构建图结构……", "");
    await new Promise((r) => setTimeout(r, 30));

    const built = buildGraph(data);
    graph = built.graph;
    searchIndex = buildSearch(data);
    allNodes = [...data.nodes].sort((a, b) => (b.views || 0) - (a.views || 0));
    searchMatches = [...allNodes];
    searchPage = 0;
    renderSearchResults();

    setProgress(100, "渲染中……", "");
    await new Promise((r) => setTimeout(r, 30));

    renderer = new Sigma(graph, container, {
      renderLabels: true,
      renderEdgeLabels: false,
      hideEdgesOnMove: false,
      enableEdgeEvents: true,
      // 节点尺寸与坐标同单位（世界单位），去重叠才能与渲染一致
      itemSizesReference: "positions",
      zoomToSizeRatioFunction: (ratio) => ratio,
      defaultNodeType: "circle",
      defaultEdgeType: "line",
      // 标签：屏幕固定像素 + 网格防重叠 + 缩放门槛
      labelSize: 14,
      labelFont: '"Microsoft YaHei", "PingFang SC", sans-serif',
      labelColor: { color: "#d0d7de" },
      labelRenderedSizeThreshold: 14,
      labelGridCellSize: 180,
      labelDensity: 0.4,
      defaultDrawNodeLabel: drawNodeLabel,
      nodeProgramClasses: FadingNodeImageProgram ? {
        image: FadingNodeImageProgram,
      } : {},
    });

    bindEvents();

    container.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const bbox = container.getBoundingClientRect();
      const x = e.clientX - bbox.left;
      const y = e.clientY - bbox.top;
      const node = renderer.getNodeAtPosition({ x, y });
      if (node) {
        showNodeMenu(node, e.clientX, e.clientY);
        return;
      }
      const edge = renderer.getEdgeAtPoint(x, y);
      if (edge) {
        showEdgeMenu(edge, e.clientX, e.clientY);
        return;
      }
      hideContextMenu();
    });

    renderer.setSetting("edgeReducer", (edge, attrs) => {
      if (highlightEdges.has(edge)) {
        return { ...attrs, hidden: false, color: HIGHLIGHT_EDGE_COLOR, size: Math.max(attrs.size || 0.5, 1.6) };
      }
      const alpha = edgeAlpha.get(edge);
      if (alpha === 0) return { ...attrs, hidden: true };
      if (alpha !== undefined && alpha < 1) {
        return { ...attrs, color: edgeColorFor(attrs.rgb || DEPENDENCY_EDGE_RGB, alpha) };
      }
      return attrs;
    });

    renderer.setSetting("nodeReducer", (node, attr) => {
      if (highlightNodes.has(node)) {
        return { ...attr, hidden: false, color: HIGHLIGHT_NODE_COLOR };
      }
      const alpha = nodeAlpha.get(node);
      if (alpha === 0) return { ...attr, hidden: true };
      if (alpha !== undefined && alpha < 1) {
        // image 节点的预乘在 FadingNodeImageProgram 的 shader 里完成，
        // circle 节点没有自定义 shader，因此在这里预乘。
        const premul = attr.type !== "image";
        return { ...attr, color: hexToRgba(attr.color, alpha, premul) };
      }
      return attr;
    });

    const cam = renderer.getCamera();
    let lodLastRun = 0;
    cam.on("updated", () => {
      const now = performance.now();
      const applyLod = () => {
        lodLastRun = performance.now();
        const state = cam.getState();
        lodThresholdValue = computeLodThreshold(state.ratio, LOD_MAX_THRESHOLD * edgeLodStrength);
        nodeVisibleCount = computeVisibleNodeCount(state.ratio, nodeLodStrength);
        updateCulling(state);
        updateImageNodes(state);
        startFade();
      };
      if (lodTimer) clearTimeout(lodTimer);
      const elapsed = now - lodLastRun;
      if (elapsed >= LOD_THROTTLE_MS) {
        applyLod();
      } else {
        lodTimer = setTimeout(applyLod, LOD_THROTTLE_MS - elapsed);
      }
    });
    lodThresholdValue = computeLodThreshold(cam.getState().ratio, LOD_MAX_THRESHOLD * edgeLodStrength);
    nodeVisibleCount = computeVisibleNodeCount(cam.getState().ratio, nodeLodStrength);
    updateCulling(cam.getState());
    updateImageNodes(cam.getState());

    // 触发首次渲染并等待封面纹理图集生成，避免加载页淡出后卡顿
    renderer.refresh();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 700));

    startFade();
    finishLoading();
  }

  function bindEvents() {
    renderer.on("enterNode", ({ node }) => {
      const attrs = graph.getNodeAttributes(node);
      showTooltip(node, attrs);
    });

    renderer.on("leaveNode", () => {
      hideTooltip();
    });

    renderer.on("clickNode", ({ node }) => {
      window.open("https://www.mcmod.cn/class/" + node + ".html", "_blank");
    });

    renderer.on("clickEdge", ({ edge }) => {
      const source = graph.source(edge);
      const target = graph.target(edge);
      const cam = renderer.getCamera().getState();
      const sd = renderer.getNodeDisplayData(source);
      const td = renderer.getNodeDisplayData(target);
      if (!sd || !td) return;
      const ds = (sd.x - cam.x) * (sd.x - cam.x) + (sd.y - cam.y) * (sd.y - cam.y);
      const dt = (td.x - cam.x) * (td.x - cam.x) + (td.y - cam.y) * (td.y - cam.y);
      focusNode(ds >= dt ? source : target);
    });

    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchMatches = [...allNodes];
        searchPage = 0;
        renderSearchResults();
        return;
      }
      const matched = new Set();
      for (const [k, nodes] of searchIndex) {
        if (k.includes(q)) {
          for (const n of nodes) matched.add(n);
        }
      }
      searchMatches = [...matched].sort((a, b) => (b.views || 0) - (a.views || 0));
      searchPage = 0;
      renderSearchResults();
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const first = searchList.querySelector("li");
        if (first) first.click();
      }
    });

    lodSlider.addEventListener("input", () => {
      nodeLodStrength = Number(lodSlider.value) / 100;
      lodValue.textContent = Math.round(nodeLodStrength * 100) + "%";
      nodeVisibleCount = computeVisibleNodeCount(renderer.getCamera().getState().ratio, nodeLodStrength);
      startFade();
    });

    edgeLodSlider.addEventListener("input", () => {
      edgeLodStrength = Number(edgeLodSlider.value) / 100;
      edgeLodValue.textContent = Math.round(edgeLodStrength * 100) + "%";
      lodThresholdValue = computeLodThreshold(renderer.getCamera().getState().ratio, LOD_MAX_THRESHOLD * edgeLodStrength);
      startFade();
    });

    panelToggle.addEventListener("click", () => {
      const collapsed = panel.classList.toggle("collapsed");
      panelToggle.textContent = collapsed ? "»" : "«";
      panelToggle.title = collapsed ? "展开侧边栏" : "收起侧边栏";
    });

    edgeDependency.addEventListener("change", () => {
      showDependency = edgeDependency.checked;
      startFade();
    });
    edgeInteraction.addEventListener("change", () => {
      showInteraction = edgeInteraction.checked;
      startFade();
    });
    showLabels.addEventListener("change", () => {
      renderer.setSetting("renderLabels", showLabels.checked);
    });

    exportButton.addEventListener("click", exportPNG);

    // 导出边 LoD：阈值 = LOD_MAX_THRESHOLD × 强度（0 = 全量），只影响导出 PNG
    exportLodSlider.addEventListener("input", () => {
      exportLodValue.textContent = exportLodSlider.value + "%";
    });

    function updateExportWarning() {
      const w = parseInt(exportWidth.value, 10) || 0;
      const h = parseInt(exportHeight.value, 10) || 0;
      exportWarning.classList.toggle("hidden", w < 16384 && h < 16384);
    }
    exportWidth.addEventListener("input", updateExportWarning);
    exportHeight.addEventListener("input", updateExportWarning);
    updateExportWarning();
  }

  function renderSearchResults() {
    searchList.innerHTML = "";
    searchPagination.innerHTML = "";
    const pageSize = 10;
    const total = searchMatches.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (searchPage >= pages) searchPage = pages - 1;
    const start = searchPage * pageSize;
    const page = searchMatches.slice(start, start + pageSize);

    for (const n of page) {
      const li = document.createElement("li");
      li.textContent = n.label + (n.name_en ? " (" + n.name_en + ")" : "");
      li.title = "class " + n.key;
      li.addEventListener("click", () => {
        focusNode(n.key);
      });
      searchList.appendChild(li);
    }

    if (pages > 1) {
      searchPagination.appendChild(buildPagination(pages, searchPage, (p) => {
        searchPage = p;
        renderSearchResults();
      }));
    }

    searchResults.classList.toggle("open", total > 0);
  }

  function getViewRect(cameraState) {
    const cam = cameraState || renderer.getCamera().getState();
    const dims = renderer.getDimensions();
    const override = { cameraState: cam, viewportDimensions: dims };
    const tl = renderer.viewportToGraph({ x: 0, y: 0 }, override);
    const br = renderer.viewportToGraph({ x: dims.width, y: dims.height }, override);
    return {
      minX: Math.min(tl.x, br.x),
      maxX: Math.max(tl.x, br.x),
      minY: Math.min(tl.y, br.y),
      maxY: Math.max(tl.y, br.y),
    };
  }

  function updateCulling(cameraState) {
    const rect = getViewRect(cameraState);
    const next = new Set();
    graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
      const sOut = sa.x < rect.minX || sa.x > rect.maxX || sa.y < rect.minY || sa.y > rect.maxY;
      const tOut = ta.x < rect.minX || ta.x > rect.maxX || ta.y < rect.minY || ta.y > rect.maxY;
      if (sOut && tOut) next.add(edge);
    });
    culledEdges = next;
  }

  // 封面纹理按需加载：放大到阈值以上时，只给视口内最大的前 IMAGE_MAX_NODES 个节点
  // 切换为 image 类型（其余保持 circle），缩小时全部降回 circle，控制 WebGL 纹理压力。
  // 封面纹理按需加载：初始视图及放大(ratio 小)时，视口内节点按 size 取前 N 切换为
  // image 类型（其余保持 circle），缩小(ratio 大)全部降回 circle，控制 WebGL 纹理压力。
  // N 随放大深度自适应：ratio=1→500，ratio<=0.08→5000。
  function imageNodeLimit(ratio) {
    if (ratio <= IMAGE_RATIO_DEEP) return IMAGE_MAX_NODES_DEEP;
    const t = (IMAGE_RATIO_MAX - ratio) / (IMAGE_RATIO_MAX - IMAGE_RATIO_DEEP);
    const k = Math.min(1, Math.max(0, t));
    return Math.round(IMAGE_MAX_NODES + (IMAGE_MAX_NODES_DEEP - IMAGE_MAX_NODES) * k);
  }

  // 首次进入(加载完成)时全图也显示封面，之后用户一操作相机就按缩放规则切换
  let imageFirstPass = true;
  function updateImageNodes(cameraState) {
    if (!FadingNodeImageProgram) return; // WebGL 不可用：保持纯圆点模式
    const ratio = cameraState.ratio;
    const rect = getViewRect(cameraState);
    let wantImage;
    if (imageFirstPass) {
      imageFirstPass = false;
      wantImage = true; // 打开即有封面
    } else {
      wantImage = ratio < IMAGE_RATIO_MAX; // 缩小到接近全图即降回圆点
    }
    let changed = false;
    if (!wantImage) {
      graph.forEachNode((node, attrs) => {
        if (attrs.type === "image") {
          graph.setNodeAttribute(node, "type", "circle");
          changed = true;
        }
      });
    } else {
      const limit = imageNodeLimit(ratio);
      const inView = [];
      graph.forEachNode((node, attrs) => {
        if (attrs.x < rect.minX || attrs.x > rect.maxX || attrs.y < rect.minY || attrs.y > rect.maxY) return;
        inView.push([node, attrs.size || 1]);
      });
      inView.sort((a, b) => b[1] - a[1]);
      const imageSet = new Set(inView.slice(0, Math.min(limit, inView.length)).map((p) => p[0]));
      graph.forEachNode((node, attrs) => {
        const want = imageSet.has(node) ? "image" : "circle";
        if (attrs.type !== want) {
          graph.setNodeAttribute(node, "type", want);
          changed = true;
        }
      });
    }
    if (changed) renderer.refresh();
  }

  function focusNode(key) {
    if (!renderer || !graph) return;
    const nd = renderer.getNodeDisplayData(key);
    if (!nd) return;
    const cam = renderer.getCamera();
    const size = graph.getNodeAttribute(key, "size") || 2; // 半径（世界单位）
    const width = renderer.getDimensions().width;
    // 节点屏幕直径 = 2 * size * graphToViewportRatio，且 graphToViewportRatio = C / ratio。
    // 令直径等于屏宽 * NODE_DIAMETER_SCREEN_RATIO，反解出目标 ratio。
    const C = renderer.getGraphToViewportRatio() * cam.getState().ratio;
    const targetRatio = (2 * size * C) / (NODE_DIAMETER_SCREEN_RATIO * width);
    cam.animate({ x: nd.x, y: nd.y, ratio: targetRatio }, { duration: 600 });
  }

  function computeLodThreshold(ratio, maxThreshold) {
    // 边 LoD：ratio 越大（缩到最小）阈值越高，只留骨干边。
    // maxThreshold 已按 edgeLodStrength 缩放：0 = 禁用边 LoD（阈值恒 0），1 = 最强。
    if (ratio <= LOD_FULL_ZOOM_RATIO) return 0;
    const maxR = 1;
    const r = Math.min(ratio, maxR);
    const t = (Math.log(r) - Math.log(LOD_FULL_ZOOM_RATIO)) /
              (Math.log(maxR) - Math.log(LOD_FULL_ZOOM_RATIO));
    return Math.round(maxThreshold * t);
  }

  function computeVisibleNodeCount(ratio, strength) {
    // 按重要度排名平滑显隐：缩到最小时只留 NODE_LOD_MIN_VISIBLE 个骨干，放大后逐渐增多。
    // strength 为 LoD 强度：0 = 完全禁用（全量渲染），1 = 最强。
    const total = graph.order;
    if (strength <= 0) return total;
    if (ratio <= LOD_FULL_ZOOM_RATIO) return total;
    const maxR = 1;
    const r = Math.min(ratio, maxR);
    const t = (Math.log(r) - Math.log(LOD_FULL_ZOOM_RATIO)) /
              (Math.log(maxR) - Math.log(LOD_FULL_ZOOM_RATIO));
    return Math.round(total * Math.pow(NODE_LOD_MIN_VISIBLE / total, t * strength));
  }

  function edgeTarget(edge, attrs) {
    if (attrs.kind === "dependency" && !showDependency) return 0;
    if (attrs.kind === "interaction" && !showInteraction) return 0;
    // 边始终显示（去掉按重要度隐藏），仅保留视口剔除
    if (culledEdges.has(edge)) return 0;
    return 1;
  }

  function nodeTarget(node, attrs) {
    if (!NODE_LOD_ENABLED) return 1;
    // rank 靠后的节点缩小时淡化（保留可见轮廓）而非完全消失
    return (attrs.rank ?? Infinity) < nodeVisibleCount ? 1 : NODE_DIM_ALPHA;
  }

  function fadeStep() {
    const step = 0.36; // 渐变时长减半
    const changedNodes = [];
    const changedEdges = [];

    graph.forEachEdge((edge, attrs) => {
      const target = edgeTarget(edge, attrs);
      const cur = edgeAlpha.has(edge) ? edgeAlpha.get(edge) : 1;
      if (cur === target) return;
      let next = cur + (target - cur) * step;
      if (Math.abs(next - target) < 0.02) next = target;
      if (next === 1) edgeAlpha.delete(edge);
      else edgeAlpha.set(edge, next);
      changedEdges.push(edge);
    });

    graph.forEachNode((node, attrs) => {
      const target = nodeTarget(node, attrs);
      const cur = nodeAlpha.has(node) ? nodeAlpha.get(node) : 1;
      if (cur === target) return;
      let next = cur + (target - cur) * step;
      if (Math.abs(next - target) < 0.02) next = target;
      if (next === 1) nodeAlpha.delete(node);
      else nodeAlpha.set(node, next);
      changedNodes.push(node);
    });

    if (changedNodes.length || changedEdges.length) {
      renderer.refresh();
      fadeTimer = setTimeout(fadeStep, 33);
    } else {
      fadeTimer = null;
    }
  }

  function startFade() {
    if (fadeTimer) return;
    fadeStep();
  }

  function showTooltip(node, attrs) {
    const lines = [];
    lines.push("<div class='tt-title'>" + escapeHtml(attrs.name) + "</div>");
    if (attrs.name_en) lines.push("<div class='tt-sub'>" + escapeHtml(attrs.name_en) + "</div>");
    if (attrs.description) lines.push("<div class='tt-desc'>" + escapeHtml(attrs.description) + "</div>");
    lines.push("<div class='tt-meta'>" + (attrs.kind === "core" ? "核心模组" : "外部引用") + " · " + escapeHtml(attrs.category || "无分类") + "</div>");
    if (attrs.status) lines.push("<div class='tt-meta'>状态：" + escapeHtml(attrs.status) + "</div>");
    lines.push("<div class='tt-stats'>浏览量 " + formatNum(attrs.views) + " · 收藏 " + formatNum(attrs.favorites) + "</div>");
    lines.push("<div class='tt-stats'>被依赖 " + attrs.in_degree + " · 依赖 " + attrs.out_degree + " · PageRank " + attrs.pagerank.toFixed(5) + "</div>");
    lines.push("<div class='tt-hint'>点击跳转 mcmod 页面</div>");
    tooltipEl.innerHTML = lines.join("");
    tooltipEl.classList.remove("hidden");
    positionTooltip();
  }

  function hideTooltip() {
    tooltipEl.classList.add("hidden");
  }

  function positionTooltip() {
    const pad = 12;
    const w = tooltipEl.offsetWidth;
    const h = tooltipEl.offsetHeight;
    let x = lastMouse.x + pad;
    let y = lastMouse.y + pad;
    if (x + w > window.innerWidth) x = lastMouse.x - w - pad;
    if (y + h > window.innerHeight) y = lastMouse.y - h - pad;
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
  }

  let lastMouse = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    lastMouse = { x: e.clientX, y: e.clientY };
    if (!tooltipEl.classList.contains("hidden")) positionTooltip();
  });

  document.addEventListener("click", (e) => {
    if (!contextMenu.contains(e.target)) hideContextMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideContextMenu();
  });

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function hideContextMenu() {
    contextMenu.classList.add("hidden");
  }

  function collectRelations(key) {
    const dependsOn = new Set();
    const dependedBy = new Set();
    const interacts = new Set();

    graph.outEdges(key).forEach((e) => {
      const kind = graph.getEdgeAttribute(e, "kind");
      const t = graph.target(e);
      if (kind === "interaction") interacts.add(t);
      else dependsOn.add(t);
    });
    graph.inEdges(key).forEach((e) => {
      const kind = graph.getEdgeAttribute(e, "kind");
      const s = graph.source(e);
      if (kind === "interaction") interacts.add(s);
      else dependedBy.add(s);
    });

    const byInDegree = (a, b) =>
      (graph.getNodeAttribute(b, "in_degree") || 0) - (graph.getNodeAttribute(a, "in_degree") || 0);

    return {
      dependsOn: [...dependsOn].sort(byInDegree),
      dependedBy: [...dependedBy].sort(byInDegree),
      interacts: [...interacts].sort(byInDegree),
    };
  }

  function filterRelations(keys, query) {
    const q = query.trim().toLowerCase();
    if (!q) return keys;
    return keys.filter((key) => {
      const attrs = graph.getNodeAttributes(key);
      const name = (attrs.name || "").toLowerCase();
      const en = (attrs.name_en || "").toLowerCase();
      return name.includes(q) || en.includes(q) || key.includes(q);
    });
  }

  function positionMenu(x, y) {
    const w = contextMenu.offsetWidth;
    const h = contextMenu.offsetHeight;
    contextMenu.style.left = Math.max(4, Math.min(x, window.innerWidth - w - 8)) + "px";
    contextMenu.style.top = Math.max(4, Math.min(y, window.innerHeight - h - 8)) + "px";
  }

  function nodeDetailText(key) {
    const attrs = graph.getNodeAttributes(key);
    const lines = [];
    lines.push(attrs.name || key);
    if (attrs.name_en) lines.push(attrs.name_en);
    lines.push("class " + key);
    lines.push("被依赖 " + attrs.in_degree + " · 依赖 " + attrs.out_degree);
    lines.push("浏览量 " + formatNum(attrs.views));
    lines.push("收藏 " + formatNum(attrs.favorites));
    if (attrs.category) lines.push("分类 " + attrs.category);
    if (attrs.status) lines.push("状态 " + attrs.status);
    return lines.join("\n");
  }

  const REL_LABELS = { dependsOn: "依赖", dependedBy: "被依赖", interacts: "联动" };

  function contextItem(key, badgeType) {
    const attrs = graph.getNodeAttributes(key);
    const div = document.createElement("div");
    div.className = "ctx-item";
    if (badgeType) {
      const badge = document.createElement("span");
      badge.className = "ctx-badge " + badgeType;
      badge.textContent = REL_LABELS[badgeType] || badgeType;
      div.appendChild(badge);
    }
    const span = document.createElement("span");
    span.textContent = (attrs.name || key) + (attrs.name_en ? " (" + attrs.name_en + ")" : "");
    div.appendChild(span);
    div.title = nodeDetailText(key);
    div.addEventListener("click", () => {
      hideContextMenu();
      focusNode(key);
    });
    return div;
  }

  function findShortestPath(source, target) {
    if (source === target) return { path: [source], hops: [] };
    const prevNode = new Map();
    const prevEdge = new Map();
    const queue = [source];
    let head = 0;
    prevNode.set(source, null);
    while (head < queue.length) {
      const cur = queue[head++];
      for (const nb of graph.neighbors(cur)) {
        if (!prevNode.has(nb)) {
          prevNode.set(nb, cur);
          // 多边时取 cur -> nb 的第一条边，不影响最短路径结果
          prevEdge.set(nb, graph.edges(cur, nb)[0]);
          if (nb === target) {
            const path = [];
            const hops = [];
            let p = target;
            while (prevNode.get(p) !== null) {
              path.push(p);
              hops.push(prevEdge.get(p));
              p = prevNode.get(p);
            }
            path.push(source);
            path.reverse();
            hops.reverse();
            return { path, hops };
          }
          queue.push(nb);
        }
      }
    }
    return { error: "不存在路径" };
  }

  function applyHighlight(path, hops) {
    highlightNodes.clear();
    highlightEdges.clear();
    if (path && path.length) {
      for (const k of path) highlightNodes.add(k);
    }
    if (hops && hops.length) {
      for (const e of hops) if (e != null) highlightEdges.add(e);
    }
    if (renderer) renderer.refresh();
  }

  function showSixDegreesMenu(source, x, y) {
    const state = { query: "", page: 0, target: null, result: null };
    contextMenu.innerHTML = "";

    const titleEl = document.createElement("div");
    titleEl.className = "ctx-title ctx-title-row";
    const backBtn = document.createElement("button");
    backBtn.className = "ctx-six";
    backBtn.textContent = "← 返回";
    backBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showNodeMenu(source, x, y);
    });
    titleEl.appendChild(backBtn);
    const titleText = document.createElement("span");
    titleText.className = "ctx-title-text";
    titleText.textContent = "六度分隔";
    titleEl.appendChild(titleText);
    contextMenu.appendChild(titleEl);

    const searchWrap = document.createElement("div");
    searchWrap.className = "ctx-search";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "搜索目标模组…";
    searchWrap.appendChild(input);
    contextMenu.appendChild(searchWrap);

    const listEl = document.createElement("div");
    contextMenu.appendChild(listEl);

    const detectBtn = document.createElement("button");
    detectBtn.className = "ctx-detect";
    detectBtn.textContent = "检测";
    detectBtn.disabled = true;
    contextMenu.appendChild(detectBtn);

    const resultEl = document.createElement("div");
    resultEl.className = "ctx-six-result";
    contextMenu.appendChild(resultEl);

    function renderList() {
      listEl.innerHTML = "";
      const q = state.query.trim().toLowerCase();
      let matches = [];
      if (q) {
        const seen = new Set();
        for (const [term, nodes] of searchIndex) {
          if (term.includes(q)) {
            for (const n of nodes) {
              if (!seen.has(n.key)) {
                seen.add(n.key);
                matches.push(n);
              }
            }
          }
        }
      } else {
        matches = [...allNodes];
      }
      matches.sort((a, b) => (b.views || 0) - (a.views || 0));

      const pageSize = 20;
      const pages = Math.max(1, Math.ceil(matches.length / pageSize));
      if (state.page >= pages) state.page = pages - 1;
      const start = state.page * pageSize;
      const page = matches.slice(start, start + pageSize);

      for (const n of page) {
        const li = document.createElement("div");
        li.className = "ctx-item" + (state.target === n.key ? " selected" : "");
        li.textContent = n.label + (n.name_en ? " (" + n.name_en + ")" : "");
        li.title = "class " + n.key;
        li.addEventListener("click", (e) => {
          e.stopPropagation();
          state.target = n.key;
          detectBtn.disabled = false;
          renderList();
          positionMenu(x, y);
        });
        listEl.appendChild(li);
      }
      if (pages > 1) {
        listEl.appendChild(buildPagination(pages, state.page, (p) => {
          state.page = p;
          renderList();
          positionMenu(x, y);
        }));
      }
    }

    function renderResult() {
      resultEl.innerHTML = "";
      if (!state.result) return;
      if (state.result.error) {
        const empty = document.createElement("div");
        empty.className = "ctx-empty";
        empty.textContent = state.result.error;
        resultEl.appendChild(empty);
        return;
      }
      const path = state.result.path;
      for (let i = 0; i < path.length; i++) {
        const nodeEl = document.createElement("div");
        nodeEl.className = "ctx-six-path";
        const attrs = graph.getNodeAttributes(path[i]);
        nodeEl.textContent = (i + 1) + ". " + (attrs.name || path[i]);
        nodeEl.title = nodeDetailText(path[i]);
        nodeEl.addEventListener("click", () => {
          hideContextMenu();
          focusNode(path[i]);
        });
        resultEl.appendChild(nodeEl);
        if (i < path.length - 1) {
          const arrow = document.createElement("div");
          arrow.className = "ctx-six-arrow";
          arrow.appendChild(document.createTextNode("↓ "));
          const hop = state.result.hops[i];
          const kind = graph.getEdgeAttribute(hop, "kind");
          const groupName = graph.getEdgeAttribute(hop, "group_name") || "";
          let label;
          let cls;
          if (kind === "interaction") {
            label = "联动";
            cls = "interaction";
          } else {
            const s = graph.source(hop);
            label = (s === path[i]) ? "依赖" : "被依赖";
            cls = "dependency";
          }
          const span = document.createElement("span");
          span.className = "ctx-six-rel " + cls;
          span.textContent = label + (groupName ? " · " + groupName : "");
          arrow.appendChild(span);
          resultEl.appendChild(arrow);
        }
      }
      const info = document.createElement("div");
      info.className = "ctx-six-info";
      info.textContent = "共 " + (path.length - 1) + " 跳 · " + path.length + " 个节点";
      resultEl.appendChild(info);
    }

    function detect() {
      const result = findShortestPath(source, state.target);
      state.result = result;
      applyHighlight(result.path || null, result.hops || null);
      renderResult();
      positionMenu(x, y);
    }

    detectBtn.addEventListener("click", detect);
    input.addEventListener("input", () => {
      state.query = input.value;
      state.page = 0;
      state.target = null;
      detectBtn.disabled = true;
      renderList();
      positionMenu(x, y);
    });

    renderList();
    contextMenu.classList.remove("hidden");
    positionMenu(x, y);
    input.focus();
  }

  function showNodeMenu(node, x, y) {
    const attrs = graph.getNodeAttributes(node);
    const rel = collectRelations(node);
    const state = { title: attrs.name || node, rel, tab: "all", page: 0, query: "" };

    contextMenu.innerHTML = "";

    const titleEl = document.createElement("div");
    titleEl.className = "ctx-title ctx-title-row";
    const titleText = document.createElement("span");
    titleText.className = "ctx-title-text";
    titleText.textContent = state.title;
    titleEl.appendChild(titleText);
    const sixBtn = document.createElement("button");
    sixBtn.className = "ctx-six";
    sixBtn.textContent = "六度分隔";
    sixBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      showSixDegreesMenu(node, x, y);
    });
    titleEl.appendChild(sixBtn);
    contextMenu.appendChild(titleEl);

    const searchWrap = document.createElement("div");
    searchWrap.className = "ctx-search";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "搜索关联模组…";
    searchWrap.appendChild(input);
    contextMenu.appendChild(searchWrap);

    const tabs = document.createElement("div");
    tabs.className = "ctx-tabs";
    contextMenu.appendChild(tabs);

    const body = document.createElement("div");
    contextMenu.appendChild(body);

    const TAB_DEFS = [
      { key: "all", label: "全部" },
      { key: "dependsOn", label: "依赖" },
      { key: "dependedBy", label: "被依赖" },
      { key: "interacts", label: "联动" },
    ];

    function tabCount(key) {
      if (key === "all") {
        return state.rel.dependsOn.length + state.rel.dependedBy.length + state.rel.interacts.length;
      }
      return state.rel[key].length;
    }

    function activeList() {
      const items = [];
      if (state.tab === "all") {
        for (const key of state.rel.dependsOn) items.push({ key, type: "dependsOn" });
        for (const key of state.rel.dependedBy) items.push({ key, type: "dependedBy" });
        for (const key of state.rel.interacts) items.push({ key, type: "interacts" });
        items.sort((a, b) =>
          (graph.getNodeAttribute(b.key, "in_degree") || 0) - (graph.getNodeAttribute(a.key, "in_degree") || 0)
        );
      } else {
        for (const key of state.rel[state.tab]) items.push({ key, type: null });
      }
      return items;
    }

    function renderTabs() {
      tabs.innerHTML = "";
      for (const def of TAB_DEFS) {
        const t = document.createElement("button");
        t.className = "ctx-tab" + (state.tab === def.key ? " active" : "");
        t.textContent = def.label + " " + tabCount(def.key);
        t.addEventListener("click", (e) => {
          e.stopPropagation();
          state.tab = def.key;
          state.page = 0;
          renderTabs();
          renderBody();
          positionMenu(x, y);
        });
        tabs.appendChild(t);
      }
    }

    function renderBody() {
      body.innerHTML = "";
      const q = state.query.trim().toLowerCase();

      let list = activeList();
      if (q) {
        list = list.filter((item) => {
          const a = graph.getNodeAttributes(item.key);
          const name = (a.name || "").toLowerCase();
          const en = (a.name_en || "").toLowerCase();
          return name.includes(q) || en.includes(q) || item.key.includes(q);
        });
      }

      const pageSize = 20;
      const pages = Math.max(1, Math.ceil(list.length / pageSize));
      if (state.page >= pages) state.page = pages - 1;
      const start = state.page * pageSize;
      const page = list.slice(start, start + pageSize);

      if (!list.length) {
        const empty = document.createElement("div");
        empty.className = "ctx-empty";
        empty.textContent = "无匹配";
        body.appendChild(empty);
      } else {
        for (const item of page) body.appendChild(contextItem(item.key, item.type));
        if (pages > 1) {
          body.appendChild(buildPagination(pages, state.page, (p) => {
            state.page = p;
            renderBody();
            positionMenu(x, y);
          }));
        }
      }
    }

    renderTabs();
    renderBody();
    contextMenu.classList.remove("hidden");
    positionMenu(x, y);

    input.addEventListener("input", () => {
      state.query = input.value;
      state.page = 0;
      renderBody();
      positionMenu(x, y);
    });
    input.focus();
  }

  function showEdgeMenu(edge, x, y) {
    const source = graph.source(edge);
    const target = graph.target(edge);
    contextMenu.innerHTML = "";
    const titleEl = document.createElement("div");
    titleEl.className = "ctx-title";
    titleEl.textContent = "关系";
    contextMenu.appendChild(titleEl);
    const st = document.createElement("div");
    st.className = "ctx-section-title";
    st.textContent = "两端 (2)";
    contextMenu.appendChild(st);
    contextMenu.appendChild(contextItem(source));
    contextMenu.appendChild(contextItem(target));
    contextMenu.classList.remove("hidden");
    positionMenu(x, y);
  }

  function drawEdges(ctx, tx, ty, scale, minImportance) {
    graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
      // 导出边 LoD：importance 低于阈值的边不画（importance = min 两端被依赖次数）
      if (minImportance > 0 && (attrs.importance || 0) < minImportance) return;
      const rgb = attrs.rgb || DEPENDENCY_EDGE_RGB;
      ctx.strokeStyle = rgbaString(rgb, EDGE_ALPHA);
      ctx.lineWidth = Math.max(1, (attrs.size || 0.5) * scale);
      ctx.beginPath();
      ctx.moveTo(tx(sa.x), ty(sa.y));
      ctx.lineTo(tx(ta.x), ty(ta.y));
      ctx.stroke();
    });
  }

  function drawLabel(ctx, cx, cy, r, attrs) {
    const name = attrs.name || attrs.key;
    const idText = "class " + attrs.key;
    const fontSize = LABEL_FONT_SIZE;
    const lineHeight = fontSize * 1.25;

    ctx.font = fontSize + 'px "Microsoft YaHei", "PingFang SC", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const nameW = ctx.measureText(name).width;
    const idW = ctx.measureText(idText).width;
    const maxW = Math.max(nameW, idW);

    const padX = fontSize * 0.35;
    const padY = fontSize * 0.2;
    const bx = cx - maxW / 2 - padX;
    const by = cy + r + fontSize * 0.35;
    const bw = maxW + padX * 2;
    const bh = lineHeight * 2 + padY * 2;

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(bx, by, bw, bh);

    ctx.fillStyle = "#e6e6e6";
    ctx.fillText(name, cx, by + padY);
    ctx.fillStyle = "#9fb0c3";
    ctx.fillText(idText, cx, by + padY + lineHeight);
  }

  async function drawNodesAt(ctx, items, onProgress) {
    const total = items.length;
    let idx = 0;
    let done = 0;
    const CONCURRENCY = 64;

    async function worker() {
      while (idx < total) {
        const i = idx++;
        const item = items[i];
        const attrs = item.attrs;
        const cx = item.cx, cy = item.cy, r = item.r;

        let img = null;
        // 导出直接使用节点 image（本地缓存 URL /cover/<key>）
        const src = attrs.image;
        if (src) {
          img = new Image();
          img.src = src;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        }

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (img && img.naturalWidth > 0) {
          const iw = img.naturalWidth;
          const ih = img.naturalHeight;
          // cover：等比缩放覆盖圆形，居中裁剪，保持封面宽高比
          const s = Math.max((r * 2) / iw, (r * 2) / ih);
          const dw = iw * s;
          const dh = ih * s;
          ctx.save();
          ctx.clip();
          ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
          ctx.restore();
        } else {
          ctx.fillStyle = attrs.color || "#888888";
          ctx.fill();
        }

        drawLabel(ctx, cx, cy, r, attrs);

        done++;
        if (onProgress) onProgress(done, total);
      }
    }

    const workers = [];
    for (let w = 0; w < CONCURRENCY; w++) workers.push(worker());
    await Promise.all(workers);
  }

  function canvasToBlob(canvas) {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("导出 PNG 失败"));
      }, "image/png");
    });
  }

  async function renderSingle(W, H, scale, nodePixels, toX, toY, minImportance) {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    drawEdges(ctx, toX, toY, scale, minImportance);

    const items = nodePixels.map((n) => ({ attrs: n.attrs, cx: n.px, cy: n.py, r: n.pr }));
    const startTime = Date.now();
    await drawNodesAt(ctx, items, (done, total) => {
      const now = Date.now();
      const pct = Math.round((done / total) * 100);
      const elapsed = now - startTime;
      const speed = done / Math.max(1, elapsed);
      const remaining = speed > 0 ? (total - done) / speed : 0;
      exportButton.textContent = "导出中 " + pct + "% · 剩余 " + formatDuration(remaining);
    });

    return canvasToBlob(canvas);
  }

  async function renderTiled(W, H, scale, nodePixels, toX, toY, minImportance) {
    const TILE_W = 8192;
    const TILE_H = 1024;
    const cols = Math.ceil(W / TILE_W);
    const rows = Math.ceil(H / TILE_H);
    const totalTiles = cols * rows;
    let renderedTiles = 0;
    const startTime = Date.now();

    async function* getScanlines() {
      for (let r = 0; r < rows; r++) {
        const tileY0 = r * TILE_H;
        const tileH = Math.min(TILE_H, H - tileY0);

        // 渲染这一“行”的所有列块，并保留像素数据
        const colData = [];
        for (let c = 0; c < cols; c++) {
          const tileX0 = c * TILE_W;
          const tileW = Math.min(TILE_W, W - tileX0);

          const canvas = document.createElement("canvas");
          canvas.width = tileW;
          canvas.height = tileH;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, tileW, tileH);

          const tx = (x) => toX(x) - tileX0;
          const ty = (y) => toY(y) - tileY0;
          drawEdges(ctx, tx, ty, scale, minImportance);

          const items = [];
          for (const n of nodePixels) {
            // 标签从节点底部向下延伸（两行文字 + 内边距 + 间距），
            // 横向用保守余量覆盖长名称与 "class 12345"，
            // 确保标签跨越的 tile 都包含该节点，拼图后标签不被截断。
            const labelBottom = LABEL_FONT_SIZE * 3.25;
            const labelHalf = Math.max(n.pr, LABEL_FONT_SIZE * 16);
            if (n.px + labelHalf >= tileX0 && n.px - labelHalf <= tileX0 + tileW &&
                n.py + n.pr + labelBottom >= tileY0 && n.py - n.pr <= tileY0 + tileH) {
              items.push({ attrs: n.attrs, cx: n.px - tileX0, cy: n.py - tileY0, r: n.pr });
            }
          }
          await drawNodesAt(ctx, items, null);

          const imgData = ctx.getImageData(0, 0, tileW, tileH);
          colData.push({ tileW, data: imgData.data });

          renderedTiles++;
          const now = Date.now();
          const pct = Math.round((renderedTiles / totalTiles) * 100);
          const elapsed = now - startTime;
          const speed = renderedTiles / Math.max(1, elapsed);
          const remaining = speed > 0 ? (totalTiles - renderedTiles) / speed : 0;
          exportButton.textContent = "导出中 " + pct + "% · 剩余 " + formatDuration(remaining);
        }

        // 横向拼接成完整宽度的扫描行（PNG 每行必须为 W 宽）
        const fullRowBytes = W * 4;
        for (let y = 0; y < tileH; y++) {
          const row = new Uint8Array(fullRowBytes + 1);
          row[0] = 0;
          let offset = 1;
          for (const cd of colData) {
            const start = y * cd.tileW * 4;
            row.set(cd.data.subarray(start, start + cd.tileW * 4), offset);
            offset += cd.tileW * 4;
          }
          yield row;
        }
      }
    }

    return encodePNG(W, H, getScanlines);
  }

  async function exportPNG() {
    if (!graph) return;

    const W = parseInt(exportWidth.value, 10) || 65536;
    const H = parseInt(exportHeight.value, 10) || 65536;

    exportButton.disabled = true;
    exportButton.textContent = "导出中…";

    try {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      const nodes = [];
      graph.forEachNode((node, attrs) => {
        nodes.push({ ...attrs, key: node });
        const r = attrs.size || 0;
        if (attrs.x - r < minX) minX = attrs.x - r;
        if (attrs.x + r > maxX) maxX = attrs.x + r;
        if (attrs.y - r < minY) minY = attrs.y - r;
        if (attrs.y + r > maxY) maxY = attrs.y + r;
      });

      const pad = Math.max(maxX - minX, maxY - minY) * 0.02;
      minX -= pad; maxX += pad; minY -= pad; maxY += pad;
      const bw = maxX - minX, bh = maxY - minY;
      const scale = Math.min(W / bw, H / bh);
      const ox = (W - bw * scale) / 2;
      const oy = (H - bh * scale) / 2;
      const toX = (x) => (x - minX) * scale + ox;
      const toY = (y) => (y - minY) * scale + oy;

      const nodePixels = nodes.map((attrs) => ({
        attrs,
        px: toX(attrs.x),
        py: toY(attrs.y),
        pr: attrs.size * scale,
      }));

      const SINGLE_MAX = 16384;
      // 导出边 LoD 阈值：与屏幕边 LoD 100% 缩到底的骨干阈值一致（LOD_MAX_THRESHOLD × 强度）
      const minImportance = Math.round(LOD_MAX_THRESHOLD * ((Number(exportLodSlider.value) || 0) / 100));
      const blob = (W < SINGLE_MAX && H < SINGLE_MAX)
        ? await renderSingle(W, H, scale, nodePixels, toX, toY, minImportance)
        : await renderTiled(W, H, scale, nodePixels, toX, toY, minImportance);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "mcmod-graph-" + W + "x" + H + ".png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[错误] 导出 PNG 失败", err);
      exportButton.textContent = "导出失败";
      setTimeout(() => { exportButton.textContent = "下载渲染图"; }, 2000);
    } finally {
      exportButton.disabled = false;
      if (exportButton.textContent.startsWith("导出中")) {
        exportButton.textContent = "下载渲染图";
      }
    }
  }

  boot().catch((err) => {
    statusText.textContent = "出错了：" + err.message;
    progressLabel.textContent = "";
    console.error("[错误]", err);
  });
}

main();
