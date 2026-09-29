export type ThinkingTopic = 'pattern' | 'queue' | 'cuts' | 'counting' | 'logic'

export type ThinkingDiagram =
  | { kind: 'pattern'; numbers: number[]; jump: number }
  | { kind: 'queue'; front: number; back: number }
  | { kind: 'cuts'; pieces: number }
  | { kind: 'counting'; tops: number; bottoms: number }
  | { kind: 'logic'; order: string[] }

export interface ThinkingStep {
  title: string
  text: string
  ask: string
  options: string[]
  answer: string
}

export interface ThinkingProblem {
  /** 由题目条件生成的稳定标识，用于识别重复练习。 */
  key: string
  topic: ThinkingTopic
  prompt: string
  options: string[]
  answer: string
  hint: string
  diagram: ThinkingDiagram
  steps: ThinkingStep[]
}

export interface ThinkingAttempt {
  problemKey: string
  prompt: string
  answer: string
  picked: string
  correct: boolean
  helped: boolean
}

export interface ThinkingAward {
  effort: number
  independent: number
  mastery: number
  repeated: number
  total: number
}

export interface ThinkingRecord {
  topic: ThinkingTopic
  attempts: ThinkingAttempt[]
  award: ThinkingAward
}

export interface ThinkingDraft {
  id: string
  topic: ThinkingTopic
  startedAt: number
  elapsedSeconds?: number
  example: ThinkingProblem
  problems: ThinkingProblem[]
  phase: 'example' | 'practice'
  step: number
  checkpoint: string | null
  practiceIndex: number
  helpStep: number // -1 未求助；0 只看提示；1~3 分步图解
  picked: string | null
  attempts: ThinkingAttempt[]
}
