import type { VisualSpec } from '@/types'

/** 手绘风 SVG 苹果 */
function Apple({ crossed, delay }: { crossed?: boolean; delay: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-10 w-10 sm:h-12 sm:w-12 animate-count-pop"
      style={{ animationDelay: `${delay}ms` }}
    >
      <path d="M24 10 C23 6 25 4 27 3" stroke="#7A5C3E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M27 6 C30 2 36 3 37 6 C34 9 29 9 27 6 Z" fill="#7FBF6A" />
      <path
        d="M24 12 C14 8 6 15 8 26 C10 37 17 44 24 44 C31 44 38 37 40 26 C42 15 34 8 24 12 Z"
        fill={crossed ? '#D9CFC7' : '#F26D6D'}
      />
      <ellipse cx="17" cy="22" rx="4" ry="6" fill={crossed ? '#C9BFB7' : '#FF9D9D'} opacity="0.8" transform="rotate(-15 17 22)" />
      {crossed && (
        <g stroke="#54453F" strokeWidth="3" strokeLinecap="round">
          <line x1="12" y1="16" x2="36" y2="40" />
          <line x1="36" y1="16" x2="12" y2="40" />
        </g>
      )}
    </svg>
  )
}

function CountVisual({ count, crossed = 0 }: { count: number; crossed?: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 rounded-3xl bg-white/70 px-4 py-3">
      {Array.from({ length: count }).map((_, i) => (
        <Apple key={i} crossed={i >= count - crossed} delay={i * 60} />
      ))}
    </div>
  )
}

/** 十格阵：理解 10 以内加法与凑十 */
function TenFrame({ first, second = 0 }: { first: number; second?: number }) {
  const cells = Array.from({ length: 10 })
  return (
    <div className="inline-block rounded-3xl bg-white/80 p-3 shadow-inner">
      <div className="grid grid-cols-5 gap-2">
        {cells.map((_, i) => {
          const isFirst = i < first
          const isSecond = i >= first && i < first + second
          return (
            <div
              key={i}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-candy-beige bg-cream sm:h-13 sm:w-13"
            >
              {(isFirst || isSecond) && (
                <div
                  className={`h-7 w-7 rounded-full animate-count-pop ${
                    isFirst ? 'bg-candy-bluedeep' : 'bg-candy-peachdeep'
                  }`}
                  style={{ animationDelay: `${i * 70}ms` }}
                />
              )}
            </div>
          )
        })}
      </div>
      {second > 0 && (
        <div className="mt-2 flex items-center justify-center gap-4 text-xs font-bold text-ink/70">
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-candy-bluedeep" /> {first} 个
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded-full bg-candy-peachdeep" /> {second} 个
          </span>
        </div>
      )}
    </div>
  )
}

/** 分组圆点：乘法启蒙 */
function Groups({ groups, per }: { groups: number; per: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {Array.from({ length: groups }).map((_, g) => (
        <div
          key={g}
          className="flex items-center gap-1.5 rounded-2xl border-2 border-dashed border-candy-lavenderdeep/50 bg-white/80 px-3 py-2 animate-pop-in"
          style={{ animationDelay: `${g * 120}ms` }}
        >
          {Array.from({ length: per }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-6 rounded-full bg-candy-lavenderdeep animate-count-pop sm:h-7 sm:w-7"
              style={{ animationDelay: `${g * 120 + i * 60}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default function Visual({ spec }: { spec: VisualSpec }) {
  switch (spec.kind) {
    case 'count':
      return <CountVisual count={spec.count} crossed={spec.crossed} />
    case 'tenframe':
      return <TenFrame first={spec.first} second={spec.second} />
    case 'groups':
      return <Groups groups={spec.groups} per={spec.per} />
    case 'emoji':
      return (
        <div className="flex flex-col items-center gap-1">
          <span className="text-7xl animate-pop-spring sm:text-8xl">{spec.emoji}</span>
          {spec.label && <span className="text-sm font-bold text-ink/60">{spec.label}</span>}
        </div>
      )
    default:
      return null
  }
}
