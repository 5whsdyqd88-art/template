# Quality Review — Footer

**Verdict:** CHANGES REQUESTED
**Branch:** `feature/footer`
**Commit reviewed:** `f56c20794d6fbe64489956b6e84ae63f2681da98`
**Spec:** `app/design/relay/footer-design.md`
**Component:** `components/relay/Footer.tsx`

## Gates

| Gate | Result |
|---|---|
| `npm run build` | PASS (route compiles, no type errors) |
| Visual fidelity (desktop 1440, tablet 768, mobile 390) | PASS with one note (see Observations) |
| Accessibility (axe-core, serious/critical only) | **FAIL — 1 serious violation** |
| Performance (LCP < 2.5s, CLS < 0.1, INP < 200ms) | PASS (LCP 432ms, CLS 0, click latency ~108ms) |

Screenshots captured at `/home/vlad/fleet/smoketest/screenshots/round2/footer_{desktop,tablet,mobile}_1778515838.png` against the isolated route `/qr-footer-isolation` (temporary; removed before commit) because a runtime error in a sibling page component (see Observation 2) renders the production page as 500. The isolation route was the only way to render Footer alone for QA.

## Blockers

### B1 — a11y / color-contrast (serious)

Bottom-bar CCPA notice and legal links use `text-ink-500` (#6B7280) on `bg-ink-900` (#111827). axe-core reports a contrast ratio of ~3.9:1, below the WCAG AA threshold of 4.5:1 for normal text.

Affected nodes (same across all three viewports):
- `<p class="... text-ink-500 leading-relaxed ...">` — CCPA notice (`Footer.tsx:170`)
- `<a class="text-xs text-ink-500 hover:text-white ...">` × 3 — bottom-bar legal links Privacy, Terms, Cookies (`Footer.tsx:177`)

**Design.md rule cited (line 192):**
> `text-ink-500` (#6B7280) on `bg-ink-900` → ~3.9:1 — CCPA notice is small text; engineer should use `text-ink-400` if WCAG AA is required for that copy.

The Quality Reviewer role gates on serious/critical axe findings, so WCAG AA is required. The design.md explicitly tells the engineer how to resolve it.

**Fix:** swap `text-ink-500` → `text-ink-400` for the CCPA paragraph (`Footer.tsx:170`) and the three bottom-bar legal links (`Footer.tsx:177`).

## Observations (not blockers)

1. **YouTube social-icon SVG path is malformed.** The `YouTube` entry in `socialPaths` (`Footer.tsx:13–14`) has control points outside the 0–24 viewBox (e.g. `C-.589 9.465-1.333 12.716-1.333 16.15` and `c0 3.434.744 6.686 1.745 9.411`), so the glyph renders as a stray wedge instead of the rounded-rectangle + play-triangle YouTube mark on all three viewports. No specific design.md rule fixes the visual form of social icons (line 196 only mandates aria-label, "if present"), so per the QR rule "stylistic preferences are not blockers" this is not a blocker — but it is a visible defect and worth fixing alongside B1.

2. **Production page returns 500 due to a runtime error in a sibling component, not Footer.** `npx next start` after a clean build throws `TypeError: g is not a function at sX (.next/server/app/page.js)` originating from a component rendered above Footer in `app/page.tsx`. The React tree slot that errors is `$La` (sibling to `$Lb`=Footer), which corresponds to `CTA` based on import order. The Footer's own render path is correct (verified via isolation route), `npm run build` passes, and the spec only requires Footer to be sound. Reporting here for visibility but treating it as out of scope for this QR — separate ticket / different stage.

3. **Moderate axe findings** (`landmark-one-main`, `page-has-heading-one`) are artifacts of the isolation test route (no `<main>`, no `<h1>`), not Footer issues. Excluded from blockers.

## Visual fidelity notes

Desktop (1440 × 900):
- 5-col grid (`200px 1fr 1fr 1fr 1fr`) with `gap-10` — matches design.md line 70.
- Column header style `text-[11px] font-semibold uppercase tracking-widest text-white` with `h-px bg-white/20 mt-3 mb-4` separator — matches design.md lines 30–31.
- "All X →" CTA uses `text-primary-400` — matches line 33.
- Top separator `border-t border-white/10` and bottom-bar `mt-12 pt-6 border-t border-white/10` — match lines 22, 85.

Tablet (768) and Mobile (390):
- Desktop grid hidden, accordion items render with `border-b border-white/10`, trigger has `min-h-[44px]` hit target, `Plus` icon rotates 45° on expand — matches design.md lines 89–94, 127–143, 170–171.
- Brand block (`mt-8 mb-6`) appears below the accordion section — matches line 92.
- Accordion trigger uses `text-sm font-medium text-white` (mixed case) — matches the line 37 spec (no uppercase requirement on the trigger label, unlike the desktop column header on line 30).

Color tokens, typography ramps, spacing rhythm, hover transitions, focus ring, and motion-reduce handling all match the spec. The structural and stylistic clone is faithful aside from B1 and Observation 1.
