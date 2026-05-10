# Closing CTA design spec

Section: full-width dark strip with H2 headline, tagline, primary + secondary CTAs, and a decorative right-column visual.
Twilio reference: `layout-container bg-color-ink-100 full-width bg-image bg-size-cover dark-theme` at desktop y≈11272.

---

## Layout

- **Section container:** `w-full bg-ink-900` — full-width, no border-radius, no box-shadow
- **Background:** solid `bg-ink-900` (#111827; Twilio computed `rgb(0,13,37)` = `--color-ink`/`--color-default`) plus a decorative background image at `bg-cover bg-center` (Twilio class `bg-image bg-size-cover`); the image slot must be provided as a visual asset
- **Inner wrapper:** `max-w-[1200px] mx-auto px-8` — matches Twilio inner `max-width: 992px–1200px` with `padding: 0 32px`
- **Grid:**
  - Mobile (`< md`): single-column stack `grid grid-cols-1 gap-8`
  - Tablet (`md`, 768px): two equal columns `grid md:grid-cols-2 md:gap-8`
  - Desktop (`lg`, 1440px): two equal columns, same as tablet — `lg:grid-cols-2 lg:gap-12`
- **Vertical padding:**
  - Top: `pt-16` (64px) all viewports — Twilio computed `padding-top: 64px` on inner container
  - Bottom: `pb-0` — section flows directly into Sources accordion strip; no bottom pad at any viewport
- **Section height:** auto (content-driven); Twilio measures: desktop 400px, tablet 548px, mobile ~497px

---

## Typography

| Element | Mobile (`< md`) | Tablet (`md:`) | Desktop (`lg:`) |
|---|---|---|---|
| H2 / Headline | `text-3xl font-bold leading-tight tracking-tight` | `md:text-display-lg md:leading-[1.3] md:tracking-[-0.02em]` | `lg:text-display-lg` (same) |
| Subtext / Tagline | `text-lg leading-7 font-normal` | `md:text-xl md:leading-relaxed md:font-normal` | `lg:text-xl lg:leading-relaxed` (same) |

**Mapping rationale:**
- Twilio H2 desktop: `font-size: 40px / font-weight: 700 / line-height: 52px / letter-spacing: -0.8px` → maps to Relay `text-display-lg` (3rem = 48px, lh 1.1, tracking -0.02em, weight 700). 40px ÷ Twilio hero 56px ≈ 0.71 ratio; Relay display-lg ÷ display-xl ≈ 0.80 — the closing CTA headline should be large but sub-hero.
- Twilio H2 mobile: `font-size: 28px / line-height: 36px` → Relay `text-3xl` (1.875rem = 30px, `leading-tight` ≈ 36px).
- Twilio subtext desktop (`paragraph-extra-large`): `font-size: 20px / line-height: 32px (1.6)` → Relay `text-xl leading-relaxed` (20px, lh 1.625 ≈ 1.6).
- Twilio subtext mobile: `font-size: 18px / line-height: 28px` → Relay `text-lg leading-7` (18px, lh 1.75rem).

---

## Color

| Token | Relay class | Twilio computed |
|---|---|---|
| Section background | `bg-ink-900` | `rgb(0, 13, 37)` = `--color-ink` |
| Headline | `text-white` | `rgb(255, 255, 255)` |
| Tagline / body | `text-white` | `rgb(255, 255, 255)` |
| Primary CTA background | `bg-primary-500` | `rgb(24, 102, 238)` = `--color-blue-500` (#1866EE → Relay #5B6CFF) |
| Primary CTA text | `text-white` | `rgb(255, 255, 255)` |
| Primary CTA hover | `hover:bg-primary-600` | — |
| Secondary CTA ("View pricing") | `text-white` (link, no fill) | `rgb(255, 255, 255)`, `background: rgba(0,0,0,0)` |

---

## Spacing

| Slot | Classes | Twilio measured |
|---|---|---|
| Section top padding | `pt-16` | 64px (all viewports) |
| H2 → tagline | `mt-8` | 32px gap (desktop, tablet, mobile uniform) |
| Tagline → button row | `mt-8` | 32px gap (desktop, tablet, mobile uniform) |
| Button row gap (primary → secondary) | `gap-4` horizontal (`flex-row gap-4`) desktop/tablet; `flex-col gap-3` mobile | desktop: side-by-side; mobile: stacked |

---

## Components within this section

### Left column (content)

**Headline (H2):**
```
text-3xl md:text-display-lg font-bold leading-tight md:leading-[1.3]
tracking-tight md:tracking-[-0.02em] text-white
```
Copy slot: `[CTA_HEADLINE]` — e.g. "TL;DR: Don't wait for the future. Build it." (Copywriter sets final text; no Twilio copy)

**Tagline (paragraph):**
```
mt-8 text-lg md:text-xl leading-7 md:leading-relaxed font-normal text-white
```
Copy slot: `[CTA_TAGLINE]` — 2–3 sentences max (Twilio reference was ~40 words)

**Primary CTA button:**
```
mt-8 inline-flex items-center justify-center
bg-primary-500 hover:bg-primary-600 active:bg-primary-700
text-white font-medium text-base
px-6 py-2 rounded-full
transition-colors duration-fast
focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900
```
Twilio computed: `background: rgb(24,102,238)` / `padding: 8px 24px` / `border-radius: 50px` / `font-weight: 500` / `font-size: 16px` / height 40px

Copy slot: `[CTA_PRIMARY_LABEL]` e.g. "Start for free"

**Secondary CTA link:**
```
text-white font-medium text-base underline-offset-4 hover:underline
focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:rounded
```
Twilio computed: `background: rgba(0,0,0,0)` / `color: rgb(255,255,255)` / `font-weight: 500` / link class

Copy slot: `[CTA_SECONDARY_LABEL]` e.g. "View pricing"

**Button container:**
```
flex flex-col gap-3 sm:flex-row sm:gap-4 items-start
```
Mobile stacks vertically (Twilio button-container height 80.5px on mobile vs 40px on desktop/tablet).

### Right column (visual asset)

Empty in element scan (Twilio `bg-image` lives on the section, not a child element). Slot must be filled by a decorative illustration or brand image supplied as a visual asset.

```html
<div class="hidden md:block relative">
  <!-- [CTA_VISUAL_ASSET]: decorative brand illustration, covers column -->
  <Image src="..." alt="[CTA_VISUAL_ALT]" fill className="object-cover object-center" />
</div>
```

---

## Motion

- **Entrance (scroll-triggered fade + lift):**
  - Twilio class: `container-fade-effect` + `transition: all` on outer container
  - Relay / Framer Motion:
    ```ts
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.0, 0.0, 0.2, 1] }}
    viewport={{ once: true, margin: "-80px" }}
    ```
  - Apply to the left-column content block; right visual can fade independently with `delay: 0.15`
- **Scroll-linked:** none observed (no GSAP parallax or scrub classes on this section)
- **Reduced-motion:** `motion-safe:` prefix on translate; opacity transition is kept even with reduced-motion preference
  ```ts
  // or via CSS
  @media (prefers-reduced-motion: reduce) { transition: opacity 0.3s ease; transform: none; }
  ```
- **Hover (primary button):** `hover:bg-primary-600` + `transition-colors duration-fast` (150ms)

---

## Accessibility

- **Focus ring:** `focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900` on both buttons
- **Hit targets:**
  - Primary button: 40px height (Twilio computed) — 4px below the 44px WCAG 2.5.5 target; pad to `min-h-[44px]` in Relay implementation
  - Secondary link: height 26–28px — add `py-2` to reach ≥44px on mobile
- **ARIA:**
  - Section: `<section aria-labelledby="cta-headline">`
  - H2: `id="cta-headline"`
  - Primary button: `<a role="button">` or `<button>` — no special aria needed if text is descriptive
  - Right-column image: `alt="[CTA_VISUAL_ALT]"` (descriptive alt string to be provided by Copywriter)
- **Color contrast:**
  - White text on `ink-900` (#111827): contrast ≈ 16.7:1 ✓ (WCAG AAA)
  - White text on `primary-500` (#5B6CFF): contrast ≈ 4.2:1 — meets AA for large text (≥18pt bold) ✓; engineers should verify with exact Relay token value

---

## Captured reference (for the Engineer's audit)

| Property | Desktop computed | Tablet computed | Mobile computed |
|---|---|---|---|
| Section bg | `rgb(0, 13, 37)` | `rgb(0, 13, 37)` | `rgb(0, 13, 37)` |
| Section size | 1440×400px | 768×548px | 390×497px |
| Inner max-width | 992px (padding 32px) | 1200px → 768px | 1200px → 390px |
| Inner padding-top | 64px | 64px | 64px |
| H2 font-size | 40px | 40px | 28px |
| H2 font-weight | 700 | 700 | 700 |
| H2 line-height | 52px | 52px | 36px |
| H2 letter-spacing | -0.8px | (not captured) | (not captured) |
| H2 color | `rgb(255,255,255)` | `rgb(255,255,255)` | `rgb(255,255,255)` |
| Subtext font-size | 20px (`paragraph-extra-large`) | 20px | 18px |
| Subtext line-height | 32px | 32px | 28px |
| Subtext color | `rgb(255,255,255)` | `rgb(255,255,255)` | `rgb(255,255,255)` |
| H2→subtext gap | 32px | 32px | 32px |
| Subtext→buttons gap | 32px | 32px | 32px |
| Primary btn bg | `rgb(24,102,238)` | `rgb(24,102,238)` | `rgb(24,102,238)` |
| Primary btn text | `rgb(255,255,255)` | `rgb(255,255,255)` | `rgb(255,255,255)` |
| Primary btn padding | 8px 24px | 8px 24px | 8px 24px |
| Primary btn border-radius | 50px (pill) | 50px | 50px |
| Primary btn font-weight | 500 | 500 | 500 |
| Primary btn height | 40px | 40px | 40px |
| Secondary link style | no bg / white / fw 500 | no bg / white / fw 500 | no bg / white / fw 500 |
| Button layout | row (side-by-side) | row | column (stacked) |
| Left col width | 568px | 328px | 326px |
| Right col width | 568px | 328px | hidden / stacked |
