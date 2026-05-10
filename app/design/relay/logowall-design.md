# Logo wall design spec

Customer trust strip — 5–8 placeholder wordmarks. Sits immediately below the hero section, above the platform-story section.

## Layout

- Section container: `w-full bg-ink-900 border-t border-ink-800`
  - md: same
  - lg: same
- Inner wrapper: `max-w-7xl mx-auto px-6 md:px-10 lg:px-20 py-10 md:py-12 lg:py-16`
  - Max-width: 1280px (Tailwind `max-w-7xl`)
  - Padding-x: 24px mobile / 40px tablet / 80px desktop
  - Padding-y: 40px mobile / 48px tablet / 64px desktop
  - Twilio reference: section container at desktop uses 64px top/bottom padding (`padding-top: 64px`/`padding-bottom: 64px` on `.layout-container.bg-color-ink-100` at y=9609)
- Background: `bg-ink-900` (#111827)
  - Twilio computed: `background-color: rgb(0, 13, 37)` = `--color-default` → Relay `ink-900` (#111827) is the nearest dark ink token
- Top border: `border-t border-ink-800` (#1F2937) — 1px divider between hero and trust strip
- No bottom border — platform-story begins flush

## Copy slots

| Slot | Role | Notes |
|---|---|---|
| `eyebrow` | Optional — "Trusted by teams at" type label | Copywriter fills; may be omitted |
| `logo[1–8]` | Placeholder wordmark images | 5–8 SVG/PNG wordmarks supplied by design asset pipeline |

## Typography

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| Eyebrow | `text-xs font-medium tracking-widest uppercase text-ink-400` | md: same | lg: same |
| No headline in this section | — | — | — |

- Eyebrow `text-ink-400` (#9CA3AF) on `bg-ink-900` (#111827): contrast ≈ 6.0:1 — passes WCAG AA (4.5:1) for small text
- Eyebrow font-size: `text-xs` = 0.75rem / 12px
  - Twilio reference: `.paragraph-small` / `.cmp-benefits-list__description` uses font-size: 14px / `--font-size-20: 1.4rem`; eyebrow label uses a smaller 12px convention on trust strips → `text-xs`

## Color

- Section background: `bg-ink-900` (#111827)
  - Twilio computed: `rgb(0, 13, 37)` = `--color-default` / `--color-ink`
- Eyebrow text: `text-ink-400` (#9CA3AF)
  - Twilio reference: `--color-gray-300: 154 160 180` = `rgb(154,160,180)` ≈ Relay `ink-400` (#9CA3AF)
- Logo mark treatment: `opacity-50 grayscale brightness-0 invert` (renders all logos white-on-dark)
  - Hover: `opacity-80 transition-opacity duration-300`
  - Twilio reference: `customer-stories-carousel__card-logo` images are full-color inside photo cards; for a standalone trust strip the standard treatment is monochrome/white on dark bg
- Top divider: `border-ink-800` (#1F2937)

## Spacing

| Element | Mobile | Tablet (md:) | Desktop (lg:) |
|---|---|---|---|
| Section vertical padding | `py-10` (40px) | `md:py-12` (48px) | `lg:py-16` (64px) |
| Eyebrow → logo row gap | `mb-6` (24px) | `md:mb-7` (28px) | `lg:mb-8` (32px) |
| Between logos (flex gap) | `gap-8` (32px) | `md:gap-10` (40px) | `lg:gap-12` (48px) |
| Logo row horizontal padding | inherited from wrapper `px-6` | `md:px-10` | `lg:px-20` |

- Twilio reference: `--spacing-size-8: 9.6rem` ≈ 96px is the large rhythm unit; section padding is 64px from computed data → `py-16`
- Gap between logos: Twilio `customer-stories-carousel__card-logo` sits within 560px cards with 0px card gap; for standalone logo strip, 48px gap (desktop) allows 6×130px = 780px + 5×48px = 240px = 1020px of logo content comfortably within 1280px inner width

## Components within this section

### Logo strip container

Desktop / tablet:
```
flex items-center justify-center flex-wrap gap-8 md:gap-10 lg:gap-12
```

Mobile — grid layout:
```
grid grid-cols-3 gap-6
```
(6 logos → 2 rows × 3 cols; 8 logos → ceil to grid-cols-3 produces 3 rows)

### Individual logo item

```
flex items-center justify-center
h-8 md:h-9 lg:h-10
w-auto max-w-[100px] md:max-w-[115px] lg:max-w-[130px]
opacity-50 grayscale brightness-0 invert
hover:opacity-80 transition-opacity duration-300
```

- Height: `h-8` = 32px mobile / `h-9` = 36px tablet / `h-10` = 40px desktop
  - Twilio reference: `customer-stories-carousel__card-logo` img = 160×48px in a 560px card; for a strip the standard treatment is shorter (32–40px height)
- Max-width: `max-w-[130px]` desktop (≈ Twilio logo 160px, slightly compressed for strip context)
- All logos `object-contain`

### Eyebrow text (optional)

```html
<p class="text-center text-xs font-medium tracking-widest uppercase text-ink-400 mb-6 lg:mb-8">
  [copy slot: eyebrow label]
</p>
```

## Motion

- Entrance: `whileInView` — entire strip fades up
  - `initial: { opacity: 0, y: 12 }`
  - `animate: { opacity: 1, y: 0 }`
  - `transition: { duration: 0.5, ease: 'easeOut' }`
  - Trigger: `once: true`, `amount: 0.3`
- Logo stagger: each logo item staggers with `delay: index * 0.04` (max ~0.28s for 7 logos)
- Scroll-linked: none — static reveal only
- Reduced-motion: `@media (prefers-reduced-motion: reduce)` → skip `y` translate, keep opacity fade; or `motion-safe:` Tailwind variant
- Hover: `hover:opacity-80 transition-opacity duration-base` (300ms) on each logo

## Accessibility

- Focus ring: `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900` — applies only if logos are wrapped in `<a>` links
- Hit targets: logo links must wrap to `min-w-[44px] min-h-[44px]`; at 32px height use padding to reach 44px min-height
- ARIA: section `role="region" aria-label="Trusted by"` (or localize the eyebrow string)
- Alt text: each wordmark `alt="[CompanyName] logo"` — Engineer fills with real names; placeholders use `alt="Placeholder partner logo"`
- Color contrast:
  - Eyebrow `text-ink-400` (#9CA3AF) on `bg-ink-900` (#111827): ~6.0:1 — passes AA (≥4.5:1)
  - Logo marks are decorative images — no contrast requirement when `alt=""` (but use alt text for branding recognition)

## Captured reference (for the Engineer's audit)

| Property | Twilio computed value | Relay mapping |
|---|---|---|
| Section background | `background-color: rgb(0, 13, 37)` (`.layout-container.bg-color-ink-100` at y=9609, desktop) | `bg-ink-900` (#111827) |
| Section padding top/bottom | `padding-top: 64px / padding-bottom: 64px` (desktop section container) | `lg:py-16` (64px) |
| Section inner max-width | 1200px (120px side padding on 1440px viewport) | `max-w-7xl mx-auto lg:px-20` → ~1120px inner |
| Logo image size | `customer-stories-carousel__card-logo`: 160×48px (in 560px card at y=10009–10429) | `h-10 max-w-[130px]` (lg) |
| Logo image position in card | `top: 10215px` (206px from card top=10009, within 246px overlay) | N/A — standalone strip |
| Trust section heading font | H2: `font-size: 40px / font-weight: 700 / line-height: 52px / color: rgb(255,255,255)` ("Different teams…" at y=9737 desktop) | Not in logo-wall; heading lives in adjacent section |
| Eyebrow/label color | `--color-gray-300: 154 160 180` = `rgb(154,160,180)` | `text-ink-400` (#9CA3AF) |
| Spacing unit | `--spacing-size-7: 6.4rem` (64px) | `py-16 / gap-12` |
| Top divider | No explicit divider on Twilio; hero→platform-story is flush | `border-t border-ink-800` added for Relay |
