export const colors = {
  bg:          "var(--color-bg)",
  bg2:         "var(--color-bg-2)",
  bgCard:      "var(--color-bg-card)",
  border:      "var(--color-border)",
  borderHover: "var(--color-border-hover)",
  accent:      "var(--color-accent)",
  accentDim:   "var(--color-accent-dim)",
  accent2:     "var(--color-accent-2)",
  accent2Dim:  "var(--color-accent-2-dim)",
  text:        "var(--color-text)",
  textMuted:   "var(--color-text-muted)",
  textFaint:   "var(--color-text-faint)",
} as const

export const spacing = {
  xs:  "var(--space-xs)",
  sm:  "var(--space-sm)",
  md:  "var(--space-md)",
  lg:  "var(--space-lg)",
  xl:  "var(--space-xl)",
  "2xl": "var(--space-2xl)",
} as const

export const animation = {
  easeSmooth: "var(--ease-smooth)",
  easeSpring: "var(--ease-spring)",
  easeIn:     "var(--ease-in)",
  easeOut:    "var(--ease-out)",
  fast:   "var(--duration-fast)",
  base:   "var(--duration-base)",
  slow:   "var(--duration-slow)",
  xl:     "var(--duration-xl)",
} as const

export const radius = {
  sm:   "var(--radius-sm)",
  md:   "var(--radius-md)",
  lg:   "var(--radius-lg)",
  full: "var(--radius-full)",
} as const

export type ColorToken   = keyof typeof colors
export type SpacingToken = keyof typeof spacing
