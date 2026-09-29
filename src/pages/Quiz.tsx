import { useEffect, useMemo, useRef, useState } from 'react'
import type { Pack, Question } from '@/types'
import { SUBJECT_META } from '@/types'
import Visual from '@/components/Visual'
import { getMathHelp } from '@/lib/mathHelp'
import SpeakButton from '@/components/SpeakButton'
import { soundCorrect, soundWrong, speakSmart } from '@/lib/tts'

export interface QuizResult {
  correct: number
  total: number
  seconds: number
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function Quiz({
  pack,
  onFinish,
  onExit,
}: {
  pack: Pack
  onFinish: (r: QuizResult) => void
  onExit: () => void
}) {
  const questions = useMemo<Question[]>(() => pack.gen(), [pack])
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [showExplain, setShowExplain] = useState(false)
  const startRef = useRef(0)
  const meta = SUBJECT_META[pack.subject]

  const q = questions[idx]
  const mathHelp = pack.subject === 'math' ? getMathHelp(q) : null
  const isLast = idx === questions.length - 1
  const answered = picked !== null
  const isCorrect = picked === q.answer

  useEffect(() => {
    startRef.current = Date.now()
    const t = setInterval(() => setSeconds(Math.floor((Date.now() - startRef.current) / 1000)), 1000)
    return () => clearInterval(t)
  }, [])

  const choose = (opt: string) => {
    if (answered) return
    setPicked(opt)
    if (opt === q.answer) {
      soundCorrect()
      setCorrectCount((c) => c + 1)
    } else {
      soundWrong()
    }
    setShowExplain(true)
  }

  const next = () => {
    if (isLast) {
      onFinish({ correct: correctCount, total: questions.length, seconds })
    } else {
      setIdx((i) => i + 1)
      setPicked(null)
      setShowExplain(false)
    }
  }

  const speakText = q.speak ?? `${q.prompt}${q.big ? '，' + q.big.replace(/[?=□○]/g, ' ') : ''}`
  const speakLang = q.speakLang ?? (pack.subject === 'english' ? 'en-US' : 'zh-CN')
  const isListening = pack.subject === 'english' && !!q.speak

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-90px)] w-full max-w-2xl flex-col px-4 pb-8">
      {/* 顶部：退出 / 进度 / 计时 */}
      <div className="flex items-center gap-3 py-3">
        <button
          onClick={onExit}
          className="btn-press flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg shadow-sm"
          aria-label="退出"
        >
          ✖️
        </button>
        <div className="flex flex-1 items-center gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${
                i < idx ? 'bg-candy-sagedeep' : i === idx ? 'bg-candy-yellowdeep' : 'bg-ink/10'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-2xl bg-white px-3 py-1.5 text-sm font-bold text-ink shadow-sm">
          ⏱️ {fmt(seconds)}
        </div>
      </div>

      {/* 题干卡片 */}
      <div key={q.id} className="animate-pop-in flex-1 rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)] sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl leading-snug text-ink sm:text-2xl">{q.prompt}</h2>
          <SpeakButton
            text={speakText}
            lang={speakLang}
            size={isListening ? 'lg' : 'md'}
            autoKey={isListening ? q.id : undefined}
          />
        </div>

        {q.big && (
          <div
            className={`mt-4 text-center font-display whitespace-pre-line tracking-wide text-ink ${
              pack.subject === 'english' ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
            }`}
          >
            {q.big}
          </div>
        )}

        {q.visual && (
          <div className="mt-5 flex justify-center">
            <Visual spec={q.visual} />
          </div>
        )}

        {mathHelp && (
          <details key={q.id} className="mt-5 rounded-2xl border-2 border-candy-blue bg-candy-blue/20 p-4 text-ink">
            <summary className="cursor-pointer text-base font-bold focus-visible:outline-2 focus-visible:outline-candy-bluedeep">
              💡 不会做？看看解题思路
            </summary>
            <p className="mt-3 leading-relaxed">{mathHelp.hint}</p>
            <details className="mt-3 rounded-xl bg-white p-3">
              <summary className="cursor-pointer font-bold text-candy-bluedeep">展开完整步骤（含答案）</summary>
              <ol className="mt-3 list-decimal space-y-2 pl-6 leading-relaxed">
                {mathHelp.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
              <div className="mt-3 flex items-center gap-2 text-sm">
                <SpeakButton text={[mathHelp.hint, ...mathHelp.steps].join('。')} />
                <span>听一听解题思路</span>
              </div>
            </details>
          </details>
        )}

        {/* 选项 */}
        <div className={`mt-6 grid gap-3 ${q.options.length <= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          {q.options.map((opt, i) => {
            const isAns = opt === q.answer
            const isPicked = opt === picked
            let style = 'bg-cream text-ink shadow-[0_4px_0_#E5DCD5]'
            if (answered && isAns) style = 'bg-candy-sagedeep text-white shadow-[0_4px_0_#4A7D3F]'
            else if (answered && isPicked) style = 'bg-candy-pinkdeep text-white shadow-[0_4px_0_#C24E7E] animate-shake'
            else if (answered) style = 'bg-cream text-ink/35'
            return (
              <button
                key={opt}
                onClick={() => choose(opt)}
                disabled={answered}
                className={`btn-press animate-pop-in rounded-3xl px-3 py-4 font-display text-xl sm:text-2xl ${style}`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                {opt}
                {answered && isAns && <span className="ml-1">✓</span>}
              </button>
            )
          })}
        </div>

        {/* 讲解 */}
        {showExplain && (
          <div
            className={`animate-pop-in mt-5 rounded-2xl px-4 py-3 text-sm font-bold leading-relaxed sm:text-base ${
              isCorrect ? 'bg-candy-sage/60 text-candy-sagedeep' : 'bg-candy-pink/60 text-candy-pinkdeep'
            }`}
          >
            {isCorrect ? '🎉 太棒了，答对啦！' : `💪 没关系，正确答案是「${q.answer}」。`}
            {mathHelp ? (
              <ol className="mt-2 list-decimal space-y-1 pl-5 font-medium text-ink/70">
                {mathHelp.steps.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            ) : q.explain && <span className="mt-1 block font-medium text-ink/70">{q.explain}</span>}
            {!isCorrect && pack.subject === 'english' && q.speak && (
              <button
                className="mt-2 text-ink/60 underline"
                onClick={() => speakSmart(q.speak!, 'en-US')}
              >
                再听一遍
              </button>
            )}
          </div>
        )}
      </div>

      {/* 下一题 */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div
          className="rounded-2xl px-4 py-2 text-sm font-bold text-white"
          style={{ background: meta.deep }}
        >
          {meta.emoji} {pack.title} · 第 {idx + 1}/{questions.length} 题
        </div>
        <button
          onClick={next}
          disabled={!answered}
          className={`btn-press rounded-3xl px-8 py-4 font-display text-xl text-white transition-all ${
            answered
              ? 'bg-candy-peachdeep shadow-[0_5px_0_#C96F2E]'
              : 'bg-ink/20'
          }`}
        >
          {isLast ? '完成 🎉' : '下一题 →'}
        </button>
      </div>
    </div>
  )
}
