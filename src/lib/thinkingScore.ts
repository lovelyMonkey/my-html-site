import type { Checkin } from '@/types'
import type { ThinkingAttempt, ThinkingAward } from '@/types/thinking'

/** 重复次数按已完成课程中的同一道题计算，与刷新、选项顺序无关。 */
export function scoreThinking(attempts: ThinkingAttempt[], checkins: Checkin[], perCorrect: number): ThinkingAward {
  const counts = new Map<string, number>()
  for (const c of checkins) for (const a of c.thinking?.attempts ?? []) counts.set(a.problemKey, (counts.get(a.problemKey) ?? 0) + 1)
  const award: ThinkingAward = { effort: 0, independent: 0, mastery: 0, repeated: 0, total: 0 }
  for (const a of attempts) {
    const previous = counts.get(a.problemKey) ?? 0
    const independent = a.correct && !a.helped
    award.effort += previous === 0 ? 2 : 1
    award.independent += independent ? previous === 0 ? perCorrect : previous === 1 ? Math.floor(perCorrect / 2) : 0 : 0
    // 先完成例题，再独立解出一题新的同类题，奖励知识迁移。
    award.mastery += independent && previous === 0 ? 2 : 0
    if (previous > 0) award.repeated++
    counts.set(a.problemKey, previous + 1)
  }
  award.total = award.effort + award.independent + award.mastery
  return award
}
