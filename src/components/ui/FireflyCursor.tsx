"use client"

import { useEffect, useRef } from "react"

// ── Config ─────────────────────────────────────────────────────────────────
const N           = 5      // few fireflies — cursor-scale
const VANISH_DIST = 22     // px: fade to 0 within this radius of cursor
const STOP_DELAY  = 0.45   // seconds of stillness before converging

// ── Types ───────────────────────────────────────────────────────────────────
interface FF {
  x: number; y: number; vx: number; vy: number
  op: number      // current rendered opacity
  r: number       // dot radius 2-3 px
  hue: number     // firefly warm yellow-green
  phase: number   // oscillation offset
}

type S = "off" | "following" | "converging" | "aura" | "fog"

// ── Helpers ─────────────────────────────────────────────────────────────────
function spawn(cx: number, cy: number): FF[] {
  return Array.from({ length: N }, (_, i) => {
    const angle = (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.7
    const dist  = 50 + Math.random() * 30
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: 0, vy: 0, op: 0,
      r:     2 + Math.random(),
      hue:   64 + Math.random() * 16,
      phase: (i / N) * Math.PI * 2,
    }
  })
}

function belowHero(): boolean {
  return window.scrollY >= window.innerHeight * 0.82
}

// ── Component ────────────────────────────────────────────────────────────────
export function FireflyCursor() {
  const cvs   = useRef<HTMLCanvasElement>(null)
  const raf   = useRef(0)

  // All mutable state in refs — no React re-renders
  const ffs   = useRef<FF[]>([])
  const mx    = useRef(-400);  const my   = useRef(-400)
  const pmx   = useRef(-400);  const pmy  = useRef(-400)
  const state = useRef<S>("off")
  const stopT = useRef(0)
  const aura  = useRef<{ r: number; op: number } | null>(null)
  const fogOp = useRef(0)   // 0–1, fog fade-in progress
  const lastT = useRef(0)

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) return

    const canvas = cvs.current!
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    // ── Event handlers ─────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX;  my.current = e.clientY
      const ddx  = e.clientX - pmx.current
      const ddy  = e.clientY - pmy.current
      pmx.current = e.clientX; pmy.current = e.clientY

      if (!belowHero()) {
        if (state.current !== "off") { state.current = "off"; fogOp.current = 0; aura.current = null }
        return
      }

      const moved = ddx * ddx + ddy * ddy > 2
      if (moved) {
        stopT.current = 0
        if (state.current !== "following") {
          state.current = "following"
          fogOp.current = 0
          aura.current  = null
          ffs.current   = spawn(mx.current, my.current)
        }
      }
    }

    const onScroll = () => {
      if (!belowHero() && state.current !== "off") {
        state.current = "off";  fogOp.current = 0;  aura.current = null
      }
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("scroll",    onScroll, { passive: true })

    // ── Animation loop ─────────────────────────────────────────────────────
    const tick = (ts: number) => {
      const dt  = Math.min((ts - lastT.current) / 1000, 0.05)
      lastT.current = ts
      const sec = ts / 1000
      const ctx = canvas.getContext("2d")!
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const s  = state.current
      const cx = mx.current
      const cy = my.current

      // ── off: fade everything out ──────────────────────────────────────────
      if (s === "off") {
        fogOp.current = Math.max(0, fogOp.current - 3 * dt)
        raf.current = requestAnimationFrame(tick)
        return
      }

      // ── following: count stop time ────────────────────────────────────────
      if (s === "following") {
        stopT.current += dt
        if (stopT.current >= STOP_DELAY) state.current = "converging"
      }

      // ── converging → trigger aura once all gone ───────────────────────────
      if (s === "converging") {
        const allGone = ffs.current.length > 0 && ffs.current.every(ff => ff.op < 0.04)
        if (allGone && !aura.current) {
          aura.current  = { r: 0, op: 0.85 }
          state.current = "aura"
        }
      }

      // ── aura: expand once and transition to fog ───────────────────────────
      if (s === "aura" && aura.current) {
        aura.current.r  += 88 * dt
        aura.current.op -= 1.05 * dt
        if (aura.current.op <= 0) { aura.current = null; state.current = "fog" }
      }

      // ── fog: fade in the mist ─────────────────────────────────────────────
      if (s === "fog") {
        fogOp.current = Math.min(1, fogOp.current + 2.5 * dt)
      }

      // ── Update + draw fireflies ───────────────────────────────────────────
      const inFF = s === "following" || s === "converging"
      if (inFF) {
        for (const ff of ffs.current) {
          const dx = cx - ff.x
          const dy = cy - ff.y
          const d  = Math.sqrt(dx * dx + dy * dy) || 0.01

          // Superlinear spring (先慢後快: weak when near, strong when far)
          const fMag = 11 * Math.pow(d, 1.35) / d
          let fx = dx * fMag - ff.vx * 5
          let fy = dy * fMag - ff.vy * 5

          // Perpendicular arc wobble only while following
          if (s === "following" && d > 14) {
            const osc = 11 * Math.sin(sec * 3.0 + ff.phase)
            fx += -(dy / d) * osc
            fy +=  (dx / d) * osc
          }

          ff.vx += fx * dt;  ff.x += ff.vx * dt
          ff.vy += fy * dt;  ff.y += ff.vy * dt

          // Opacity: full while following; fade to 0 at cursor while converging
          const tgt = s === "following"
            ? 0.88
            : Math.min(1, d / VANISH_DIST) * 0.88
          ff.op += (tgt - ff.op) * Math.min(9 * dt, 1)

          if (ff.op > 0.02) drawFF(ctx, ff)
        }
      }

      // ── Draw single aura ring ─────────────────────────────────────────────
      if (aura.current) {
        const { r, op } = aura.current
        const inner = Math.max(0, r - 13)
        const outer = r + 13
        const g = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer)
        g.addColorStop(0,    `hsla(68,95%,65%,0)`)
        g.addColorStop(0.3,  `hsla(68,95%,65%,${op * 0.4})`)
        g.addColorStop(0.55, `hsla(68,95%,65%,${op})`)
        g.addColorStop(1,    `hsla(68,95%,65%,0)`)
        ctx.beginPath()
        ctx.arc(cx, cy, outer, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      // ── Draw fog at cursor bottom edge ────────────────────────────────────
      if (fogOp.current > 0.01) {
        const breathe = 0.75 + 0.25 * Math.sin(sec * 1.6)
        const base    = fogOp.current * breathe

        // Tight inner glow — sits at bottom of cursor circle (~10px below center)
        const g1 = ctx.createRadialGradient(cx, cy + 10, 0, cx, cy + 10, 20)
        g1.addColorStop(0,   `hsla(68,98%,72%,${base * 0.20})`)
        g1.addColorStop(0.5, `hsla(68,92%,64%,${base * 0.08})`)
        g1.addColorStop(1,   `hsla(68,88%,58%,0)`)
        ctx.beginPath()
        ctx.ellipse(cx, cy + 10, 32, 11, 0, 0, Math.PI * 2)
        ctx.fillStyle = g1
        ctx.fill()

        // Wide diffuse haze
        const g2 = ctx.createRadialGradient(cx, cy + 13, 0, cx, cy + 13, 42)
        g2.addColorStop(0,   `hsla(68,90%,65%,${base * 0.10})`)
        g2.addColorStop(0.6, `hsla(68,86%,58%,${base * 0.04})`)
        g2.addColorStop(1,   `hsla(68,82%,52%,0)`)
        ctx.beginPath()
        ctx.ellipse(cx, cy + 13, 58, 18, 0, 0, Math.PI * 2)
        ctx.fillStyle = g2
        ctx.fill()
      }

      raf.current = requestAnimationFrame(tick)
    }

    lastT.current = performance.now()
    raf.current   = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("resize",    resize)
      window.removeEventListener("scroll",    onScroll)
    }
  }, [])

  return (
    <canvas
      ref={cvs}
      className="fixed inset-0 pointer-events-none z-[9998]"
      aria-hidden="true"
    />
  )
}

// ── Render a single soft-glow firefly dot ────────────────────────────────────
function drawFF(ctx: CanvasRenderingContext2D, ff: FF) {
  const gr  = ff.r * 4.5    // glow radius: 9–14 px (small, cursor-scale)
  const g   = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, gr)
  const h   = ff.hue
  const a   = ff.op
  g.addColorStop(0,    `hsla(${h},100%,82%,${a})`)
  g.addColorStop(0.22, `hsla(${h}, 96%,72%,${a * 0.65})`)
  g.addColorStop(0.55, `hsla(${h}, 90%,62%,${a * 0.14})`)
  g.addColorStop(1,    `hsla(${h}, 80%,52%,0)`)
  ctx.beginPath()
  ctx.arc(ff.x, ff.y, gr, 0, Math.PI * 2)
  ctx.fillStyle = g
  ctx.fill()
}
