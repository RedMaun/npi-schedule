const CACHE = "schedule_v9";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const registerRoute = workbox.routing.registerRoute
const StaleWhileRevalidate = workbox.strategies.StaleWhileRevalidate

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
})

registerRoute(
  new RegExp('/*'),
  new StaleWhileRevalidate({
    cacheName: CACHE
  })
)