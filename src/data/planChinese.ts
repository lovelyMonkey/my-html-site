import type { Pack, Question } from '@/types'
import { genShengYun, genChineseWords, genChineseSense, PY_CHARS } from './bank'
import { POEMS, POEM_TITLE, CHARS_2, MATCHES, PIC_WRITE, MAKE_SENT } from './bankChineseAdv'
import {
  CHARS_G2, G2_WORDS, CHARS_G3, G3_IDIOMS, G4_ANTONYMS, G4_SYNONYMS,
  G5_POEMS, G5_IDIOMS, G6_POEMS, G6_IDIOMS, READINGS,
} from './bankChineseGrade'

let seq = 0
const qid = () => `qpc${Date.now().toString(36)}-${seq++}`
const rnd = (n: number) => Math.floor(Math.random() * n)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ---------- 拼音干扰项自动生成 ---------- */

const TONE_GROUPS = ['āáǎà', 'ēéěè', 'īíǐì', 'ōóǒò', 'ūúǔù', 'ǖǘǚǜ']
const TONE_PLAIN: Record<string, string> = {}
for (const g of TONE_GROUPS) for (const c of g) TONE_PLAIN[c] = g[0].replace(/[āáǎà]/, 'a').replace(/[ēéěè]/, 'e').replace(/[īíǐì]/, 'i').replace(/[ōóǒò]/, 'o').replace(/[ūúǔù]/, 'u').replace(/[ǖǘǚǜ]/, 'ü')
// 简化：直接映射
for (const g of TONE_GROUPS) {
  const plain = g.includes('ā') ? 'a' : g.includes('ē') ? 'e' : g.includes('ī') ? 'i' : g.includes('ō') ? 'o' : g.includes('ū') ? 'u' : 'ü'
  for (const c of g) TONE_PLAIN[c] = plain
}

function shiftTone(py: string, step: number): string | null {
  for (let i = 0; i < py.length; i++) {
    for (const g of TONE_GROUPS) {
      const idx = g.indexOf(py[i])
      if (idx >= 0) return py.slice(0, i) + g[(idx + step) % 4] + py.slice(i + 1)
    }
  }
  return null
}

function stripTones(py: string): string {
  return py.split('').map((c) => TONE_PLAIN[c] ?? c).join('')
}

const INITIAL_SWAPS: [string, string][] = [
  ['zh', 'z'], ['ch', 'c'], ['sh', 's'], ['z', 'zh'], ['c', 'ch'], ['s', 'sh'],
  ['n', 'l'], ['l', 'n'], ['f', 'h'], ['h', 'f'], ['b', 'p'], ['p', 'b'], ['d', 't'], ['t', 'd'], ['q', 'x'], ['x', 'q'], ['j', 'q'], ['k', 'g'], ['g', 'k'],
]
const FINAL_SWAPS: [string, string][] = [
  ['ang', 'an'], ['an', 'ang'], ['eng', 'en'], ['en', 'eng'], ['ing', 'in'], ['in', 'ing'], ['ong', 'eng'], ['ao', 'ou'], ['ou', 'ao'], ['ie', 'ei'], ['ei', 'ie'],
]

function wrongPinyins(py: string): string[] {
  const outs: string[] = []
  const seen = new Set<string>([py])
  const tryAdd = (w: string | null) => {
    if (w && !seen.has(w) && outs.length < 6) {
      seen.add(w)
      outs.push(w)
    }
  }
  // 变调（对第一个带调音节）
  tryAdd(shiftTone(py, 1))
  tryAdd(shiftTone(py, 2))
  tryAdd(shiftTone(py, 3))
  // 去掉声调
  const plain = stripTones(py)
  tryAdd(plain === py ? null : plain)
  // 声母混淆
  for (const [a, b] of INITIAL_SWAPS) {
    if (py.startsWith(a)) tryAdd(b + py.slice(a.length))
  }
  // 韵母混淆
  for (const [a, b] of FINAL_SWAPS) {
    const idx = py.indexOf(a)
    if (idx > 0) tryAdd(py.slice(0, idx) + b + py.slice(idx + a.length))
  }
  return shuffle(outs).slice(0, 3)
}

function cOpts(answer: string, wrong: string[]): string[] {
  const set = new Set<string>([answer])
  for (const w of shuffle(wrong)) {
    if (set.size >= 4) break
    if (w !== answer) set.add(w)
  }
  return shuffle([...set])
}

/* ---------- 周生成工厂 ---------- */

/** 识字：slice(a,b) 新学 + 前面已学的复习；题量不足时反向出题（看拼音选字） */
function wChars(pool: [string, string][], a: number, b: number, review = 2) {
  return (): Question[] => {
    const news = pool.slice(a, b)
    const old = shuffle(pool.slice(0, a)).slice(0, review)
    const chosen = shuffle([...news, ...old])
    const qs: Question[] = chosen.map(([char, py]) => ({
      id: qid(), prompt: '这个字的拼音是哪个？', big: char,
      speak: char, speakLang: 'zh-CN' as const,
      options: cOpts(py, wrongPinyins(py)), answer: py,
      explain: `「${char}」读作 ${py}。`,
    }))
    // 反向题补充题量
    for (const [char, py] of shuffle(chosen)) {
      if (qs.length >= 8) break
      const others = shuffle(pool.filter(([c]) => c !== char)).map(([c]) => c)
      qs.push({
        id: qid(), prompt: '这个拼音是哪个字？', big: py,
        options: cOpts(char, others), answer: char,
        explain: `「${char}」读作 ${py}。`,
      })
    }
    return shuffle(qs)
  }
}

function wWords(pool: { word: string; py: string }[], a: number, b: number, review = 5) {
  return (): Question[] => {
    const news = pool.slice(a, b)
    const old = shuffle(pool.slice(0, a)).slice(0, review)
    const chosen = shuffle([...news, ...old])
    const qs: Question[] = chosen.map((w) => ({
      id: qid(), prompt: '这个词语的拼音是哪个？', big: w.word,
      speak: w.word, speakLang: 'zh-CN' as const,
      options: cOpts(w.py, wrongPinyins(w.py)), answer: w.py,
      explain: `「${w.word}」读作 ${w.py}。`,
    }))
    // 反向题补充题量
    for (const w of shuffle(chosen)) {
      if (qs.length >= 8) break
      const others = shuffle(pool.filter((x) => x.word !== w.word)).map((x) => x.word)
      qs.push({
        id: qid(), prompt: '这个拼音是哪个词语？', big: w.py,
        options: cOpts(w.word, others), answer: w.word,
        explain: `「${w.word}」读作 ${w.py}。`,
      })
    }
    return shuffle(qs)
  }
}

interface PoemDef { title: string; author: string; line: string; next: string }

/** 古诗接龙：从 start 起循环取 8 条，保证每周 8 题 */
function wPoems(pool: PoemDef[], start: number) {
  return (): Question[] => {
    const n = pool.length
    const slice = Array.from({ length: Math.min(8, n) }, (_, k) => pool[(start + k) % n])
    return shuffle(slice).map((p) => {
      const others = shuffle(pool.filter((x) => x.next !== p.next)).map((x) => x.next)
      return {
        id: qid(), prompt: `《${p.title}》 ${p.author}，请接下一句`, big: p.line,
        speak: p.line, speakLang: 'zh-CN' as const,
        options: cOpts(p.next, others), answer: p.next,
        explain: `《${p.title}》${p.author}：${p.line}，${p.next}。`,
      }
    })
  }
}

function wPoemTitle(pool: PoemDef[]) {
  return (): Question[] =>
    shuffle(pool).slice(0, 8).map((p) => {
      const others = shuffle(pool.filter((x) => x.title !== p.title)).map((x) => `《${x.title}》`)
      return {
        id: qid(), prompt: `「${p.line}，${p.next}」出自哪首诗？`, big: p.line,
        speak: p.line, speakLang: 'zh-CN' as const,
        options: cOpts(`《${p.title}》`, others), answer: `《${p.title}》`,
        explain: `这是${p.author}的《${p.title}》。`,
      }
    })
}

interface IdiomDef { idiom: string; meaning: string }

function wIdioms(pool: IdiomDef[], a?: number, b?: number) {
  return (): Question[] => {
    const slice = pool.slice(a ?? 0, b ?? pool.length)
    return shuffle(slice).map((i) => {
      const others = shuffle(pool.filter((x) => x.meaning !== i.meaning)).map((x) => x.meaning)
      return {
        id: qid(), prompt: `成语「${i.idiom}」的意思是？`, big: i.idiom,
        speak: i.idiom, speakLang: 'zh-CN' as const,
        options: cOpts(i.meaning, others), answer: i.meaning,
        explain: `「${i.idiom}」：${i.meaning}。`,
      }
    })
  }
}

interface ReadingDef { title: string; text: string; question: string; answer: string; wrong: string[] }

function wReadings(pool: ReadingDef[]) {
  return (): Question[] =>
    shuffle(pool).slice(0, Math.min(4, pool.length)).map((r) => ({
      id: qid(), prompt: `读短文《${r.title}》：${r.question}`,
      big: r.text,
      speak: r.text, speakLang: 'zh-CN' as const,
      options: cOpts(r.answer, r.wrong), answer: r.answer,
      explain: `短文里说：${r.text}`,
    }))
}

/* ---------- 新增识字池 ---------- */

const G1_EXTRA: [string, string][] = [
  ['大', 'dà'], ['小', 'xiǎo'], ['上', 'shàng'], ['下', 'xià'], ['中', 'zhōng'],
  ['土', 'tǔ'], ['木', 'mù'], ['禾', 'hé'], ['石', 'shí'], ['田', 'tián'],
  ['虫', 'chóng'], ['云', 'yún'], ['风', 'fēng'], ['电', 'diàn'], ['飞', 'fēi'],
  ['鸟', 'niǎo'], ['鱼', 'yú'],
]

const G3_EXTRA: [string, string][] = [
  ['晨', 'chén'], ['读', 'dú'], ['静', 'jìng'], ['雀', 'què'], ['假', 'jiǎ'], ['装', 'zhuāng'],
  ['荒', 'huāng'], ['笛', 'dí'], ['舞', 'wǔ'], ['狂', 'kuáng'], ['猜', 'cāi'], ['扬', 'yáng'],
]

const CHARS_G4: [string, string][] = [
  ['暮', 'mù'], ['吟', 'yín'], ['题', 'tí'], ['侧', 'cè'], ['峰', 'fēng'], ['庐', 'lú'], ['缘', 'yuán'], ['降', 'xiáng'],
  ['逊', 'xùn'], ['输', 'shū'], ['塞', 'sài'], ['秦', 'qín'], ['征', 'zhēng'], ['催', 'cuī'], ['醉', 'zuì'], ['杰', 'jié'],
  ['雄', 'xióng'], ['项', 'xiàng'], ['尝', 'cháng'], ['诸', 'zhū'], ['竞', 'jìng'], ['唯', 'wéi'], ['豹', 'bào'], ['派', 'pài'],
  ['娶', 'qǔ'], ['媳', 'xí'], ['淹', 'yān'], ['浮', 'fú'], ['旱', 'hàn'], ['徒', 'tú'], ['扔', 'rēng'], ['骗', 'piàn'],
]

const CHARS_G5: [string, string][] = [
  ['宜', 'yí'], ['鹤', 'hè'], ['嫌', 'xián'], ['朱', 'zhū'], ['嵌', 'qiàn'], ['框', 'kuàng'], ['哨', 'shào'], ['恩', 'ēn'],
  ['韵', 'yùn'], ['亩', 'mǔ'], ['播', 'bō'], ['浇', 'jiāo'], ['吩', 'fēn'], ['咐', 'fù'], ['亭', 'tíng'], ['矮', 'ǎi'],
  ['慕', 'mù'], ['兰', 'lán'], ['箩', 'luó'], ['婆', 'pó'], ['糕', 'gāo'], ['饼', 'bǐng'], ['浸', 'jìn'], ['缠', 'chán'],
  ['茶', 'chá'], ['捡', 'jiǎn'], ['杭', 'háng'], ['懂', 'dǒng'], ['稳', 'wěn'], ['悄', 'qiāo'], ['匣', 'xiá'], ['耽', 'dān'],
]

const CHARS_G6: [string, string][] = [
  ['涯', 'yá'], ['莺', 'yīng'], ['啼', 'tí'], ['郭', 'guō'], ['旗', 'qí'], ['楼', 'lóu'], ['烟', 'yān'], ['蒙', 'méng'],
  ['德', 'dé'], ['蝉', 'chán'], ['茅', 'máo'], ['店', 'diàn'], ['忽', 'hū'], ['鸣', 'míng'], ['稻', 'dào'], ['蛙', 'wā'],
  ['壁', 'bì'], ['苔', 'tái'], ['畦', 'qí'], ['栽', 'zāi'], ['闼', 'tà'], ['瓜', 'guā'], ['洲', 'zhōu'], ['隔', 'gé'],
  ['钟', 'zhōng'], ['京', 'jīng'], ['泊', 'bó'], ['烛', 'zhú'], ['眶', 'kuàng'], ['绵', 'mián'], ['涧', 'jiàn'], ['翠', 'cuì'],
]

/* ---------- 新增词语池 ---------- */

const WORDS_G1 = [
  { word: '爸爸', py: 'bà ba' }, { word: '妈妈', py: 'mā ma' }, { word: '爷爷', py: 'yé ye' },
  { word: '奶奶', py: 'nǎi nai' }, { word: '太阳', py: 'tài yáng' }, { word: '月亮', py: 'yuè liang' },
  { word: '星星', py: 'xīng xing' }, { word: '白云', py: 'bái yún' }, { word: '小鸟', py: 'xiǎo niǎo' },
  { word: '小鱼', py: 'xiǎo yú' }, { word: '红花', py: 'hóng huā' }, { word: '绿草', py: 'lǜ cǎo' },
]

const WORDS_G3 = [
  { word: '早晨', py: 'zǎo chen' }, { word: '国旗', py: 'guó qí' }, { word: '敬礼', py: 'jìng lǐ' },
  { word: '安静', py: 'ān jìng' }, { word: '穿戴', py: 'chuān dài' }, { word: '打扮', py: 'dǎ ban' },
  { word: '朗读', py: 'lǎng dú' }, { word: '荒野', py: 'huāng yě' }, { word: '跳舞', py: 'tiào wǔ' },
  { word: '狂欢', py: 'kuáng huān' }, { word: '能够', py: 'néng gòu' }, { word: '双臂', py: 'shuāng bì' },
]

const WORDS_G4 = [
  { word: '据说', py: 'jù shuō' }, { word: '逐渐', py: 'zhú jiàn' }, { word: '顿时', py: 'dùn shí' },
  { word: '犹如', py: 'yóu rú' }, { word: '霎时', py: 'shà shí' }, { word: '余波', py: 'yú bō' },
  { word: '柔和', py: 'róu hé' }, { word: '新鲜', py: 'xīn xian' }, { word: '修补', py: 'xiū bǔ' },
  { word: '庄稼', py: 'zhuāng jia' }, { word: '风俗', py: 'fēng sú' }, { word: '跳跃', py: 'tiào yuè' },
]

const WORDS_G5 = [
  { word: '精巧', py: 'jīng qiǎo' }, { word: '配合', py: 'pèi hé' }, { word: '身段', py: 'shēn duàn' },
  { word: '适宜', py: 'shì yí' }, { word: '白鹤', py: 'bái hè' }, { word: '生硬', py: 'shēng yìng' },
  { word: '寻常', py: 'xún cháng' }, { word: '忘却', py: 'wàng què' }, { word: '孤独', py: 'gū dú' },
  { word: '悠然', py: 'yōu rán' }, { word: '黄昏', py: 'huáng hūn' }, { word: '韵味', py: 'yùn wèi' },
]

const WORDS_G6 = [
  { word: '绿毯', py: 'lǜ tǎn' }, { word: '柔美', py: 'róu měi' }, { word: '惊叹', py: 'jīng tàn' },
  { word: '回味', py: 'huí wèi' }, { word: '洒脱', py: 'sǎ tuō' }, { word: '迂回', py: 'yū huí' },
  { word: '衣裳', py: 'yī shang' }, { word: '彩虹', py: 'cǎi hóng' }, { word: '马蹄', py: 'mǎ tí' },
  { word: '礼貌', py: 'lǐ mào' }, { word: '拘束', py: 'jū shù' }, { word: '羞涩', py: 'xiū sè' },
]

/* ---------- 新增古诗池 ---------- */

const POEMS_G2: PoemDef[] = [
  { title: '画', author: '佚名', line: '远看山有色', next: '近听水无声' },
  { title: '画', author: '佚名', line: '春去花还在', next: '人来鸟不惊' },
  { title: '悯农', author: '李绅', line: '锄禾日当午', next: '汗滴禾下土' },
  { title: '悯农', author: '李绅', line: '谁知盘中餐', next: '粒粒皆辛苦' },
  { title: '古朗月行', author: '李白', line: '小时不识月', next: '呼作白玉盘' },
  { title: '古朗月行', author: '李白', line: '又疑瑶台镜', next: '飞在青云端' },
  { title: '登鹳雀楼', author: '王之涣', line: '白日依山尽', next: '黄河入海流' },
  { title: '登鹳雀楼', author: '王之涣', line: '欲穷千里目', next: '更上一层楼' },
  { title: '夜宿山寺', author: '李白', line: '危楼高百尺', next: '手可摘星辰' },
  { title: '夜宿山寺', author: '李白', line: '不敢高声语', next: '恐惊天上人' },
  { title: '敕勒歌', author: '北朝民歌', line: '天苍苍', next: '野茫茫' },
  { title: '敕勒歌', author: '北朝民歌', line: '天似穹庐', next: '笼盖四野' },
]

const POEMS_G3: PoemDef[] = [
  { title: '所见', author: '袁枚', line: '牧童骑黄牛', next: '歌声振林樾' },
  { title: '所见', author: '袁枚', line: '意欲捕鸣蝉', next: '忽然闭口立' },
  { title: '小儿垂钓', author: '胡令能', line: '蓬头稚子学垂纶', next: '侧坐莓苔草映身' },
  { title: '小儿垂钓', author: '胡令能', line: '路人借问遥招手', next: '怕得鱼惊不应人' },
  { title: '蜂', author: '罗隐', line: '不论平地与山尖', next: '无限风光尽被占' },
  { title: '蜂', author: '罗隐', line: '采得百花成蜜后', next: '为谁辛苦为谁甜' },
  { title: '绝句', author: '杜甫', line: '两个黄鹂鸣翠柳', next: '一行白鹭上青天' },
  { title: '绝句', author: '杜甫', line: '窗含西岭千秋雪', next: '门泊东吴万里船' },
  { title: '惠崇春江晚景', author: '苏轼', line: '竹外桃花三两枝', next: '春江水暖鸭先知' },
  { title: '惠崇春江晚景', author: '苏轼', line: '蒌蒿满地芦芽短', next: '正是河豚欲上时' },
  { title: '忆江南', author: '白居易', line: '日出江花红胜火', next: '春来江水绿如蓝' },
  { title: '忆江南', author: '白居易', line: '江南好', next: '风景旧曾谙' },
]

const POEMS_G4: PoemDef[] = [
  { title: '鹿柴', author: '王维', line: '空山不见人', next: '但闻人语响' },
  { title: '鹿柴', author: '王维', line: '返景入深林', next: '复照青苔上' },
  { title: '暮江吟', author: '白居易', line: '一道残阳铺水中', next: '半江瑟瑟半江红' },
  { title: '暮江吟', author: '白居易', line: '可怜九月初三夜', next: '露似真珠月似弓' },
  { title: '题西林壁', author: '苏轼', line: '横看成岭侧成峰', next: '远近高低各不同' },
  { title: '题西林壁', author: '苏轼', line: '不识庐山真面目', next: '只缘身在此山中' },
  { title: '雪梅', author: '卢钺', line: '梅雪争春未肯降', next: '骚人阁笔费评章' },
  { title: '雪梅', author: '卢钺', line: '梅须逊雪三分白', next: '雪却输梅一段香' },
  { title: '出塞', author: '王昌龄', line: '秦时明月汉时关', next: '万里长征人未还' },
  { title: '出塞', author: '王昌龄', line: '但使龙城飞将在', next: '不教胡马度阴山' },
  { title: '凉州词', author: '王翰', line: '葡萄美酒夜光杯', next: '欲饮琵琶马上催' },
  { title: '凉州词', author: '王翰', line: '醉卧沙场君莫笑', next: '古来征战几人回' },
]

/* ---------- 新增成语池 ---------- */

const IDIOMS_G2: IdiomDef[] = [
  { idiom: '坐井观天', meaning: '眼界狭小' },
  { idiom: '春暖花开', meaning: '春景美好' },
  { idiom: '百花争艳', meaning: '花儿竞相开放' },
  { idiom: '自言自语', meaning: '自己对自己说话' },
  { idiom: '各种各样', meaning: '种类很多' },
  { idiom: '无边无际', meaning: '非常广阔' },
  { idiom: '争先恐后', meaning: '争着向前，唯恐落后' },
  { idiom: '狼吞虎咽', meaning: '吃得又急又多' },
  { idiom: '惊弓之鸟', meaning: '受过惊吓容易害怕' },
  { idiom: '胆小如鼠', meaning: '非常胆小' },
]

const IDIOMS_G4: IdiomDef[] = [
  { idiom: '人声鼎沸', meaning: '声音喧闹' },
  { idiom: '鸦雀无声', meaning: '非常安静' },
  { idiom: '震耳欲聋', meaning: '声音极大' },
  { idiom: '低声细语', meaning: '小声说话' },
  { idiom: '腾云驾雾', meaning: '传说神仙飞行' },
  { idiom: '神机妙算', meaning: '善于料事用计' },
  { idiom: '三头六臂', meaning: '本领很大' },
  { idiom: '眼观六路', meaning: '观察全面' },
  { idiom: '耳听八方', meaning: '消息灵通' },
  { idiom: '上天入地', meaning: '无所不能' },
]

/* ---------- 新增阅读池 ---------- */

const READINGS_MID: ReadingDef[] = [
  { title: '司马光', text: '有一次，司马光跟小伙伴们在院子里玩。有个小孩爬到缸上，一不小心掉进了大水缸。别的孩子都吓跑了，司马光却拿起一块石头，使劲砸缸。水流出来了，小孩得救了。', question: '司马光用什么办法救了小伙伴？', answer: '用石头砸缸', wrong: ['用手拉他', '喊大人来', '跳进缸里'] },
  { title: '曹冲称象', text: '曹操得到一头大象，想知道它有多重。曹冲说：把大象赶到船上，在船舷上做个记号，再把大象赶下来，往船上装石头，装到同样的记号处，称一称石头就知道大象有多重了。', question: '曹冲用什么办法称出大象的重量？', answer: '用石头代替大象来称', wrong: ['用大秤直接称', '把大象切开称', '凭眼睛估算'] },
  { title: '小蝌蚪找妈妈', text: '小蝌蚪们游啊游，先遇到了鲤鱼阿姨，又遇到了乌龟，最后在荷叶上找到了青蛙妈妈。这时他们已经长出了四条腿，尾巴也不见了。', question: '小蝌蚪的妈妈是谁？', answer: '青蛙', wrong: ['鲤鱼', '乌龟', '鸭子'] },
  { title: '植物妈妈有办法', text: '蒲公英妈妈准备了降落伞，风一吹，孩子们就纷纷出发。苍耳妈妈给孩子穿上带刺的铠甲，挂住动物的皮毛去远方。豌豆妈妈让豆荚在太阳下炸开，孩子们蹦着跳着离开妈妈。', question: '苍耳靠什么去远方？', answer: '挂住动物的皮毛', wrong: ['靠风吹', '豆荚炸开', '顺水漂流'] },
]

const READINGS_HIGH: ReadingDef[] = [
  { title: '少年闰土', text: '深蓝的天空中挂着一轮金黄的圆月，海边的沙地上种着一望无际的西瓜。少年闰土项带银圈，手捏一柄钢叉，向一匹猹尽力地刺去。', question: '闰土用什么刺猹？', answer: '钢叉', wrong: ['木棍', '锄头', '弓箭'] },
  { title: '草原', text: '这次，我看到了草原。那里的天比别处的更可爱，空气是那么清鲜，天空是那么明朗。羊群一会儿上了小丘，一会儿又下来，像给无边的绿毯绣上了白色的大花。', question: '羊群像什么？', answer: '绿毯上的白色大花', wrong: ['天上的白云', '地上的石头', '移动的雪山'] },
  { title: '梅花魂', text: '外祖父教我读诗词，每当读到思乡的句子，常会落下眼泪。他告诉我，梅花愈是寒冷，愈是风欺雪压，花开得愈精神。我们中华民族出了许多有气节的人物，就像这梅花一样。', question: '外祖父赞美梅花什么？', answer: '愈冷愈有精神的品格', wrong: ['颜色鲜艳', '香气浓郁', '花期很长'] },
  { title: '金色的鱼钩', text: '长征路上，老班长把缝衣针弯成鱼钩，钓鱼给病号吃，自己却只吃草根和我们吃剩的鱼骨头。最后老班长牺牲了，我们把鱼钩珍藏起来，让它永远闪着金色的光。', question: '老班长自己吃什么？', answer: '草根和剩下的鱼骨头', wrong: ['新鲜的鱼', '干粮', '热汤'] },
]

/* ---------- 组装 ---------- */

type WeekDef = [string, string, string, () => Question[]]

function buildPacks(level: 1 | 2 | 3 | 4 | 5 | 6, defs: WeekDef[]): Pack[] {
  return defs.map(([t, d, b, gen], i) => ({
    id: `wc-g${level}s${i < 20 ? 1 : 2}w${String((i % 20) + 1).padStart(2, '0')}`,
    subject: 'chinese' as const,
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

interface GradeCfg {
  chars: [string, string][]
  words: { word: string; py: string }[]
  poems: PoemDef[]
  idioms?: IdiomDef[]
  readings: ReadingDef[]
  /** 特色题：低年级的词语常识/搭配/看图写话等 */
  specials: { gen: () => Question[]; title: string; badge: string }[]
}

function zhGrade(_level: 1 | 2 | 3 | 4 | 5 | 6, cfg: GradeCfg): WeekDef[] {
  const cn = ['一', '二', '三', '四', '五', '六', '七', '八']
  const cstep = Math.ceil(cfg.chars.length / 8)
  const wstep = Math.ceil(cfg.words.length / 6)
  const pstep = Math.ceil(cfg.poems.length / 8)
  const charWeeks: WeekDef[] = Array.from({ length: 8 }, (_, i) => [
    `识字乐园·${cn[i]}`, `本周新字 ${cfg.chars.slice(i * cstep, (i + 1) * cstep).map((c) => c[0]).join('、')}`,
    '🀄', wChars(cfg.chars, i * cstep, (i + 1) * cstep),
  ])
  const poemWeeks: WeekDef[] = Array.from({ length: 8 }, (_, i) => [
    `古诗接龙·${cn[i]}`, '跟着诗人接下一句', '📜',
    wPoems(cfg.poems, (i * pstep) % cfg.poems.length),
  ])
  const wordWeeks: WeekDef[] = Array.from({ length: 6 }, (_, i) => [
    `词语拼音·${cn[i]}`, `本周词语 ${cfg.words.slice(i * wstep, (i + 1) * wstep).map((w) => w.word).join('、')}`,
    '📝', wWords(cfg.words, i * wstep, (i + 1) * wstep),
  ])
  const sp = cfg.specials
  const idiomGen = cfg.idioms ? wIdioms(cfg.idioms) : sp[0].gen
  const idiomTitle = cfg.idioms ? '成语乐园' : sp[0].title
  const idiomBadge = cfg.idioms ? '🐉' : sp[0].badge

  return [
    // ---- 上学期 ----
    ...charWeeks,
    ['拼音总复习', '学过的字再来认一认', '🎯', wChars(cfg.chars, 0, cfg.chars.length, 0)],
    ['期中复习·上', '半学期字词大复习', '🏆', mix(wChars(cfg.chars, 0, cfg.chars.length, 0), sp[0].gen)],
    ...poemWeeks.slice(0, 4),
    ['古诗猜猜看', '这句诗出自哪一首', '🏮', wPoemTitle(cfg.poems)],
    sp.length > 1 ? [sp[1].title, '语言运用小练习', sp[1].badge, sp[1].gen] as WeekDef : [idiomTitle, '成语的意思', idiomBadge, idiomGen] as WeekDef,
    ['阅读理解·上', '读短文选答案', '📖', wReadings(cfg.readings)],
    [idiomTitle, '词语积累运用', idiomBadge, idiomGen],
    ['期末复习·上一', '字词古诗综合练', '🏆', mix(wChars(cfg.chars, 0, cfg.chars.length, 0), wPoems(cfg.poems, 0))],
    ['期末复习·上二', '综合大挑战', '🏆', mix(wPoems(cfg.poems, 0), idiomGen, sp[0].gen)],
    // ---- 下学期 ----
    ...wordWeeks,
    ['字音字词复习', '生字生词再过一遍', '🎯', mix(wChars(cfg.chars, 0, cfg.chars.length, 0), wWords(cfg.words, 0, cfg.words.length, 0))],
    ...poemWeeks.slice(4, 8),
    ['期中复习·下', '半学期大复习', '🏆', mix(wWords(cfg.words, 0, cfg.words.length, 0), wPoems(cfg.poems, 0))],
    [idiomTitle + '·一', '词语积累', idiomBadge, idiomGen],
    [idiomTitle + '·二', '词语运用', idiomBadge, idiomGen],
    ['阅读理解·下一', '读短文选答案', '📖', wReadings(cfg.readings)],
    ['阅读理解·下二', '再读一篇试试', '📖', wReadings(cfg.readings)],
    ['阅读理解·下三', '阅读小达人', '📖', wReadings(cfg.readings)],
    sp.length > 2 ? [sp[2].title, '表达小练习', sp[2].badge, sp[2].gen] as WeekDef : [sp[0].title, '语言运用练习', sp[0].badge, sp[0].gen] as WeekDef,
    ['期末复习·下一', '综合挑战第一场', '🏆', mix(wWords(cfg.words, 0, cfg.words.length, 0), wPoems(cfg.poems, 0), idiomGen)],
    ['期末复习·下二', '综合挑战第二场', '🏆', mix(wChars(cfg.chars, 0, cfg.chars.length, 0), wReadings(cfg.readings), sp[0].gen)],
  ]
}

/* ---------- 各年级配置 ---------- */

const g1Poems: PoemDef[] = POEMS.map((p) => ({ title: p.title, author: p.author, line: p.line, next: p.next }))
const g5Poems: PoemDef[] = G5_POEMS.map((p) => ({ title: p.title, author: p.author, line: p.line, next: p.next }))
const g6Poems: PoemDef[] = G6_POEMS.map((p) => ({ title: p.title, author: p.author, line: p.line, next: p.next }))

const genPoemTitleG1 = (): Question[] =>
  shuffle(POEM_TITLE).slice(0, 8).map((p) => {
    const others = shuffle(POEM_TITLE.filter((x) => x.title !== p.title)).map((x) => `《${x.title}》`)
    return {
      id: qid(), prompt: `「${p.first}」是哪首诗的开头？`, big: p.first,
      speak: p.first, speakLang: 'zh-CN' as const,
      options: cOpts(`《${p.title}》`, others), answer: `《${p.title}》`,
      explain: `这是${p.author}的《${p.title}》。`,
    }
  })

const genMatch = (): Question[] =>
  shuffle(MATCHES).slice(0, 10).map((m) => ({
    id: qid(), prompt: `「${m.left}」和哪个词搭配最合适？`, big: m.left,
    speak: m.left, speakLang: 'zh-CN' as const,
    options: cOpts(m.right, m.wrong), answer: m.right,
    explain: `「${m.left}${m.right}」搭配最合适。`,
  }))

const genPicWrite = (): Question[] =>
  shuffle(PIC_WRITE).slice(0, 8).map((p) => ({
    id: qid(), prompt: p.scene, big: p.emoji,
    options: cOpts(p.good, p.wrong), answer: p.good,
    explain: `好句子：${p.good}`,
  }))

const genMakeSent = (): Question[] =>
  shuffle(MAKE_SENT).slice(0, 8).map((m) => ({
    id: qid(), prompt: `用「${m.word}」选一个通顺的句子`, big: m.word,
    speak: m.word, speakLang: 'zh-CN' as const,
    options: cOpts(m.good, m.wrong), answer: m.good,
    explain: `好句子：${m.good}`,
  }))

const genG4Ant = (): Question[] =>
  shuffle(G4_ANTONYMS).slice(0, 10).map(([w, ant, wrong]) => ({
    id: qid(), prompt: `「${w}」的反义词是？`, big: w,
    speak: w, speakLang: 'zh-CN' as const,
    options: cOpts(ant, wrong), answer: ant,
    explain: `「${w}」的反义词是「${ant}」。`,
  }))

const genG4Syn = (): Question[] =>
  shuffle(G4_SYNONYMS).slice(0, 10).map(([w, syn, wrong]) => ({
    id: qid(), prompt: `「${w}」的近义词是？`, big: w,
    speak: w, speakLang: 'zh-CN' as const,
    options: cOpts(syn, wrong), answer: syn,
    explain: `「${w}」的近义词是「${syn}」。`,
  }))

const G1C: WeekDef[] = zhGrade(1, {
  chars: [...PY_CHARS, ...G1_EXTRA],
  words: WORDS_G1,
  poems: g1Poems,
  readings: READINGS,
  specials: [
    { gen: genChineseSense, title: '词语小达人', badge: '🌈' },
    { gen: genMakeSent, title: '组词造句', badge: '✏️' },
    { gen: genPicWrite, title: '看图写话', badge: '🖼️' },
  ],
})

const G2C: WeekDef[] = zhGrade(2, {
  chars: [...CHARS_2.map(([c, p]) => [c, p] as [string, string]), ...CHARS_G2.map(([c, p]) => [c, p] as [string, string])],
  words: G2_WORDS.map((w) => ({ word: w.word, py: w.py })),
  poems: POEMS_G2,
  idioms: IDIOMS_G2,
  readings: READINGS,
  specials: [
    { gen: genChineseWords, title: '识字乐园', badge: '🌳' },
    { gen: genMatch, title: '词语搭配', badge: '🔗' },
    { gen: genPicWrite, title: '看图写话', badge: '🖼️' },
  ],
})

const G3C: WeekDef[] = zhGrade(3, {
  chars: [...CHARS_G3.map(([c, p]) => [c, p] as [string, string]), ...G3_EXTRA],
  words: WORDS_G3,
  poems: POEMS_G3,
  idioms: G3_IDIOMS.map((i) => ({ idiom: i.idiom, meaning: i.meaning })),
  readings: READINGS_MID,
  specials: [
    { gen: genShengYun, title: '声母韵母复习', badge: '🎯' },
    { gen: genMakeSent, title: '组词造句', badge: '✏️' },
  ],
})

const G4C: WeekDef[] = zhGrade(4, {
  chars: CHARS_G4,
  words: WORDS_G4,
  poems: POEMS_G4,
  idioms: IDIOMS_G4,
  readings: READINGS_MID,
  specials: [
    { gen: genG4Ant, title: '反义词', badge: '↔️' },
    { gen: genG4Syn, title: '近义词', badge: '≈' },
  ],
})

const G5C: WeekDef[] = zhGrade(5, {
  chars: CHARS_G5,
  words: WORDS_G5,
  poems: g5Poems,
  idioms: G5_IDIOMS.map((i) => ({ idiom: i.idiom, meaning: i.meaning })),
  readings: READINGS_HIGH,
  specials: [
    { gen: genG4Syn, title: '近义词复习', badge: '≈' },
    { gen: genG4Ant, title: '反义词复习', badge: '↔️' },
  ],
})

const G6C: WeekDef[] = zhGrade(6, {
  chars: CHARS_G6,
  words: WORDS_G6,
  poems: g6Poems,
  idioms: G6_IDIOMS.map((i) => ({ idiom: i.idiom, meaning: i.meaning })),
  readings: READINGS_HIGH,
  specials: [
    { gen: genG4Ant, title: '反义词复习', badge: '↔️' },
    { gen: genG4Syn, title: '近义词复习', badge: '≈' },
  ],
})

// 一年级古诗猜猜看用专门的 POEM_TITLE
G1C[14] = ['古诗猜猜看', '这句诗出自哪一首', '🏮', genPoemTitleG1]

export const CHINESE_WEEK_PACKS: Pack[] = [
  ...buildPacks(1, G1C),
  ...buildPacks(2, G2C),
  ...buildPacks(3, G3C),
  ...buildPacks(4, G4C),
  ...buildPacks(5, G5C),
  ...buildPacks(6, G6C),
]
