interface SocialLink {
  label: string
  href: string
}

const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/TomoyaRT" },
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[--color-border] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[--color-text-faint] text-sm font-mono">
          © {year} Tomoya. Built with Next.js &amp; shipped with ♥
        </p>
        <nav className="flex items-center gap-6" aria-label="Footer links">
          <a href="#work"     className="text-sm text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-[--duration-fast]">Work</a>
          <a href="#services" className="text-sm text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-[--duration-fast]">Services</a>
          <a href="#contact"  className="text-sm text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-[--duration-fast]">Contact</a>
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[--color-text-muted] hover:text-[--color-accent] transition-colors duration-[--duration-fast]"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
