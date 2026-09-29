import type { Question } from '@/types'

let seq = 0
const qid = () => `qmg${Date.now().toString(36)}-${seq++}`
const rnd = (n: number) => Math.floor(Math.random() * n)
const pick = <T,>(arr: T[]): T => arr[rnd(arr.length)]
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function numOptions(answer: number, max = 999): string[] {
  const set = new Set<number>([answer])
  for (const d of shuffle([1, -1, 2, -2, 3, -3, 10, -10, 5, -5, 4, -4])) {
    if (set.size >= 4) break
    const v = answer + d
    if (v >= 0 && v <= max) set.add(v)
  }
  let extra = 6
  while (set.size < 4) set.add(answer + extra++)
  return shuffle([...set].map(String))
}

/* ============ 二年级 ============ */

/** 100以内加减 */
export function genAddSub100(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const isAdd = rnd(2) === 0
    let a: number, b: number, ans: number, big: string
    if (isAdd) {
      a = 11 + rnd(40)
      b = 11 + rnd(Math.min(88 - a, 40))
      ans = a + b
      big = `${a} + ${b} = ?`
    } else {
      a = 30 + rnd(60)
      b = 11 + rnd(Math.min(a - 1, 40))
      ans = a - b
      big = `${a} - ${b} = ?`
    }
    if (used.has(big)) continue
    used.add(big)
    qs.push({
      id: qid(), prompt: '细心算一算', big,
      options: numOptions(ans, 99), answer: String(ans),
      explain: `${a} ${isAdd ? '+' : '−'} ${b} = ${ans}。`,
    })
  }
  return qs
}

/** 乘加乘减混合 */
export function genMulMix(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const a = 2 + rnd(7)
    const b = 2 + rnd(7)
    const c = 1 + rnd(9)
    const isAdd = rnd(2) === 0
    const ans = isAdd ? a * b + c : a * b - c
    if (ans < 0) continue
    const big = `${a} × ${b} ${isAdd ? '+' : '−'} ${c} = ?`
    if (used.has(big)) continue
    used.add(big)
    qs.push({
      id: qid(), prompt: '先算乘法，再算加减', big,
      options: numOptions(ans, 80), answer: String(ans),
      explain: `先算 ${a} × ${b} = ${a * b}，再算 ${a * b} ${isAdd ? '+' : '−'} ${c} = ${ans}。`,
    })
  }
  return qs
}

/** 认识时间 */
export function genTime(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const h = 1 + rnd(11)
    const m = pick([0, 15, 30, 45])
    const mStr = m === 0 ? '整' : `${m}分`
    const key = `${h}:${m}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `钟面上${m === 0 ? `时针指向 ${h}` : `时针在 ${h} 和 ${h + 1} 之间`}，分针指向 ${m / 5 || 12}，是几时几分？`,
      options: shuffle([`${h}时${mStr}`, `${h + 1 > 12 ? 1 : h + 1}时${mStr}`, `${h}时${(m + 15) % 60 === 0 ? '整' : `${(m + 15) % 60}分`}`, `${h - 1 || 12}时${mStr}`]),
      answer: `${h}时${mStr}`,
      explain: `时针在 ${h} 附近，分针指向 ${m / 5 || 12} 表示 ${m} 分，所以是 ${h} 时 ${m} 分。`,
    })
  }
  return qs
}

/** 长度单位 */
export function genLength(): Question[] {
  const items: [string, string, string[]][] = [
    ['铅笔', '厘米', ['米', '分米', '毫米']],
    ['教室', '米', ['厘米', '毫米', '分米']],
    ['橡皮', '厘米', ['米', '分米', '千米']],
    ['操场跑道', '米', ['厘米', '毫米', '分米']],
    ['课本', '厘米', ['米', '分米', '毫米']],
    ['大树', '米', ['厘米', '毫米', '分米']],
    ['手指', '厘米', ['米', '分米', '毫米']],
    ['冰箱', '米', ['厘米', '毫米', '分米']],
  ]
  return shuffle(items).slice(0, 8).map(([item, unit, wrong]) => ({
    id: qid(),
    prompt: `${item}的长度应该用哪个单位？`,
    big: item,
    options: shuffle([unit, ...wrong]),
    answer: unit,
    explain: `${item}大约${unit === '厘米' ? '十几到几十' : '几'}${unit}，用${unit}最合适。`,
  }))
}

/* ============ 三年级 ============ */

/** 多位数乘一位数 */
export function genMul3x1(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const a = 100 + rnd(400)
    const b = 2 + rnd(7)
    const key = `${a}x${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(), prompt: '多位数乘一位数', big: `${a} × ${b} = ?`,
      options: numOptions(a * b, 5000), answer: String(a * b),
      explain: `把 ${a} 拆成 ${Math.floor(a / 100) * 100} + ${a % 100}，分别乘 ${b} 再相加。`,
    })
  }
  return qs
}

/** 除数是一位数的除法 */
export function genDiv3(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const b = 2 + rnd(7)
    const c = 10 + rnd(30)
    const a = b * c
    const key = `${a}÷${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(), prompt: '除法计算', big: `${a} ÷ ${b} = ?`,
      options: numOptions(c, 200), answer: String(c),
      explain: `${b} × ${c} = ${a}，所以 ${a} ÷ ${b} = ${c}。`,
    })
  }
  return qs
}

/** 分数初步 */
export function genFraction(): Question[] {
  const qs: Question[] = []
  const pairs: [number, number][] = [[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [2, 5], [3, 5]]
  const used = new Set<string>()
  while (qs.length < 8) {
    const [a, b] = pick(pairs)
    const key = `${a}/${b}`
    if (used.has(key)) continue
    used.add(key)
    const total = b * (2 + rnd(3))
    const part = a * (total / b)
    qs.push({
      id: qid(),
      prompt: `一盒有 ${total} 个苹果，吃了它的 ${a}/${b}，吃了多少个？`,
      visual: { kind: 'emoji', emoji: '🍎' },
      options: numOptions(part, 50), answer: String(part),
      explain: `${total} 的 ${a}/${b} = ${total} ÷ ${b} × ${a} = ${part} 个。`,
    })
  }
  return qs
}

/** 周长 */
export function genPerimeter(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const isRect = rnd(2) === 0
    if (isRect) {
      const l = 5 + rnd(10)
      const w = 3 + rnd(l - 2)
      const key = `r${l}-${w}`
      if (used.has(key)) continue
      used.add(key)
      qs.push({
        id: qid(),
        prompt: `一个长方形长 ${l} 厘米，宽 ${w} 厘米，周长是多少？`,
        options: numOptions(2 * (l + w), 100), answer: String(2 * (l + w)),
        explain: `长方形周长 = (长+宽)×2 = (${l}+${w})×2 = ${2 * (l + w)} 厘米。`,
      })
    } else {
      const s = 4 + rnd(8)
      const key = `s${s}`
      if (used.has(key)) continue
      used.add(key)
      qs.push({
        id: qid(),
        prompt: `一个正方形边长 ${s} 厘米，周长是多少？`,
        options: numOptions(4 * s, 100), answer: String(4 * s),
        explain: `正方形周长 = 边长×4 = ${s}×4 = ${4 * s} 厘米。`,
      })
    }
  }
  return qs
}

/* ============ 四年级 ============ */

/** 三位数乘两位数 */
export function genMul3x2(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const a = 100 + rnd(300)
    const b = 11 + rnd(30)
    const key = `${a}x${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(), prompt: '三位数乘两位数', big: `${a} × ${b} = ?`,
      options: numOptions(a * b, 50000), answer: String(a * b),
      explain: `竖式计算：${a} × ${b} = ${a * b}。`,
    })
  }
  return qs
}

/** 除数是两位数的除法 */
export function genDiv4(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const b = 11 + rnd(20)
    const c = 10 + rnd(20)
    const a = b * c
    const key = `${a}÷${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(), prompt: '除法计算', big: `${a} ÷ ${b} = ?`,
      options: numOptions(c, 100), answer: String(c),
      explain: `${b} × ${c} = ${a}，所以 ${a} ÷ ${b} = ${c}。`,
    })
  }
  return qs
}

/** 面积 */
export function genArea(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const isRect = rnd(2) === 0
    if (isRect) {
      const l = 5 + rnd(10)
      const w = 3 + rnd(l - 2)
      const key = `r${l}-${w}`
      if (used.has(key)) continue
      used.add(key)
      qs.push({
        id: qid(),
        prompt: `一个长方形长 ${l} 米，宽 ${w} 米，面积是多少平方米？`,
        options: numOptions(l * w, 200), answer: String(l * w),
        explain: `长方形面积 = 长×宽 = ${l}×${w} = ${l * w} 平方米。`,
      })
    } else {
      const s = 5 + rnd(8)
      const key = `s${s}`
      if (used.has(key)) continue
      used.add(key)
      qs.push({
        id: qid(),
        prompt: `一个正方形边长 ${s} 米，面积是多少平方米？`,
        options: numOptions(s * s, 200), answer: String(s * s),
        explain: `正方形面积 = 边长×边长 = ${s}×${s} = ${s * s} 平方米。`,
      })
    }
  }
  return qs
}

/** 运算律 */
export function genOpLaw(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const a = 11 + rnd(30)
    const b = 11 + rnd(30)
    const c = 11 + rnd(30)
    const mode = rnd(3)
    let big: string, ans: number
    if (mode === 0) {
      big = `${a} + ${b} + ${c} = ?`
      ans = a + b + c
    } else if (mode === 1) {
      big = `${a} × ${b} × ${c} = ?`
      ans = a * b * c
    } else {
      big = `(${a} + ${b}) × ${c} = ?`
      ans = (a + b) * c
    }
    if (used.has(big)) continue
    used.add(big)
    qs.push({
      id: qid(), prompt: '用简便方法计算', big,
      options: numOptions(ans, 5000), answer: String(ans),
      explain: mode === 0 ? `加法可以交换顺序：先算 ${a}+${c}=${a + c}，再加 ${b} 得 ${ans}。` : mode === 1 ? `乘法可以交换顺序：先算 ${a}×${c}=${a * c}，再乘 ${b} 得 ${ans}。` : `分配律：${a}×${c} + ${b}×${c} = ${a * c} + ${b * c} = ${ans}。`,
    })
  }
  return qs
}

/* ============ 五年级 ============ */

/** 小数加减 */
export function genDecimalAdd(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const a = (10 + rnd(90)) / 10
    const b = (10 + rnd(90)) / 10
    const isAdd = rnd(2) === 0
    const ans = isAdd ? a + b : Math.max(a, b) - Math.min(a, b)
    const big = isAdd ? `${a} + ${b} = ?` : `${Math.max(a, b)} − ${Math.min(a, b)} = ?`
    if (used.has(big)) continue
    used.add(big)
    qs.push({
      id: qid(), prompt: '小数计算', big,
      options: shuffle([ans.toFixed(1), (ans + 0.1).toFixed(1), (ans - 0.1).toFixed(1), (ans + 1).toFixed(1)]),
      answer: ans.toFixed(1),
      explain: `小数点对齐再计算，结果是 ${ans.toFixed(1)}。`,
    })
  }
  return qs
}

/** 小数乘除 */
export function genDecimalMul(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const a = (2 + rnd(18)) / 10
    const b = 2 + rnd(8)
    const ans = a * b
    const key = `${a}x${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(), prompt: '小数乘法', big: `${a} × ${b} = ?`,
      options: shuffle([ans.toFixed(1), (ans * 10).toFixed(1), (ans / 10).toFixed(1), (ans + 1).toFixed(1)]),
      answer: ans.toFixed(1),
      explain: `先按整数乘，再数小数位数：${a} × ${b} = ${ans.toFixed(1)}。`,
    })
  }
  return qs
}

/** 因数与倍数 */
export function genFactor(): Question[] {
  const qs: Question[] = []
  const nums = [12, 18, 24, 30, 36, 42, 48, 60]
  const used = new Set<number>()
  while (qs.length < 8) {
    const n = pick(nums)
    if (used.has(n)) continue
    used.add(n)
    const factors: number[] = []
    for (let i = 1; i <= n; i++) if (n % i === 0) factors.push(i)
    const notFactor = pick([7, 9, 11, 13, 14, 15].filter((x) => n % x !== 0))
    qs.push({
      id: qid(),
      prompt: `${n} 的因数有哪些？选出不是因数的那个`,
      big: String(n),
      options: shuffle([String(notFactor), String(factors[1]), String(factors[2]), String(factors[3] ?? factors[1])]),
      answer: String(notFactor),
      explain: `${n} 的因数有：${factors.join('、')}。${notFactor} 不是 ${n} 的因数。`,
    })
  }
  return qs
}

/** 分数加减（同分母） */
export function genFracAdd(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const d = pick([5, 7, 9, 11])
    const a = 1 + rnd(d - 2)
    const b = 1 + rnd(d - a - 1)
    const isAdd = rnd(2) === 0
    if (!isAdd && a === b) continue
    const [x, y] = !isAdd && b > a ? [b, a] : [a, b]
    const key = `${x}/${d}${isAdd ? '+' : '-'}${y}/${d}`
    if (used.has(key)) continue
    used.add(key)
    const ansNum = isAdd ? x + y : x - y
    const ans = `${ansNum}/${d}`
    const pool = new Set<string>([ans])
    for (const c of [`${ansNum + 1}/${d}`, `${ansNum}/${d + 1}`, `${Math.max(1, ansNum - 1)}/${d}`, `${ansNum + 1}/${d + 1}`]) {
      if (pool.size >= 4) break
      pool.add(c)
    }
    let k = 2
    while (pool.size < 4) pool.add(`${ansNum + k++}/${d}`)
    qs.push({
      id: qid(),
      prompt: '同分母分数加减',
      big: `${x}/${d} ${isAdd ? '+' : '−'} ${y}/${d} = ?`,
      options: shuffle([...pool]),
      answer: ans,
      explain: `分母不变，分子相加减：${x} ${isAdd ? '+' : '−'} ${y} = ${ansNum}，所以是 ${ans}。`,
    })
  }
  return qs
}

/* ============ 六年级 ============ */

/** 分数乘除 */
export function genFracMul(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const a = 1 + rnd(4)
    const b = 2 + rnd(5)
    const c = 1 + rnd(4)
    const d = 2 + rnd(5)
    const isMul = rnd(2) === 0
    const key = `${a}/${b}${isMul ? 'x' : '÷'}${c}/${d}`
    if (used.has(key)) continue
    used.add(key)
    const num = isMul ? a * c : a * d
    const den = isMul ? b * d : b * c
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y))
    const g = gcd(num, den)
    const ans = `${num / g}/${den / g}`
    const pool = new Set<string>([ans])
    for (const c of [`${num}/${den}`, `${num + g}/${den}`, `${num}/${den + g}`, `${num / g + 1}/${den / g}`, `${num / g}/${den / g + 1}`]) {
      if (pool.size >= 4) break
      const [n, d] = c.split('/').map(Number)
      if (n * den !== num * d && ![...pool].some((v) => {
        const [pn, pd] = v.split('/').map(Number)
        return pn * d === n * pd
      })) pool.add(c)
    }
    let k = 2
    while (pool.size < 4) pool.add(`${num / g + k++}/${den / g}`)
    qs.push({
      id: qid(),
      prompt: isMul ? '分数乘法' : '分数除法',
      big: `${a}/${b} ${isMul ? '×' : '÷'} ${c}/${d} = ?`,
      options: shuffle([...pool]),
      answer: ans,
      explain: isMul ? `分子乘分子，分母乘分母：${a}×${c}=${a * c}，${b}×${d}=${b * d}，约分后是 ${num / g}/${den / g}。` : `除以一个分数 = 乘它的倒数：${a}/${b} × ${d}/${c} = ${a * d}/${b * c} = ${num / g}/${den / g}。`,
    })
  }
  return qs
}

/** 百分数 */
export function genPercent(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const total = pick([20, 40, 50, 80, 100, 200])
    const pct = pick([10, 20, 25, 30, 40, 50, 60, 75, 80])
    const key = `${total}-${pct}`
    if (used.has(key)) continue
    used.add(key)
    const ans = (total * pct) / 100
    qs.push({
      id: qid(),
      prompt: `${total} 的 ${pct}% 是多少？`,
      options: numOptions(ans, 200), answer: String(ans),
      explain: `${total} × ${pct}% = ${total} × ${pct / 100} = ${ans}。`,
    })
  }
  return qs
}

/** 比和比例 */
export function genRatio(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const a = 2 + rnd(8)
    const b = 2 + rnd(8)
    const c = a * (2 + rnd(3))
    const d = b * (c / a)
    const key = `${a}:${b}=${c}:${d}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: '填出比例中的未知数',
      big: `${a} : ${b} = ${c} : ?`,
      options: numOptions(d, 100), answer: String(d),
      explain: `${a}:${b} = ${c}:?，内项积 = 外项积，${b} × ${c} ÷ ${a} = ${d}。`,
    })
  }
  return qs
}

/** 圆的周长和面积 */
export function genCircle(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 6) {
    const r = 2 + rnd(8)
    const isC = rnd(2) === 0
    const key = `${r}-${isC}`
    if (used.has(key)) continue
    used.add(key)
    const pi = 3.14
    const ans = isC ? 2 * pi * r : pi * r * r
    qs.push({
      id: qid(),
      prompt: `一个圆的半径是 ${r} 厘米，${isC ? '周长' : '面积'}是多少？（π取3.14）`,
      options: shuffle([ans.toFixed(2), (ans * 2).toFixed(2), (ans / 2).toFixed(2), (ans + 10).toFixed(2)]),
      answer: ans.toFixed(2),
      explain: isC ? `周长 = 2πr = 2×3.14×${r} = ${ans.toFixed(2)} 厘米。` : `面积 = πr² = 3.14×${r}×${r} = ${ans.toFixed(2)} 平方厘米。`,
    })
  }
  return qs
}
