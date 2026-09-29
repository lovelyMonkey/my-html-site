import { useMemo, useState } from 'react'
import type { Pack, Subject } from '@/types'
import { SUBJECT_META, LEVEL_NAMES } from '@/types'
import { ALL_PACKS } from '@/data/plan'
import { useStore } from '@/lib/store'

const LEVEL_EMOJI: Record<number, string> = {
  1: '🌱',
  2: '🌿',
  3: '🍀',
  4: '🌳',
  5: '🌸',
  6: '🌟',
}

type SemTab = 1 | 2 | 0 // 0 = 专项挑战

export default function Packs({
  subject,
  onStart,
  onBack,
}: {
  subject: Subject
  onStart: (p: Pack) => void
  onBack: () => void
}) {
  const { state } = useStore()
  const meta = SUBJECT_META[subject]
  const [level, setLevel] = useState(1)
  const [sem, setSem] = useState<SemTab>(1)

  const counts = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6].map(
        (lv) => ALL_PACKS.filter((p) => p.subject === subject && p.level === lv).length,
      ),
    [subject],
  )

  /** 当前年级+学期的周题包，按周分组 */
  const weekGroups = useMemo(() => {
    if (sem === 0) return []
    const list = ALL_PACKS.filter(
      (p) => p.subject === subject && p.level === level && p.semester === sem,
    ).sort((a, b) => (a.week ?? 0) - (b.week ?? 0))
    const map = new Map<number, Pack[]>()
    for (const p of list) {
      const w = p.week ?? 0
      if (!map.has(w)) map.set(w, [])
      map.get(w)!.push(p)
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0])
  }, [subject, level, sem])

  const specialPacks = useMemo(
    () =>
      ALL_PACKS.filter(
        (p) => p.subject === subject && p.level === level && p.semester === undefined,
      ),
    [subject, level],
  )

  const renderCard = (p: Pack, i: number) => {
    const doneCount = state.checkins.filter((c) => c.packId === p.id).length
    return (
      <div
        key={p.id}
        className="animate-pop-in flex items-center gap-4 rounded-[2rem] bg-white p-5 shadow-[0_6px_0_rgba(84,69,63,0.08)]"
        style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
      >
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl text-3xl"
          style={{ background: meta.color }}
        >
          {p.badge}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-xl text-ink">{p.title}</div>
          <div className="truncate text-sm font-bold text-ink/50">{p.desc}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-candy-blue/50 px-2 py-0.5 text-candy-bluedeep">
              ⏱️ 约 {p.minutes} 分钟
            </span>
            <span className="rounded-full bg-candy-yellow/60 px-2 py-0.5 text-candy-yellowdeep">
              ⭐ 约 {p.basePoints}+ 分
            </span>
            {doneCount > 0 && (
              <span className="rounded-full bg-candy-sage/60 px-2 py-0.5 text-candy-sagedeep">
                ✅ 已完成 {doneCount} 次
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => onStart(p)}
          className="btn-press shrink-0 rounded-3xl px-5 py-3 font-display text-lg text-white"
          style={{ background: meta.deep, boxShadow: `0 4px 0 rgba(84,69,63,0.25)` }}
        >
          开始
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28">
      <div className="flex items-center gap-3 py-4">
        <button
          onClick={onBack}
          className="btn-press flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm"
        >
          ←
        </button>
        <h1 className="font-display text-3xl text-ink">
          {meta.emoji} {meta.name}乐园
        </h1>
      </div>

      {/* 年级选择器 */}
      <div className="sticky top-0 z-10 -mx-4 bg-cream/95 px-4 pb-3 pt-1 backdrop-blur-sm">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4, 5, 6].map((lv) => {
            const active = lv === level
            const empty = counts[lv - 1] === 0
            return (
              <button
                key={lv}
                onClick={() => setLevel(lv)}
                disabled={empty}
                className={`btn-press flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 font-display text-base transition-all ${
                  active
                    ? 'text-white shadow-md'
                    : empty
                      ? 'bg-white/50 text-ink/25'
                      : 'bg-white text-ink/60 shadow-sm'
                }`}
                style={active ? { background: meta.deep } : undefined}
              >
                <span>{LEVEL_EMOJI[lv]}</span>
                <span>{LEVEL_NAMES[lv]}</span>
                {!empty && (
                  <span
                    className={`rounded-full px-1.5 text-xs font-bold ${
                      active ? 'bg-white/25 text-white' : 'bg-cream text-ink/40'
                    }`}
                  >
                    {counts[lv - 1]}
                  </span>
                )}
              </button>
            )
          })}
        </div>
        {/* 学期切换 */}
        <div className="mt-2 flex gap-2">
          {([1, 2, 0] as SemTab[]).map((s) => {
            const active = s === sem
            const label = s === 1 ? '📗 上学期' : s === 2 ? '📘 下学期' : '⭐ 专项挑战'
            const count =
              s === 0
                ? specialPacks.length
                : ALL_PACKS.filter(
                    (p) => p.subject === subject && p.level === level && p.semester === s,
                  ).length
            return (
              <button
                key={s}
                onClick={() => setSem(s)}
                disabled={count === 0}
                className={`btn-press flex-1 rounded-2xl px-3 py-2 font-display text-sm transition-all ${
                  active
                    ? 'bg-ink text-white shadow-md'
                    : count === 0
                      ? 'bg-white/50 text-ink/25'
                      : 'bg-white text-ink/60 shadow-sm'
                }`}
              >
                {label}
                <span className={`ml-1 text-xs ${active ? 'text-white/70' : 'text-ink/35'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 内容区 */}
      {sem === 0 ? (
        <div className="mt-2 space-y-4">
          {specialPacks.map((p, i) => renderCard(p, i))}
          {specialPacks.length === 0 && (
            <div className="rounded-[2rem] bg-white/70 p-8 text-center font-bold text-ink/40">
              这个年级暂无专项题包～
            </div>
          )}
        </div>
      ) : (
        <div className="mt-2 space-y-6">
          {weekGroups.map(([week, packs]) => (
            <div key={week}>
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="rounded-full px-3 py-1 font-display text-sm text-white"
                  style={{ background: meta.deep }}
                >
                  第 {week} 周
                </span>
                <span className="text-xs font-bold text-ink/40">
                  {packs.length} 个题包 · 约 {packs.reduce((s, p) => s + p.minutes, 0)} 分钟
                </span>
              </div>
              <div className="space-y-3">{packs.map((p, i) => renderCard(p, i))}</div>
            </div>
          ))}
          {weekGroups.length === 0 && (
            <div className="rounded-[2rem] bg-white/70 p-8 text-center font-bold text-ink/40">
              这个学期的题包正在路上～
            </div>
          )}
        </div>
      )}
    </div>
  )
}
