import assert from 'node:assert/strict'
import { ALL_PACKS } from '../src/data/plan'
import { getMathHelp } from '../src/lib/mathHelp'
import type { Question } from '../src/types'

// 固定种子使随机题库检查可以复现。检查算式、选项、解析覆盖，不能代替逐题教研审核。
let seed = 20260920
Math.random = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
  return seed / 4294967296
}
const errors: string[] = []
const packs = ALL_PACKS.filter((p) => p.subject === 'math')
let count = 0, arithmetic = 0
const value = (s: string): number => {
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s)
  const f = s.match(/^(\d+)\/(\d+)$/)
  return f ? Number(f[1]) / Number(f[2]) : NaN
}
function check(q: Question, pack: string) {
  count++
  const fail = (message: string) => { if (errors.length < 30) errors.push(`${pack}: ${q.prompt} ${q.big ?? ''}: ${message}`) }
  if (!q.explain?.trim()) fail('没有解析')
  const help = getMathHelp(q)
  if (!help.hint.trim() || !help.steps.length || help.steps.some((s) => !s.trim())) fail('没有解题思路')
  if (q.options.length < 2 || new Set(q.options).size !== q.options.length) fail('选项重复或不足')
  if (q.options.filter((o) => o === q.answer).length !== 1) fail('答案不在选项中或重复')
  if (/NaN|undefined|Infinity/.test(JSON.stringify(q))) fail('存在非法数值')
  const expr = q.big?.match(/^([\d\s.+−\-×÷/()]+)\s*=\s*\?$/)?.[1]
  if (expr && !q.answer.includes('余')) {
    // 白名单仅允许数字、括号和四则运算，不执行任何题目文本或任意代码。
    const normalized = expr.replace(/(\d+)\/(\d+)/g, '($1/$2)').replaceAll('−', '-').replaceAll('×', '*').replaceAll('÷', '/')
    const evaluated = Function(`"use strict";return (${normalized})`)() as number
    const expected = value(q.answer)
    arithmetic++
    if (!Number.isFinite(evaluated) || Math.abs(evaluated - expected) > 1e-7) fail(`算式结果 ${evaluated} 与答案 ${q.answer} 不一致`)
    if (q.options.filter((o) => Math.abs(value(o) - expected) < 1e-9).length !== 1) fail('有多个数值相等的正确选项')
  }
  if (q.prompt === '约分成最简分数') {
    const [n, d] = q.answer.split('/').map(Number)
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a
    if (gcd(n, d) !== 1) fail('答案不是最简分数')
  }
  if (q.prompt.includes('圆柱') && q.prompt.includes('表面积')) {
    const match = q.prompt.match(/半径 (\d+) 厘米，高 (\d+) 厘米/)
    assert.ok(match)
    const r = Number(match[1]), h = Number(match[2])
    if (q.answer !== (2 * 3.14 * r * (r + h)).toFixed(2)) fail('圆柱表面积错误')
  }
  if (q.prompt.includes('数独')) {
    const nums = q.big!.replace('❓', q.answer).match(/[1-4]/g)!.map(Number)
    for (let i = 0; i < 4; i++) {
      if (new Set(nums.slice(i * 4, i * 4 + 4)).size !== 4) fail('数独行无效')
      if (new Set([0, 1, 2, 3].map((j) => nums[j * 4 + i])).size !== 4) fail('数独列无效')
    }
    for (const start of [0, 2, 8, 10]) if (new Set([0, 1, 4, 5].map((n) => nums[start + n])).size !== 4) fail('数独宫无效')
  }
}
assert.equal(new Set(packs.map((p) => p.id)).size, packs.length, '题包 id 重复')
for (let round = 0; round < 30; round++) {
  for (const pack of packs) {
    const qs = pack.gen()
    assert.ok(qs.length, `${pack.title} 为空`)
    if (pack.title === '圆柱的表面积') assert.ok(qs.every((q) => q.prompt.includes('圆柱') && q.prompt.includes('表面积')))
    for (const q of qs) check(q, pack.title)
  }
}
assert.deepEqual(errors, [])
console.log(`通过：${packs.length} 个数学题包 × 30 轮，${count} 道题；核算 ${arithmetic} 道算式，全部有解题思路。`)
