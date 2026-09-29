import type { Phoneme } from '@/data/phonics'

/**
 * 侧面口腔 SVG 图，根据音标的口型参数绘制。
 * 展示：下巴开合、嘴唇圆扁、舌头高低前后、舌尖位置、声带振动。
 */
export default function MouthDiagram({ p, size = 200 }: { p: Phoneme; size?: number }) {
  // 嘴巴开口高度（下巴开合）
  const mouthOpen = 8 + p.jaw * 38
  // 嘴唇形状：圆唇时上下唇向前突出并变窄
  const lipW = 30 - p.lipRound * 12
  const lipH = mouthOpen / 2
  // 舌头：高度和前后位置
  const tongueY = 78 - p.tongueHeight * 30
  const tongueX = 78 + p.tongueBack * 22
  // 舌尖位置
  const tipX = p.tongueTip === 'between' ? 56 : p.tongueTip === 'teeth' ? 60 : p.tongueTip === 'alveolar' ? 66 : tongueX - 22
  const tipY = p.tongueTip === 'between' ? 50 - mouthOpen * 0.2 : p.tongueTip === 'teeth' ? 46 : p.tongueTip === 'alveolar' ? 44 : tongueY

  return (
    <svg viewBox="0 0 160 120" width={size} height={size * 0.75} role="img" aria-label={`${p.symbol} 口型图`} className="mx-auto">
      {/* 头部轮廓 */}
      <path d="M 30 20 Q 20 50 28 78 Q 34 100 55 105 L 90 105 Q 100 100 102 85" fill="#FFE3C2" stroke="#E8B48A" strokeWidth="2" />
      {/* 鼻子 */}
      <path d="M 28 50 Q 22 56 28 62" fill="none" stroke="#E8B48A" strokeWidth="2" strokeLinecap="round" />
      {/* 口腔内部 */}
      <ellipse cx="70" cy={62 + mouthOpen * 0.15} rx={lipW + 12} ry={mouthOpen * 0.7} fill="#C25E5E" />
      {/* 上牙 */}
      <rect x="52" y={54 - mouthOpen * 0.3} width="26" height="6" rx="2" fill="#fff" stroke="#ddd" strokeWidth="0.5" />
      {/* 下牙（开口大时才看得到） */}
      {p.jaw > 0.4 && <rect x="56" y={66 + mouthOpen * 0.45} width="20" height="5" rx="2" fill="#fff" stroke="#ddd" strokeWidth="0.5" />}
      {/* 舌头 */}
      <path
        d={`M ${tipX} ${tipY} Q ${tongueX - 10} ${tongueY - 6} ${tongueX + 18} ${tongueY} Q ${tongueX + 26} ${tongueY + 4} ${tongueX + 20} ${tongueY + 12} Q ${tongueX - 5} ${tongueY + 14} ${tipX - 4} ${tipY + 8} Z`}
        fill="#E87A7A"
        stroke="#D16A6A"
        strokeWidth="1.5"
      />
      {/* 舌尖高亮 */}
      {(p.tongueTip === 'between' || p.tongueTip === 'teeth' || p.tongueTip === 'alveolar') && (
        <circle cx={tipX} cy={tipY} r="3.5" fill="#FF9D9D" stroke="#C25E5E" strokeWidth="1" />
      )}
      {/* 上唇 */}
      <path
        d={`M ${50 - p.lipRound * 4} ${58 - lipH * 0.4} Q 70 ${54 - lipH - p.lipRound * 3} ${90 + p.lipRound * 4} ${58 - lipH * 0.4}`}
        fill="none"
        stroke="#D96A6A"
        strokeWidth={3.5 + p.lipRound * 1.5}
        strokeLinecap="round"
      />
      {/* 下唇 */}
      <path
        d={`M ${50 - p.lipRound * 4} ${64 + lipH * 0.5} Q 70 ${70 + lipH + p.lipRound * 2} ${90 + p.lipRound * 4} ${64 + lipH * 0.5}`}
        fill="none"
        stroke="#D96A6A"
        strokeWidth={3.5 + p.lipRound * 1.5}
        strokeLinecap="round"
      />
      {/* 嘴角微笑 */}
      {p.lipSmile > 0.3 && (
        <>
          <path d={`M ${48 - p.lipSmile * 4} ${60} q -3 -2 -4 -4`} fill="none" stroke="#D96A6A" strokeWidth="2" strokeLinecap="round" />
          <path d={`M ${92 + p.lipSmile * 4} ${60} q 3 -2 4 -4`} fill="none" stroke="#D96A6A" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {/* 声带振动标识 */}
      {p.vocal && (
        <g transform="translate(108, 88)">
          <path d="M 0 0 q 3 -4 6 0 q 3 4 6 0" fill="none" stroke="#5C9A4E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 0 6 q 3 -4 6 0 q 3 4 6 0" fill="none" stroke="#5C9A4E" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <text x="0" y="18" fontSize="7" fill="#5C9A4E" fontWeight="bold">声带振动</text>
        </g>
      )}
      {/* 气流标识（清辅音） */}
      {!p.vocal && (
        <g transform="translate(30, 70)">
          <path d="M 0 0 q -4 -2 -8 0" fill="none" stroke="#3E9DB8" strokeWidth="2" strokeLinecap="round" />
          <path d="M 0 6 q -5 -2 -10 0" fill="none" stroke="#3E9DB8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <path d="M 0 12 q -4 -2 -8 0" fill="none" stroke="#3E9DB8" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <text x="-14" y="24" fontSize="7" fill="#3E9DB8" fontWeight="bold">吹气</text>
        </g>
      )}
    </svg>
  )
}
