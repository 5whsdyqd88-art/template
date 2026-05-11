# Quality Review — CodeMockup

**STATUS: CHANGES REQUESTED**

Branch: `feature/code-mockup` @ `c3e62df`
Commit under review: `c3e62df senior(code-mockup): direct implementation`
Reviewed against: `app/design/relay/code-mockup-design.md`
Captures: `/home/vlad/fleet/smoketest/screenshots/qr-code-mockup/*_1778500311.{png,html,json}`

## Gate summary

| Check | Result |
|-------|--------|
| `npm run build` | PASS (`✓ Compiled successfully`, route `/` 152 kB First Load JS) |
| Visual fidelity (desktop 1280) | FAIL — active tab text invisible, code lines overflow card |
| Visual fidelity (tablet 768) | FAIL — terminal card overflows viewport horizontally |
| Visual fidelity (mobile 390) | FAIL — terminal card and headline both overflow viewport |
| axe-core (WCAG 2.2 AA) | FAIL — 1 serious violation (color-contrast on inactive tabs) |
| Lighthouse / CWV | NOT RUN — `lhci` is not installed in this environment; deferred |

The build gate passes, but visual and a11y gates do not. Bouncing back to engineer + designer.

## Method

CodeMockup was rendered in isolation in a temporary git worktree (`/tmp/qr-cm-worktree-parent/cmwt`, branch `qr/code-mockup-review` off `feature/code-mockup` @ c3e62df) at `/qr-cm` on `next dev`. Isolation was required because the page-level route returns HTTP 500 due to an unrelated runtime error in `components/relay/CTA.tsx` (`useReducedMotion is not a function` — CTA is missing `"use client"`); that is out of scope for this review and will be the CTA agent's QR finding. CodeMockup itself renders cleanly in isolation.

Three viewports captured with Playwright + Chromium 1217: desktop 1280×900, tablet 768×1024, mobile 390×844. axe-core 4.10.2 was loaded into the page and run with `wcag2a/2aa, wcag21a/aa, wcag22aa` tags.

## Blockers (cited)

### B1 — Active tab text is invisible (a11y serious + visual)

The active tab "Node.js" renders `text-ink-900` (#111827) on the header bar `bg-ink-950` (#030712). Computed contrast ratio: **1.13 : 1** (WCAG AA requires 4.5 : 1 for normal text; 3 : 1 for non-text UI). Only the underline shows; the label is not legible.

- Captured node (`desktop_section_1778500311.html`):
  ```html
  <button role="tab" aria-selected="true" tabindex="0"
          class="relative px-4 py-3 text-sm font-medium transition-colors text-ink-900"
          style="opacity: 1;">
    Node.js
    <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" ...></span>
  </button>
  ```
- Reproduced visually at all three viewports (`{desktop,tablet,mobile}_codemockup_1778500311.png`).
- axe missed this specific node (likely confused by the underline-`<span>` child); the inactive siblings on the same dark header *are* flagged by axe — see B2 — and the same root cause applies here with worse contrast.

The two design.md rules in conflict are:

- `Header bar: ... bg-ink-950 px-6 py-4` (line 25)
- `Active tab text: \`text-ink-900\`` (line 29)

These cannot both hold — `text-ink-900` on `bg-ink-950` is black-on-near-black. Designer must update the spec (likely flip active to `text-ink-50` or similar) and engineer must update the component to match.

### B2 — Inactive tabs fail color contrast (a11y serious)

axe-core, rule `color-contrast`, impact `serious` (WCAG 2.2 AA, SC 1.4.3):

```
Element has insufficient color contrast of 2.44 (foreground #505765,
background #111827, font 14px normal). Expected 4.5:1.
Targets:
  - button[role=tab][aria-selected=false] (Python)
  - button[role=tab][aria-selected=false] (curl)
```

Two sources amplify the failure:

1. design.md line 29 chooses `text-ink-500` for inactive tabs. On the `bg-ink-950` header that already starts at ~2.77 : 1 — below AA before any modulation.
2. `components/relay/CodeMockup.tsx:56` adds `animate={isActive ? { opacity: 1 } : { opacity: 0.7 }}`, dropping the rendered foreground further to ~2.44 : 1. This `opacity: 0.7` is **not** specified in design.md and effectively double-discounts the inactive state.

Fix needs designer to re-pick the inactive token (e.g. `text-ink-300` / `text-ink-400`) AND engineer to drop the `opacity: 0.7` motion (or the designer to spec it explicitly with a contrast-safe combination).

### B3 — Terminal card overflows the viewport on tablet (768) and mobile (390) (visual + responsive)

Captured at `tablet_codemockup_1778500311.png` and `mobile_codemockup_1778500311.png`: the dark terminal card extends beyond the right edge of the viewport. The header bar's flex children (3 traffic-light dots, 3 tabs, copy button) plus the long single-line code samples push intrinsic content width above 390 px. The outer card has `overflow-hidden rounded-2xl bg-ink-900` (`components/relay/CodeMockup.tsx:181`), which clips visually but does not scroll, so the right side of the chrome and code is simply missing on small screens.

design.md violations:

- design.md describes only the `lg+` two-column layout and never specifies the mobile/tablet behaviour of the code panel header or the `<pre>` body. The repo-level standard is unambiguous (`CLAUDE.md` / Project Context: Relay → Responsive — non-negotiable):
  > "Every section MUST work at all three breakpoints. … Designer must spec all three."
- design.md line 42 says `Code panel: min-h-[320px] bg-ink-900 p-6` with no overflow handling, and line 41 says nothing about wrapping — the code samples in `app/content/relay/code-mockup.ts` contain lines well over 80 chars (`await relay.messages.create({ to: "+14155550182", from: "+14155550199", channel: "sms", body: "Your code is 482910" });`), so the single-line layout cannot survive 390 / 768 px without `overflow-x-auto` on `<pre>` or `whitespace-pre-wrap`.

Fix needs designer to add a mobile/tablet block to design.md covering: card width = container width (consider `min-w-0` on flex items in the header), `<pre>` overflow strategy (horizontal scroll vs. wrap), and possibly a smaller header with the copy label hidden below `sm` (already done) plus the tablist allowed to shrink. Engineer then implements.

### B4 — Headline overflows on mobile (visual + responsive)

`mobile_codemockup_1778500311.png` shows "Send your first me…" cut off at ~390 px because `text-4xl … sm:text-5xl` (36 px / 48 px, design.md line 16) plus the headline text "Send your first message in five lines." doesn't fit the column at 390 px without softer wrapping. The screenshot shows the H2 extending past the viewport on the right.

design.md gap: line 16 specifies the headline classes but no mobile-specific reduction or wrap behaviour. Same standards rule as B3 ("Designer must spec all three"). Fix: designer adds mobile spec (e.g. `text-3xl` base, or set `max-w-` on the column); engineer aligns.

## Non-blockers (informational)

- **CTA route 500 (out of scope).** `components/relay/CTA.tsx` is missing `"use client"` and calls `useReducedMotion`, throwing in RSC. This breaks `/` end-to-end on both `feature/code-mockup` and the auto-deployed `dev` preview (http://vlad:3011 returns 500 with digest `920859198`). Not a CodeMockup bug; the CTA agent's QR should catch it.
- **Reduced-motion `<pre>` mismatch.** `SyntaxHighlight` returns a plain `<pre>` (no token spans) when `prefers-reduced-motion: reduce` is set (`components/relay/CodeMockup.tsx:13`). design.md line 46 only says "no AnimatePresence transitions" under reduced motion; it doesn't say to disable syntax colouring. The current code disables both. Worth a one-line clarification in design.md, but not a blocker.
- **`useReducedMotion()` called for side effects.** Line 78 calls the hook and discards the result — harmless but dead code; mention to engineer for cleanup, not a blocker.
- **Lighthouse / CWV not measured.** `lhci` is not installed in this environment and `npx lighthouse` requires network installation. Treating the perf budget as deferred rather than as a pass; please re-run Lighthouse on the dev preview once B1–B4 are fixed and the page returns 200.

## What I checked that passed

- ARIA: `role=tablist` + 3 `role=tab` buttons with correct `aria-selected` and roving `tabIndex` (verified in `desktop_section_1778500311.html`); `role=tabpanel` present.
- Keyboard: ArrowLeft/Right/Home/End/Enter/Space implemented (`components/relay/CodeMockup.tsx:84-116`).
- Content sourcing: all strings imported from `@/app/content/relay/code-mockup` — no inline copy.
- Brand voice on rendered copy: short, no forbidden words, no exclamation marks, em dash used appropriately.
- Eyebrow / headline / body / docs link tokens (`text-primary-900` on `bg-primary-100` for eyebrow; `text-primary-600` for link) all match design.md and pass contrast.
- Copy button focus ring (`focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-ink-950`) matches design.md line 39.
- Build: `next build` produces a valid bundle; only the unrelated CTA error blocks the runtime.

## Re-review checklist

When the engineer/designer come back:

1. Active tab is visibly legible (≥ 4.5 : 1) on the dark header bar — design.md updated, component matches.
2. Inactive tabs reach ≥ 4.5 : 1 — design.md updated, component matches, the `opacity: 0.7` either removed or specified.
3. axe-core scan returns zero serious/critical violations on the rendered page.
4. Terminal card and code panel render fully inside the viewport at 390 px and 768 px (no horizontal overflow); design.md has explicit mobile + tablet specs for the code panel header and `<pre>` overflow.
5. Headline fits inside the column at 390 px with no clipping.
6. `next start` returns 200 on `/` (this likely needs the CTA fix to land first).
7. Lighthouse mobile run on dev preview shows LCP < 2.5 s, CLS < 0.1, INP < 200 ms.
