import type { Question } from '@/types'

let seq = 0
const qid = () => `qc${Date.now().toString(36)}-${seq++}`
const rnd = (n: number) => Math.floor(Math.random() * n)
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
function opts(answer: string, pool: string[]): string[] {
  const set = new Set<string>([answer])
  for (const p of shuffle(pool)) {
    if (set.size >= 4) break
    if (p !== answer) set.add(p)
  }
  return shuffle([...set])
}

/* ============ 看图写话 ============ */

export const PIC_WRITE: { emoji: string; scene: string; good: string; wrong: string[] }[] = [
  { emoji: '🌧️', scene: '下雨了', good: '下雨了，小明打着伞去上学。', wrong: ['今天天气真好，阳光明媚。', '小明在公园里放风筝。', '我们一起去游泳吧。'] },
  { emoji: '🌞', scene: '晴天', good: '太阳公公出来了，天气真暖和。', wrong: ['天上下着大雨。', '月亮升起来了。', '外面在下雪。'] },
  { emoji: '🌙', scene: '夜晚', good: '天黑了，月亮和星星出来了。', wrong: ['太阳升起来了。', '中午的太阳真大。', '现在是下午三点。'] },
  { emoji: '🐱', scene: '小猫', good: '小猫在草地上追蝴蝶。', wrong: ['小狗在河里游泳。', '小鸟在天上飞。', '小鱼在水里游。'] },
  { emoji: '🐶', scene: '小狗', good: '小狗摇着尾巴跑过来了。', wrong: ['小猫在树上睡觉。', '小兔子在吃胡萝卜。', '小鸟在唱歌。'] },
  { emoji: '🌸', scene: '春天', good: '春天来了，花儿都开了。', wrong: ['秋天树叶黄了。', '冬天堆雪人。', '夏天吃西瓜。'] },
  { emoji: '🍂', scene: '秋天', good: '秋天到了，树叶变黄落下来了。', wrong: ['春天花儿开了。', '夏天荷花开了。', '冬天下雪了。'] },
  { emoji: '⛄', scene: '冬天', good: '下雪了，我们一起堆雪人。', wrong: ['春天来了。', '夏天好热。', '秋天落叶了。'] },
  { emoji: '🎂', scene: '生日', good: '今天是小红的生日，大家唱生日歌。', wrong: ['我们在上课。', '大家在跑步。', '明天要考试。'] },
  { emoji: '🏫', scene: '学校', good: '同学们在教室里认真听讲。', wrong: ['大家在操场踢球。', '我们在公园野餐。', '同学们在睡觉。'] },
]

export function genPicWrite(): Question[] {
  return shuffle(PIC_WRITE).slice(0, 8).map((p) => ({
    id: qid(),
    prompt: `看一看图片（${p.scene}），选出写得最好的一句`,
    visual: { kind: 'emoji', emoji: p.emoji },
    speak: p.scene,
    speakLang: 'zh-CN' as const,
    options: opts(p.good, p.wrong),
    answer: p.good,
    explain: '看图写话要写出图上有什么、在做什么，句子要完整。',
  }))
}

/* ============ 组词造句 ============ */

export const MAKE_SENT: { word: string; good: string; wrong: string[] }[] = [
  { word: '高兴', good: '今天妈妈带我去公园，我特别高兴。', wrong: ['我高兴地哭了。', '他高兴得生病了。', '我不高兴去上学。'] },
  { word: '认真', good: '上课要认真听讲。', wrong: ['我认真地玩玩具。', '他认真地看电视。', '我们认真地睡觉。'] },
  { word: '帮助', good: '同学摔倒了，我主动去帮助他。', wrong: ['我帮助同学打架。', '他帮助我迟到。', '我们帮助别人撒谎。'] },
  { word: '干净', good: '我把房间打扫得干干净净。', wrong: ['地上很干净，全是泥。', '他脏得很干净。', '我把垃圾扔得很干净。'] },
  { word: '快乐', good: '六一儿童节，我们都很快乐。', wrong: ['我快乐得哭了。', '他难过得很快乐。', '我们快乐得生气了。'] },
  { word: '认真', good: '小红认真地写作业。', wrong: ['小红认真地玩游戏。', '小红认真地睡觉。', '小红认真地看电视。'] },
  { word: '喜欢', good: '我喜欢看课外书。', wrong: ['我喜欢迟到。', '我喜欢撒谎。', '我喜欢打架。'] },
  { word: '爱护', good: '我们要爱护花草树木。', wrong: ['我们要爱护垃圾。', '我们要爱护打架。', '我们要爱护迟到。'] },
]

export function genMakeSent(): Question[] {
  return shuffle(MAKE_SENT).slice(0, 8).map((m) => ({
    id: qid(),
    prompt: `用「${m.word}」造句，选出最恰当的一句`,
    big: m.word,
    speak: m.word,
    speakLang: 'zh-CN' as const,
    options: opts(m.good, m.wrong),
    answer: m.good,
    explain: `「${m.word}」要放在合适的语境里，句子要通顺、积极向上。`,
  }))
}

/* ============ 古诗启蒙 ============ */

export const POEMS: { title: string; author: string; line: string; next: string; wrong: string[] }[] = [
  { title: '静夜思', author: '李白', line: '床前明月光', next: '疑是地上霜', wrong: ['疑是银河落九天', '低头思故乡', '春眠不觉晓'] },
  { title: '静夜思', author: '李白', line: '举头望明月', next: '低头思故乡', wrong: ['疑是地上霜', '春眠不觉晓', '白日依山尽'] },
  { title: '春晓', author: '孟浩然', line: '春眠不觉晓', next: '处处闻啼鸟', wrong: ['床前明月光', '白日依山尽', '锄禾日当午'] },
  { title: '春晓', author: '孟浩然', line: '夜来风雨声', next: '花落知多少', wrong: ['处处闻啼鸟', '春眠不觉晓', '低头思故乡'] },
  { title: '登鹳雀楼', author: '王之涣', line: '白日依山尽', next: '黄河入海流', wrong: ['床前明月光', '春眠不觉晓', '锄禾日当午'] },
  { title: '登鹳雀楼', author: '王之涣', line: '欲穷千里目', next: '更上一层楼', wrong: ['黄河入海流', '白日依山尽', '处处闻啼鸟'] },
  { title: '悯农', author: '李绅', line: '锄禾日当午', next: '汗滴禾下土', wrong: ['春眠不觉晓', '床前明月光', '白日依山尽'] },
  { title: '悯农', author: '李绅', line: '谁知盘中餐', next: '粒粒皆辛苦', wrong: ['汗滴禾下土', '锄禾日当午', '处处闻啼鸟'] },
  { title: '咏鹅', author: '骆宾王', line: '鹅，鹅，鹅', next: '曲项向天歌', wrong: ['白毛浮绿水', '红掌拨清波', '春眠不觉晓'] },
  { title: '咏鹅', author: '骆宾王', line: '白毛浮绿水', next: '红掌拨清波', wrong: ['曲项向天歌', '鹅鹅鹅', '处处闻啼鸟'] },
  { title: '画', author: '王维', line: '远看山有色', next: '近听水无声', wrong: ['春眠不觉晓', '床前明月光', '锄禾日当午'] },
  { title: '画', author: '王维', line: '春去花还在', next: '人来鸟不惊', wrong: ['近听水无声', '远看山有色', '处处闻啼鸟'] },
  { title: '草', author: '白居易', line: '离离原上草', next: '一岁一枯荣', wrong: ['野火烧不尽', '春风吹又生', '春眠不觉晓'] },
  { title: '草', author: '白居易', line: '野火烧不尽', next: '春风吹又生', wrong: ['一岁一枯荣', '离离原上草', '处处闻啼鸟'] },
  { title: '小池', author: '杨万里', line: '小荷才露尖尖角', next: '早有蜻蜓立上头', wrong: ['春眠不觉晓', '床前明月光', '锄禾日当午'] },
]

export function genPoemNext(): Question[] {
  return shuffle(POEMS).slice(0, 8).map((p) => ({
    id: qid(),
    prompt: `《${p.title}》 ${p.author}，请接下一句`,
    big: p.line,
    speak: p.line,
    speakLang: 'zh-CN' as const,
    options: opts(p.next, p.wrong),
    answer: p.next,
    explain: `《${p.title}》${p.author}：${p.line}，${p.next}。`,
  }))
}

export const POEM_TITLE: { title: string; author: string; first: string }[] = [
  { title: '静夜思', author: '李白', first: '床前明月光' },
  { title: '春晓', author: '孟浩然', first: '春眠不觉晓' },
  { title: '登鹳雀楼', author: '王之涣', first: '白日依山尽' },
  { title: '悯农', author: '李绅', first: '锄禾日当午' },
  { title: '咏鹅', author: '骆宾王', first: '鹅鹅鹅' },
  { title: '画', author: '王维', first: '远看山有色' },
  { title: '草', author: '白居易', first: '离离原上草' },
  { title: '小池', author: '杨万里', first: '小荷才露尖尖角' },
]

export function genPoemTitle(): Question[] {
  return shuffle(POEM_TITLE).slice(0, 8).map((p) => ({
    id: qid(),
    prompt: `「${p.first}」是下面哪首诗的开头？`,
    big: p.first,
    speak: p.first,
    speakLang: 'zh-CN' as const,
    options: opts(p.title, POEM_TITLE.filter((x) => x.title !== p.title).map((x) => x.title).slice(0, 3)),
    answer: p.title,
    explain: `「${p.first}」是《${p.title}》的开头，作者是${p.author}。`,
  }))
}

/* ============ 识字进阶（二年级） ============ */

export const CHARS_2: [string, string, string[]][] = [
  ['春', 'chūn', ['chōng', 'cūn', 'chún']],
  ['夏', 'xià', ['xiā', 'xiě', 'xiè']],
  ['秋', 'qiū', ['qiú', 'qiǔ', 'qiòu']],
  ['冬', 'dōng', ['dōng', 'dòng', 'dōn']],
  ['花', 'huā', ['huá', 'huà', 'hā']],
  ['草', 'cǎo', ['chǎo', 'cāo', 'cào']],
  ['树', 'shù', ['sù', 'shú', 'shǔ']],
  ['鸟', 'niǎo', ['niāo', 'niào', 'liǎo']],
  ['鱼', 'yú', ['yǔ', 'yū', 'yì']],
  ['虫', 'chóng', ['chōng', 'cóng', 'chòng']],
  ['云', 'yún', ['yūn', 'yǔn', 'yòng']],
  ['雨', 'yǔ', ['yū', 'yú', 'yù']],
  ['雪', 'xuě', ['xuè', 'xuē', 'xuàn']],
  ['风', 'fēng', ['fēn', 'fōng', 'fèng']],
  ['星', 'xīng', ['xīn', 'xìng', 'shīng']],
  ['河', 'hé', ['hè', 'há', 'hū']],
  ['湖', 'hú', ['hū', 'hǔ', 'hù']],
  ['海', 'hǎi', ['hāi', 'hái', 'hài']],
  ['桥', 'qiáo', ['qiāo', 'qiǎo', 'qiào']],
  ['路', 'lù', ['lǔ', 'lōu', 'lǜ']],
]

export function genChar2Pinyin(): Question[] {
  return shuffle(CHARS_2).slice(0, 10).map(([char, py, wrong]) => ({
    id: qid(),
    prompt: '这个字的拼音是哪个？',
    big: char,
    speak: char,
    speakLang: 'zh-CN' as const,
    options: opts(py, wrong),
    answer: py,
    explain: `「${char}」读作 ${py}。`,
  }))
}

/* ============ 词语搭配 ============ */

export const MATCHES: { left: string; right: string; wrong: string[] }[] = [
  { left: '温暖的', right: '阳光', wrong: ['寒冷', '冬天', '北风'] },
  { left: '寒冷的', right: '冬天', wrong: ['阳光', '温暖', '春天'] },
  { left: '碧绿的', right: '草地', wrong: ['天空', '大海', '沙漠'] },
  { left: '蔚蓝的', right: '天空', wrong: ['草地', '泥土', '森林'] },
  { left: '勤劳的', right: '蜜蜂', wrong: ['懒猫', '兔子', '乌龟'] },
  { left: '机灵的', right: '猴子', wrong: ['乌龟', '蜗牛', '大象'] },
  { left: '凶猛的', right: '老虎', wrong: ['兔子', '绵羊', '小鸡'] },
  { left: '可爱的', right: '小兔', wrong: ['老虎', '狮子', '鳄鱼'] },
  { left: '高高的', right: '山峰', wrong: ['草地', '池塘', '小路'] },
  { left: '清澈的', right: '湖水', wrong: ['墨水', '泥浆', '油漆'] },
]

export function genMatch(): Question[] {
  return shuffle(MATCHES).slice(0, 10).map((m) => ({
    id: qid(),
    prompt: `「${m.left}」后面应该接什么？`,
    big: m.left + '____',
    speak: m.left,
    speakLang: 'zh-CN' as const,
    options: opts(m.right, m.wrong),
    answer: m.right,
    explain: `「${m.left}${m.right}」搭配最恰当。`,
  }))
}
