# Hero design spec

## Layout

- Section container: `w-full bg-ink-900 pt-24 pb-8`
- Max-width: none (section is full-bleed); inner content uses `max-w-[1200px] mx-auto px-8 lg:px-[120px]`
- Grid: single column on mobile/tablet → two equal columns on desktop
  - `grid grid-cols-1 lg:grid-cols-2 lg:gap-16`
  - Left column: text block (H1, subhead, CTAs, trust signals)
  - Right column: hero illustration/media (hidden on mobile, visible md+)
- Background: `bg-ink-900` solid (Twilio computed: `rgb(0,13,37)` = `--color-ink` → Relay ink-900 `#111827`)
- Border: none

### Padding summary per viewport

| Viewport | Section pt | Section pb | Horizontal px |
|---|---|---|---|
| Mobile (390px) | `pt-20` (~80px; nav=124px → H1 starts at 187px) | `pb-10` | `px-8` (32px each side) |
| Tablet (768px) | `pt-24` (~96px; nav=127px → H1 starts at 223px) | `pb-8` | `px-8` (32px each side) |
| Desktop (1440px) | `pt-24` (96px; nav=111px → H1 starts at 207px) | `pb-8` (32px) | `px-[120px]` |

## Typography

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| H1 / Headline | `text-display-md font-bold leading-[1.18]` (2.25rem≈36px) | same | `lg:text-display-xl lg:leading-[1.18]` (3.75rem≈60px) |
| Subhead / Body | `text-sm leading-[1.75]` (0.875rem=14px) | same | `lg:text-base` (1rem=16px) |
| Button text | `text-sm font-medium leading-6` (14px/500) | same | `lg:text-base` (16px/500) |
| Trust signals | `text-xs leading-5` (0.75rem=12px) | same | same |

**Note on display tokens:** Relay's `text-display-xl` config already encodes `letterSpacing: "-0.02em"` and `fontWeight: "700"`. Add `font-bold` explicitly in className for safety. Relay's `text-display-md` encodes `letterSpacing: "-0.01em"` and `fontWeight: "600"` — override to `700` with `font-bold`.

**Observed leading override:** Twilio H1 lh=66/56=1.178 at desktop; Relay token defaults to 1.05. Pin to `leading-[1.18]` to preserve Twilio's tighter-than-default ratio while staying close.

## Color

- Background: `bg-ink-900` (Twilio `rgb(0,13,37)` → Relay `#111827`)
- H1: `text-white`
- Subhead: `text-white`
- Trust signal text: `text-white/70`
- Trust signal icon: `text-white/70`
- Primary CTA bg: `bg-primary-500 hover:bg-primary-600` (Twilio bg `rgb(24,102,238)` = `--color-blue-500` → Relay primary-500 `#5B6CFF`)
- Primary CTA text: `text-white`
- Secondary CTA: `text-white` (transparent bg, link-style)
- Secondary CTA hover: `text-white/80` (opacity reduction)

## Spacing

| Gap | Classes | Source |
|---|---|---|
| H1 → subhead | `mt-4` (16px) | Twilio: subhead top 421 − H1 bottom 405 = 16px |
| Subhead → CTA group | `mt-8` (32px) | Twilio: CTA top 549 − subhead bottom 517 = 32px |
| CTA group → trust signals | `mt-8` (32px) | Twilio: trust top 621 − CTA bottom 589 = 32px |
| Trust signal items (gap) | `gap-3` (12px) | Twilio: item-to-item horizontal gap 12px |
| Icon → trust label | `gap-1` (4px) | Twilio: icon 24px, text left offset = icon + 4px |
| Primary CTA → secondary CTA | `gap-4` (16px) | Twilio: secondary CTA left 283 − primary right 267 = 16px |
| Left/right column gap | `lg:gap-16` | Twilio: right col left 744 − left col right 696 = 48px → round to 64px/`gap-16` |

## Components within this section

### Wordmark / nav (not part of hero section, reference only)
- Fixed header height: desktop 112px, tablet 128px, mobile 124px
- Logo: ~108×39px, left: 24px on desktop

### Primary CTA button
```
px-6 py-2 rounded-full bg-primary-500 hover:bg-primary-600
text-white text-base font-medium leading-6
shadow-cta transition-colors duration-base
focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-ink-900
min-h-[44px] inline-flex items-center
```
- Desktop computed: 147×40px, padding t8 r24 b8 l24 (py-2 px-6), bg `rgb(24,102,238)` → `primary-500`
- Bump to `min-h-[44px]` for mobile touch target compliance

### Secondary CTA (text link)
```
text-white text-base font-medium leading-7
inline-flex items-center gap-1
hover:text-white/80 transition-colors duration-fast
focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2
```
- Desktop computed: transparent bg, 183×28px, no padding, font 16px/500
- Append a right-arrow icon (16×16) after the text

### Trust signals row
```html
<div class="flex flex-wrap items-center gap-3 text-white/70 text-xs leading-5">
  <span class="flex items-center gap-1"><CheckIcon class="w-4 h-4 shrink-0" /> Free trial</span>
  <span class="flex items-center gap-1"><CheckIcon class="w-4 h-4 shrink-0" /> No credit card required</span>
  <span class="flex items-center gap-1"><CheckIcon class="w-4 h-4 shrink-0" /> Flexible pricing</span>
</div>
```
- Desktop computed: 24px icon box (cmp-benefits-list__icon), 20px text height (paragraph-small)

### Hero illustration / right column
- Desktop: `hidden lg:flex lg:items-center lg:justify-center` within right grid column (576×438px)
- Contains a full-width media element (image/video) with a centered play button overlay
- Play button: 90×90px circle, centered horizontally at column midpoint (~right col center)
- Play button classes: `w-[90px] h-[90px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center`
- Media slot: `w-full aspect-[576/438] object-cover`
- Alt text: `"[Relay hero illustration — AI-era developer platform overview]"` (Copywriter to finalize)

## Motion

### Entrance (page load)
- H1: `initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}`
- Subhead: same, `delay: 0.1`
- CTA group: same, `delay: 0.2`
- Trust signals: same, `delay: 0.3`
- Right column illustration: `initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2, ease: [0, 0, 0.2, 1] }}`
- Use Framer Motion `<motion.div>` on each element group; wrap in a single `AnimatePresence` or trigger on mount.

### Scroll-linked
- None. Hero is the top section; elements are fully visible at scroll=0.

### Hover (CTAs)
- Primary CTA: `bg-primary-500 → bg-primary-600`, `transition-colors duration-base` (300ms)
- Secondary CTA: opacity 100 → 80, `transition-colors duration-fast` (150ms)

### Reduced motion
- Skip `y` translate and `scale` transforms. Preserve `opacity` fade only.
- Implement via `@media (prefers-reduced-motion: reduce)` or Framer Motion's `useReducedMotion()`.
- Example: `const prefersReduced = useReducedMotion(); const variants = prefersReduced ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : { ... }`

## Accessibility

- Focus ring: `focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-ink-900` on both CTAs
- Hit targets: Primary CTA desktop box 147×40px — use `min-h-[44px]` to meet 44×44px WCAG touch target on mobile. Secondary CTA 183×28px — wrap in a `<span class="py-2">` to pad vertical hit area on mobile.
- ARIA:
  - `<main>` wraps the full hero content area
  - Right column `<div>` should have `role="img" aria-label="..."` or use a semantic `<figure>`
  - Play button: `aria-label="Play hero video"` with `role="button"` and `tabIndex={0}`
  - Trust signal icons: `aria-hidden="true"` (decorative checkmarks)
- Color contrast:
  - White text on `ink-900 (#111827)` background: #FFF on #111827 → contrast ratio ~18:1 ✓ (≥4.5:1)
  - `text-white/70` on `ink-900`: #FFFFFFB3 on #111827 → ~12:1 ✓ (≥4.5:1 for small text)
  - `primary-500 (#5B6CFF)` button bg with white text: #5B6CFF on white is 3.1:1 (border case); #FFF on #5B6CFF = ~3.1:1. For WCAG AA large text (button text ≥18pt or 14pt bold) this clears the 3:1 threshold; body text would not. Button text is 16px/medium = 12pt — borderline. Engineer should verify or darken to `primary-600 (#4A58E0)` for button bg if AA compliance is required for normal text (contrast ~3.8:1).
- Alt text for illustration: `"[Hero illustration — placeholder for Relay visual]"` (Copywriter to finalize)

## Copy slots

| Slot | Twilio source copy (reference only — do NOT use) | Notes |
|---|---|---|
| Headline (H1) | "The platform for conversations in the AI era" | [HEADLINE SLOT] — 40–60 chars target |
| Subhead | "The Twilio platform empowers humans and AI agents to work together, coordinate across channels, and pick up every customer conversation where the last one left off." | [SUBHEAD SLOT] — 2–3 sentences |
| Primary CTA | "Start for free" | [PRIMARY CTA SLOT] |
| Secondary CTA | "Explore what's possible" | [SECONDARY CTA SLOT] |
| Trust signal 1 | "Free trial" | [TRUST 1 SLOT] |
| Trust signal 2 | "No credit card required" | [TRUST 2 SLOT] |
| Trust signal 3 | "Flexible pricing" | [TRUST 3 SLOT] |

No eyebrow/label present above the H1 in the Twilio reference.

## Captured reference (for the Engineer's audit)

- **Twilio H1 computed:** 56px / 700 / lh:66px / color:rgb(255,255,255) / bg:transparent
  - Box (desktop): top:207 left:120 width:576 height:198
  - → Relay: `text-display-xl font-bold leading-[1.18] text-white`

- **Twilio subhead computed:** 16px / 400 / lh:28px (×1.75) / color:rgb(255,255,255)
  - Box (desktop): top:421 left:120 width:576 height:96
  - → Relay: `text-base leading-relaxed text-white` (mobile: `text-sm`)

- **Twilio primary CTA computed:** bg:rgb(24,102,238) / text:rgb(255,255,255) / font:16px/500 / padding:t8 r24 b8 l24 / size:147×40px / border-radius: not captured (visual inspection → pill)
  - → Relay: `bg-primary-500 text-white px-6 py-2 rounded-full font-medium`

- **Twilio secondary CTA computed:** bg:transparent / text:rgb(255,255,255) / font:16px/500 / size:183×28px / no padding
  - → Relay: `text-white font-medium` (link style)

- **Twilio section container:** bg:rgb(0,13,37) / top:111 / height:598 (desktop); top:127 / height:694 (tablet)
  - → Relay: `bg-ink-900 pt-24 pb-8`

- **Twilio trust signal item:** 24px icon box / 20px text / font-size ~12px / color:white
  - → Relay: `text-xs text-white/70 flex items-center gap-1`

- **Twilio two-column grid (desktop):** content-width 1200px, margins 120px each side; left-col 576px, right-col 576px, gap=48px
  - → Relay: `max-w-[1200px] mx-auto px-[120px] grid grid-cols-2 gap-12 lg:gap-16`

- **Twilio play button:** 90×90px / top:381 / left:987 (center of right column) / bg:transparent
  - → Relay: `w-[90px] h-[90px] rounded-full bg-white/20 flex items-center justify-center`
