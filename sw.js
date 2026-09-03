const CACHE_NAME = 'shinzai-sns-v1';
const STATIC_ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './image/favicon.png',
    './image/icon.png',
    './image/header.png'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // 古いキャッシュの削除
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
                );
            }),
            // すぐにコントロールを開始させる
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    // 外部ドメインや GET 以外のリクエスト（POSTなどのAPI）は無視
    if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // 静的ファイル（CSS, JS, 画像等）のみを動的キャッシュ対象にする
                // ※ APIリクエスト（例: /api/...）はキャッシュしない
                const url = new URL(event.request.url);
                const isStaticAsset = STATIC_ASSETS.some(asset => url.pathname.endsWith(asset.replace('./', '')));

                if (response && response.status === 200 && response.type === 'basic' && isStaticAsset) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // オフライン時のフォールバック
                return caches.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // HTMLリクエストでキャッシュが見つからない場合はトップページ（index.html）を返す
                    if (event.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('./index.html') || caches.match('./');
                    }
                });
            })
    );
});
