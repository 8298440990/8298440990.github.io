const CACHE_NAME = 'shinzai-sns-v2';
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
    // 新しい Service Worker をすぐにアクティブ化
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            // 古いバージョンの不要なキャッシュを削除
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name !== CACHE_NAME)
                        .map(name => caches.delete(name))
                );
            }),
            // 制御下のページ（clients）のネットワーク処理を即座に引き継ぐ
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // 1. 同一オリジン以外の外部リクエストおよび GET 以外のメソッド（POST/PUT等）はスルー（例外処理）
    if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
        return;
    }

    // 2. APIリクエスト（例: /api/ 配下）の除外処理
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // ネットワーク優先（Network First）戦略
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // 正常なレスポンス（200 OK かつ basic/cors タイプ）の場合のみキャッシュを最新化
                if (
                    networkResponse &&
                    networkResponse.status === 200 &&
                    (networkResponse.type === 'basic' || networkResponse.type === 'cors')
                ) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(async () => {
                // オフラインまたはネットワークエラー時のフォールバック処理
                const cachedResponse = await caches.match(event.request);
                if (cachedResponse) {
                    return cachedResponse;
                }

                // ナビゲーション（HTML表示）リクエスト時のフォールバック設定
                if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
                    const indexCache = await caches.match('./index.html') || await caches.match('./');
                    if (indexCache) {
                        return indexCache;
                    }
                }

                // キャッシュにも見つからない場合はエラーレスポンスを返す
                return new Response('Network error and no cache available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
                });
            })
    );
});
