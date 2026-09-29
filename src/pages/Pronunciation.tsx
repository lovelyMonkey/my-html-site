import { useEffect, useMemo, useState } from 'react'
import { PHONEMES, LIAISONS } from '@/data/phonics'
import type { Phoneme } from '@/data/phonics'
import MouthDiagram from '@/components/MouthDiagram'
import { speakSmart, stopSpeaking } from '@/lib/tts'

const primary = 'btn-press min-h-12 rounded-2xl bg-candy-peachdeep px-5 py-3 font-bold text-lg text-white shadow-[0_4px_0_#C96F2E]'
const secondary = 'btn-press min-h-12 rounded-2xl bg-white px-4 py-3 font-bold text-ink shadow-sm'

type Tab = 'phoneme' | 'liaison'

const CATEGORY_ORDER: Phoneme['category'][] = ['前元音', '中元音', '后元音', '双元音', '爆破音', '摩擦音', '破擦音', '鼻音', '舌侧音', '半元音']
const CATEGORY_ICON: Record<Phoneme['category'], string> = {
  前元音: '👄', 中元音: '👄', 后元音: '👄', 双元音: '🌈',
  爆破音: '💥', 摩擦音: '💨', 破擦音: '⚡', 鼻音: '👃', 舌侧音: '👅', 半元音: '🌊',
}

export default function Pronunciation({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('phoneme')
  const [selected, setSelected] = useState<Phoneme>(PHONEMES[0])
  const [liaisonIdx, setLiaisonIdx] = useState(0)

  useEffect(() => () => stopSpeaking(), [tab, selected, liaisonIdx])

  const grouped = useMemo(() => {
    const map = new Map<Phoneme['category'], Phoneme[]>()
    for (const c of CATEGORY_ORDER) map.set(c, [])
    for (const p of PHONEMES) map.get(p.category)!.push(p)
    return map
  }, [])

  const speakPhoneme = (p: Phoneme) => {
    // 音标本身无法直接朗读，读例词
    speakSmart(p.examples[0].word, 'en-US')
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10 pt-4 text-ink">
      <div className="flex items-center justify-between gap-3">
        <button className={secondary} onClick={() => { stopSpeaking(); onBack() }}>← 回首页</button>
        <span className="text-sm font-bold text-ink/60">🗣️ 英语发音</span>
      </div>

      {/* Tab 切换 */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1.5 shadow-sm">
        <button
          className={`min-h-11 rounded-xl font-bold transition-all ${tab === 'phoneme' ? 'bg-candy-bluedeep text-white shadow' : 'text-ink/60'}`}
          onClick={() => setTab('phoneme')}
        >
          🔤 音标 ({PHONEMES.length})
        </button>
        <button
          className={`min-h-11 rounded-xl font-bold transition-all ${tab === 'liaison' ? 'bg-candy-bluedeep text-white shadow' : 'text-ink/60'}`}
          onClick={() => setTab('liaison')}
        >
          🔗 连读 ({LIAISONS.length})
        </button>
      </div>

      {tab === 'phoneme' ? (
        <>
          {/* 当前选中音标的详情卡 */}
          <section className="mt-4 rounded-[2rem] bg-gradient-to-br from-candy-blue/40 to-candy-sage/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-display text-4xl">{selected.symbol}</div>
                <div className="mt-1 text-sm font-bold text-ink/60">
                  {CATEGORY_ICON[selected.category]} {selected.category} · {selected.vowel ? '元音' : selected.vocal ? '浊辅音' : '清辅音'}
                </div>
              </div>
              <button
                className="btn-press min-h-12 shrink-0 rounded-xl bg-candy-yellow px-4 py-2 font-bold text-ink shadow-sm"
                onClick={() => speakPhoneme(selected)}
              >
                🔊 听发音
              </button>
            </div>
            <div className="mt-3 rounded-2xl bg-white/80 p-3">
              <MouthDiagram p={selected} />
              <p className="mt-2 text-center text-sm font-bold leading-relaxed">💡 {selected.tip}</p>
            </div>
            {/* 例词 */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {selected.examples.map((ex) => (
                <button
                  key={ex.word}
                  className="btn-press rounded-xl bg-white px-2 py-3 text-center shadow-sm"
                  onClick={() => speakSmart(ex.word, 'en-US')}
                >
                  <div className="font-display text-lg">{ex.word}</div>
                  <div className="mt-0.5 text-xs text-ink/60">{ex.cn}</div>
                </button>
              ))}
            </div>
          </section>

          {/* 音标列表（按分类分组） */}
          <div className="mt-5 space-y-4">
            {CATEGORY_ORDER.map((cat) => {
              const list = grouped.get(cat)!
              if (!list.length) return null
              return (
                <section key={cat} className="rounded-2xl bg-white p-4 shadow-sm">
                  <h2 className="text-sm font-bold text-ink/70">{CATEGORY_ICON[cat]} {cat}（{list.length}）</h2>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {list.map((p) => (
                      <button
                        key={p.symbol}
                        onClick={() => { stopSpeaking(); setSelected(p) }}
                        className={`btn-press min-h-12 rounded-xl font-display text-lg transition-all ${
                          selected.symbol === p.symbol
                            ? 'bg-candy-bluedeep text-white shadow-md'
                            : 'bg-cream hover:bg-candy-blue/40'
                        }`}
                      >
                        {p.symbol}
                      </button>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </>
      ) : (
        <>
          {/* 当前选中连读的详情卡 */}
          {(() => {
            const l = LIAISONS[liaisonIdx]
            return (
              <section className="mt-4 rounded-[2rem] bg-gradient-to-br from-candy-peach/40 to-candy-pink/40 p-5">
                <div className="text-center">
                  <div className="text-sm font-bold text-ink/60">原来这样说</div>
                  <div className="mt-1 font-display text-3xl">{l.phrase}</div>
                  <div className="mx-auto my-3 h-0.5 w-16 rounded bg-ink/20" />
                  <div className="text-sm font-bold text-ink/60">口语里读成</div>
                  <div className="mt-1 font-display text-3xl text-candy-peachdeep">{l.sounds}</div>
                  <div className="mt-1 text-sm text-ink/70">{l.cn}</div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/80 p-4">
                  <p className="text-sm font-bold">📌 {l.rule}</p>
                  <div className="mt-3 border-t border-candy-beige pt-3">
                    <p className="font-bold">{l.example}</p>
                    <p className="mt-1 text-sm text-ink/60">{l.exampleCn}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className={`${primary} flex-1`}
                    onClick={() => speakSmart(l.phrase, 'en-US')}
                  >
                    🔊 听原句
                  </button>
                  <button
                    className={`${primary} flex-1`}
                    onClick={() => speakSmart(l.example, 'en-US')}
                  >
                    🔊 听例句
                  </button>
                </div>
              </section>
            )
          })()}

          {/* 连读列表 */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {LIAISONS.map((l, i) => (
              <button
                key={l.phrase}
                onClick={() => { stopSpeaking(); setLiaisonIdx(i) }}
                className={`btn-press rounded-2xl p-4 text-left transition-all ${
                  liaisonIdx === i ? 'bg-candy-peachdeep text-white shadow-md' : 'bg-white shadow-sm'
                }`}
              >
                <div className="font-display text-lg">{l.phrase}</div>
                <div className={`mt-1 text-sm ${liaisonIdx === i ? 'text-white/90' : 'text-candy-peachdeep'}`}>
                  → {l.sounds.split(' ')[0]}
                </div>
                <div className={`mt-0.5 text-xs ${liaisonIdx === i ? 'text-white/70' : 'text-ink/50'}`}>{l.cn}</div>
              </button>
            ))}
          </div>
        </>
      )}

      <p className="mt-6 text-center text-xs text-ink/50">
        发音由浏览器语音合成提供 · 口型图为示意，帮助孩子理解发音位置
      </p>
    </div>
  )
}
