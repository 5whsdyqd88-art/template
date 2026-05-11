# Footer design spec

Section: Footer — multi-column site nav, brand line, bottom bar

---

## Layout

### Section container

| Property | Mobile (default) | Tablet (md: ≥768px) | Desktop (lg: ≥1024px) |
|---|---|---|---|
| Outer wrapper | `w-full bg-ink-900` | same | same |
| Inner container | `max-w-screen-xl mx-auto px-8 py-10` | `md:py-12` | `lg:pt-16 lg:pb-12` |
| Inner layout | `flex flex-col gap-0` | same | `lg:grid lg:grid-cols-[200px_1fr_1fr_1fr_1fr] lg:gap-10 lg:items-start` |

- Max-width: `max-w-screen-xl` (1280px) — 1200px inner content at 1440px viewport with ~120px auto margins each side
- Desktop viewport dimensions captured: 1440 × 618px total footer height
- Tablet viewport dimensions captured: 768 × 1074px
- Mobile viewport dimensions captured: 390 × 976px
- Background: `bg-ink-900` — Twilio `rgba(0,0,0,0)` (transparent) on ancestor `rgb(0, 13, 37)` = `--color-default` / `--color-ink` / `--color-blue-900`; Relay nearest token: `ink-900` (#111827)
- Top separator: `border-t border-white/10` above the nav columns area

---

## Typography

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| Column header label | `text-[11px] font-semibold uppercase tracking-widest text-white leading-none` | same | same |
| Column header separator | `block w-full h-px bg-white/20 mt-3 mb-4` | same | same |
| Nav link | `text-sm font-normal text-ink-200 leading-snug` | same | same |
| Nav "View all X →" CTA link | `text-sm font-medium text-primary-400` | same | same |
| Brand misc link (careers, legal, etc.) | `text-sm font-normal text-ink-300 leading-snug` | same | same |
| Bottom copyright | `text-xs font-normal text-ink-400 leading-normal` | same | same |
| Bottom CCPA notice | `text-xs text-ink-500 leading-relaxed` | same | same |
| Accordion trigger label | `text-sm font-medium text-white` | same | `lg:hidden` |

Twilio reference:
- Footer base font: `"Whitney SSm", helvetica, arial, sans-serif` → Relay: Inter (`font-sans`)
- Desktop computed: `font-size: 16px / font-weight: 400 / line-height: 28px (1.75)` = `--font-size-30` / `--line-height-body`
- Tablet/mobile computed: `font-size: 14px / line-height: 24.5px (1.75)` = `--font-size-20`

---

## Color

| Element | Relay token | Hex | Twilio reference |
|---|---|---|---|
| Footer background | `bg-ink-900` | #111827 | `rgb(0, 13, 37)` ancestor dark bg (`--color-default`) |
| Column headers | `text-white` | #FFFFFF | white on dark theme |
| Column header separator | `bg-white/20` | rgba(255,255,255,0.2) | derived from dark-theme contrast |
| Nav links (default) | `text-ink-200` | #E5E7EB | ~`rgb(225, 227, 234)` (`--color-gray-20`) |
| Nav links (hover) | `text-white` | #FFFFFF | — |
| Nav CTA "View all →" | `text-primary-400` | #7E8BFF | `rgb(2, 99, 224)` (`--color-blue-60` / `--color-link`) → Relay primary |
| Brand misc links (default) | `text-ink-300` | #D1D5DB | ~`rgb(202, 205, 216)` (`--color-gray-30`) |
| Brand misc links (hover) | `text-white` | #FFFFFF | — |
| Bottom bar separator | `border-white/10` | rgba(255,255,255,0.1) | dark theme divider |
| Copyright text | `text-ink-400` | #9CA3AF | ~`rgb(174, 178, 193)` (`--color-gray-40`) |
| CCPA / legal notice | `text-ink-500` | #6B7280 | ~`rgb(120, 140, 175)` (`--color-ship-cove`) |
| Accordion trigger | `text-white` | #FFFFFF | dark-theme heading |
| Accordion plus icon | `text-white` | #FFFFFF | dark-theme icon |
| Accordion separator | `border-white/10` | rgba(255,255,255,0.1) | dark theme divider |

---

## Spacing

### Desktop grid (lg:)
- Grid: `lg:grid-cols-[200px_1fr_1fr_1fr_1fr] lg:gap-10`
- Column 1 width: 200px (brand + misc links)
- Columns 2–5: equal `1fr` (each ~210px at 1200px inner width with 4×40px gaps)
- Section vertical padding: `lg:pt-16 lg:pb-12` (64px top, 48px bottom)

### Link list spacing
- Links within a column: `space-y-3` (12px gap)
- Column header + separator bottom margin: `mb-4` (16px to first link)

### Brand column spacing
- Logo bottom margin: `mb-8` (32px) → `--spacing-size-5: 3.2rem`
- Misc link list top: follows logo margin
- Copyright slot: `mt-auto pt-8` (push to bottom on desktop)

### Bottom bar
- Separator from main columns: `mt-12 pt-6 border-t border-white/10`
- Mobile/tablet: `mt-8 pt-6`

### Mobile/tablet accordion
- Accordion item: `border-b border-white/10`
- Trigger padding: `py-4` (min 44px hit target with `min-h-[44px]`)
- Expanded content padding: `pb-4`
- Brand section: `mt-8 mb-6`
- Misc links: `space-y-3`

---

## Components within this section

### Brand mark / wordmark (Column 1, desktop; below accordions, tablet/mobile)
- Treatment: white wordmark SVG or `<img>` alt="Relay"
- Desktop: inline in column 1, `w-[110px]` (scaled from Twilio ~140px owl+wordmark at 1440px)
- Tablet/mobile: `w-[100px] mt-8`

### Nav column (desktop, Columns 2–5)
```
<div class="flex flex-col">
  <span class="text-[11px] font-semibold uppercase tracking-widest text-white">
    [COLUMN_HEADING_SLOT]
  </span>
  <span class="block w-full h-px bg-white/20 mt-3 mb-4" />
  <ul class="flex flex-col space-y-3">
    <li><a class="text-sm text-ink-200 hover:text-white transition-colors duration-150">
      [LINK_LABEL_SLOT]
    </a></li>
    <!-- ... -->
    <li class="mt-4">
      <a class="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors duration-150">
        [VIEW_ALL_CTA_SLOT] →
      </a>
    </li>
  </ul>
</div>
```

### Accordion item (tablet/mobile only, `lg:hidden`)
```
<div class="border-b border-white/10">
  <button class="flex items-center justify-between w-full py-4 min-h-[44px]
                 text-sm font-medium text-white cursor-pointer"
          aria-expanded="false" aria-controls="footer-section-[id]">
    [SECTION_HEADING_SLOT]
    <svg class="w-4 h-4 text-white transition-transform duration-150
                aria-expanded:rotate-45" .../>  <!-- plus icon -->
  </button>
  <div id="footer-section-[id]" class="overflow-hidden">
    <ul class="pb-4 flex flex-col space-y-3">
      <li><a class="text-sm text-ink-200 hover:text-white transition-colors">
        [LINK_LABEL_SLOT]
      </a></li>
    </ul>
  </div>
</div>
```

### Four nav columns (copy slots)

| Column | Heading slot | "View all" CTA slot |
|---|---|---|
| 2 | `[CONSIDERING_RELAY_HEADING]` | `[ALL_PRODUCTS_CTA]` |
| 3 | `[PRODUCTS_AND_FEATURES_HEADING]` | `[ALL_FEATURES_CTA]` |
| 4 | `[USE_CASES_HEADING]` | `[ALL_USE_CASES_CTA]` |
| 5 | `[DEVELOPERS_HEADING]` | `[ALL_RESOURCES_CTA]` |

Each column: 8–11 link slots (`[NAV_LINK_LABEL_SLOT]`).

### Brand misc links (Column 1, below logo)
- 9 slots: `[CAREERS_LINK]`, `[ORG_LINK]`, `[PRESS_LINK]`, `[INVESTOR_LINK]`, `[LEGAL_LINK]`, `[PRIVACY_LINK]`, `[SECURITY_LINK]`, `[SITEMAP_LINK]`, `[LLMS_LINK]`
- Styling: `text-sm text-ink-300 hover:text-white transition-colors`

### Bottom bar
- Left: `[COPYRIGHT_SLOT]` — e.g. "Copyright © 2026 Relay Inc. All rights reserved."
- Below copyright: `[CCPA_NOTICE_SLOT]` — long-form legal notice (2–3 sentences) `text-xs text-ink-500`

---

## Motion

- **Accordion expand/collapse**: height animation using CSS `grid-rows` trick or JS toggle of `max-height`
  - Expand: `max-h-[0] → max-h-[500px]` with `overflow-hidden transition-[max-height] duration-[300ms] ease-out-soft`
  - Collapse: reverse, `duration-[200ms]`
  - Plus icon rotation: `rotate-0 → rotate-45` `transition-transform duration-150`
- **Link hover**: color only — `transition-colors duration-150 ease-out` — no translate
- **Entrance**: none — footer is below the fold; no `whileInView` animation needed
- **Scroll-linked**: none
- **Reduced motion** (`prefers-reduced-motion: reduce`): suppress `max-height` transition (instant expand); link color transition is safe to keep (opacity/color-only, no layout shift)

---

## Accessibility

- **Focus ring**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900`
- **Hit targets**: accordion triggers min `min-h-[44px] w-full`; misc/nav links have `py-1` padding for ≥44px vertical on mobile (`text-sm` 20px × 1.75 = 35px — add `py-[5px]` to reach 44px)
- **ARIA**:
  - Each accordion `<button>` needs `aria-expanded="true|false"` + `aria-controls="footer-panel-[id]"`
  - Each accordion panel needs `id="footer-panel-[id]"` + `role="region"` + `aria-labelledby` pointing to the trigger
  - Footer landmark: `<footer role="contentinfo">` (implicit from `<footer>` element)
  - Nav columns: wrap each column in `<nav aria-label="[Section name] links">` or use a single `<nav aria-label="Footer">` wrapping the whole grid
- **Color contrast**:
  - `text-ink-200` (#E5E7EB) on `bg-ink-900` (#111827) → ~14.4:1 ✓ (WCAG AAA)
  - `text-ink-300` (#D1D5DB) on `bg-ink-900` → ~10.5:1 ✓
  - `text-ink-400` (#9CA3AF) on `bg-ink-900` → ~5.9:1 ✓ (AA large text)
  - `text-ink-500` (#6B7280) on `bg-ink-900` → ~3.9:1 — CCPA notice is small text; engineer should use `text-ink-400` if WCAG AA is required for that copy
  - `text-primary-400` (#7E8BFF) on `bg-ink-900` → ~6.2:1 ✓
- **Alt text**:
  - Brand logo: `alt="Relay"`
  - Social icons (if present): individual `aria-label` per icon (e.g., `aria-label="Relay on GitHub"`)

---

## Captured reference (for Engineer's audit)

| Property | Twilio desktop computed | Twilio tablet/mobile computed |
|---|---|---|
| Footer element | `body > footer.experiencefragment.global-footer` | same selector |
| Footer outer bg | `rgba(0, 0, 0, 0)` transparent | same |
| Ancestor section bg | `rgb(0, 13, 37)` (`--color-default`) | same |
| Footer dimensions | 1440 × 618 px | 768 × 1074 px / 390 × 976 px |
| Font family | `"Whitney SSm", helvetica, arial, sans-serif` | same |
| Base font size | `16px` | `14px` |
| Base line height | `28px` (1.75) | `24.5px` (1.75) |
| Base font weight | `400` | `400` |
| Column header estimate | ~12px / semibold / uppercase / color ~white | collapsible accordion trigger |
| Nav link estimate | ~14px / normal / `rgb(202–225, 205–227, 216–234)` (gray-20 to gray-30) | same sizing, accordion-hidden |
| Link blue color | `rgb(2, 99, 224)` (`--color-blue-60` / `--color-link`) → `primary-400` | same |
| Spacing: section v-pad | `--spacing-size-7: 6.4rem` (64px) top | `--spacing-size-6: 4.8rem` (48px) |
| Spacing: link gap | `--spacing-size-2: 1.2rem` (12px) → `space-y-3` | same |
| Spacing: col gap | ~40px between columns → `gap-10` | n/a (accordion stacked) |
| Bottom bar separator | 1px rule, rgba white | 1px rule, rgba white |
