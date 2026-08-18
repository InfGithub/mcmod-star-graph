/*
 * star_graph/main.js - NeoForge 1.21.1 生态关系图前端
 *
 * 基于 sigma.js v3 + graphology，数据来自 graph.json（GitHub Releases 分发）。
 * 封面由 CI 从 MC 百科预生成到 covers/，随站点静态发布；纯前端运行，
 * 不依赖 python 后端（无需 /cover_proxy / IndexedDB）。
 *
 * 构建：npm run build（esbuild → main.bundle.js），需先 npm install。
 * 运行：任意静态服务器（python -m http.server 1119 / GitHub Pages）。
 */
import Graph from "graphology";
import Sigma from "sigma";
import { NodeImageProgram } from "@sigma/node-image";

// 支持封面透明度淡入淡出的图像节点程序。
// sigma 使用预乘 alpha 混合（blendFunc(ONE, ONE_MINUS_SRC_ALPHA)），
// 因此颜色 RGB 必须先乘以 alpha，否则降低 alpha 会变成加色混合（变亮）而不是变透明。
class FadingNodeImageProgram extends NodeImageProgram {
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
const NODE_LOD_MIN_VISIBLE = 300;
const NODE_LOD_ENABLED = true;
const NODE_DIAMETER_SCREEN_RATIO = 0.1; // 跳转后节点直径占屏幕宽度的比例
const LABEL_FONT_SIZE = 14; // 导出标签字号（固定，不随节点/图幅变化）
const HIGHLIGHT_NODE_COLOR = "#ffd700"; // 六度分隔路径高亮色（节点）
const HIGHLIGHT_EDGE_RGB = [255, 215, 0]; // 六度分隔路径高亮色（边）
const HIGHLIGHT_EDGE_COLOR = premulRgba(HIGHLIGHT_EDGE_RGB, 1.0);

// 封面：CI 预生成到 covers/ 并以清单分发（纯前端静态加载，浏览器 HTTP 缓存）。
// 展示用 96px 缩略图（covers/small/）用于图上渲染，原图保留供导出。
const COVER_MANIFEST_URL = "covers/manifest.json";
const COVER_SMALL_MANIFEST_URL = "covers/small-manifest.json";
const COVER_CACHE_NAME = "star-graph-covers-v1";
const COVER_LOAD_CONCURRENCY = 8; // 仅限制网络并发，不限制最终加载数量
const COVER_LOAD_RETRIES = 2;

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

// ==================== 封面：CI 预生成 + 静态加载 ====================
//
// 纯前端运行：封面由 CI 下载到 covers/（原图）并生成 covers/small/ 缩略图，
// 以清单索引，随站点静态发布（浏览器 HTTP 缓存）。
// 图上统一使用缩略图（WebGL 纹理内存约 1/16），导出大图用原图。
// 清单缺失时回退为纯色节点。
async function loadCoverManifest() {
  const map = new Map();
  let data = null;
  try {
    const res = await fetch(COVER_SMALL_MANIFEST_URL);
    if (res.ok) data = await res.json();
  } catch (e) { /* 回退到普通清单 */ }
  if (!data) {
    try {
      const res = await fetch(COVER_MANIFEST_URL);
      if (res.ok) data = await res.json();
    } catch (e) {
      console.warn("[警告] 未找到封面清单，使用纯色节点", e);
      return map;
    }
  }
  const keys = Array.isArray(data) ? data : data.keys;
  const items = data && typeof data.items === "object" ? data.items : {};
  for (const key of Array.isArray(keys) ? keys : []) {
    const k = String(key);
    const it = items[k] || {};
    map.set(k, {
      thumb: String(it.path || `covers/small/${k}.png`).replace(/^\/+/, ""),
      orig: String(it.orig || `covers/${k}.jpg`).replace(/^\/+/, ""),
    });
  }
  return map;
}

// 节点的展示缩略图与原图路径（无封面返回 null）
function coverPaths(node, coverMap) {
  return coverMap.get(String(node.key)) || null;
}

// 图片缓存：Cache Storage 优先，浏览器 HTTP cache 作为第二层缓存。
// object URL 在当前页面生命周期内保持不变，节点离开/重新进入视口不会重下。
let coverCachePromise = null;
function getCoverCache() {
  if (!("caches" in window)) return Promise.resolve(null);
  if (!coverCachePromise) {
    coverCachePromise = caches.open(COVER_CACHE_NAME).catch(() => null);
  }
  return coverCachePromise;
}

function decodeCoverBlob(blob) {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => resolve(objectUrl);
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };
    image.src = objectUrl;
  });
}

async function loadCoverObjectUrl(source) {
  const url = new URL(source, document.baseURI).href;
  const cache = await getCoverCache();

  // 先查持久化 Cache Storage；命中后完全不访问网络。
  if (cache) {
    const cached = await cache.match(url).catch(() => null);
    if (cached && cached.ok) {
      const objectUrl = await decodeCoverBlob(await cached.blob());
      if (objectUrl) return objectUrl;
      await cache.delete(url).catch(() => {});
    }
  }

  // Cache Storage 未命中时再走浏览器 HTTP cache / 网络。
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const copy = response.clone();
  const blob = await response.blob();
  if (cache) await cache.put(url, copy).catch(() => {});
  const objectUrl = await decodeCoverBlob(blob);
  if (!objectUrl) throw new Error("invalid image");
  return objectUrl;
}

async function loadCoverObjectUrlWithRetry(source) {
  for (let attempt = 0; attempt <= COVER_LOAD_RETRIES; attempt++) {
    try {
      return await loadCoverObjectUrl(source);
    } catch (error) {
      if (attempt >= COVER_LOAD_RETRIES) throw error;
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  return null;
}

function buildGraph(data, coverMap) {
  const graph = new Graph({ multi: true });
  const labelIndex = new Map(); // lowercase name -> [keys]
  const degMap = new Map();

  for (const n of data.nodes) {
    degMap.set(n.key, n.in_degree);
    const isCore = n.type === "core";
    const cover = isCore ? coverPaths(n, coverMap) : null;
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
      // 初始只保留封面 URL；节点进入视口并由调度器加载成功后才切换 image。
      // 已加载节点不会被切回 circle，因此离开/重新进入视口不会重复请求。
      type: "circle",
      image: null,
      thumb: cover ? cover.thumb : null,
      imageSrc: cover ? cover.orig : null, // 原图（导出大图用）
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

  for (const e of data.edges) {
    const importance = Math.min(degMap.get(e.source) || 0, degMap.get(e.target) || 0);
    const kind = e.type === "interaction" ? "interaction" : "dependency";
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
    setProgress(10, "加载静态封面清单……", "covers/manifest.json");
    await new Promise((r) => setTimeout(r, 30));

    // 封面：CI 预生成后随站点静态发布；清单缺失时回退为纯色节点。
    const coverMap = await loadCoverManifest();
    setProgress(20, coverMap.size
      ? "构建图结构……"
      : "未找到封面，使用纯色节点……", coverMap.size + " 张封面已就绪");
    await new Promise((r) => setTimeout(r, 30));

    const built = buildGraph(data, coverMap);
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
      nodeProgramClasses: {
        image: FadingNodeImageProgram,
      },
    });
    window.__sigma = renderer; // 调试/测试出口

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

    // ===== 视口优先、一次加载后永久保留 =====
    // 不限制总加载数量：节点首次进入视口就排队，加载成功后保留 image 属性。
    // 离开视口只是不再新增请求，重新进入时直接复用 ready 状态/object URL。
    const coverStates = new Map();
    const coverQueue = [];
    let activeCoverLoads = 0;
    let coverScheduleTimer = null;

    function coverState(key) {
      let state = coverStates.get(key);
      if (!state) {
        state = { status: "idle", priority: Infinity, objectUrl: null };
        coverStates.set(key, state);
      }
      return state;
    }

    function pumpCoverLoads() {
      coverQueue.sort((a, b) => coverState(a.key).priority - coverState(b.key).priority);
      while (activeCoverLoads < COVER_LOAD_CONCURRENCY && coverQueue.length) {
        const item = coverQueue.shift();
        const state = coverState(item.key);
        if (state.status !== "queued") continue;
        state.status = "loading";
        activeCoverLoads += 1;
        loadCoverObjectUrlWithRetry(item.src)
          .then((objectUrl) => {
            if (!objectUrl) throw new Error("empty image");
            state.status = "ready";
            state.objectUrl = objectUrl;
            graph.updateNodeAttributes(item.key, (attrs) => ({
              ...attrs,
              image: objectUrl,
              type: "image",
            }), { attributes: ["image", "type"] });
            renderer.refresh();
          })
          .catch(() => {
            // 失败只记状态，不向控制台输出重复堆栈；下次重新打开页面可重试。
            state.status = "failed";
          })
          .finally(() => {
            activeCoverLoads -= 1;
            pumpCoverLoads();
          });
      }
    }

    function scheduleCoverLoads() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const margin = 320;
      const visible = new Set();
      graph.forEachNode((key, attrs) => {
        if (!attrs.thumb || attrs.type === "image") return;
        const state = coverState(key);
        if (state.status === "ready" || state.status === "failed" || state.status === "loading") return;
        const point = renderer.graphToViewport({ x: attrs.x, y: attrs.y });
        const inside = point.x >= -margin && point.x <= w + margin &&
          point.y >= -margin && point.y <= h + margin;
        if (!inside) return;
        visible.add(key);
        const dx = point.x < 0 ? -point.x : point.x > w ? point.x - w : 0;
        const dy = point.y < 0 ? -point.y : point.y > h ? point.y - h : 0;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const screenSize = renderer.scaleSize(attrs.size);
        // 屏幕内节点优先，其次按距离和屏幕尺寸排序；没有总数上限。
        state.priority = (point.x >= 0 && point.x <= w && point.y >= 0 && point.y <= h ? 0 : 1) * 1e9
          + distance * 100 - screenSize;
        if (state.status === "idle") {
          state.status = "queued";
          coverQueue.push({ key, src: attrs.thumb });
        }
      });

      // 取消已经排队但用户已移出视口的请求，队列项会在 pump 时跳过。
      for (const [key, state] of coverStates) {
        if (state.status === "queued" && !visible.has(key)) state.status = "idle";
      }
      pumpCoverLoads();
    }

    function scheduleCoverLoadsSoon() {
      if (coverScheduleTimer) return;
      coverScheduleTimer = requestAnimationFrame(() => {
        coverScheduleTimer = null;
        scheduleCoverLoads();
      });
    }

    let lodLastRun = 0;
    cam.on("updated", () => {
      const now = performance.now();
      const applyLod = () => {
        lodLastRun = performance.now();
        const state = cam.getState();
        lodThresholdValue = computeLodThreshold(state.ratio, LOD_MAX_THRESHOLD * edgeLodStrength);
        nodeVisibleCount = computeVisibleNodeCount(state.ratio, nodeLodStrength);
        updateCulling(state);
        startFade();
        scheduleCoverLoadsSoon();
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
    scheduleCoverLoads();

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
    const pageSize = 20;
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
    if ((attrs.importance || 0) < lodThresholdValue) return 0;
    if (culledEdges.has(edge)) return 0;
    return 1;
  }

  function nodeTarget(node, attrs) {
    if (!NODE_LOD_ENABLED) return 1;
    return (attrs.rank ?? Infinity) < nodeVisibleCount ? 1 : 0;
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

  function drawEdges(ctx, tx, ty, scale) {
    graph.forEachEdge((edge, attrs, source, target, sa, ta) => {
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
        const src = attrs.imageSrc || attrs.image; // 导出优先原图（缩略图仅用于屏幕渲染）
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
          drawEdges(ctx, tx, ty, scale);

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
      const blob = (W < SINGLE_MAX && H < SINGLE_MAX)
        ? await renderSingle(W, H, scale, nodePixels, toX, toY)
        : await renderTiled(W, H, scale, nodePixels, toX, toY);

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
