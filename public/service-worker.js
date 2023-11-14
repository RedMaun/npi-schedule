const CACHE = "schedule_v10";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js",
);

const registerRoute = workbox.routing.registerRoute;
const NetworkFirst = workbox.strategies.NetworkFirst;

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

registerRoute(
  new RegExp("/*"),
  new NetworkFirst({
    cacheName: CACHE,
  }),
);
