import { useState } from 'react'
import type { Pack, Subject } from '@/types'
import { StoreProvider, useStore, calcStreak } from '@/lib/store'
import Home from '@/pages/Home'
import Packs from '@/pages/Packs'
import Quiz from '@/pages/Quiz'
import type { QuizResult } from '@/pages/Quiz'
import Result from '@/pages/Result'
import Shop from '@/pages/Shop'
import CalendarPage from '@/pages/CalendarPage'
import Parent from '@/pages/Parent'
import Thinking from '@/pages/Thinking'
import Pronunciation from '@/pages/Pronunciation'

type Screen =
  | { name: 'home' }
  | { name: 'thinking' }
  | { name: 'pronunciation' }
  | { name: 'packs'; subject: Subject }
  | { name: 'quiz'; pack: Pack }
  | { name: 'result'; pack: Pack; result: QuizResult }
  | { name: 'shop' }
  | { name: 'calendar' }
  | { name: 'parent' }

const TABS: { key: Screen['name']; label: string; icon: string }[] = [
  { key: 'home', label: '首页', icon: '🏠' },
  { key: 'shop', label: '奖励', icon: '🎁' },
  { key: 'calendar', label: '日历', icon: '📅' },
  { key: 'parent', label: '家长', icon: '⚙️' },
]

function Shell() {
  const { state } = useStore()
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const streak = calcStreak(state.checkins)
  const inFlow = screen.name === 'quiz' || screen.name === 'result' || screen.name === 'thinking' || screen.name === 'pronunciation'

  return (
    <div className="min-h-dvh bg-cream">
      {/* 顶栏 */}
      {!inFlow && (
        <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur">
          <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
            <div className="font-display text-2xl text-ink">
              🌱 小豆苗
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-candy-pinkdeep shadow-sm">
                🔥 {streak} 天
              </span>
              <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-candy-yellowdeep shadow-sm">
                ⭐ {state.points}
              </span>
            </div>
          </div>
        </header>
      )}

      {/* 内容 */}
      <main>
        {screen.name === 'home' && (
          <Home onThinking={() => setScreen({ name: 'thinking' })} onPronunciation={() => setScreen({ name: 'pronunciation' })} onSubject={(subject) => setScreen({ name: 'packs', subject })} />
        )}
        {screen.name === 'packs' && (
          <Packs
            subject={screen.subject}
            onBack={() => setScreen({ name: 'home' })}
            onStart={(pack) => setScreen({ name: 'quiz', pack })}
          />
        )}
        {screen.name === 'quiz' && (
          <Quiz
            pack={screen.pack}
            onExit={() => setScreen({ name: 'packs', subject: screen.pack.subject })}
            onFinish={(result) => setScreen({ name: 'result', pack: screen.pack, result })}
          />
        )}
        {screen.name === 'result' && (
          <Result
            pack={screen.pack}
            result={screen.result}
            onHome={() => setScreen({ name: 'home' })}
            onAgain={() => setScreen({ name: 'quiz', pack: screen.pack })}
          />
        )}
        {screen.name === 'thinking' && <Thinking onHome={() => setScreen({ name: 'home' })} onShop={() => setScreen({ name: 'shop' })} />}
        {screen.name === 'pronunciation' && <Pronunciation onBack={() => setScreen({ name: 'home' })} />}
        {screen.name === 'shop' && <Shop />}
        {screen.name === 'calendar' && <CalendarPage />}
        {screen.name === 'parent' && <Parent />}
      </main>

      {/* 底部导航 */}
      {!inFlow && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-candy-beige bg-white/95 backdrop-blur">
          <div className="mx-auto grid max-w-2xl grid-cols-4">
            {TABS.map((t) => {
              const active = screen.name === t.key || (t.key === 'home' && screen.name === 'packs')
              return (
                <button
                  key={t.key}
                  onClick={() => setScreen({ name: t.key } as Screen)}
                  className={`btn-press flex flex-col items-center gap-0.5 py-2.5 ${
                    active ? 'text-candy-peachdeep' : 'text-ink/40'
                  }`}
                >
                  <span className={`text-2xl ${active ? 'animate-wiggle' : ''}`}>{t.icon}</span>
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
