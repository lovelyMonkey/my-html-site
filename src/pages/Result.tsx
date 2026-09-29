import { useEffect, useMemo, useRef } from 'react'
import type { Pack } from '@/types'
import { SUBJECT_META } from '@/types'
import type { QuizResult } from './Quiz'
import Confetti from '@/components/Confetti'
import { soundWin } from '@/lib/tts'
import { useStore, todayStr, uid } from '@/lib/store'

export default function Result({
  pack,
  result,
  onHome,
  onAgain,
}: {
  pack: Pack
  result: QuizResult
  onHome: () => void
  onAgain: () => void
}) {
  const { state, dispatch } = useStore()
  const saved = useRef(false)
  const meta = SUBJECT_META[pack.subject]

  const accuracy = result.correct / result.total
  const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : 1
  const earned = useMemo(
    () => pack.basePoints + result.correct * state.settings.perCorrect,
    [pack.basePoints, result.correct, state.settings.perCorrect]
  )

  useEffect(() => {
    if (saved.current) return
    saved.current = true
    soundWin()
    dispatch({
      type: 'checkin',
      checkin: {
        id: uid(),
        date: todayStr(),
        packId: pack.id,
        packTitle: pack.title,
        subject: pack.subject,
        correct: result.correct,
        total: result.total,
        points: earned,
        seconds: result.seconds,
        ts: Date.now(),
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const praise =
    stars === 3 ? '完美！你是小学霸！' : stars === 2 ? '很棒！再仔细一点就满分啦！' : '完成了就很了不起，继续加油！'

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-90px)] w-full max-w-xl flex-col items-center px-4 pb-10">
      <Confetti fire />
      <div className="animate-pop-in mt-6 w-full rounded-[2.5rem] bg-white p-8 text-center shadow-[0_8px_0_rgba(84,69,63,0.08)]">
        <div className="text-lg font-bold text-ink/60">打卡成功！</div>

        {/* 星星 */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`animate-pop-spring text-5xl ${i < stars ? '' : 'opacity-20 grayscale'}`}
              style={{ animationDelay: `${300 + i * 220}ms` }}
            >
              ⭐
            </span>
          ))}
        </div>

        <h2 className="font-display mt-4 text-3xl text-ink">{praise}</h2>

        {/* 成绩 */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-3xl bg-candy-sage/50 py-4">
            <div className="font-display text-2xl text-candy-sagedeep">
              {result.correct}/{result.total}
            </div>
            <div className="text-xs font-bold text-ink/60">答对题数</div>
          </div>
          <div className="rounded-3xl bg-candy-blue/50 py-4">
            <div className="font-display text-2xl text-candy-bluedeep">
              {Math.floor(result.seconds / 60)}分{result.seconds % 60}秒
            </div>
            <div className="text-xs font-bold text-ink/60">用时</div>
          </div>
          <div className="rounded-3xl bg-candy-yellow/60 py-4">
            <div className="font-display text-2xl text-candy-yellowdeep">+{earned}</div>
            <div className="text-xs font-bold text-ink/60">获得积分</div>
          </div>
        </div>

        <div
          className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white"
          style={{ background: meta.deep }}
        >
          {meta.emoji} {meta.name} · {pack.title} ✔ 已打卡
        </div>

        <div className="mt-2 text-sm font-bold text-ink/50">
          当前总积分：<span className="text-candy-yellowdeep">{state.points}</span> 分
        </div>
      </div>

      <div className="mt-6 flex w-full gap-3">
        <button
          onClick={onHome}
          className="btn-press flex-1 rounded-3xl bg-white py-4 font-display text-xl text-ink shadow-[0_5px_0_#E5DCD5]"
        >
          🏠 回首页
        </button>
        <button
          onClick={onAgain}
          className="btn-press flex-1 rounded-3xl bg-candy-peachdeep py-4 font-display text-xl text-white shadow-[0_5px_0_#C96F2E]"
        >
          🔁 再练一包
        </button>
      </div>
    </div>
  )
}
