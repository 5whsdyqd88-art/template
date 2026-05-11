# QR — Footer

**Verdict: CHANGES REQUESTED**

Branch: `v2-feature/footer`
Inputs: `app/design/relay/footer-design.md`, `components/relay/Footer.tsx`
Build: `npm run build` ✓ passes

## Method

- Built with `next build`, served via `next start -p 3091`.
- Playwright at 1440×900 (desktop), 768×1024 (tablet), 390×844 (mobile). Screenshots saved to `app/qr/screenshots/footer-{desktop,tablet,mobile}.png`.
- `@axe-core/playwright` scoped to `footer[role="contentinfo"]`, tags `wcag2a wcag2aa wcag21a wcag21aa`.
- Lighthouse CLI (mobile, simulated throttling) against `/`.

No `refs/twilio/<refname>.png` images exist in the repo, so visual diff is against the computed-style and layout rules listed in `footer-design.md`.

## Blockers

### Visual

1. **All viewports — brand logo: broken image.** `components/relay/Footer.tsx:8` renders `<Image src="/logo.svg" />`, but `/logo.svg` returns 404 (no `public/` directory in the worktree). The browser shows the placeholder broken-image icon in column 1 (desktop) and at top of stack (tablet/mobile). Violates `footer-design.md` §"Components within this section / Brand mark / wordmark": *"Treatment: white wordmark SVG or `<img>` alt='Relay'"*.

2. **Tablet & mobile — brand section appears ABOVE the accordion stack.** Design rule (§"Brand mark / wordmark"): *"Column 1, desktop; **below accordions, tablet/mobile**"*. In `Footer.tsx`, the brand `<div>` (lines 89–138) is rendered before the accordion list (lines 163–170) in the flex column, with no responsive reorder. Mobile/tablet screenshots show Careers/Organization/Press/… stacked at the top, followed by the four accordion items underneath.

3. **All viewports — brand misc links have no vertical gap.** Design rule (§"Mobile/tablet accordion / Misc links"): *"`space-y-3`"*. The `<ul aria-label="Brand links">` at `Footer.tsx:91` has no spacing utility, so Careers/Organization/Press/Investors/Legal/Privacy/Security/Sitemap/LLMs are rendered with line-height-only spacing instead of the 12px gap.

### Accessibility

4. **Color-contrast — serious (axe-core).** Target `.leading-relaxed` (the CCPA notice `<p>` at `Footer.tsx:180`): `text-ink-500` (#6B7280) on `bg-ink-900` (#111827) ≈ 3.9:1, fails WCAG 2.1 AA for small text (≥4.5:1). `footer-design.md` §"Accessibility / Color contrast" already flags this: *"CCPA notice is small text; engineer should use `text-ink-400` if WCAG AA is required for that copy"*. Recommended fix: switch `Footer.tsx:180` from `text-ink-500` to `text-ink-400`.

### Performance

5. **LCP 2558ms > 2500ms target.** Mobile Lighthouse run (simulated throttling): performance score 0.97, FCP 758ms, CLS 0, TBT 14ms, **LCP 2558ms**. Marginal — the broken `<Image>` element (404 logo, eagerly fetched) is on the candidate path and the placeholder fallback may be contributing; expect this to drop below 2.5s once Blocker 1 is fixed and the logo asset resolves.

## Non-blockers / passing

- Footer background `rgb(17, 24, 39)` = `#111827` = `ink-900` ✓
- Four nav columns render on desktop with correct headings ("Considering Relay", "Products and features", "Use cases", "Developers") and "All products/features/use cases/resources →" CTAs in `text-primary-400`.
- Four accordion items render on tablet/mobile with plus icons, `aria-expanded`, `aria-controls`, panel `role="region"` + `aria-labelledby` — matches §Accessibility ARIA rules.
- `<footer role="contentinfo">` landmark present.
- `<nav aria-label="…">` per column on desktop.
- Focus-visible ring classes present on every interactive element.
- CLS 0, TBT 14ms — INP proxy well under 200ms target.
- axe-core: 0 other violations beyond the contrast one above.
