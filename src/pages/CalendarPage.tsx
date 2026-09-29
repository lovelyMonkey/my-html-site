import { useMemo, useState } from 'react'
import { SUBJECT_META } from '@/types'
import type { Subject } from '@/types'
import { useStore, calcStreak, todayStr } from '@/lib/store'

export default function CalendarPage() {
  const { state } = useStore()
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
  })

  const byDate = useMemo(() => {
    const map = new Map<string, Subject[]>()
    for (const c of state.checkins) {
      const arr = map.get(c.date) ?? []
      arr.push(c.subject)
      map.set(c.date, arr)
    }
    return map
  }, [state.checkins])

  const streak = calcStreak(state.checkins)
  const totalDays = byDate.size

  const first = new Date(month.y, month.m, 1)
  const startWeekday = (first.getDay() + 6) % 7 // 周一起
  const daysInMonth = new Date(month.y, month.m + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const today = todayStr()

  const monthCheckins = state.checkins.filter((c) => {
    const d = new Date(c.ts)
    return d.getFullYear() === month.y && d.getMonth() === month.m
  })

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28">
      <div className="py-4">
        <h1 className="font-display text-3xl text-ink">📅 打卡日历</h1>
      </div>

      {/* 统计 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🔥', value: `${streak} 天`, label: '连续打卡', bg: 'bg-candy-pink/60', fg: 'text-candy-pinkdeep' },
          { icon: '🗓️', value: `${totalDays} 天`, label: '累计打卡', bg: 'bg-candy-blue/60', fg: 'text-candy-bluedeep' },
          { icon: '⭐', value: `${state.totalEarned}`, label: '累计积分', bg: 'bg-candy-yellow/60', fg: 'text-candy-yellowdeep' },
        ].map((s) => (
          <div key={s.label} className={`animate-pop-in rounded-3xl ${s.bg} px-3 py-4 text-center`}>
            <div className="text-2xl">{s.icon}</div>
            <div className={`font-display text-xl ${s.fg}`}>{s.value}</div>
            <div className="text-xs font-bold text-ink/50">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 月历 */}
      <div className="animate-pop-in mt-5 rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)]" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between">
          <button
            className="btn-press flex h-10 w-10 items-center justify-center rounded-2xl bg-cream font-black text-ink"
            onClick={() => setMonth(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))}
          >
            ←
          </button>
          <div className="font-display text-xl text-ink">
            {month.y} 年 {month.m + 1} 月
          </div>
          <button
            className="btn-press flex h-10 w-10 items-center justify-center rounded-2xl bg-cream font-black text-ink"
            onClick={() => setMonth(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}
          >
            →
          </button>
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-bold text-ink/40">
          {['一', '二', '三', '四', '五', '六', '日'].map((d) => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />
            const ds = `${month.y}-${String(month.m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const subjects = byDate.get(ds)
            const isToday = ds === today
            return (
              <div
                key={ds}
                className={`flex aspect-square flex-col items-center justify-center rounded-2xl text-sm font-bold ${
                  isToday ? 'bg-candy-yellow/70 text-ink' : subjects ? 'bg-candy-sage/50 text-ink' : 'text-ink/50'
                }`}
              >
                <span>{day}</span>
                {subjects && (
                  <span className="flex gap-0.5">
                    {[...new Set(subjects)].map((s) => (
                      <span key={s} className="h-1.5 w-1.5 rounded-full" style={{ background: SUBJECT_META[s].deep }} />
                    ))}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex justify-center gap-4 text-xs font-bold text-ink/50">
          {(Object.keys(SUBJECT_META) as Subject[]).map((s) => (
            <span key={s} className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: SUBJECT_META[s].deep }} />
              {SUBJECT_META[s].name}
            </span>
          ))}
        </div>
      </div>

      {/* 本月记录 */}
      <div className="mt-5">
        <div className="font-display text-xl text-ink">📝 本月打卡记录（{monthCheckins.length}）</div>
        <div className="mt-2 space-y-2">
          {monthCheckins.length === 0 && (
            <div className="rounded-3xl bg-white/70 px-5 py-8 text-center font-bold text-ink/40">
              这个月还没有打卡记录，去完成一组题包吧！
            </div>
          )}
          {monthCheckins.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                style={{ background: SUBJECT_META[c.subject].color }}
              >
                {SUBJECT_META[c.subject].emoji}
              </span>
              <div className="flex-1">
                <div>{c.packTitle}</div>
                <div className="text-xs text-ink/40">
                  {c.date} · 答对 {c.correct}/{c.total} · 用时 {Math.floor(c.seconds / 60)}分{c.seconds % 60}秒
                </div>
              </div>
              <span className="text-candy-yellowdeep">+{c.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
