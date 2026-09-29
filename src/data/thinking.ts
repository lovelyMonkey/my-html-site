import type { ThinkingProblem, ThinkingTopic, ThinkingStep } from '@/types/thinking'

export const THINKING_TOPICS: { id: ThinkingTopic; title: string; icon: string; desc: string; skill: string }[] = [
  { id: 'pattern', title: '数字小火车', icon: '🚂', desc: '找一找，每次多了几？', skill: '找规律' },
  { id: 'queue', title: '排队小侦探', icon: '🐥', desc: '自己为什么只能算一次？', skill: '排队与位置' },
  { id: 'cuts', title: '小熊切纸条', icon: '✂️', desc: '切几刀，能变成几段？', skill: '间隔问题' },
  { id: 'counting', title: '搭配小衣柜', icon: '👕', desc: '按顺序数，不漏也不重复', skill: '有序计数' },
  { id: 'logic', title: '谁站最前面', icon: '🔍', desc: '把两条线索连起来', skill: '简单推理' },
]

function options(answer: number) {
  return [answer - 1, answer, answer + 1, answer + 2].filter((n) => n >= 0).map(String)
}
const step = (title: string, text: string, ask: string, opts: string[], answer: string): ThinkingStep => ({ title, text, ask, options: opts, answer })

/** 有限题池便于穷举核验；展示顺序由会话生成器打乱，内容标识始终稳定。 */
export function thinkingPool(topic: ThinkingTopic): ThinkingProblem[] {
  const pool: ThinkingProblem[] = []
  if (topic === 'pattern') {
    for (let start = 1; start <= 5; start++) for (let jump = 1; jump <= 3; jump++) {
      const nums = Array.from({ length: 4 }, (_, i) => start + i * jump)
      const answer = start + 4 * jump
      pool.push({ key: `pattern-${start}-${jump}`, topic, prompt: `数字小火车：${nums.join('、')}。每次增加相同的数，下一个数是多少？`, options: options(answer), answer: String(answer), hint: '看看第一节到第二节车厢多了几，再检查后面的车厢。', diagram: { kind: 'pattern', numbers: nums, jump }, steps: [
        step('先看相邻两个数', `从 ${nums[0]} 到 ${nums[1]}，多了 ${jump}。可以用 ${nums[1]} 减 ${nums[0]} 来检查。`, '第一节到第二节多了几？', options(jump), String(jump)),
        step('再检查一次', `从 ${nums[1]} 到 ${nums[2]}，从 ${nums[2]} 到 ${nums[3]}，也都多了 ${jump}。所以每次都加 ${jump}。`, '后面也都增加同样多吗？', ['是的', '不是'], '是的'),
        step('照着规律往前走', `在最后的 ${nums[3]} 上再加 ${jump}：${nums[3]} 加 ${jump} 等于 ${answer}。`, '下一节车厢写几？', options(answer), String(answer)),
      ] })
    }
  } else if (topic === 'queue') {
    for (let front = 2; front <= 5; front++) for (let back = 2; back <= 5; back++) {
      const answer = front + back - 1
      pool.push({ key: `queue-${front}-${back}`, topic, prompt: `小朋友排成一队。小黄从前往后数是第 ${front} 个，从后往前数是第 ${back} 个。一共有几个小朋友？`, options: options(answer), answer: String(answer), hint: '两次数数都数到了小黄，合起来的时候，他会不会被算了两次？', diagram: { kind: 'queue', front, back }, steps: [
        step('从前面找到小黄', `从前面数到小黄有 ${front} 人，这里面包括小黄自己。图上的星星就是小黄。`, '从前面数的人里，包括小黄吗？', ['包括', '不包括'], '包括'),
        step('发现重复的一个', `从后面数的 ${back} 人也包括小黄。把 ${front} 和 ${back} 相加，小黄被算了两次。`, '小黄被算了几次？', ['1 次', '2 次', '3 次'], '2 次'),
        step('把多算的一次去掉', `小黄只有一个人，所以减去多算的一次：${front} 加 ${back} 等于 ${front + back}，再减 1，得到 ${answer} 人。`, '这一队一共有几人？', options(answer), String(answer)),
      ] })
    }
  } else if (topic === 'cuts') {
    for (let pieces = 3; pieces <= 9; pieces++) {
      const answer = pieces - 1
      pool.push({ key: `cuts-${pieces}`, topic, prompt: `小熊把一条纸带切成 ${pieces} 段。纸带不折叠、不叠放，每次只切一处，需要切几刀？`, options: options(answer), answer: String(answer), hint: '不切时就有 1 段。切一刀，会增加几段呢？', diagram: { kind: 'cuts', pieces }, steps: [
        step('还没切就有一段', '完整的纸带本来就是 1 段，这一段不需要切。', '还没切时有几段？', ['0', '1', '2'], '1'),
        step('一刀只多一段', '在一段纸带中间切一刀，这一段变成两段，所以总数只增加 1 段。', '每切一刀，总共增加几段？', ['1', '2', '3'], '1'),
        step('去掉原来的一段', `要从 1 段变成 ${pieces} 段，需要增加 ${answer} 段。所以切 ${pieces} 减 1，也就是 ${answer} 刀。图中虚线就是切口。`, '一共需要几刀？', options(answer), String(answer)),
      ] })
    }
  } else if (topic === 'counting') {
    for (let tops = 2; tops <= 4; tops++) for (let bottoms = 2; bottoms <= 4; bottoms++) {
      const answer = tops * bottoms
      pool.push({ key: `counting-${tops}-${bottoms}`, topic, prompt: `有 ${tops} 件不同的上衣和 ${bottoms} 条不同的裤子。每次选 1 件上衣和 1 条裤子，一共有几种搭配？`, options: options(answer), answer: String(answer), hint: '先固定一件上衣，给它配上每一条裤子，再换下一件上衣。', diagram: { kind: 'counting', tops, bottoms }, steps: [
        step('先固定第一件上衣', `第一件上衣，可以分别搭配 ${bottoms} 条裤子，所以这一件有 ${bottoms} 种搭配。`, '一件上衣有几种搭配？', options(bottoms), String(bottoms)),
        step('换上衣，按顺序数', `每一件上衣都能配这 ${bottoms} 条裤子。一共 ${tops} 件上衣，就有 ${tops} 组搭配。每行固定一件上衣，不会重复。`, '一共有几组搭配？', options(tops), String(tops)),
        step('把每组的数量合起来', `${tops} 个 ${bottoms} 相加：${Array(tops).fill(bottoms).join(' 加 ')} 等于 ${answer}。也就是 ${tops} 乘 ${bottoms} 等于 ${answer} 种。`, '一共有几种搭配？', options(answer), String(answer)),
      ] })
    }
  } else {
    const names = ['小兔', '小熊', '小猫']
    for (const a of names) for (const b of names.filter((n) => n !== a)) {
      const c = names.find((n) => n !== a && n !== b)!
      for (const askFirst of [true, false]) {
        const answer = askFirst ? a : c
        pool.push({ key: `logic-${a}-${b}-${askFirst ? 'first' : 'last'}`, topic, prompt: `三个小动物排成一队。${a}在${b}前面，${b}在${c}前面。谁站在最${askFirst ? '前' : '后'}面？`, options: [...names], answer, hint: `两条线索里都有${b}。把两条线索接在一起，就能排出顺序。`, diagram: { kind: 'logic', order: [a, b, c] }, steps: [
          step('先看第一条线索', `${a}在${b}前面，先把${a}放前面，${b}放后面。`, `${a}和${b}谁在前面？`, [a, b], a),
          step('接上第二条线索', `${b}又在${c}前面，所以把${c}接在${b}后面。${b}在中间。`, '谁在中间？', [...names], b),
          step('沿着队伍看一遍', `从前往后是${a}、${b}、${c}。最${askFirst ? '前' : '后'}面的是${answer}。`, `谁在最${askFirst ? '前' : '后'}面？`, [...names], answer),
        ] })
      }
    }
  }
  return pool
}

export function shuffleThinking<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function pickThinkingProblems(topic: ThinkingTopic, seen: Set<string>): ThinkingProblem[] {
  const pool = shuffleThinking(thinkingPool(topic))
  // 优先给孩子没练过的题。例题与三道练习不重复。
  const ordered = [...pool.filter((q) => !seen.has(q.key)), ...pool.filter((q) => seen.has(q.key))]
  // 把未见过的题优先留给三道独立练习，第四道用作例题。
  return [ordered[3], ...ordered.slice(0, 3)].map((q) => ({
    ...q, options: shuffleThinking(q.options), steps: q.steps.map((s) => ({ ...s, options: shuffleThinking(s.options) })),
  }))
}
