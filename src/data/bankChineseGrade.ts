import type { Question } from '@/types'

let seq = 0
const qid = () => `qcg${Date.now().toString(36)}-${seq++}`
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

/* ============ 二年级 ============ */

export const CHARS_G2: [string, string, string[]][] = [
  ['春', 'chūn', ['chōng', 'cūn', 'chún']], ['夏', 'xià', ['xiā', 'xiě', 'xiè']],
  ['秋', 'qiū', ['qiú', 'qiǔ', 'qiòu']], ['冬', 'dōng', ['dōng', 'dòng', 'dōn']],
  ['花', 'huā', ['huá', 'huà', 'hā']], ['草', 'cǎo', ['chǎo', 'cāo', 'cào']],
  ['树', 'shù', ['sù', 'shú', 'shǔ']], ['鸟', 'niǎo', ['niāo', 'niào', 'liǎo']],
  ['鱼', 'yú', ['yǔ', 'yū', 'yì']], ['虫', 'chóng', ['chōng', 'cóng', 'chòng']],
  ['云', 'yún', ['yūn', 'yǔn', 'yòng']], ['雨', 'yǔ', ['yū', 'yú', 'yù']],
  ['雪', 'xuě', ['xuè', 'xuē', 'xuàn']], ['风', 'fēng', ['fēn', 'fōng', 'fèng']],
  ['星', 'xīng', ['xīn', 'xìng', 'shīng']], ['河', 'hé', ['hè', 'há', 'hū']],
  ['湖', 'hú', ['hū', 'hǔ', 'hù']], ['海', 'hǎi', ['hāi', 'hái', 'hài']],
  ['桥', 'qiáo', ['qiāo', 'qiǎo', 'qiào']], ['路', 'lù', ['lǔ', 'lōu', 'lǜ']],
]

export function genG2Char(): Question[] {
  return shuffle(CHARS_G2).slice(0, 10).map(([char, py, wrong]) => ({
    id: qid(), prompt: '这个字的拼音是哪个？', big: char,
    speak: char, speakLang: 'zh-CN' as const,
    options: opts(py, wrong), answer: py,
    explain: `「${char}」读作 ${py}。`,
  }))
}

export const G2_WORDS: { word: string; py: string; wrong: string[] }[] = [
  { word: '朋友', py: 'péng you', wrong: ['péng yǒu', 'pén you', 'pèng you'] },
  { word: '老师', py: 'lǎo shī', wrong: ['lǎo sī', 'lāo shī', 'lǎo shí'] },
  { word: '学校', py: 'xué xiào', wrong: ['xué xiāo', 'xié xiào', 'xué xiào'] },
  { word: '眼睛', py: 'yǎn jing', wrong: ['yǎn jīng', 'yán jing', 'yǎn jìng'] },
  { word: '鼻子', py: 'bí zi', wrong: ['bī zi', 'bí zhǐ', 'pí zi'] },
  { word: '嘴巴', py: 'zuǐ ba', wrong: ['zuǐ bā', 'zhuǐ ba', 'zuì ba'] },
  { word: '耳朵', py: 'ěr duo', wrong: ['ěr duō', 'èr duo', 'ěr dō'] },
  { word: '头发', py: 'tóu fa', wrong: ['tóu fā', 'tóu fà', 'tōu fa'] },
  { word: '身体', py: 'shēn tǐ', wrong: ['shēn tí', 'sēn tǐ', 'shēng tǐ'] },
  { word: '手脚', py: 'shǒu jiǎo', wrong: ['shǒu jué', 'shōu jiǎo', 'shǒu jiāo'] },
]

export function genG2WordPy(): Question[] {
  return shuffle(G2_WORDS).slice(0, 10).map((w) => ({
    id: qid(), prompt: '这个词语的拼音是哪个？', big: w.word,
    speak: w.word, speakLang: 'zh-CN' as const,
    options: opts(w.py, w.wrong), answer: w.py,
    explain: `「${w.word}」读作 ${w.py}。`,
  }))
}

/* ============ 三年级 ============ */

export const CHARS_G3: [string, string, string[]][] = [
  ['餐', 'cān', ['chān', 'cāng', 'càn']], ['厅', 'tīng', ['tīn', 'tìng', 'dīng']],
  ['卧', 'wò', ['wō', 'wǒ', 'wù']], ['室', 'shì', ['sì', 'shí', 'shī']],
  ['厨', 'chú', ['cú', 'chū', 'chǔ']], ['房', 'fáng', ['fāng', 'fǎng', 'fàng']],
  ['卫', 'wèi', ['wéi', 'wěi', 'wēi']], ['浴', 'yù', ['yǔ', 'yú', 'yū']],
  ['客', 'kè', ['kě', 'kē', 'kā']], ['桌', 'zhuō', ['zhuó', 'zhuò', 'zuō']],
  ['椅', 'yǐ', ['yī', 'yí', 'yì']], ['灯', 'dēng', ['dēn', 'dèng', 'dēng']],
  ['电', 'diàn', ['diǎn', 'diān', 'diàng']], ['视', 'shì', ['sì', 'shí', 'shī']],
  ['机', 'jī', ['jí', 'jǐ', 'jì']], ['冰', 'bīng', ['bīn', 'bìng', 'pīng']],
  ['箱', 'xiāng', ['xiáng', 'xiǎng', 'xiàng']], ['洗', 'xǐ', ['xī', 'xí', 'xì']],
  ['衣', 'yī', ['yí', 'yǐ', 'yì']], ['被', 'bèi', ['bēi', 'béi', 'běi']],
]

export function genG3Char(): Question[] {
  return shuffle(CHARS_G3).slice(0, 10).map(([char, py, wrong]) => ({
    id: qid(), prompt: '这个字的拼音是哪个？', big: char,
    speak: char, speakLang: 'zh-CN' as const,
    options: opts(py, wrong), answer: py,
    explain: `「${char}」读作 ${py}。`,
  }))
}

export const G3_IDIOMS: { idiom: string; meaning: string; wrong: string[] }[] = [
  { idiom: '一心一意', meaning: '心思专一', wrong: ['三心二意', '粗心大意', '马马虎虎'] },
  { idiom: '三心二意', meaning: '犹豫不决', wrong: ['一心一意', '专心致志', '全神贯注'] },
  { idiom: '五颜六色', meaning: '色彩繁多', wrong: ['单调乏味', '漆黑一片', '灰蒙蒙'] },
  { idiom: '七上八下', meaning: '心里慌乱', wrong: ['镇定自若', '心平气和', '从容不迫'] },
  { idiom: '九牛一毛', meaning: '微不足道', wrong: ['举足轻重', '至关重要', '价值连城'] },
  { idiom: '十全十美', meaning: '完美无缺', wrong: ['美中不足', '白璧微瑕', '漏洞百出'] },
  { idiom: '画蛇添足', meaning: '多此一举', wrong: ['恰到好处', '画龙点睛', '锦上添花'] },
  { idiom: '守株待兔', meaning: '不劳而获', wrong: ['勤劳致富', '自食其力', '奋发图强'] },
  { idiom: '亡羊补牢', meaning: '及时补救', wrong: ['为时已晚', '悔之晚矣', '无济于事'] },
  { idiom: '拔苗助长', meaning: '急于求成', wrong: ['循序渐进', '稳扎稳打', '水到渠成'] },
]

export function genG3Idiom(): Question[] {
  return shuffle(G3_IDIOMS).slice(0, 8).map((i) => ({
    id: qid(), prompt: `成语「${i.idiom}」的意思是？`, big: i.idiom,
    speak: i.idiom, speakLang: 'zh-CN' as const,
    options: opts(i.meaning, i.wrong), answer: i.meaning,
    explain: `「${i.idiom}」：${i.meaning}。`,
  }))
}

/* ============ 四年级 ============ */

export const G4_ANTONYMS: [string, string, string[]][] = [
  ['认真', '马虎', ['细心', '仔细', '专心']],
  ['谦虚', '骄傲', ['虚心', '谦逊', '低调']],
  ['勤劳', '懒惰', ['勤奋', '努力', '刻苦']],
  ['勇敢', '胆小', ['英勇', '无畏', '大胆']],
  ['诚实', '虚伪', ['老实', '真诚', '坦率']],
  ['节约', '浪费', ['节省', '节俭', '俭省']],
  ['热情', '冷淡', ['热心', '热忱', '热烈']],
  ['坚强', '软弱', ['顽强', '刚毅', '坚定']],
  ['聪明', '愚笨', ['机智', '伶俐', '聪慧']],
  ['宽阔', '狭窄', ['宽广', '辽阔', '广阔']],
]

export function genG4Antonym(): Question[] {
  return shuffle(G4_ANTONYMS).slice(0, 10).map(([word, ant, wrong]) => ({
    id: qid(), prompt: `「${word}」的反义词是？`, big: word,
    speak: word, speakLang: 'zh-CN' as const,
    options: opts(ant, wrong), answer: ant,
    explain: `「${word}」的反义词是「${ant}」。`,
  }))
}

export const G4_SYNONYMS: [string, string, string[]][] = [
  ['美丽', '漂亮', ['丑陋', '难看', '吓人']],
  ['高兴', '开心', ['难过', '伤心', '生气']],
  ['立刻', '马上', ['缓慢', '延迟', '拖拉']],
  ['经常', '常常', ['偶尔', '难得', '罕见']],
  ['突然', '忽然', ['渐渐', '慢慢', '逐渐']],
  ['著名', '有名', ['无名', '普通', '平凡']],
  ['宝贵', '珍贵', ['廉价', '便宜', '普通']],
  ['愤怒', '生气', ['高兴', '开心', '愉快']],
  ['寂静', '安静', ['吵闹', '喧闹', '嘈杂']],
  ['温暖', '暖和', ['寒冷', '冰凉', '阴冷']],
]

export function genG4Synonym(): Question[] {
  return shuffle(G4_SYNONYMS).slice(0, 10).map(([word, syn, wrong]) => ({
    id: qid(), prompt: `「${word}」的近义词是？`, big: word,
    speak: word, speakLang: 'zh-CN' as const,
    options: opts(syn, wrong), answer: syn,
    explain: `「${word}」的近义词是「${syn}」。`,
  }))
}

/* ============ 五年级 ============ */

export const G5_POEMS: { title: string; author: string; line: string; next: string; wrong: string[] }[] = [
  { title: '山行', author: '杜牧', line: '远上寒山石径斜', next: '白云生处有人家', wrong: ['停车坐爱枫林晚', '霜叶红于二月花', '春眠不觉晓'] },
  { title: '山行', author: '杜牧', line: '停车坐爱枫林晚', next: '霜叶红于二月花', wrong: ['远上寒山石径斜', '白云生处有人家', '处处闻啼鸟'] },
  { title: '赠刘景文', author: '苏轼', line: '荷尽已无擎雨盖', next: '菊残犹有傲霜枝', wrong: ['一年好景君须记', '最是橙黄橘绿时', '春眠不觉晓'] },
  { title: '赠刘景文', author: '苏轼', line: '一年好景君须记', next: '最是橙黄橘绿时', wrong: ['荷尽已无擎雨盖', '菊残犹有傲霜枝', '处处闻啼鸟'] },
  { title: '夜书所见', author: '叶绍翁', line: '萧萧梧叶送寒声', next: '江上秋风动客情', wrong: ['知有儿童挑促织', '夜深篱落一灯明', '春眠不觉晓'] },
  { title: '夜书所见', author: '叶绍翁', line: '知有儿童挑促织', next: '夜深篱落一灯明', wrong: ['萧萧梧叶送寒声', '江上秋风动客情', '处处闻啼鸟'] },
  { title: '望天门山', author: '李白', line: '天门中断楚江开', next: '碧水东流至此回', wrong: ['两岸青山相对出', '孤帆一片日边来', '春眠不觉晓'] },
  { title: '望天门山', author: '李白', line: '两岸青山相对出', next: '孤帆一片日边来', wrong: ['天门中断楚江开', '碧水东流至此回', '处处闻啼鸟'] },
  { title: '饮湖上初晴后雨', author: '苏轼', line: '水光潋滟晴方好', next: '山色空蒙雨亦奇', wrong: ['欲把西湖比西子', '淡妆浓抹总相宜', '春眠不觉晓'] },
  { title: '饮湖上初晴后雨', author: '苏轼', line: '欲把西湖比西子', next: '淡妆浓抹总相宜', wrong: ['水光潋滟晴方好', '山色空蒙雨亦奇', '处处闻啼鸟'] },
]

export function genG5Poem(): Question[] {
  return shuffle(G5_POEMS).slice(0, 8).map((p) => ({
    id: qid(), prompt: `《${p.title}》 ${p.author}，请接下一句`, big: p.line,
    speak: p.line, speakLang: 'zh-CN' as const,
    options: opts(p.next, p.wrong), answer: p.next,
    explain: `《${p.title}》${p.author}：${p.line}，${p.next}。`,
  }))
}

export const G5_IDIOMS: { idiom: string; meaning: string; wrong: string[] }[] = [
  { idiom: '掩耳盗铃', meaning: '自欺欺人', wrong: ['光明正大', '实事求是', '诚实守信'] },
  { idiom: '刻舟求剑', meaning: '拘泥不变', wrong: ['随机应变', '灵活变通', '与时俱进'] },
  { idiom: '井底之蛙', meaning: '见识短浅', wrong: ['见多识广', '博学多才', '学富五车'] },
  { idiom: '狐假虎威', meaning: '仗势欺人', wrong: ['自力更生', '独立自主', '真才实学'] },
  { idiom: '对牛弹琴', meaning: '白费口舌', wrong: ['言传身教', '循循善诱', '诲人不倦'] },
  { idiom: '胸有成竹', meaning: '早有打算', wrong: ['毫无准备', '临时抱佛脚', '手足无措'] },
  { idiom: '熟能生巧', meaning: '熟练生技巧', wrong: ['生搬硬套', '一窍不通', '笨手笨脚'] },
  { idiom: '闻鸡起舞', meaning: '勤奋刻苦', wrong: ['懒惰懈怠', '游手好闲', '好吃懒做'] },
]

export function genG5Idiom(): Question[] {
  return shuffle(G5_IDIOMS).slice(0, 8).map((i) => ({
    id: qid(), prompt: `成语「${i.idiom}」的意思是？`, big: i.idiom,
    speak: i.idiom, speakLang: 'zh-CN' as const,
    options: opts(i.meaning, i.wrong), answer: i.meaning,
    explain: `「${i.idiom}」：${i.meaning}。`,
  }))
}

/* ============ 六年级 ============ */

export const G6_POEMS: { title: string; author: string; line: string; next: string; wrong: string[] }[] = [
  { title: '泊船瓜洲', author: '王安石', line: '京口瓜洲一水间', next: '钟山只隔数重山', wrong: ['春风又绿江南岸', '明月何时照我还', '春眠不觉晓'] },
  { title: '泊船瓜洲', author: '王安石', line: '春风又绿江南岸', next: '明月何时照我还', wrong: ['京口瓜洲一水间', '钟山只隔数重山', '处处闻啼鸟'] },
  { title: '书湖阴先生壁', author: '王安石', line: '茅檐长扫净无苔', next: '花木成畦手自栽', wrong: ['一水护田将绿绕', '两山排闼送青来', '春眠不觉晓'] },
  { title: '书湖阴先生壁', author: '王安石', line: '一水护田将绿绕', next: '两山排闼送青来', wrong: ['茅檐长扫净无苔', '花木成畦手自栽', '处处闻啼鸟'] },
  { title: '六月二十七日望湖楼醉书', author: '苏轼', line: '黑云翻墨未遮山', next: '白雨跳珠乱入船', wrong: ['卷地风来忽吹散', '望湖楼下水如天', '春眠不觉晓'] },
  { title: '六月二十七日望湖楼醉书', author: '苏轼', line: '卷地风来忽吹散', next: '望湖楼下水如天', wrong: ['黑云翻墨未遮山', '白雨跳珠乱入船', '处处闻啼鸟'] },
  { title: '西江月·夜行黄沙道中', author: '辛弃疾', line: '明月别枝惊鹊', next: '清风半夜鸣蝉', wrong: ['稻花香里说丰年', '听取蛙声一片', '春眠不觉晓'] },
  { title: '西江月·夜行黄沙道中', author: '辛弃疾', line: '稻花香里说丰年', next: '听取蛙声一片', wrong: ['明月别枝惊鹊', '清风半夜鸣蝉', '处处闻啼鸟'] },
]

export function genG6Poem(): Question[] {
  return shuffle(G6_POEMS).slice(0, 8).map((p) => ({
    id: qid(), prompt: `《${p.title}》 ${p.author}，请接下一句`, big: p.line,
    speak: p.line, speakLang: 'zh-CN' as const,
    options: opts(p.next, p.wrong), answer: p.next,
    explain: `《${p.title}》${p.author}：${p.line}，${p.next}。`,
  }))
}

export const G6_IDIOMS: { idiom: string; meaning: string; wrong: string[] }[] = [
  { idiom: '锲而不舍', meaning: '坚持不懈', wrong: ['半途而废', '知难而退', '浅尝辄止'] },
  { idiom: '精益求精', meaning: '追求完美', wrong: ['得过且过', '敷衍了事', '粗制滥造'] },
  { idiom: '呕心沥血', meaning: '费尽心思', wrong: ['敷衍塞责', '马马虎虎', '草草了事'] },
  { idiom: '废寝忘食', meaning: '专心致志', wrong: ['好吃懒做', '游手好闲', '无所事事'] },
  { idiom: '一丝不苟', meaning: '认真细致', wrong: ['粗心大意', '马马虎虎', '敷衍了事'] },
  { idiom: '孜孜不倦', meaning: '勤奋不倦', wrong: ['懒惰懈怠', '不思进取', '得过且过'] },
  { idiom: '诲人不倦', meaning: '耐心教导', wrong: ['不耐烦', '敷衍了事', '置之不理'] },
  { idiom: '学而不厌', meaning: '好学不倦', wrong: ['厌学弃学', '不求上进', '一曝十寒'] },
]

export function genG6Idiom(): Question[] {
  return shuffle(G6_IDIOMS).slice(0, 8).map((i) => ({
    id: qid(), prompt: `成语「${i.idiom}」的意思是？`, big: i.idiom,
    speak: i.idiom, speakLang: 'zh-CN' as const,
    options: opts(i.meaning, i.wrong), answer: i.meaning,
    explain: `「${i.idiom}」：${i.meaning}。`,
  }))
}

/* ============ 阅读理解（全年级通用） ============ */

export const READINGS: { title: string; text: string; question: string; answer: string; wrong: string[] }[] = [
  { title: '小兔子', text: '小兔子有一双长长的耳朵，红红的眼睛，还有一条短尾巴。它最喜欢吃胡萝卜和青菜。', question: '小兔子最喜欢吃什么？', answer: '胡萝卜和青菜', wrong: ['苹果和香蕉', '鱼和肉', '面包和牛奶'] },
  { title: '春天', text: '春天来了，小草从土里钻出来，花儿开了，小鸟在树上唱歌。小朋友们在草地上放风筝。', question: '小朋友们在做什么？', answer: '放风筝', wrong: ['游泳', '堆雪人', '摘果子'] },
  { title: '小猫钓鱼', text: '小猫去河边钓鱼，一会儿捉蝴蝶，一会儿追蜻蜓，结果一条鱼也没钓到。', question: '小猫为什么没钓到鱼？', answer: '它不专心', wrong: ['鱼太少', '没有鱼竿', '天气不好'] },
  { title: '猴子捞月', text: '猴子看到井里有月亮，以为月亮掉进井里了，就倒挂在树上去捞，结果月亮还在天上。', question: '猴子们捞到月亮了吗？', answer: '没有', wrong: ['捞到了', '捞到一半', '捞到碎片'] },
]

export function genReading(): Question[] {
  return shuffle(READINGS).slice(0, 4).map((r) => ({
    id: qid(),
    prompt: `读短文《${r.title}》`,
    big: r.text,
    speak: r.text,
    speakLang: 'zh-CN' as const,
    options: opts(r.answer, r.wrong),
    answer: r.answer,
    explain: `短文里说：${r.text}`,
  }))
}
