self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes("/models/") &&
    event.request.url.endsWith(".glb")
  ) {
    event.respondWith(useCache(event.request));
  }
});

async function useCache(request) {
  const cache = await caches.open("models");
  const cacheResponse = await cache.match(request);
  const networkResponse = fetch(request).then((response) => {
    cache.put(request, response.clone());
    return response;
  });
  return cacheResponse || networkResponse;
}
