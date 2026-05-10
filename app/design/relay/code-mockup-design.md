# Code Mockup design spec

Section: "Build. Without limits." — developer-focused panel with syntax-highlighted code snippet and 7-language tab switcher. Full-width dark section centered below the "Building blocks" row.

---

## Layout

### Section container
| Property | Value |
|---|---|
| Width | Full viewport (1440px desktop / 768px tablet / 390px mobile) |
| Background color | `bg-ink-900` — Twilio computed: `rgb(0, 13, 37)` (`--color-ink`) |
| Background image | Decorative cover image (`bg-[url(...)] bg-cover bg-center bg-no-repeat`); appears as subtle particle/constellation overlay — does not change text readability |
| Padding (desktop) | `py-16` (64px top/bottom) — Twilio: `padding-top: 64px; padding-bottom: 64px` |
| Padding (tablet) | `pt-16 pb-0` (64px top, 0 bottom) — Twilio: `padding-top: 64px; padding-bottom: 0px` |
| Padding (mobile) | `pt-16 pb-8` (64px top, 32px bottom) — Twilio: `padding-top: 64px; padding-bottom: 32px` |

### Inner layout column
| Property | Desktop | Tablet | Mobile |
|---|---|---|---|
| Max-width | `max-w-[992px]` | `max-w-none` (full) | `max-w-none` (full) |
| Horizontal centering | `mx-auto` | — | — |
| Padding left/right | `px-8` (32px) | `px-8` (32px) | `px-8` (32px) |
| Content column width | 928px | 704px | 326px |
| Gap between content rows | `gap-8` (32px) — Twilio: `gap: 32px` | `gap-8` | `gap-8` |
| Layout | `flex flex-col items-stretch` | same | same |

---

## Typography

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| H2 headline | `text-3xl font-bold leading-[1.25] tracking-[-0.01em] text-white text-center` | `md:text-display-lg` (3rem) | `lg:text-display-lg` (3rem) |
| Subtext paragraph | `text-lg font-normal leading-7 text-white text-center` | `md:text-xl md:leading-8` | `lg:text-xl lg:leading-8` |

**Twilio computed (audit reference):**
- H2 desktop/tablet: `font-size: 40px` / `font-weight: 700` / `color: rgb(255, 255, 255)` → maps to Relay `text-display-lg` (3rem = 48px), adjusted per Relay scale
- H2 mobile: `font-size: 28px` / `font-weight: 700` / `color: rgb(255, 255, 255)` → maps to `text-3xl` (1.875rem = 30px)
- P desktop/tablet: `font-size: 20px` / `font-weight: 400` → `text-xl` (1.25rem = 20px, exact)
- P mobile: `font-size: 18px` / `font-weight: 400` → `text-lg` (1.125rem = 18px, exact)

**Copy slots:**
- `[eyebrow]` — none in this section (no eyebrow label above H2)
- `[headline]` — H2: e.g. "Build. [accent-word]. Without limits." (Copywriter task)
- `[subhead]` — single paragraph below H2 (max ~2 lines at desktop)
- `[cta-label]` — ghost button label, e.g. "View docs"

---

## Color

| Role | Token | Twilio computed |
|---|---|---|
| Section background | `bg-ink-900` | `rgb(0, 13, 37)` — `--color-ink` / `--color-default` |
| Headline text | `text-white` | `rgb(255, 255, 255)` |
| Body text | `text-white` | `rgb(255, 255, 255)` |
| CTA text | `text-white` | `rgb(255, 255, 255)` |
| CTA border | `border-white` | implied by `button-secondary inverse` pattern |
| CTA background | `bg-transparent` | `rgba(0, 0, 0, 0)` |
| Code panel background | `bg-primary-900` | `rgb(8, 31, 71)` — `--color-blue-850` |
| Tab bar background | `bg-ink-900` | `rgb(0, 13, 37)` — same as section, blends seamlessly |
| Active tab background | `bg-primary-900` | `rgb(8, 31, 71)` — `--color-blue-850` |
| Inactive tab background | `bg-transparent` | `rgba(0, 0, 0, 0)` |
| Tab label / icon | `text-white` | `rgb(255, 255, 255)` |

---

## Spacing

| Spacing context | Value |
|---|---|
| Section vertical padding | Desktop: `py-16` (64px); Tablet: `pt-16 pb-0`; Mobile: `pt-16 pb-8` |
| Gap between content rows (H2 → P → button → code) | `gap-8` (32px) — Twilio: `gap: 32px` on flex column |
| H2 → P within title block | ~8px (rendered gap inside single `.cmp-title` container) |
| Button horizontal centering | `flex justify-center` on button container |
| Button gap (if multiple CTAs) | `gap-4` (16px) — Twilio: `gap: 16px` |

---

## Components

### CTA Button: "View docs"
Twilio class: `button button-secondary right inverse`

```
<a>
  inline-flex items-center justify-center
  px-6 py-2                     /* Twilio: padding 8px 24px */
  rounded-full                  /* Twilio: border-radius 50px */
  border border-white
  text-base font-medium         /* Twilio: 16px / 500 */
  text-white
  bg-transparent
  min-h-[40px]                  /* Twilio: height 40px */
  min-w-[120px]                 /* Twilio: ~129px */
  transition-colors duration-150
  hover:bg-white/10
```

Tablet: font-size stays `text-base` (14px Twilio tablet, still maps to base/sm)  
Mobile: `text-sm font-medium` — Twilio: `font-size: 14px`

### Code Snippet Component
Outer shell: `rounded-[10px] overflow-hidden` — Twilio: `border-radius: 10px`

#### Tab bar (`code-snippet-tabs`)
```
flex flex-row justify-between items-end
bg-ink-900                    /* Twilio: rgb(0,13,37) */
h-[58px]                      /* Desktop/Tablet — Twilio: height 58px */
mobile: h-[57px]              /* Twilio mobile: ~56.6px */
```

#### Individual tab button (`code-snippet-button`)
```
flex items-center justify-center gap-2
py-3 px-2                     /* Twilio: padding-top/bottom 12px, left/right 8px */
text-base font-normal text-white
min-h-[58px]
cursor-pointer
transition-colors duration-150

[inactive]: bg-transparent rounded-none
[active]:   bg-primary-900 rounded-t rounded-tl-[4px] rounded-tr-[4px]
            /* Twilio: border-radius 4px 4px 0 0 */

Desktop width: ~132.5px per tab (928px / 7 tabs)
Tablet width:  ~100.6px per tab (704px / 7 tabs)
Mobile width:  ~46.6px per tab (326px / 7 tabs) — icon-only, no text label
```

**Language tab list (order):** Python · C# · PHP · Ruby · Java · JavaScript · Curl

**Mobile note:** On mobile (390px viewport), each tab collapses to ~46.5px wide. Language icons are 30.5×30.5px. Text labels are hidden — icons only. Tab button font-size drops to `text-sm` (14px). Twilio: `button computed font-size: 14px` on mobile.

#### Code panel (`code-snippet-slides`)
```
bg-primary-900                /* Twilio: rgb(8, 31, 71) */
h-[460px]                     /* All viewports — Twilio: height 460px */
w-full
font-mono font-light          /* Twilio: font-family mono, font-weight: 300 */
overflow-auto
```

Language icon image dimensions (from computed spans):
- Desktop/Tablet: 32px height (`h-8`) in tab button, full icon
- Mobile: 30.5×30.5px (`h-[30.5px] w-[30.5px]`) — square crop

---

## Responsive summary

| Viewport | Outer dimensions | Inner content width | H2 | P |
|---|---|---|---|---|
| Mobile (390px) | 390×901px | 326px | `text-3xl font-bold` (≈30px) | `text-lg` (18px) |
| Tablet (768px) | 768×906px | 704px | `md:text-display-lg font-bold` (48px) | `md:text-xl` (20px) |
| Desktop (1440px) | 1440×874px | 928px | `lg:text-display-lg font-bold` (48px) | `lg:text-xl` (20px) |

Code panel height is **fixed at 460px** across all viewports. Tab bar height: 58px desktop/tablet, ~57px mobile.

---

## Motion

- **Entrance:** `whileInView` fade-in + subtle translateY
  - `initial={{ opacity: 0, y: 24 }}`
  - `animate={{ opacity: 1, y: 0 }}`
  - `transition={{ duration: 0.5, ease: [0.0, 0.0, 0.2, 1] }}` — `ease-out-soft` per Relay tokens
  - Trigger: `viewport={{ once: true, margin: "-10%" }}`
- **Tab switch:** Instant background swap on active tab (no cross-fade). Code content: `opacity` transition 150ms.
- **Scroll-linked:** None detected — section is static (no GSAP scroll pinning).
- **Hover (CTA button):** `hover:bg-white/10` — subtle fill on hover, 150ms.
- **Reduced motion:** Skip translate on entrance; keep opacity fade. `@media (prefers-reduced-motion: reduce)` → remove `y` offset, keep `opacity` transition only.

---

## Accessibility

- **Focus ring:** `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900` on CTA button and tab buttons
- **Hit targets:** Tab buttons on mobile are ~46.5×57px — meets 44×44px minimum requirement
- **CTA button:** `min-h-[40px]` — 40px height, meets minimum; ensure full text is tappable
- **ARIA:**
  - Tab list: `role="tablist"` on `.code-snippet-tabs`, `aria-label="Language examples"`
  - Each tab button: `role="tab"`, `aria-selected="true/false"`, `aria-controls="panel-[lang]"`
  - Code panel: `role="tabpanel"`, `id="panel-[lang]"`, `aria-labelledby="tab-[lang]"`
  - Language icons: `<img alt="[Python] logo" />` (fill in language name per tab)
- **Color contrast:**
  - White (`#FFFFFF`) on `bg-ink-900` (`#000D25`) → ≫21:1 — exceeds 4.5:1 ✓
  - White text on `bg-primary-900` (`#081F47`) → ~15:1 — exceeds 4.5:1 ✓
- **Alt text for images:**
  - Section background image: `alt=""` (decorative)
  - Tab icons: `alt="[Language name] logo"` per tab (Python logo, C# logo, PHP logo, Ruby logo, Java logo, JavaScript logo, Curl logo)
- **Keyboard nav:** Tab buttons must be keyboard-navigable with arrow keys (left/right) per ARIA Tabs pattern

---

## Captured reference (for Engineer audit)

| Element | Twilio computed |
|---|---|
| Section outer bg | `background-color: rgb(0, 13, 37)` |
| Section outer padding (desktop) | `padding: 64px 0px 64px 0px` |
| Inner container max-width | `992px` (left+right margin: 224px each at 1440 viewport) |
| Inner container padding | `padding: 0px 32px` (left/right) |
| H2 desktop | `font-size: 40px` / `font-weight: 700` / `line-height: 50px (est)` / `color: rgb(255,255,255)` |
| H2 tablet | `font-size: 40px` / `font-weight: 700` / `color: rgb(255,255,255)` |
| H2 mobile | `font-size: 28px` / `font-weight: 700` / `color: rgb(255,255,255)` |
| Subtext P desktop/tablet | `font-size: 20px` / `font-weight: 400` / `color: rgb(255,255,255)` |
| Subtext P mobile | `font-size: 18px` / `font-weight: 400` / `color: rgb(255,255,255)` |
| CTA button | `font-size: 16px (desktop/tablet)` / `14px (mobile)` / `font-weight: 500` / `color: rgb(255,255,255)` / `bg: transparent` / `padding: 8px 24px` / `border-radius: 50px` |
| Code snippet outer | `width: 928px (desktop)` / `704px (tablet)` / `326px (mobile)` / `height: 518px` / `border-radius: 10px` |
| Tab bar | `height: 58px` / `background: rgb(0,13,37)` |
| Active tab | `background: rgb(8,31,71)` / `border-radius: 4px 4px 0 0` / `padding: 12px 8px` |
| Inactive tab | `background: transparent` / `padding: 12px 8px` |
| Code panel | `height: 460px` / `background: rgb(8,31,71)` / `font-weight: 300` |
| Column gap | `gap: 32px` (between H2 block, button row, code snippet) |
