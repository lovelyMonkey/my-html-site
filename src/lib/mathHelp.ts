import type { Question } from '@/types'

export interface MathHelp {
  hint: string
  steps: string[]
}

const fmt = (n: number) => String(Number(n.toFixed(8)))

/** 精确匹配简单算式；其他题型使用题目自带的解析，不猜测运算。 */
export function getMathHelp(q: Question): MathHelp {
  const expression = q.big?.match(/^(\d+(?:\.\d+)?)\s*([+−\-×÷])\s*(\d+(?:\.\d+)?)\s*=\s*\?$/)
  if (expression && !q.answer.includes('余')) {
    const [, left, op, right] = expression
    const a = Number(left), b = Number(right)
    const decimal = left.includes('.') || right.includes('.')
    if (op === '+' || op === '−' || op === '-') {
      const add = op === '+'
      const sign = add ? '+' : '−'
      if (decimal) {
        const places = Math.max(left.split('.')[1]?.length ?? 0, right.split('.')[1]?.length ?? 0)
        const scale = 10 ** places
        const x = Math.round(a * scale), y = Math.round(b * scale)
        return {
          hint: '把小数点对齐，相同数位相加减；位数不够可以在末尾补 0。',
          steps: [`把两个数都看成以 ${fmt(1 / scale)} 为单位的数：${left} 有 ${x} 个，${right} 有 ${y} 个。`, `先算 ${x} ${sign} ${y} = ${add ? x + y : x - y}。`, `再换回原来的单位：${add ? x + y : x - y} ÷ ${scale} = ${q.answer}。`],
        }
      }
      if (a <= 10 && b <= 10 && (add ? a + b <= 10 : true)) {
        return {
          hint: add ? `先摆 ${a} 个小圆点，再添上 ${b} 个，数一数一共有几个。` : `先摆 ${a} 个小圆点，划掉 ${b} 个，数一数剩下几个。`,
          steps: [add ? `从 ${a} 开始，接着往后数 ${b} 次：${Array.from({ length: b }, (_, i) => a + i + 1).join('、') || '不用再数'}。` : `从 ${a} 开始，往回数 ${b} 次：${Array.from({ length: b }, (_, i) => a - i - 1).join('、') || '不用再数'}。`, `${a} ${sign} ${b} = ${q.answer}。`],
        }
      }
      if (add && a < 10 && b < 10) {
        const gap = 10 - a
        return { hint: `先想 ${a} 再加几就到 10，把另一个数拆开来凑十。`, steps: [`${a} 加 ${gap} 到 10，把 ${b} 拆成 ${gap} 和 ${b - gap}。`, `先算 ${a} + ${gap} = 10，再算 10 + ${b - gap} = ${q.answer}。`] }
      }
      const tens = Math.floor(b / 10) * 10, ones = b % 10
      if (!add && a % 10 < ones) {
        const first = a - tens, unit = a % 10
        return { hint: '减到整十数，再减剩下的部分。可以把要减的数拆开。', steps: [`先减整十部分：${a} − ${tens} = ${first}。`, `还要减 ${ones}，把它拆成 ${unit} 和 ${ones - unit}。先算 ${first} − ${unit} = ${first - unit}。`, `再算 ${first - unit} − ${ones - unit} = ${q.answer}。`] }
      }
      return { hint: '把第二个数拆成整十数和个位数，分两步算。', steps: [`把 ${b} 拆成 ${tens} 和 ${ones}。`, `先算 ${a} ${sign} ${tens} = ${add ? a + tens : a - tens}。`, `再算 ${add ? a + tens : a - tens} ${sign} ${ones} = ${q.answer}。`] }
    }
    if (op === '×') {
      if (decimal) {
        const places = (left.split('.')[1]?.length ?? 0) + (right.split('.')[1]?.length ?? 0)
        const x = Number(left.replace('.', '')), y = Number(right.replace('.', ''))
        return { hint: '先当作整数相乘，再数两个因数一共有几位小数。', steps: [`先算 ${x} × ${y} = ${x * y}。`, `两个因数一共有 ${places} 位小数，积从右往左数 ${places} 位点上小数点。`, `得到 ${q.answer}。`] }
      }
      if (a <= 9 && b <= 9) return { hint: `乘法表示相同的数连加：可以画 ${a} 组，每组 ${b} 个。`, steps: [`${a} 个 ${b} 相加：${Array(a).fill(b).join(' + ')} = ${q.answer}。`, `所以 ${a} × ${b} = ${q.answer}。`] }
      const tens = Math.floor(b / 10) * 10, ones = b % 10
      if (tens) return { hint: '把两位数拆成整十数和个位数，分别相乘再合起来。', steps: [`${b} = ${tens} + ${ones}。`, `${a} × ${tens} = ${a * tens}，${a} × ${ones} = ${a * ones}。`, `${a * tens} + ${a * ones} = ${q.answer}。`] }
      const high = Math.floor(a / 10) * 10, low = a % 10
      return { hint: '把多位数拆开，分别乘，再把结果相加。', steps: [`${a} = ${high} + ${low}。`, `${high} × ${b} = ${high * b}，${low} × ${b} = ${low * b}。`, `${high * b} + ${low * b} = ${q.answer}。`] }
    }
    if (decimal) {
      const places = left.split('.')[1]?.length ?? 0
      const scale = 10 ** places
      const units = Math.round(a * scale)
      return { hint: '先把小数看成若干个十分之一或百分之一，平均分后再换回原来的数。', steps: [`${a} 是 ${units} 个 ${fmt(1 / scale)}。`, `${units} ÷ ${b} = ${fmt(units / b)}，每份有 ${fmt(units / b)} 个 ${fmt(1 / scale)}。`, `所以 ${a} ÷ ${b} = ${q.answer}。`] }
    }
    const quotient = Number(q.answer), tens = Math.floor(quotient / 10) * 10
    return { hint: `除法就是平均分。也可以把被除数拆成 ${b} 的倍数，分别除再合起来。`, steps: tens ? [`把 ${a} 拆成 ${b * tens} 和 ${a - b * tens}，它们都能被 ${b} 整除。`, `${b * tens} ÷ ${b} = ${tens}，${a - b * tens} ÷ ${b} = ${quotient - tens}。`, `把两部分相加：${tens} + ${quotient - tens} = ${q.answer}。`, `验算：${q.answer} × ${b} = ${a}。`] : [`想乘法口诀：${b} × ${q.answer} = ${a}。`, `所以 ${a} ÷ ${b} = ${q.answer}。`] }

  }

  const blank = q.big?.match(/^(\d+|□)\s*([+−-])\s*(\d+|□)\s*=\s*(\d+)$/)
  if (blank) {
    const [, a, op, b, total] = blank
    const known = a === '□' ? b : a
    const calculation = op === '+' ? `${total} − ${known}` : a === '□' ? `${total} + ${b}` : `${a} − ${total}`
    return { hint: op === '+' ? '总数减去已知的一部分，就是缺少的另一部分。' : '原来的数减去拿走的数等于剩下的数，想想题目缺的是哪一个。', steps: [`用相反的运算求空格：${calculation} = ${q.answer}。`, `把 ${q.answer} 放回去验算：${q.big!.replace('□', q.answer)}。`] }
  }

  if (q.prompt.includes('数独') && q.big) {
    const cells: string[] = q.big.match(/[1-4]|❓/g) ?? []
    const index = cells.indexOf('❓')
    if (cells.length === 16 && index >= 0) {
      const row = Math.floor(index / 4), col = index % 4
      const present = cells.slice(row * 4, row * 4 + 4).filter((v) => v !== '❓')
      const column = [0, 1, 2, 3].map((r) => cells[r * 4 + col]).filter((v) => v !== '❓')
      return { hint: '先看问号所在的一行，1、2、3、4 中少了哪个数？再检查列和小方格。', steps: [`第 ${row + 1} 行已经有 ${present.join('、')}，缺少 ${q.answer}。`, `第 ${col + 1} 列已经有 ${column.join('、')}，填 ${q.answer} 也不会重复。`, `把 ${q.answer} 填入问号处，检查所在的 2×2 小方格也有 1、2、3、4。`] }
    }
  }

  const text = `${q.prompt} ${q.big ?? ''}`
  const rules: [RegExp, string][] = [
    [/约分/, '找一个分子和分母都能整除的数，同时去除；一直约到没有大于 1 的公因数。'],
    [/\d+\/\d+.*[+−-].*\d+\/\d+/, '分母相同才能直接加减分子。分母不同，先通分；最后检查能不能约分。'],
    [/分数除法|\d+\/\d+.*÷/, '除以一个非零分数，等于乘它的倒数：把第二个分数的分子、分母交换位置。'],
    [/分数乘法|\d+\/\d+.*×/, '分子乘分子、分母乘分母；有公因数时可以先约分。'],
    [/□|解方程/, '把空格或 x 看作一个暂时不知道的数。想一想用哪个相反的运算能把它找出来，再代回去检查。'],
    [/○.*\d|比大小|填上 >/, '两边有算式就先算出结果，再比较大小。大口朝较大的数，相等时用等号。'],
    [/余数|商和余/, '找除数的倍数：不能超过被除数。剩下的数就是余数，而且必须比除数小。'],
    [/圆柱.*表面积/, '把圆柱展开：一个长方形侧面，加上两个圆形底面。侧面面积等于底面周长乘高。'],
    [/圆锥.*体积/, '先算底面积乘高，再除以 3；圆锥体积是等底等高圆柱体积的三分之一。'],
    [/体积/, '想象用小方块一层层堆起来：先算一层的底面积，再乘高。'],
    [/周长/, '周长是沿边绕一圈的长度。先看是什么图形，再把一圈的边长合起来。'],
    [/面积/, '面积表示铺满一个面有多大。先认清图形，选面积公式，再代入长度。'],
    [/平均数/, '先把所有数相加得到总数，再除以一共有几个数。'],
    [/百分|%|打.*折/, '百分之几就是一百份中的几份。先找到总量，再乘所占的比例；打八折就是原价的 80%。'],
    [/比例|按.*分配/, '先分清共有几份、每份是多少，再求题目要的那一份。比例两边对应的数要一起扩大或缩小。'],
    [/因数|质数|合数/, '用整数去除这个数，看能不能没有余数。只有 1 和它本身两个因数的数是质数。'],
    [/鸡和兔/, '先假设全是鸡。每把一只鸡换成兔，就多出 2 条腿。'],
    [/两个数的和.*差/, '画一长一短两条线。把差去掉后两条一样长，再平均分。'],
    [/相遇/, '两车相向走，每小时缩短的距离等于两车速度相加。'],
    [/追上/, '追赶时，每小时缩短的距离等于快的速度减去慢的速度。'],
    [/每人分.*多出/, '比较两种分法：从多出来到还不够，一共相差多少？每个人多分了多少？'],
    [/种树|锯成/, '画一条线标出分段的位置。注意段数和端点数不同；两端是否都算要看题目。'],
    [/从前面数.*从后面数/, '前面数和后面数都包括了自己，合起来时自己被重复数了一次。'],
    [/规律|重复排列/, '先比较相邻的数或图形。看看是每次增加、减少，还是几个一组重复出现。'],
    [/数独/, '逐行、逐列检查 1、2、3、4，找出问号所在行缺少的数字，再检查所在列和小方格。'],
    [/时针|分针|几时|分钟|秒/, '钟面一大格是 5 分钟；换算时记住 1 时 = 60 分，1 分 = 60 秒。看清问的是时刻还是经过的时间。'],
    [/单位|厘米|千米|千克|吨|几角|几分/, '先看问的是什么量，再统一单位。长度、重量和钱的单位不能混在一起。'],
    [/对称/, '想象沿一条线把图形对折，两边能完全重合，这条线才是对称轴。'],
    [/形状|三角形|正方形|长方形|圆柱|正方体|长方体|角|平行/, '先观察边、角或面的特点，再和图形的定义逐条对照。可以自己画一画。'],
    [/可能|一定|不可能/, '把所有可能的情况想一遍：每次都发生才是一定，完全不会发生才是不可能。'],
    [/数对|第.*列|第.*行/, '数对先写列、再写行。移动时只改变对应方向的那个数。'],
    [/统计|折线|扇形/, '先读清每个数表示什么。比较多少看大小，变化看上升下降，占比看部分和整体。'],
    [/几种|握手|比赛|两位数/, '按顺序把可能情况列出来，避免重复，也别漏掉。组成两位数时，十位不能是 0。'],
    [/保留|精确/, '找到要保留的数位，看它右边的一位：小于 5 舍去，大于等于 5 就向前进 1。'],
    [/小数|小数位|百分位/, '先认清数位：小数点后第一位是十分位，第二位是百分位。比较大小要对齐数位。'],
    [/数一数|几个|几只|几颗/, '按顺序一个一个数，数过的做个记号。增加用加法，去掉或比较相差多少用减法。'],
    [/[×÷+−]/, '有括号先算括号里；没有括号先乘除后加减，同一级运算从左往右算。'],
  ]
  const hint = rules.find(([pattern]) => pattern.test(text))?.[1]
    ?? '把题目给出的条件逐条找出来，结合下面的知识点推一推，再检查每个选项是否符合。'
  return { hint, steps: [...(q.explain?.split(/[。；]/).map((s) => s.trim()).filter(Boolean) ?? []), `所以本题选择「${q.answer}」。`] }
}
