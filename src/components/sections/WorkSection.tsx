"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ProjectGrid } from "./ProjectGrid"

gsap.registerPlugin(ScrollTrigger)

export function WorkSection() {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current!.children, {
        opacity: 0, y: 40, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: headingRef.current, start: "top 85%", once: true },
      })
    }, headingRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={headingRef} className="mb-20">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[--color-text-faint] mb-6">
            {"// work"}
          </p>
          <h2 className="font-[family-name:--font-heading] text-5xl md:text-6xl font-bold text-[--color-text] tracking-tight mb-6">
            Selected Projects
          </h2>
          <p className="max-w-xl text-[--color-text-muted] text-lg leading-relaxed">
            A selection of projects I&apos;ve built for clients and as personal
            explorations — each one a different problem, context, and set of tradeoffs.
          </p>
        </div>
        <ProjectGrid />
      </div>
    </section>
  )
}
