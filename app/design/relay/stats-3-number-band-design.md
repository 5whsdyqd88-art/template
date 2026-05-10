# Stats 3-number band design spec

Section Twilio calls "We think our track record speaks for itself" — three analyst-recognition cards,
each bearing a large bold number (3x / 4x / 5x) with a logo, a label, and a bottom CTA link.

---

## Layout

- **Section container:** `w-full bg-ink-900 pt-8`  
  Full-bleed dark band; no bottom padding (`bot--none` class on Twilio → Engineer sets `pb-0`).
- **xl inner wrapper:** `max-w-[1400px] mx-auto px-8 pt-8 pb-8`  
  (Twilio: margin 20px each side, padding 32px all — content width 1336px at desktop.)
- **Column flex:** `flex flex-col gap-8` (32px gap between H2 and card grid row)
- **Card grid (within column):**
  ```
  grid grid-cols-1 gap-8
  lg:grid-cols-3 lg:gap-12 lg:max-w-[1208px] lg:mx-auto
  ```
  At desktop Twilio renders 3×368px columns with 48px gaps inside a 1208px container
  (margins 64px each side of the 1336px content area; `lg:gap-12` = 48px ≈ `gap-12`).

### Padding summary per viewport

| Viewport | Section pt | Section pb | Inner px | Cards layout |
|---|---|---|---|---|
| Mobile (390px) | `pt-8` (32px) | `pb-0` | `px-8` (32px) | `grid-cols-1 gap-8` |
| Tablet (768px) | `pt-8` (32px) | `pb-0` | `px-8` (32px) | `grid-cols-1 gap-8` |
| Desktop (1440px) | `pt-8` (32px) | `pb-0` | `px-8` (32px) | `lg:grid-cols-3 lg:gap-12 lg:max-w-[1208px] lg:mx-auto` |

---

## Typography

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| H2 headline | `text-[1.75rem] font-bold leading-[1.3] tracking-[-0.02em]` | `md:text-[2.5rem] md:leading-[1.3]` | `lg:text-[2.5rem] lg:leading-[1.3] lg:tracking-[-0.02em]` |
| Stat number (3x/4x/5x) | `text-[4rem] font-bold leading-[1.3] tracking-[-0.03em]` | same | same |
| Card body/label | `text-[1.75rem] leading-[1.3] font-normal` | same | same |
| Card CTA link | `text-base font-medium leading-6` | same | same |

**H2 computed reference (Twilio):** desktop 40px / 700 / lh:52px(1.3) / ls:-0.8px / center.  
Mobile: 28px / 700 (verified in mobile elements_top.json, top=8744).  
Twilio token: near `--font-size-65: 2.6rem` (41.6px); exact computed = 40px = 2.5rem.  
Relay maps to `text-[2.5rem]` (between display-md 2.25rem and display-lg 3rem — no exact token).

**Stat number computed (Twilio):** 64px / 700 / lh:83.2px (1.3) / ls:-3% / color `rgb(239,34,58)`.  
Twilio token: `--font-size-80: 4rem` = 64px ✓.  
Relay maps to `text-[4rem]` (no exact token; display-xl is 3.75rem/60px — too small).

**Card label computed (Twilio):** 28px / 400 / lh:36px (1.29) / color `rgb(255,255,255)`.  
Twilio token: near `--font-size-40: 1.8rem` (28.8px); exact computed = 28px = 1.75rem.  
Relay maps to `text-[1.75rem] leading-[1.3]` (between text-2xl 24px and text-3xl 30px).

---

## Color

- **Section background:** `bg-ink-900`  
  Twilio computed: `rgb(0, 13, 37)` → Relay `ink-900: #111827`.
- **Card background:** `bg-ink-800`  
  Twilio computed: `rgb(25, 31, 54)` = Twilio `--color-gray-850`.  
  Closest Relay token: `ink-800: #1F2937` (hex match: #191F36 — not in palette; Engineer may add custom token if needed).
- **Card background hover:** `hover:bg-ink-700`  
  Twilio `transition: background-color 0.18s ease-in-out`; hover lightens card.
- **H2 text:** `text-white` (Twilio: `rgb(255, 255, 255)`)
- **Stat number (3x/4x/5x):** `text-primary-500`  
  Twilio computed: `rgb(239, 34, 58)` = Twilio brand red `--color-red-light`.  
  Per token-mapping rules: Twilio brand red → Relay `primary-500 (#5B6CFF)`.
- **Stat number on card hover:** `group-hover:text-white transition-colors`  
  Twilio: `transition: color 0.18s ease-in-out` on the number span.
- **Card label text:** `text-white`
- **Card CTA link:** `text-white hover:text-primary-300 transition-colors`

---

## Spacing

| Gap | Classes | Twilio source |
|---|---|---|
| H2 → card grid | `gap-8` (32px) in flex column | Twilio column gap: `gap: 32px` |
| Between cards (mobile/tablet) | `gap-8` (32px) in single-column grid | Twilio tablet stacked gap: ~32px |
| Between cards (desktop) | `lg:gap-12` (48px) | Twilio: 3-col grid `gap: 48px` (computed) |
| Card internal (top–logo, logo–richtext, richtext–CTA) | `gap-8` (32px) inside flex column | Twilio: layout-column gap `32px` |
| Card padding | `p-8` (32px all) | Twilio: `padding: 32px` all sides (desktop + tablet) |
| Card padding mobile | `p-8` (same; Twilio mobile card uses same 32px) | Matches computed |
| Section vertical rhythm | `pt-8 pb-0` outer + `py-8` xl inner | Outer `padding-top: 32px`; xl `padding: 32px` |

---

## Components within this section

### H2 headline block
```
<h2 class="text-[1.75rem] md:text-[2.5rem] font-bold leading-[1.3]
           tracking-[-0.02em] text-white text-center">
  [HEADLINE SLOT]
</h2>
```

### Card grid
```
<div class="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12 lg:max-w-[1208px] lg:mx-auto">
  {cards}
</div>
```

### Single card (full card is a link)
```
<a class="group flex flex-col gap-8 bg-ink-800 rounded-[20px] p-8
          hover:bg-ink-700 transition-colors duration-[180ms] ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-ink-900">

  {/* Row 1 — Analyst logo */}
  <div class="flex items-center h-12">
    <img src="..." alt="[Logo alt]" class="h-12 w-auto" />
  </div>

  {/* Row 2 — Richtext: number + label (flex column, gap 0 — internal paragraph spacing) */}
  <div class="flex flex-col grow">
    <p>
      <span class="text-[4rem] font-bold leading-[1.3] tracking-[-0.03em]
                   text-primary-500 group-hover:text-white
                   transition-colors duration-[180ms] ease-in-out">
        [NUMBER SLOT]
      </span>
    </p>
    <p class="text-[1.75rem] leading-[1.3] font-normal text-white mt-0">
      [LABEL SLOT]
    </p>
  </div>

  {/* Row 3 — CTA (bottom-aligned) */}
  <div class="mt-auto pt-8 flex items-end">
    <span class="text-base font-medium leading-6 text-white
                 hover:text-primary-300 transition-colors duration-[150ms]
                 inline-flex items-center gap-2">
      [CTA SLOT] <ArrowRightIcon class="w-4 h-4 shrink-0" />
    </span>
  </div>

</a>
```

- Card height: desktop `~503px` (Twilio computed: 503.1875px); use `h-full` within grid row for equal heights.
- Card border-radius: `rounded-[20px]` (Twilio `border-radius: 20px` = `--radius-extra-large: 2rem`).
- Entire card is `<a>` wrapping all content (Twilio pattern: `layout-column` anchor).

### Analyst logos
| Card | Logo | Twilio box (desktop) | Relay class |
|---|---|---|---|
| Card 1 | Gartner SVG | 172.4 × 48px | `h-12 w-auto max-w-[172px]` |
| Card 2 | Omdia SVG | 152 × 48px | `h-12 w-auto max-w-[152px]` |
| Card 3 | IDC SVG | 107 × 48px | `h-12 w-auto max-w-[108px]` |

---

## Motion

### Entrance (scroll into view)
- Each card: `whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 32 }}`
- Transition: `{ duration: 0.5, ease: [0, 0, 0.2, 1] }`
- Stagger: card 1 at `delay: 0`, card 2 at `delay: 0.1`, card 3 at `delay: 0.2`
- Trigger: `viewport={{ once: true, margin: "-64px" }}`

### Stat number count-up animation
- When card enters view, count from 0 to the final number (3, 4, 5) over ~0.8s
- Suffix (`x`) remains static; only the numeric part counts up
- Implement via `react-countup` triggered by `whileInView`, or Framer Motion `animate` with `useEffect` + `useState`
- Duration: 0.8s, easing: `easeOut`
- Example: `<CountUp end={3} duration={0.8} suffix="x" className="..." />`

### Hover
- Card bg: `bg-ink-800 → bg-ink-700`, `transition-colors duration-[180ms] ease-in-out`  
  (Twilio computed: `transition: background-color 0.18s ease-in-out`)
- Number color: `text-primary-500 → text-white`, `transition-colors duration-[180ms] ease-in-out`  
  (Twilio computed: `transition: color 0.18s ease-in-out`)
- Entire card is interactive via `group` + `group-hover:` classes

### Reduced motion
- Skip `y` translate on entrance; keep `opacity` fade only
- Skip count-up animation; render final number immediately
- Implement via Framer Motion `useReducedMotion()`:
  ```ts
  const prefersReduced = useReducedMotion()
  const variants = prefersReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }
  ```

---

## Accessibility

- **Focus ring:** `focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-ink-900` on each card `<a>`
- **Hit targets:** Cards are large link regions (≥368×503px at desktop; ≥326px×~420px at mobile) — well above 44×44px
- **ARIA:**
  - Each card `<a>` must have an accessible name; use `aria-label="[NUMBER]: [LABEL]"` on the anchor, e.g. `aria-label="3x: [headline copy]"` (Copywriter to finalize)
  - Analyst logos: `<img alt="Gartner" />`, `<img alt="Omdia" />`, `<img alt="IDC" />` (not decorative — identifies the analyst firm)
  - Arrow icon in CTA: `aria-hidden="true"` (decorative)
  - The CTA text ("Read the report", "View the excerpt") is visually visible but redundant given the card aria-label — Engineers should confirm screen-reader experience; consider `<span aria-hidden="true">` on the CTA text if card aria-label is comprehensive
- **Color contrast:**
  - `text-white` on `ink-800 (#1F2937)`: #FFF on #1F2937 → ~14:1 ✓ (≥4.5:1)
  - `text-white` on `ink-900 (#111827)`: #FFF on #111827 → ~18:1 ✓
  - `primary-500 (#5B6CFF)` (number) on `ink-800 (#1F2937)`: ~4.1:1 — borderline AA for normal text; numbers are large/bold (≥18.66px bold qualifies as large text per WCAG → 3:1 threshold); at `text-[4rem]/700` this comfortably exceeds 3:1 ✓
  - H2 `text-white` on `ink-900`: ✓ as above
- **Alt text for logos:**
  - Gartner: `alt="Gartner"`
  - Omdia: `alt="Omdia"`
  - IDC: `alt="IDC"`
- **Section landmark:** wrap in `<section aria-labelledby="stats-heading">` with `id="stats-heading"` on the `<h2>`

---

## Copy slots

| Slot | Twilio source (reference — do NOT use) | Notes |
|---|---|---|
| H2 headline | "We think our track record speaks for itself" | [HEADLINE SLOT] — 40–60 chars |
| Card 1 number | "3x" | [STAT-1 NUMBER SLOT] |
| Card 1 label | "Twilio was named a Leader in the Gartner® Magic Quadrant™ for CPaaS" | [STAT-1 LABEL SLOT] — analyst recognition copy |
| Card 1 CTA | "Read the report" | [STAT-1 CTA SLOT] |
| Card 2 number | "4x" | [STAT-2 NUMBER SLOT] |
| Card 2 label | "Twilio was named a leader in the Omdia Universe: Customer Engagement Platforms (CEP)" | [STAT-2 LABEL SLOT] |
| Card 2 CTA | "Read the report" | [STAT-2 CTA SLOT] |
| Card 3 number | "5x" | [STAT-3 NUMBER SLOT] |
| Card 3 label | "Twilio was named a leader in the IDC MarketScape: Worldwide CPaaS" | [STAT-3 LABEL SLOT] |
| Card 3 CTA | "View the excerpt" | [STAT-3 CTA SLOT] |

No eyebrow above the H2 in the Twilio reference.

---

## Captured reference (for the Engineer's audit)

**Section container (desktop):**
- Twilio outer: `bg: rgb(0,13,37)` / `width: 1440px` / `height: 747px` / `padding-top: 32px`
- Twilio xl inner: `max-width: 1400px` / `margin: 0 20px` / `padding: 32px`
- → Relay: `bg-ink-900 pt-8` outer; `max-w-[1400px] mx-auto px-8 py-8` inner

**H2 heading (desktop):**
- Twilio computed: `40px / 700 / lh:52px / ls:-0.8px / rgb(255,255,255) / text-align:center`
- Twilio box: `top:10589 / left:52 / width:1336 / height:52`
- → Relay: `text-[2.5rem] font-bold leading-[1.3] tracking-[-0.02em] text-white text-center`

**H2 heading (mobile):**
- Twilio computed: `28px / 700 / rgb(255,255,255) / text-align:center`
- Twilio box: `top:8744 / left:0 / width:326 / height:104` (2-line wrap)
- → Relay: `text-[1.75rem] font-bold leading-[1.3] tracking-[-0.02em] text-white text-center`

**Card container:**
- Twilio computed: `bg:rgb(25,31,54)` / `border-radius:20px` / `width:368px` / `height:503px` / `padding:32px`
- Twilio box (desktop): `top:10705 / left:120 / width:368 / height:503`
- Twilio box (tablet): `top:8491 / left:0 / width:696 / height:395`
- → Relay: `bg-ink-800 rounded-[20px] p-8`

**Stat number spans (all 3 cards):**
- Twilio computed: `font-size:64px / font-weight:700 / line-height:83.2px / letter-spacing:-3% / color:rgb(239,34,58)`
- Twilio class: `h2-style text-white`
- Twilio transition: `color 0.18s ease-in-out`
- → Relay: `text-[4rem] font-bold leading-[1.3] tracking-[-0.03em] text-primary-500 group-hover:text-white transition-colors duration-[180ms]`

**Card label/description:**
- Twilio computed: `font-size:28px / font-weight:400 / line-height:36px / color:rgb(255,255,255)`
- Twilio tag: `<span>` inside `<p class="top-none">`
- → Relay: `text-[1.75rem] leading-[1.3] font-normal text-white`

**Card grid layout (desktop):**
- Twilio computed: `grid-template-columns:368px 368px 368px / gap:48px / width:1208px / margin:0 64px / padding:32px 4px`
- → Relay: `lg:grid-cols-3 lg:gap-12 lg:max-w-[1208px] lg:mx-auto`

**Card hover transitions:**
- Twilio: `transition: background-color 0.18s ease-in-out` on card container
- Twilio: `transition: color 0.18s ease-in-out` on number span
- → Relay: `transition-colors duration-[180ms] ease-in-out` + Tailwind `hover:` and `group-hover:` variants

**Analyst logo sizes:**
- Gartner SVG: `172.4 × 48px` — → `h-12 w-auto max-w-[172px]`
- Omdia SVG: `152 × 48px` — → `h-12 w-auto max-w-[152px]`
- IDC SVG: `107 × 48px` — → `h-12 w-auto max-w-[108px]`
