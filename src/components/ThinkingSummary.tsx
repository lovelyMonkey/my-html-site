import { THINKING_TOPICS } from '@/data/thinking'
import { useStore } from '@/lib/store'

export default function ThinkingSummary() {
  const { state } = useStore()
  const records = state.checkins.filter((c) => c.thinking)
  if (!records.length) return null
  return <section className="mt-5 rounded-[2rem] bg-white p-5 shadow-sm">
    <h2 className="font-display text-xl">🔍 奥数自学记录</h2>
    <p className="mt-2 text-sm text-ink/60">区分首次作答时是否用过提示。例题互动不计入正确率。</p>
    <div className="mt-3 space-y-3">{THINKING_TOPICS.map((topic) => {
      const attempts = records.filter((r) => r.thinking!.topic === topic.id).flatMap((r) => r.thinking!.attempts)
      if (!attempts.length) return null
      return <div key={topic.id} className="rounded-2xl bg-cream p-3">
        <h3 className="font-bold">{topic.icon} {topic.skill}</h3>
        <p className="mt-1 text-sm leading-relaxed">独立答对 {attempts.filter((a) => a.correct && !a.helped).length} 次 · 提示后答对 {attempts.filter((a) => a.correct && a.helped).length} 次 · 未答对 {attempts.filter((a) => !a.correct).length} 次</p>
      </div>
    })}</div>
    <details className="mt-4 text-sm"><summary className="cursor-pointer font-bold">最近一课的逐题记录</summary><div className="mt-3 space-y-3">{records[0].thinking!.attempts.map((a) => <div key={a.problemKey} className="rounded-xl bg-cream p-3 leading-relaxed"><p>{a.prompt}</p><p>选择：{a.picked} · 答案：{a.answer} · {a.helped ? '使用过提示' : '未使用提示'}</p></div>)}</div></details>
  </section>
}
