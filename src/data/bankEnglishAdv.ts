import type { Question } from '@/types'

let seq = 0
const qid = () => `qe${Date.now().toString(36)}-${seq++}`
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
function enQ(partial: Omit<Question, 'id' | 'speakLang'>): Question {
  return { ...partial, id: qid(), speakLang: 'en-US' }
}

/* ============ 剑桥少儿一级 Starters ============ */

export const STARTERS_WORDS: [string, string, string[]][] = [
  ['🍎', 'apple', ['banana', 'orange', 'pear']],
  ['🍌', 'banana', ['apple', 'grape', 'melon']],
  ['🐱', 'cat', ['dog', 'bird', 'fish']],
  ['🐶', 'dog', ['cat', 'duck', 'frog']],
  ['🦆', 'duck', ['dog', 'frog', 'bird']],
  ['🐸', 'frog', ['fish', 'duck', 'dog']],
  ['🐟', 'fish', ['frog', 'fox', 'dish']],
  ['🐦', 'bird', ['fish', 'frog', 'cat']],
  ['🐔', 'hen', ['duck', 'bird', 'cow']],
  ['🐄', 'cow', ['pig', 'horse', 'sheep']],
  ['🐷', 'pig', ['cow', 'dog', 'hen']],
  ['🐴', 'horse', ['cow', 'sheep', 'goat']],
  ['🐑', 'sheep', ['goat', 'cow', 'horse']],
  ['📚', 'book', ['pen', 'bag', 'desk']],
  ['✏️', 'pencil', ['pen', 'ruler', 'eraser']],
  ['🖊️', 'pen', ['pencil', 'crayon', 'marker']],
  ['🎒', 'bag', ['book', 'box', 'hat']],
  ['🪑', 'chair', ['desk', 'table', 'bed']],
  ['🛏️', 'bed', ['desk', 'chair', 'lamp']],
  ['🚪', 'door', ['window', 'wall', 'floor']],
  ['🪟', 'window', ['door', 'wall', 'roof']],
  ['🌞', 'sun', ['moon', 'star', 'cloud']],
  ['🌙', 'moon', ['sun', 'star', 'sky']],
  ['⭐', 'star', ['sun', 'moon', 'cloud']],
  ['☁️', 'cloud', ['rain', 'snow', 'wind']],
  ['🌧️', 'rain', ['cloud', 'snow', 'sun']],
  ['👨', 'father', ['mother', 'brother', 'sister']],
  ['👩', 'mother', ['father', 'sister', 'grandma']],
  ['👦', 'boy', ['girl', 'man', 'baby']],
  ['👧', 'girl', ['boy', 'woman', 'baby']],
]

export function genStartersPic(): Question[] {
  return shuffle(STARTERS_WORDS).slice(0, 10).map(([emoji, word, wrong]) =>
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

export const STARTERS_LISTEN: [string, string[]][] = [
  ['apple', ['apples', 'apply', 'ample']],
  ['banana', ['bandana', 'band', 'banner']],
  ['father', ['farther', 'feather', 'mother']],
  ['mother', ['father', 'brother', 'smother']],
  ['window', ['widow', 'wind', 'winner']],
  ['pencil', ['pen', 'stencil', 'people']],
  ['teacher', ['teach', 'toucher', 'preacher']],
  ['school', ['pool', 'tool', 'cool']],
  ['friend', ['fiend', 'find', 'fond']],
  ['happy', ['hippy', 'happen', 'hop']],
]

export function genStartersListen(): Question[] {
  return shuffle(STARTERS_LISTEN).slice(0, 10).map(([word, wrong]) =>
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

export const STARTERS_SENT: [string, string[]][] = [
  ['This is my father.', ['This is my mother.', 'That is my father.', 'This is my brother.']],
  ['I like apples.', ['I like bananas.', 'I like oranges.', 'I like pears.']],
  ['She is my sister.', ['He is my brother.', 'She is my mother.', 'She is my friend.']],
  ['The cat is on the chair.', ['The cat is under the chair.', 'The dog is on the chair.', 'The cat is on the desk.']],
  ['I can see a bird.', ['I can see a fish.', 'I can see a frog.', 'I can see a duck.']],
  ['This is a red book.', ['This is a blue book.', 'This is a red bag.', 'This is a big book.']],
  ['My mother is a teacher.', ['My father is a teacher.', 'My mother is a doctor.', 'My mother is a farmer.']],
  ['I go to school by bus.', ['I go to school by bike.', 'I go to school by car.', 'I go to school on foot.']],
  ['There are five pencils.', ['There are four pencils.', 'There are six pencils.', 'There are five pens.']],
  ['The boy is playing football.', ['The boy is playing basketball.', 'The girl is playing football.', 'The boy is watching football.']],
]

export function genStartersSent(): Question[] {
  return shuffle(STARTERS_SENT).slice(0, 10).map(([sent, wrong]) =>
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

/* ============ 剑桥少儿二级 Movers ============ */

export const MOVERS_WORDS: [string, string, string[]][] = [
  ['🌈', 'rainbow', ['rain', 'cloud', 'storm']],
  ['⛈️', 'storm', ['rainbow', 'cloud', 'wind']],
  ['🏥', 'hospital', ['school', 'library', 'bank']],
  ['🏦', 'bank', ['hospital', 'shop', 'post']],
  ['📮', 'post office', ['police', 'park', 'pool']],
  ['👮', 'police', ['doctor', 'nurse', 'teacher']],
  ['🧑‍⚕️', 'doctor', ['nurse', 'police', 'driver']],
  ['👩‍🏫', 'teacher', ['doctor', 'nurse', 'farmer']],
  ['🧑‍🌾', 'farmer', ['teacher', 'driver', 'cook']],
  ['🧑‍🍳', 'cook', ['baker', 'farmer', 'driver']],
  ['🚲', 'bike', ['car', 'bus', 'train']],
  ['🚗', 'car', ['bus', 'bike', 'truck']],
  ['🚌', 'bus', ['car', 'train', 'plane']],
  ['✈️', 'plane', ['train', 'ship', 'rocket']],
  ['🚂', 'train', ['plane', 'bus', 'tram']],
  ['🐘', 'elephant', ['giraffe', 'lion', 'tiger']],
  ['🦁', 'lion', ['tiger', 'elephant', 'monkey']],
  ['🐒', 'monkey', ['lion', 'tiger', 'panda']],
  ['🐼', 'panda', ['bear', 'monkey', 'zebra']],
  ['🦒', 'giraffe', ['elephant', 'zebra', 'kangaroo']],
]

export function genMoversPic(): Question[] {
  return shuffle(MOVERS_WORDS).slice(0, 10).map(([emoji, word, wrong]) =>
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

export const MOVERS_LISTEN: [string, string[]][] = [
  ['hospital', ['hostel', 'hotel', 'hostile']],
  ['library', ['librarian', 'liberty', 'literary']],
  ['elephant', ['elegant', 'element', 'elevator']],
  ['giraffe', ['giraffes', 'girlish', 'draft']],
  ['weather', ['whether', 'feather', 'leather']],
  ['rainbow', ['rainfall', 'raincoat', 'window']],
  ['breakfast', ['break', 'fast', 'breastfast']],
  ['dinner', ['diner', 'winner', 'inner']],
  ['lunch', ['launch', 'bunch', 'munch']],
  ['afternoon', ['after', 'noon', 'forenoon']],
]

export function genMoversListen(): Question[] {
  return shuffle(MOVERS_LISTEN).slice(0, 10).map(([word, wrong]) =>
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

export const MOVERS_SENT: [string, string[]][] = [
  ['I went to the park yesterday.', ['I go to the park today.', 'I went to the zoo yesterday.', 'I went to the park last week.']],
  ['She is reading a book now.', ['She is writing a book now.', 'She was reading a book.', 'She reads a book every day.']],
  ['We had rice and fish for lunch.', ['We had rice and chicken for lunch.', 'We had noodles and fish for lunch.', 'We had rice and fish for dinner.']],
  ['The elephant is bigger than the lion.', ['The lion is bigger than the elephant.', 'The elephant is smaller than the lion.', 'The elephant is the biggest animal.']],
  ['I will visit my grandma tomorrow.', ['I visited my grandma yesterday.', 'I will visit my grandpa tomorrow.', 'I am visiting my grandma now.']],
  ['There is a bank next to the hospital.', ['There is a bank next to the school.', 'There is a shop next to the hospital.', 'There is a bank behind the hospital.']],
  ['He rides his bike to school every day.', ['He drives his car to school every day.', 'He rides his bike to work every day.', 'He walks to school every day.']],
  ['My father is a police officer.', ['My father is a doctor.', 'My mother is a police officer.', 'My father is a teacher.']],
  ['It was cloudy and windy yesterday.', ['It was sunny and windy yesterday.', 'It was cloudy and rainy yesterday.', 'It is cloudy and windy today.']],
  ['I like swimming in the pool.', ['I like swimming in the sea.', 'I like playing in the pool.', 'I like swimming in the lake.']],
]

export function genMoversSent(): Question[] {
  return shuffle(MOVERS_SENT).slice(0, 10).map(([sent, wrong]) =>
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

/* ============ KET 词汇启蒙 ============ */

export const KET_WORDS: [string, string, string[]][] = [
  ['🎂', 'birthday', ['party', 'cake', 'present']],
  ['🎁', 'present', ['birthday', 'gift', 'card']],
  ['🎉', 'party', ['birthday', 'picnic', 'meeting']],
  ['🏖️', 'beach', ['sea', 'river', 'lake']],
  ['🌊', 'sea', ['beach', 'river', 'ocean']],
  ['🏔️', 'mountain', ['hill', 'valley', 'forest']],
  ['🌲', 'forest', ['mountain', 'garden', 'park']],
  ['🏕️', 'camping', ['hiking', 'climbing', 'fishing']],
  ['🚶', 'walking', ['running', 'jogging', 'climbing']],
  ['🏃', 'running', ['walking', 'jogging', 'dancing']],
  ['🎬', 'cinema', ['theatre', 'museum', 'gallery']],
  ['🖼️', 'museum', ['cinema', 'gallery', 'library']],
  ['📷', 'camera', ['phone', 'video', 'photo']],
  ['🎸', 'guitar', ['piano', 'violin', 'drum']],
  ['🎹', 'piano', ['guitar', 'violin', 'flute']],
  ['🥁', 'drum', ['piano', 'guitar', 'bell']],
  ['⚽', 'football', ['basketball', 'tennis', 'volleyball']],
  ['🏀', 'basketball', ['football', 'volleyball', 'handball']],
  ['🎾', 'tennis', ['badminton', 'table tennis', 'squash']],
  ['🏊', 'swimming', ['diving', 'surfing', 'sailing']],
]

export function genKetPic(): Question[] {
  return shuffle(KET_WORDS).slice(0, 10).map(([emoji, word, wrong]) =>
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

export const KET_LISTEN: [string, string[]][] = [
  ['birthday', ['Thursday', 'bird', 'bath']],
  ['present', ['parent', 'pleasant', 'peasant']],
  ['mountain', ['fountain', 'maintain', 'curtain']],
  ['forest', ['for rest', 'honest', 'modest']],
  ['cinema', ['cinnamon', 'enemy', 'cinemas']],
  ['museum', ['music', 'muse', 'medium']],
  ['camera', ['camp', 'campus', 'caramel']],
  ['guitar', ['girdle', 'gutter', 'guitarist']],
  ['football', ['foot', 'ball', 'footpath']],
  ['swimming', ['slimming', 'swinging', 'swearing']],
]

export function genKetListen(): Question[] {
  return shuffle(KET_LISTEN).slice(0, 10).map(([word, wrong]) =>
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

export const KET_SENT: [string, string[]][] = [
  ['I usually have breakfast at seven.', ['I usually have breakfast at eight.', 'I usually have lunch at seven.', 'I always have breakfast at seven.']],
  ['She is interested in playing tennis.', ['She is interested in playing football.', 'She is good at playing tennis.', 'She likes playing tennis very much.']],
  ['We are going to the beach this weekend.', ['We are going to the beach next weekend.', 'We went to the beach last weekend.', 'We are going to the mountain this weekend.']],
  ['It takes me twenty minutes to walk to school.', ['It takes me thirty minutes to walk to school.', 'It takes me twenty minutes to drive to school.', 'It takes me twenty minutes to walk to work.']],
  ['I have lived in Beijing for five years.', ['I have lived in Beijing for ten years.', 'I lived in Beijing for five years.', 'I have lived in Shanghai for five years.']],
  ['The museum is open from Monday to Friday.', ['The museum is open from Monday to Sunday.', 'The museum is closed on Monday.', 'The museum is open from Tuesday to Friday.']],
  ['Could you tell me the way to the station?', ['Could you tell me the way to the airport?', 'Could you show me the way to the station?', 'Could you tell me how to get to the station?']],
  ['I bought this camera for my birthday.', ['I bought this camera for my father.', 'I got this camera for my birthday.', 'I bought this phone for my birthday.']],
  ['Playing the guitar is my favourite hobby.', ['Playing the piano is my favourite hobby.', 'Playing the guitar is my only hobby.', 'Playing football is my favourite hobby.']],
  ['We had a great time at the party last night.', ['We had a great time at the picnic last night.', 'We had a good time at the party last night.', 'We had a great time at the party yesterday.']],
]

export function genKetSent(): Question[] {
  return shuffle(KET_SENT).slice(0, 10).map(([sent, wrong]) =>
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

/* ============ 自然拼读进阶 ============ */

export const BLEND_SETS: [string, string[]][] = [
  ['bl', ['br', 'cl', 'pl']],
  ['br', ['bl', 'dr', 'gr']],
  ['cl', ['cr', 'fl', 'pl']],
  ['cr', ['cl', 'dr', 'tr']],
  ['dr', ['tr', 'br', 'gr']],
  ['fl', ['fr', 'cl', 'pl']],
  ['fr', ['fl', 'gr', 'tr']],
  ['gr', ['gl', 'br', 'fr']],
  ['pl', ['bl', 'pr', 'sl']],
  ['tr', ['dr', 'cr', 'str']],
]

export function genBlend(): Question[] {
  const exampleWords: Record<string, string> = {
    bl: 'black', br: 'brown', cl: 'clock', cr: 'crab', dr: 'drum',
    fl: 'flag', fr: 'frog', gr: 'green', pl: 'play', tr: 'tree',
  }
  return shuffle(BLEND_SETS).slice(0, 10).map(([blend, wrong]) =>
    enQ({
      prompt: `听一听，选出以哪个字母组合开头的单词`,
      big: '👂',
      speak: exampleWords[blend],
      options: opts(blend, wrong),
      answer: blend,
      explain: `你听到的单词「${exampleWords[blend]}」以 ${blend} 开头。`,
    })
  )
}

export const DIGRAPH_SETS: [string, string, string[]][] = [
  ['ship', 'sh', ['ch', 'th', 's']],
  ['chin', 'ch', ['sh', 'th', 'c']],
  ['this', 'th', ['sh', 'ch', 's']],
  ['three', 'th', ['sh', 'ch', 't']],
  ['sing', 'ng', ['nk', 'n', 'ing']],
  ['pink', 'nk', ['ng', 'n', 'k']],
  ['cat', 'c', ['k', 'ck', 's']],
  ['back', 'ck', ['c', 'k', 'ch']],
  ['day', 'ay', ['ai', 'ey', 'y']],
  ['rain', 'ai', ['ay', 'a', 'eigh']],
]

export function genDigraph(): Question[] {
  return shuffle(DIGRAPH_SETS).slice(0, 10).map(([word, target, wrong]) =>
    enQ({
      prompt: `听一听，「${word}」里发这个音的字母组合是？`,
      big: '👂',
      speak: word,
      options: opts(target, wrong),
      answer: target,
      explain: `「${word}」里的 ${target} 发这个音。`,
    })
  )
}

export const LONG_VOWEL_SETS: [string, string, string[]][] = [
  ['cake', 'a_e', ['ai', 'ay', 'a']],
  ['rain', 'ai', ['ay', 'a_e', 'a']],
  ['day', 'ay', ['ai', 'a_e', 'ey']],
  ['see', 'ee', ['ea', 'e', 'y']],
  ['sea', 'ea', ['ee', 'e', 'ey']],
  ['bike', 'i_e', ['igh', 'y', 'i']],
  ['night', 'igh', ['i_e', 'y', 'i']],
  ['my', 'y', ['i_e', 'igh', 'i']],
  ['boat', 'oa', ['ow', 'o_e', 'o']],
  ['snow', 'ow', ['oa', 'o_e', 'o']],
  ['cute', 'u_e', ['oo', 'ew', 'u']],
  ['moon', 'oo', ['u_e', 'ew', 'u']],
]

export function genLongVowel(): Question[] {
  return shuffle(LONG_VOWEL_SETS).slice(0, 10).map(([word, target, wrong]) =>
    enQ({
      prompt: `听一听，「${word}」里的元音是怎么拼的？`,
      big: '👂',
      speak: word,
      options: opts(target, wrong),
      answer: target,
      explain: `「${word}」里的元音拼写是 ${target}。`,
    })
  )
}
