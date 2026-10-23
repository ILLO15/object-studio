// Offline cache: app shell is precached; everything else (fonts, etc.) is cached on first use.
// Bump VERSION whenever any precached file changes so clients pick up the new build.
const VERSION = 'studio-v4';
const SHELL = [
  './', 'index.html', 'manifest.webmanifest',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png',
  'vendor/three/build/three.module.js',
  'vendor/three/examples/jsm/controls/OrbitControls.js',
  'vendor/three/examples/jsm/environments/RoomEnvironment.js',
  'vendor/three/examples/jsm/loaders/GLTFLoader.js',
  'vendor/three/examples/jsm/loaders/OBJLoader.js',
  'vendor/three/examples/jsm/loaders/STLLoader.js',
  'vendor/three/examples/jsm/loaders/3MFLoader.js',
  'vendor/three/examples/jsm/utils/BufferGeometryUtils.js',
  'vendor/three/examples/jsm/libs/fflate.module.js',
  'vendor/three/examples/jsm/lines/LineSegments2.js',
  'vendor/three/examples/jsm/lines/LineSegmentsGeometry.js',
  'vendor/three/examples/jsm/lines/LineMaterial.js',
  'vendor/three/examples/jsm/postprocessing/EffectComposer.js',
  'vendor/three/examples/jsm/postprocessing/RenderPass.js',
  'vendor/three/examples/jsm/postprocessing/GTAOPass.js',
  'vendor/three/examples/jsm/postprocessing/OutputPass.js',
  'vendor/three/examples/jsm/postprocessing/Pass.js',
  'vendor/three/examples/jsm/postprocessing/ShaderPass.js',
  'vendor/three/examples/jsm/postprocessing/MaskPass.js',
  'vendor/three/examples/jsm/shaders/CopyShader.js',
  'vendor/three/examples/jsm/shaders/OutputShader.js',
  'vendor/three/examples/jsm/shaders/GTAOShader.js',
  'vendor/three/examples/jsm/shaders/PoissonDenoiseShader.js',
  'vendor/three/examples/jsm/math/SimplexNoise.js',
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // Network first for the page itself so updates show up; cache first for everything else.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { caches.open(VERSION).then(c => c.put('index.html', r.clone())); return r; })
      .catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => {
    if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); }
    return r;
  })));
});
