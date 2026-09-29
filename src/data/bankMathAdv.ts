import type { Question } from '@/types'

/* 工具 */
let seq = 0
const qid = () => `qm${Date.now().toString(36)}-${seq++}`
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

function numOptions(answer: number, max = 200): string[] {
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

/* ================= 浅奥思维（低年级） ================= */

/** 数图形 */
function genCountShapes(): Question[] {
  const qs: Question[] = []
  const used = new Set<number>()
  while (qs.length < 4) {
    const n = 3 + rnd(6) // 基本图形个数
    if (used.has(n)) continue
    used.add(n)
    qs.push({
      id: qid(),
      prompt: `下面这条线被分成了 ${n} 小段，一共有多少条线段？（包括小段和组合起来的）`,
      big: `●—●—${'●—'.repeat(Math.max(0, n - 2))}●`,
      options: numOptions((n * (n + 1)) / 2, 50),
      answer: String((n * (n + 1)) / 2),
      explain: `线段数 = ${n} + ${n - 1} + … + 1 = ${(n * (n + 1)) / 2}。记住：n 小段就有 n×(n+1)÷2 条线段。`,
    })
  }
  return qs
}

/** 找规律填数 */
function genPattern(): Question[] {
  const qs: Question[] = []
  const makers: (() => { seq: number[]; next: number; rule: string })[] = [
    () => { const a = 1 + rnd(5), d = 2 + rnd(4); const s = [a, a + d, a + 2 * d, a + 3 * d]; return { seq: s, next: a + 4 * d, rule: `每次都加 ${d}` } },
    () => { const a = 1 + rnd(3); const s = [a, a * 2, a * 4, a * 8]; return { seq: s, next: a * 16, rule: '每次都乘 2' } },
    () => { const s = [1, 1, 2, 3, 5]; return { seq: s, next: 8, rule: '后一个数 = 前两个数相加（斐波那契）' } },
    () => { const s = [1, 4, 9, 16]; return { seq: s, next: 25, rule: '平方数：1²、2²、3²、4²，下一个是 5²' } },
    () => { const a = 20 + rnd(20), d = 2 + rnd(5); const s = [a, a - d, a - 2 * d, a - 3 * d]; return { seq: s, next: a - 4 * d, rule: `每次都减 ${d}` } },
  ]
  const used = new Set<string>()
  while (qs.length < 6) {
    const { seq, next, rule } = pick(makers)()
    const key = seq.join(',')
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: '找规律，问号处应该填几？',
      big: `${seq.join('，')}，？`,
      options: numOptions(next, 300),
      answer: String(next),
      explain: rule,
    })
  }
  return qs
}

/** 排队问题（一年级经典浅奥） */
function genQueue(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 5) {
    const front = 2 + rnd(8)
    const back = 2 + rnd(8)
    const key = `${front}-${back}`
    if (used.has(key)) continue
    used.add(key)
    const total = front + back - 1
    qs.push({
      id: qid(),
      prompt: `小朋友排成一队，小明从前面数是第 ${front} 个，从后面数是第 ${back} 个。这一队一共有多少人？`,
      options: numOptions(total, 40),
      answer: String(total),
      explain: `${front} + ${back} − 1 = ${total}（小明被数了两次，要减去 1）。`,
    })
  }
  return qs
}

/** 锯木头 / 间隔 */
function genSaw(): Question[] {
  const qs: Question[] = []
  const used = new Set<number>()
  while (qs.length < 4) {
    const pieces = 3 + rnd(5)
    if (used.has(pieces)) continue
    used.add(pieces)
    const cuts = pieces - 1
    const minPerCut = 2
    qs.push({
      id: qid(),
      prompt: `把一根木头锯成 ${pieces} 段，每锯一次要 ${minPerCut} 分钟，一共要多少分钟？`,
      options: numOptions(cuts * minPerCut, 40),
      answer: String(cuts * minPerCut),
      explain: `锯成 ${pieces} 段只要锯 ${cuts} 次（段数−1），${cuts} × ${minPerCut} = ${cuts * minPerCut} 分钟。`,
    })
  }
  return qs
}

export function genAoshuLow(): Question[] {
  return shuffle([...genPattern().slice(0, 4), ...genQueue().slice(0, 3), ...genSaw().slice(0, 2), ...genCountShapes().slice(0, 1)])
}

/* ================= 浅奥思维（中年级） ================= */

/** 鸡兔同笼 */
function genChickenRabbit(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 4) {
    const chickens = 2 + rnd(8)
    const rabbits = 2 + rnd(8)
    const heads = chickens + rabbits
    const legs = chickens * 2 + rabbits * 4
    const key = `${heads}-${legs}`
    if (used.has(key)) continue
    used.add(key)
    const askRabbit = rnd(2) === 0
    qs.push({
      id: qid(),
      prompt: `笼子里有鸡和兔共 ${heads} 只，数一数腿共有 ${legs} 条。${askRabbit ? '兔子' : '鸡'}有多少只？`,
      options: numOptions(askRabbit ? rabbits : chickens, 30),
      answer: String(askRabbit ? rabbits : chickens),
      explain: `假设全是鸡，应有 ${heads * 2} 条腿，少了 ${legs - heads * 2} 条，每把一只鸡换成兔多 2 条腿，所以兔 = ${legs - heads * 2} ÷ 2 = ${rabbits} 只，鸡 = ${chickens} 只。`,
    })
  }
  return qs
}

/** 和差问题 */
function genSumDiff(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 3) {
    const a = 10 + rnd(30)
    const b = 4 + rnd(a - 5)
    if ((a + b) % 2 !== 0) continue
    const sum = a + b
    const diff = a - b
    const key = `${sum}-${diff}`
    if (used.has(key)) continue
    used.add(key)
    const askBig = rnd(2) === 0
    qs.push({
      id: qid(),
      prompt: `两个数的和是 ${sum}，差是 ${diff}。较${askBig ? '大' : '小'}的数是多少？`,
      options: numOptions(askBig ? a : b, 80),
      answer: String(askBig ? a : b),
      explain: `大数 = (和+差)÷2 = (${sum}+${diff})÷2 = ${a}，小数 = (和−差)÷2 = ${b}。`,
    })
  }
  return qs
}

/** 年龄问题 */
function genAge(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 3) {
    const childAge = 5 + rnd(6)
    const gap = 20 + rnd(12)
    const parentAge = childAge + gap
    const years = 2 + rnd(8)
    const key = `${parentAge}-${childAge}-${years}`
    if (used.has(key)) continue
    used.add(key)
    const future = rnd(2) === 0
    qs.push({
      id: qid(),
      prompt: `今年爸爸 ${parentAge} 岁，小明 ${childAge} 岁。${future ? `${years} 年后爸爸多少岁？` : `${years} 年前爸爸多少岁？`}`,
      options: numOptions(future ? parentAge + years : parentAge - years, 80),
      answer: String(future ? parentAge + years : parentAge - years),
      explain: `今年爸爸 ${parentAge} 岁，${future ? "过几年就加几岁" : "往前几年就减几岁"}：${parentAge} ${future ? "+" : "−"} ${years} = ${future ? parentAge + years : parentAge - years} 岁。`,
    })
  }
  return qs
}

/** 植树问题 */
function genPlant(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 3) {
    const intervals = 4 + rnd(6)
    const gap = 2 + rnd(4)
    const len = intervals * gap
    const both = rnd(2) === 0
    const ans = both ? intervals + 1 : intervals
    const key = `${len}-${gap}-${both}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `在一条长 ${len} 米的小路一边种树，每隔 ${gap} 米种一棵${both ? '，两端都种' : '，一端种一端不种'}。一共要种多少棵？`,
      options: numOptions(ans, 30),
      answer: String(ans),
      explain: `间隔数 = ${len} ÷ ${gap} = ${intervals}。${both ? '两端都种：棵数 = 间隔数 + 1' : '一端种一端不种：棵数 = 间隔数'} = ${ans} 棵。`,
    })
  }
  return qs
}

export function genAoshuMid(): Question[] {
  return shuffle([...genChickenRabbit().slice(0, 4), ...genSumDiff().slice(0, 2), ...genAge().slice(0, 2), ...genPlant().slice(0, 2)])
}

/* ================= 浅奥思维（高年级） ================= */

/** 相遇问题 */
function genMeet(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 4) {
    const v1 = 40 + rnd(30)
    const v2 = 40 + rnd(30)
    const t = 1 + rnd(4)
    const dist = (v1 + v2) * t
    const key = `${v1}-${v2}-${t}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `甲、乙两车同时从相距 ${dist} 千米的两地相向开出，甲车每小时行 ${v1} 千米，乙车每小时行 ${v2} 千米。几小时后两车相遇？`,
      options: numOptions(t, 20),
      answer: String(t),
      explain: `相遇时间 = 路程 ÷ 速度和 = ${dist} ÷ (${v1}+${v2}) = ${t} 小时。`,
    })
  }
  return qs
}

/** 追及问题 */
function genChase(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 3) {
    const vFast = 50 + rnd(30)
    const vSlow = 20 + rnd(vFast - 25)
    const gap = (vFast - vSlow) * (1 + rnd(3))
    const key = `${vFast}-${vSlow}-${gap}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `小明以每小时 ${vSlow} 千米的速度先走了一段，爸爸以每小时 ${vFast} 千米的速度骑车追他，出发时两人相距 ${gap} 千米。爸爸几小时后追上小明？`,
      options: numOptions(gap / (vFast - vSlow), 20),
      answer: String(gap / (vFast - vSlow)),
      explain: `追及时间 = 路程差 ÷ 速度差 = ${gap} ÷ (${vFast}−${vSlow}) = ${gap / (vFast - vSlow)} 小时。`,
    })
  }
  return qs
}

/** 盈亏问题 */
function genProfit(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 3) {
    const per1 = 3 + rnd(3)
    const per2 = per1 + 1 + rnd(2)
    const surplus = per1 * (1 + rnd(3))
    const lack = per2 * (1 + rnd(2))
    const groups = (surplus + lack) / (per2 - per1)
    if (!Number.isInteger(groups)) continue
    const key = `${per1}-${per2}-${surplus}-${lack}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `老师给小朋友分糖果，每人分 ${per1} 颗就多出 ${surplus} 颗，每人分 ${per2} 颗就还差 ${lack} 颗。一共有多少个小朋友？`,
      options: numOptions(groups, 30),
      answer: String(groups),
      explain: `盈亏问题：(盈 + 亏) ÷ 两次分配差 = (${surplus}+${lack}) ÷ (${per2}−${per1}) = ${groups} 个小朋友。`,
    })
  }
  return qs
}

/** 简单数论 / 周期 */
function genCycle(): Question[] {
  const qs: Question[] = []
  const patterns = [
    { name: '红、黄、蓝', cycle: ['红', '黄', '蓝'] },
    { name: '○△□', cycle: ['○', '△', '□'] },
    { name: '苹果、香蕉、橘子、梨', cycle: ['苹', '蕉', '橘', '梨'] },
  ]
  const used = new Set<string>()
  while (qs.length < 3) {
    const p = pick(patterns)
    const n = 15 + rnd(40)
    const idx = n % p.cycle.length
    const ans = p.cycle[idx === 0 ? p.cycle.length - 1 : idx - 1]
    const key = `${p.name}-${n}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `按「${p.name}」的顺序重复排列，第 ${n} 个是什么？`,
      big: p.cycle.join(' → ') + ' → …',
      options: shuffle(p.cycle),
      answer: ans,
      explain: `${n} ÷ ${p.cycle.length} 余 ${idx}，${idx === 0 ? '刚好整除，所以是最后一个' : `所以是第 ${idx} 个`}：「${ans}」。`,
    })
  }
  return qs
}

export function genAoshuHigh(): Question[] {
  return shuffle([...genMeet().slice(0, 3), ...genChase().slice(0, 2), ...genProfit().slice(0, 2), ...genCycle().slice(0, 2), ...genPattern().slice(0, 1)])
}

/* ================= 乘除进阶 ================= */

/** 表内乘法 */
export function genMulTable(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const a = 2 + rnd(8)
    const b = 2 + rnd(8)
    const key = `${a}x${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: '乘法口诀大挑战',
      big: `${a} × ${b} = ?`,
      visual: { kind: 'groups', groups: a, per: b },
      options: numOptions(a * b, 100),
      answer: String(a * b),
      explain: `口诀：${a}×${b}=${a * b}。`,
    })
  }
  return qs
}

/** 表内除法 */
export function genDivTable(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const b = 2 + rnd(8)
    const c = 2 + rnd(8)
    const a = b * c
    const key = `${a}÷${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `${a} 个苹果平均分给 ${b} 个小朋友，每人几个？`,
      big: `${a} ÷ ${b} = ?`,
      visual: { kind: 'emoji', emoji: '🍎' },
      options: numOptions(c, 50),
      answer: String(c),
      explain: `${b} × ${c} = ${a}，所以 ${a} ÷ ${b} = ${c}。`,
    })
  }
  return qs
}

/** 带余除法 */
export function genDivRem(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const b = 2 + rnd(7)
    const c = 3 + rnd(6)
    const r = 1 + rnd(b - 1)
    const a = b * c + r
    const key = `${a}÷${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: '想一想商和余数',
      big: `${a} ÷ ${b} = ? …… ?`,
      options: shuffle([
        `${c} 余 ${r}`,
        `${c + 1} 余 ${r}`,
        `${c} 余 ${r + 1}`,
        `${c - 1} 余 ${r}`,
      ]),
      answer: `${c} 余 ${r}`,
      explain: `${b} × ${c} = ${b * c}，${a} − ${b * c} = ${r}，所以商 ${c} 余 ${r}。`,
    })
  }
  return qs
}

/** 两位数乘一位数 */
export function genMul2x1(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const a = 11 + rnd(20)
    const b = 2 + rnd(7)
    const key = `${a}x${b}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: '两位数乘一位数',
      big: `${a} × ${b} = ?`,
      options: numOptions(a * b, 300),
      answer: String(a * b),
      explain: `拆开来算：${a} = ${Math.floor(a / 10) * 10} + ${a % 10}，${Math.floor(a / 10) * 10}×${b} + ${a % 10}×${b} = ${Math.floor(a / 10) * 10 * b} + ${(a % 10) * b} = ${a * b}。`,
    })
  }
  return qs
}

/* ================= 数学思维游戏 ================= */

/** 24 点简化版（给 4 个数选结果） */
export function gen24(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    // 构造能算出目标值的 4 个数
    const a = 2 + rnd(8)
    const b = 2 + rnd(8)
    const c = 1 + rnd(9)
    const d = 1 + rnd(9)
    const target = a * b + c - d
    if (target < 5 || target > 60) continue
    const key = `${a},${b},${c},${d}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: '按运算顺序计算：先乘除，后加减',
      big: `${a} × ${b} + ${c} − ${d} = ?`,
      options: numOptions(target, 80),
      answer: String(target),
      explain: `一种算法：${a} × ${b} + ${c} − ${d} = ${a * b} + ${c} − ${d} = ${target}。`,
    })
  }
  return qs
}

/** 数独启蒙（4宫） */
export function genSudoku(): Question[] {
  const puzzles: { grid: number[]; blank: number }[] = [
    { grid: [1, 2, 3, 4, 3, 4, 1, 2, 2, 0, 4, 3, 4, 3, 2, 1], blank: 1 },
    { grid: [2, 1, 4, 3, 4, 3, 2, 1, 1, 2, 3, 4, 3, 4, 0, 2], blank: 1 },
    { grid: [3, 4, 2, 1, 1, 2, 4, 3, 4, 3, 0, 2, 2, 1, 3, 4], blank: 1 },
    { grid: [4, 3, 1, 2, 2, 1, 3, 4, 3, 4, 2, 0, 1, 2, 4, 3], blank: 1 },
  ]
  return shuffle(puzzles).slice(0, 4).map((p) => ({
    id: qid(),
    prompt: '4 宫数独：每行、每列、每个粗线格里都要填 1-4，问号处填几？',
    big: p.grid.map((v) => (v === 0 ? '❓' : v)).map((v, i) => (i % 4 === 3 ? v + "\n" : v)).join(' '),
    options: shuffle(['1', '2', '3', '4']),
    answer: String(p.blank),
    explain: '看问号所在的行和列，缺少哪个数字就填哪个。',
  }))
}

/** 逻辑推理（谁最高/谁最胖等） */
export function genLogic(): Question[] {
  const qs: Question[] = []
  const names = ['小明', '小红', '小华']
  const scenarios = [
    {
      prompt: `小明比小红高，小红比小华高。谁最矮？`,
      answer: '小华',
      options: names,
      explain: '小明 > 小红 > 小华，所以小华最矮。',
    },
    {
      prompt: `小红比小明跑得快，小华比小红跑得慢。谁跑得最快？`,
      answer: '小红',
      options: names,
      explain: '小红 > 小明，小红 > 小华，所以小红最快。',
    },
    {
      prompt: `小明不吃苹果，小红不吃香蕉，小华不吃苹果也不吃香蕉。如果桌上的一个苹果被他们中的一个人吃了，谁吃了苹果？`,
      answer: '小红',
      options: names,
      explain: '小明和小华都不吃苹果，所以苹果是小红吃的。',
    },
    {
      prompt: `盒子里有红、黄、蓝三种颜色的球。小明摸的不是红色，小红摸的不是红色也不是黄色。小红摸的是什么颜色？`,
      answer: '蓝色',
      options: ['红色', '黄色', '蓝色'],
      explain: '小红排除红色和黄色，只剩蓝色。',
    },
    {
      prompt: `三个小朋友分别姓张、王、李。如果小明不姓张也不姓王，小明姓什么？`,
      answer: '李',
      options: ['张', '王', '李'],
      explain: '小明排除张和王，只能姓李。',
    },
  ]
  for (const s of scenarios) {
    qs.push({
      id: qid(),
      prompt: s.prompt,
      options: shuffle(s.options),
      answer: s.answer,
      explain: s.explain,
    })
  }
  return qs
}

/** 找规律（图形/数字） */
export function genPatternGame(): Question[] {
  return genPattern()
}

/* ================= 应用题挑战 ================= */

/** 多步应用题 */
export function genWordAdv(): Question[] {
  const qs: Question[] = []
  const NAMES = ['小明', '小红', '小华', '小丽', '豆豆', '乐乐']
  const ITEMS: [string, string][] = [
    ['苹果', '🍎'], ['铅笔', '✏️'], ['贴纸', '⭐'], ['糖果', '🍬'], ['图书', '📚'], ['弹珠', '🔮'],
  ]
  const used = new Set<string>()

  while (qs.length < 4) {
    const [item, emoji] = pick(ITEMS)
    const name = pick(NAMES)
    const start = 10 + rnd(20)
    const plus = 3 + rnd(10)
    const minus = 2 + rnd(start + plus - 2)
    const key = `${start}+${plus}-${minus}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `${name}原来有 ${start} 个${item}，妈妈又给了 ${plus} 个，后来送给同学 ${minus} 个。现在有多少个？`,
      big: `${start} + ${plus} − ${minus} = ?`,
      visual: { kind: 'emoji', emoji },
      options: numOptions(start + plus - minus, 80),
      answer: String(start + plus - minus),
      explain: `先算 ${start} + ${plus} = ${start + plus}，再算 ${start + plus} − ${minus} = ${start + plus - minus}。`,
    })
  }

  while (qs.length < 8) {
    const price = 2 + rnd(8)
    const count = 2 + rnd(5)
    const total = price * count
    const pay = total + 1 + rnd(10)
    const key = `buy-${total}-${pay}`
    if (used.has(key)) continue
    used.add(key)
    qs.push({
      id: qid(),
      prompt: `一支笔 ${price} 元，买 ${count} 支，付给售货员 ${pay} 元，应找回多少钱？`,
      big: `${pay} − ${price} × ${count} = ?`,
      visual: { kind: 'emoji', emoji: '💰' },
      options: numOptions(pay - total, 50),
      answer: String(pay - total),
      explain: `先算 ${price} × ${count} = ${total} 元，再算 ${pay} − ${total} = ${pay - total} 元。`,
    })
  }

  return qs
}
