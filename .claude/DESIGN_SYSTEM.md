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

## Shader Background (Phase 3)
Parameters for ShaderBackground.tsx:
- Particle count: 200-400
- Color range: hsl(165, 100%, 60%) to hsl(185, 80%, 40%) (cyan-mint-teal)
- Speed: 0.3-0.5 (slow drift)
- Size: 1.5-3px
- Opacity: 0.4-0.7
- Noise: simplex noise for organic movement

## Animation Rhythm
- Page load: stagger 0.1s between elements, 0.6s duration, ease-out
- Hover: 150ms transitions, ease-smooth
- ScrollTrigger: start="top 80%" — trigger early, feels responsive
- Spring animations: for interactive elements (buttons, cards)
