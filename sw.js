var urlsToCache = [
  './',
  './manifest.json',
  './fallback.json',
  // CSS
  './css/app.css',
  './css/basscss-cp.min.css',
  './css/font-awesome.min.css',
  // FONTS
  './fonts/fontawesome-webfont.eot?v=4.7.0',
  './fonts/fontawesome-webfont.svg?v=4.7.0',
  './fonts/fontawesome-webfont.ttf?v=4.7.0',
  './fonts/fontawesome-webfont.woff?v=4.7.0',
  './fonts/fontawesome-webfont.woff2?v=4.7.0',
  './fonts/FontAwesome.otf',
  // IMG
  './img/icons/icon-128x128.png',
  './img/icons/icon-144x144.png',
  './img/icons/icon-152x152.png',
  './img/icons/icon-192x192.png',
  './img/icons/icon-384x384.png',
  './img/icons/icon-512x512.png',
  './img/icons/icon-72x72.png',
  './img/icons/icon-96x96.png',
  // JS
  './js/app.js',
  './js/jquery.min.js',
  './js/vue-router.min.js',
  './js/vue.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('imagens-favoritas-v1-local').then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  var req = event.request;
  var url = new URL(req.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(req));
  } else {
    event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  var cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  var cache = await caches.open('imagens-favoritas-v1-externo');

  try {
    var res = await fetch(req);

    cache.put(req, res.clone());
    return res;
  } catch (error) {
    var cachedResponse = await cache.match(req);

    return cachedResponse || await caches.match('/fallback.json');
  }
}
