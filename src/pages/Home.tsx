import type { Subject } from '@/types'
import { SUBJECT_META } from '@/types'
import { ALL_PACKS as PACKS } from '@/data/plan'
import { useStore, calcStreak, todayStr } from '@/lib/store'

export default function Home({ onSubject, onThinking, onPronunciation }: { onSubject: (s: Subject) => void; onThinking: () => void; onPronunciation: () => void }) {
  const { state } = useStore()
  const streak = calcStreak(state.checkins)
  const today = todayStr()
  const todayDone = state.checkins.filter((c) => c.date === today)
  const todaySubjects = new Set(todayDone.map((c) => c.subject))

  const hour = new Date().getHours()
  const greet = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28">
      {/* 顶部问候 + 积分 */}
      <div className="animate-pop-in mt-4 rounded-[2.5rem] bg-gradient-to-br from-candy-peach to-candy-pink p-6 shadow-[0_8px_0_rgba(84,69,63,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-2xl text-ink sm:text-3xl">{greet}，小学霸！🌱</div>
            <div className="mt-1 text-sm font-bold text-ink/60">
              {todayDone.length > 0 ? `今天已打卡 ${todayDone.length} 次，真棒！` : '今天还没有打卡，来挑战一组题吧！'}
            </div>
          </div>
          <div className="animate-float text-5xl">🐳</div>
        </div>
        <div className="mt-4 flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-3xl bg-white/85 px-4 py-3">
            <span className="text-2xl">⭐</span>
            <div>
              <div className="font-display text-2xl leading-none text-candy-yellowdeep">{state.points}</div>
              <div className="text-xs font-bold text-ink/50">我的积分</div>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-3xl bg-white/85 px-4 py-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-display text-2xl leading-none text-candy-pinkdeep">{streak} 天</div>
              <div className="text-xs font-bold text-ink/50">连续打卡</div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onThinking} className="btn-press mt-5 block w-full rounded-[2rem] bg-candy-blue p-5 text-left shadow-[0_6px_0_rgba(84,69,63,0.08)]">
        <div className="text-sm font-bold text-candy-bluedeep">一年级 · 奥数自学专区</div>
        <div className="font-display mt-2 text-2xl">🔍 小小思考家 <span className="float-right">→</span></div>
        <p className="mt-2 text-sm leading-relaxed">看图学办法，自己试一试，挣积分换礼物。</p>
        <div className="mt-3 inline-block rounded-full bg-white/80 px-3 py-2 text-sm font-bold">{state.thinkingDraft ? '▶ 继续上次学习' : '🌱 5 个主题 · 从图解例题开始'}</div>
      </button>

      <button onClick={onPronunciation} className="btn-press mt-4 block w-full rounded-[2rem] bg-gradient-to-br from-candy-peach to-candy-pink p-5 text-left shadow-[0_6px_0_rgba(84,69,63,0.08)]">
        <div className="text-sm font-bold text-candy-peachdeep">英语 · 发音练习</div>
        <div className="font-display mt-2 text-2xl">🗣️ 发音小课堂 <span className="float-right">→</span></div>
        <p className="mt-2 text-sm leading-relaxed">看口型图学音标，听连读短语，说出地道英语。</p>
        <div className="mt-3 inline-block rounded-full bg-white/80 px-3 py-2 text-sm font-bold">🔤 48 个音标 · 🔗 20 个连读</div>
      </button>

      {/* 今日目标 */}
      <div className="animate-pop-in mt-5 rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)]" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between">
          <div className="font-display text-xl text-ink">🎯 今日三科小目标</div>
          <div className="text-sm font-bold text-ink/50">{todaySubjects.size}/3</div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {(Object.keys(SUBJECT_META) as Subject[]).map((s) => {
            const done = todaySubjects.has(s)
            return (
              <div
                key={s}
                className={`rounded-2xl py-3 text-center font-bold transition-all ${
                  done ? 'bg-candy-sage/60 text-candy-sagedeep' : 'bg-cream text-ink/40'
                }`}
              >
                <div className="text-2xl">{done ? '✅' : SUBJECT_META[s].emoji}</div>
                <div className="mt-1 text-sm">{SUBJECT_META[s].name}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 科目入口 */}
      <div className="mt-5 space-y-4">
        {(Object.keys(SUBJECT_META) as Subject[]).map((s, i) => {
          const meta = SUBJECT_META[s]
          const packs = PACKS.filter((p) => p.subject === s)
          const doneCount = state.checkins.filter((c) => c.subject === s).length
          return (
            <button
              key={s}
              onClick={() => onSubject(s)}
              className="btn-press animate-pop-in block w-full rounded-[2rem] p-5 text-left shadow-[0_6px_0_rgba(84,69,63,0.10)]"
              style={{ background: meta.color, animationDelay: `${160 + i * 90}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{meta.emoji}</span>
                  <div>
                    <div className="font-display text-2xl text-ink">{meta.name}乐园</div>
                    <div className="mt-0.5 text-sm font-bold text-ink/60">
                      {packs.length} 个题包 · 已完成 {doneCount} 次
                    </div>
                  </div>
                </div>
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-xl font-black text-white"
                  style={{ background: meta.deep }}
                >
                  →
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 text-center text-xs font-bold text-ink/40">
        每组题包约 15–20 分钟 · 完成即可获得积分 🌟
      </div>
    </div>
  )
}
