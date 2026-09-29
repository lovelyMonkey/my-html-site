/**
 * 国际音标（IPA）48 个 + 常见连读短语。
 * 口型参数用于 SVG 侧面口腔图：
 *  - jaw: 下巴开合度 0(闭合) ~ 1(大张)
 *  - lipRound: 嘴唇圆唇度 0(扁平) ~ 1(很圆)
 *  - lipSmile: 嘴角微笑度 0(中性) ~ 1(咧嘴)
 *  - tongueHeight: 舌位高低 0(低) ~ 1(高)
 *  - tongueBack: 舌位前后 0(前) ~ 1(后)
 *  - tongueTip: 舌尖位置 'teeth'(抵上齿) | 'alveolar'(抵齿龈) | 'free'(自然) | 'between'(伸到齿间)
 *  - vocal: 是否振动声带（浊音/元音 true，清辅音 false）
 */

export interface Phoneme {
  /** 音标符号，如 /iː/ */
  symbol: string
  /** 分类标签 */
  category: '前元音' | '中元音' | '后元音' | '双元音' | '爆破音' | '摩擦音' | '破擦音' | '鼻音' | '舌侧音' | '半元音'
  /** 是否元音 */
  vowel: boolean
  jaw: number
  lipRound: number
  lipSmile: number
  tongueHeight: number
  tongueBack: number
  tongueTip: 'teeth' | 'alveolar' | 'free' | 'between'
  vocal: boolean
  /** 中文提示，告诉孩子怎么发音 */
  tip: string
  /** 例词（英文 + 中文 + 用于朗读的文本） */
  examples: { word: string; cn: string }[]
}

export const PHONEMES: Phoneme[] = [
  // ===== 单元音 · 前元音 =====
  { symbol: '/iː/', category: '前元音', vowel: true, jaw: 0.15, lipRound: 0, lipSmile: 0.9, tongueHeight: 1, tongueBack: 0, tongueTip: 'free', vocal: true, tip: '嘴角向两边咧开，像微笑，声音长长的', examples: [{ word: 'see', cn: '看见' }, { word: 'bee', cn: '蜜蜂' }, { word: 'tree', cn: '树' }] },
  { symbol: '/ɪ/', category: '前元音', vowel: true, jaw: 0.3, lipRound: 0, lipSmile: 0.5, tongueHeight: 0.85, tongueBack: 0.1, tongueTip: 'free', vocal: true, tip: '嘴巴微微张开，声音短促，像「诶」', examples: [{ word: 'big', cn: '大的' }, { word: 'pig', cn: '猪' }, { word: 'sit', cn: '坐' }] },
  { symbol: '/e/', category: '前元音', vowel: true, jaw: 0.45, lipRound: 0, lipSmile: 0.4, tongueHeight: 0.6, tongueBack: 0.15, tongueTip: 'free', vocal: true, tip: '嘴巴半开，像「哎」', examples: [{ word: 'bed', cn: '床' }, { word: 'red', cn: '红色' }, { word: 'pen', cn: '钢笔' }] },
  { symbol: '/æ/', category: '前元音', vowel: true, jaw: 0.8, lipRound: 0, lipSmile: 0.6, tongueHeight: 0.3, tongueBack: 0.1, tongueTip: 'free', vocal: true, tip: '嘴巴张大，嘴角向两边，像「爱」但嘴更扁', examples: [{ word: 'cat', cn: '猫' }, { word: 'bag', cn: '包' }, { word: 'apple', cn: '苹果' }] },

  // ===== 单元音 · 中元音 =====
  { symbol: '/ɜː/', category: '中元音', vowel: true, jaw: 0.35, lipRound: 0.1, lipSmile: 0, tongueHeight: 0.5, tongueBack: 0.5, tongueTip: 'free', vocal: true, tip: '嘴巴自然微张，声音长长的，像「饿」', examples: [{ word: 'bird', cn: '鸟' }, { word: 'girl', cn: '女孩' }, { word: 'nurse', cn: '护士' }] },
  { symbol: '/ə/', category: '中元音', vowel: true, jaw: 0.25, lipRound: 0, lipSmile: 0, tongueHeight: 0.5, tongueBack: 0.5, tongueTip: 'free', vocal: true, tip: '最放松的音，嘴巴自然微张，像轻轻的「呃」', examples: [{ word: 'about', cn: '关于' }, { word: 'banana', cn: '香蕉' }, { word: 'panda', cn: '熊猫' }] },

  // ===== 单元音 · 后元音 =====
  { symbol: '/ʌ/', category: '后元音', vowel: true, jaw: 0.5, lipRound: 0, lipSmile: 0, tongueHeight: 0.4, tongueBack: 0.6, tongueTip: 'free', vocal: true, tip: '嘴巴张开，声音短促，像「啊」但短', examples: [{ word: 'cup', cn: '杯子' }, { word: 'bus', cn: '公交车' }, { word: 'sun', cn: '太阳' }] },
  { symbol: '/ɑː/', category: '后元音', vowel: true, jaw: 0.9, lipRound: 0, lipSmile: 0, tongueHeight: 0.1, tongueBack: 0.8, tongueTip: 'free', vocal: true, tip: '嘴巴张得大大的，像看医生时说「啊——」', examples: [{ word: 'car', cn: '汽车' }, { word: 'star', cn: '星星' }, { word: 'father', cn: '爸爸' }] },
  { symbol: '/ɒ/', category: '后元音', vowel: true, jaw: 0.7, lipRound: 0.5, lipSmile: 0, tongueHeight: 0.15, tongueBack: 0.9, tongueTip: 'free', vocal: true, tip: '嘴巴张大，嘴唇稍微收圆，声音短', examples: [{ word: 'dog', cn: '狗' }, { word: 'hot', cn: '热' }, { word: 'box', cn: '盒子' }] },
  { symbol: '/ɔː/', category: '后元音', vowel: true, jaw: 0.55, lipRound: 0.8, lipSmile: 0, tongueHeight: 0.3, tongueBack: 0.9, tongueTip: 'free', vocal: true, tip: '嘴唇收圆，声音长长的，像「哦」', examples: [{ word: 'ball', cn: '球' }, { word: 'door', cn: '门' }, { word: 'horse', cn: '马' }] },
  { symbol: '/ʊ/', category: '后元音', vowel: true, jaw: 0.3, lipRound: 0.7, lipSmile: 0, tongueHeight: 0.75, tongueBack: 0.85, tongueTip: 'free', vocal: true, tip: '嘴唇收圆微微突出，声音短促', examples: [{ word: 'book', cn: '书' }, { word: 'good', cn: '好' }, { word: 'look', cn: '看' }] },
  { symbol: '/uː/', category: '后元音', vowel: true, jaw: 0.15, lipRound: 1, lipSmile: 0, tongueHeight: 1, tongueBack: 1, tongueTip: 'free', vocal: true, tip: '嘴唇撮圆向前突出，像吹口哨，声音长长的', examples: [{ word: 'moon', cn: '月亮' }, { word: 'blue', cn: '蓝色' }, { word: 'zoo', cn: '动物园' }] },

  // ===== 双元音 =====
  { symbol: '/eɪ/', category: '双元音', vowel: true, jaw: 0.4, lipRound: 0, lipSmile: 0.7, tongueHeight: 0.7, tongueBack: 0.1, tongueTip: 'free', vocal: true, tip: '从「诶」滑向「衣」，像字母 A 的发音', examples: [{ word: 'cake', cn: '蛋糕' }, { word: 'name', cn: '名字' }, { word: 'day', cn: '天' }] },
  { symbol: '/aɪ/', category: '双元音', vowel: true, jaw: 0.7, lipRound: 0, lipSmile: 0.3, tongueHeight: 0.5, tongueBack: 0.3, tongueTip: 'free', vocal: true, tip: '从「啊」滑向「衣」，像字母 I 的发音', examples: [{ word: 'bike', cn: '自行车' }, { word: 'kite', cn: '风筝' }, { word: 'five', cn: '五' }] },
  { symbol: '/ɔɪ/', category: '双元音', vowel: true, jaw: 0.5, lipRound: 0.5, lipSmile: 0.2, tongueHeight: 0.5, tongueBack: 0.6, tongueTip: 'free', vocal: true, tip: '从「哦」滑向「衣」，像「噢咦」', examples: [{ word: 'boy', cn: '男孩' }, { word: 'toy', cn: '玩具' }, { word: 'coin', cn: '硬币' }] },
  { symbol: '/əʊ/', category: '双元音', vowel: true, jaw: 0.3, lipRound: 0.7, lipSmile: 0, tongueHeight: 0.6, tongueBack: 0.7, tongueTip: 'free', vocal: true, tip: '从「呃」滑向「乌」，像字母 O 的发音', examples: [{ word: 'boat', cn: '船' }, { word: 'home', cn: '家' }, { word: 'nose', cn: '鼻子' }] },
  { symbol: '/aʊ/', category: '双元音', vowel: true, jaw: 0.7, lipRound: 0.4, lipSmile: 0, tongueHeight: 0.4, tongueBack: 0.5, tongueTip: 'free', vocal: true, tip: '从「啊」滑向「乌」，像「嗷」', examples: [{ word: 'cow', cn: '奶牛' }, { word: 'house', cn: '房子' }, { word: 'mouth', cn: '嘴' }] },
  { symbol: '/ɪə/', category: '双元音', vowel: true, jaw: 0.3, lipRound: 0, lipSmile: 0.4, tongueHeight: 0.7, tongueBack: 0.2, tongueTip: 'free', vocal: true, tip: '从「衣」滑向「呃」，像「伊尔」', examples: [{ word: 'ear', cn: '耳朵' }, { word: 'here', cn: '这里' }, { word: 'dear', cn: '亲爱的' }] },
  { symbol: '/eə/', category: '双元音', vowel: true, jaw: 0.45, lipRound: 0, lipSmile: 0.3, tongueHeight: 0.55, tongueBack: 0.3, tongueTip: 'free', vocal: true, tip: '从「哎」滑向「呃」，像「艾尔」', examples: [{ word: 'bear', cn: '熊' }, { word: 'hair', cn: '头发' }, { word: 'chair', cn: '椅子' }] },
  { symbol: '/ʊə/', category: '双元音', vowel: true, jaw: 0.3, lipRound: 0.5, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.7, tongueTip: 'free', vocal: true, tip: '从「乌」滑向「呃」，像「乌尔」', examples: [{ word: 'tour', cn: '旅行' }, { word: 'sure', cn: '确定' }, { word: 'poor', cn: '穷' }] },

  // ===== 爆破音 =====
  { symbol: '/p/', category: '爆破音', vowel: false, jaw: 0.1, lipRound: 0, lipSmile: 0, tongueHeight: 0.5, tongueBack: 0.5, tongueTip: 'free', vocal: false, tip: '双唇紧闭然后突然打开，像吹气「噗」，声带不振动', examples: [{ word: 'pig', cn: '猪' }, { word: 'pen', cn: '钢笔' }, { word: 'apple', cn: '苹果' }] },
  { symbol: '/b/', category: '爆破音', vowel: false, jaw: 0.1, lipRound: 0, lipSmile: 0, tongueHeight: 0.5, tongueBack: 0.5, tongueTip: 'free', vocal: true, tip: '和 /p/ 一样，但声带要振动，像「啵」', examples: [{ word: 'ball', cn: '球' }, { word: 'book', cn: '书' }, { word: 'baby', cn: '宝宝' }] },
  { symbol: '/t/', category: '爆破音', vowel: false, jaw: 0.15, lipRound: 0, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.2, tongueTip: 'alveolar', vocal: false, tip: '舌尖抵住上齿龈，然后突然放开，像「特」', examples: [{ word: 'ten', cn: '十' }, { word: 'cat', cn: '猫' }, { word: 'table', cn: '桌子' }] },
  { symbol: '/d/', category: '爆破音', vowel: false, jaw: 0.15, lipRound: 0, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.2, tongueTip: 'alveolar', vocal: true, tip: '和 /t/ 一样，但声带要振动，像「的」', examples: [{ word: 'dog', cn: '狗' }, { word: 'day', cn: '天' }, { word: 'red', cn: '红色' }] },
  { symbol: '/k/', category: '爆破音', vowel: false, jaw: 0.3, lipRound: 0, lipSmile: 0, tongueHeight: 0.8, tongueBack: 0.9, tongueTip: 'free', vocal: false, tip: '舌后部抬起抵住软腭，然后突然放开，像「克」', examples: [{ word: 'cat', cn: '猫' }, { word: 'kite', cn: '风筝' }, { word: 'book', cn: '书' }] },
  { symbol: '/g/', category: '爆破音', vowel: false, jaw: 0.3, lipRound: 0, lipSmile: 0, tongueHeight: 0.8, tongueBack: 0.9, tongueTip: 'free', vocal: true, tip: '和 /k/ 一样，但声带要振动，像「哥」', examples: [{ word: 'go', cn: '去' }, { word: 'egg', cn: '鸡蛋' }, { word: 'big', cn: '大' }] },

  // ===== 摩擦音 =====
  { symbol: '/f/', category: '摩擦音', vowel: false, jaw: 0.15, lipRound: 0, lipSmile: 0.3, tongueHeight: 0.5, tongueBack: 0.5, tongueTip: 'free', vocal: false, tip: '上牙轻咬下唇，吹气，像「夫」', examples: [{ word: 'fish', cn: '鱼' }, { word: 'five', cn: '五' }, { word: 'leaf', cn: '叶子' }] },
  { symbol: '/v/', category: '摩擦音', vowel: false, jaw: 0.15, lipRound: 0, lipSmile: 0.3, tongueHeight: 0.5, tongueBack: 0.5, tongueTip: 'free', vocal: true, tip: '和 /f/ 一样，但声带要振动，像「呜」', examples: [{ word: 'van', cn: '货车' }, { word: 'five', cn: '五' }, { word: 'love', cn: '爱' }] },
  { symbol: '/θ/', category: '摩擦音', vowel: false, jaw: 0.2, lipRound: 0, lipSmile: 0, tongueHeight: 0.6, tongueBack: 0.1, tongueTip: 'between', vocal: false, tip: '舌尖轻轻伸到上下牙齿之间，吹气，像「嘶」', examples: [{ word: 'three', cn: '三' }, { word: 'think', cn: '想' }, { word: 'mouth', cn: '嘴' }] },
  { symbol: '/ð/', category: '摩擦音', vowel: false, jaw: 0.2, lipRound: 0, lipSmile: 0, tongueHeight: 0.6, tongueBack: 0.1, tongueTip: 'between', vocal: true, tip: '和 /θ/ 一样，但声带要振动', examples: [{ word: 'this', cn: '这个' }, { word: 'mother', cn: '妈妈' }, { word: 'that', cn: '那个' }] },
  { symbol: '/s/', category: '摩擦音', vowel: false, jaw: 0.1, lipRound: 0, lipSmile: 0.5, tongueHeight: 0.8, tongueBack: 0.2, tongueTip: 'alveolar', vocal: false, tip: '舌尖靠近上齿龈，吹气，像蛇的「嘶嘶」声', examples: [{ word: 'sun', cn: '太阳' }, { word: 'six', cn: '六' }, { word: 'bus', cn: '公交车' }] },
  { symbol: '/z/', category: '摩擦音', vowel: false, jaw: 0.1, lipRound: 0, lipSmile: 0.5, tongueHeight: 0.8, tongueBack: 0.2, tongueTip: 'alveolar', vocal: true, tip: '和 /s/ 一样，但声带要振动，像蜜蜂的「嗡嗡」', examples: [{ word: 'zoo', cn: '动物园' }, { word: 'is', cn: '是' }, { word: 'nose', cn: '鼻子' }] },
  { symbol: '/ʃ/', category: '摩擦音', vowel: false, jaw: 0.2, lipRound: 0.6, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.5, tongueTip: 'free', vocal: false, tip: '嘴唇收圆，像让别人安静时说「嘘——」', examples: [{ word: 'ship', cn: '船' }, { word: 'fish', cn: '鱼' }, { word: 'shoe', cn: '鞋' }] },
  { symbol: '/ʒ/', category: '摩擦音', vowel: false, jaw: 0.2, lipRound: 0.6, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.5, tongueTip: 'free', vocal: true, tip: '和 /ʃ/ 一样，但声带要振动', examples: [{ word: 'usually', cn: '通常' }, { word: 'vision', cn: '视野' }, { word: 'treasure', cn: '宝藏' }] },
  { symbol: '/h/', category: '摩擦音', vowel: false, jaw: 0.4, lipRound: 0, lipSmile: 0, tongueHeight: 0.4, tongueBack: 0.6, tongueTip: 'free', vocal: false, tip: '嘴巴张开，轻轻哈气，像「喝」', examples: [{ word: 'hat', cn: '帽子' }, { word: 'hello', cn: '你好' }, { word: 'house', cn: '房子' }] },
  { symbol: '/r/', category: '摩擦音', vowel: false, jaw: 0.25, lipRound: 0.4, lipSmile: 0, tongueHeight: 0.6, tongueBack: 0.4, tongueTip: 'free', vocal: true, tip: '舌尖向上卷起，不碰到上颚，像「若」', examples: [{ word: 'red', cn: '红色' }, { word: 'run', cn: '跑' }, { word: 'rabbit', cn: '兔子' }] },

  // ===== 破擦音 =====
  { symbol: '/tʃ/', category: '破擦音', vowel: false, jaw: 0.2, lipRound: 0.5, lipSmile: 0, tongueHeight: 0.75, tongueBack: 0.4, tongueTip: 'alveolar', vocal: false, tip: '先发 /t/ 再滑向 /ʃ/，像「吃」', examples: [{ word: 'chair', cn: '椅子' }, { word: 'chick', cn: '小鸡' }, { word: 'lunch', cn: '午餐' }] },
  { symbol: '/dʒ/', category: '破擦音', vowel: false, jaw: 0.2, lipRound: 0.5, lipSmile: 0, tongueHeight: 0.75, tongueBack: 0.4, tongueTip: 'alveolar', vocal: true, tip: '和 /tʃ/ 一样，但声带要振动，像「知」', examples: [{ word: 'juice', cn: '果汁' }, { word: 'jump', cn: '跳' }, { word: 'orange', cn: '橙子' }] },
  { symbol: '/tr/', category: '破擦音', vowel: false, jaw: 0.2, lipRound: 0.4, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.3, tongueTip: 'alveolar', vocal: false, tip: '先发 /t/ 再滑向 /r/，像「戳」', examples: [{ word: 'tree', cn: '树' }, { word: 'train', cn: '火车' }, { word: 'truck', cn: '卡车' }] },
  { symbol: '/dr/', category: '破擦音', vowel: false, jaw: 0.2, lipRound: 0.4, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.3, tongueTip: 'alveolar', vocal: true, tip: '和 /tr/ 一样，但声带要振动，像「捉」', examples: [{ word: 'drum', cn: '鼓' }, { word: 'dress', cn: '裙子' }, { word: 'drive', cn: '开车' }] },
  { symbol: '/ts/', category: '破擦音', vowel: false, jaw: 0.15, lipRound: 0, lipSmile: 0.4, tongueHeight: 0.75, tongueBack: 0.2, tongueTip: 'alveolar', vocal: false, tip: '先发 /t/ 再滑向 /s/，像「次」', examples: [{ word: 'cats', cn: '猫(复数)' }, { word: 'hats', cn: '帽子(复数)' }, { word: 'kites', cn: '风筝(复数)' }] },
  { symbol: '/dz/', category: '破擦音', vowel: false, jaw: 0.15, lipRound: 0, lipSmile: 0.4, tongueHeight: 0.75, tongueBack: 0.2, tongueTip: 'alveolar', vocal: true, tip: '和 /ts/ 一样，但声带要振动', examples: [{ word: 'beds', cn: '床(复数)' }, { word: 'birds', cn: '鸟(复数)' }, { word: 'hands', cn: '手(复数)' }] },

  // ===== 鼻音 =====
  { symbol: '/m/', category: '鼻音', vowel: false, jaw: 0.05, lipRound: 0, lipSmile: 0, tongueHeight: 0.5, tongueBack: 0.5, tongueTip: 'free', vocal: true, tip: '双唇紧闭，声音从鼻子出来，像「姆」', examples: [{ word: 'mom', cn: '妈妈' }, { word: 'moon', cn: '月亮' }, { word: 'swim', cn: '游泳' }] },
  { symbol: '/n/', category: '鼻音', vowel: false, jaw: 0.1, lipRound: 0, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.2, tongueTip: 'alveolar', vocal: true, tip: '舌尖抵住上齿龈，声音从鼻子出来，像「嗯」', examples: [{ word: 'no', cn: '不' }, { word: 'sun', cn: '太阳' }, { word: 'banana', cn: '香蕉' }] },
  { symbol: '/ŋ/', category: '鼻音', vowel: false, jaw: 0.3, lipRound: 0, lipSmile: 0, tongueHeight: 0.7, tongueBack: 0.9, tongueTip: 'free', vocal: true, tip: '舌后部抬起抵住软腭，声音从鼻子出来，像「英」的尾音', examples: [{ word: 'sing', cn: '唱歌' }, { word: 'ring', cn: '戒指' }, { word: 'morning', cn: '早上' }] },

  // ===== 舌侧音 =====
  { symbol: '/l/', category: '舌侧音', vowel: false, jaw: 0.2, lipRound: 0, lipSmile: 0.2, tongueHeight: 0.7, tongueBack: 0.2, tongueTip: 'alveolar', vocal: true, tip: '舌尖抵住上齿龈，声音从舌头两边出来，像「了」', examples: [{ word: 'lion', cn: '狮子' }, { word: 'ball', cn: '球' }, { word: 'hello', cn: '你好' }] },

  // ===== 半元音 =====
  { symbol: '/w/', category: '半元音', vowel: false, jaw: 0.15, lipRound: 1, lipSmile: 0, tongueHeight: 0.9, tongueBack: 0.9, tongueTip: 'free', vocal: true, tip: '嘴唇撮圆向前突出，很快滑向后面的元音，像「乌」', examples: [{ word: 'we', cn: '我们' }, { word: 'water', cn: '水' }, { word: 'window', cn: '窗户' }] },
  { symbol: '/j/', category: '半元音', vowel: false, jaw: 0.15, lipRound: 0, lipSmile: 0.7, tongueHeight: 0.95, tongueBack: 0.1, tongueTip: 'free', vocal: true, tip: '嘴角向两边咧开，很快滑向后面的元音，像「耶」', examples: [{ word: 'yes', cn: '是' }, { word: 'you', cn: '你' }, { word: 'yellow', cn: '黄色' }] },
]

/* ============ 常见连读短语 ============ */

export interface Liaison {
  /** 原始短语 */
  phrase: string
  /** 连读后的发音（音标或通俗拼写） */
  sounds: string
  /** 中文意思 */
  cn: string
  /** 连读类型说明 */
  rule: string
  /** 例句 */
  example: string
  exampleCn: string
}

export const LIAISONS: Liaison[] = [
  { phrase: 'let us', sounds: "let's /lets/", cn: '让我们', rule: 'let us 总是缩成 let\'s', example: "Let's play together.", exampleCn: '我们一起玩吧。' },
  { phrase: 'want to', sounds: 'wanna /ˈwɒnə/', cn: '想要', rule: 'want to 口语里常读成 wanna', example: 'I wanna go home.', exampleCn: '我想回家。' },
  { phrase: 'going to', sounds: 'gonna /ˈɡənə/', cn: '将要', rule: 'going to 口语里常读成 gonna', example: "I'm gonna be late.", exampleCn: '我要迟到了。' },
  { phrase: 'got to', sounds: 'gotta /ˈɡɒtə/', cn: '必须', rule: 'got to 口语里常读成 gotta', example: 'I gotta go now.', exampleCn: '我得走了。' },
  { phrase: 'have to', sounds: 'hafta /ˈhæftə/', cn: '不得不', rule: 'have to 里 v 变 f，to 变 ta', example: 'I hafta do my homework.', exampleCn: '我得做作业。' },
  { phrase: 'kind of', sounds: 'kinda /ˈkaɪndə/', cn: '有点儿', rule: 'kind of 口语里常读成 kinda', example: "It's kinda hot today.", exampleCn: '今天有点热。' },
  { phrase: 'a lot of', sounds: 'alotta /əˈlɒtə/', cn: '很多', rule: 'a lot of 三个词连在一起读', example: 'I have alotta toys.', exampleCn: '我有很多玩具。' },
  { phrase: 'give me', sounds: 'gimme /ˈɡɪmi/', cn: '给我', rule: 'give me 里 v 常常不发音', example: 'Gimme the ball.', exampleCn: '把球给我。' },
  { phrase: 'let me', sounds: 'lemme /ˈlemi/', cn: '让我', rule: 'let me 里 t 常常不发音', example: 'Lemme try.', exampleCn: '让我试试。' },
  { phrase: 'would you', sounds: 'wouldja /ˈwʊdʒə/', cn: '你愿意', rule: 'would you 里 d 和 y 合成 /dʒ/', example: 'Wouldja like some juice?', exampleCn: '你想喝点果汁吗？' },
  { phrase: 'did you', sounds: 'didja /ˈdɪdʒə/', cn: '你（过去）', rule: 'did you 里 d 和 y 合成 /dʒ/', example: 'Didja see that?', exampleCn: '你看到了吗？' },
  { phrase: "don't you", sounds: 'doncha /ˈdəʊntʃə/', cn: '你不', rule: "don't you 里 t 和 y 合成 /tʃ/", example: 'Doncha like it?', exampleCn: '你不喜欢吗？' },
  { phrase: 'what are you', sounds: 'whatcha /ˈwɒtʃə/', cn: '你在什么', rule: 'what are you 常缩成 whatcha', example: 'Whatcha doing?', exampleCn: '你在做什么？' },
  { phrase: 'an apple', sounds: 'a-napple /əˈnæpəl/', cn: '一个苹果', rule: '辅音结尾 + 元音开头要连起来', example: 'I eat a-napple every day.', exampleCn: '我每天吃一个苹果。' },
  { phrase: 'an egg', sounds: 'a-negg /əˈneɡ/', cn: '一个鸡蛋', rule: 'an 和后面的词连起来读', example: 'I have a-negg for breakfast.', exampleCn: '我早餐吃一个鸡蛋。' },
  { phrase: 'come on', sounds: 'c-mon /kəˈmɒn/', cn: '来吧/快点', rule: 'come on 连在一起读', example: 'C-mon, let\'s go!', exampleCn: '快点，我们走！' },
  { phrase: 'look at', sounds: 'loo-kat /ˈlʊkæt/', cn: '看', rule: 'look at 里 k 和 a 连起来', example: 'Loo-kat the bird!', exampleCn: '看那只鸟！' },
  { phrase: 'pick up', sounds: 'pi-kup /ˈpɪkʌp/', cn: '捡起/接', rule: 'pick up 里 k 和 u 连起来', example: 'Pi-kup your toys.', exampleCn: '把你的玩具捡起来。' },
  { phrase: 'thank you', sounds: 'than-kyou /ˈθæŋkjuː/', cn: '谢谢', rule: 'thank you 里 k 和 y 连起来', example: 'Than-kyou very much!', exampleCn: '非常感谢！' },
  { phrase: 'this is', sounds: 'thi-sis /ˈðɪsɪz/', cn: '这是', rule: 'this is 里 s 和 i 连起来', example: 'Thi-sis my mom.', exampleCn: '这是我妈妈。' },
]
