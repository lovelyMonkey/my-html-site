/** 语音朗读（Web Speech API） */
export function speak(text: string, lang: 'en-US' | 'zh-CN' = 'en-US', rate = 0.82) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = lang
  u.rate = rate
  u.pitch = 1.05
  const voices = window.speechSynthesis.getVoices()
  const v = voices.find((v) => v.lang.startsWith(lang)) ?? voices.find((v) => v.lang.startsWith(lang.split('-')[0]))
  if (v) u.voice = v
  window.speechSynthesis.speak(u)
}

/* ---------- 预生成的高质量英文音频（优先于系统语音） ---------- */

const BASE = import.meta.env.BASE_URL + 'audio/en/'

function slugify(t: string): string {
  return t.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** 长文本用 djb2 哈希命名，避免超长文件名 */
function hash36(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h.toString(36)
}

function audioUrlFor(text: string): string | null {
  const t = text.trim()
  const slug = slugify(t)
  if (!slug) return null
  // 字母优先用 letter-xxx.mp3，单词优先用 word-xxx.mp3（均存在时）
  if (t.length === 1 && /^[a-z]$/.test(t)) return BASE + 'letter-' + slug + '.mp3'
  if (/^[a-z]+$/.test(t) && t.length <= 12) return BASE + 'word-' + slug + '.mp3'
  // 超长文本（阅读短文等）用哈希命名
  if (slug.length > 60) return BASE + 'h-' + hash36(slug) + '.mp3'
  // 其余（句子、长词、自然拼读组合音）用 slug.mp3
  return BASE + slug + '.mp3'
}

let currentAudio: HTMLAudioElement | null = null

/**
 * 智能朗读：英文内容优先播放预生成的高清音频，
 * 音频缺失或播放失败时回退到系统语音合成。
 */
export function speakSmart(text: string, lang: 'en-US' | 'zh-CN' = 'en-US') {
  const url = lang === 'en-US' ? audioUrlFor(text) : null
  if (!url) {
    speak(text, lang)
    return
  }
  try {
    currentAudio?.pause()
    const audio = new Audio(url)
    currentAudio = audio
    audio.onerror = () => speak(text, lang)
    audio.play().catch(() => speak(text, lang))
  } catch {
    speak(text, lang)
  }
}

/* ---------- 简单音效（WebAudio，无需素材） ---------- */

let ctx: AudioContext | null = null
function audioCtx() {
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return ctx
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.18) {
  const ac = audioCtx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, ac.currentTime + start)
  gain.gain.linearRampToValueAtTime(vol, ac.currentTime + start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + start + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + dur + 0.05)
}

/** 答对：上扬三音 */
export function soundCorrect() {
  try {
    tone(523.25, 0, 0.16)
    tone(659.25, 0.1, 0.16)
    tone(783.99, 0.2, 0.28)
  } catch { /* ignore */ }
}

/** 答错：低缓两音 */
export function soundWrong() {
  try {
    tone(220, 0, 0.2, 'triangle', 0.12)
    tone(174.6, 0.14, 0.3, 'triangle', 0.12)
  } catch { /* ignore */ }
}

/** 胜利小旋律 */
export function soundWin() {
  try {
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.5]
    notes.forEach((n, i) => tone(n, i * 0.12, 0.24))
    tone(1318.5, 0.62, 0.5)
  } catch { /* ignore */ }
}

/** 兑换：叮 */
export function soundCoin() {
  try {
    tone(987.77, 0, 0.12, 'square', 0.08)
    tone(1318.5, 0.09, 0.25, 'square', 0.08)
  } catch { /* ignore */ }
}

/** 离开讲解或换题时停止旧的朗读。 */
export function stopSpeaking() {
  currentAudio?.pause()
  currentAudio = null
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
}
