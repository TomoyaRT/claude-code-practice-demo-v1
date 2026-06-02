"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const NAV: { label: string; href: string; id: string }[] = [
  { label: "Work",     href: "#work",     id: "work"     },
  { label: "Services", href: "#services", id: "services" },
  { label: "Contact",  href: "#contact",  id: "contact"  },
]

export function Header() {
  const [scrolled,      setScrolled]      = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 48)
      // Highlight the section whose top edge has passed 120px from the viewport top
      const y = window.scrollY + 120
      let current = ""
      for (const { id } of NAV) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActiveSection(current)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const toggleMenu = () => setMenuOpen((v) => !v)

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-[--duration-base]",
        scrolled
          ? "bg-[--color-bg]/90 backdrop-blur-md border-b border-[--color-border] py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo → scroll to top */}
        <a
          href="#"
          className="font-[family-name:--font-heading] font-bold text-xl text-[--color-text] hover:text-[--color-accent] transition-colors duration-[--duration-fast]"
        >
          tomoya<span className="text-[--color-accent]">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8" aria-label="Main navigation">
          {NAV.map(({ label, href, id }) => (
            <a
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors duration-[--duration-fast]",
                activeSection === id
                  ? "text-[--color-accent]"
                  : "text-[--color-text-muted] hover:text-[--color-text]"
              )}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2 text-[--color-text-muted] hover:text-[--color-text]"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={cn("block w-6 h-0.5 bg-current transition-all duration-[--duration-base]", menuOpen && "rotate-45 translate-y-2")} />
          <span className={cn("block w-6 h-0.5 bg-current transition-all duration-[--duration-fast]", menuOpen && "opacity-0")} />
          <span className={cn("block w-6 h-0.5 bg-current transition-all duration-[--duration-base]", menuOpen && "-rotate-45 -translate-y-2")} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[--color-border] bg-[--color-bg]/95 backdrop-blur-md">
          <nav className="flex flex-col px-6 py-4 gap-4" aria-label="Mobile navigation">
            {NAV.map(({ label, href, id }) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className={cn(
                  "text-base font-medium py-2 transition-colors duration-[--duration-fast]",
                  activeSection === id
                    ? "text-[--color-accent]"
                    : "text-[--color-text-muted] hover:text-[--color-text]"
                )}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
