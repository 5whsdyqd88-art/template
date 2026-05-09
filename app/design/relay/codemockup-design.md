# CodeMockup (terminal-style with tabs) — Design spec

Issue: SAN-14
Architect: `app/design/relay/codemockup-architect.md`
Component path: `components/relay/CodeMockup.tsx`
Reference: `/home/vlad/fleet/smoketest/refs/twilio/scroll_10.png` (layout intent only — dark code surface, language tabs above panel, line-numbered code body)

---

## 1. Layout

### Section frame (full-bleed)

- Background: `bg-ink-50` (matches the page's light cadence between dark hero and dark CTA neighbors).
- Vertical padding: `py-20 lg:py-28` (matches Hero / Features / LogoWall rhythm — confirms architect Q1).
- Horizontal padding: `px-6 lg:px-8` on the inner container.
- No border, no divider. Section transitions handled by neighbor sections.

### Container

- `max-w-7xl mx-auto` (1280px — confirms architect Q2).
- Single inner element; no nested wrappers.

### Grid

- Mobile (`<lg`): single column, copy stacks above the code card.
  - Vertical gap between copy and card: `gap-y-10`.
- Desktop (`lg+`): two columns `grid-cols-1 lg:grid-cols-12`.
  - Copy column spans `lg:col-span-5`.
  - Code card spans `lg:col-span-7`.
  - Column gap: `lg:gap-x-12 xl:gap-x-16` (confirms architect Q3 — `gap-12` at `lg`, widening to `gap-16` at `xl`).
- Vertical alignment: `items-center` on the grid so the copy block centers against the taller code card on `lg+`.
- Cap on `2xl`: container itself caps at `max-w-7xl`; do not introduce a separate `2xl` cap on the card (confirms architect Q4 — card grows with the column, not freestanding).

### Copy column

- Stack: vertical, `gap-y-5`.
- Order:
  1. Eyebrow
  2. Headline
  3. Body
  4. Docs link (with `gap-y-7` above it — slightly more breathing room before the link)
- Maximum text width inside the column: `max-w-md` (≈ 28rem) so the body sets at a comfortable measure even when the column is wide.

### Code card

- Shape: `rounded-2xl overflow-hidden`.
- Shadow: `shadow-card`.
- Border: `border border-ink-900/5` (a near-invisible 1px line that keeps the card's edge readable on light backgrounds at high zoom).
- Internal structure:
  - Header (chrome row): fixed height `h-11` (44px).
  - Body (code panel): `min-h-[280px]` on `<lg`, `min-h-[320px]` on `lg+` (confirms architect Q4 / D8 — fixed min-height, slightly taller on desktop where the column is wider).

---

## 2. Type

All sizes are token names from `tailwind.config.ts`. Do not hard-code px values for type.

| Element | Size token | Weight | Line-height | Tracking | Color |
|---|---|---|---|---|---|
| Eyebrow | `text-xs` (`0.75rem`) | `font-semibold` | `leading-none` | `tracking-[0.18em] uppercase` | `text-primary-500` |
| Headline | `text-display-md` (`2.25rem`, defined in tokens with `lh:1.15` `tracking:-0.01em` `weight:600`) | (token-defined) | (token-defined) | (token-defined) | `text-ink-900` |
| Body | `text-lg` (`1.125rem`) | `font-normal` | `leading-7` (1.75rem) | (default) | `text-ink-600` |
| Docs link | `text-base` (`1rem`) | `font-medium` | `leading-6` | (default) | `text-primary-600` (resting) → `text-primary-700` (hover) |
| Tab label | `text-sm` (`0.875rem`) | `font-medium` | `leading-none` | (default) | `text-ink-400` (inactive) / `text-primary-300` (active) |
| Code (all languages) | `text-[13px]` | `font-normal` | `leading-6` (1.5rem) | (default) | see §3 (Color) |
| Copy button label ("Copied" affordance) | `text-xs` | `font-medium` | `leading-none` | (default) | `text-ink-300` |

Notes:

- Headline uses the `display-md` token directly. Engineer must apply `font-feature-settings: "ss01" 1` only if it's already in `globals.css`; otherwise leave defaults — do not add CSS for this section alone.
- Code uses `font-mono` (JetBrains Mono per tokens). `text-[13px]` is intentionally one step below `text-sm` so a 10-line sample fits the `min-h-[320px]` panel without scroll.
- Confirms architect Q9 — `text-[13px]` with `leading-6`.
- Confirms architect Q6 — tab label size: `text-sm`.

---

## 3. Color

### Section surfaces

| Surface | Token | Notes |
|---|---|---|
| Section background | `bg-ink-50` | Light, matches LogoWall / Stats neighbors. |
| Card background (chrome row + code body) | `bg-ink-900` | Confirms architect Q5 — solid `ink-900`, no gradient. A gradient distracts from the type and the dot/tab chrome; solid reads "terminal" most clearly. |
| Card chrome inner divider | `border-b border-ink-800` | 1px hairline below the chrome row, separating chrome from code body. |

### Code surface (inside `<CodePanel>`)

Three approved colors only — confirms architect D6 / Q7-related (color allocation):

| Token role | Tailwind class | Used for |
|---|---|---|
| Accent | `text-primary-300` | Keywords (e.g. `import`, `from`, `const`, `await`, `def`, `await`), literal strings (`"..."`, `'...'`), and HTTP method `POST` in the curl sample. |
| Primary text | `text-ink-200` | Identifiers, function names, variable names, numeric literals. |
| Mute | `text-ink-400` | Punctuation (`{ } [ ] ( ) , ; .`), operators (`=`, `=>`, `->`), comments if any (Copywriter currently advises none — D6/Q6 from architect), curl line continuations (`\`), and the `$` env-var sigil. |

No fourth color. No background highlights on lines. No selection or caret styling beyond browser default.

### Active vs. inactive tab

- Inactive tab text: `text-ink-400`.
- Active tab text: `text-primary-300` (confirms architect Q7 — `primary-300` for legibility on `ink-900`, with `primary-500` reserved for the underline only).
- Inactive tab on hover: `text-ink-300` (one step lighter; subtle).
- Active tab background: none (text color + underline carry the active state).

### Underline

- Color: `bg-primary-500`.
- Height: `h-0.5` (2px).
- Width: matches the tab label width plus 0 horizontal padding (i.e. underline is exactly under the label, not the full tab cell).
- Position: absolute, sits at the bottom of the chrome row (1px above the inner divider so it visually "owns" the boundary).

### Docs link

- Resting: `text-primary-600`, no underline.
- Hover: `text-primary-700`, no underline (the `ArrowRight` translate is the affordance).
- Visited: same as resting (no separate visited state — this is an internal docs link).

### Copy button

- Resting icon: `text-ink-400`.
- Hover icon: `text-ink-200`.
- Active / pressed: `text-primary-300`.
- "Copied" label color: `text-ink-300` (so it doesn't compete with active code text).

### Traffic-light dots (decorative chrome)

- Red: `#FF5F57` (literal hex — not a token, this is brand-recognizable terminal chrome only).
- Yellow: `#FEBC2E`.
- Green: `#28C840`.
- Diameter: `h-3 w-3` (12px). Confirms architect Q6 — slightly larger than 8px so they read at typical card scale; 12px matches macOS reference widely.
- All three: `aria-hidden="true"`. Confirms architect D9.

### Contrast ratios (verify before merge)

| Pair | Required | Notes |
|---|---|---|
| `ink-900` headline on `ink-50` section bg | ≥ 7:1 (AAA body / AAA large) | trivially clears. |
| `ink-600` body on `ink-50` | ≥ 4.5:1 (AA body) | `#4B5563` on `#F9FAFB` ≈ 8.6:1 — clears. |
| `primary-600` docs link on `ink-50` | ≥ 4.5:1 (AA body) | `#4A58E0` on `#F9FAFB` ≈ 7.0:1 — clears. |
| `primary-300` active tab on `ink-900` card | ≥ 4.5:1 (AA body) | `#A9B3FF` on `#111827` ≈ 9.5:1 — clears. |
| `ink-400` inactive tab on `ink-900` | ≥ 3:1 (AA non-text + large) | `#9CA3AF` on `#111827` ≈ 5.5:1 — clears. |
| `ink-200` code body on `ink-900` | ≥ 4.5:1 (AA body) | `#E5E7EB` on `#111827` ≈ 13.5:1 — clears. |
| `ink-400` mute punctuation on `ink-900` | ≥ 3:1 | passes per above. |
| `primary-300` keywords on `ink-900` | ≥ 4.5:1 | passes per above. |

If any of these regress because Engineer substitutes a token, halt and re-derive — do not silently downgrade contrast.

---

## 4. Spacing rhythm

### Section

- `py-20 lg:py-28` (top + bottom).
- `px-6 lg:px-8` (inner container horizontal).

### Copy column

- Internal gaps: `space-y-5` (eyebrow → headline → body → link), with a slight extra `mt-2` between the body and the docs link (so the link feels like an action, not a sibling sentence).
- Eyebrow → headline: 1.25rem (`gap-y-5` default).
- Body max measure: `max-w-md` (29rem).

### Code card

- Chrome row internal padding: `px-4` (16px L/R).
- Chrome row: dot row sits left, tab strip sits centered horizontally inside the row, copy button sits right (confirms architect Q10 — copy button in the chrome row, far right).
- Code panel padding: `px-5 py-4` (20px L/R, 16px T/B). Slightly larger than chrome to give code room to breathe.
- Code body line-height already covers vertical rhythm inside the panel.
- Card → next section: belongs to the next section; this section ends with `py-20 lg:py-28`.

### Tab strip

- Horizontal: tabs are flexed, gap `gap-x-6` between tab labels (24px). Confirms architect Q6.
- Vertical: each tab cell is `py-3` so the active underline has a visible margin against the chrome row's bottom edge.

---

## 5. Motion

All scroll-linked behaviors below are **viewport-once** entrances, not scrub. framer-motion alone (no GSAP / ScrollTrigger). Confirms architect D11.

### Entrance

- Trigger: `whileInView`, `viewport={{ once: true, amount: 0.3 }}`.
- Variants:
  - Hidden: `{ opacity: 0, y: 16 }`.
  - Visible: `{ opacity: 1, y: 0 }`.
- Transition: `{ duration: 0.5, ease: [0, 0, 0.2, 1] }` — matches the `ease-out-soft` token's cubic curve.
- Stagger: copy column appears at delay `0`; code card appears at delay `0.1` (so the eye lands left first). Confirms architect Q13.

### Active-tab underline

- Implementation: `motion.span` with `layoutId="codeTabUnderline"`. Confirms architect D3.
- Transition: `{ duration: 0.25, ease: [0, 0, 0.2, 1] }` — matches `transition-base ease-out-soft` (300ms is the token, but 250ms feels tighter for a tab indicator; designer call). Confirms architect Q12.
- The underline is rendered exactly once per active tab; framer-motion's `layoutId` handles the slide.

### Tab text color crossfade

- On click, inactive → active text color transitions via Tailwind's default `transition-colors duration-150 ease-out` (fast: 150ms). Confirms feels in sync with the underline slide.

### Code panel swap

- No exit/enter animation between code samples — the underline carries the motion; animating the code body adds noise and risks layout flash.
- Engineer simply renders the active sample inside the persistent `<CodePanel role="tabpanel">`.

### Docs link arrow nudge

- On hover (and `focus-visible`): `ArrowRight` icon translates `+3px` on the X axis.
- Transition: `transition-transform duration-base ease-out-soft` (300ms).
- The arrow is a child of the link — the link text itself does not move.

### Copy button

- On click: icon swaps from `Copy` to `Check` (lucide) for 1.5s, then reverts.
- Microcopy "Copied" label fades in next to the icon over 150ms (`opacity-0 → opacity-100`), holds 1.2s, fades out 150ms.
- Confirms architect Q11 — chosen treatment is "icon morph (Copy → Check) + short label swap." Both elements coexist briefly.

### Traffic-light dots

- Static. No hover, no animation.

### Reduced-motion fallback

When `useReducedMotion()` returns `true` (confirms architect Q15):

- Entrance: render visible state immediately. No fade, no slide.
- Underline: render directly under the active tab with no transition.
- Tab text color change: still present (color is informational, not motion).
- Docs-link arrow nudge: removed entirely (no transform on hover).
- Copy button icon swap: still present (function over form), but the "Copied" label fades become instant changes (`opacity-0 → opacity-100` with no transition).

---

## 6. Accessibility

### Tabs (WAI-ARIA — confirms architect D4)

- `<div role="tablist" aria-label="Code sample language">` wraps the three tabs.
- Each tab: `<button role="tab" id="tab-{lang}" aria-selected={active} aria-controls="codepanel-{lang}" tabindex={active ? 0 : -1}>`.
- Code panel: `<div role="tabpanel" id="codepanel-{active}" aria-labelledby="tab-{active}" tabindex={0}>`.
- Keyboard: ArrowLeft / ArrowRight cycle the active tab and move focus (automatic-activation pattern). Home jumps to first tab; End to last. Enter / Space activate the focused tab (no-op when already active).
- Tab order: docs link → tablist (first focused tab) → tabpanel → copy button.

### Focus rings

- All interactive elements use `focus-visible` only (not `focus`) so the ring shows for keyboard but not for mouse.
- Token: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2`.
- Ring offset background depends on the surface:
  - Docs link (on `ink-50`): `focus-visible:ring-offset-ink-50`.
  - Tabs and copy button (on `ink-900`): `focus-visible:ring-offset-ink-900`.
- Confirms architect Q14.

### ARIA labels

- Eyebrow: not interactive; no aria.
- Headline: `<h2>` element (this is a section-level heading; the section as a whole is below the page-level `<h1>` Hero).
- Docs link: visible text "Read the docs" + `ArrowRight` icon. The icon is `aria-hidden="true"`; the link text alone is the accessible name. No additional `aria-label` needed.
- Copy button: `aria-label="Copy code sample"` (Copywriter confirms exact string). When in "Copied" state, button toggles `aria-label="Copied"` for screen-reader announcement; consider also `aria-live="polite"` on a sibling visually-hidden span that contains the success microcopy if Copywriter wants finer control.
- Traffic-light dots: each `<span aria-hidden="true">`. The dot row's parent has no role. Confirms architect D9.
- Tab labels (`Node`, `Python`, `Curl` — Copywriter to confirm casing) are visible text inside the tab; no extra `aria-label` needed.
- Tab icon (none in this design): if Copywriter or Engineer adds a leading language glyph later, it must be `aria-hidden="true"`.

### Keyboard nav order (top-to-bottom, left-to-right)

1. Docs link ("Read the docs →")
2. Tablist (first focused tab — initially `Node`; subsequently the most recently activated tab via roving `tabindex`)
3. Tabpanel (focusable so screen reader users can navigate the code text)
4. Copy button

### Live regions

- Single live region for "Copied" affordance: visually-hidden `<span aria-live="polite" aria-atomic="true">` inside the chrome row. Updates from empty → "Copied" → empty. This is how SR users learn the click took effect.

### Allowed icons (verified against `lucide-react` v1.x)

- `Copy` ✓ (confirmed in issue)
- `Check` ✓ (used for "Copied" state — verified exported in lucide-react v1.x)
- `ArrowRight` ✓ (used for the docs link nudge — verified exported)

No other lucide icons are used in this section. No social icons. No `Github`/`Twitter`/`Linkedin` (per Project Context, those are not exported in v1.x — n/a here regardless).

---

## 7. Component-level details

### Tab strip placement (confirms architect open question)

- The chrome row has three slots:
  - Left: dot row (`flex gap-2`, the three colored dots).
  - Center: tablist (centered absolutely or via `flex-1` + `justify-center`).
  - Right: copy button (32px square hit target).
- The tablist visually sits in the center of the row. The dots and copy button balance it.
- On `<sm` (≤ 640px) the chrome row remains the same — the card still fits the 3 tabs at 13px label size. If Engineer finds it cramped on `iPhone SE` (320px), reduce the dot diameter to `h-2.5 w-2.5` and the tab gap to `gap-x-4`. Otherwise hold the desktop spacing.

### Active-tab underline geometry

- Sits flush at the bottom of the chrome row, exactly aligned with the inner divider.
- Width: matches the tab label's text width (not the cell's full width — this reads more like the reference's tab marker).
- The shared `layoutId="codeTabUnderline"` element is positioned via `absolute -bottom-px left-0 right-0` *under each tab label*, then framer-motion's `layoutId` handles cross-fading position when the active tab changes.

### Code panel — line numbers

- The reference shows line numbers; **omit** them in this design. Reasoning: with three different languages and only 8–11 lines each, line numbers add visual noise without earning their keep, and the architect's spec doesn't request them. Designer's call. Engineer: do NOT add line numbers.

### Code panel — long-line behavior

- Set `whitespace-pre overflow-x-auto` on the inner code element so long curl lines wrap horizontally with a scrollbar rather than wrapping mid-line.
- Hide the horizontal scrollbar visually when content fits (browser default); when it overflows, the scrollbar is allowed to render — do not custom-style it for this section.

### Copy button — geometry

- Hit target: `h-8 w-8` (32px) so tap target meets WCAG 2.5.5 AAA on touch.
- Icon size: `h-4 w-4`.
- "Copied" label: appears to the **left** of the icon during the 1.5s window, with `gap-x-1.5` between label and icon. The button itself widens to accommodate it; the chrome row's right slot reserves enough space (`min-w-[88px]`) so this widening doesn't shove the tablist on activation.

### Docs link — anchor target

- For now the link points to a placeholder `#docs` hash. Engineer: leave as `<a href="#docs">` until Project Context adds a real docs URL. Do not invent a URL.

---

## 8. Responsive behavior

| Breakpoint | Behavior |
|---|---|
| `<lg` (≤ 1023px) | Single column; copy stacks above the card. Card spans full container width. Card `min-h-[280px]`. Section padding `py-20`. |
| `lg` (1024–1279px) | Two columns 5 / 7. Copy left, card right. Card `min-h-[320px]`. Column gap `gap-x-12`. Section padding `py-28`. |
| `xl` (1280–1535px) | Same as `lg` but column gap widens to `gap-x-16`. |
| `2xl` (≥ 1536px) | Container caps at `max-w-7xl`; section content does not grow further. |

No layout shift between breakpoints other than the column count. Copy column max-text-width keeps the eye comfortable at every size.

---

## 9. What is NOT in scope (Designer reaffirms)

- Persistence of tab choice across reloads (confirms architect D5: ephemeral).
- Syntax-highlighting library (confirms architect D6: hand-painted spans).
- Server-rendered tabs (confirms architect D1: client component).
- Line numbers in the code panel (Designer's call — omit).
- Language icons / glyphs in the tab labels (Designer's call — text only).
- Code-panel resize on tab change (confirms architect D8: fixed min-height).
- Hover-tilt or 3D card lift (out of section character — keep static).

---

## 10. Hand-off notes for Copywriter & Engineer

### Copywriter

- Eyebrow target: ≤ 12 chars, all-caps. "DEVELOPERS" works visually.
- Headline target: ≤ 12 words (per voice rules), exactly the visual weight Designer expects in `display-md`.
- Body target: ≤ 24 words, ≤ 2 sentences.
- Docs link microcopy: 2–4 words.
- Copy button `aria-label`: short, descriptive (e.g. "Copy code sample"). The visible "Copied" microcopy should be one word — "Copied" — no exclamation per voice rules.
- Tab label casing: Designer leaves to Copywriter (architect Q5). Visual sizing accommodates `Node.js`, `Python`, `cURL` if Copywriter prefers technical-correct casing; if labels go longer than ~7 chars apiece, hold to a `gap-x-6` minimum and reduce to `gap-x-4` only as a last resort.
- API field naming: Designer is colorblind to the names — `to`, `from`, `channel`, `body` is fine visually. Confirm with Engineer that the longest payload row still fits the panel width without breaking the 13px line.

### Engineer

- All visual choices above translate directly to Tailwind utility classes; no custom CSS expected for this section.
- Use `<h2>` for the headline (section-level heading; H1 is in Hero).
- Use semantic `<a>` for the docs link, `<button type="button">` for tabs and the copy button.
- `useReducedMotion()` from framer-motion gates entrance, underline, and arrow nudge per §5.
- Engineer must verify the three contrast pairs in §3 against the actual rendered tokens after build. If any token shifts, halt and report.

---

## Summary — answers to the architect's 15 designer-facing open questions

| # | Question | Designer answer |
|---|---|---|
| Q1 | Section vertical padding | `py-20 lg:py-28`. |
| Q2 | Container max-width | `max-w-7xl`. |
| Q3 | Grid gap | `lg:gap-x-12 xl:gap-x-16`. |
| Q4 | Code-card aspect | `min-h-[280px]` (`<lg`) / `min-h-[320px]` (`lg+`); no `2xl` cap on the card. |
| Q5 | Card background | Solid `bg-ink-900`, no gradient. |
| Q6 | Card chrome height & spacing | Chrome row `h-11`; dots `h-3 w-3`, gap `gap-2`; tab cells `py-3`, label `text-sm`. |
| Q7 | Active-tab visual | Active label `text-primary-300`; underline `bg-primary-500 h-0.5`, label-width only. |
| Q8 | Inactive tab color | `text-ink-400` (resting) / `text-ink-300` (hover). |
| Q9 | Code typography | `font-mono text-[13px] leading-6`. |
| Q10 | Copy-button placement | Right slot of chrome row. |
| Q11 | "Copied" affordance | Icon morph (`Copy` → `Check`) + adjacent "Copied" label, 1.5s. |
| Q12 | Underline transition | `duration: 0.25, ease: [0, 0, 0.2, 1]`. |
| Q13 | Entrance | `duration: 0.5, ease: [0, 0, 0.2, 1]`, `viewport: { once: true, amount: 0.3 }`, right-column delay `0.1`. |
| Q14 | Focus ring | `focus-visible:ring-2 ring-primary-400 ring-offset-2`; offset color matches surface (`ink-50` or `ink-900`). |
| Q15 | Reduced-motion fallback | No entrance, no underline slide, no arrow nudge; tab color change and copy-button icon swap remain (informational, not motion). |
