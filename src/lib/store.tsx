import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ThinkingDraft } from '@/types/thinking'
import type { AppState, Checkin, Redemption, Reward } from '@/types'

const STORAGE_KEY = 'xiaodoumiao-v1'

const DEFAULT_REWARDS: Reward[] = [
  { id: 'r-tv', title: '看电视 20 分钟', icon: '📺', cost: 50, active: true },
  { id: 'r-pad', title: '看 iPad 20 分钟', icon: '📱', cost: 60, active: true },
  { id: 'r-snack', title: '美味零食一份', icon: '🍬', cost: 30, active: true },
  { id: 'r-story', title: '睡前多讲一个故事', icon: '📚', cost: 40, active: true },
  { id: 'r-park', title: '周末公园游玩', icon: '🎡', cost: 200, active: true },
  { id: 'r-toy', title: '挑选一个小玩具', icon: '🧸', cost: 300, active: true },
]

export const initialState: AppState = {
  thinkingDraft: null,
  points: 0,
  totalEarned: 0,
  checkins: [],
  redemptions: [],
  rewards: DEFAULT_REWARDS,
  settings: { perCorrect: 2 },
}

type Action =
  | { type: 'saveThinkingDraft'; draft: ThinkingDraft | null }
  | { type: 'checkin'; checkin: Checkin }
  | { type: 'redeem'; redemption: Redemption }
  | { type: 'addReward'; reward: Reward }
  | { type: 'removeReward'; id: string }
  | { type: 'adjustPoints'; delta: number; note?: string }
  | { type: 'setPerCorrect'; value: number }
  | { type: 'resetAll' }

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'saveThinkingDraft':
      if (action.draft && state.checkins.some((c) => c.id === action.draft?.id)) return state
      return { ...state, thinkingDraft: action.draft }
    case 'checkin':
      if (state.checkins.some((c) => c.id === action.checkin.id)) return state
      return {
        ...state,
        points: state.points + action.checkin.points,
        totalEarned: state.totalEarned + action.checkin.points,
        checkins: [action.checkin, ...state.checkins],
        thinkingDraft: state.thinkingDraft?.id === action.checkin.id ? null : state.thinkingDraft,
      }
    case 'redeem':
      return {
        ...state,
        points: state.points - action.redemption.cost,
        redemptions: [action.redemption, ...state.redemptions],
      }
    case 'addReward':
      return { ...state, rewards: [...state.rewards, action.reward] }
    case 'removeReward':
      return { ...state, rewards: state.rewards.filter((r) => r.id !== action.id) }
    case 'adjustPoints':
      return {
        ...state,
        points: Math.max(0, state.points + action.delta),
        totalEarned:
          action.delta > 0 ? state.totalEarned + action.delta : state.totalEarned,
      }
    case 'setPerCorrect':
      return { ...state, settings: { ...state.settings, perCorrect: action.value } }
    case 'resetAll':
      return { ...initialState, rewards: state.rewards }
    default:
      return state
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw)
    return { ...initialState, ...parsed, settings: { ...initialState.settings, ...parsed.settings } }
  } catch {
    return initialState
  }
}

const StoreContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<Action>
}>({ state: initialState, dispatch: () => {} })

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // 存储不可用时静默失败
    }
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}

/* ---------- 工具函数 ---------- */

export function todayStr(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** 连续打卡天数（今天或昨天起连续有打卡的天数） */
export function calcStreak(checkins: Checkin[]): number {
  const days = new Set(checkins.map((c) => c.date))
  let streak = 0
  const cursor = new Date()
  // 今天没打卡就看昨天，保持连续性
  if (!days.has(todayStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (days.has(todayStr(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
