import type { Pack, Question } from '@/types'
import {
  LETTER_SETS, CVC_SETS, PIC_WORDS, SIGHT_SETS, SENT_SETS,
} from './bank'
import {
  STARTERS_WORDS, STARTERS_LISTEN, STARTERS_SENT,
  MOVERS_WORDS, MOVERS_LISTEN, MOVERS_SENT,
  KET_WORDS, KET_LISTEN, KET_SENT,
  BLEND_SETS, DIGRAPH_SETS, LONG_VOWEL_SETS,
  genBlend, genDigraph, genLongVowel,
} from './bankEnglishAdv'
import {
  FLYERS_WORDS, FLYERS_LISTEN, FLYERS_SENT,
  GRAMMAR_BE, GRAMMAR_TENSE, GRAMMAR_PLURAL, KET_GRAMMAR,
  EN_READINGS, KET_READINGS,
} from './bankEnglishGrade'

let seq = 0
const qid = () => `qpe${Date.now().toString(36)}-${seq++}`
const rnd = (n: number) => Math.floor(Math.random() * n)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function eOpts(answer: string, pool: string[]): string[] {
  const set = new Set<string>([answer])
  for (const p of shuffle(pool)) {
    if (set.size >= 4) break
    if (p !== answer) set.add(p)
  }
  return shuffle([...set])
}
function enQ(partial: Omit<Question, 'id' | 'speakLang'>): Question {
  return { ...partial, id: qid(), speakLang: 'en-US' }
}

/* ---------- 新增主题词库：[emoji, word] ---------- */

type VPool = [string, string][]

const NUMBERS: VPool = [
  ['1️⃣', 'one'], ['2️⃣', 'two'], ['3️⃣', 'three'], ['4️⃣', 'four'], ['5️⃣', 'five'],
  ['6️⃣', 'six'], ['7️⃣', 'seven'], ['8️⃣', 'eight'], ['9️⃣', 'nine'], ['🔟', 'ten'],
]
const COLORS: VPool = [
  ['🔴', 'red'], ['🔵', 'blue'], ['🟡', 'yellow'], ['🟢', 'green'], ['🟣', 'purple'],
  ['🟠', 'orange'], ['⚫', 'black'], ['⚪', 'white'], ['🟤', 'brown'], ['🩷', 'pink'],
]
const BODY: VPool = [
  ['👀', 'eye'], ['👂', 'ear'], ['👃', 'nose'], ['👄', 'mouth'], ['✋', 'hand'],
  ['🦶', 'foot'], ['💪', 'arm'], ['🦵', 'leg'], ['🧠', 'head'], ['🦷', 'tooth'],
]
const FAMILY: VPool = [
  ['👴', 'grandpa'], ['👵', 'grandma'], ['👨‍🦱', 'uncle'], ['👩‍🦰', 'aunt'],
  ['🧒', 'cousin'], ['👶', 'baby'], ['👦', 'brother'], ['👧', 'sister'],
]
const TOYS: VPool = [
  ['🧸', 'teddy bear'], ['🪀', 'yo-yo'], ['⚽', 'ball'], ['🪁', 'kite'], ['🎲', 'dice'],
  ['🧩', 'puzzle'], ['🚙', 'toy car'], ['🪆', 'doll'], ['🎮', 'video game'], ['🛴', 'scooter'],
]
const FOOD: VPool = [
  ['🍞', 'bread'], ['🍰', 'cake'], ['🍚', 'rice'], ['🍜', 'noodles'], ['🥟', 'dumpling'],
  ['🍕', 'pizza'], ['🍔', 'burger'], ['🍟', 'fries'], ['🍦', 'ice cream'], ['🍫', 'chocolate'],
  ['🍪', 'cookie'], ['🧃', 'juice'],
]
const CLOTHES: VPool = [
  ['👕', 'T-shirt'], ['👖', 'pants'], ['👗', 'dress'], ['🧥', 'coat'], ['👟', 'shoes'],
  ['🧢', 'cap'], ['🧦', 'socks'], ['🧤', 'gloves'], ['👒', 'hat'], ['🧣', 'scarf'],
]
const WEATHERX: VPool = [
  ['☀️', 'sunny'], ['🌧️', 'rainy'], ['❄️', 'snowy'], ['🌬️', 'windy'],
  ['☁️', 'cloudy'], ['⛈️', 'stormy'], ['🌫️', 'foggy'], ['🌈', 'rainbow'],
]
const ANIMALS2: VPool = [
  ['🦊', 'fox'], ['🐺', 'wolf'], ['🦒', 'giraffe'], ['🦓', 'zebra'], ['🦛', 'hippo'],
  ['🐊', 'crocodile'], ['🐍', 'snake'], ['🦘', 'kangaroo'], ['🐫', 'camel'], ['🦚', 'peacock'],
]
const SPORTS: VPool = [
  ['⚽', 'football'], ['🏀', 'basketball'], ['🏓', 'ping-pong'], ['🏸', 'badminton'], ['🏊', 'swimming'],
  ['🚴', 'cycling'], ['⛸️', 'skating'], ['🎾', 'tennis'], ['🏃', 'running'], ['🤸', 'gymnastics'],
]
const HOBBIES: VPool = [
  ['🎨', 'drawing'], ['🎤', 'singing'], ['💃', 'dancing'], ['📖', 'reading'], ['🎹', 'piano'],
  ['🎸', 'guitar'], ['📷', 'photography'], ['🎣', 'fishing'], ['🌱', 'gardening'], ['♟️', 'chess'],
]
const PLACES: VPool = [
  ['🏞️', 'park'], ['🛒', 'supermarket'], ['📚', 'library'], ['🎬', 'cinema'], ['🏟️', 'stadium'],
  ['🏖️', 'beach'], ['🎡', 'amusement park'], ['🏛️', 'museum'], ['🚉', 'station'], ['🛫', 'airport'],
]
const SEA: VPool = [
  ['🐙', 'octopus'], ['🦀', 'crab'], ['🦐', 'shrimp'], ['🐠', 'tropical fish'],
  ['🦞', 'lobster'], ['🐚', 'shell'], ['⭐', 'starfish'], ['🦭', 'seal'],
]
const INSECTS: VPool = [
  ['🦋', 'butterfly'], ['🐝', 'bee'], ['🐜', 'ant'], ['🐞', 'ladybug'],
  ['🕷️', 'spider'], ['🐌', 'snail'], ['🐛', 'caterpillar'], ['🦗', 'cricket'],
]
const JOBS: VPool = [
  ['🧑‍✈️', 'pilot'], ['👩‍⚕️', 'nurse'], ['🚗', 'driver'], ['🔬', 'scientist'],
  ['🎨', 'artist'], ['✍️', 'writer'], ['🎤', 'singer'], ['💃', 'dancer'],
]
const HOUSE: VPool = [
  ['🛋️', 'sofa'], ['🚿', 'shower'], ['🍳', 'kitchen'], ['🪞', 'mirror'],
  ['🕰️', 'clock'], ['🛏️', 'bedroom'], ['📺', 'TV'], ['🧺', 'basket'],
]
const TRAVEL: VPool = [
  ['🛫', 'airport'], ['🚉', 'station'], ['🏨', 'hotel'], ['🗺️', 'map'],
  ['🧳', 'luggage'], ['🎫', 'ticket'], ['📷', 'camera'], ['🏖️', 'beach'],
]
const FEST: VPool = [
  ['🎄', 'Christmas'], ['🎃', 'Halloween'], ['🎂', 'birthday'], ['🎉', 'party'],
  ['🎁', 'gift'], ['💌', 'card'], ['🎆', 'firework'], ['🏮', 'lantern'],
]

/* ---------- 新增语法库 ---------- */

const THERE_BE: [string, string, string[]][] = [
  ['There ____ a cat on the chair.', 'is', ['are', 'be', 'am']],
  ['There ____ two dogs in the park.', 'are', ['is', 'be', 'am']],
  ['There ____ some milk in the glass.', 'is', ['are', 'be', 'am']],
  ['There ____ many books on the desk.', 'are', ['is', 'be', 'am']],
  ['____ there a library near here?', 'Is', ['Are', 'Do', 'Does']],
  ['There ____ an apple and two bananas on the table.', 'is', ['are', 'be', 'am']],
  ['There ____ no water in the bottle.', 'is', ['are', 'be', 'am']],
  ['____ there any students in the classroom?', 'Are', ['Is', 'Do', 'Does']],
]

const COMPARE: [string, string, string[]][] = [
  ['The elephant is ____ than the mouse.', 'bigger', ['big', 'biggest', 'more big']],
  ['My ruler is ____ than yours.', 'longer', ['long', 'longest', 'more long']],
  ['Summer is ____ than spring.', 'hotter', ['hot', 'hottest', 'more hot']],
  ['Tom runs ____ than Jack.', 'faster', ['fast', 'fastest', 'more fast']],
  ['This story is ____ than that one.', 'more interesting', ['interestinger', 'most interesting', 'interesting']],
  ['The giraffe is the ____ animal in the zoo.', 'tallest', ['taller', 'tall', 'most tall']],
  ['Which is ____, the sun or the moon?', 'bigger', ['big', 'biggest', 'more big']],
  ['She is the ____ girl in our class.', 'youngest', ['younger', 'young', 'most young']],
]

/* ---------- 周生成工厂 ---------- */

/** 看图选词：pool 新学 + review 池复习，干扰项来自同主题 */
function wVocab(pool: VPool, review: VPool = []) {
  return (): Question[] => {
    const all = [...pool, ...shuffle(review).slice(0, 2)]
    const words = all.map(([, w]) => w)
    return shuffle(all).slice(0, Math.min(10, all.length)).map(([emoji, word]) =>
      enQ({
        prompt: '看一看图片，选出正确的单词',
        visual: { kind: 'emoji', emoji },
        speak: word,
        options: eOpts(word, words),
        answer: word,
        explain: `${emoji} 是 ${word}。`,
      })
    )
  }
}

/** 听力选词 */
function wListen(pool: [string, string[]][], a = 0, b = 10) {
  return (): Question[] =>
    shuffle(pool.slice(a, b)).slice(0, 10).map(([word, wrong]) =>
      enQ({
        prompt: '听一听，选出你听到的单词', big: '👂',
        speak: word, options: eOpts(word, wrong), answer: word,
        explain: `你听到的单词是 ${word}。`,
      })
    )
}

/** 听力选句 */
function wSent(pool: [string, string[]][], a = 0, b = 10) {
  return (): Question[] =>
    shuffle(pool.slice(a, b)).slice(0, 10).map(([sent, wrong]) =>
      enQ({
        prompt: '听一听，选出你听到的句子', big: '👂',
        speak: sent, options: eOpts(sent, wrong), answer: sent,
        explain: `你听到的句子是「${sent}」`,
      })
    )
}

/** 语法填空 */
function wGrammar(pool: [string, string, string[]][], title = '选出正确的答案') {
  return (): Question[] =>
    shuffle(pool).slice(0, 10).map(([sent, ans, wrong]) =>
      enQ({
        prompt: title, big: sent,
        options: eOpts(ans, wrong), answer: ans,
        explain: `正确答案是「${ans}」。`,
      })
    )
}

/** 阅读理解 */
interface EnReading { title: string; text: string; question: string; answer: string; wrong: string[] }
function wEnRead(pool: EnReading[]) {
  return (): Question[] =>
    shuffle(pool).slice(0, Math.min(4, pool.length)).map((r) =>
      enQ({
        prompt: `读短文《${r.title}》：${r.question}`,
        big: r.text,
        speak: r.text,
        options: eOpts(r.answer, r.wrong),
        answer: r.answer,
        explain: `短文里说：${r.text}`,
      })
    )
}

/** 字母/拼读类直接包装已有池 */
const wLetters = () => (): Question[] =>
  shuffle(LETTER_SETS).map(([letter, wrong]) =>
    enQ({ prompt: '听一听，选出你听到的字母', big: '?', speak: letter, options: eOpts(letter, wrong), answer: letter, explain: `你听到的字母是 ${letter.toUpperCase()} ${letter}。` })
  )
const wCvc = () => (): Question[] =>
  shuffle(CVC_SETS).map(([word, wrong]) =>
    enQ({ prompt: '听一听，选出你听到的单词', big: '👂', speak: word, options: eOpts(word, wrong), answer: word, explain: `你听到的单词是 ${word}。` })
  )
const wSight = () => (): Question[] =>
  shuffle(SIGHT_SETS).map(([word, wrong]) =>
    enQ({ prompt: '听一听，选出你听到的单词', big: '👂', speak: word, options: eOpts(word, wrong), answer: word, explain: `你听到的单词是 ${word}。` })
  )

/* ---------- 词库切块 ---------- */

function chunk(pool: [string, string, string[]][], n: number): VPool[] {
  const size = Math.ceil(pool.length / n)
  return Array.from({ length: n }, (_, i) => pool.slice(i * size, (i + 1) * size).map(([e, w]) => [e, w] as [string, string]))
}

const START_CHUNKS = chunk(STARTERS_WORDS, 3)
const MOVER_CHUNKS = chunk(MOVERS_WORDS, 4)
const FLYER_CHUNKS = chunk(FLYERS_WORDS, 3)
const KET_CHUNKS = chunk(KET_WORDS, 4)

const PIC_POOL: VPool = PIC_WORDS.map(([e, w]) => [e, w])

/* ---------- 组装 ---------- */

type WeekDef = [string, string, string, () => Question[]]

function buildPacks(level: 1 | 2 | 3 | 4 | 5 | 6, defs: WeekDef[]): Pack[] {
  return defs.map(([t, d, b, gen], i) => ({
    id: `we-g${level}s${i < 20 ? 1 : 2}w${String((i % 20) + 1).padStart(2, '0')}`,
    subject: 'english' as const,
    level,
    semester: (i < 20 ? 1 : 2) as 1 | 2,
    week: (i % 20) + 1,
    title: t,
    desc: d,
    minutes: 15,
    basePoints: 14 + level * 2,
    badge: b,
    gen,
  }))
}

const mix = (...gens: (() => Question[])[]) => (): Question[] =>
  shuffle(gens.flatMap((g) => g())).slice(0, 10)

interface Theme { name: string; badge: string; pool: VPool }
interface EnCfg {
  themes: Theme[] // 10 个
  listen: [string, string[]][]
  sents: [string, string[]][]
  specials: { title: string; desc: string; badge: string; gen: () => Question[] }[] // 5 个
  readings: EnReading[]
}

function enGrade(_level: 1 | 2 | 3 | 4 | 5 | 6, cfg: EnCfg): WeekDef[] {
  const th = cfg.themes
  const prevAll = (i: number) => th.slice(0, i).flatMap((t) => t.pool)
  const vocab = (i: number): WeekDef => [
    `主题词汇·${th[i].name}`, `本周单词：${th[i].pool.slice(0, 4).map((p) => p[1]).join('、')}…`,
    th[i].badge, wVocab(th[i].pool, prevAll(i)),
  ]
  const vocabReview = (label: string, upto: number): WeekDef => [
    `词汇大复习·${label}`, '学过的单词再来挑战', '🎯',
    wVocab(shuffle(th.slice(0, upto).flatMap((t) => t.pool)), []),
  ]
  const sp = cfg.specials

  return [
    // ---- 上学期 ----
    vocab(0), vocab(1), vocab(2), vocab(3), vocab(4),
    [`听力·单词一`, '竖起小耳朵', '👂', wListen(cfg.listen, 0, 5)],
    [`听力·句子一`, '听句子找答案', '🎧', wSent(cfg.sents, 0, 5)],
    [sp[0].title, sp[0].desc, sp[0].badge, sp[0].gen],
    vocab(5),
    ['期中复习·上', '词汇听力大复习', '🏆', mix(wVocab(th[0].pool, th[1].pool), wListen(cfg.listen), wSent(cfg.sents))],
    [`听力·单词二`, '继续练听力', '👂', wListen(cfg.listen, 5, 10)],
    [`听力·句子二`, '听句子找答案', '🎧', wSent(cfg.sents, 5, 10)],
    [sp[1].title, sp[1].desc, sp[1].badge, sp[1].gen],
    vocab(6),
    vocabReview('上', 7),
    [sp[2].title, sp[2].desc, sp[2].badge, sp[2].gen],
    ['英语阅读·上', '读短文选答案', '📖', wEnRead(cfg.readings)],
    vocabReview('下', 8),
    ['期末复习·上一', '综合挑战第一场', '🏆', mix(wListen(cfg.listen), wSent(cfg.sents), sp[0].gen)],
    ['期末复习·上二', '综合挑战第二场', '🏆', mix(wVocab(th[2].pool, th[3].pool), wEnRead(cfg.readings), sp[1].gen)],
    // ---- 下学期 ----
    vocab(7), vocab(8), vocab(9),
    [`听力·单词三`, '新词听一听', '👂', wListen(cfg.listen)],
    [`听力·句子三`, '句子听一听', '🎧', wSent(cfg.sents)],
    [sp[3].title, sp[3].desc, sp[3].badge, sp[3].gen],
    ['期中复习·下', '半学期大复习', '🏆', mix(wVocab(th[7].pool, th[8].pool), wListen(cfg.listen), sp[3].gen)],
    ['听力综合挑战', '单词句子一起来', '👂', mix(wListen(cfg.listen), wSent(cfg.sents))],
    ['句子听力·复习', '再听一遍更熟练', '🎧', wSent(cfg.sents)],
    ['英语阅读·下一', '读短文选答案', '📖', wEnRead(cfg.readings)],
    [sp[4].title, sp[4].desc, sp[4].badge, sp[4].gen],
    vocabReview('三', 10),
    vocabReview('四', 10),
    ['听力复习·单词', '全部单词再听一遍', '👂', wListen(cfg.listen)],
    ['听力复习·句子', '全部句子再听一遍', '🎧', wSent(cfg.sents)],
    [sp[0].title + '·复习', sp[0].desc, sp[0].badge, sp[0].gen],
    ['英语阅读·下二', '阅读小达人', '📖', wEnRead(cfg.readings)],
    ['期末复习·下一', '综合挑战第一场', '🏆', mix(wVocab(th[9].pool, th[0].pool), wListen(cfg.listen), sp[2].gen)],
    ['期末复习·下二', '综合挑战第二场', '🏆', mix(wSent(cfg.sents), wEnRead(cfg.readings), sp[4].gen)],
    ['期末总冲刺', '英语小达人就是你', '🚀', mix(wListen(cfg.listen), wSent(cfg.sents), wEnRead(cfg.readings), sp[1].gen)],
  ]
}

/* ---------- 各年级配置 ---------- */

const g1Themes: Theme[] = [
  { name: '数字', badge: '🔢', pool: NUMBERS },
  { name: '颜色', badge: '🎨', pool: COLORS },
  { name: '身体', badge: '👀', pool: BODY },
  { name: '家人', badge: '👨‍👩‍👧', pool: FAMILY },
  { name: '玩具', badge: '🧸', pool: TOYS },
  { name: '食物', badge: '🍞', pool: FOOD },
  { name: '小入门', badge: '🐱', pool: PIC_POOL },
  { name: '剑少启蒙·一', badge: '🌟', pool: START_CHUNKS[0] },
  { name: '剑少启蒙·二', badge: '🌟', pool: START_CHUNKS[1] },
  { name: '剑少启蒙·三', badge: '🌟', pool: START_CHUNKS[2] },
]
const G1_LISTEN: [string, string[]][] = PIC_WORDS.map(([, w, wrong]) => [w, wrong])

const G1E: WeekDef[] = enGrade(1, {
  themes: g1Themes,
  listen: G1_LISTEN,
  sents: SENT_SETS,
  specials: [
    { title: '字母乐园', desc: '听音认字母', badge: '🔤', gen: wLetters() },
    { title: '自然拼读·CVC', desc: '辅元辅拼读', badge: '🧩', gen: wCvc() },
    { title: '常见词 Sight Words', desc: '最常用的英文词', badge: '👀', gen: wSight() },
    { title: '字母乐园·进阶', desc: '字母音再巩固', badge: '🔤', gen: wLetters() },
    { title: '自然拼读·复习', desc: '拼读小能手', badge: '🧩', gen: wCvc() },
  ],
  readings: EN_READINGS,
})

const G2E: WeekDef[] = enGrade(2, {
  themes: [
    { name: '服装', badge: '👕', pool: CLOTHES },
    { name: '天气', badge: '☀️', pool: WEATHERX },
    { name: '野生动物', badge: '🦊', pool: ANIMALS2 },
    { name: '剑少一·动物', badge: '🐶', pool: START_CHUNKS[0] },
    { name: '剑少一·物品', badge: '📚', pool: START_CHUNKS[1] },
    { name: '剑少一·自然', badge: '🌞', pool: START_CHUNKS[2] },
    { name: '剑二·一', badge: '🚀', pool: MOVER_CHUNKS[0] },
    { name: '剑二·二', badge: '🚀', pool: MOVER_CHUNKS[1] },
    { name: '剑二·三', badge: '🚀', pool: MOVER_CHUNKS[2] },
    { name: '剑二·四', badge: '🚀', pool: MOVER_CHUNKS[3] },
  ],
  listen: STARTERS_LISTEN,
  sents: STARTERS_SENT,
  specials: [
    { title: '自然拼读·辅音组合', desc: 'bl、cr、st…', badge: '🧩', gen: genBlend },
    { title: '字母复习', desc: '字母音巩固', badge: '🔤', gen: wLetters() },
    { title: '常见词复习', desc: 'Sight words 再来', badge: '👀', gen: wSight() },
    { title: '自然拼读·组合进阶', desc: '拼读小达人', badge: '🧩', gen: genBlend },
    { title: 'CVC 复习', desc: '拼读基础', badge: '🔤', gen: wCvc() },
  ],
  readings: EN_READINGS,
})

const G3E: WeekDef[] = enGrade(3, {
  themes: [
    { name: '运动', badge: '⚽', pool: SPORTS },
    { name: '爱好', badge: '🎨', pool: HOBBIES },
    { name: '场所', badge: '🏞️', pool: PLACES },
    { name: '剑二·一', badge: '🚀', pool: MOVER_CHUNKS[0] },
    { name: '剑二·二', badge: '🚀', pool: MOVER_CHUNKS[1] },
    { name: '剑二·三', badge: '🚀', pool: MOVER_CHUNKS[2] },
    { name: '剑二·四', badge: '🚀', pool: MOVER_CHUNKS[3] },
    { name: '剑三·一', badge: '🛸', pool: FLYER_CHUNKS[0] },
    { name: '剑三·二', badge: '🛸', pool: FLYER_CHUNKS[1] },
    { name: '剑三·三', badge: '🛸', pool: FLYER_CHUNKS[2] },
  ],
  listen: MOVERS_LISTEN,
  sents: MOVERS_SENT,
  specials: [
    { title: '自然拼读·字母组合', desc: 'sh、ch、th…', badge: '🧩', gen: genDigraph },
    { title: '语法·be 动词', desc: 'am / is / are', badge: '📝', gen: wGrammar(GRAMMAR_BE.map(([s, v, w]) => [`${s} ____ happy.`, v, w]), '选出正确的 be 动词') },
    { title: '自然拼读·组合复习', desc: '拼读更熟练', badge: '🧩', gen: genDigraph },
    { title: '语法·be 动词进阶', desc: '单数复数要分清', badge: '📝', gen: wGrammar(GRAMMAR_BE.map(([s, v, w]) => [`${s} ____ happy.`, v, w]), '选出正确的 be 动词') },
    { title: '自然拼读·辅音复习', desc: 'bl、cr、st 复习', badge: '🔤', gen: genBlend },
  ],
  readings: EN_READINGS,
})

const G4E: WeekDef[] = enGrade(4, {
  themes: [
    { name: '海洋生物', badge: '🐙', pool: SEA },
    { name: '小昆虫', badge: '🦋', pool: INSECTS },
    { name: '职业', badge: '🧑‍✈️', pool: JOBS },
    { name: '剑三·一', badge: '🛸', pool: FLYER_CHUNKS[0] },
    { name: '剑三·二', badge: '🛸', pool: FLYER_CHUNKS[1] },
    { name: '剑三·三', badge: '🛸', pool: FLYER_CHUNKS[2] },
    { name: 'KET·一', badge: '🏆', pool: KET_CHUNKS[0] },
    { name: 'KET·二', badge: '🏆', pool: KET_CHUNKS[1] },
    { name: 'KET·三', badge: '🏆', pool: KET_CHUNKS[2] },
    { name: 'KET·四', badge: '🏆', pool: KET_CHUNKS[3] },
  ],
  listen: FLYERS_LISTEN,
  sents: FLYERS_SENT,
  specials: [
    { title: '自然拼读·长元音', desc: 'a_e、ee、igh…', badge: '🧩', gen: genLongVowel },
    { title: '语法·名词复数', desc: 'apples、boxes、children', badge: '📝', gen: wGrammar(GRAMMAR_PLURAL.map(([n, p, w]) => [`one ${n} → two ____`, p, w]), '选出正确的复数形式') },
    { title: '自然拼读·长元音复习', desc: '长元音再练练', badge: '🧩', gen: genLongVowel },
    { title: '语法·动词时态', desc: '昨天、现在、明天', badge: '📝', gen: wGrammar(GRAMMAR_TENSE, '选出正确的动词形式') },
    { title: '语法·复数复习', desc: '复数形式要记牢', badge: '📝', gen: wGrammar(GRAMMAR_PLURAL.map(([n, p, w]) => [`one ${n} → two ____`, p, w]), '选出正确的复数形式') },
  ],
  readings: EN_READINGS,
})

const G5E: WeekDef[] = enGrade(5, {
  themes: [
    { name: '我的家', badge: '🛋️', pool: HOUSE },
    { name: '旅行', badge: '🧳', pool: TRAVEL },
    { name: '节日', badge: '🎉', pool: FEST },
    { name: 'KET·一', badge: '🏆', pool: KET_CHUNKS[0] },
    { name: 'KET·二', badge: '🏆', pool: KET_CHUNKS[1] },
    { name: 'KET·三', badge: '🏆', pool: KET_CHUNKS[2] },
    { name: 'KET·四', badge: '🏆', pool: KET_CHUNKS[3] },
    { name: '运动复习', badge: '⚽', pool: SPORTS },
    { name: '爱好复习', badge: '🎨', pool: HOBBIES },
    { name: '场所复习', badge: '🏞️', pool: PLACES },
  ],
  listen: KET_LISTEN,
  sents: KET_SENT,
  specials: [
    { title: 'KET 语法·一', desc: '时态与句型', badge: '📝', gen: wGrammar(KET_GRAMMAR) },
    { title: '语法·there be', desc: '某地有某物', badge: '📝', gen: wGrammar(THERE_BE) },
    { title: 'KET 语法·二', desc: '综合练习', badge: '📝', gen: wGrammar(KET_GRAMMAR) },
    { title: '语法·比较级最高级', desc: 'bigger、the tallest', badge: '📝', gen: wGrammar(COMPARE) },
    { title: 'KET 语法·三', desc: '考前冲刺', badge: '📝', gen: wGrammar(KET_GRAMMAR) },
  ],
  readings: KET_READINGS,
})

const G6E: WeekDef[] = enGrade(6, {
  themes: [
    { name: '旅行复习', badge: '🧳', pool: TRAVEL },
    { name: '节日复习', badge: '🎉', pool: FEST },
    { name: '我的家复习', badge: '🛋️', pool: HOUSE },
    { name: '海洋复习', badge: '🐙', pool: SEA },
    { name: '昆虫复习', badge: '🦋', pool: INSECTS },
    { name: '职业复习', badge: '🧑‍✈️', pool: JOBS },
    { name: '剑三·一', badge: '🛸', pool: FLYER_CHUNKS[0] },
    { name: '剑三·二', badge: '🛸', pool: FLYER_CHUNKS[1] },
    { name: '剑三·三', badge: '🛸', pool: FLYER_CHUNKS[2] },
    { name: 'KET 总复习', badge: '🏆', pool: shuffle(KET_WORDS.map(([e, w]) => [e, w] as [string, string])) },
  ],
  listen: KET_LISTEN,
  sents: KET_SENT,
  specials: [
    { title: '语法·时态综合', desc: '四种时态辨析', badge: '📝', gen: wGrammar(GRAMMAR_TENSE, '选出正确的动词形式') },
    { title: 'KET 语法·冲刺', desc: '综合语法', badge: '📝', gen: wGrammar(KET_GRAMMAR) },
    { title: '语法·there be 复习', desc: '就近原则', badge: '📝', gen: wGrammar(THERE_BE) },
    { title: 'KET 阅读', desc: '信件海报邮件', badge: '📖', gen: wEnRead(KET_READINGS) },
    { title: '语法·比较级复习', desc: '比较级最高级', badge: '📝', gen: wGrammar(COMPARE) },
  ],
  readings: KET_READINGS,
})

export const ENGLISH_WEEK_PACKS: Pack[] = [
  ...buildPacks(1, G1E),
  ...buildPacks(2, G2E),
  ...buildPacks(3, G3E),
  ...buildPacks(4, G4E),
  ...buildPacks(5, G5E),
  ...buildPacks(6, G6E),
]

// 保留引用避免 tree-shake 误报（BLEND_SETS 等已通过 gen 函数使用）
void BLEND_SETS
void DIGRAPH_SETS
void LONG_VOWEL_SETS
