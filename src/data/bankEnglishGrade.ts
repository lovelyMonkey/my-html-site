import type { Question } from '@/types'

let seq = 0
const qid = () => `qeg${Date.now().toString(36)}-${seq++}`
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

/* ============ 剑少三级 Flyers ============ */

export const FLYERS_WORDS: [string, string, string[]][] = [
  ['🌍', 'world', ['word', 'work', 'walk']],
  ['🌋', 'volcano', ['mountain', 'hill', 'valley']],
  ['🏜️', 'desert', ['forest', 'jungle', 'island']],
  ['🏝️', 'island', ['desert', 'ocean', 'beach']],
  ['🌊', 'ocean', ['sea', 'river', 'lake']],
  ['🚀', 'rocket', ['plane', 'ship', 'train']],
  ['🛸', 'spaceship', ['rocket', 'plane', 'satellite']],
  ['🗼', 'tower', ['castle', 'bridge', 'temple']],
  ['🏰', 'castle', ['tower', 'palace', 'house']],
  ['🌉', 'bridge', ['tower', 'tunnel', 'road']],
  ['🎭', 'theatre', ['cinema', 'museum', 'circus']],
  ['🎪', 'circus', ['theatre', 'zoo', 'park']],
  ['🎡', 'wheel', ['circle', 'ball', 'ring']],
  ['🎢', 'roller coaster', ['slide', 'swing', 'wheel']],
  ['🦕', 'dinosaur', ['dragon', 'lizard', 'snake']],
  ['🐋', 'whale', ['shark', 'dolphin', 'fish']],
  ['🦈', 'shark', ['whale', 'dolphin', 'octopus']],
  ['🐬', 'dolphin', ['whale', 'shark', 'seal']],
  ['🦅', 'eagle', ['owl', 'hawk', 'pigeon']],
  ['🦉', 'owl', ['eagle', 'bat', 'crow']],
]

export function genFlyersPic(): Question[] {
  return shuffle(FLYERS_WORDS).slice(0, 10).map(([emoji, word, wrong]) =>
    enQ({ prompt: '看一看图片，选出正确的单词', visual: { kind: 'emoji', emoji }, speak: word, options: opts(word, wrong), answer: word, explain: `${emoji} 是 ${word}。` })
  )
}

export const FLYERS_LISTEN: [string, string[]][] = [
  ['world', ['word', 'work', 'walk']],
  ['volcano', ['volcanic', 'volleyball', 'valley']],
  ['desert', ['dessert', 'deserve', 'desire']],
  ['island', ['islet', 'inland', 'highland']],
  ['ocean', ['otion', 'oceans', 'option']],
  ['rocket', ['socket', 'locket', 'pocket']],
  ['dinosaur', ['dinner', 'dinos', 'dynasty']],
  ['whale', ['while', 'wail', 'well']],
  ['eagle', ['eager', 'eight', 'equal']],
  ['theatre', ['theater', 'theft', 'theme']],
]

export function genFlyersListen(): Question[] {
  return shuffle(FLYERS_LISTEN).slice(0, 10).map(([word, wrong]) =>
    enQ({ prompt: '听一听，选出你听到的单词', big: '👂', speak: word, options: opts(word, wrong), answer: word, explain: `你听到的单词是 ${word}。` })
  )
}

export const FLYERS_SENT: [string, string[]][] = [
  ['I have been to the Great Wall twice.', ['I have been to the Great Wall once.', 'I went to the Great Wall last year.', 'I have never been to the Great Wall.']],
  ['She has lived in Shanghai since 2020.', ['She has lived in Shanghai since 2010.', 'She lived in Shanghai in 2020.', 'She has lived in Beijing since 2020.']],
  ['We are going to visit the museum next Sunday.', ['We are going to visit the museum this Sunday.', 'We visited the museum last Sunday.', 'We are going to visit the cinema next Sunday.']],
  ['The dinosaur disappeared millions of years ago.', ['The dinosaur disappeared thousands of years ago.', 'The dinosaur appeared millions of years ago.', 'The dinosaur disappeared hundreds of years ago.']],
  ['If it rains tomorrow, we will stay at home.', ['If it rains tomorrow, we will go out.', 'If it rained yesterday, we stayed at home.', 'If it is sunny tomorrow, we will stay at home.']],
  ['He was playing football when it started to rain.', ['He was playing basketball when it started to rain.', 'He played football when it started to rain.', 'He was playing football when it stopped raining.']],
  ['The story was so interesting that I read it twice.', ['The story was so boring that I read it twice.', 'The story was so interesting that I read it once.', 'The book was so interesting that I read it twice.']],
  ['You should brush your teeth twice a day.', ['You should brush your teeth once a day.', 'You should wash your face twice a day.', 'You should brush your teeth three times a day.']],
  ['It is important to keep our environment clean.', ['It is important to keep our classroom clean.', 'It is easy to keep our environment clean.', 'It is important to keep our environment dirty.']],
  ['The spaceship will travel to Mars in the future.', ['The spaceship will travel to the Moon in the future.', 'The spaceship travelled to Mars in the past.', 'The rocket will travel to Mars in the future.']],
]

export function genFlyersSent(): Question[] {
  return shuffle(FLYERS_SENT).slice(0, 10).map(([sent, wrong]) =>
    enQ({ prompt: '听一听，选出你听到的句子', big: '👂', speak: sent, options: opts(sent, wrong), answer: sent, explain: `你听到的句子是「${sent}」` })
  )
}

/* ============ 语法启蒙 ============ */

export const GRAMMAR_BE: [string, string, string[]][] = [
  ['I', 'am', ['is', 'are', 'be']],
  ['You', 'are', ['is', 'am', 'be']],
  ['He', 'is', ['am', 'are', 'be']],
  ['She', 'is', ['am', 'are', 'be']],
  ['It', 'is', ['am', 'are', 'be']],
  ['We', 'are', ['is', 'am', 'be']],
  ['They', 'are', ['is', 'am', 'be']],
  ['The cat', 'is', ['am', 'are', 'be']],
  ['The cats', 'are', ['is', 'am', 'be']],
  ['My mother', 'is', ['am', 'are', 'be']],
]

export function genGrammarBe(): Question[] {
  return shuffle(GRAMMAR_BE).slice(0, 10).map(([sub, verb, wrong]) =>
    enQ({
      prompt: '选出正确的 be 动词',
      big: `${sub} ____ happy.`,
      options: opts(verb, wrong),
      answer: verb,
      explain: `${sub} 是${sub === 'I' ? '第一人称单数' : sub === 'You' || sub === 'We' || sub === 'They' || sub === 'The cats' ? '复数/第二人称' : '第三人称单数'}，用 ${verb}。`,
    })
  )
}

export const GRAMMAR_TENSE: [string, string, string[]][] = [
  ['I ____ to school yesterday.', 'went', ['go', 'goes', 'going']],
  ['She ____ TV every day.', 'watches', ['watch', 'watched', 'watching']],
  ['They ____ football now.', 'are playing', ['play', 'played', 'plays']],
  ['We ____ a picnic tomorrow.', 'will have', ['have', 'had', 'having']],
  ['He ____ his homework last night.', 'did', ['does', 'do', 'doing']],
  ['The bird ____ in the sky now.', 'is flying', ['flies', 'flew', 'fly']],
  ['My father ____ to work by car every day.', 'goes', ['go', 'went', 'going']],
  ['We ____ a good time at the party last week.', 'had', ['have', 'has', 'having']],
  ['Look! The children ____ in the park.', 'are playing', ['play', 'played', 'plays']],
  ['I ____ my grandma next week.', 'will visit', ['visit', 'visited', 'visiting']],
]

export function genGrammarTense(): Question[] {
  return shuffle(GRAMMARS_TENSE_SAFE()).slice(0, 10).map(([sent, verb, wrong]) =>
    enQ({
      prompt: '选出正确的动词形式',
      big: sent,
      options: opts(verb, wrong),
      answer: verb,
      explain: `根据时间标志词判断时态，正确答案是「${verb}」。`,
    })
  )
}
function GRAMMARS_TENSE_SAFE() { return GRAMMAR_TENSE }

export const GRAMMAR_PLURAL: [string, string, string[]][] = [
  ['apple', 'apples', ['applees', 'appls', 'apple']],
  ['box', 'boxes', ['boxs', 'box', 'boxeses']],
  ['city', 'cities', ['citys', 'city', 'cityes']],
  ['baby', 'babies', ['babys', 'baby', 'babyes']],
  ['knife', 'knives', ['knifes', 'knife', 'knifes']],
  ['child', 'children', ['childs', 'child', 'childes']],
  ['foot', 'feet', ['foots', 'foot', 'feetes']],
  ['tooth', 'teeth', ['tooths', 'tooth', 'teethes']],
  ['mouse', 'mice', ['mouses', 'mouse', 'mices']],
  ['sheep', 'sheep', ['sheeps', 'sheepes', 'sheep']],
]

export function genGrammarPlural(): Question[] {
  return shuffle(GRAMMAR_PLURAL).slice(0, 10).map(([noun, plural, wrong]) =>
    enQ({
      prompt: `「${noun}」的复数形式是？`,
      big: noun,
      speak: noun,
      options: opts(plural, wrong),
      answer: plural,
      explain: `「${noun}」的复数是 ${plural}。`,
    })
  )
}

/* ============ 阅读理解（英语） ============ */

export const EN_READINGS: { title: string; text: string; question: string; answer: string; wrong: string[] }[] = [
  { title: 'My Family', text: 'I have a happy family. My father is a doctor. My mother is a teacher. I have a little brother. He is only three years old.', question: 'What does the father do?', answer: 'He is a doctor.', wrong: ['He is a teacher.', 'He is a farmer.', 'He is a driver.'] },
  { title: 'My Day', text: 'I get up at seven. I have breakfast at seven thirty. I go to school at eight. I have four classes in the morning and two in the afternoon.', question: 'How many classes does the writer have a day?', answer: 'Six.', wrong: ['Four.', 'Two.', 'Eight.'] },
  { title: 'My Pet', text: 'I have a pet dog. Its name is Doudou. It is white and black. It likes eating bones. It can run fast and swim well.', question: 'What colour is Doudou?', answer: 'White and black.', wrong: ['White.', 'Black.', 'Brown.'] },
  { title: 'Seasons', text: 'There are four seasons in a year. Spring is warm. Summer is hot. Autumn is cool. Winter is cold. I like autumn best.', question: 'Which season does the writer like best?', answer: 'Autumn.', wrong: ['Spring.', 'Summer.', 'Winter.'] },
]

export function genEnReading(): Question[] {
  return shuffle(EN_READINGS).slice(0, 4).map((r) =>
    enQ({
      prompt: `读短文《${r.title}》`,
      big: r.text,
      speak: r.text,
      options: opts(r.answer, r.wrong),
      answer: r.answer,
      explain: `短文里说：${r.text}`,
    })
  )
}

/* ============ KET 语法与阅读 ============ */

export const KET_GRAMMAR: [string, string, string[]][] = [
  ['There ____ a book on the desk.', 'is', ['are', 'be', 'am']],
  ['There ____ some apples in the bag.', 'are', ['is', 'be', 'am']],
  ['____ you like swimming?', 'Do', ['Does', 'Is', 'Are']],
  ['____ she like reading?', 'Does', ['Do', 'Is', 'Are']],
  ['I ____ my homework at the moment.', 'am doing', ['do', 'did', 'does']],
  ['They ____ to the park last Sunday.', 'went', ['go', 'goes', 'going']],
  ['We ____ a film tomorrow evening.', 'are going to watch', ['watch', 'watched', 'watches']],
  ['He ____ in Beijing for ten years.', 'has lived', ['lived', 'lives', 'is living']],
  ['You ____ smoke here. It is dangerous.', 'must not', ['need not', 'do not', 'will not']],
  ['This is ____ interesting book.', 'an', ['a', 'the', 'some']],
]

export function genKetGrammar(): Question[] {
  return shuffle(KET_GRAMMAR).slice(0, 10).map(([sent, ans, wrong]) =>
    enQ({
      prompt: '选出正确的答案',
      big: sent,
      options: opts(ans, wrong),
      answer: ans,
      explain: `正确答案是「${ans}」。`,
    })
  )
}

export const KET_READINGS: { title: string; text: string; question: string; answer: string; wrong: string[] }[] = [
  { title: 'A Letter', text: 'Dear Tom, Thank you for your letter. I am glad you like your new school. My new school is big and beautiful. There are thirty students in my class. My favourite subject is science. Write soon, Li Ming', question: 'What is Li Ming\'s favourite subject?', answer: 'Science.', wrong: ['English.', 'Maths.', 'PE.'] },
  { title: 'A Poster', text: 'SCHOOL TRIP To the Science Museum Date: Friday, 15th June Meet at: School gate at 8:30 am Bring: Lunch and a drink Cost: 5 pounds', question: 'What time should students meet?', answer: 'At 8:30 am.', wrong: ['At 8:00 am.', 'At 9:00 am.', 'At 8:30 pm.'] },
  { title: 'An Email', text: 'Hi Sarah, I am having a party at my house on Saturday. It starts at 6 pm. Can you bring some music? My mum is making a big cake. See you there, Emma', question: 'Who is making the cake?', answer: 'Emma\'s mum.', wrong: ['Sarah.', 'Emma.', 'Sarah\'s mum.'] },
  { title: 'A Note', text: 'Mum, I have gone to the library with Anna. I will be back at 5 o\'clock. Dinner is in the kitchen. Please feed the cat. Love, Jack', question: 'Where has Jack gone?', answer: 'To the library.', wrong: ['To school.', 'To the park.', 'To Anna\'s house.'] },
]

export function genKetReading(): Question[] {
  return shuffle(KET_READINGS).slice(0, 4).map((r) =>
    enQ({
      prompt: `读短文《${r.title}》`,
      big: r.text,
      speak: r.text,
      options: opts(r.answer, r.wrong),
      answer: r.answer,
      explain: `短文里说：${r.text}`,
    })
  )
}
