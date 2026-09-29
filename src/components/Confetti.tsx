import { useEffect, useRef } from 'react'

const COLORS = ['#E86A9C', '#F08E4C', '#3E9DB8', '#7E649E', '#5C9A4E', '#E8A81C']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rot: number
  vr: number
  shape: 'rect' | 'circle'
  life: number
}

/** 撒花庆祝（canvas 实现） */
export default function Confetti({ fire }: { fire: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!fire || fired.current) return
    fired.current = true
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    ctx.scale(dpr, dpr)

    const W = window.innerWidth
    const parts: Particle[] = []
    // 从底部两侧发射
    for (const side of [0.2, 0.8]) {
      for (let i = 0; i < 90; i++) {
        parts.push({
          x: W * side,
          y: window.innerHeight + 10,
          vx: (Math.random() - 0.5) * 14 + (side === 0.2 ? 3 : -3),
          vy: -(Math.random() * 14 + 10),
          size: Math.random() * 8 + 5,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.3,
          shape: Math.random() > 0.4 ? 'rect' : 'circle',
          life: 1,
        })
      }
    }

    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = now - start
      ctx.clearRect(0, 0, W, window.innerHeight)
      let alive = false
      for (const p of parts) {
        p.vy += 0.32
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        if (t > 2200) p.life = Math.max(0, p.life - 0.03)
        if (p.life > 0 && p.y < window.innerHeight + 40) alive = true
        ctx.save()
        ctx.globalAlpha = p.life
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66)
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
      if (alive) raf = requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, W, window.innerHeight)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [fire])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden
    />
  )
}
