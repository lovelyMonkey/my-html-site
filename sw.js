// Service Worker - 预缓存所有音频文件
const CACHE_NAME = 'xiaodoumiao-v1'
const AUDIO_CACHE = 'xiaodoumiao-audio-v1'

// 需要预缓存的音频文件列表
const AUDIO_FILES = [
  // 字母
  ...'abcdefghijklmnopqrstuvwxyz'.split('').map(l => `letter-${l}.mp3`),
  // 常用单词（从代码里提取）
  'word-apple.mp3', 'word-banana.mp3', 'word-book.mp3', 'word-cat.mp3', 'word-dog.mp3',
  'word-egg.mp3', 'word-fish.mp3', 'word-go.mp3', 'word-hello.mp3', 'word-hi.mp3',
  'word-i.mp3', 'word-jump.mp3', 'word-kite.mp3', 'word-look.mp3', 'word-mom.mp3',
  'word-no.mp3', 'word-open.mp3', 'word-pig.mp3', 'word-quit.mp3', 'word-red.mp3',
  'word-sit.mp3', 'word-stop.mp3', 'word-yes.mp3', 'word-zoo.mp3',
  // 音效
  'sfx/correct.mp3', 'sfx/wrong.mp3', 'sfx/win.mp3',
]

// 安装时预缓存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(AUDIO_CACHE).then((cache) => {
      console.log('[SW] 预缓存音频文件...')
      return cache.addAll(AUDIO_FILES.map(f => `/audio/en/${f}`))
    }).then(() => {
      console.log('[SW] 音频预缓存完成')
      return self.skipWaiting()
    }).catch((err) => {
      console.error('[SW] 预缓存失败:', err)
    })
  )
})

// 激活时清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== AUDIO_CACHE) {
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

// 拦截请求，优先使用缓存
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // 音频文件：优先缓存，失败再网络
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) {
          return cached
        }
        return fetch(event.request).then((response) => {
          // 缓存新音频
          if (response.ok) {
            const clone = response.clone()
            caches.open(AUDIO_CACHE).then((cache) => {
              cache.put(event.request, clone)
            })
          }
          return response
        })
      })
    )
    return
  }
  
  // 其他资源：网络优先，失败用缓存
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
    })
  )
})
