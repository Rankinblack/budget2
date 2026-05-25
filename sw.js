/* Service Worker — ميزانيتي / My Budget PWA
   Cache-first app shell for full offline use. Bump CACHE to ship updates. */
const CACHE = 'budget-pwa-v2';
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./fonts.css",
  "./js/react.min.js",
  "./js/react-dom.min.js",
  "./js/config.js",
  "./js/supabase.umd.js",
  "./js/app1.seed.js",
  "./js/backend.js",
  "./js/app2.components.js",
  "./js/app3.tweaks.js",
  "./js/app4.screens.js",
  "./js/app5.main.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/maskable-192.png",
  "./icons/maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png",
  "fonts/0956c9fd-c254-47d5-b3bd-30c95d75b2da.woff2",
  "fonts/0aa22a56-b3e4-4500-bf87-0c5c1972fe8a.woff2",
  "fonts/0b8649ea-0f19-4af7-b030-915810780a8b.woff2",
  "fonts/11d07262-e4ad-4479-9efa-04709d7ec82f.woff2",
  "fonts/146c2bba-8eb4-4152-8b00-27b3e4c45101.woff2",
  "fonts/1ea5cc1b-123b-47cb-9e7e-8f44782672cf.woff2",
  "fonts/258cf35e-54cf-4e6f-91d4-8c50025ce2f4.woff2",
  "fonts/30e58a9d-c5a6-4ff9-927f-ce8fcc344376.woff2",
  "fonts/3e40a324-0780-4f77-9833-230e469d377a.woff2",
  "fonts/4ae4f2e1-7a2f-487b-a030-c301804368b8.woff2",
  "fonts/61740a1f-0816-46db-a728-b0ffd54ebf58.woff2",
  "fonts/61bb37d9-f0c1-4287-b813-de274e2f2a60.woff2",
  "fonts/641ae143-7813-44f2-8710-58c005f80f93.woff2",
  "fonts/6ac0bc4d-e42e-42cc-ae5e-1343e5491907.woff2",
  "fonts/7052ffc3-6322-4150-b775-b637b9d27ad7.woff2",
  "fonts/84046c95-1c03-4fd0-974a-91be7a00baa1.woff2",
  "fonts/8ef6cec6-657b-44fd-9750-e274af2f804f.woff2",
  "fonts/93a7ed67-69ec-4a07-a9e0-30807987f7eb.woff2",
  "fonts/960be8ef-81cc-4ec1-9f0c-3100ae1c88b2.woff2",
  "fonts/978269a8-7638-485f-ad8d-4f622aa5db4f.woff2",
  "fonts/9a66704e-29af-41ce-982b-2a4ec41bbd6b.woff2",
  "fonts/9c28a099-255f-4bf6-a200-39036b9d3dbf.woff2",
  "fonts/9da30531-5c15-49ed-91bd-8b19eccc42cf.woff2",
  "fonts/a15b55db-e779-43f2-b31d-331b917361a4.woff2",
  "fonts/a44d089b-cbbf-44bd-892a-ea835761fea5.woff2",
  "fonts/a6237c3a-9854-4855-a19b-03428808b7f0.woff2",
  "fonts/b078d86e-d334-46e6-9c1b-9de77b02ccbf.woff2",
  "fonts/c1472fe7-8b09-40f9-922e-07394dcbbafd.woff2",
  "fonts/c1492fa4-e607-412e-98fb-d4953861d120.woff2",
  "fonts/c5ba8f25-d178-4842-b700-10ffee964ff4.woff2",
  "fonts/c5f92be6-5103-490c-b872-d3200cd038ff.woff2",
  "fonts/ca2129a5-b250-45be-9bc1-c8ccea834cc3.woff2",
  "fonts/ce97396d-c67f-4317-9874-11b35704d5b8.woff2",
  "fonts/d24ae360-ea9a-432b-a6fb-7abc390e175f.woff2",
  "fonts/dbbaca71-f621-4798-b342-41803f971816.woff2",
  "fonts/df48699c-042c-42d3-9b8f-4178f3948453.woff2",
  "fonts/e1d8ea44-9988-40d2-93fa-0d2d779e91db.woff2",
  "fonts/e20c96e9-b974-4a13-b48c-ca9bc288935c.woff2",
  "fonts/f7a08e92-205b-4150-88c3-878ffd75cd3e.woff2",
  "fonts/fccffba6-5c3f-4adb-9acd-9cafdf1de26f.woff2",
  "fonts/fcea05bf-80ff-4fad-94e7-7927ab2401b6.woff2"
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Navigation requests: serve cached shell first, fall back to network.
  if (req.mode === 'navigate') {
    e.respondWith(
      caches.match('./index.html').then((cached) => cached || fetch(req))
    );
    return;
  }

  // Everything else: cache-first, then network (and cache the result).
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
