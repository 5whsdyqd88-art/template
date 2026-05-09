# CodeMockup (terminal-style with tabs) — Architect spec

Issue: SAN-14
Component path: `components/relay/CodeMockup.tsx` (matches existing per-section repo convention; the skill text says `app/components/relay/` but `app/page.tsx` imports from `components/relay/` — see `tsconfig.json` `paths`).
Imported by: `app/page.tsx` (already wired as a placeholder section).

## Purpose

Convince a senior engineer in five seconds that integrating Relay is a five-line drop-in. A two-column section pairs a short developer-voiced pitch on the left with a credible, syntax-highlighted code sample on the right, switchable between Node / Python / Curl so any visiting engineer sees their stack at a glance.

## Composition

One file, one default export, one client component (`"use client"` is required: `useState` for the active tab, `useReducedMotion` from framer-motion, and refs for the tab list).

Inline subcomponents live inside the same file — none of them are reused elsewhere and splitting buys nothing. The three code samples are an inline `const TABS = [...] as const` array at the top of the file.

Tree:

```
<CodeMockup>          (section, full-bleed background, vertical padding)
  └── <Container>     (max-w + horizontal padding)
        └── <Grid>    (1 col mobile, 2 col lg)
              ├── <CopyColumn>          (left)
              │     ├── <Eyebrow>       ("DEVELOPERS")
              │     ├── <Headline>      (display-md)
              │     ├── <Body>          (1.125rem ink-600)
              │     └── <DocsLink>      ("Read the docs →" with ArrowRight nudge)
              └── <CodeCard>            (right)
                    ├── <CardChrome>    (3 traffic-light dots, tab strip, copy button)
                    │     ├── <DotRow>
                    │     ├── <TabList role="tablist">
                    │     │     └── 3× <Tab role="tab">
                    │     └── <CopyButton>  (lucide Copy icon)
                    └── <CodePanel role="tabpanel">  (font-mono, syntax-highlighted)
```

Copy strings (eyebrow, headline, body, docs-link microcopy, copy-button aria-label, tab labels) come from `app/content/relay/code-mockup.ts` exporting `codeMockupContent`. The three code samples themselves are content-shaped data and live in the same content module under a `samples` key — they are real-looking source that engineers will read, not chrome strings.

## State / data dependencies

- `activeTab: "node" | "python" | "curl"` — `useState`, default `"node"`.
- Static `TABS` data array imported from `code-mockup.ts`.
- No fetching, no context, no localStorage. Tab choice does **not** persist across reloads (D5 below).

## Interactions

- **Tab click** — sets `activeTab`. The visible code panel swaps to the matching sample. The active-tab underline animates between positions (D3).
- **Tab keyboard nav** — left/right arrow keys move focus and selection between tabs; Home / End jump to first / last; Enter / Space activate (matches WAI-ARIA Authoring Practices "tabs with automatic activation").
- **Copy button** — copies the current sample's raw text via `navigator.clipboard.writeText`; shows a transient "Copied" affordance via `useState` for ~1.5s. (Optional but expected on a developer-voiced section; D7.)
- **Docs link hover** — `ArrowRight` translates +2–4px on the x-axis; reuses `transition-base ease-out-soft`.
- **Entrance** — once-only `whileInView` fade + 16px slide-up for the two columns, right column delayed ~0.1s so the eye lands left first. Honor `useReducedMotion()` → both columns appear with no transform/opacity animation when reduced motion is requested.
- **No scroll-linked motion.** This section is not pinned, scrubbed, or parallaxed. framer-motion alone is sufficient; GSAP/ScrollTrigger is unnecessary.

## Decisions

### D1. Server vs. client component

- **Option A — server component, no JS.** Render only the active tab; force a query-param round-trip to switch.
  - Pro: zero JS, fastest paint.
  - Con: tabs that page-reload are a worse developer-page experience than a hero with no JS at all; engineers expect tabs to be instant.
- **Option B — client component with `useState`.** *(Recommended)*
  - Pro: instant tab switch; matches the issue's "without page reload" acceptance criterion verbatim.
  - Con: a few KB of JS for one section.

**Recommendation: B.** The issue's acceptance criteria mandate it.

### D2. Single file with inline parts vs. split files

- **Option A — one `CodeMockup.tsx` file with inline `Tab`, `CopyButton`, `CodePanel` blocks.** *(Recommended)*
  - Pro: matches existing per-section repo convention; one default export per section file.
  - Con: file is somewhat dense (~200 lines) once the three code samples are inline.
- **Option B — `components/relay/code-mockup/{CodeMockup,Tab,CodePanel}.tsx`.**
  - Pro: smaller files.
  - Con: speculative reuse; no other section currently shares any of these parts.

**Recommendation: A.** Lift later if and when a second consumer appears.

### D3. Active-tab indicator: layout-id underline vs. CSS-only border

- **Option A — `motion.span` with `layoutId="codeTabUnderline"`.** *(Recommended)*
  - Pro: framer-motion automatically slides the underline between tabs; matches the reference site's tab feel.
  - Con: requires `LayoutGroup` semantics implicit on shared `layoutId`; a small motion cost.
- **Option B — CSS `border-b-2` on the active tab.**
  - Pro: zero JS for the indicator; static.
  - Con: indicator jumps; reads cheaper, less premium.
- **Option C — animated CSS transform on a single absolutely-positioned underline.**
  - Pro: cheapest motion that still slides.
  - Con: needs ref-measurement + RAF reflow to compute target x/width; layoutId does this for free.

**Recommendation: A**, gated by `useReducedMotion()`. When reduced motion is requested, skip the layout animation and render the underline directly under the active tab (no transition).

### D4. Tab semantics: ARIA tabs vs. plain buttons

- **Option A — full WAI-ARIA tabs pattern: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, `tabindex` management, arrow-key navigation.** *(Recommended)*
  - Pro: correct semantics; accessible to screen readers and keyboard-only users.
  - Con: a few extra attributes and a key-handler.
- **Option B — three `<button>`s that toggle a state, no ARIA wiring.**
  - Pro: simpler.
  - Con: SR users will hear "button" three times with no relationship to the panel; arrow-key navigation will not work.

**Recommendation: A.** This is a developer-audience site; getting tab semantics right is table stakes.

### D5. Tab persistence: localStorage / URL hash vs. ephemeral

- **Option A — localStorage** (`relay.codeTab` key).
  - Pro: a returning visitor sees their preferred language.
  - Con: requires SSR-safe hydration guarding; runs into "first paint shows Node, then flips to Python" flicker unless we suppress with `suppressHydrationWarning` or render-after-mount tricks.
- **Option B — URL hash** (`#node`, `#python`, `#curl`).
  - Pro: shareable; deep-linkable.
  - Con: collides with anchor-scroll behavior; may compete with our Lenis smooth-scroll.
- **Option C — ephemeral state, default `"node"`.** *(Recommended)*
  - Pro: simplest; no SSR/hydration hazard; fastest path to ship.
  - Con: tab choice does not persist across reloads.

**Recommendation: C.** Persistence is a polish concern that the section doesn't justify yet. If user research later shows visitors hunt for their language on every visit, revisit.

### D6. Syntax highlighting: bundled library vs. hand-painted spans

- **Option A — `prism-react-renderer` or `shiki`.**
  - Pro: accurate token coloring; no manual maintenance.
  - Con: adds a dependency (~30–80 KB after tree-shake) for three tiny snippets; runtime tokenization on the client; theme integration work.
- **Option B — hand-painted `<span>` spans inside the JSX, using only the three approved palette colors.** *(Recommended)*
  - Pro: zero new deps; deterministic; tokens come from our existing tailwind palette so colors match the rest of the site; readable in the source.
  - Con: a future fourth language sample is a manual edit.

**Recommendation: B.** Issue spec says "use prism-style spans with primary-300/ink-200/ink-400 colors" — that explicitly asks for hand-painted, not a library. The three samples are short and won't churn.

Color allocation (see Designer for confirmation):

- Keywords + literal strings → `text-primary-300`
- Identifiers + plain code text → `text-ink-200`
- Punctuation, operators, comments, line continuations → `text-ink-400`

### D7. Copy-to-clipboard button

- **Option A — include it.** *(Recommended)*
  - Pro: developers expect to copy code; the issue lists `Copy` as the allowed lucide icon, signaling it.
  - Con: a small amount of additional client logic and a "Copied" toast state.
- **Option B — omit it.**
  - Pro: simpler.
  - Con: includes the Copy icon in the issue's allowed-icon list as a hint, then leaves it unused; weakens the developer-voiced affordance.

**Recommendation: A.** Implement with `navigator.clipboard.writeText`; show a 1.5s "Copied" label swap (icon + text). Falls back silently on unsupported browsers (no error).

### D8. Code-panel sizing: fixed height vs. content-driven

- **Option A — fixed min-height matched to the longest sample (~280px).** *(Recommended)*
  - Pro: switching tabs does not jolt the layout; everything below stays anchored.
  - Con: shorter samples have a few lines of empty dark space at the bottom.
- **Option B — content-driven height; let the card grow/shrink per tab.**
  - Pro: tighter visual.
  - Con: layout shift on every tab click; below-the-fold content jumps; hostile to reading.

**Recommendation: A.** Designer to confirm exact min-height and whether to use `min-h-[280px]` or a tailwind token.

### D9. Card chrome — traffic-light dots & "macOS terminal" affordance

The issue specifies three colored dots (red / yellow / green) in the card header. This is a recognizable terminal-window visual. They are decorative, not functional.

- **Option A — render them as plain spans, decorative only, `aria-hidden`.** *(Recommended)*
  - Pro: correct semantics for purely visual chrome; SR users skip them.
  - Con: none.
- **Option B — render them as `<button>`s like real macOS window-chrome.**
  - Pro: visual fidelity.
  - Con: misleading; they do nothing; introduces noise for SR users.

**Recommendation: A.**

### D10. Code-sample authenticity vs. invented-API plausibility

The issue mandates "REAL working code for Relay's fictional API" — the API itself is invented but the code shape must look like real, idiomatic SDK usage that a senior engineer would not flinch at.

- Node — modern ESM import, async/await, env-var key, structured payload. **Do NOT** use `require`, `Promise.then`, or any 2014-era idiom.
- Python — clean import, env-var key, dict payload, single `client.messages.create(...)` call. **Do NOT** use `urllib`, `requests` directly, or any pre-`Client`-pattern shape.
- Curl — `POST` to `https://api.relay.dev/v1/messages` with `Authorization: Bearer`, `Content-Type: application/json`, `--data-raw` JSON body. **Do NOT** use basic auth or query-string keys.

The fictional endpoint shape is consistent across all three samples: a `messages.create` call with `{ to, from, channel, body }` (Copywriter / Engineer agree on the exact field names; this ADR proposes those four).

### D11. Animation stack: framer-motion only

- Issue and Project Context align: framer-motion handles the entrance (`whileInView`) and the active-tab `layoutId` underline. No GSAP/ScrollTrigger needed because nothing scrubs or pins.

## Open questions for Designer

1. **Section vertical padding** — match Hero / Features / LogoWall neighbors (suggest `py-20 lg:py-28`); confirm against the page's overall vertical cadence.
2. **Container max-width** — `max-w-7xl` (1280px) is the dominant landing-page width across other sections; confirm.
3. **Grid gap** — column gap between copy and card on `lg` (suggest `gap-12` to `gap-16`); confirm.
4. **Code-card aspect** — fixed `min-h-[280px]` (D8) vs. some other value, and whether the card should be capped on `2xl` viewports.
5. **Card background** — issue says `ink-900`; confirm vs. a slightly off-black (e.g. `#0F1322` or a `from-ink-900 to-ink-800` very subtle gradient) for depth.
6. **Card chrome height & spacing** — header bar height, dot diameter (`8px` is typical), tab strip vertical padding, font size of tab labels.
7. **Active-tab visual** — issue says `primary-500 underline`. Recommend `primary-300` for legibility on the dark card and `primary-500` for the underline itself. Designer confirms.
8. **Inactive tab color** — `ink-400` proposed; confirm against `ink-300` for higher legibility on `ink-900`.
9. **Code typography** — `font-mono` (JetBrains Mono per tokens), recommend `text-[13px]` or `text-sm` with `leading-6`. Designer confirms exact size and line-height.
10. **Copy-button placement** — top-right of card chrome, or floating top-right of the code panel itself? Recommend the chrome row, far right.
11. **"Copied" affordance** — short label swap next to the icon vs. tiny tooltip vs. icon morph (Copy → Check). Designer to choose.
12. **Underline transition** — duration & easing for the `layoutId` slide; recommend ~0.25s `ease-out-soft`.
13. **Entrance** — recommend `duration: 0.5`, `ease: [0,0,0.2,1]`, viewport `amount: 0.3`, `once: true`, right-column delay `0.1`.
14. **Focus ring** — color/width on the docs link, the tabs, and the copy button against a dark and light background respectively. Recommend `focus-visible:ring-2 ring-primary-400 ring-offset-2`.
15. **Reduced-motion fallback** — confirm: no entrance, no underline slide, no docs-arrow nudge.

## Open questions for Copywriter

1. **Eyebrow** — issue suggests "DEVELOPERS". Confirm or substitute (≤ 12 chars, all-caps, no exclamation).
2. **Headline** — issue suggests "Send your first message in five lines." Confirm or rewrite within Relay voice rules (≤ 12 words, no forbidden words: powerful/seamless/blazing-fast/etc., no exclamation; em dashes fine). The "five lines" claim should remain truthful — the Node sample must be ≤ 5 lines of meaningful code.
3. **Body** — one short paragraph (≤ 24 words, ≤ 2 sentences) explaining what the code shows. Suggest something orienting the reader to the SDK shape, not selling.
4. **Docs link microcopy** — "Read the docs →" is fine; confirm or alternative (e.g. "Browse the SDK", "Open API reference"). 2–4 words.
5. **Tab labels** — "Node", "Python", "Curl". Confirm casing (recommend `Node.js`, `Python`, `cURL` for technical correctness, or keep flat as-is — Copywriter decides).
6. **Code-sample comments** — if any sample includes a leading `// quick start` style comment, that string is copy and should be brand-voiced. Recommend keeping samples comment-free; if comments are added, ≤ 6 words each.
7. **Copy-button label** — `aria-label` for the copy button, e.g. "Copy code sample"; confirm.
8. **"Copied" label** — short success microcopy, e.g. "Copied", "Copied!" (no — exclamation forbidden), or "Copied to clipboard". Recommend "Copied".
9. **API field naming** — confirm the four payload field names: `to`, `from`, `channel`, `body`. These appear verbatim in all three samples and must match across them.
10. **Endpoint URL** — `https://api.relay.dev/v1/messages` proposed; confirm the host (`api.relay.dev` vs. `api.relay.com` vs. another), since the URL appears in the curl sample.

## Hand-off

Designer + Copywriter can begin in parallel. Engineer waits on both, then implements `components/relay/CodeMockup.tsx` per this ADR plus the design + content artifacts. The current `components/relay/CodeMockup.tsx` is the placeholder scaffold; Engineer replaces it wholesale.
