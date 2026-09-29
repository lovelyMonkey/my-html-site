import type { Pack, Question } from '@/types'
import {
  genAoshuLow, genAoshuMid, genAoshuHigh,
  genMulTable, genDivTable, genDivRem, genMul2x1,
  gen24, genSudoku, genLogic, genWordAdv,
} from './bankMathAdv'
import {
  genStartersPic, genStartersListen, genStartersSent,
  genMoversPic, genMoversListen, genMoversSent,
  genKetPic, genKetListen, genKetSent,
  genBlend, genDigraph, genLongVowel,
} from './bankEnglishAdv'
import {
  genPicWrite, genMakeSent, genPoemNext, genPoemTitle,
  genChar2Pinyin, genMatch,
} from './bankChineseAdv'
import {
  genAddSub100, genMulMix, genTime, genLength,
  genMul3x1, genDiv3, genFraction, genPerimeter,
  genMul3x2, genDiv4, genArea, genOpLaw,
  genDecimalAdd, genDecimalMul, genFactor, genFracAdd,
  genFracMul, genPercent, genRatio, genCircle,
} from './bankMathGrade'
import {
  genG2Char, genG2WordPy,
  genG3Char, genG3Idiom,
  genG4Antonym, genG4Synonym,
  genG5Poem, genG5Idiom,
  genG6Poem, genG6Idiom,
  genReading,
} from './bankChineseGrade'
import {
  genFlyersPic, genFlyersListen, genFlyersSent,
  genGrammarBe, genGrammarTense, genGrammarPlural,
  genEnReading, genKetGrammar, genKetReading,
} from './bankEnglishGrade'

/* ---------------- 工具 ---------------- */

let seq = 0
const qid = () => `q${Date.now().toString(36)}-${seq++}`

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

/** 数字题的 4 个选项（含正确答案） */
function numOptions(answer: number): string[] {
  const set = new Set<number>([answer])
  for (const d of shuffle([1, -1, 2, -2, 3, -3, 10, -10])) {
    if (set.size >= 4) break
    const v = answer + d
    if (v >= 0 && v <= 99) set.add(v)
  }
  let extra = 4
  while (set.size < 4) set.add(answer + extra++)
  return shuffle([...set].map(String))
}

function opts(answer: string, pool: string[]): string[] {
  const set = new Set<string>([answer])
  for (const p of shuffle(pool)) {
    if (set.size >= 4) break
    if (p !== answer) set.add(p)
  }
  return shuffle([...set])
}

/* ---------------- 数学题生成器 ---------------- */

export function genAdd10(): Question[] {
  const used = new Set<string>()
  const qs: Question[] = []
  while (qs.length < 10) {
    const a = 1 + rnd(9)
    const b = 1 + rnd(10 - a)
    if (used.has(`${a}+${b}`)) continue
    used.add(`${a}+${b}`)
    qs.push({
      id: qid(),
      prompt: '数一数格子里的圆点，算一算',
      big: `${a} + ${b} = ?`,
      visual: { kind: 'tenframe', first: a, second: b },
      options: numOptions(a + b),
      answer: String(a + b),
      explain: `先数 ${a} 个蓝点，再数 ${b} 个橙点，一共是 ${a + b} 个。`,
    })
  }
  return qs
}

export function genSub10(): Question[] {
  const used = new Set<string>()
  const qs: Question[] = []
  while (qs.length < 10) {
    const a = 3 + rnd(8)
    const b = 1 + rnd(a - 1)
    if (used.has(`${a}-${b}`)) continue
    used.add(`${a}-${b}`)
    qs.push({
      id: qid(),
      prompt: `${a} 个苹果，吃掉 ${b} 个，还剩几个？`,
      big: `${a} - ${b} = ?`,
      visual: { kind: 'count', count: a, crossed: b },
      options: numOptions(a - b),
      answer: String(a - b),
      explain: `一共有 ${a} 个，划掉 ${b} 个，还剩 ${a - b} 个。`,
    })
  }
  return qs
}

export function genAddSub20(): Question[] {
  const used = new Set<string>()
  const qs: Question[] = []
  while (qs.length < 10) {
    const isAdd = rnd(2) === 0
    let a: number, b: number, ans: number, big: string
    if (isAdd) {
      a = 2 + rnd(9)
      b = 2 + rnd(19 - a > 10 ? 10 : 19 - a)
      ans = a + b
      big = `${a} + ${b} = ?`
    } else {
      a = 10 + rnd(11)
      b = 2 + rnd(Math.min(9, a - 1))
      ans = a - b
      big = `${a} - ${b} = ?`
    }
    if (used.has(big)) continue
    used.add(big)
    qs.push({
      id: qid(),
      prompt: '细心算一算',
      big,
      options: numOptions(ans),
      answer: String(ans),
      explain: isAdd
        ? `可以先把 ${a} 凑成十，再接着数，得到 ${ans}。`
        : `从 ${a} 里去掉 ${b}，还剩 ${ans}。`,
    })
  }
  return qs
}

export function genCompare(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const expr = qs.length >= 5 // 后 5 题用算式比大小
    let left: string, right: string, lv: number, rv: number
    if (expr) {
      const a = 2 + rnd(8)
      const b = 1 + rnd(8)
      lv = a + b
      rv = 3 + rnd(15)
      left = `${a}+${b}`
      right = String(rv)
    } else {
      lv = 3 + rnd(17)
      rv = 3 + rnd(17)
      left = String(lv)
      right = String(rv)
    }
    const key = `${left}|${right}`
    if (used.has(key)) continue
    used.add(key)
    const ans = lv > rv ? '>' : lv < rv ? '<' : '='
    qs.push({
      id: qid(),
      prompt: '在 ○ 里填上 >、< 或 =',
      big: `${left} ○ ${right}`,
      options: shuffle(['>', '<', '=']),
      answer: ans,
      explain: expr
        ? `先算出 ${left} = ${lv}，再和 ${rv} 比一比，所以填「${ans}」。`
        : `${lv} 和 ${rv} 比一比，填「${ans}」。`,
    })
  }
  return qs
}

export function genFillBlank(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 10) {
    const mode = rnd(3)
    let big: string, ans: number
    if (mode === 0) {
      const a = 1 + rnd(8)
      const sum = a + 1 + rnd(9)
      if (sum > 20) continue
      ans = sum - a
      big = `${a} + □ = ${sum}`
    } else if (mode === 1) {
      const b = 1 + rnd(8)
      const sum = b + 1 + rnd(9)
      if (sum > 20) continue
      ans = sum - b
      big = `□ + ${b} = ${sum}`
    } else {
      const a = 5 + rnd(15)
      const d = 1 + rnd(a - 1)
      ans = a - d
      big = `${a} - □ = ${d}`
    }
    if (used.has(big)) continue
    used.add(big)
    qs.push({
      id: qid(),
      prompt: '□ 里应该填几？',
      big,
      options: numOptions(ans),
      answer: String(ans),
      explain: `试一试把 ${ans} 放进 □ 里，等式就成立啦。`,
    })
  }
  return qs
}

export function genMulIntro(): Question[] {
  const qs: Question[] = []
  const used = new Set<string>()
  while (qs.length < 8) {
    const g = 2 + rnd(3) // 2~4 组
    const per = 2 + rnd(4) // 每组 2~5 个
    const key = `${g}x${per}`
    if (used.has(key)) continue
    used.add(key)
    const ans = g * per
    qs.push({
      id: qid(),
      prompt: `每组有 ${per} 个，一共有 ${g} 组，总共有多少个？`,
      big: `${g} × ${per} = ?`,
      visual: { kind: 'groups', groups: g, per },
      options: numOptions(ans),
      answer: String(ans),
      explain: `${g} 个 ${per} 相加：${Array(g).fill(per).join(' + ')} = ${ans}，所以 ${g} × ${per} = ${ans}。`,
    })
  }
  // 再加 2 道「几个几」
  const texts: [number, number][] = [
    [3, 2],
    [2, 5],
  ]
  for (const [g, per] of texts) {
    const ans = g * per
    qs.push({
      id: qid(),
      prompt: `${g} 个 ${per} 相加，结果是多少？`,
      big: Array(g).fill(per).join(' + ') + ' = ?',
      options: numOptions(ans),
      answer: String(ans),
      explain: `${Array(g).fill(per).join(' + ')} = ${ans}，也可以写成 ${g} × ${per} = ${ans}。`,
    })
  }
  return shuffle(qs)
}

const NAMES = ['小明', '小红', '小华', '小丽', '豆豆', '乐乐']
const ITEMS: [string, string][] = [
  ['苹果', '🍎'],
  ['气球', '🎈'],
  ['糖果', '🍬'],
  ['小鱼', '🐟'],
  ['贴纸', '⭐'],
  ['小鸭', '🦆'],
]

export function genWordProblems(): Question[] {
  const qs: Question[] = []
  const used = new Set<number>()
  while (qs.length < 10) {
    const isAdd = rnd(2) === 0
    const [item, emoji] = pick(ITEMS)
    const name = pick(NAMES)
    let a: number, b: number
    if (isAdd) {
      a = 2 + rnd(8)
      b = 2 + rnd(8)
      if (a + b > 20) continue
    } else {
      a = 6 + rnd(13)
      b = 1 + rnd(a - 2)
    }
    const key = a * 100 + b + (isAdd ? 0 : 50)
    if (used.has(key)) continue
    used.add(key)
    const ans = isAdd ? a + b : a - b
    const prompt = isAdd
      ? `${name}有 ${a} 个${item}，又得到 ${b} 个，现在一共有多少个？`
      : `${name}有 ${a} 个${item}，送给好朋友 ${b} 个，还剩多少个？`
    qs.push({
      id: qid(),
      prompt,
      big: isAdd ? `${a} + ${b} = ?` : `${a} - ${b} = ?`,
      visual: { kind: 'emoji', emoji, label: item },
      options: numOptions(ans),
      answer: String(ans),
      explain: isAdd
        ? `原来的 ${a} 个加上又得到的 ${b} 个，一共 ${ans} 个。`
        : `从 ${a} 个里去掉送出的 ${b} 个，还剩 ${ans} 个。`,
    })
  }
  return qs
}

/* ---------------- 语文题库 ---------------- */

export const PY_CHARS: [string, string][] = [
  ['妈', 'mā'],
  ['爸', 'bà'],
  ['我', 'wǒ'],
  ['你', 'nǐ'],
  ['他', 'tā'],
  ['水', 'shuǐ'],
  ['火', 'huǒ'],
  ['山', 'shān'],
  ['日', 'rì'],
  ['月', 'yuè'],
  ['天', 'tiān'],
  ['人', 'rén'],
  ['口', 'kǒu'],
  ['手', 'shǒu'],
  ['雨', 'yǔ'],
]

function stripTone(py: string): string {
  const map: Record<string, string> = {
    ā: 'a', á: 'a', ǎ: 'a', à: 'a',
    ē: 'e', é: 'e', ě: 'e', è: 'e',
    ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
    ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
    ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
    ǖ: 'ü', ǘ: 'ü', ǚ: 'ü', ǜ: 'ü',
  }
  return py.replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (c) => map[c] ?? c)
}

/** 同音节换声调作为干扰项 */
function toneVariants(py: string): string[] {
  const tones: Record<string, string[]> = {
    a: ['ā', 'á', 'ǎ', 'à'],
    e: ['ē', 'é', 'ě', 'è'],
    i: ['ī', 'í', 'ǐ', 'ì'],
    o: ['ō', 'ó', 'ǒ', 'ò'],
    u: ['ū', 'ú', 'ǔ', 'ù'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
  }
  const base = stripTone(py)
  // 找到带声调的主元音位置
  for (const v of ['a', 'o', 'e', 'i', 'u', 'ü']) {
    const idx = base.indexOf(v)
    if (idx >= 0) {
      return tones[v === 'ü' ? 'ü' : v].map(
        (t) => base.slice(0, idx) + t + base.slice(idx + 1)
      )
    }
  }
  return [py]
}

export function genCharToPinyin(): Question[] {
  return shuffle(PY_CHARS)
    .slice(0, 10)
    .map(([char, py]) => {
      const variants = toneVariants(py).filter((v) => v !== py)
      const otherPy = shuffle(PY_CHARS.filter(([c]) => c !== char))
        .slice(0, 2)
        .map(([, p]) => p)
      return {
        id: qid(),
        prompt: '这个字的拼音是哪个？',
        big: char,
        speak: char,
        speakLang: 'zh-CN' as const,
        options: opts(py, [...variants, ...otherPy]),
        answer: py,
        explain: `「${char}」读作 ${py}。`,
      }
    })
}

export function genPinyinToChar(): Question[] {
  return shuffle(PY_CHARS)
    .slice(0, 10)
    .map(([char, py]) => {
      const others = shuffle(PY_CHARS.filter(([c]) => c !== char))
        .slice(0, 3)
        .map(([c]) => c)
      return {
        id: qid(),
        prompt: '这个拼音对应哪个字？',
        big: py,
        options: opts(char, others),
        answer: char,
        explain: `${py} 就是「${char}」字。`,
      }
    })
}

const SHENGMU: [string, string, string[]][] = [
  ['mā', 'm', ['a', 'b', 'w']],
  ['bà', 'b', ['p', 'd', 'a']],
  ['shuǐ', 'sh', ['s', 'ui', 'ch']],
  ['huǒ', 'h', ['g', 'k', 'uo']],
  ['shān', 'sh', ['s', 'zh', 'an']],
  ['tiān', 't', ['d', 'ian', 'n']],
  ['kǒu', 'k', ['g', 'h', 'ou']],
  ['rì', 'r', ['l', 'y', 'i']],
  ['yǔ', 'y', ['w', 'x', 'u']],
  ['shǒu', 'sh', ['s', 'x', 'ou']],
]

const YUNMU: [string, string, string[]][] = [
  ['mā', 'a', ['m', 'o', 'e']],
  ['shuǐ', 'ui', ['iu', 'sh', 'un']],
  ['huǒ', 'uo', ['ou', 'h', 'ao']],
  ['tiān', 'ian', ['iang', 'an', 't']],
  ['kǒu', 'ou', ['uo', 'k', 'ao']],
  ['shān', 'an', ['ang', 'en', 'sh']],
  ['yuè', 'üe', ['ie', 'y', 'uei']],
  ['rì', 'i', ['r', 'e', 'u']],
  ['shǒu', 'ou', ['uo', 'ao', 'sh']],
  ['yǔ', 'ü', ['u', 'y', 'i']],
]

export function genShengYun(): Question[] {
  const sheng = shuffle(SHENGMU).slice(0, 5).map(([py, ans, wrong]) => ({
    id: qid(),
    prompt: `拼音「${py}」的声母是哪个？`,
    big: py,
    options: opts(ans, wrong),
    answer: ans,
    explain: `「${py}」开头的声母是 ${ans}。`,
  }))
  const yun = shuffle(YUNMU).slice(0, 5).map(([py, ans, wrong]) => ({
    id: qid(),
    prompt: `拼音「${py}」的韵母是哪个？`,
    big: py,
    options: opts(ans, wrong),
    answer: ans,
    explain: `「${py}」的韵母是 ${ans}。`,
  }))
  return shuffle([...sheng, ...yun])
}

export function genChineseWords(): Question[] {
  const bank: Omit<Question, 'id'>[] = [
    { prompt: '「日」指的是什么？', big: '日', options: opts('太阳', ['月亮', '星星', '白云']), answer: '太阳', explain: '「日」就是太阳，「日子」的日。' },
    { prompt: '「月」指的是什么？', big: '月', options: opts('月亮', ['太阳', '大山', '小河']), answer: '月亮', explain: '「月」就是月亮，也是「一月、二月」的月。' },
    { prompt: '「大」的反义词是哪个？', big: '大 ↔ ?', options: opts('小', ['多', '高', '长']), answer: '小', explain: '大和小是一对反义词。' },
    { prompt: '「上」的反义词是哪个？', big: '上 ↔ ?', options: opts('下', ['左', '前', '里']), answer: '下', explain: '上和下是一对反义词。' },
    { prompt: '「多」的反义词是哪个？', big: '多 ↔ ?', options: opts('少', ['大', '高', '远']), answer: '少', explain: '多和少是一对反义词。' },
    { prompt: '一（ ）牛 —— 括号里填哪个量词？', big: '一□牛', options: opts('头', ['只', '条', '朵']), answer: '头', explain: '我们说「一头牛」。' },
    { prompt: '一（ ）鸟 —— 括号里填哪个量词？', big: '一□鸟', options: opts('只', ['头', '本', '条']), answer: '只', explain: '我们说「一只鸟」。' },
    { prompt: '一（ ）书 —— 括号里填哪个量词？', big: '一□书', options: opts('本', ['只', '朵', '条']), answer: '本', explain: '我们说「一本书」。' },
    { prompt: '一（ ）花 —— 括号里填哪个量词？', big: '一□花', options: opts('朵', ['本', '头', '只']), answer: '朵', explain: '我们说「一朵花」。' },
    { prompt: '一（ ）鱼 —— 括号里填哪个量词？', big: '一□鱼', options: opts('条', ['只', '朵', '本']), answer: '条', explain: '我们说「一条鱼」。' },
  ]
  return bank.map((q) => ({ ...q, id: qid() }))
}

export function genChineseSense(): Question[] {
  const bank: Omit<Question, 'id'>[] = [
    { prompt: '下面哪个是水果？', options: opts('苹果', ['白菜', '萝卜', '土豆']), answer: '苹果', visual: { kind: 'emoji', emoji: '🍎' }, explain: '苹果是水果，白菜、萝卜、土豆是蔬菜。' },
    { prompt: '下面哪个是蔬菜？', options: opts('白菜', ['香蕉', '西瓜', '葡萄']), answer: '白菜', visual: { kind: 'emoji', emoji: '🥬' }, explain: '白菜是蔬菜。' },
    { prompt: '下面哪个是小动物？', options: opts('小兔', ['大树', '汽车', '房子']), answer: '小兔', visual: { kind: 'emoji', emoji: '🐰' }, explain: '小兔是小动物。' },
    { prompt: '下面哪个字和「水」有关？', big: '水', options: opts('河', ['山', '火', '土']), answer: '河', explain: '河里流着水，和水有关。' },
    { prompt: '下面哪个字和「火」有关？', big: '火', options: opts('烧', ['冰', '雨', '雪']), answer: '烧', explain: '「烧」要用火，和火有关。' },
    { prompt: '「口」字加一横可以变成哪个字？', big: '口 + 一', options: opts('日', ['人', '大', '小']), answer: '日', explain: '「口」里面加一横就是「日」。' },
    { prompt: '「人」字加一横可以变成哪个字？', big: '人 + 一', options: opts('大', ['口', '日', '月']), answer: '大', explain: '「人」上面加一横就是「大」。' },
    { prompt: '下面哪个词语读对了？', big: '天上飞的', options: opts('小鸟', ['小鱼', '小马', '小牛']), answer: '小鸟', explain: '小鸟在天上飞，小鱼在水里游。' },
    { prompt: '「下雨了」应该带什么出门？', options: opts('雨伞', ['扇子', '帽子', '手套']), answer: '雨伞', visual: { kind: 'emoji', emoji: '☔' }, explain: '下雨天要打雨伞。' },
    { prompt: '「天黑了」天上会出现什么？', options: opts('月亮和星星', ['太阳', '彩虹', '白云']), answer: '月亮和星星', visual: { kind: 'emoji', emoji: '🌙' }, explain: '夜晚天上有月亮和星星。' },
  ]
  return bank.map((q) => ({ ...q, id: qid() }))
}

/* ---------------- 英语题库 ---------------- */

function enQ(partial: Omit<Question, 'id' | 'speakLang'>): Question {
  return { ...partial, id: qid(), speakLang: 'en-US' }
}

export const LETTER_SETS: [string, string[]][] = [
  ['b', ['d', 'p', 'e']],
  ['d', ['b', 'g', 't']],
  ['p', ['b', 'q', 'd']],
  ['m', ['n', 'w', 'h']],
  ['n', ['m', 'h', 'u']],
  ['g', ['j', 'q', 'y']],
  ['s', ['z', 'c', 'x']],
  ['a', ['e', 'o', 'u']],
  ['i', ['l', 'j', 'e']],
  ['f', ['t', 'v', 's']],
]

function genLetters(): Question[] {
  return LETTER_SETS.map(([letter, wrong]) =>
    enQ({
      prompt: '听一听，选出你听到的字母',
      big: '?',
      speak: letter,
      options: opts(letter, wrong),
      answer: letter,
      explain: `你听到的字母是 ${letter.toUpperCase()} ${letter}。`,
    })
  )
}

export const CVC_SETS: [string, string[]][] = [
  ['cat', ['cap', 'can', 'cut']],
  ['dog', ['dig', 'dot', 'doll']],
  ['pig', ['big', 'pin', 'pit']],
  ['hat', ['hot', 'hit', 'hut']],
  ['bus', ['but', 'bed', 'boss']],
  ['sun', ['son', 'run', 'fun']],
  ['bed', ['bad', 'bid', 'red']],
  ['cup', ['cap', 'cop', 'cut']],
  ['map', ['mop', 'mat', 'mad']],
  ['pen', ['pan', 'pin', 'ten']],
]

function genCvc(): Question[] {
  return CVC_SETS.map(([word, wrong]) =>
    enQ({
      prompt: '听一听，选出你听到的单词',
      big: '👂',
      speak: word,
      options: opts(word, wrong),
      answer: word,
      explain: `你听到的单词是 ${word}。`,
    })
  )
}

export const PIC_WORDS: [string, string, string[]][] = [
  ['🐱', 'cat', ['dog', 'pig', 'cow']],
  ['🐶', 'dog', ['cat', 'duck', 'frog']],
  ['🐷', 'pig', ['dog', 'big', 'hen']],
  ['🐟', 'fish', ['frog', 'fox', 'dish']],
  ['🍎', 'apple', ['banana', 'egg', 'orange']],
  ['🍌', 'banana', ['apple', 'melon', 'milk']],
  ['🥚', 'egg', ['leg', 'bed', 'apple']],
  ['🌞', 'sun', ['moon', 'star', 'run']],
  ['⭐', 'star', ['sun', 'moon', 'car']],
  ['🥛', 'milk', ['juice', 'water', 'cake']],
]

function genPicWord(): Question[] {
  return PIC_WORDS.map(([emoji, word, wrong]) =>
    enQ({
      prompt: '看一看图片，选出正确的单词',
      visual: { kind: 'emoji', emoji },
      speak: word,
      options: opts(word, wrong),
      answer: word,
      explain: `${emoji} 是 ${word}。`,
    })
  )
}

export const SIGHT_SETS: [string, string[]][] = [
  ['the', ['they', 'this', 'that']],
  ['and', ['ant', 'end', 'can']],
  ['is', ['it', 'in', 'as']],
  ['it', ['is', 'at', 'if']],
  ['we', ['me', 'he', 'be']],
  ['my', ['me', 'by', 'may']],
  ['you', ['your', 'yes', 'toy']],
  ['see', ['sea', 'she', 'bee']],
  ['go', ['no', 'so', 'do']],
  ['on', ['in', 'one', 'no']],
]

function genSight(): Question[] {
  return SIGHT_SETS.map(([word, wrong]) =>
    enQ({
      prompt: '听一听，选出你听到的单词',
      big: '👂',
      speak: word,
      options: opts(word, wrong),
      answer: word,
      explain: `你听到的单词是 ${word}。`,
    })
  )
}

export const SENT_SETS: [string, string[]][] = [
  ['I can see a cat.', ['I can see a cap.', 'I can see a dog.', 'I can see a pig.']],
  ['I can see a dog.', ['I can see a duck.', 'I can see a cat.', 'I can see a doll.']],
  ['I like my mum.', ['I like my dad.', 'I like my dog.', 'I like my map.']],
  ['I like my dad.', ['I like my mum.', 'I like my bed.', 'I like my bag.']],
  ['It is a big pig.', ['It is a big dog.', 'It is a big cat.', 'It is a red pig.']],
  ['It is a red bus.', ['It is a red cup.', 'It is a big bus.', 'It is a red bed.']],
  ['Look at the sun.', ['Look at the moon.', 'Look at the star.', 'Look at the bug.']],
  ['The hen is on the bed.', ['The hen is on the bus.', 'The cat is on the bed.', 'The hen is in the bed.']],
  ['I have a red pen.', ['I have a red cap.', 'I have a big pen.', 'I have a red bag.']],
  ['The frog can hop.', ['The frog can run.', 'The dog can hop.', 'The frog can swim.']],
]

function genSentences(): Question[] {
  return SENT_SETS.map(([sent, wrong]) =>
    enQ({
      prompt: '听一听，选出你听到的句子',
      big: '👂',
      speak: sent,
      options: opts(sent, wrong),
      answer: sent,
      explain: `你听到的句子是「${sent}」`,
    })
  )
}

/* ---------------- 题包列表 ---------------- */

export const PACKS: Pack[] = [
  // 数学·一年级
  { id: 'm-add10', subject: 'math', level: 1, title: '10以内加法', desc: '用十格阵数一数，加法变简单', minutes: 20, basePoints: 20, badge: '➕', gen: genAdd10 },
  { id: 'm-sub10', subject: 'math', level: 1, title: '10以内减法', desc: '划掉苹果看一看，还剩几个？', minutes: 20, basePoints: 20, badge: '➖', gen: genSub10 },
  { id: 'm-20', subject: 'math', level: 1, title: '20以内加减法', desc: '细心计算小挑战', minutes: 20, basePoints: 24, badge: '💯', gen: genAddSub20 },
  { id: 'm-compare', subject: 'math', level: 1, title: '比一比大小', desc: '大于小于还是等于？', minutes: 15, basePoints: 18, badge: '⚖️', gen: genCompare },
  { id: 'm-fill', subject: 'math', level: 1, title: '算式填空', desc: '方框里藏着数字几？', minutes: 20, basePoints: 24, badge: '🧩', gen: genFillBlank },
  { id: 'm-mul', subject: 'math', level: 1, title: '乘法启蒙', desc: '几个几相加，乘法来啦', minutes: 20, basePoints: 26, badge: '✖️', gen: genMulIntro },
  { id: 'm-word', subject: 'math', level: 1, title: '应用题乐园', desc: '生活里的数学小故事', minutes: 20, basePoints: 26, badge: '📗', gen: genWordProblems },
  // 数学·二年级
  { id: 'm-100', subject: 'math', level: 2, title: '100以内加减', desc: '更大的数字计算', minutes: 20, basePoints: 26, badge: '💯', gen: genAddSub100 },
  { id: 'm-mulmix', subject: 'math', level: 2, title: '乘加乘减', desc: '先乘后加减', minutes: 20, basePoints: 26, badge: '🔢', gen: genMulMix },
  { id: 'm-time', subject: 'math', level: 2, title: '认识时间', desc: '时针分针怎么看？', minutes: 15, basePoints: 22, badge: '🕐', gen: genTime },
  { id: 'm-length', subject: 'math', level: 2, title: '长度单位', desc: '厘米和米', minutes: 15, basePoints: 22, badge: '📏', gen: genLength },
  // 数学·三年级
  { id: 'm-mul3x1', subject: 'math', level: 3, title: '多位数乘一位数', desc: '几百乘几', minutes: 20, basePoints: 28, badge: '✖️', gen: genMul3x1 },
  { id: 'm-div3', subject: 'math', level: 3, title: '除法进阶', desc: '除数是一位数', minutes: 20, basePoints: 28, badge: '➗', gen: genDiv3 },
  { id: 'm-fraction', subject: 'math', level: 3, title: '分数初步', desc: '几分之几是多少？', minutes: 20, basePoints: 28, badge: '🍕', gen: genFraction },
  { id: 'm-perimeter', subject: 'math', level: 3, title: '周长计算', desc: '长方形和正方形', minutes: 20, basePoints: 28, badge: '📐', gen: genPerimeter },
  // 数学·四年级
  { id: 'm-mul3x2', subject: 'math', level: 4, title: '三位数乘两位数', desc: '大数乘法', minutes: 25, basePoints: 32, badge: '🔥', gen: genMul3x2 },
  { id: 'm-div4', subject: 'math', level: 4, title: '除数是两位数', desc: '大数除法', minutes: 25, basePoints: 32, badge: '➗', gen: genDiv4 },
  { id: 'm-area', subject: 'math', level: 4, title: '面积计算', desc: '长方形和正方形面积', minutes: 20, basePoints: 28, badge: '📏', gen: genArea },
  { id: 'm-oplaw', subject: 'math', level: 4, title: '运算律', desc: '简便计算', minutes: 20, basePoints: 30, badge: '⚡', gen: genOpLaw },
  // 数学·五年级
  { id: 'm-decadd', subject: 'math', level: 5, title: '小数加减', desc: '小数点对齐', minutes: 20, basePoints: 30, badge: '🔟', gen: genDecimalAdd },
  { id: 'm-decmul', subject: 'math', level: 5, title: '小数乘法', desc: '先整数再点小数点', minutes: 20, basePoints: 30, badge: '✖️', gen: genDecimalMul },
  { id: 'm-factor', subject: 'math', level: 5, title: '因数与倍数', desc: '找因数', minutes: 20, basePoints: 30, badge: '🔍', gen: genFactor },
  { id: 'm-fracadd', subject: 'math', level: 5, title: '分数加减', desc: '同分母分数', minutes: 20, basePoints: 30, badge: '🍰', gen: genFracAdd },
  // 数学·六年级
  { id: 'm-fracmul', subject: 'math', level: 6, title: '分数乘除', desc: '分数的乘法和除法', minutes: 25, basePoints: 34, badge: '🧮', gen: genFracMul },
  { id: 'm-percent', subject: 'math', level: 6, title: '百分数', desc: '百分之几是多少？', minutes: 20, basePoints: 32, badge: '💯', gen: genPercent },
  { id: 'm-ratio', subject: 'math', level: 6, title: '比和比例', desc: '内项积=外项积', minutes: 20, basePoints: 32, badge: '⚖️', gen: genRatio },
  { id: 'm-circle', subject: 'math', level: 6, title: '圆的周长和面积', desc: 'π取3.14', minutes: 20, basePoints: 32, badge: '⭕', gen: genCircle },
  // 数学·浅奥
  { id: 'm-aoshu-low', subject: 'math', level: 1, title: '浅奥思维·低阶', desc: '数线段、找规律、排队问题', minutes: 20, basePoints: 28, badge: '🧠', gen: genAoshuLow },
  { id: 'm-aoshu-mid', subject: 'math', level: 3, title: '浅奥思维·中阶', desc: '鸡兔同笼、和差、植树问题', minutes: 25, basePoints: 32, badge: '🐔', gen: genAoshuMid },
  { id: 'm-aoshu-high', subject: 'math', level: 5, title: '浅奥思维·高阶', desc: '相遇追及、盈亏、周期问题', minutes: 25, basePoints: 36, badge: '🚀', gen: genAoshuHigh },
  { id: 'm-mul-table', subject: 'math', level: 2, title: '乘法口诀', desc: '2-9 的乘法表', minutes: 15, basePoints: 22, badge: '✖️', gen: genMulTable },
  { id: 'm-div-table', subject: 'math', level: 2, title: '除法入门', desc: '平均分一分', minutes: 15, basePoints: 22, badge: '➗', gen: genDivTable },
  { id: 'm-div-rem', subject: 'math', level: 3, title: '带余除法', desc: '商几余几？', minutes: 20, basePoints: 26, badge: '🧮', gen: genDivRem },
  { id: 'm-mul-2x1', subject: 'math', level: 3, title: '两位数乘一位数', desc: '乘法竖式基础', minutes: 20, basePoints: 26, badge: '💪', gen: genMul2x1 },
  { id: 'm-24', subject: 'math', level: 3, title: '四数运算挑战', desc: '练习先乘除后加减', minutes: 20, basePoints: 28, badge: '🎯', gen: gen24 },
  { id: 'm-sudoku', subject: 'math', level: 1, title: '数独启蒙', desc: '4宫数独小游戏', minutes: 15, basePoints: 24, badge: '🔢', gen: genSudoku },
  { id: 'm-logic', subject: 'math', level: 1, title: '逻辑推理', desc: '谁最高？谁最快？', minutes: 15, basePoints: 24, badge: '🔍', gen: genLogic },
  { id: 'm-word-adv', subject: 'math', level: 2, title: '应用题挑战', desc: '多步计算和购物问题', minutes: 20, basePoints: 28, badge: '📘', gen: genWordAdv },
  // 语文·一年级
  { id: 'c-py1', subject: 'chinese', level: 1, title: '看字选拼音', desc: '这些汉字你认识吗？', minutes: 20, basePoints: 20, badge: '🀄', gen: genCharToPinyin },
  { id: 'c-py2', subject: 'chinese', level: 1, title: '看拼音选汉字', desc: '拼音宝宝找朋友', minutes: 20, basePoints: 20, badge: '🔍', gen: genPinyinToChar },
  { id: 'c-py3', subject: 'chinese', level: 1, title: '声母韵母大作战', desc: '分清声母和韵母', minutes: 20, basePoints: 24, badge: '🎯', gen: genShengYun },
  { id: 'c-word', subject: 'chinese', level: 1, title: '识字乐园', desc: '反义词、量词、字的意思', minutes: 20, basePoints: 20, badge: '🌳', gen: genChineseWords },
  { id: 'c-sense', subject: 'chinese', level: 1, title: '词语小达人', desc: '常识与词语搭配', minutes: 20, basePoints: 20, badge: '🌈', gen: genChineseSense },
  { id: 'c-picwrite', subject: 'chinese', level: 1, title: '看图写话', desc: '看图片选出最好的句子', minutes: 15, basePoints: 20, badge: '🖼️', gen: genPicWrite },
  { id: 'c-makesent', subject: 'chinese', level: 1, title: '组词造句', desc: '用词语造出通顺的句子', minutes: 15, basePoints: 20, badge: '✏️', gen: genMakeSent },
  { id: 'c-poem1', subject: 'chinese', level: 1, title: '古诗接龙·一', desc: '床前明月光，下一句？', minutes: 15, basePoints: 22, badge: '📜', gen: genPoemNext },
  { id: 'c-poem2', subject: 'chinese', level: 1, title: '古诗猜猜看·一', desc: '这句诗出自哪一首？', minutes: 15, basePoints: 22, badge: '🏮', gen: genPoemTitle },
  { id: 'c-read', subject: 'chinese', level: 1, title: '阅读理解·启蒙', desc: '读短文选答案', minutes: 15, basePoints: 22, badge: '📖', gen: genReading },
  // 语文·二年级
  { id: 'c-char2', subject: 'chinese', level: 2, title: '识字进阶·二', desc: '二年级常用汉字', minutes: 20, basePoints: 22, badge: '🌿', gen: genChar2Pinyin },
  { id: 'c-g2char', subject: 'chinese', level: 2, title: '看字选拼音·二', desc: '春夏秋冬、花草树鸟……', minutes: 20, basePoints: 22, badge: '🍃', gen: genG2Char },
  { id: 'c-wordpy2', subject: 'chinese', level: 2, title: '词语拼音·二', desc: '朋友、老师、学校……', minutes: 20, basePoints: 22, badge: '📝', gen: genG2WordPy },
  { id: 'c-match', subject: 'chinese', level: 2, title: '词语搭配', desc: '温暖的____？选最合适的', minutes: 15, basePoints: 20, badge: '🔗', gen: genMatch },
  // 语文·三年级
  { id: 'c-g3char', subject: 'chinese', level: 3, title: '识字进阶·三', desc: '餐厅、卧室、厨房……', minutes: 20, basePoints: 24, badge: '🏠', gen: genG3Char },
  { id: 'c-g3idiom', subject: 'chinese', level: 3, title: '成语乐园·三', desc: '一心一意、画蛇添足……', minutes: 15, basePoints: 24, badge: '🐉', gen: genG3Idiom },
  // 语文·四年级
  { id: 'c-g4ant', subject: 'chinese', level: 4, title: '反义词·四', desc: '认真对马虎，谦虚对骄傲', minutes: 15, basePoints: 24, badge: '↔️', gen: genG4Antonym },
  { id: 'c-g4syn', subject: 'chinese', level: 4, title: '近义词·四', desc: '美丽对漂亮，高兴对开心', minutes: 15, basePoints: 24, badge: '≈', gen: genG4Synonym },
  // 语文·五年级
  { id: 'c-g5poem', subject: 'chinese', level: 5, title: '古诗接龙·五', desc: '山行、赠刘景文、望天门山', minutes: 15, basePoints: 26, badge: '📜', gen: genG5Poem },
  { id: 'c-g5idiom', subject: 'chinese', level: 5, title: '成语乐园·五', desc: '掩耳盗铃、刻舟求剑……', minutes: 15, basePoints: 26, badge: '🐉', gen: genG5Idiom },
  // 语文·六年级
  { id: 'c-g6poem', subject: 'chinese', level: 6, title: '古诗接龙·六', desc: '泊船瓜洲、书湖阴先生壁', minutes: 15, basePoints: 28, badge: '📜', gen: genG6Poem },
  { id: 'c-g6idiom', subject: 'chinese', level: 6, title: '成语乐园·六', desc: '锲而不舍、精益求精……', minutes: 15, basePoints: 28, badge: '🐉', gen: genG6Idiom },
  // 英语·一年级
  { id: 'e-letter', subject: 'english', level: 1, title: '字母听音', desc: '竖起小耳朵，听字母', minutes: 15, basePoints: 18, badge: '🔡', gen: genLetters },
  { id: 'e-cvc', subject: 'english', level: 1, title: '单词听音', desc: 'cat? cap? 仔细听！', minutes: 20, basePoints: 22, badge: '👂', gen: genCvc },
  { id: 'e-pic', subject: 'english', level: 1, title: '看图选词', desc: '图片和单词配配对', minutes: 15, basePoints: 18, badge: '🖼️', gen: genPicWord },
  { id: 'e-sight', subject: 'english', level: 1, title: '常用词听音', desc: 'the、and、is……高频词', minutes: 15, basePoints: 18, badge: '⭐', gen: genSight },
  { id: 'e-sent', subject: 'english', level: 1, title: '句子听音', desc: '听懂一整句话', minutes: 20, basePoints: 24, badge: '💬', gen: genSentences },
  // 英语·二年级（剑少一级）
  { id: 'e-starters-pic', subject: 'english', level: 2, title: '剑少一级·看图选词', desc: '剑桥少儿 Starters 词汇', minutes: 15, basePoints: 22, badge: '🏅', gen: genStartersPic },
  { id: 'e-starters-listen', subject: 'english', level: 2, title: '剑少一级·单词听音', desc: '剑桥少儿 Starters 听力', minutes: 15, basePoints: 22, badge: '🎧', gen: genStartersListen },
  { id: 'e-starters-sent', subject: 'english', level: 2, title: '剑少一级·句子听音', desc: '剑桥少儿 Starters 句子', minutes: 20, basePoints: 24, badge: '📝', gen: genStartersSent },
  // 英语·三年级（剑少二级）
  { id: 'e-movers-pic', subject: 'english', level: 3, title: '剑少二级·看图选词', desc: '剑桥少儿 Movers 词汇', minutes: 15, basePoints: 24, badge: '🥈', gen: genMoversPic },
  { id: 'e-movers-listen', subject: 'english', level: 3, title: '剑少二级·单词听音', desc: '剑桥少儿 Movers 听力', minutes: 15, basePoints: 24, badge: '🎧', gen: genMoversListen },
  { id: 'e-movers-sent', subject: 'english', level: 3, title: '剑少二级·句子听音', desc: '剑桥少儿 Movers 句子', minutes: 20, basePoints: 26, badge: '📝', gen: genMoversSent },
  // 英语·四年级（剑少三级+语法）
  { id: 'e-flyers-pic', subject: 'english', level: 4, title: '剑少三级·看图选词', desc: '剑桥少儿 Flyers 词汇', minutes: 15, basePoints: 26, badge: '🥇', gen: genFlyersPic },
  { id: 'e-flyers-listen', subject: 'english', level: 4, title: '剑少三级·单词听音', desc: '剑桥少儿 Flyers 听力', minutes: 15, basePoints: 26, badge: '🎧', gen: genFlyersListen },
  { id: 'e-flyers-sent', subject: 'english', level: 4, title: '剑少三级·句子听音', desc: '剑桥少儿 Flyers 句子', minutes: 20, basePoints: 28, badge: '📝', gen: genFlyersSent },
  { id: 'e-grammar-be', subject: 'english', level: 4, title: '语法·be动词', desc: 'am、is、are 怎么用？', minutes: 15, basePoints: 24, badge: '📐', gen: genGrammarBe },
  { id: 'e-grammar-plural', subject: 'english', level: 4, title: '语法·名词复数', desc: 'apple→apples, box→boxes', minutes: 15, basePoints: 24, badge: '🔢', gen: genGrammarPlural },
  // 英语·五年级（KET）
  { id: 'e-ket-pic', subject: 'english', level: 5, title: 'KET·看图选词', desc: 'KET 核心词汇', minutes: 15, basePoints: 26, badge: '🏆', gen: genKetPic },
  { id: 'e-ket-listen', subject: 'english', level: 5, title: 'KET·单词听音', desc: 'KET 听力词汇', minutes: 15, basePoints: 26, badge: '🎧', gen: genKetListen },
  { id: 'e-ket-sent', subject: 'english', level: 5, title: 'KET·句子听音', desc: 'KET 听力句子', minutes: 20, basePoints: 28, badge: '📝', gen: genKetSent },
  { id: 'e-ket-grammar', subject: 'english', level: 5, title: 'KET·语法', desc: 'There be、时态、情态动词', minutes: 20, basePoints: 28, badge: '📐', gen: genKetGrammar },
  // 英语·六年级（KET阅读+语法时态）
  { id: 'e-ket-read', subject: 'english', level: 6, title: 'KET·阅读理解', desc: '读短文选答案', minutes: 20, basePoints: 30, badge: '📖', gen: genKetReading },
  { id: 'e-grammar-tense', subject: 'english', level: 6, title: '语法·时态', desc: '一般现在、过去、将来', minutes: 20, basePoints: 28, badge: '⏰', gen: genGrammarTense },
  { id: 'e-enread', subject: 'english', level: 6, title: '英语阅读·启蒙', desc: '读英文小短文', minutes: 15, basePoints: 26, badge: '📚', gen: genEnReading },
  // 英语·自然拼读（跨年级）
  { id: 'e-blend', subject: 'english', level: 2, title: '自然拼读·辅音组合', desc: 'bl、br、cl、cr 怎么读？', minutes: 15, basePoints: 22, badge: '🔤', gen: genBlend },
  { id: 'e-digraph', subject: 'english', level: 2, title: '自然拼读·字母组合', desc: 'sh、ch、th、ng、nk……', minutes: 15, basePoints: 22, badge: '🔠', gen: genDigraph },
  { id: 'e-longvowel', subject: 'english', level: 3, title: '自然拼读·长元音', desc: 'a_e、ai、ay、ee、ea……', minutes: 15, basePoints: 22, badge: '🎵', gen: genLongVowel },
]

export function getPack(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id)
}
