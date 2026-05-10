# QR Verdict — Stats (3-number band)

**Verdict: CHANGES REQUESTED**

Branch: `feature/stats-3-number-band`
Built and served locally on `:3012` from this branch (dev preview at `:3011` still shows the placeholder, since the section has not been promoted to `dev` yet).

---

## Summary

- **Build:** `npm run build` — pass.
- **Visual fidelity:** matches `app/design/relay/stats-3-number-band-design.md` at desktop (1280), tablet (768) and mobile (390). All measured rules satisfied.
- **Accessibility:** **1 serious axe violation** (color-contrast on the detail copy) — blocks approval.
- **Performance (Lighthouse, mobile, simulated):** LCP 1.96 s, CLS 0, TBT 62 ms — pass.

---

## Visual fidelity (verified against design.md)

Computed styles captured at desktop / tablet / mobile (artifacts: `/tmp/qr-stats/styles_*.json`, `/tmp/qr-stats/stats_*.png`).

| design.md rule | Observed | Status |
|---|---|---|
| §1 Section padding `py-20 / md:py-24` | mobile 80px, tablet+desktop 96px | ✓ |
| §1 Section `border-b border-ink-100` | 1px rgb(243,244,246) | ✓ |
| §1 Inner `mx-auto max-w-6xl px-6 md:px-8` | grid centred, max ~1088px | ✓ |
| §1 Grid `grid-cols-1 md:grid-cols-3` | mobile 1 col, md+ 3 cols | ✓ |
| §1 Cell padding `px-8 py-10` | 40px 32px | ✓ |
| §1 Dividers `md:border-l border-ink-100` on cols 2,3 | mobile 0px, md+ 1px on cols 2,3 only | ✓ |
| §2 Number `display-lg / md:display-xl, bold, ink-900, tabular-nums` | 48→60px, weight 700, #111827, `tabular-nums` | ✓ |
| §2 Label `mt-3 text-sm font-semibold ink-600 uppercase tracking-[0.14em]` | 12px top, 14px, weight 600, #4B5563, uppercase, 1.96px | ✓ |
| §2 Detail `mt-2 text-[15px] ink-400 md:max-w-[30ch]` | 8px top, 15px, #9CA3AF, max-width 286px (md+ only) | ✓ |
| §3 Content (3 items, numbers/suffixes/labels/details) | matches `statsContent.items` exactly | ✓ |
| §4 Counter (framer-motion useMotionValue/useTransform/animate/useInView, sr-only fallback, reduced-motion path) | implemented per spec in `components/relay/Stats.tsx:16-57` | ✓ |
| §5 Section entrance (motion.div, opacity 0→1, y 24→0, dur 0.6, reduced-motion bypass) | implemented in `components/relay/Stats.tsx:65-71` | ✓ |

No visual blockers.

---

## Accessibility — BLOCKER

axe-core 4.11 scoped to `section[aria-label="Key statistics"]`, run at all three viewports. Identical violation at every viewport.

| viewport | rule | impact | nodes |
|---|---|---|---|
| desktop / tablet / mobile | `color-contrast` | **serious** | all three `.mt-2.text-[15px].md:max-w-[30ch]` detail paragraphs |

**Detail:** foreground `#9CA3AF` on background `#FFFFFF`, contrast ratio **2.53 : 1**, expected ≥ **4.5 : 1** for 15px / 400-weight (below the WCAG large-text 18px / 14px-bold thresholds).

**Source rule violated:** `app/design/stats-3-number-band-design.md` §2, row "Detail":
> `mt-2 text-[15px] text-ink-400 md:max-w-[30ch]` — 15px body

Engineer implemented the spec faithfully (`components/relay/Stats.tsx:85`). The spec itself is the source of the failure — `text-ink-400` (#9CA3AF) cannot meet WCAG AA at 15px / 400. Suggest the design spec swap detail to `text-ink-600` (#4B5563, ratio 7.59 : 1) or `text-ink-500` (whatever that resolves to in `tailwind.config.ts` — must be ≥ 4.5 : 1 on white). This is a spec-level fix, not just a component tweak — designer should re-issue the row, then engineer adjusts.

Per QR rules, `serious` axe violations block. Hence CHANGES REQUESTED.

No other axe violations at any viewport.

---

## Performance — pass

Lighthouse (mobile form-factor, simulated throttling, headless Chromium):

| metric | target | observed | status |
|---|---|---|---|
| LCP | < 2.5 s | **1.96 s** | ✓ |
| CLS | < 0.1 | **0** | ✓ |
| TBT (INP proxy) | (INP < 200 ms) | **62 ms** | ✓ |
| Performance score | — | 0.99 | — |

(INP cannot be measured in a lab run; TBT well under 200 ms is a strong indicator that field INP will hold under the target.)

---

## Blockers

```
- a11y · serious · color-contrast: section[aria-label="Key statistics"] >> .text-[15px].text-ink-400 detail copy — fg #9CA3AF on bg #FFFFFF = 2.53:1, needs ≥ 4.5:1 (axe color-contrast, serious). Root cause: design.md §2 specifies `text-ink-400` for the Detail row.
```

Recommendation: designer revises §2 Detail to a token meeting AA on white (e.g. `text-ink-600`); engineer updates `components/relay/Stats.tsx:85` to match.
