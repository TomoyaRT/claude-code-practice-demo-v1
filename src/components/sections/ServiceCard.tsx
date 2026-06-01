"use client"

import { motion, useReducedMotion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import type { Service } from "@/data/services"

interface ServiceCardProps {
  service: Service
  index: number
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-[--color-accent] mt-0.5"
    >
      <path
        d="M2 7l3.5 3.5L12 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-[--color-text-faint] mt-0.5"
    >
      <path
        d="M3 3l8 8M11 3l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function formatPrice(service: Service): string {
  if (service.price === 0) return "Custom"
  return `¥${service.price.toLocaleString("en-US")}`
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        default: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.12 },
        y: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
      }}
      className={cn(
        "relative flex flex-col",
        "rounded-lg overflow-hidden",
        "transition-[border-color,box-shadow,transform] duration-300",
        service.recommended
          ? [
              "bg-[--color-bg-card]",
              "border-2 border-[--color-accent]",
              "shadow-[0_0_40px_rgba(100,255,218,0.08)]",
            ].join(" ")
          : [
              "bg-[--color-bg-card]",
              "border border-[--color-border]",
              "hover:border-[--color-accent]",
              "hover:shadow-[0_0_30px_rgba(100,255,218,0.05)]",
            ].join(" ")
      )}
    >
      {/* Recommended badge */}
      {service.recommended && (
        <div className="absolute top-0 right-6 -translate-y-1/2">
          <span className="bg-[--color-accent] text-[--color-bg] text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full">
            Recommended
          </span>
        </div>
      )}

      {/* Accent bar */}
      <div
        className={cn(
          "h-0.5 w-full",
          service.recommended
            ? "bg-[--color-accent]"
            : "bg-[--color-border] group-hover:bg-[--color-accent]"
        )}
      />

      <div className="flex flex-col flex-1 p-8 gap-6">
        {/* Header */}
        <div>
          <h3 className="font-[family-name:--font-heading] text-2xl font-bold text-[--color-text] mb-1">
            {service.name}
          </h3>
          <p className="text-sm text-[--color-text-muted]">{service.tagline}</p>
        </div>

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "font-[family-name:--font-heading] text-4xl font-bold",
                service.recommended ? "text-[--color-accent]" : "text-[--color-text]"
              )}
            >
              {formatPrice(service)}
            </span>
            {service.price > 0 && (
              <span className="font-mono text-sm text-[--color-text-faint]">
                / {service.unit}
              </span>
            )}
          </div>
          {service.deliveryDays > 0 && (
            <p className="font-mono text-xs text-[--color-text-faint] mt-1">
              {service.deliveryDays}-day delivery
            </p>
          )}
        </div>

        {/* Features list */}
        <ul className="flex flex-col gap-3 flex-1">
          {service.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-3">
              {feature.included ? <CheckIcon /> : <CrossIcon />}
              <span
                className={cn(
                  "text-sm leading-snug",
                  feature.included ? "text-[--color-text-muted]" : "text-[--color-text-faint]"
                )}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link href="/contact" className="mt-2">
          <Button
            variant={service.recommended ? "primary" : "secondary"}
            size="md"
            className="w-full"
          >
            {service.cta}
          </Button>
        </Link>
      </div>
    </motion.article>
  )
}
