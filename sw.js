const CACHE_NAME = "star-graph-covers-v3";
const COVER_PREFIX = "/covers/small/";
const NETWORK_INTERVAL_MS = 150;
let networkTail = Promise.resolve();
let nextNetworkTime = 0;

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter((key) => key.startsWith("star-graph-covers-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.includes(COVER_PREFIX)) {
    return;
  }
  event.respondWith(cacheFirstCover(request));
});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cacheKey(request) {
  return new Request(request.url, { method: "GET" });
}

function runNetworkTask(task) {
  const run = networkTail.then(async () => {
    const wait = Math.max(0, nextNetworkTime - Date.now());
    if (wait > 0) await delay(wait);
    nextNetworkTime = Date.now() + NETWORK_INTERVAL_MS;
    return task();
  });
  networkTail = run.catch(() => {});
  return run;
}

async function cacheFirstCover(request) {
  const cache = await caches.open(CACHE_NAME);
  const key = cacheKey(request);
  const cached = await cache.match(key);
  if (cached && cached.ok) return cached;

  return runNetworkTask(async () => {
    let response = await fetch(new Request(request, { cache: "no-store" }));
    // 丢弃异常的旧代理/CDN响应，避免把 HTTP 570 写进缓存。
    if (response.status === 570) {
      await delay(NETWORK_INTERVAL_MS);
      nextNetworkTime = Date.now() + NETWORK_INTERVAL_MS;
      response = await fetch(new Request(request, { cache: "no-store" }));
    }
    const contentType = response.headers.get("content-type") || "";
    if (response.ok && contentType.startsWith("image/")) {
      await cache.put(key, response.clone());
    }
    return response;
  });
}
