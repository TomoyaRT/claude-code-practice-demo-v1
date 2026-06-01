"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { PricingGrid } from "@/components/sections/PricingGrid"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

gsap.registerPlugin(ScrollTrigger)

const FAQ_ITEMS = [
  {
    q: "Can I request a custom scope?",
    a: "Absolutely. These tiers are starting points. Most projects are scoped in a free discovery call before any commitment.",
  },
  {
    q: "What's the payment structure?",
    a: "Typically 50% upfront, 50% on delivery. For longer engagements, monthly billing is available.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. I work asynchronously across time zones and have clients in Japan, Europe, and North America.",
  },
  {
    q: "What if I need changes after delivery?",
    a: "Each plan includes a set number of revision rounds. After that, any changes are billed at an hourly rate agreed upfront.",
  },
] as const

export default function ServicesPage() {
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

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
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="mb-4">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[--color-text-faint] mb-6">
            // services
          </p>
          <h1 className="font-[family-name:--font-heading] text-5xl md:text-6xl font-bold text-[--color-text] tracking-tight mb-6">
            How I Work
          </h1>
          <p className="max-w-2xl text-[--color-text-muted] text-lg leading-relaxed">
            Transparent pricing, no surprises. Each engagement is scoped upfront
            so you know exactly what you&apos;re getting and when.
          </p>
        </div>

        {/* Pricing grid */}
        <PricingGrid />

        {/* FAQ-style note */}
        <div className="mt-20 border-t border-[--color-border] pt-12">
          <h2 className="font-[family-name:--font-heading] text-2xl font-bold text-[--color-text] mb-8">
            Common Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="flex flex-col gap-2">
                <h3 className="font-[family-name:--font-heading] font-semibold text-[--color-text]">
                  {item.q}
                </h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-[--color-text-muted] mb-6 text-lg">
            Not sure which plan fits? Let&apos;s talk it through.
          </p>
          <Link href="/contact">
            <Button variant="primary" size="lg">
              Start a Conversation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
