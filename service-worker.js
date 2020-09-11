const cacheName = 'Weather-App-v1';
const cacheAssets = [
	'index.html',
	'/css/style.css',
	'/css/media-query.css',
	'app.js',
	'/icons/01d.png',
	'/icons/01n.png',
	'/icons/02d.png',
	'/icons/02n.png',
	'/icons/03d.png',
	'/icons/03n.png',
	'/icons/04d.png',
	'/icons/04n.png',
	'/icons/09d.png',
	'/icons/09n.png',
	'/icons/10d.png',
	'/icons/10n.png',
	'/icons/11d.png',
	'/icons/11n.png',
	'/icons/13d.png',
	'/icons/13n.png',
	'/icons/50d.png',
	'/icons/50n.png',
	'/icons/unknown.png',
];

// call the install event
self.addEventListener('install', e => {
    console.log('Service worker successfully installed!');
    e.waitUntil(
        caches
        .open(cacheName)
        .then(cache => {
            console.log('Service worker is caching files...');
            cache.addAll(cacheAssets);
        })
        .then(() => self.skipWaiting())
    )
})

// call the activate event
self.addEventListener('activate', e => {
    console.log('service worker activated!');
    // remove unwanted caches
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache != cacheName) {
                        console.log('Service worker: is clearing old cache...');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
})

// call fetch event
self.addEventListener('fetch', e => {
    console.log('Service worker is fetching');
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})

