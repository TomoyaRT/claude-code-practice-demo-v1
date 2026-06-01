import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "accent" | "outline"
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-[--color-bg-2] text-[--color-text-muted] border border-[--color-border]",
  accent: "bg-[--color-accent-dim] text-[--color-accent] border border-[--color-accent-dim]",
  outline: "bg-transparent text-[--color-text-faint] border border-[--color-border]",
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1",
        "text-xs font-mono font-medium tracking-wide",
        "rounded-[--radius-full]",
        "transition-colors duration-[--duration-fast]",
        "hover:border-[--color-accent] hover:text-[--color-accent]",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
