import { useCallback, useEffect, useRef, useState } from 'react'
import { THINKING_TOPICS, pickThinkingProblems } from '@/data/thinking'
import ThinkingDiagram from '@/components/ThinkingDiagram'
import Confetti from '@/components/Confetti'
import { useStore, todayStr, uid } from '@/lib/store'
import { scoreThinking } from '@/lib/thinkingScore'
import { soundCorrect, soundWin, soundWrong, speakSmart, stopSpeaking } from '@/lib/tts'
import type { Checkin } from '@/types'
import type { ThinkingDraft, ThinkingTopic } from '@/types/thinking'

const primary = 'btn-press min-h-12 w-full rounded-2xl bg-candy-peachdeep px-5 py-3 font-bold text-lg text-white shadow-[0_4px_0_#C96F2E] disabled:opacity-40'
const secondary = 'btn-press min-h-12 rounded-2xl bg-white px-4 py-3 font-bold text-ink shadow-sm'

function Listen({ text, label = '听一听' }: { text: string; label?: string }) {
  return <button type="button" onClick={() => speakSmart(text, 'zh-CN')} className="btn-press min-h-11 shrink-0 rounded-xl bg-candy-yellow/70 px-3 py-2 text-sm font-bold text-ink">🔊 {label}</button>
}

export default function Thinking({ onHome, onShop }: { onHome: () => void; onShop: () => void }) {
  const { state, dispatch } = useStore()
  const draft = state.thinkingDraft
  const [inLesson, setInLesson] = useState(false)
  const [completed, setCompleted] = useState<Checkin | null>(null)
  const [pendingTopic, setPendingTopic] = useState<ThinkingTopic | null>(null)
  const activeSince = useRef(0)
  useEffect(() => { activeSince.current = Date.now() }, [inLesson])
  const savedId = useRef<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    return stopSpeaking
  }, [inLesson, draft?.id, draft?.phase, draft?.step, draft?.practiceIndex])

  const update = useCallback((patch: Partial<ThinkingDraft>) => {
    if (draft) {
      const now = Date.now()
      const elapsedSeconds = (draft.elapsedSeconds ?? 0) + Math.max(0, (now - activeSince.current) / 1000)
      activeSince.current = now
      dispatch({ type: 'saveThinkingDraft', draft: { ...draft, ...patch, elapsedSeconds } })
    }
  }, [draft, dispatch])
  const start = useCallback((topic: ThinkingTopic) => {
    const seen = new Set(state.checkins.flatMap((c) => c.thinking?.attempts.map((a) => a.problemKey) ?? []))
    const [example, ...problems] = pickThinkingProblems(topic, seen)
    dispatch({ type: 'saveThinkingDraft', draft: {
      id: uid(), topic, startedAt: Date.now(), elapsedSeconds: 0, example, problems, phase: 'example', step: 0,
      checkpoint: null, practiceIndex: 0, helpStep: -1, picked: null, attempts: [],
    } })
    setCompleted(null)
    setPendingTopic(null)
    savedId.current = null
    setInLesson(true)
  }, [state.checkins, dispatch])
  const finish = useCallback(() => {
    if (!draft || draft.attempts.length !== draft.problems.length || savedId.current === draft.id) return
    savedId.current = draft.id
    const award = scoreThinking(draft.attempts, state.checkins, state.settings.perCorrect)
    const topic = THINKING_TOPICS.find((t) => t.id === draft.topic)!
    const record: Checkin = {
      id: draft.id, date: todayStr(), ts: Date.now(), packId: `thinking-${draft.topic}`, packTitle: `奥数自学·${topic.title}`,
      subject: 'math', correct: draft.attempts.filter((a) => a.correct).length, total: draft.problems.length,
      seconds: Math.max(0, Math.floor((draft.elapsedSeconds ?? 0) + (Date.now() - activeSince.current) / 1000)), points: award.total,
      thinking: { topic: draft.topic, attempts: draft.attempts, award },
    }
    dispatch({ type: 'checkin', checkin: record })
    setCompleted(record)
    setInLesson(false)
    stopSpeaking()
    soundWin()
  }, [draft, state.checkins, state.settings.perCorrect, dispatch])

  if (completed?.thinking) {
    const { attempts, award } = completed.thinking
    const independent = attempts.filter((a) => a.correct && !a.helped).length
    return <div className="mx-auto max-w-xl px-4 py-6 text-ink">
      <Confetti fire />
      <section className="rounded-[2rem] bg-white p-6 text-center">
        <div className="text-5xl">🌟</div>
        <h1 className="mt-3 font-display text-3xl">又学了一种好办法！</h1>
        <p className="mt-3">完成 1 道例题和 {attempts.length} 道练习</p>
        <p className="mt-2">自己做对 {independent} 题 · 借助提示做对 {attempts.filter((a) => a.correct && a.helped).length} 题</p>
        <div className="my-5 rounded-2xl bg-candy-yellow/40 p-4">
          <div className="font-display text-4xl text-candy-yellowdeep">⭐ +{award.total}</div>
          <p className="mt-2 text-sm">努力分 {award.effort} ＋ 独立答对 {award.independent} ＋ 学会新题 {award.mastery}</p>
          {award.repeated > 0 && <p className="mt-2 text-sm">这次有 {award.repeated} 道练过的题，重复题积分已递减。</p>}
        </div>
        <p className="text-sm">{independent === attempts.length ? '试着把这个办法讲给爸爸妈妈听吧！' : '会求助也是好习惯，下次再自己试一试。'}</p>
      </section>
      <section className="mt-4 space-y-3" aria-label="本次练习回顾">
        {attempts.map((a, i) => <div key={a.problemKey} className="rounded-2xl bg-white p-4 text-sm leading-relaxed"><span className="font-bold">第 {i + 1} 题 · {a.correct ? a.helped ? '💡 借助提示答对' : '🌟 独立答对' : '🌱 还在学习'}</span><p className="mt-1">{a.prompt}</p><p>你的选择：{a.picked} · 正确答案：{a.answer}</p></div>)}
      </section>
      <div className="mt-5 grid grid-cols-2 gap-3"><button className={secondary} onClick={() => setCompleted(null)}>看看其他主题</button><button className={primary} onClick={onShop}>🎁 去换礼品</button></div>
      <button className="mt-5 w-full py-3 font-bold" onClick={onHome}>回首页</button>
    </div>
  }

  if (!inLesson || !draft) return <div className="mx-auto max-w-2xl px-4 pb-10 pt-4 text-ink">
    <button className={secondary} onClick={onHome}>← 回首页</button>
    <div className="mt-5 rounded-[2rem] bg-gradient-to-br from-candy-blue to-candy-sage p-6">
      <div className="text-sm font-bold">一年级 · 奥数自学</div>
      <h1 className="mt-2 font-display text-3xl">小小思考家 🔍</h1>
      <p className="mt-3 leading-relaxed">先跟着图学，再自己试三题。<br />不会也没关系，我们一步一步想。</p>
      <div className="mt-3"><Listen text="欢迎来到小小思考家。选一个主题，先跟着图学一道例题，再自己试三题。不会时点帮帮我，完成整课就有积分。" label="听怎么玩" /></div>
    </div>
    {draft && <section className="mt-5 rounded-2xl border-2 border-candy-yellowdeep bg-candy-yellow/30 p-4">
      <h2 className="font-bold">上次学到这里</h2>
      <p className="my-2">{THINKING_TOPICS.find((t) => t.id === draft.topic)?.title} · {draft.phase === 'example' ? `例题第 ${draft.step + 1} 步` : `练习第 ${draft.practiceIndex + 1} 题`}</p>
      <button className={primary} onClick={() => setInLesson(true)}>▶ 继续上次学习</button>
    </section>}
    <div className="mt-5 space-y-4">{THINKING_TOPICS.map((topic, i) => {
      const records = state.checkins.filter((c) => c.thinking?.topic === topic.id)
      const independent = records.flatMap((c) => c.thinking!.attempts).filter((a) => a.correct && !a.helped).length
      return <section key={topic.id} className="rounded-[2rem] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3"><span className="text-4xl">{topic.icon}</span><div><span className="text-xs font-bold text-candy-bluedeep">第 {i + 1} 站 · {topic.skill}</span><h2 className="font-display text-2xl">{topic.title}</h2></div></div>
        <p className="mt-3">{topic.desc}</p>
        <p className="mt-2 text-sm text-ink/60">{records.length ? `完成 ${records.length} 次 · 独立做对 ${independent} 题` : '1 道图解例题 ＋ 3 道同类练习'}</p>
        <div className="mt-4 flex gap-3"><button className={primary} onClick={() => draft ? draft.topic === topic.id ? setInLesson(true) : setPendingTopic(topic.id) : start(topic.id)}>学一学 · {topic.skill}</button><Listen text={`${topic.title}。${topic.desc}。点学一学开始。`} label="听介绍" /></div>
      </section>
    })}</div>
    <details className="mt-5 rounded-2xl bg-white p-4 text-sm leading-relaxed"><summary className="cursor-pointer font-bold">⭐ 怎样获得积分？</summary><p className="mt-3">完成整课后结算：每道新题有 2 分努力分，独立答对再加 {state.settings.perCorrect} 分，学完例题独立做对新题再奖 2 分。看提示仍有努力分，听题不算求助。</p><p className="mt-2">同一道题第二次练：努力分 1 分，独立答对加 {Math.floor(state.settings.perCorrect / 2)} 分；第三次起每题仍有 1 分努力分。会优先安排没练过的题。普通题包的积分规则保持原样。</p></details>
    {pendingTopic && <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-5"><section role="dialog" aria-modal="true" aria-labelledby="switch-title" className="w-full max-w-sm rounded-3xl bg-white p-6"><h2 id="switch-title" className="font-display text-xl">换一个主题吗？</h2><p className="my-4">刚才没学完的进度会被替换，还没有结算积分。</p><button autoFocus className={primary} onClick={() => { setPendingTopic(null); setInLesson(true) }}>继续刚才的课</button><button className="mt-3 min-h-12 w-full font-bold" onClick={() => start(pendingTopic)}>换到新主题</button></section></div>}
  </div>

  const topic = THINKING_TOPICS.find((t) => t.id === draft.topic)!
  const example = draft.phase === 'example'
  const q = example ? draft.example : draft.problems[draft.practiceIndex]
  const currentStep = q.steps[draft.step]
  const answered = draft.picked !== null
  const correct = draft.picked === q.answer
  const canMove = example ? draft.checkpoint === currentStep.answer : answered && (correct || draft.helpStep >= q.steps.length)
  const choose = (picked: string) => {
    if (answered) return
    const right = picked === q.answer
    if (right) soundCorrect()
    else soundWrong()
    const attempt = { problemKey: q.key, prompt: q.prompt, answer: q.answer, picked, correct: right, helped: draft.helpStep >= 0 }
    update({ picked, attempts: [...draft.attempts, attempt], helpStep: right ? draft.helpStep : Math.max(1, draft.helpStep) })
  }
  const advance = () => {
    if (!canMove) return
    stopSpeaking()
    if (example) {
      if (draft.step < q.steps.length - 1) update({ step: draft.step + 1, checkpoint: null })
      else update({ phase: 'practice', step: 0, checkpoint: null })
    } else if (draft.practiceIndex < draft.problems.length - 1) update({ practiceIndex: draft.practiceIndex + 1, picked: null, helpStep: -1 })
    else finish()
  }
  return <div className="mx-auto max-w-2xl px-4 py-4 text-ink">
    <div className="flex items-center justify-between gap-3"><button className={secondary} onClick={() => { update({}); stopSpeaking(); setInLesson(false) }}>← 休息一下</button><span className="text-sm font-bold">{example ? `一起学 · ${draft.step + 1}/3 步` : `自己试 · ${draft.practiceIndex + 1}/3 题`}</span></div>
    <div className="mt-4 flex gap-2" aria-label="课程进度">{['学例题', '试一题', '再试试', '小挑战'].map((label, i) => <div key={label} className={`flex-1 rounded-full px-1 py-2 text-center text-xs font-bold ${i <= (example ? 0 : draft.practiceIndex + 1) ? 'bg-candy-sage text-candy-sagedeep' : 'bg-white text-ink/50'}`}>{label}</div>)}</div>
    <section className="mt-4 rounded-[2rem] bg-white p-5">
      <div className="text-sm font-bold text-candy-bluedeep">{topic.icon} {topic.title} · {example ? '图解例题' : '同类练习'}</div>
      <h1 className="my-4 font-display text-xl leading-relaxed">{q.prompt}</h1>
      <Listen text={q.prompt} label="听题目" />
      {example ? <div className="mt-5 rounded-2xl bg-candy-blue/30 p-4">
        <h2 className="font-display text-xl">第 {draft.step + 1} 步 · {currentStep.title}</h2>
        <ThinkingDiagram diagram={q.diagram} stage={draft.step + 1} />
        <p className="leading-loose">{currentStep.text}</p>
        <div className="mt-3"><Listen text={`${currentStep.title}。${currentStep.text}。${currentStep.ask}。选项是：${currentStep.options.join('，')}`} label="听这一步" /></div>
        <h3 className="mb-3 mt-5 text-lg font-bold">{currentStep.ask}</h3>
        <div className="grid grid-cols-2 gap-3">{currentStep.options.map((opt) => <button key={opt} disabled={draft.checkpoint === currentStep.answer} className={`min-h-12 rounded-2xl px-3 py-3 text-lg font-bold ${draft.checkpoint === opt ? opt === currentStep.answer ? 'bg-candy-sagedeep text-white' : 'bg-candy-pink' : 'bg-white'}`} onClick={() => { update({ checkpoint: opt }); if (opt === currentStep.answer) soundCorrect(); else soundWrong() }}>{opt}</button>)}</div>
        {draft.checkpoint && <p role="status" className="mt-3 font-bold">{draft.checkpoint === currentStep.answer ? '✅ 想对了！我们接着学。' : '🌱 再看看图、听一听，可以再选一次。'}</p>}
      </div> : <>
        <p className="mt-4 text-sm text-ink/60">先自己想一想。需要帮助时，点下面的按钮。</p>
        <div className="my-4 grid grid-cols-2 gap-3">{q.options.map((opt) => <button key={opt} disabled={answered} onClick={() => choose(opt)} className={`min-h-14 rounded-2xl px-3 py-4 text-xl font-bold ${answered && opt === q.answer ? 'bg-candy-sagedeep text-white' : draft.picked === opt ? 'bg-candy-pink' : 'bg-cream'}`}>{opt}{answered && opt === q.answer ? ' ✓' : ''}</button>)}</div>
        <Listen text={`选项是：${q.options.join('，')}`} label="听选项" />
        {answered && <p role="status" className="mt-4 rounded-xl bg-candy-sage/40 p-3 font-bold">{correct ? !draft.attempts.find((a) => a.problemKey === q.key)?.helped ? '🌟 自己想出来了，真棒！' : '💡 在帮助下想对了，下题再试试！' : '🌱 没关系，我们看图弄明白，再试下一题。'}</p>}
        {draft.helpStep < 0 ? <button className="mt-4 min-h-12 w-full rounded-xl bg-candy-blue/50 px-4 py-3 font-bold" onClick={() => update({ helpStep: 0 })}>💡 帮帮我，先看提示</button> : <div className="mt-4 rounded-2xl bg-candy-blue/30 p-4">
          <h2 className="font-bold">💡 一起想一想</h2><p className="my-3 leading-loose">{q.hint}</p><Listen text={q.hint} label="听提示" />
          {draft.helpStep > 0 && <div className="mt-4 border-t border-candy-blue pt-4"><h3 className="font-bold">第 {draft.helpStep} 步 · {q.steps[draft.helpStep - 1].title}</h3><ThinkingDiagram diagram={q.diagram} stage={draft.helpStep} /><p className="mb-3 leading-loose">{q.steps[draft.helpStep - 1].text}</p><Listen text={q.steps[draft.helpStep - 1].text} label="听讲解" /></div>}
          <div className="mt-4 flex gap-2">{draft.helpStep > 1 && <button className={secondary} onClick={() => { stopSpeaking(); update({ helpStep: draft.helpStep - 1 }) }}>上一步</button>}{draft.helpStep < q.steps.length && <button className="min-h-12 flex-1 rounded-xl bg-candy-bluedeep px-3 py-3 font-bold text-white" onClick={() => { stopSpeaking(); update({ helpStep: draft.helpStep + 1 }) }}>{draft.helpStep === 0 ? '看图，一步一步学' : '继续看下一步'}</button>}</div>
        </div>}
      </>}
    </section>
    <button className={`${primary} mt-5`} disabled={!canMove} onClick={advance}>{example ? draft.step === 2 ? '我来试一题 →' : '想明白了，下一步 →' : draft.practiceIndex === 2 ? '完成，领取积分 ⭐' : '换一道自己试试 →'}</button>
    {!example && answered && !canMove && <p className="mt-3 text-center text-sm">先跟着图解走完三步，再出发。</p>}
    <p className="mt-4 text-center text-xs text-ink/50">进度保存在这个浏览器里，可以随时休息。</p>
  </div>
}
