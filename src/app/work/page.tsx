"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ProjectGrid } from "@/components/sections/ProjectGrid"

gsap.registerPlugin(ScrollTrigger)

export default function WorkPage() {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.from(headingRef.current.children, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            once: true,
          },
        })
      }
    }, headingRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-20">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[--color-text-faint] mb-6">
            // work
          </p>
          <h1 className="font-[family-name:--font-heading] text-5xl md:text-6xl font-bold text-[--color-text] tracking-tight mb-6">
            Selected Projects
          </h1>
          <p className="max-w-xl text-[--color-text-muted] text-lg leading-relaxed">
            A selection of projects I&apos;ve built for clients and as personal
            explorations — each one a different problem, context, and set of
            tradeoffs.
          </p>
        </div>

        {/* Grid */}
        <ProjectGrid />
      </div>
    </section>
  )
}
