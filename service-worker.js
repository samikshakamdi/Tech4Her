const CACHE_NAME = "safety-cache-v5";
const ASSETS = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/translations.js"
];

self.addEventListener("install", e => {
    self.skipWaiting(); // Force new service worker to activate immediately
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener("activate", e => {
    e.waitUntil(
        clients.claim() // Take control of all pages immediately
    );
});
