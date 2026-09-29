import type { Pack } from '@/types'
import { PACKS } from './bank'
import { MATH_WEEK_PACKS } from './planMath'
import { CHINESE_WEEK_PACKS } from './planChinese'
import { ENGLISH_WEEK_PACKS } from './planEnglish'

/** 周计划题包：6 个年级 × 上下学期 × 20 周 × 三科 */
export const WEEK_PACKS: Pack[] = [
  ...MATH_WEEK_PACKS,
  ...CHINESE_WEEK_PACKS,
  ...ENGLISH_WEEK_PACKS,
]

/** 全部题包 = 专项题包 + 周计划题包 */
export const ALL_PACKS: Pack[] = [...PACKS, ...WEEK_PACKS]
