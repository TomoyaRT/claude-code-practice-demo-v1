"use client"

import { useEffect, useRef } from "react"

// ── Constants ──────────────────────────────────────────────────────────────
const N          = 6      // number of cursor fireflies
const SPRING_K   = 9      // spring constant
const DAMP_C     = 4.5    // velocity damping coefficient
const OSC_AMP    = 16     // px — perpendicular oscillation amplitude
const OSC_FREQ   = 3.2    // rad/s — oscillation frequency

// ── Types ──────────────────────────────────────────────────────────────────
interface FF {
  x: number; y: number; vx: number; vy: number
  opacity: number
  r: number       // glow radius
  hue: number     // HSL hue  (62–80 = firefly yellow-green)
  phase: number   // oscillation phase offset
  oa: number      // settled orbit angle
  or: number      // settled orbit radius
}

interface Ring { radius: number; opacity: number }

type State = "off" | "following" | "settling" | "settled"

// ── Helpers ────────────────────────────────────────────────────────────────
function mkFF(i: number): FF {
  return {
    x: -400, y: -400, vx: 0, vy: 0,
    opacity: 0,
    r:    5 + Math.random() * 3,
    hue:  62 + Math.random() * 18,
    phase: (i / N) * Math.PI * 2,
    oa:   (i / N) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
    or:   18 + Math.random() * 22,
  }
}

function belowHero(): boolean {
  return window.scrollY >= window.innerHeight * 0.82
}

// ── Component ──────────────────────────────────────────────────────────────
export function FireflyCursor() {
  const cvs   = useRef<HTMLCanvasElement>(null)
  const raf   = useRef(0)
  const ffs   = useRef<FF[]>(Array.from({ length: N }, (_, i) => mkFF(i)))
  const mx    = useRef(-400)
  const my    = useRef(-400)
  const pmx   = useRef(-400)   // previous mouse X (for move detection)
  const pmy   = useRef(-400)
  const state = useRef<State>("off")
  const stopT = useRef(0)      // seconds since mouse stopped
  const setT  = useRef(0)      // seconds since settled
  const rings = useRef<Ring[]>([])
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

    // ── Mouse / scroll handlers ───────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mx.current = e.clientX
      my.current = e.clientY

      const moved =
        Math.abs(e.clientX - pmx.current) > 1.5 ||
        Math.abs(e.clientY - pmy.current) > 1.5
      pmx.current = e.clientX
      pmy.current = e.clientY

      if (!belowHero()) { state.current = "off"; return }

      if (moved) {
        if (state.current !== "following") {
          state.current = "following"
          rings.current = []
          setT.current  = 0
        }
        stopT.current = 0   // reset stop timer on every real move
      }
    }

    const onScroll = () => {
      if (!belowHero() && state.current !== "off") {
        state.current = "off"
        rings.current = []
      }
    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("scroll",    onScroll, { passive: true })

    // ── Animation loop ────────────────────────────────────────────────────
    const tick = (ts: number) => {
      const dt  = Math.min((ts - lastT.current) / 1000, 0.05)
      lastT.current = ts
      const sec = ts / 1000
      const ctx = canvas.getContext("2d")!
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const s  = state.current
      const cx = mx.current
      const cy = my.current

      // ── State transitions ───────────────────────────────────────────────
      if (s === "following") {
        stopT.current += dt
        if (stopT.current >= 0.5) {
          state.current = "settling"
          setT.current  = 0
        }
      } else if (s === "settling") {
        setT.current += dt
        if (setT.current >= 0.5) {
          state.current = "settled"
          setT.current  = 0
          rings.current.push({ radius: 0, opacity: 0.75 })
        }
      } else if (s === "settled") {
        setT.current += dt
        // Spawn a new aura ring every ~1.3 s
        const prev = setT.current - dt
        if (Math.floor(setT.current / 1.3) > Math.floor(prev / 1.3)) {
          rings.current.push({ radius: 0, opacity: 0.55 })
        }
      }

      // ── Update & draw each firefly ──────────────────────────────────────
      for (const ff of ffs.current) {
        let tx: number, ty: number

        if (s === "off") {
          // Fade out and park off-screen
          ff.opacity = Math.max(0, ff.opacity - 4 * dt)
          if (ff.opacity > 0) drawFF(ctx, ff)
          continue
        }

        if (s === "following") {
          tx = cx; ty = cy
        } else {
          // Slowly orbit around cursor while settling / settled
          const angle = ff.oa + (s === "settled" ? setT.current * 0.22 : 0)
          tx = cx + Math.cos(angle) * ff.or
          ty = cy + Math.sin(angle) * ff.or
        }

        const dx = tx - ff.x
        const dy = ty - ff.y
        const d  = Math.sqrt(dx * dx + dy * dy) || 0.01

        // Superlinear spring: F = k · d^1.4 → ease-in feel (slow near, fast far)
        const fMag = SPRING_K * Math.pow(d, 1.4) / d
        let  fx   = dx * fMag
        let  fy   = dy * fMag

        // Velocity damping (proper spring-damper)
        fx -= ff.vx * DAMP_C
        fy -= ff.vy * DAMP_C

        // Perpendicular oscillation only while following (arc feel)
        if (s === "following" && d > 10) {
          const sinVal = Math.sin(sec * OSC_FREQ + ff.phase)
          const osc    = sinVal * Math.min(d * 0.35, OSC_AMP)
          // Rotate 90° from motion direction
          const nx = dx / d; const ny = dy / d
          fx += -ny * osc * 1.2
          fy +=  nx * osc * 1.2
        }

        ff.vx += fx * dt
        ff.vy += fy * dt
        ff.x  += ff.vx * dt
        ff.y  += ff.vy * dt

        // Target opacity: dimmer when settled (fireflies "merge" into aura)
        const opT = s === "settled" ? 0.35 : 0.88
        ff.opacity += (opT - ff.opacity) * Math.min(7 * dt, 1)

        drawFF(ctx, ff)
      }

      // ── Aura rings ──────────────────────────────────────────────────────
      const active = state.current === "settled"
      for (let i = rings.current.length - 1; i >= 0; i--) {
        const ring = rings.current[i]
        ring.radius  += 75 * dt
        ring.opacity -= 0.5 * dt
        if (ring.opacity <= 0) { rings.current.splice(i, 1); continue }

        if (!active && ring.radius > 40) {
          // Fade stale rings fast once no longer settled
          ring.opacity -= 2 * dt
        }

        const ro    = ring.radius
        const inner = Math.max(0, ro - 18)
        const outer = ro + 18
        const grd   = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer)
        const h     = 68
        grd.addColorStop(0,   `hsla(${h},95%,62%,0)`)
        grd.addColorStop(0.35,`hsla(${h},95%,62%,${ring.opacity * 0.5})`)
        grd.addColorStop(0.55,`hsla(${h},95%,62%,${ring.opacity})`)
        grd.addColorStop(1,   `hsla(${h},95%,62%,0)`)
        ctx.beginPath()
        ctx.arc(cx, cy, outer, 0, Math.PI * 2)
        ctx.fillStyle = grd
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

// ── Draw one soft-glow firefly ─────────────────────────────────────────────
function drawFF(ctx: CanvasRenderingContext2D, ff: FF) {
  const gr  = ff.r * 4
  const grd = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, gr)
  const a   = ff.opacity
  const h   = ff.hue
  grd.addColorStop(0,    `hsla(${h},98%,78%,${a})`)
  grd.addColorStop(0.2,  `hsla(${h},95%,68%,${a * 0.7})`)
  grd.addColorStop(0.55, `hsla(${h},90%,58%,${a * 0.18})`)
  grd.addColorStop(1,    `hsla(${h},80%,50%,0)`)
  ctx.beginPath()
  ctx.arc(ff.x, ff.y, gr, 0, Math.PI * 2)
  ctx.fillStyle = grd
  ctx.fill()
}
