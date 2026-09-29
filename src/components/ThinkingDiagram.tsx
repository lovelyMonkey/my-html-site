import type { ThinkingDiagram as Diagram } from '@/types/thinking'

const ANIMALS: Record<string, string> = { 小兔: '🐰', 小熊: '🐻', 小猫: '🐱' }

/** 图解只显示当前步骤的信息，练习未求助时不展示答案图。 */
export default function ThinkingDiagram({ diagram: d, stage }: { diagram: Diagram; stage: number }) {
  const panel = 'my-4 rounded-2xl bg-white p-3 text-center text-ink'
  if (d.kind === 'pattern') return (
    <figure className={panel} aria-label="数字火车图解">
      <div className="grid grid-cols-5 gap-1">
        {[...d.numbers, stage >= 3 ? d.numbers[3] + d.jump : '?'].map((n, i) => (
          <div key={i}>
            <div className={`rounded-xl border-b-4 p-2 font-display text-xl ${i === 4 ? 'border-candy-yellowdeep bg-candy-yellow' : 'border-candy-bluedeep bg-candy-blue'}`}>{n}</div>
            {i < 4 && (stage >= 2 || i === 0) && <div className="mt-2 text-xs font-bold">+{d.jump} →</div>}
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-sm">每相邻两节车厢，比一比多了几。</figcaption>
    </figure>
  )
  if (d.kind === 'queue') {
    const row = (n: number, yellow: number) => <div className="mt-2 flex flex-wrap justify-center gap-1">{Array.from({ length: n }, (_, i) => <span key={i} className={`inline-flex h-8 w-7 items-center justify-center rounded-lg text-lg ${i === yellow ? 'bg-candy-yellow ring-2 ring-candy-yellowdeep' : 'bg-candy-blue'}`}>{i === yellow ? '⭐' : '●'}</span>)}</div>
    return <figure className={panel} aria-label="排队图解，星星代表同一个小黄">
      {stage < 3 ? <>
        <div>从前往后数 →</div>{row(d.front, d.front - 1)}
        {stage >= 2 && <><div className="mt-4">← 从后往前数</div>{row(d.back, d.back - 1)}<p className="mt-3 font-bold text-candy-peachdeep">两颗星星，画的是同一个小黄！</p></>}
      </> : <><div>前面 → 后面</div>{row(d.front + d.back - 1, d.front - 1)}<p className="mt-3">合成一队，小黄只留下一个。</p></>}
    </figure>
  }
  if (d.kind === 'cuts') {
    const pieces = stage === 1 ? 1 : stage === 2 ? 2 : d.pieces
    return <figure className={panel}>
      <svg role="img" aria-label={`${pieces} 段纸带，${pieces - 1} 个切口`} viewBox="0 0 360 100" className="w-full">
        <rect x="8" y="22" width="344" height="48" rx="6" fill="#FFD79D" />
        {Array.from({ length: pieces }, (_, i) => <text key={i} x={8 + (i + 0.5) * 344 / pieces} y="53" textAnchor="middle" fontSize="18" fill="#54453f">{i + 1}</text>)}
        {Array.from({ length: pieces - 1 }, (_, i) => <line key={i} x1={8 + (i + 1) * 344 / pieces} x2={8 + (i + 1) * 344 / pieces} y1="12" y2="82" stroke="#C96F2E" strokeWidth="3" strokeDasharray="5 4" />)}
      </svg>
      <figcaption className="text-sm">数字数段数，虚线数切口。{stage === 1 ? '还没切，也有 1 段。' : '两头的边缘不是切口。'}</figcaption>
    </figure>
  }
  if (d.kind === 'counting') {
    const rows = stage === 1 ? 1 : d.tops
    return <figure className={panel} aria-label="搭配表，每行固定一件上衣，每列固定一条裤子">
      <div className="space-y-2">{Array.from({ length: rows }, (_, i) => <div key={i} className="grid gap-1" style={{ gridTemplateColumns: `repeat(${d.bottoms}, minmax(0, 1fr))` }}>{Array.from({ length: d.bottoms }, (_, j) => <div key={j} className="rounded-lg bg-candy-sage/40 py-2 text-xs"><div className="text-lg">👕👖</div><div>衣{i + 1}＋裤{j + 1}</div></div>)}</div>)}</div>
      <figcaption className="mt-3 text-sm">衣服上的编号不同，就是不同的衣服。</figcaption>
    </figure>
  }
  const order = d.order.slice(0, stage === 1 ? 2 : 3)
  return <figure className={panel} aria-label={`从前往后：${order.join('、')}`}>
    <div className="mb-3 text-sm">前面 → 后面</div>
    <div className="flex justify-center gap-2">{order.map((name, i) => <div key={name} className={`flex-1 rounded-xl p-2 ${i === 1 ? 'bg-candy-yellow/60' : 'bg-candy-blue/60'}`}><div className="text-3xl">{ANIMALS[name]}</div><div className="mt-2 font-bold">{name}</div></div>)}</div>
    <figcaption className="mt-3 text-sm">{stage === 1 ? '先把第一条线索摆出来。' : '找到中间的朋友，就能连成一队。'}</figcaption>
  </figure>
}
