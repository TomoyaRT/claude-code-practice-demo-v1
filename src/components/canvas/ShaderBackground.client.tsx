"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ShaderBackgroundCanvas = dynamic(
  () => import("./ShaderBackground").then((m) => ({ default: m.ShaderBackground })),
  { ssr: false, loading: () => null }
)

function StaticGradientBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background: [
          "radial-gradient(ellipse at 30% 60%, rgba(100,255,218,0.08) 0%, transparent 60%)",
          "radial-gradient(ellipse at 70% 30%, rgba(25,175,200,0.06) 0%, transparent 50%)",
          "radial-gradient(ellipse at 50% 100%, rgba(100,255,218,0.04) 0%, transparent 40%)",
        ].join(", "),
      }}
    />
  )
}

export function ShaderBackgroundClient() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
  }, [])

  if (reducedMotion) {
    return <StaticGradientBackground />
  }

  return <ShaderBackgroundCanvas />
}
