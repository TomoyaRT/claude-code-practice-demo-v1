import { forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: [
    "bg-[--color-accent] text-[--color-bg] font-semibold",
    "hover:bg-[--color-text] hover:shadow-[0_0_20px_rgba(100,255,218,0.3)]",
    "focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]",
  ].join(" "),
  secondary: [
    "border border-[--color-accent] text-[--color-accent] bg-transparent",
    "hover:bg-[--color-accent-dim] hover:shadow-[0_0_20px_rgba(100,255,218,0.15)]",
    "focus-visible:ring-2 focus-visible:ring-[--color-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]",
  ].join(" "),
  ghost: [
    "text-[--color-text-muted] bg-transparent",
    "hover:text-[--color-text] hover:bg-[--color-bg-2]",
    "focus-visible:ring-2 focus-visible:ring-[--color-border] focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-bg]",
  ].join(" "),
}

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-4 py-2 text-sm rounded-[--radius-sm]",
  md: "px-6 py-3 text-base rounded-[--radius-md]",
  lg: "px-8 py-4 text-lg rounded-[--radius-md]",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "font-[family-name:--font-body]",
          "transition-all duration-[--duration-base] cursor-pointer",
          "disabled:opacity-40 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonProps }
