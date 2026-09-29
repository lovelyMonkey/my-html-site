import assert from 'node:assert/strict'
import { THINKING_TOPICS, thinkingPool, pickThinkingProblems } from '../src/data/thinking'
import { scoreThinking } from '../src/lib/thinkingScore'
import { reducer, initialState } from '../src/lib/store'
import type { Checkin } from '../src/types'
import type { ThinkingAttempt, ThinkingDraft } from '../src/types/thinking'

const keys = new Set<string>()
for (const topic of THINKING_TOPICS) {
  const pool = thinkingPool(topic.id)
  assert.ok(pool.length >= 4)
  for (const q of pool) {
    assert.ok(!keys.has(q.key)); keys.add(q.key)
    assert.equal(new Set(q.options).size, q.options.length)
    assert.equal(q.options.filter((o) => o === q.answer).length, 1)
    assert.equal(q.steps.length, 3)
    for (const s of q.steps) {
      assert.ok(s.text && s.title && s.ask)
      assert.equal(new Set(s.options).size, s.options.length)
      assert.equal(s.options.filter((o) => o === s.answer).length, 1)
    }
    assert.equal(q.steps[2].answer, q.answer)
    const d = q.diagram
    const expected = d.kind === 'pattern' ? d.numbers[0] + d.jump * 4
      : d.kind === 'queue' ? d.front + d.back - 1
      : d.kind === 'cuts' ? d.pieces - 1
      : d.kind === 'counting' ? d.tops * d.bottoms
      : d.order[q.prompt.includes('最后面') ? 2 : 0]
    assert.equal(q.answer, String(expected), q.prompt)
  }
  for (let i = 0; i < 50; i++) {
    const picked = pickThinkingProblems(topic.id, new Set())
    assert.equal(picked.length, 4)
    assert.equal(new Set(picked.map((q) => q.key)).size, 4)
    const seen = new Set(pool.slice(1).map((q) => q.key))
    const lastNew = pickThinkingProblems(topic.id, seen)
    assert.ok(lastNew.slice(1).some((q) => q.key === pool[0].key), '最后一题新题应留给练习')
  }
}
const [example, ...problems] = pickThinkingProblems('queue', new Set())
const attempts: ThinkingAttempt[] = problems.map((q, i) => ({ problemKey: q.key, prompt: q.prompt, answer: q.answer, picked: i === 2 ? q.options.find((o) => o !== q.answer)! : q.answer, correct: i !== 2, helped: i === 1 }))
const award = scoreThinking(attempts, [], 2)
assert.deepEqual(award, { effort: 6, independent: 2, mastery: 2, repeated: 0, total: 10 })
const draft: ThinkingDraft = { id: 'test-session', topic: 'queue', startedAt: 1, example, problems, phase: 'practice', step: 0, checkpoint: null, practiceIndex: 2, picked: attempts[2].picked, helpStep: 3, attempts }
const record: Checkin = { id: draft.id, packId: 'thinking-queue', packTitle: '测试', subject: 'math', date: '2026-09-20', ts: 2, correct: 2, total: 3, points: award.total, seconds: 1, thinking: { topic: 'queue', attempts, award } }
const before = reducer(initialState, { type: 'saveThinkingDraft', draft })
assert.deepEqual(JSON.parse(JSON.stringify(before)).thinkingDraft, draft, '进度可序列化保存')
const after = reducer(before, { type: 'checkin', checkin: record })
assert.equal(after.points, 10)
assert.equal(after.checkins.length, 1)
assert.equal(after.thinkingDraft, null, '结算和清除草稿必须同时发生')
assert.equal(reducer(after, { type: 'checkin', checkin: record }), after, '重复完成不重复加分')
assert.equal(reducer(after, { type: 'saveThinkingDraft', draft }), after, '旧进度不能覆盖已完成课程')
assert.deepEqual(scoreThinking(attempts, [record], 2), { effort: 3, independent: 1, mastery: 0, repeated: 3, total: 4 })
assert.deepEqual(scoreThinking(attempts, [record, { ...record, id: 'second' }], 2), { effort: 3, independent: 0, mastery: 0, repeated: 3, total: 3 })
assert.equal(scoreThinking(attempts, [{ ...record, thinking: undefined }], 2).total, 10, '兼容旧学习记录')
assert.equal(reducer(after, { type: 'resetAll' }).thinkingDraft, null)
assert.equal(reducer(after, { type: 'resetAll' }).points, 0)
console.log(`通过：5 个主题 ${keys.size} 道奥数题全部核算；每题 3 步解析与互动选项有效；新题优先、求助积分、重复递减、进度保存与幂等结算通过。`)
