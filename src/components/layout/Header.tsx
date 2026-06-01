"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  // Store the pathname at which the menu was opened so it auto-closes on navigation
  const [menuOpenPath, setMenuOpenPath] = useState<string | null>(null)

  const menuOpen = menuOpenPath === pathname

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const toggleMenu = () =>
    setMenuOpenPath((prev) => (prev === pathname ? null : pathname))

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
        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:--font-heading] font-bold text-xl text-[--color-text] hover:text-[--color-accent] transition-colors duration-[--duration-fast]"
        >
          tomoya<span className="text-[--color-accent]">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-8" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium tracking-wide transition-colors duration-[--duration-fast]",
                pathname === link.href
                  ? "text-[--color-accent]"
                  : "text-[--color-text-muted] hover:text-[--color-text]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2 text-[--color-text-muted] hover:text-[--color-text]"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={cn(
              "block w-6 h-0.5 bg-current transition-all duration-[--duration-base]",
              menuOpen && "rotate-45 translate-y-2"
            )}
          />
          <span
            className={cn(
              "block w-6 h-0.5 bg-current transition-all duration-[--duration-fast]",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={cn(
              "block w-6 h-0.5 bg-current transition-all duration-[--duration-base]",
              menuOpen && "-rotate-45 -translate-y-2"
            )}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[--color-border] bg-[--color-bg]/95 backdrop-blur-md">
          <nav className="flex flex-col px-6 py-4 gap-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-medium py-2 transition-colors duration-[--duration-fast]",
                  pathname === link.href
                    ? "text-[--color-accent]"
                    : "text-[--color-text-muted] hover:text-[--color-text]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
