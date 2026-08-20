/*
 * star_graph/main.js - 模组/作者生态关系图前端
 *
 * 基于 sigma.js v3 + graphology，数据来自 graph.json（GitHub Releases 分发，
 * meta.mode 决定 mod 模组图 / author 作者图两种模式）。
 * 封面通过 /cover_proxy 同源代理下载（绕过 CDN 防盗链），缓存到 IndexedDB，
 * 以 blob URL 渲染并用于 PNG 导出（避免 canvas 污染）。
 *
 * 构建：npm run build（esbuild → main.bundle.js），需先 npm install。
 * 运行：python server.py，然后访问 http://127.0.0.1:1119/
 */
import Graph from "graphology";
import Sigma from "sigma";
import { createNodeImageProgram } from "@sigma/node-image";

// 封面纹理程序工厂：按纹理上限生成，96px 常规、300px 大节点高清。
// sigma 使用预乘 alpha 混合，blendFunc(ONE, ONE_MINUS_SRC_ALPHA)，
// 因此颜色 RGB 必须先乘以 alpha，否则降低 alpha 会变成加色混合而变亮，不是变透明。
// 96px：作者图 1.9 万头像，128px 图集数会超 WebGL MAX_TEXTURE_IMAGE_UNITS(16)；
// 半径超过 COVER_HI_RES_THRESHOLD 的大节点改用 300px——数量少，不撑爆图集。
function makeFadingImageProgram(textureSize) {
  class FadingImageProgram extends createNodeImageProgram({
    size: { mode: "max", value: textureSize },
  }) {
    getDefinition() {
      const def = super.getDefinition();
      def.FRAGMENT_SHADER_SOURCE = def.FRAGMENT_SHADER_SOURCE
        // 已加载封面：颜色直接取纹理并预乘，texel.a 消透明区、v_color.a 供淡出，
        // 透明区不再掺节点纯色——否则圆形头像外围会有一圈纯色环
        .replace(
          "color = vec4(mix(v_color, texel, texel.a).rgb, max(texel.a, v_color.a));",
          "color = vec4(texel.rgb * texel.a, texel.a * v_color.a);"
        )
        // 无纹理/纹理缺失分支按纯色圆处理：预乘淡出 alpha
        .replace(
          "  #endif\n\n  // Crop in a circle when u_keepWithinCircle is truthy:",
          "  color.rgb *= v_color.a;\n  #endif\n\n  // Crop in a circle when u_keepWithinCircle is truthy:"
        );
      return def;
    }
  }
  return FadingImageProgram;
}
const FadingNodeImageProgram = makeFadingImageProgram(96);
const FadingNodeImageProgramHi = makeFadingImageProgram(300);

// 自定义节点标签绘制：支持 \n 换行，第一行名称、第二行 class id。
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

  // 半透明背景，让文字在深色图上可读
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

// 图数据路径固定为 graph.json；可用服务器参数 --data 映射其他文件，见 server.py
const GRAPH_URL = "graph.json";

const PALETTE = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#42d4f4", "#f032e6", "#bfef45", "#fabed4",
  "#469990", "#dcbeff", "#9a6324", "#fffac8", "#800000",
  "#aaffc3", "#808000", "#ffd8b1", "#000075", "#a9a9a9",
];

const EXTERNAL_COLOR = "#9e9e9e";
const ISOLATED_COLOR = "#d6d6d6";
const EDGE_ALPHA = 0.16;             // 边透明度：节点是主体，边只做弱连接提示
const DEPENDENCY_EDGE_RGB = [255, 182, 193];  // 依赖：粉
const INTERACTION_EDGE_RGB = [173, 216, 230]; // 联动：浅蓝
// 作者图合作边按两端团队状态三色区分：团队-团队绿 / 团队-个人红 / 个人-个人蓝
const TEAM_TEAM_EDGE_RGB = [144, 238, 144];
const TEAM_MIXED_EDGE_RGB = [255, 99, 71];
const INDIVIDUAL_EDGE_RGB = [173, 216, 230];
// 成员-团队边 membership：淡绿细线、透明度更低，结构连接、弱于合作边
const MEMBER_EDGE_RGB = [180, 255, 180];
const MEMBER_EDGE_ALPHA = 0.10;
// 成员边基础粗细：固定值保证可见，0.4 过细、亚像素下几乎消失
const MEMBER_EDGE_SIZE = 0.8;
// 团队尺寸中成员数折算权重，与后端布局 node_size_px 一致
const MEMBER_SIZE_WEIGHT = 50;
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
// 2D Canvas 用直通 alpha 即非预乘；WebGL 才需要预乘
function rgbaString(rgb, alpha) {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")";
}

// 相机更新节流：缩放中每 33ms 至少更新一次视口裁剪
const LOD_THROTTLE_MS = 33;
const NODE_DIAMETER_SCREEN_RATIO = 0.1; // 跳转后节点直径占屏幕宽度的比例
const LABEL_FONT_SIZE = 14; // 导出标签字号：固定，不随节点/图幅变化
// 瓦片导出：金字塔每级瓦片边长与最小级别尺寸，缩放到底后仍可浏览
const EXPORT_TILE = 512;
const MIN_LEVEL_SIZE = 1024;
const HIGHLIGHT_NODE_COLOR = "#ffd700"; // 六度分隔路径节点高亮色
const HIGHLIGHT_EDGE_RGB = [255, 215, 0]; // 六度分隔路径边高亮色
const HIGHLIGHT_EDGE_COLOR = premulRgba(HIGHLIGHT_EDGE_RGB, 1.0);

const COVER_DB_NAME = "mcmod-graph-covers";
const COVER_STORE = "covers";
const COVER_CONCURRENCY = 6;    // 并发下载数：浏览器对同一 host 的 HTTP/1.1 连接上限，设更高也只会排队
const COVER_INTERVAL_MS = 20;   // 每张完成后的最小间隔
const COVER_RETRIES = 2;        // 每张失败后的额外重试次数
const COVER_PROXY = "/cover_proxy?url="; // 同源代理，绕过 i.mcmod.cn 防盗链
// 封面缩略图尺寸：与 server.py COVER_SIZE 一致，URL 规范化统一后缀用
const COVER_SIZE = 300;
// 封面纹理分级：节点半径超过该值时改用 300px 高清纹理，96px 会糊。
// 阈值 20：高清节点 373 个，团队 370 + 普通作者 3；300px 图集 3 页 + 96px 11 页
// = 14，padding 后仍 14，余量 2 页，低于 MAX_TEXTURE_IMAGE_UNITS(16)。
const COVER_HI_RES_THRESHOLD = 20;

// 图模式：由 graph.json 的 meta.mode 决定，mod=模组依赖/联动图、author=作者合作图
let GRAPH_MODE = "mod";

function communityColor(community, type, teamCommunity) {
  if (type === "external") return EXTERNAL_COLOR;
  if (community < 0) return ISOLATED_COLOR;
  const base = PALETTE[community % PALETTE.length];
  // 团队社区：在 Louvain 社区色基础上 RGB 加减，同团队社区同偏移、±60 内保持色系
  if (teamCommunity == null || teamCommunity < 0) return base;
  const c = teamCommunity;
  const dr = (((c * 13) % 7) + 7) % 7 - 3;
  const dg = (((c * 29) % 7) + 7) % 7 - 3;
  const db = (((c * 47) % 7) + 7) % 7 - 3;
  const cl = (v) => Math.max(0, Math.min(255, v));
  const r = cl(parseInt(base.slice(1, 3), 16) + dr * 20);
  const g = cl(parseInt(base.slice(3, 5), 16) + dg * 20);
  const b = cl(parseInt(base.slice(5, 7), 16) + db * 20);
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function nodeSize(inDegree, type, isTeam, memberCount) {
  // 半径 = 2 + sqrt(度)，面积正比于评分，mod 为被依赖数、author 为加权合作度
  // 团队度 = 合作度 + 成员数×50，组织规模参与尺寸；×1.618 不封顶
  const d = Math.max(0, inDegree || 0) + (isTeam ? MEMBER_SIZE_WEIGHT * (memberCount || 0) : 0);
  const s = 2 + Math.sqrt(d);
  return isTeam ? s * 1.618 : s;
}

function nodeKindLabel(node) {
  // 作者图里团队节点显示“团队”，其余显示“作者”；模组图一律 class
  if (GRAPH_MODE !== "author") return "class";
  return node && node.is_team ? "团队" : "作者";
}

// ==================== 作者图二级筛选，模组图不使用 ====================
// 第一级：节点类型，全部/团队/普通作者；第二级：关系/属性，全部/合作/包含/属于
const KIND_FILTERS = [
  { key: "all", label: "全部" },
  { key: "team", label: "团队" },
  { key: "author", label: "普通作者" },
];

function filterNodesByKind(nodes, kind) {
  if (kind === "team") return nodes.filter((n) => n.is_team);
  if (kind === "author") return nodes.filter((n) => !n.is_team);
  return nodes;
}

// 全局检索的第二级语义：包含=团队节点；属于=归属于团队；合作=有合作边
function filterNodesByRel(nodes, rel) {
  if (rel === "contains") return nodes.filter((n) => n.is_team);
  if (rel === "belongs") return nodes.filter((n) => n.teams && n.teams.length);
  if (rel === "coop") return nodes.filter((n) => (n.degree || 0) > 0);
  return nodes;
}

// 构建二级筛选条。kindCounts: {all,team,author}；relItems: [{key,label,count}]。
// 除“全部”外的条件带计数；计数为 0 的条件不显示。state: {kind, rel}，变更回调 onChange。
function buildFilterBar(kindCounts, relItems, state, onChange) {
  const bar = document.createElement("div");
  bar.className = "filter-bar";
  const row1 = document.createElement("div");
  row1.className = "filter-row";
  for (const f of KIND_FILTERS) {
    const c = kindCounts[f.key] || 0;
    if (c <= 0) continue;
    const b = document.createElement("button");
    b.className = "filter-btn" + (state.kind === f.key ? " active" : "");
    b.textContent = f.label + (f.key === "all" ? "" : " " + c);
    b.addEventListener("click", (e) => {
      e.stopPropagation(); // 阻止冒泡：onChange 重渲染会移除本按钮，误触发外部点击关闭
      state.kind = f.key;
      onChange();
    });
    row1.appendChild(b);
  }
  bar.appendChild(row1);
  const row2 = document.createElement("div");
  row2.className = "filter-row";
  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn" + (state.rel === "all" ? " active" : "");
  allBtn.textContent = "全部";
  allBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    state.rel = "all";
    onChange();
  });
  row2.appendChild(allBtn);
  for (const item of relItems) {
    if (!item.count) continue;
    const b = document.createElement("button");
    b.className = "filter-btn" + (state.rel === item.key ? " active" : "");
    b.textContent = item.label + " " + item.count;
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      state.rel = item.key;
      onChange();
    });
    row2.appendChild(b);
  }
  bar.appendChild(row2);
  return bar;
}

// 全局检索排序：作者图按合作度降序，浏览量平局裁决；与右键菜单一致；
// 模组图保持浏览量降序。传入数组会被原地排序，调用方请传副本。
function sortNodes(nodes) {
  if (GRAPH_MODE === "author") {
    return nodes.sort((a, b) => ((b.degree || 0) - (a.degree || 0)) || ((b.views || 0) - (a.views || 0)));
  }
  return nodes.sort((a, b) => (b.views || 0) - (a.views || 0));
}

function edgeSizeFor(weight) {
  // 合作边粗细：log 映射，1 次最细、权重翻倍粗 0.35、封顶 3.0
  const w = Math.max(1, weight || 1);
  return Math.min(0.5 + Math.log2(w) * 0.35, 3.0);
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

// 加载图数据：流式读取，按 Content-Length 上报进度，回调 onProgress(received, total)
async function loadGraph(onProgress) {
  // 本地服务器返回完整 Content-Length，可显示真实下载进度
  const res = await fetch(GRAPH_URL);
  if (!res.ok) throw new Error("加载 graph.json 失败: " + res.status);
  const total = Number(res.headers.get("Content-Length")) || 0;
  const reader = res.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    if (onProgress && total) onProgress(received, total);
  }
  let text;
  if (chunks.length === 1) {
    text = new TextDecoder("utf-8").decode(chunks[0]);
  } else {
    const buf = new Uint8Array(received);
    let off = 0;
    for (const c of chunks) { buf.set(c, off); off += c.length; }
    text = new TextDecoder("utf-8").decode(buf);
  }
  return JSON.parse(text);
}

// 渲染侧边栏底部的图元数据面板，字段独立一行、值为 null 原样显示
function renderMetaPanel(meta) {
  const el = document.getElementById("panel-meta");
  if (!el || !meta) return;
  const w = meta.weights || {};
  const rows =
    GRAPH_MODE === "author"
      ? [
          ["节点", meta.node_count],
          ["普通作者", meta.author_count],
          ["团队", meta.team_count],
          ["合作边", meta.cooperation_edges],
          ["成员边", meta.membership_edges],
          ["社区", meta.community_count],
          ["连通分量", meta.component_count],
          ["生成时间", meta.generated_at],
          ["布局", meta.layout],
          ["数据源", meta.source_db],
        ]
      : [
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

// 防抖：连续调用时延迟 ms 执行；flush 立即执行挂起的调用，如输入后按 Enter
function debounce(fn, ms) {
  let timer = null;
  const wrapped = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      fn(...args);
    }, ms);
  };
  wrapped.flush = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      fn();
    }
  };
  return wrapped;
}

function openCoverDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(COVER_DB_NAME, 3);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(COVER_STORE)) {
        db.createObjectStore(COVER_STORE); // key = 规范化封面 URL
        return;
      }
      const store = req.transaction.objectStore(COVER_STORE);
      if (req.oldVersion < 2) {
        // v1：纯 blob 无 url 字段，无法迁移，作废重下
        store.clear();
        return;
      }
      // v2 → v3：key 从节点 id 迁移为规范化 URL，实现跨图共享
      const cursorReq = store.openCursor();
      cursorReq.onsuccess = () => {
        const cursor = cursorReq.result;
        if (!cursor) return;
        const url = cursor.value && cursor.value.url ? normalizeCoverUrl(cursor.value.url) : null;
        if (url) store.put({ blob: cursor.value.blob }, url);
        cursor.delete();
        cursor.continue();
      };
    };
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

// 协议/尺寸规范化：补 https，统一 CDN 缩略图后缀，@NxN.jpg 统一为 @300x300.jpg，
// 同一图片不同尺寸后缀视为同一缓存键，避免重复下载/存储
function normalizeCoverUrl(url) {
  if (!url) return null;
  let u = String(url).trim();
  if (u.startsWith("//")) u = "https:" + u;
  return u.replace(/@\d+x\d+\.jpg$/, "@" + COVER_SIZE + "x" + COVER_SIZE + ".jpg");
}

// 读取封面缓存：以规范化 URL 为键，游标批量遍历，单只读事务、替代逐条 idbGet
// wantUrls：需要的 URL 列表；返回 { blobUrls, staleKeys }
// staleKeys：缓存缺失的 URL，需下载；缓存按 URL 跨图共享、不做按图清理
async function loadAllCovers(db, wantUrls, onProgress) {
  const blobUrls = new Map();
  const staleKeys = [];
  const want = new Set(wantUrls.map(String));

  const tx = db.transaction(COVER_STORE, "readonly");
  const store = tx.objectStore(COVER_STORE);
  const req = store.openCursor();
  let visited = 0;
  req.onsuccess = () => {
    const cursor = req.result;
    if (!cursor) return;
    visited++;
    if (want.has(String(cursor.key))) {
      const entry = cursor.value;
      if (entry && entry.blob) blobUrls.set(String(cursor.key), URL.createObjectURL(entry.blob));
    }
    // 游标回调高频触发，节流进度上报，每 500 条一次
    if (onProgress && visited % 500 === 0) onProgress(visited, wantUrls.length);
    cursor.continue();
  };
  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  if (onProgress) onProgress(wantUrls.length, wantUrls.length);

  for (const u of want) {
    if (!blobUrls.has(u)) staleKeys.push(u);
  }
  return { blobUrls, staleKeys };
}

// 并发下载封面，每张重试 COVER_RETRIES 次；返回 { failed, failedKeys, errors, blobUrls }
// 条目以 URL 为标识，item.url 即缓存键；blobUrls 就地记录，避免成功后全量重读
async function downloadCovers(db, items, onProgress) {
  let idx = 0;
  let done = 0;
  let failed = 0;
  const failedKeys = [];
  const errors = [];
  const blobUrls = new Map();

  async function worker() {
    while (idx < items.length) {
      const i = idx++;
      const item = items[i];
      let ok = false;
      let lastErr = "";
      for (let attempt = 0; attempt <= COVER_RETRIES && !ok; attempt++) {
        try {
          const resp = await fetch(COVER_PROXY + encodeURIComponent(item.url) + "&ua=" + encodeURIComponent(navigator.userAgent));
          if (!resp.ok) throw new Error("HTTP " + resp.status);
          const blob = await resp.blob();
          await idbPut(db, item.url, { blob });
          blobUrls.set(item.url, URL.createObjectURL(blob));
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
        failedKeys.push(item.url);
        errors.push({ url: item.url, error: lastErr });
        console.error("[错误] 封面下载失败", item.url, lastErr);
      }
      done++;
      if (onProgress) onProgress(done, items.length, failed);
      await sleep(COVER_INTERVAL_MS);
    }
  }

  const workers = [];
  for (let w = 0; w < COVER_CONCURRENCY; w++) workers.push(worker());
  await Promise.all(workers);
  return { failed, failedKeys, errors, blobUrls };
}

// 强制下载门槛 modal：下载 downloadItems 差异部分，完成后合并已缓存与新增封面。
// 条目以 URL 为标识；resolve({ blobUrls }) 表示可进入星图。
// onGlobalProgress(pct, text, label)：下载中的总进度同步，modal 内进度 0-100 映射到加载页。
function showCoverModal(db, downloadItems, existingBlobUrls, onGlobalProgress) {
  return new Promise((resolve) => {

    const modal = document.createElement("div");
    modal.className = "cover-modal";
    modal.innerHTML =
      '<div class="cover-box">' +
      '  <div class="cover-head">' +
      '    <span class="cover-title"></span>' +
      '    <button class="cover-close" title="拒绝下载">×</button>' +
      "  </div>" +
      '  <div class="cover-desc"></div>' +
      '  <div class="cover-warn hidden"></div>' +
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
    const warnEl = modal.querySelector(".cover-warn");
    const closeEl = modal.querySelector(".cover-close");
    const progressEl = modal.querySelector(".cover-progress");
    const fillEl = modal.querySelector(".cover-fill");
    const labelEl = modal.querySelector(".cover-label");
    const primaryBtn = modal.querySelector(".cover-btn.primary");
    const ghostBtn = modal.querySelector(".cover-btn.ghost");

    let state = "confirm";
    let pending = downloadItems.slice();
    let doneCount = 0;
    // 全量封面映射 = boot 已缓存的部分 + startDownload 累加的新下载部分
    const accumulated = new Map(existingBlobUrls);
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
        descEl.textContent = GRAPH_MODE === "author"
          ? "本图需要下载 " + downloadItems.length + " 位作者的头像才能正常使用。" +
            "头像将缓存到浏览器本地，下次打开无需重复下载。"
          : "本图需要下载 " + downloadItems.length + " 张模组封面才能正常使用。" +
            "封面将缓存到浏览器本地，下次打开无需重复下载。";
        warnEl.textContent =
          "警告：将以 " + COVER_CONCURRENCY + " 并发量下载 " + downloadItems.length + " 张封面。" +
          "高频请求可能触发 mcmod 风控，并占用网络资源。" +
          "点击“确定下载”即视为已知悉并接受风险，后果自负。";
        warnEl.classList.remove("hidden");
        primaryBtn.textContent = "确定下载";
        primaryBtn.classList.remove("hidden");
      } else {
        warnEl.classList.add("hidden");
      }
      if (state === "refuse") {
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
      if (onGlobalProgress) onGlobalProgress(pct, "正在下载封面…", text);
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
      for (const [k, v] of result.blobUrls) accumulated.set(k, v);

      if (result.failed > 0) {
        state = "failed";
        showState();
      } else {
        finish(accumulated);
      }
    }

    primaryBtn.addEventListener("click", async () => {
      if (state === "confirm") {
        startDownload(pending);
      } else if (state === "refuse") {
        startDownload(downloadItems.slice());
      } else if (state === "failed") {
        finish(accumulated);
      }
    });

    ghostBtn.addEventListener("click", () => {
      startDownload(failedKeys.map((k) => ({ url: k })));
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

// 探测 clean 标志，python server.py clean 启动时置位；true 时清空封面缓存，一次性
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

// 探测封面代理：ok=可用；missing=服务器存在但不支持代理，状态码 404；unreachable=无服务器
async function checkCoverProxy() {
  try {
    const resp = await fetch(COVER_PROXY);
    // server.py 对无参请求返回 400，非法 host 返回 403——都是端点存在
    return resp.status === 404 ? "missing" : "ok";
  } catch (e) {
    return "unreachable";
  }
}

// 代理不可用时的提示页，不提供服务
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

// ==================== 封面纹理预热 ====================
// sigma node-image 的封面纹理是渲染时按视口惰性注册的：新节点进视口 → 异步解码 →
// 500ms 防抖 → 同步画进 4096² atlas + 页增长时重编译 shader，全部卡在交互路径
// 作者图 1.9 万张会持续触发。预热：在加载期把全部封面注册并等 atlas 构建完成，
// 运行时不再有任何注册事件。
async function prewarmCovers(items, blobUrls, onProgress) {
  // 分流，hiRes 判定与 buildGraph 一致；同 URL 去重
  const normal = new Set();
  const hi = new Set();
  for (const it of items) {
    const src = blobUrls.get(it.url);
    if (!src) continue;
    (it.hiRes ? hi : normal).add(src);
  }
  const groups = [
    { program: FadingNodeImageProgram, sources: [...normal] },
    { program: FadingNodeImageProgramHi, sources: [...hi] },
  ];
  const total = normal.size + hi.size;
  if (!total) return 0;

  // 分批注册：registerImage 内部无解码并发上限，全量发起会引发解码风暴
  const BATCH = 300;
  const BATCH_GAP = 40;
  let registered = 0;
  for (const g of groups) {
    for (let i = 0; i < g.sources.length; i += BATCH) {
      const chunk = g.sources.slice(i, i + BATCH);
      for (const s of chunk) g.program.textureManager.registerImage(s);
      registered += chunk.length;
      if (onProgress) onProgress(registered, total, "注册");
      await sleep(BATCH_GAP);
    }
  }

  // 等待 atlas 构建完成：条目数连续稳定视为完成，加载失败的图不会进 atlas、由稳定判定放行
  // 注册只入队列，图片解码/入 atlas 才是真实进度，onProgress 带"解码"标记
  const countOf = (g) => Object.keys(g.program.textureManager.getAtlas()).length;
  const deadline = Date.now() + 120000; // 2 分钟兜底
  let last = -1;
  let stable = 0;
  while (Date.now() < deadline) {
    const done = groups.reduce((sum, g) => sum + countOf(g), 0);
    if (onProgress) onProgress(done, total, "解码");
    if (done >= total) return done;
    if (done === last) {
      if (++stable >= 4) return done; // ~1s 无增长，认为构建完成
    } else {
      stable = 0;
      last = done;
    }
    await sleep(250);
  }
  return groups.reduce((sum, g) => sum + countOf(g), 0);
}

// 从原始数据构建 graphology 图，multi 支持重复边；返回 graph、data、labelIndex
// 分片添加节点/边并让出主线程，回调 onProgress(done, total)；避免大图同步阻塞 UI
async function buildGraph(data, blobUrls, onProgress) {
  const graph = new Graph({ multi: true });
  const labelIndex = new Map(); // 小写名 -> [key 列表]
  const degMap = new Map();
  const teamFlag = new Map();   // key -> 是否团队，合作边三色用

  const nodeTotal = data.nodes.length;
  for (let i = 0; i < nodeTotal; i++) {
    const n = data.nodes[i];
    const deg = n.degree != null ? n.degree : (n.in_degree || 0); // 旧文件无 degree 时回退 in_degree
    const isTeam = !!n.is_team;
    degMap.set(n.key, deg);
    teamFlag.set(n.key, isTeam);
    const hasImage = n.type === "core" || n.type === "author";
    const sz = nodeSize(deg, n.type, isTeam, n.member_count);
    const hiRes = sz > COVER_HI_RES_THRESHOLD; // 大节点用 300px 高清封面
    // 封面以规范化 URL 为缓存键，blobUrls 跨图共享、与节点 id 解耦
    const cover = hasImage && n.cover_url ? (blobUrls.get(normalizeCoverUrl(n.cover_url)) || null) : null;
    graph.addNode(n.key, {
      x: typeof n.x === "number" ? n.x : Math.random() * 100,
      y: typeof n.y === "number" ? n.y : Math.random() * 100,
      size: sz,
      color: communityColor(n.community, n.type, n.team_community),
      label: n.label + "\n" + nodeKindLabel(n) + " " + n.key,
      name: n.label,
      name_en: n.name_en,
      description: n.description,
      kind: n.type,
      type: hasImage ? (hiRes ? "imageHi" : "image") : "circle",
      image: cover,
      views: n.views,
      favorites: n.favorites,
      category: n.category,
      status: n.status,
      in_degree: n.in_degree,
      out_degree: n.out_degree,
      degree: deg,
      pagerank: n.pagerank,
      community: n.community,
      rank: n.rank,
      density: n.density,
      is_team: isTeam,
      member_count: n.member_count || 0,
      members: (n.members || []).map(String),
      teams: (n.teams || []).map(String),
      team_community: n.team_community != null ? n.team_community : null,
    });
    if (n.label) {
      const k = n.label.toLowerCase();
      if (!labelIndex.has(k)) labelIndex.set(k, []);
      labelIndex.get(k).push(n.key);
    }
    if ((i + 1) % 2000 === 0) {
      if (onProgress) onProgress(i + 1, nodeTotal);
      await sleep(0);
    }
  }
  if (onProgress) onProgress(nodeTotal, nodeTotal);

  const edgeTotal = data.edges.length;
  for (let i = 0; i < edgeTotal; i++) {
    const e = data.edges[i];
    const importance = Math.min(degMap.get(e.source) || 0, degMap.get(e.target) || 0);
    const kind = e.type === "interaction" ? "interaction"
      : (e.type === "cooperation" ? "cooperation"
        : (e.type === "membership" ? "membership" : "dependency"));
    let rgb;
    if (kind === "cooperation" && GRAPH_MODE === "author") {
      const sTeam = teamFlag.get(e.source);
      const tTeam = teamFlag.get(e.target);
      rgb = sTeam && tTeam ? TEAM_TEAM_EDGE_RGB : (sTeam || tTeam ? TEAM_MIXED_EDGE_RGB : INDIVIDUAL_EDGE_RGB);
    } else if (kind === "membership") {
      rgb = MEMBER_EDGE_RGB;
    } else {
      rgb = kind === "interaction" ? INTERACTION_EDGE_RGB : DEPENDENCY_EDGE_RGB;
    }
    graph.addEdge(e.source, e.target, {
      size: GRAPH_MODE === "author" ? (kind === "membership" ? MEMBER_EDGE_SIZE : edgeSizeFor(e.weight)) : 0.5,
      color: premulRgba(rgb, kind === "membership" ? MEMBER_EDGE_ALPHA : EDGE_ALPHA),
      alpha: kind === "membership" ? MEMBER_EDGE_ALPHA : EDGE_ALPHA, // 导出绘制用，与屏幕一致
      type: "line",
      kind,
      rgb,
      importance,
      weight: e.weight,
      group_name: e.group_name || "",
    });
    if ((i + 1) % 5000 === 0) {
      if (onProgress) onProgress(i + 1, edgeTotal);
      await sleep(0);
    }
  }
  if (onProgress) onProgress(edgeTotal, edgeTotal);

  return { graph, data, labelIndex };
}

// 构建全局检索索引：label / name_en / key 的小写 term -> 节点集合
async function buildSearch(data, onProgress) {
  const index = new Map();
  const add = (term, n) => {
    if (!term) return;
    const k = term.toLowerCase();
    if (!index.has(k)) index.set(k, new Set());
    index.get(k).add(n);
  };
  const total = data.nodes.length;
  for (let i = 0; i < total; i++) {
    const n = data.nodes[i];
    add(n.label, n);
    add(n.name_en, n);
    add(n.key, n);
    if ((i + 1) % 5000 === 0) {
      if (onProgress) onProgress(i + 1, total);
      await sleep(0);
    }
  }
  if (onProgress) onProgress(total, total);
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
  // IHDR 固定字段：位深 8 / RGBA / 无压缩 / 无过滤 / 无隔行
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
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
  const searchFilters = document.getElementById("search-filters");
  const searchResults = document.getElementById("search-results");
  const searchList = document.getElementById("search-list");
  const searchPagination = document.getElementById("search-pagination");
  const statusText = document.getElementById("status-text");
  const progressFill = document.getElementById("progress-fill");
  const progressLabel = document.getElementById("progress-label");
  const panel = document.getElementById("panel");
  const panelToggle = document.getElementById("panel-toggle");
  const edgeDependency = document.getElementById("edge-dependency");
  const edgeInteraction = document.getElementById("edge-interaction");
  const showLabels = document.getElementById("show-labels");
  const showTeamsEl = document.getElementById("show-teams");
  const showAuthorsEl = document.getElementById("show-authors");
  const exportWidth = document.getElementById("export-width");
  const exportHeight = document.getElementById("export-height");
  const exportButton = document.getElementById("export-button");
  const exportWarning = document.getElementById("export-warning");
  const exportSinglePng = document.getElementById("export-single-png");

  let renderer = null;
  let graph = null;
  let searchIndex = null;
  let lodTimer = null;
  let culledEdges = new Set();
  let searchMatches = [];
  let searchPage = 0;
  // 作者图二级筛选状态，侧边栏全局检索用；模组图不使用
  const searchFilter = { kind: "all", rel: "all" };
  let allNodes = [];
  let showDependency = true;
  let showInteraction = true;
  let showTeams = true;       // 作者图：团队节点显隐，默认全开
  let showAuthors = true;     // 作者图：普通作者显隐，默认全开
  let hiddenNodeSet = new Set(); // 作者图按类型隐藏的节点，nodeReducer/edgeReducer 共用
  let highlightNodes = new Set();
  let highlightEdges = new Set();
  // 导出用全量封面映射，与屏幕渲染的 image 属性解耦、导出不受纹理限制影响
  let coverBlobUrls = new Map();
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
    setProgress(0, "加载数据中……", "");
    const data = await loadGraph((received, total) => {
      setProgress(
        Math.round((received / total) * 10),
        "加载数据中……",
        (received / 1048576).toFixed(1) + " / " + (total / 1048576).toFixed(1) + " MB"
      );
    });
    GRAPH_MODE = data.meta && data.meta.mode === "author" ? "author" : "mod";
    document.getElementById("search-input").placeholder =
      GRAPH_MODE === "author" ? "搜索作者名…" : "搜索模组名…";
    // 类型显隐开关仅作者图使用，mod 模式隐藏
    document.querySelectorAll(".author-only").forEach((el) => {
      el.style.display = GRAPH_MODE === "author" ? "" : "none";
    });
    renderMetaPanel(data.meta);
    setProgress(10, "正在读取封面缓存……", "");
    await new Promise((r) => setTimeout(r, 30));

    // 封面清单：有图的节点且带 URL，mod 为核心模组封面、author 为作者头像
    const coverItems = [];
    for (const n of data.nodes) {
      if (n.type !== "core" && n.type !== "author") continue;
      const url = normalizeCoverUrl(n.cover_url);
      if (url) coverItems.push({ key: n.key, url });
    }

    // 封面：按 URL 校验缓存，URL 为键跨图共享；缺失部分强制下载，拒绝不服务、失败可放行
    const db = await openCoverDB();
    if (await checkCleanFlag()) {
      await idbClear(db);
      console.log("[信息] 已清理封面缓存（clean 模式）");
    }
    let blobUrls;
    if (!coverItems.length) {
      console.warn("[警告] graph.json 无封面 URL，节点将显示为纯色圆");
      blobUrls = new Map();
    } else {
      const proxyStatus = await checkCoverProxy();
      if (proxyStatus !== "ok") {
        await showProxyErrorModal(proxyStatus);
        return;
      }
      const wantUrls = [...new Set(coverItems.map((it) => it.url))];
      const loaded = await loadAllCovers(db, wantUrls, (done, total) => {
        setProgress(
          10 + Math.round((Math.min(done, total) / Math.max(1, total)) * 5),
          "正在读取封面缓存……",
          done + " / " + total
        );
      });
      blobUrls = loaded.blobUrls;
      if (loaded.staleKeys.length) {
        const staleSet = new Set(loaded.staleKeys);
        // 需要下载的 URL 去重，同 URL 多节点共享、只下载一次
        const uniqueUrls = [...new Set(coverItems.filter((it) => staleSet.has(it.url)).map((it) => it.url))];
        const result = await showCoverModal(db, uniqueUrls.map((url) => ({ url })), blobUrls, (pct, text, label) => {
          // modal 内进度 0-100 映射到加载页 15-40
          setProgress(15 + Math.round(pct * 0.25), text, label);
        });
        blobUrls = result.blobUrls;
      }
    }

    // 封面纹理预热：把 atlas 惰性注册的卡顿移进加载期，等待构建完成再放行
    if (blobUrls.size) {
      const prewarmItems = [];
      for (const n of data.nodes) {
        if (n.type !== "core" && n.type !== "author") continue;
        const url = normalizeCoverUrl(n.cover_url);
        if (!url) continue;
        const deg = n.degree != null ? n.degree : (n.in_degree || 0);
        const isTeam = !!n.is_team;
        prewarmItems.push({
          url,
          hiRes: nodeSize(deg, n.type, isTeam, n.member_count) > COVER_HI_RES_THRESHOLD,
        });
      }
      // 两段进度：注册 40-52 快、解码/入 atlas 52-75 慢且是真实瓶颈
      await prewarmCovers(prewarmItems, blobUrls, (done, total, phase) => {
        const register = phase === "注册";
        const base = register ? 40 : 52;
        const span = register ? 12 : 23;
        const pct = base + Math.round((Math.min(done, total) / Math.max(1, total)) * span);
        setProgress(pct, register ? "正在注册封面图片…" : "正在解码封面图片…", done + " / " + total);
      });
    }

    // 构建图结构，进度 75-95：节点/边/索引分片让出主线程
    setProgress(75, "构建图结构……", "");
    const built = await buildGraph(data, blobUrls, (done, total) => {
      setProgress(
        75 + Math.round((Math.min(done, total) / Math.max(1, total)) * 15),
        "构建图结构……",
        done + " / " + total
      );
    });
    graph = built.graph;
    coverBlobUrls = blobUrls;
    searchIndex = await buildSearch(data, (done, total) => {
      setProgress(
        90 + Math.round((Math.min(done, total) / Math.max(1, total)) * 5),
        "构建搜索索引……",
        done + " / " + total
      );
    });
    allNodes = sortNodes([...data.nodes]);
    searchMatches = [...allNodes];
    searchPage = 0;
    renderSearchResults();

    setProgress(95, "渲染中……", "");
    await new Promise((r) => setTimeout(r, 30));

    renderer = new Sigma(graph, container, {
      renderLabels: true,
      renderEdgeLabels: false,
      hideEdgesOnMove: false,
      enableEdgeEvents: true,
      // 节点尺寸与坐标同单位，即世界单位；去重叠才能与渲染一致
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
      nodeProgramClasses: {
        image: FadingNodeImageProgram,
        imageHi: FadingNodeImageProgramHi,
      },
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
      // 直接判定可见性：筛选开关 + 视口裁剪，culledEdges 查询放最后、被筛选隐藏的边短路跳过
      if ((attrs.kind === "dependency" && !showDependency) ||
          (attrs.kind === "interaction" && !showInteraction) ||
          culledEdges.has(edge) ||
          hiddenNodeSet.has(graph.source(edge)) ||
          hiddenNodeSet.has(graph.target(edge))) {
        return { ...attrs, hidden: true };
      }
      return attrs;
    });

    renderer.setSetting("nodeReducer", (node, attr) => {
      if (highlightNodes.has(node)) {
        return { ...attr, hidden: false, color: HIGHLIGHT_NODE_COLOR };
      }
      if (hiddenNodeSet.has(node)) return { ...attr, hidden: true };
      return attr;
    });

    const cam = renderer.getCamera();
    let lodLastRun = 0;
    cam.on("updated", () => {
      const now = performance.now();
      const applyLod = () => {
        lodLastRun = performance.now();
        const state = cam.getState();
        updateCulling(state);
      };
      const elapsed = now - lodLastRun;
      if (elapsed >= LOD_THROTTLE_MS) {
        if (lodTimer) { clearTimeout(lodTimer); lodTimer = null; }
        applyLod();
      } else if (!lodTimer) {
        // 定时器只设一次不重置：保证缩放中每 33ms 至少更新一次视口裁剪
        lodTimer = setTimeout(() => {
          lodTimer = null;
          applyLod();
        }, LOD_THROTTLE_MS - elapsed);
      }
    });
    updateCulling(cam.getState());

    // 触发首次渲染并等待首帧绘制，封面纹理已在预热阶段全部入 atlas、无需额外等待
    renderer.refresh();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    setProgress(100, "渲染完成", "");

    renderer.scheduleRefresh();
    finishLoading();
  }

  function bindEvents() {
    renderer.on("enterNode", ({ node }) => {
      hoveredNode = node;
      if (altLock) return; // Alt 锁定时内容与位置都锁定，仅记录 hover 状态
      const attrs = graph.getNodeAttributes(node);
      showTooltip(node, attrs);
    });

    renderer.on("leaveNode", () => {
      hoveredNode = null;
      if (!altLock) hideTooltip();
    });

    renderer.on("clickNode", ({ node }) => {
      const base = GRAPH_MODE === "author" ? "author" : "class";
      window.open("https://www.mcmod.cn/" + base + "/" + node + ".html", "_blank");
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

    // 防抖：索引大，作者图约 5.7 万 term；每次按键全扫 + 排序代价高
    const debouncedSearch = debounce(() => {
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
      searchMatches = sortNodes([...matched]);
      searchPage = 0;
      renderSearchResults();
    }, 150);

    searchInput.addEventListener("input", debouncedSearch);

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        debouncedSearch.flush(); // 输入后立即 Enter：先渲染当前结果再取第一个
        const first = searchList.querySelector("li");
        if (first) first.click();
      }
    });

    panelToggle.addEventListener("click", () => {
      const collapsed = panel.classList.toggle("collapsed");
      panelToggle.textContent = collapsed ? "»" : "«";
      panelToggle.title = collapsed ? "展开侧边栏" : "收起侧边栏";
    });

    edgeDependency.addEventListener("change", () => {
      showDependency = edgeDependency.checked;
      renderer.scheduleRefresh(); // reducer 读最新开关
    });
    edgeInteraction.addEventListener("change", () => {
      showInteraction = edgeInteraction.checked;
      renderer.scheduleRefresh();
    });
    showLabels.addEventListener("change", () => {
      renderer.setSetting("renderLabels", showLabels.checked);
    });

    // 作者图类型显隐：维护 hiddenNodeSet，两端被隐藏的边一并隐藏
    function updateHiddenNodes() {
      hiddenNodeSet = new Set();
      if (showTeams && showAuthors) return;
      graph.forEachNode((node, attrs) => {
        if ((attrs.is_team && !showTeams) || (!attrs.is_team && !showAuthors)) hiddenNodeSet.add(node);
      });
    }
    showTeamsEl.addEventListener("change", () => {
      showTeams = showTeamsEl.checked;
      updateHiddenNodes();
      renderer.scheduleRefresh();
    });
    showAuthorsEl.addEventListener("change", () => {
      showAuthors = showAuthorsEl.checked;
      updateHiddenNodes();
      renderer.scheduleRefresh();
    });

    exportButton.addEventListener("click", exportPNG);

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
    let list = searchMatches;
    // 作者图：二级筛选，第一级类型 × 第二级关系；计数来自未筛选的搜索池
    if (GRAPH_MODE === "author") {
      const pool = searchMatches;
      searchFilters.innerHTML = "";
      searchFilters.appendChild(buildFilterBar(
        {
          all: pool.length,
          team: pool.filter((n) => n.is_team).length,
          author: pool.filter((n) => !n.is_team).length,
        },
        [
          { key: "coop", label: "合作", count: pool.filter((n) => (n.degree || 0) > 0).length },
          { key: "contains", label: "包含", count: pool.filter((n) => n.is_team).length },
          { key: "belongs", label: "属于", count: pool.filter((n) => n.teams && n.teams.length).length },
        ],
        searchFilter,
        () => {
          searchPage = 0;
          renderSearchResults();
        }
      ));
      list = filterNodesByKind(filterNodesByRel(pool, searchFilter.rel), searchFilter.kind);
    }

    const pageSize = 10;
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (searchPage >= pages) searchPage = pages - 1;
    const start = searchPage * pageSize;
    const page = list.slice(start, start + pageSize);

    for (const n of page) {
      const li = document.createElement("li");
      li.textContent = n.label + (n.name_en ? " (" + n.name_en + ")" : "");
      li.title = nodeKindLabel(n) + " " + n.key;
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
    // 只更新集合不做 diff/不刷新——edgeReducer 每帧读最新 culledEdges
    culledEdges = next;
  }

  function focusNode(key) {
    if (!renderer || !graph) return;
    const nd = renderer.getNodeDisplayData(key);
    if (!nd) return;
    const cam = renderer.getCamera();
    const size = graph.getNodeAttribute(key, "size") || 2; // 半径，世界单位
    const width = renderer.getDimensions().width;
    // 节点屏幕直径 = 2 * size * graphToViewportRatio，且 graphToViewportRatio = C / ratio。
    // 令直径等于屏宽 * NODE_DIAMETER_SCREEN_RATIO，反解出目标 ratio。
    const C = renderer.getGraphToViewportRatio() * cam.getState().ratio;
    const targetRatio = (2 * size * C) / (NODE_DIAMETER_SCREEN_RATIO * width);
    cam.animate({ x: nd.x, y: nd.y, ratio: targetRatio }, { duration: 600 });
  }

  function teamNames(ids) {
    // 团队 id 列表 → 名称，图上查不到时回退为 id 本身
    return ids.map((id) => {
      const a = graph.getNodeAttributes(String(id));
      return a && a.name ? a.name : String(id);
    }).join("、");
  }

  function showTooltip(node, attrs) {
    const lines = [];
    lines.push("<div class='tt-title'>" + escapeHtml(attrs.name) + "</div>");
    if (attrs.name_en) lines.push("<div class='tt-sub'>" + escapeHtml(attrs.name_en) + "</div>");
    if (attrs.description) lines.push("<div class='tt-desc'>" + attrs.description + "</div>");
    const kindText = GRAPH_MODE === "author" ? nodeKindLabel(attrs) : (attrs.kind === "core" ? "核心模组" : "外部引用");
    lines.push("<div class='tt-meta'>" + kindText + " · " + escapeHtml(attrs.category || "无分类") + "</div>");
    if (GRAPH_MODE === "author") {
      if (attrs.is_team) {
        lines.push("<div class='tt-meta team'>团队 · " + attrs.member_count + " 名成员</div>");
      } else if (attrs.teams && attrs.teams.length) {
        lines.push("<div class='tt-meta team'>参与团队：" + escapeHtml(teamNames(attrs.teams)) + "</div>");
      }
    }
    if (attrs.status) lines.push("<div class='tt-meta'>状态：" + escapeHtml(attrs.status) + "</div>");
    lines.push("<div class='tt-stats'>浏览量 " + formatNum(attrs.views) + " · 收藏 " + formatNum(attrs.favorites) + "</div>");
    if (GRAPH_MODE === "author") {
      lines.push("<div class='tt-stats'>合作度 " + (attrs.degree != null ? attrs.degree : 0) + " · PageRank " + attrs.pagerank.toFixed(5) + "</div>");
    } else {
      lines.push("<div class='tt-stats'>被依赖 " + attrs.in_degree + " · 依赖 " + attrs.out_degree + " · PageRank " + attrs.pagerank.toFixed(5) + "</div>");
    }
    lines.push("<div class='tt-hint'>点击跳转 mcmod 页面</div>");
    tooltipEl.innerHTML = lines.join("");
    tooltipEl.classList.remove("hidden");
    positionTooltip();
  }

  function hideTooltip() {
    tooltipEl.classList.add("hidden");
  }

  function positionTooltip() {
    if (altLock) return; // Alt 锁定时不跟随鼠标
    const pad = 12;
    const w = tooltipEl.offsetWidth;
    const h = tooltipEl.offsetHeight;
    let x = lastMouse.x + pad;
    let y = lastMouse.y + pad;
    if (x + w > window.innerWidth) x = lastMouse.x - w - pad;
    if (y + h > window.innerHeight) y = lastMouse.y - h - pad;
    // 钳制到窗口内，翻转后仍可能超界，如 tooltip 比鼠标到边缘的距离还宽或高
    x = Math.max(pad, Math.min(x, window.innerWidth - w - pad));
    y = Math.max(pad, Math.min(y, window.innerHeight - h - pad));
    tooltipEl.style.left = x + "px";
    tooltipEl.style.top = y + "px";
  }

  let lastMouse = { x: 0, y: 0 };
  let hoveredNode = null; // 当前悬浮的节点，Alt 松开时决定是否隐藏
  let altLock = false;    // Alt 按住时锁定 tooltip，不消失、不跟随
  let lastAltPress = 0;   // 上次 Alt 按下时间，用于双击检测
  const ALT_DOUBLE_MS = 300;

  window.addEventListener("keydown", (e) => {
    if (e.key === "Alt") {
      e.preventDefault();
      altLock = true;
      const now = performance.now();
      if (now - lastAltPress < ALT_DOUBLE_MS) {
        lastAltPress = 0;
        // 双击 Alt：侧边栏收起时切换显隐，完全隐藏与恢复（展开状态不响应）
        if (panel.classList.contains("collapsed") || panel.style.display === "none") {
          panel.style.display = panel.style.display === "none" ? "" : "none";
        }
      } else {
        lastAltPress = now;
      }
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.key === "Alt") {
      altLock = false;
      if (!hoveredNode) hideTooltip();
    }
  });
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

  function nodeDeg(key) {
    const a = graph.getNodeAttributes(key);
    return a.degree != null ? a.degree : (a.in_degree || 0);
  }

  function collectRelations(key) {
    // 作者模式：无方向，全部邻居即合作者；另有参与团队/团队成员列表
    if (GRAPH_MODE === "author") {
      const attrs = graph.getNodeAttributes(key);
      const byDeg = (a, b) => nodeDeg(b) - nodeDeg(a);
      const partners = new Set();
      // 合作者仅统计合作边，成员-团队边是结构连接、不算合作
      graph.forEachEdge((edge, eAttrs, source, target) => {
        if (eAttrs.kind !== "cooperation") return;
        if (source === key) partners.add(target);
        else if (target === key) partners.add(source);
      });
      const teams = (attrs.teams || []).filter((id) => graph.hasNode(String(id)));
      const members = (attrs.members || []).filter((id) => graph.hasNode(String(id)));
      return {
        partners: [...partners].sort(byDeg),
        teams: [...teams].sort(byDeg),
        members: [...members].sort(byDeg),
      };
    }

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

    const byInDegree = (a, b) => nodeDeg(b) - nodeDeg(a);

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
    lines.push(nodeKindLabel(attrs) + " " + key);
    if (GRAPH_MODE === "author") {
      if (attrs.is_team) lines.push("团队 · " + attrs.member_count + " 名成员");
      else if (attrs.teams && attrs.teams.length) lines.push("参与团队 " + teamNames(attrs.teams));
      lines.push("合作度 " + (attrs.degree != null ? attrs.degree : 0));
    } else {
      lines.push("被依赖 " + attrs.in_degree + " · 依赖 " + attrs.out_degree);
    }
    lines.push("浏览量 " + formatNum(attrs.views));
    lines.push("收藏 " + formatNum(attrs.favorites));
    if (attrs.category) lines.push("分类 " + attrs.category);
    if (attrs.status) lines.push("状态 " + attrs.status);
    return lines.join("\n");
  }

  const REL_LABELS = { dependsOn: "依赖", dependedBy: "被依赖", interacts: "联动", partners: "合作", teams: "团队", members: "成员" };

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
    if (renderer) renderer.scheduleRefresh();
  }

  function showSixDegreesMenu(source, x, y) {
    const state = { query: "", page: 0, target: null, result: null };
    const filter = { kind: "all", rel: "all" }; // 作者图二级筛选状态
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
    input.placeholder = GRAPH_MODE === "author" ? "搜索目标作者…" : "搜索目标模组…";
    searchWrap.appendChild(input);
    contextMenu.appendChild(searchWrap);

    const filterEl = document.createElement("div");
    filterEl.className = "ctx-filters";
    contextMenu.appendChild(filterEl);

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
      filterEl.innerHTML = "";
      const q = state.query.trim().toLowerCase();
      let pool = [];
      if (q) {
        const seen = new Set();
        for (const [term, nodes] of searchIndex) {
          if (term.includes(q)) {
            for (const n of nodes) {
              if (!seen.has(n.key)) {
                seen.add(n.key);
                pool.push(n);
              }
            }
          }
        }
      } else {
        pool = [...allNodes];
      }
      // 作者图二级筛选，计数来自未筛选池
      if (GRAPH_MODE === "author") {
        filterEl.appendChild(buildFilterBar(
          {
            all: pool.length,
            team: pool.filter((n) => n.is_team).length,
            author: pool.filter((n) => !n.is_team).length,
          },
          [
            { key: "coop", label: "合作", count: pool.filter((n) => (n.degree || 0) > 0).length },
            { key: "contains", label: "包含", count: pool.filter((n) => n.is_team).length },
            { key: "belongs", label: "属于", count: pool.filter((n) => n.teams && n.teams.length).length },
          ],
          filter,
          () => {
            state.page = 0;
            state.target = null;
            detectBtn.disabled = true;
            renderList();
            positionMenu(x, y);
          }
        ));
      }
      let matches = GRAPH_MODE === "author"
        ? filterNodesByKind(filterNodesByRel(pool, filter.rel), filter.kind)
        : pool;
      matches = sortNodes(matches);

      const pageSize = 20;
      const pages = Math.max(1, Math.ceil(matches.length / pageSize));
      if (state.page >= pages) state.page = pages - 1;
      const start = state.page * pageSize;
      const page = matches.slice(start, start + pageSize);

      for (const n of page) {
        const li = document.createElement("div");
        li.className = "ctx-item" + (state.target === n.key ? " selected" : "");
        li.textContent = n.label + (n.name_en ? " (" + n.name_en + ")" : "");
        li.title = nodeKindLabel(n) + " " + n.key;
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
          } else if (kind === "cooperation") {
            label = "合作";
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
    const onSixInput = debounce(() => {
      state.query = input.value;
      state.page = 0;
      state.target = null;
      detectBtn.disabled = true;
      renderList();
      positionMenu(x, y);
    }, 150);
    input.addEventListener("input", onSixInput);

    renderList();
    contextMenu.classList.remove("hidden");
    positionMenu(x, y);
    input.focus();
  }

  function showNodeMenu(node, x, y) {
    const attrs = graph.getNodeAttributes(node);
    const rel = collectRelations(node);
    const state = { title: attrs.name || node, rel, tab: "all", page: 0, query: "" };
    const filter = { kind: "all", rel: "all" }; // 作者图二级筛选状态

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
    input.placeholder = GRAPH_MODE === "author" ? "搜索…" : "搜索关联模组…";
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

    // 作者图：全部关系的去重并集，作为第二级"全部"的池 + 第一级计数
    const unionKeys = GRAPH_MODE === "author"
      ? [...new Set([...state.rel.partners, ...state.rel.teams, ...state.rel.members])]
      : [];

    function kindCounts(keys) {
      if (GRAPH_MODE !== "author") return { all: 0, team: 0, author: 0 };
      const team = keys.filter((k) => graph.getNodeAttribute(k, "is_team")).length;
      return { all: keys.length, team, author: keys.length - team };
    }

    // 作者图第二级条目：合作恒有；包含仅团队节点；属于仅有上级团队
    function relItems() {
      const items = [{ key: "coop", label: "合作", count: state.rel.partners.length }];
      if (attrs.is_team) {
        items.push({ key: "contains", label: "包含", count: state.rel.members.length });
      }
      if ((attrs.teams || []).length) {
        items.push({ key: "belongs", label: "属于", count: state.rel.teams.length });
      }
      return items;
    }

    function tabCount(key) {
      if (key === "all") {
        return state.rel.dependsOn.length + state.rel.dependedBy.length + state.rel.interacts.length;
      }
      return state.rel[key].length;
    }

    function activeList() {
      // 作者模式：第二级关系池 × 第一级类型筛选
      if (GRAPH_MODE === "author") {
        let keys;
        if (filter.rel === "coop") keys = state.rel.partners;
        else if (filter.rel === "contains") keys = state.rel.members;
        else if (filter.rel === "belongs") keys = state.rel.teams;
        else keys = unionKeys;
        if (filter.kind === "team") keys = keys.filter((k) => graph.getNodeAttribute(k, "is_team"));
        else if (filter.kind === "author") keys = keys.filter((k) => !graph.getNodeAttribute(k, "is_team"));
        // 徽章类型：成员 > 团队 > 合作，"全部"池里一个节点可能属多个关系
        const items = keys.map((key) => {
          let type = null;
          if (filter.rel === "all") {
            if (state.rel.members.includes(key)) type = "members";
            else if (state.rel.teams.includes(key)) type = "teams";
            else type = "partners";
          } else {
            type = filter.rel === "coop" ? "partners" : filter.rel;
          }
          return { key, type };
        });
        items.sort((a, b) => nodeDeg(b.key) - nodeDeg(a.key));
        return items;
      }

      // 模组模式：原 tab 逻辑
      const items = [];
      if (state.tab === "all") {
        for (const key of state.rel.dependsOn) items.push({ key, type: "dependsOn" });
        for (const key of state.rel.dependedBy) items.push({ key, type: "dependedBy" });
        for (const key of state.rel.interacts) items.push({ key, type: "interacts" });
        items.sort((a, b) => nodeDeg(b.key) - nodeDeg(a.key));
      } else {
        for (const key of state.rel[state.tab]) items.push({ key, type: null });
      }
      return items;
    }

    function renderTabs() {
      tabs.innerHTML = "";
      // 作者模式：二级筛选条，第一级类型 × 第二级关系
      if (GRAPH_MODE === "author") {
        tabs.appendChild(buildFilterBar(kindCounts(unionKeys), relItems(), filter, () => {
          state.page = 0;
          renderTabs();
          renderBody();
          positionMenu(x, y);
        }));
        return;
      }
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
    const kind = graph.getEdgeAttribute(edge, "kind");
    titleEl.textContent = GRAPH_MODE === "author"
      ? (kind === "membership" ? "成员" : (kind === "cooperation" ? "合作" : "关系"))
      : "关系";
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

  function drawEdges(ctx, tx, ty, scale) {
    // renderSingle 单画布导出：一次全量遍历，无分块裁剪
    graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
      const rgb = attrs.rgb || DEPENDENCY_EDGE_RGB;
      ctx.strokeStyle = rgbaString(rgb, attrs.alpha != null ? attrs.alpha : EDGE_ALPHA);
      ctx.lineWidth = Math.max(1, (attrs.size || 0.5) * scale);
      ctx.beginPath();
      ctx.moveTo(tx(sa.x), ty(sa.y));
      ctx.lineTo(tx(ta.x), ty(ta.y));
      ctx.stroke();
    });
  }

  // renderTiled 分块导出的边绘制：只画预筛进本行带的边，像素坐标已算好
  function drawEdgesBand(ctx, edges, tileX0, tileY0, tileW) {
    for (const e of edges) {
      // 列过滤：bbox 与 tile x 区间无交集则跳过，y 方向已由行带预筛保证覆盖
      if (Math.max(e.ax, e.bx) + e.half < tileX0 || Math.min(e.ax, e.bx) - e.half > tileX0 + tileW) continue;
      ctx.strokeStyle = rgbaString(e.rgb, e.alpha);
      ctx.lineWidth = e.lineWidth;
      ctx.beginPath();
      ctx.moveTo(e.ax - tileX0, e.ay - tileY0);
      ctx.lineTo(e.bx - tileX0, e.by - tileY0);
      ctx.stroke();
    }
  }

  function drawLabel(ctx, cx, cy, r, attrs, labelScale) {
    const name = attrs.name || attrs.key;
    const idText = nodeKindLabel(attrs) + " " + attrs.key;
    const fontSize = LABEL_FONT_SIZE * (labelScale || 1);
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

  async function drawNodesAt(ctx, items, onProgress, labelScale) {
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
        // 导出用独立的全量封面映射 coverBlobUrls，不依赖屏幕渲染的 image 属性
        const src = coverBlobUrls.get(attrs.key) || attrs.image;
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

        drawLabel(ctx, cx, cy, r, attrs, labelScale);

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

  async function renderSingle(W, H, scale, nodePixels, toX, toY) {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, W, H);

    drawEdges(ctx, toX, toY, scale);

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

  async function renderTiled(W, H, scale, nodePixels, toX, toY) {
    const TILE_W = 8192;
    const TILE_H = 256; // 行带高度：内存峰值 = W×TILE_H×4，65536 导出约 67MB，原 1024 时为 268MB
    const cols = Math.ceil(W / TILE_W);
    const rows = Math.ceil(H / TILE_H);
    const totalTiles = cols * rows;
    let renderedTiles = 0;
    const startTime = Date.now();
    const labelBottom = LABEL_FONT_SIZE * 3.25;

    // 预计算行带 → 节点，含标签纵向延伸；避免每 tile 全量扫描全部节点
    const bandNodes = Array.from({ length: rows }, () => []);
    for (const n of nodePixels) {
      const top = Math.max(0, Math.floor((n.py - n.pr) / TILE_H));
      const bottom = Math.min(rows - 1, Math.floor((n.py + n.pr + labelBottom) / TILE_H));
      for (let r = top; r <= bottom; r++) bandNodes[r].push(n);
    }

    // 预筛边 → 行带，对称 bandNodes；像素 bbox 归入覆盖的行带。
    // 避免每 tile 全量遍历全部边，作者图 4.7 万条边 × 2048 tile 从约 30 秒降到 1 秒内
    const bandEdges = Array.from({ length: rows }, () => []);
    graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
      const ax = toX(sa.x), ay = toY(sa.y);
      const bx = toX(ta.x), by = toY(ta.y);
      const lineWidth = Math.max(1, (attrs.size || 0.5) * scale);
      const half = lineWidth / 2 + 1;
      const top = Math.max(0, Math.floor((Math.min(ay, by) - half) / TILE_H));
      const bottom = Math.min(rows - 1, Math.floor((Math.max(ay, by) + half) / TILE_H));
      const item = {
        ax, ay, bx, by, half, lineWidth,
        rgb: attrs.rgb || DEPENDENCY_EDGE_RGB,
        alpha: attrs.alpha != null ? attrs.alpha : EDGE_ALPHA,
      };
      for (let r = top; r <= bottom; r++) bandEdges[r].push(item);
    });

    async function* getScanlines() {
      for (let r = 0; r < rows; r++) {
        const tileY0 = r * TILE_H;
        const tileH = Math.min(TILE_H, H - tileY0);
        const band = bandNodes[r];
        const bandE = bandEdges[r];

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

          drawEdgesBand(ctx, bandE, tileX0, tileY0, tileW);

          const items = [];
          for (const n of band) {
            // 标签从节点底部向下延伸，两行文字 + 内边距 + 间距；横向用保守余量
            // 覆盖长名称，确保标签跨越的 tile 都包含该节点，拼图后标签不被截断。
            const labelHalf = Math.max(n.pr, LABEL_FONT_SIZE * 16);
            if (n.px + labelHalf >= tileX0 && n.px - labelHalf <= tileX0 + tileW) {
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

        // 横向拼接成完整宽度的扫描行，PNG 每行必须为 W 宽
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

  // ZIP 无压缩 STORE 打包：files 为 name/bytes 条目数组，返回 Blob。瓦片本身已是 PNG 压缩数据，无需二次压缩
  async function zipStore(files) {
    const parts = [];
    const central = [];
    let offset = 0;
    let cdBytes = 0;
    const enc = new TextEncoder();
    for (const f of files) {
      const name = enc.encode(f.name);
      const crc = crc32(f.bytes, 0, f.bytes.length);
      const size = f.bytes.length;
      // Local File Header
      const lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true);
      lh.setUint16(4, 20, true);
      lh.setUint16(6, 0x800, true); // UTF-8 文件名
      lh.setUint16(8, 0, true);     // method: store
      lh.setUint16(10, 0, true);
      lh.setUint16(12, 0x21, true);
      lh.setUint32(14, crc, true);
      lh.setUint32(18, size, true);
      lh.setUint32(22, size, true);
      lh.setUint16(26, name.length, true);
      lh.setUint16(28, 0, true);
      parts.push(lh.buffer, name, f.bytes.buffer);
      // Central Directory Header
      const ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true);
      ch.setUint16(4, 20, true);
      ch.setUint16(6, 20, true);
      ch.setUint16(8, 0x800, true);
      ch.setUint16(10, 0, true);
      ch.setUint16(12, 0, true);
      ch.setUint16(14, 0x21, true);
      ch.setUint32(16, crc, true);
      ch.setUint32(20, size, true);
      ch.setUint32(24, size, true);
      ch.setUint16(28, name.length, true);
      ch.setUint16(30, 0, true);
      ch.setUint16(32, 0, true);
      ch.setUint16(34, 0, true);
      ch.setUint16(36, 0, true);
      ch.setUint32(38, 0, true);
      ch.setUint32(42, offset, true);
      central.push(ch.buffer, name);
      offset += 30 + name.length + size;
      cdBytes += 46 + name.length;
    }
    // End Of Central Directory
    const eocd = new DataView(new ArrayBuffer(22));
    eocd.setUint32(0, 0x06054b50, true);
    eocd.setUint16(4, 0, true);
    eocd.setUint16(6, 0, true);
    eocd.setUint16(8, files.length, true);
    eocd.setUint16(10, files.length, true);
    eocd.setUint32(12, cdBytes, true);
    eocd.setUint32(16, offset, true);
    eocd.setUint16(20, 0, true);
    parts.push(...central, eocd.buffer);
    return new Blob(parts, { type: "application/zip" });
  }

  // 瓦片查看器 HTML：内嵌极简查看器，支持拖拽、滚轮缩放、按视口懒加载瓦片；file:// 直接可用
  function viewerHtml(W, H, maxLevel) {
    const css =
      "html,body{margin:0;height:100%;background:#000;overflow:hidden;font-family:system-ui,sans-serif}" +
      "#view{position:fixed;inset:0;cursor:grab;touch-action:none}" +
      "#view.drag{cursor:grabbing}" +
      "#hint{position:fixed;left:10px;bottom:10px;color:#888;font-size:12px;background:rgba(0,0,0,.5);padding:4px 8px;border-radius:4px;pointer-events:none}";
    const js =
      "const W=" + W + ",H=" + H + ",TILE=" + EXPORT_TILE + ",MAX_LEVEL=" + maxLevel + ";" +
      "const c=document.getElementById('view'),ctx=c.getContext('2d');" +
      "let vw=0,vh=0;" +
      "function rs(){vw=c.width=innerWidth;vh=c.height=innerHeight;}" +
      "addEventListener('resize',rs);rs();" +
      "let s=Math.min(vw/W,vh/H)*.95,ox=(vw-W*s)/2,oy=(vh-H*s)/2;" +
      "const cache=new Map(),pending=new Set();" +
      "function lvl(){return Math.max(0,Math.min(MAX_LEVEL,Math.ceil(Math.log2(1/s))));}" +
      "function draw(){ctx.fillStyle='#000';ctx.fillRect(0,0,vw,vh);" +
      "const l=lvl(),div=1<<l,span=TILE*div;" +
      "const x0=-ox/s,x1=(vw-ox)/s,y0=-oy/s,y1=(vh-oy)/s;" +
      "const c0=Math.max(0,Math.floor(x0/span)),c1=Math.min(Math.ceil(W/span)-1,Math.floor(x1/span));" +
      "const r0=Math.max(0,Math.floor(y0/span)),r1=Math.min(Math.ceil(H/span)-1,Math.floor(y1/span));" +
      "for(let r=r0;r<=r1;r++)for(let cc=c0;cc<=c1;cc++){" +
      "const key=l+':'+cc+':'+r,img=cache.get(key);" +
      "if(img)ctx.drawImage(img,ox+cc*span*s,oy+r*span*s,span*s,span*s);" +
      "else if(!pending.has(key)){pending.add(key);load(key,l,cc,r);}}" +
      "}" +
      "function load(key,l,cc,r){const im=new Image();" +
      "im.onload=()=>{cache.set(key,im);pending.delete(key);draw();};" +
      "im.onerror=()=>pending.delete(key);" +
      "im.src='tiles/'+l+'/'+cc+'_'+r+'.png';}" +
      "let drag=false,lx=0,ly=0;" +
      "c.addEventListener('mousedown',e=>{drag=true;lx=e.clientX;ly=e.clientY;c.classList.add('drag');});" +
      "addEventListener('mousemove',e=>{if(!drag)return;ox+=e.clientX-lx;oy+=e.clientY-ly;lx=e.clientX;ly=e.clientY;draw();});" +
      "addEventListener('mouseup',()=>{drag=false;c.classList.remove('drag');});" +
      "c.addEventListener('wheel',e=>{e.preventDefault();" +
      "const f=Math.exp(-e.deltaY*.0012),nx=e.clientX,ny=e.clientY;" +
      "const gx=(nx-ox)/s,gy=(ny-oy)/s;" +
      "s=Math.min(Math.max(s*f,Math.min(vw/W,vh/H)*.5),2);" +
      "ox=nx-gx*s;oy=ny-gy*s;draw();},{passive:false});" +
      "let t=null;" +
      "c.addEventListener('touchstart',e=>{t={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});" +
      "c.addEventListener('touchmove',e=>{if(!t)return;ox+=e.touches[0].clientX-t.x;oy+=e.touches[0].clientY-t.y;t={x:e.touches[0].clientX,y:e.touches[0].clientY};draw();},{passive:true});" +
      "c.addEventListener('touchend',()=>{t=null;});" +
      "draw();";
    return (
      "<!DOCTYPE html>\n<html lang='zh-CN'>\n<head>\n<meta charset='utf-8'>\n" +
      "<meta name='viewport' content='width=device-width,initial-scale=1'>\n" +
      "<title>星图导出</title>\n<style>" + css + "</style>\n</head>\n<body>\n" +
      "<canvas id='view'></canvas>\n<div id='hint'>拖拽平移 · 滚轮缩放</div>\n" +
      "<script>" + js + "</scr" + "ipt>\n</body>\n</html>"
    );
  }

  // 金字塔瓦片渲染：level 0 = 全尺寸，与单张导出同几何；每级降采样 1/2，
  // 各级严格对齐，level l 坐标 = level0 坐标 / 2^l；瓦片命名 tiles/级别/列_行.png
  async function renderPyramidTiles(W, H, scale0, ox0, oy0, minX, minY, nodePixels0, onProgress) {
    const maxDim = Math.max(W, H);
    const maxLevel = Math.max(0, Math.ceil(Math.log2(maxDim / MIN_LEVEL_SIZE)));
    // level 0 像素空间坐标映射，与单张导出同几何
    const toX0 = (x) => (x - minX) * scale0 + ox0;
    const toY0 = (y) => (y - minY) * scale0 + oy0;
    let total = 0;
    for (let l = 0; l <= maxLevel; l++) {
      const d = 1 << l;
      total += Math.ceil(Math.ceil(W / d) / EXPORT_TILE) * Math.ceil(Math.ceil(H / d) / EXPORT_TILE);
    }
    const files = [];
    let done = 0;
    const labelBottom = LABEL_FONT_SIZE * 3.25;

    for (let l = 0; l <= maxLevel; l++) {
      const d = 1 << l;
      const Wl = Math.ceil(W / d), Hl = Math.ceil(H / d);
      const cols = Math.ceil(Wl / EXPORT_TILE), rows = Math.ceil(Hl / EXPORT_TILE);
      const labelScale = 1 / d; // 标签随降采样缩小，避免高层级标签占满画面

      // 行带预筛节点，含标签纵向延伸
      const bandNodes = Array.from({ length: rows }, () => []);
      for (const n of nodePixels0) {
        const px = n.px / d, py = n.py / d, pr = n.pr / d;
        const top = Math.max(0, Math.floor((py - pr) / EXPORT_TILE));
        const bottom = Math.min(rows - 1, Math.floor((py + pr + labelBottom * labelScale) / EXPORT_TILE));
        for (let r = top; r <= bottom; r++) bandNodes[r].push({ attrs: n.attrs, px, py, pr });
      }

      // 行带预筛边，用该级像素坐标、几何对齐 level 0
      const bandEdges = Array.from({ length: rows }, () => []);
      graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
        const ax = (toX0(sa.x)) / d, ay = (toY0(sa.y)) / d;
        const bx = (toX0(ta.x)) / d, by = (toY0(ta.y)) / d;
        const lineWidth = Math.max(1, (attrs.size || 0.5) * scale0 / d);
        const half = lineWidth / 2 + 1;
        const top = Math.max(0, Math.floor((Math.min(ay, by) - half) / EXPORT_TILE));
        const bottom = Math.min(rows - 1, Math.floor((Math.max(ay, by) + half) / EXPORT_TILE));
        const item = {
          ax, ay, bx, by, half, lineWidth,
          rgb: attrs.rgb || DEPENDENCY_EDGE_RGB,
          alpha: attrs.alpha != null ? attrs.alpha : EDGE_ALPHA,
        };
        for (let r = top; r <= bottom; r++) bandEdges[r].push(item);
      });

      for (let r = 0; r < rows; r++) {
        const bandE = bandEdges[r];
        const band = bandNodes[r];
        for (let c = 0; c < cols; c++) {
          const canvas = document.createElement("canvas");
          canvas.width = EXPORT_TILE;
          canvas.height = EXPORT_TILE;
          const ctx = canvas.getContext("2d");
          ctx.fillStyle = "#000000";
          ctx.fillRect(0, 0, EXPORT_TILE, EXPORT_TILE);
          drawEdgesBand(ctx, bandE, c * EXPORT_TILE, r * EXPORT_TILE, EXPORT_TILE);
          const items = [];
          for (const n of band) {
            const labelHalf = Math.max(n.pr, LABEL_FONT_SIZE * 16 * labelScale);
            if (n.px + labelHalf >= c * EXPORT_TILE && n.px - labelHalf <= c * EXPORT_TILE + EXPORT_TILE) {
              items.push({ attrs: n.attrs, cx: n.px - c * EXPORT_TILE, cy: n.py - r * EXPORT_TILE, r: n.pr });
            }
          }
          await drawNodesAt(ctx, items, null, labelScale);
          const blob = await canvasToBlob(canvas);
          files.push({ name: "tiles/" + l + "/" + c + "_" + r + ".png", bytes: new Uint8Array(await blob.arrayBuffer()) });
          done++;
          if (onProgress) onProgress(done, total);
        }
      }
    }
    return { files, maxLevel };
  }

  async function exportPNG() {
    if (!graph) return;

    // 下限 64 防非法输入崩溃，如负值或过小；上限不封，允许用户导出任意大图
    const W = Math.max(64, parseInt(exportWidth.value, 10) || 65536);
    const H = Math.max(64, parseInt(exportHeight.value, 10) || 65536);
    const wantSinglePng = exportSinglePng.checked;

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

      // 1) 瓦片金字塔 ZIP，默认主产物、内置查看器
      const { files, maxLevel } = await renderPyramidTiles(W, H, scale, ox, oy, minX, minY, nodePixels, (done, total) => {
        exportButton.textContent = "导出瓦片 " + Math.round((done / total) * 100) + "% · " + done + " / " + total;
      });
      files.push({ name: "viewer.html", bytes: new TextEncoder().encode(viewerHtml(W, H, maxLevel)) });
      const zipBlob = await zipStore(files);
      downloadBlob(zipBlob, "mcmod-graph-" + W + "x" + H + ".zip");

      // 2) 单张 PNG 可选，可能超过 2GB 无法打开
      if (wantSinglePng) {
        exportButton.textContent = "导出单张 PNG…";
        const SINGLE_MAX = 16384;
        const blob = (W < SINGLE_MAX && H < SINGLE_MAX)
          ? await renderSingle(W, H, scale, nodePixels, toX, toY)
          : await renderTiled(W, H, scale, nodePixels, toX, toY);
        downloadBlob(blob, "mcmod-graph-" + W + "x" + H + ".png");
      }
    } catch (err) {
      console.error("[错误] 导出失败", err);
      exportButton.textContent = "导出失败";
      setTimeout(() => { exportButton.textContent = "下载渲染图"; }, 2000);
    } finally {
      exportButton.disabled = false;
      if (exportButton.textContent.startsWith("导出") && !exportButton.textContent.startsWith("导出失败")) {
        exportButton.textContent = "下载渲染图";
      }
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  boot().catch((err) => {
    statusText.textContent = "出错了：" + err.message;
    progressLabel.textContent = "";
    console.error("[错误]", err);
  });
}

main();
