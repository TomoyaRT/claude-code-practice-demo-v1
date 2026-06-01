# Design System

## Visual Identity
High-end software freelancer portfolio. Aesthetic: dark, technical, precise.
Inspired by: aerospace dashboards, code editors, terminal UIs.

## Color Palette
- Background: #080A0F (near-black with subtle blue undertone — depth without harshness)
- Background 2: #0E1420 (card surfaces, slightly lifted)
- Accent primary: #64FFDA (electric mint/cyan — distinctive, not cliche blue)
- Accent 2: #FF4D6D (coral-red — used sparingly for CTA, alerts)
- Text: #CCD6F6 (slightly blue-tinted white — readable, not stark)
- Text muted: #8892B0 (secondary info, captions)

## Typography
- Heading: Space Grotesk — geometric, distinctive, technical personality
  - Loaded via next/font as --font-space-grotesk
  - Usage: H1-H4, navigation, price numbers
- Body: DM Sans — clean, highly readable, modern
  - Loaded via next/font as --font-dm-sans
  - Usage: paragraphs, labels, UI text
- Mono: DM Mono — code snippets, tech labels
  - Usage: technology badges, code examples

## Section Visual Concepts

### Hero
- Full-viewport with ShaderBackground (WebGL)
- Shader: fluid particle system, dark with cyan-green particles
- Motion: slow, ambient drift — not energetic, contemplative
- Text layered above shader with blur-glass effect

### About
- Split layout: text left, tech skills right
- Skills as glowing badge grid
- ScrollTrigger fade-in on scroll

### Work / Portfolio
- Dark card grid with border glow on hover
- Project images with overlay on hover
- Stagger animation on page load

### Services / Pricing
- 3-column pricing cards
- Recommended plan: accent border glow, slightly elevated
- Clean icon + feature list layout

### Contact
- Minimal form, large fields
- Field focus state: accent border
- Submit button: full-width, accent color

## Shader Background (Phase 3) — Detailed Spec

### Visual Goal
Ambient, organic particle field. NOT energetic or flashy — slow, meditative, almost like looking at stars through haze. The shader is in the background; the text is the hero.

### GLSL Shader Parameters
- **Particle system**: 300 particles, size 1.5–3.0px
- **Color palette**: 
  - Primary: hsl(165, 100%, 70%) = rgb(35, 255, 200) — bright mint
  - Secondary: hsl(185, 80%, 50%) = rgb(25, 175, 200) — deep cyan
  - Accent: hsl(150, 60%, 45%) = rgb(45, 180, 100) — subtle green
  - All at opacity 0.3–0.6 — ghostly, not solid
- **Motion**: 
  - Drift speed: 0.08–0.12 units/second (very slow)
  - Each particle has unique phase offset
  - Simplex-like noise using sin/cos combinations
  - No hard direction — omnidirectional drift
- **Depth**: 3 layers at different z-depths for parallax feel
  - Layer 1 (foreground): 80 particles, 2.5–3.0px, opacity 0.5
  - Layer 2 (mid): 120 particles, 1.8–2.5px, opacity 0.35
  - Layer 3 (background): 100 particles, 1.0–1.8px, opacity 0.2
- **Fade edges**: vignetted — particles fade out near edges of viewport

### Fragment Shader Approach
Use a point-sprite approach with react-three-fiber:
- `<Points>` component with `<PointMaterial>` from @react-three/drei
- OR custom ShaderMaterial with point sprites
- Smooth circles (no hard edges) using: `smoothstep(0.5, 0.4, length(gl_PointCoord - 0.5))`

### Fallback (prefers-reduced-motion)
When `window.matchMedia('(prefers-reduced-motion: reduce)').matches`:
- Show a static CSS gradient background instead of the canvas
- Gradient: `radial-gradient(ellipse at 30% 60%, rgba(100,255,218,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(25,175,200,0.06) 0%, transparent 50%)`

### Hero Text Layout
- Top: mono-spaced label "Software Freelancer" — small, muted, tracking-widest
- Main H1: 2–3 lines, very large (text-6xl md:text-8xl), tight line-height
  - Line 1: "Building"
  - Line 2: "Digital"  
  - Line 3: "Products." — with period in accent color
- Below H1: tagline paragraph — 1–2 sentences, muted color
- CTA row: Primary button "View My Work" + Ghost button "Get in Touch"
- Scroll indicator: arrow + "scroll" text at bottom center

### About Section Layout
- Section label (mono, small, muted): "// about"
- Large H2: "Who I Am"
- 2-column grid (md:): text paragraph left, skills grid right
- Skills shown as Badge components in a flex-wrap grid
- Entry animation: GSAP ScrollTrigger — paragraph slides from left, badges stagger from right

## Animation Rhythm
- Page load: stagger 0.1s between elements, 0.6s duration, ease-out
- Hover: 150ms transitions, ease-smooth
- ScrollTrigger: start="top 80%" — trigger early, feels responsive
- Spring animations: for interactive elements (buttons, cards)
