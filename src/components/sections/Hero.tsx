"use client"

import { useRef } from "react"
import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { ShaderBackgroundClient } from "@/components/canvas/ShaderBackground.client"
import { Button } from "@/components/ui/Button"

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* WebGL / gradient background */}
      <ShaderBackgroundClient />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(8,10,15,0.8) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Label */}
          <motion.p
            variants={itemVariants}
            className="font-mono text-xs tracking-[0.3em] uppercase text-[--color-text-muted] mb-8"
          >
            Software Freelancer
          </motion.p>

          {/* H1 */}
          <motion.h1
            variants={itemVariants}
            className="font-[family-name:--font-heading] text-6xl sm:text-7xl md:text-8xl font-bold leading-[1.05] tracking-tight text-[--color-text] mb-8"
          >
            Building
            <br />
            Digital
            <br />
            Products
            <span className="text-[--color-accent]">.</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="max-w-xl mx-auto text-lg text-[--color-text-muted] leading-relaxed mb-12"
          >
            Full-stack engineer specializing in high-performance web apps,
            AI integrations, and clean, maintainable code.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/work">
              <Button size="lg" variant="primary">View My Work</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="ghost">Get in Touch</Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[--color-text-faint]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="font-mono text-xs tracking-widest uppercase">scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <path
              d="M8 0v20M1 13l7 7 7-7"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
