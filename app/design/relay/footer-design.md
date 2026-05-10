# Footer design spec

Section: Footer — multi-column site nav, brand column, bottom bar.

---

## Layout

### Section container
- Element: `<footer>` full-bleed
- Width: `w-full`
- Background: `bg-ink-900` (Twilio `--color-ink` = rgb(0,13,37); Relay closest: #111827)
- Min-height: none (content-driven: desktop ~618px, tablet ~1074px, mobile ~976px)

### Inner content wrapper
- `max-w-[1200px] mx-auto px-5 md:px-8 lg:px-0`
- Vertical padding: `pt-12 pb-8 lg:pt-16 lg:pb-12`

### Nav grid — desktop (lg:)
- `lg:grid lg:grid-cols-[220px_repeat(4,1fr)] lg:gap-10`
- Column 1: brand logo + company/legal links (~220px)
- Columns 2–5: four categorized nav columns (equal 1fr each, ~245px)
- Twilio reference: inner content 1200px wide; logo col left-offset 120px from viewport edge; four nav cols fill remaining ~980px equally

### Nav grid — tablet/mobile (default + md:)
- `flex flex-col`
- Four nav categories render as **accordions** (stacked, full-width, with `+` toggle)
- Brand logo + company links appear **below** the accordion block
- Accordion divider: `border-b border-ink-700` on each row

### Bottom bar
- Sits below a `border-t border-ink-700` separator
- `pt-8 pb-6`
- Layout: `flex flex-col gap-2 md:flex-row md:items-center md:justify-between`

---

## Typography

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| Nav category header | `text-[11px] font-semibold uppercase tracking-[0.12em] leading-tight text-ink-300` | same | same |
| Nav link | `text-sm font-normal leading-relaxed text-white/75` | same | same |
| "All X →" footer link | `text-sm font-semibold text-primary-400` | same | same |
| Company/brand links (left col) | `text-sm font-normal text-ink-300` | same | same |
| Accordion toggle label | `text-base font-semibold text-white` | same | — (grid layout, no accordion) |
| Copyright line | `text-xs text-ink-400 leading-5` | same | same |

Font family: `font-sans` (Inter) — Twilio `--font-family-default: Whitney SSm, helvetica, arial`.

---

## Color

| Use | Relay token | Twilio reference |
|---|---|---|
| Section background | `bg-ink-900` (#111827) | `--color-ink` = rgb(0,13,37) (#000D25) |
| Nav category header text | `text-ink-300` (#D1D5DB) | Visual: ≈ `--color-gray-300` rgb(154,160,180) |
| Nav category header divider | `border-ink-700` (#374151) | Visual: thin rule lighter than bg |
| Nav link text | `text-white/75` (rgba 255,255,255,0.75) | `--color-white` at reduced opacity in dark theme |
| Nav link text hover | `text-white` | `--color-white` |
| "All X →" CTA link | `text-primary-400` (#7E8BFF) | `--color-blue-500` rgb(24,102,238) → Relay primary |
| "All X →" CTA hover | `text-primary-300` (#A9B3FF) | lighter blue hover |
| Company/brand links | `text-ink-300` (#D1D5DB) | Visual: muted white, ~`--color-gray-300` |
| Company link hover | `text-white` | `--color-white` |
| Accordion divider | `border-ink-700` (#374151) | Visual: separator between accordion rows |
| Bottom bar separator | `border-ink-700` (#374151) | Visual: border-top above copyright |
| Copyright text | `text-ink-400` (#9CA3AF) | `--color-gray-400` rgb(126,134,156) |
| Brand logo / wordmark | `text-white` fill | White on dark bg |

---

## Spacing

### Nav grid column internals (desktop)
- Category header: `pb-3 mb-4 border-b border-ink-700` (header text + underline rule, 12px below text, 16px gap before first link)
- Link list: `space-y-3` (12px between each link)
- "All X →" CTA: `mt-5` (extra 20px separation from last nav link)

### Between-zone spacing
- Nav grid ↔ bottom bar: `border-t border-ink-700 mt-12 pt-8`

### Accordion internals (tablet/mobile)
- Row height: `min-h-[52px] flex items-center justify-between px-0 py-4`
- Expanded link list: `pt-4 pb-6 space-y-4`
- Logo block below accordions: `mt-10 mb-6`
- Company links list: `space-y-4`

---

## Components within this section

### Brand mark / wordmark
- Relay SVG logo (owl-eye icon + wordmark) rendered white: `fill-white` / `text-white`
- Height: `h-7` (28px) at all viewports
- Wraps in `<a aria-label="[Brand] — home">`
- Bottom margin from logo to company links: `mt-8`

### Nav category column header (desktop)
```
<h3 class="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-300
           pb-3 mb-4 border-b border-ink-700">
  [COL_HEADER_N]
</h3>
```

### Nav link
```
<a class="block text-sm font-normal text-white/75
          hover:text-white transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-primary-400 focus-visible:ring-offset-1
          focus-visible:ring-offset-ink-900">
  [NAV_LINK_TEXT]
</a>
```

### "All X →" column footer CTA
```
<a class="inline-flex items-center gap-1.5 mt-5
          text-sm font-semibold text-primary-400
          hover:text-primary-300 transition-colors duration-150">
  [ALL_LINK_CTA_N] <span aria-hidden="true">›</span>
</a>
```

### Company/brand links (left column)
```
<a class="block text-sm text-ink-300
          hover:text-white transition-colors duration-150
          py-0.5">
  [COMPANY_LINK_N]
</a>
```
Eight links: Twilio careers · Twilio.org · Press and media · Investor relations · Legal · Privacy · Security · Sitemap (+ LLMS)

### Accordion toggle (tablet/mobile only)
```
<button aria-expanded={isOpen} aria-controls="nav-panel-[id]"
        class="w-full flex items-center justify-between
               min-h-[52px] py-4 border-b border-ink-700
               text-base font-semibold text-white
               focus-visible:outline-none focus-visible:ring-2
               focus-visible:ring-primary-400">
  [COL_HEADER_N]
  <span class="text-white text-xl transition-transform duration-200
               data-[open=true]:rotate-45" aria-hidden="true">+</span>
</button>
```

### Bottom bar
```
<div class="mt-12 pt-8 pb-6 border-t border-ink-700
            flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
  <p class="text-xs text-ink-400 leading-5">[COPYRIGHT_TEXT]</p>
</div>
```

---

## Copy slots

| Slot | Viewport | Notes |
|---|---|---|
| `[COL_HEADER_1]` through `[COL_HEADER_4]` | All | Nav category headers; Twilio uses CONSIDERING TWILIO?, PRODUCTS AND FEATURES, USE CASES, DEVELOPERS |
| `[NAV_LINK_N]` (per column, variable count) | All | ~8–10 links per column |
| `[ALL_LINK_CTA_N]` | All | "All products ›", "All use cases ›" etc. |
| `[COMPANY_LINK_1..9]` | All | Company/legal links in brand column |
| `[COPYRIGHT_TEXT]` | All | "Copyright © [Year] [Brand] Inc. All rights reserved." |

---

## Motion

### Column entrance (desktop)
- `whileInView` + stagger on each of the 5 columns
- `initial: { opacity: 0, y: 16 }` → `animate: { opacity: 1, y: 0 }`
- `transition: { duration: 0.4, ease: [0, 0, 0.2, 1] }` (ease-out-soft)
- Stagger: `delay: colIndex * 0.08` (0ms, 80ms, 160ms, 240ms, 320ms)
- Trigger: `viewport: { once: true, amount: 0.2 }`

### Bottom bar entrance
- Same `whileInView` fade-up, `delay: 0.4`

### Accordion expand/collapse (tablet/mobile)
- Framer Motion `AnimatePresence` wrapping the link panel
- Panel: `initial: { height: 0, opacity: 0 }` → `animate: { height: 'auto', opacity: 1 }` → `exit: { height: 0, opacity: 0 }`
- `transition: { duration: 0.25, ease: [0, 0, 0.2, 1] }`
- Toggle icon: `rotate: 0` → `rotate: 45` when open

### Reduced-motion
- Skip `y` translate and accordion height animation; retain opacity only
- Use `motion-safe:` Tailwind prefix or check `window.matchMedia('(prefers-reduced-motion: reduce)')`
- Accordion: instant open/close (set duration to 0)

### Hover
- All links: `transition-colors duration-150` only; no transform

---

## Accessibility

### Focus ring
```
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-primary-400 focus-visible:ring-offset-2
focus-visible:ring-offset-ink-900
```

### Hit targets
- Desktop nav links: add `py-1` min to achieve ~36px; acceptable on pointer device
- Mobile/tablet links in accordion: `py-2` minimum = `text-sm` (20px) + 16px padding = 36px; use `min-h-[44px]` if needed
- Accordion rows: `min-h-[52px]` ✓ (exceeds 44px)
- Company links on mobile: `py-2` ensuring ≥44px tall tap target

### ARIA
- Desktop: each column wrapped in `<nav aria-label="[Column header] navigation">`
- Accordion buttons: `aria-expanded` + `aria-controls="nav-panel-[id]"`
- Accordion panels: `id="nav-panel-[id]" role="region" aria-labelledby="nav-trigger-[id]"`
- Brand logo link: `aria-label="[Brand name] — home"`

### Color contrast (all on `bg-ink-900` #111827)
- `text-white/75` ≈ rgb(207,207,207): contrast ~10.5:1 ✓ (>4.5:1 for small text)
- `text-ink-300` #D1D5DB: contrast ~12.0:1 ✓
- `text-ink-400` #9CA3AF: contrast ~6.9:1 ✓
- `text-primary-400` #7E8BFF: contrast ~5.4:1 ✓

### Alt text
- Brand logo SVG: `<title>[Brand name]</title>` inside SVG or `aria-label` on the wrapping `<a>`
- No other images in footer

---

## Captured reference (for Engineer's audit)

| Element | Twilio computed |
|---|---|
| `body > footer` desktop | font-size: 16px / font-weight: 400 / line-height: 28px / color: rgb(0,13,37) / background: rgba(0,0,0,0) |
| `body > footer` tablet | font-size: 14px / line-height: 24.5px / width: 768px / height: 1074px |
| `body > footer` mobile | font-size: 14px / line-height: 24.5px / width: 390px / height: 976px |
| Nav inner container (desktop) | max-width: 1200px / padding-top: 32px / padding-bottom: 32px / left-offset: 120px |
| Nav link color (dark theme) | Visual: white/near-white (dark section inverts default) |
| Category header | Visual: ~rgb(175,180,200) uppercase small caps → mapped to `ink-300` |

**Token mappings applied:**
- `--color-ink` rgb(0,13,37) → `ink-900` (#111827): 14px delta in blue channel, visually negligible
- `--color-gray-300` rgb(154,160,180) → `ink-400` (#9CA3AF): closest muted gray
- `--font-family-default` Whitney SSm → `font-sans` (Inter)
- `--font-size-20` 1.4rem (14px) → `text-sm` (0.875rem = 14px): exact match
- `--font-size-10` 1.2rem (12px) → `text-xs` (0.75rem = 12px): exact match
- `--spacing-size-3` 1.6rem (25.6px) → `space-y-6` (24px): 1.6px delta
- `--color-blue-500` rgb(24,102,238) → `primary-400` (#7E8BFF): intent (bright accent link on dark bg)
