import { useState } from 'react'
import { useStore, uid } from '@/lib/store'
import ThinkingSummary from '@/components/ThinkingSummary'
import type { Reward } from '@/types'

const ICON_CHOICES = ['📺', '📱', '🎮', '🍬', '🍦', '🧸', '🎡', '⚽', '🎨', '📚', '🛝', '🚲', '🍕', '🎬', '🪁', '🐾']

export default function Parent() {
  const { state, dispatch } = useStore()
  const [unlocked, setUnlocked] = useState(false)
  const [gateAns, setGateAns] = useState('')
  const [gateErr, setGateErr] = useState(false)
  const [gate] = useState(() => {
    const a = 6 + Math.floor(Math.random() * 4)
    const b = 6 + Math.floor(Math.random() * 4)
    return { a, b, ans: a * b }
  })

  const [newTitle, setNewTitle] = useState('')
  const [newIcon, setNewIcon] = useState(ICON_CHOICES[0])
  const [newCost, setNewCost] = useState(50)
  const [adjust, setAdjust] = useState(10)
  const [confirmReset, setConfirmReset] = useState(false)

  if (!unlocked) {
    return (
      <div className="mx-auto flex min-h-[calc(100dvh-90px)] w-full max-w-md flex-col items-center justify-center px-4 pb-28">
        <div className="animate-pop-in w-full rounded-[2.5rem] bg-white p-8 text-center shadow-[0_8px_0_rgba(84,69,63,0.08)]">
          <span className="text-5xl">🔐</span>
          <h1 className="font-display mt-3 text-2xl text-ink">家长验证</h1>
          <p className="mt-1 text-sm font-bold text-ink/50">这里是家长中心，小朋友请找爸爸妈妈哦</p>
          <div className="font-display mt-6 text-4xl text-ink">
            {gate.a} × {gate.b} = ?
          </div>
          <input
            type="number"
            inputMode="numeric"
            value={gateAns}
            onChange={(e) => {
              setGateAns(e.target.value)
              setGateErr(false)
            }}
            placeholder="输入答案"
            className={`mt-5 w-full rounded-2xl border-4 bg-cream px-4 py-3 text-center font-display text-2xl outline-none ${
              gateErr ? 'border-candy-pinkdeep' : 'border-candy-beige focus:border-candy-bluedeep'
            }`}
          />
          {gateErr && <div className="mt-2 text-sm font-bold text-candy-pinkdeep">答案不对，再算一算～</div>}
          <button
            onClick={() => {
              if (Number(gateAns) === gate.ans) setUnlocked(true)
              else setGateErr(true)
            }}
            className="btn-press mt-5 w-full rounded-3xl bg-candy-bluedeep py-4 font-display text-xl text-white shadow-[0_5px_0_#2E7A90]"
          >
            进入家长中心
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28">
      <div className="py-4">
        <h1 className="font-display text-3xl text-ink">⚙️ 家长中心</h1>
        <div className="mt-1 text-sm font-bold text-ink/50">管理奖励、积分规则和学习数据</div>
      </div>

      {/* 积分规则 */}
      <section className="animate-pop-in rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)]">
        <h2 className="font-display text-xl text-ink">⭐ 积分规则</h2>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
          <span className="text-sm font-bold text-ink/70">每答对一题</span>
          <div className="flex items-center gap-3">
            <button
              className="btn-press h-9 w-9 rounded-xl bg-white font-black text-ink shadow-sm"
              onClick={() => dispatch({ type: 'setPerCorrect', value: Math.max(1, state.settings.perCorrect - 1) })}
            >
              −
            </button>
            <span className="font-display text-2xl text-candy-yellowdeep">+{state.settings.perCorrect}</span>
            <button
              className="btn-press h-9 w-9 rounded-xl bg-white font-black text-ink shadow-sm"
              onClick={() => dispatch({ type: 'setPerCorrect', value: Math.min(10, state.settings.perCorrect + 1) })}
            >
              +
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-cream px-4 py-3">
          <span className="text-sm font-bold text-ink/70">手动调整积分（当前 {state.points}）</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={adjust}
              onChange={(e) => setAdjust(Math.max(1, Number(e.target.value) || 1))}
              className="w-20 rounded-xl border-2 border-candy-beige bg-white px-2 py-1.5 text-center font-display text-lg outline-none"
            />
            <button
              className="btn-press rounded-xl bg-candy-sagedeep px-3 py-2 font-bold text-white"
              onClick={() => dispatch({ type: 'adjustPoints', delta: adjust })}
            >
              +
            </button>
            <button
              className="btn-press rounded-xl bg-candy-pinkdeep px-3 py-2 font-bold text-white"
              onClick={() => dispatch({ type: 'adjustPoints', delta: -adjust })}
            >
              −
            </button>
          </div>
        </div>
      </section>

      <ThinkingSummary />

      {/* 添加奖励 */}
      <section className="animate-pop-in mt-5 rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)]" style={{ animationDelay: '80ms' }}>
        <h2 className="font-display text-xl text-ink">🎁 添加新奖励</h2>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="例如：看动画片 30 分钟"
          className="mt-3 w-full rounded-2xl border-2 border-candy-beige bg-cream px-4 py-3 font-bold outline-none focus:border-candy-bluedeep"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {ICON_CHOICES.map((ic) => (
            <button
              key={ic}
              onClick={() => setNewIcon(ic)}
              className={`btn-press flex h-11 w-11 items-center justify-center rounded-2xl text-2xl ${
                newIcon === ic ? 'bg-candy-yellow shadow-[0_3px_0_#E8A81C]' : 'bg-cream'
              }`}
            >
              {ic}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm font-bold text-ink/70">所需积分</span>
          <input
            type="number"
            inputMode="numeric"
            value={newCost}
            onChange={(e) => setNewCost(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-xl border-2 border-candy-beige bg-white px-2 py-1.5 text-center font-display text-lg outline-none"
          />
          <button
            onClick={() => {
              if (!newTitle.trim()) return
              const reward: Reward = { id: uid(), title: newTitle.trim(), icon: newIcon, cost: newCost, active: true }
              dispatch({ type: 'addReward', reward })
              setNewTitle('')
            }}
            className="btn-press ml-auto rounded-2xl bg-candy-peachdeep px-6 py-2.5 font-display text-lg text-white shadow-[0_4px_0_#C96F2E]"
          >
            添加
          </button>
        </div>
      </section>

      {/* 奖励管理 */}
      <section className="animate-pop-in mt-5 rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)]" style={{ animationDelay: '160ms' }}>
        <h2 className="font-display text-xl text-ink">📋 奖励管理</h2>
        <div className="mt-3 space-y-2">
          {state.rewards.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-cream px-4 py-3 text-sm font-bold">
              <span className="text-xl">{r.icon}</span>
              <span className="flex-1">{r.title}</span>
              <span className="text-candy-yellowdeep">⭐ {r.cost}</span>
              <button
                className="btn-press rounded-xl bg-white px-3 py-1.5 text-candy-pinkdeep shadow-sm"
                onClick={() => dispatch({ type: 'removeReward', id: r.id })}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 危险区 */}
      <section className="animate-pop-in mt-5 rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)]" style={{ animationDelay: '240ms' }}>
        <h2 className="font-display text-xl text-ink">🧹 数据管理</h2>
        <p className="mt-1 text-xs font-bold text-ink/40">
          所有数据保存在本设备的浏览器中，清除浏览器数据会丢失记录。
        </p>
        {!confirmReset ? (
          <button
            className="btn-press mt-3 rounded-2xl bg-candy-pink/70 px-5 py-2.5 font-bold text-candy-pinkdeep"
            onClick={() => setConfirmReset(true)}
          >
            清空学习记录与积分
          </button>
        ) : (
          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-candy-pink/50 px-4 py-3">
            <span className="flex-1 text-sm font-bold text-candy-pinkdeep">确定要清空吗？此操作不可恢复！</span>
            <button
              className="btn-press rounded-xl bg-candy-pinkdeep px-4 py-2 font-bold text-white"
              onClick={() => {
                dispatch({ type: 'resetAll' })
                setConfirmReset(false)
              }}
            >
              确定清空
            </button>
            <button className="btn-press rounded-xl bg-white px-4 py-2 font-bold text-ink" onClick={() => setConfirmReset(false)}>
              取消
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
