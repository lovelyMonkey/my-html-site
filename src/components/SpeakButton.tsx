import { useEffect, useState } from 'react'
import { speakSmart } from '@/lib/tts'

export default function SpeakButton({
  text,
  lang = 'zh-CN',
  size = 'md',
  autoKey,
}: {
  text: string
  lang?: 'en-US' | 'zh-CN'
  size?: 'md' | 'lg'
  /** 变化时自动朗读一次（用于英语听音题） */
  autoKey?: string
}) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!autoKey) return
    const t = setTimeout(() => {
      speakSmart(text, lang)
      setPlaying(true)
      setTimeout(() => setPlaying(false), 1400)
    }, 450)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoKey])

  const cls =
    size === 'lg'
      ? 'h-16 w-16 text-3xl rounded-3xl'
      : 'h-11 w-11 text-xl rounded-2xl'

  return (
    <button
      type="button"
      aria-label="朗读"
      onClick={() => {
        speakSmart(text, lang)
        setPlaying(true)
        setTimeout(() => setPlaying(false), 1400)
      }}
      className={`btn-press inline-flex items-center justify-center bg-candy-yellow text-ink shadow-[0_3px_0_#E8A81C] ${cls} ${
        playing ? 'animate-pulse-soft' : ''
      }`}
    >
      🔊
    </button>
  )
}
