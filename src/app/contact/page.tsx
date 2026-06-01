"use client"

import { ContactForm } from "@/components/sections/ContactForm"

const contactInfo = [
  {
    label: "Email",
    value: "worth22focus3000@gmail.com",
    href: "mailto:worth22focus3000@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/TomoyaRT",
    href: "https://github.com/TomoyaRT",
  },
  {
    label: "Location",
    value: "Tokyo, Japan",
    href: null,
  },
  {
    label: "Availability",
    value: "Open for projects",
    href: null,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[--color-text-faint] mb-6">
            {"// contact"}
          </p>
          <h1 className="font-[family-name:--font-heading] text-5xl md:text-6xl font-bold text-[--color-text] tracking-tight mb-6">
            Let&apos;s Work Together
          </h1>
          <p className="max-w-xl text-[--color-text-muted] text-lg leading-relaxed">
            Have a project in mind? I&apos;d love to hear about it. Send me a message
            and I&apos;ll get back to you within 1–2 business days.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-16 items-start">
          {/* Form */}
          <ContactForm />

          {/* Contact info sidebar */}
          <aside className="flex flex-col gap-8">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-[--color-text-faint] mb-6">
                Contact Info
              </p>
              <ul className="flex flex-col gap-5">
                {contactInfo.map((item) => (
                  <li key={item.label} className="flex flex-col gap-1">
                    <span className="font-mono text-[11px] tracking-widest uppercase text-[--color-text-faint]">
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-150"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="text-sm text-[--color-text-muted]">{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-[--color-border] pt-8">
              <p className="text-xs text-[--color-text-faint] leading-relaxed font-mono">
                Response time: within 24 hours on weekdays.
                <br />
                For urgent matters, use email directly.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
