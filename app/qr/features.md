# QR Verdict — Features (3-column product grid) · SAN-340

**Status:** APPROVED

Reviewed `components/relay/Features.tsx` against `app/design/relay/features-design.md` on `feature/features` (HEAD `97b783e`). Build, visual fidelity at desktop / tablet / mobile, axe-core a11y, and Core Web Vitals all pass.

Verified from a local `next start` on `127.0.0.1:3073` built from a clean `feature/features` worktree. The public dev preview at `:3011` currently 500s due to an unrelated runtime error in `components/relay/CTA.tsx` (missing `"use client"` directive — `useReducedMotion` invoked on the server). That is not a Features blocker; it is owned by the CTA feature. To exercise the page locally I temporarily removed `<CTA />` from `app/page.tsx` for measurement only — the change was not committed.

## Gates

| Gate | Result |
|---|---|
| `npm run build` | PASS — compiled successfully, 5/5 static pages generated |
| Visual fidelity vs `features-design.md` | PASS — every spec section matches at all three viewports |
| axe-core (scoped to `section[aria-labelledby="features-headline"]`) | PASS — 0 violations at desktop, tablet, mobile |
| Core Web Vitals (LCP / CLS / INP-proxy) | PASS — see table below |

## Visual mapping against `features-design.md`

| Spec ref | Spec rule | Implementation | Result |
|---|---|---|---|
| §1.1 | `<section aria-labelledby="features-headline">`, `border-b border-ink-100`, `py-20 lg:py-28` | `Features.tsx:49-52` | ✓ |
| §1.2 | `mx-auto max-w-6xl px-6 md:px-8` | `Features.tsx:53` | ✓ |
| §1.3 | Centered eyebrow + headline; eyebrow classes; headline `id="features-headline"` + `text-display-md text-balance text-ink-900` | `Features.tsx:54-64` | ✓ |
| §1.4 | `<ul role="list">` with `mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8` | `Features.tsx:66-73` | ✓ (1 col @ 390, 2 col @ 768, 3 col @ 1280 — confirmed visually) |
| §2 | `<li>` (or `<motion.li>`), `group flex flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-ink-100 transition-all duration-base hover:shadow-xl lg:p-8` | `Features.tsx:77-81` | ✓ |
| §2.1 | Icon container `flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50`, icon `h-6 w-6 text-primary-600 aria-hidden` | `Features.tsx:82-83` | ✓ |
| §2.2 | `mt-5 text-lg font-semibold text-ink-900` | `Features.tsx:85` | ✓ |
| §2.3 | `mt-2 flex-1 text-[15px] leading-relaxed text-ink-600` | `Features.tsx:88` | ✓ |
| §2.4 | `<a>` `mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700` + `ArrowRight h-4 w-4 transition-transform duration-base group-hover:translate-x-1` | `Features.tsx:91-100` | ✓ |
| §3.1 | `containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }` on `<motion.ul>` with `initial="hidden"`, `whileInView="show"`, `viewport={{ once: true, amount: 0.2 }}` | `Features.tsx:26-33, 66-73` | ✓ |
| §3.2 | `cardVariants = { hidden: {opacity:0, y:24}, show: {opacity:1, y:0, transition:{duration:0.5, ease:[0,0,0.2,1]}} }` | `Features.tsx:35-42` | ✓ |
| §3.3 | `useReducedMotion()` → swap `motion.li` for plain `li`; container `<motion.ul>` remains | `Features.tsx:45-46, 77-79` | ✓ |
| §4 | All copy from `app/content/relay/features.ts`; 6 items with `icon`/`title`/`body`; `learnMore` label; icons from lucide-react | `Features.tsx:13, 74-103` and `app/content/relay/features.ts` | ✓ |
| §5 | `aria-labelledby="features-headline"`, `<ul role="list">`, all icons `aria-hidden="true"` | `Features.tsx:50, 67, 83, 98` | ✓ |
| §6 | Changed files limited to `Features.tsx`, `features.ts`, two design docs | `git show --stat 97b783e` confirms scope | ✓ |

## A11y — axe-core scoped to `section[aria-labelledby="features-headline"]`

| Viewport | Violations | Critical | Serious |
|---|---|---|---|
| Desktop (1280) | 0 | 0 | 0 |
| Tablet (768) | 0 | 0 | 0 |
| Mobile (390) | 0 | 0 | 0 |

## Core Web Vitals (Lighthouse 12.8.2, headless Chromium 147)

| Metric | Target | Mobile (default preset) | Desktop preset | Result |
|---|---|---|---|---|
| LCP | < 2.5 s | 2.41 s | 0.52 s | ✓ |
| CLS | < 0.1 | 0.000 | 0.000 | ✓ |
| TBT (INP proxy) | < 200 ms | 0 ms | 0 ms | ✓ |
| FCP | — | 0.8 s | 0.2 s | informational |
| Performance score | — | 0.98 | 1.00 | informational |

## Evidence

- Screenshots: `/tmp/qr-features-out/{desktop,tablet,mobile}.png` (section-clipped) and `{desktop,tablet,mobile}-full.png` (full page)
- axe JSON: `/tmp/qr-features-out/axe.json`
- Lighthouse JSON: `/tmp/qr-features-out/lighthouse-{desktop,mobile}.json`
