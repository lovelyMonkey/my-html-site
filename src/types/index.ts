import type { ThinkingDraft, ThinkingRecord } from './thinking'

export type Subject = 'math' | 'chinese' | 'english'

export type VisualSpec =
  | { kind: 'count'; count: number; crossed?: number }
  | { kind: 'tenframe'; first: number; second?: number }
  | { kind: 'groups'; groups: number; per: number }
  | { kind: 'emoji'; emoji: string; label?: string }

export interface Question {
  id: string
  /** 题干 */
  prompt: string
  /** 题干下方的大字算式 / 拼音 / 单词 */
  big?: string
  /** 点击喇叭朗读的文本（英语或中文） */
  speak?: string
  speakLang?: 'en-US' | 'zh-CN'
  visual?: VisualSpec
  options: string[]
  answer: string
  explain?: string
}

export interface Pack {
  id: string
  subject: Subject
  /** 分级：1-6 对应小学一年级到六年级 */
  level: 1 | 2 | 3 | 4 | 5 | 6
  /** 周计划：学期（1 上 / 2 下），未设置则为专项题包 */
  semester?: 1 | 2
  /** 周计划：第几周（1-20） */
  week?: number
  title: string
  desc: string
  minutes: number
  /** 完成基础积分 */
  basePoints: number
  badge: string
  gen: () => Question[]
}

export interface Reward {
  id: string
  title: string
  icon: string
  cost: number
  active: boolean
}

export interface Checkin {
  thinking?: ThinkingRecord
  id: string
  date: string // YYYY-MM-DD
  packId: string
  packTitle: string
  subject: Subject
  correct: number
  total: number
  points: number
  seconds: number
  ts: number
}

export interface Redemption {
  id: string
  rewardTitle: string
  icon: string
  cost: number
  date: string
  ts: number
}

export interface Settings {
  /** 每答对一题加几分 */
  perCorrect: number
}

export interface AppState {
  thinkingDraft: ThinkingDraft | null
  points: number
  totalEarned: number
  checkins: Checkin[]
  redemptions: Redemption[]
  rewards: Reward[]
  settings: Settings
}

export const SUBJECT_META: Record<
  Subject,
  { name: string; color: string; deep: string; emoji: string }
> = {
  math: { name: '数学', color: '#BBE9F2', deep: '#3E9DB8', emoji: '🔢' },
  chinese: { name: '语文', color: '#FFD3E0', deep: '#E86A9C', emoji: '📖' },
  english: { name: '英语', color: '#C9E7B5', deep: '#5C9A4E', emoji: '🔤' },
}

export const LEVEL_NAMES: Record<number, string> = {
  1: '一年级',
  2: '二年级',
  3: '三年级',
  4: '四年级',
  5: '五年级',
  6: '六年级',
}
