import { useState } from 'react'
import type { Reward } from '@/types'
import { useStore, todayStr, uid } from '@/lib/store'
import { soundCoin } from '@/lib/tts'
import Confetti from '@/components/Confetti'

export default function Shop() {
  const { state, dispatch } = useStore()
  const [confirming, setConfirming] = useState<Reward | null>(null)
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null)

  const rewards = state.rewards.filter((r) => r.active)

  const redeem = (r: Reward) => {
    dispatch({
      type: 'redeem',
      redemption: { id: uid(), rewardTitle: r.title, icon: r.icon, cost: r.cost, date: todayStr(), ts: Date.now() },
    })
    soundCoin()
    setConfirming(null)
    setJustRedeemed(r.title)
    setTimeout(() => setJustRedeemed(null), 2600)
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28">
      <Confetti fire={!!justRedeemed} />

      <div className="py-4">
        <h1 className="font-display text-3xl text-ink">🎁 积分商城</h1>
        <div className="mt-1 text-sm font-bold text-ink/50">
          用努力换来的积分，兑换喜欢的奖励吧！
        </div>
      </div>

      <div className="animate-pop-in flex items-center justify-center gap-2 rounded-[2rem] bg-candy-yellow/50 py-4">
        <span className="text-3xl">⭐</span>
        <span className="font-display text-3xl text-candy-yellowdeep">{state.points}</span>
        <span className="font-bold text-ink/50">分可用</span>
      </div>

      {justRedeemed && (
        <div className="animate-pop-in mt-4 rounded-3xl bg-candy-sage/60 px-5 py-4 text-center font-display text-xl text-candy-sagedeep">
          🎉 兑换成功：{justRedeemed}！快去找爸爸妈妈兑现吧！
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-4">
        {rewards.map((r, i) => {
          const affordable = state.points >= r.cost
          return (
            <div
              key={r.id}
              className="animate-pop-in flex flex-col items-center rounded-[2rem] bg-white p-5 text-center shadow-[0_6px_0_rgba(84,69,63,0.08)]"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="text-5xl">{r.icon}</span>
              <div className="font-display mt-2 text-lg leading-tight text-ink">{r.title}</div>
              <div className="mt-1 text-sm font-bold text-candy-yellowdeep">⭐ {r.cost} 分</div>
              <button
                disabled={!affordable}
                onClick={() => setConfirming(r)}
                className={`btn-press mt-3 w-full rounded-2xl py-2.5 font-display text-lg ${
                  affordable
                    ? 'bg-candy-peachdeep text-white shadow-[0_4px_0_#C96F2E]'
                    : 'bg-ink/10 text-ink/40'
                }`}
              >
                {affordable ? '兑换' : `还差 ${r.cost - state.points} 分`}
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-4 text-center text-xs font-bold text-ink/40">
        想换别的奖励？请爸爸妈妈到「家长中心」添加 ⚙️
      </div>

      {/* 兑换记录 */}
      {state.redemptions.length > 0 && (
        <div className="mt-6">
          <div className="font-display text-xl text-ink">📜 兑换记录</div>
          <div className="mt-2 space-y-2">
            {state.redemptions.slice(0, 10).map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-ink/70">
                <span className="text-xl">{r.icon}</span>
                <span className="flex-1">{r.rewardTitle}</span>
                <span className="text-candy-yellowdeep">-{r.cost}</span>
                <span className="text-xs text-ink/40">{r.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 确认弹窗 */}
      {confirming && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-ink/40 px-6" onClick={() => setConfirming(null)}>
          <div
            className="animate-pop-spring w-full max-w-sm rounded-[2rem] bg-white p-7 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-6xl">{confirming.icon}</span>
            <div className="font-display mt-3 text-2xl text-ink">{confirming.title}</div>
            <div className="mt-1 font-bold text-ink/50">要花掉 ⭐ {confirming.cost} 分哦</div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirming(null)}
                className="btn-press flex-1 rounded-2xl bg-cream py-3 font-display text-lg text-ink"
              >
                再想想
              </button>
              <button
                onClick={() => redeem(confirming)}
                className="btn-press flex-1 rounded-2xl bg-candy-sagedeep py-3 font-display text-lg text-white shadow-[0_4px_0_#4A7D3F]"
              >
                确定兑换
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
