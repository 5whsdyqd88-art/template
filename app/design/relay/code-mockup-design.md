# CodeMockup — Design Spec

## Layout

Two-column section on `lg+`, single column on mobile.

- Section: `bg-ink-50 py-20 lg:py-28`
- Container: `max-w-7xl mx-auto px-6 lg:px-8`
- Grid: `grid gap-12 lg:grid-cols-12`
- Left column: `lg:col-span-5` (copy)
- Right column: `lg:col-span-7` (code panel)

## Left column (copy)

- Eyebrow pill: `inline-block rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold tracking-wider text-primary-900 uppercase`
- Headline: `text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl mb-6`
- Body: `text-lg leading-relaxed text-ink-600 mb-8`
- Docs link: `inline-flex items-center gap-2 text-base font-medium text-primary-600 hover:text-primary-800` with `ArrowRight` icon (16px). Motion: `whileHover={{ x: 4 }}`
- All copy elements: `initial={{ opacity: 0, y: 16 }}` → `whileInView={{ opacity: 1, y: 0 }}`, staggered delays 0s / 0.1s / 0.2s / 0.3s, `duration: 0.5`, `viewport={{ once: true, margin: '-50px' }}`

## Right column (code panel)

Terminal chrome:
- Outer card: `overflow-hidden rounded-2xl bg-ink-900 shadow-2xl ring-1 ring-ink-800`
- Header bar: `flex items-center justify-between border-b border-ink-800 bg-ink-950 px-6 py-4`
- Traffic-light dots: `h-3 w-3 rounded-full` — `bg-red-500`, `bg-yellow-500`, `bg-green-500`, `gap-3`

Tab strip (`role="tablist"`):
- Active tab text: `text-ink-900`; inactive: `text-ink-500 hover:text-ink-700`
- Tab padding: `px-4 py-3 text-sm font-medium`
- Active underline: `absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500`
- Animation: `layoutId="codeTabUnderline"`, spring `stiffness: 500 damping: 30`; static `<span>` fallback when `prefers-reduced-motion`
- Tab labels sourced from `codeMockupContent.tabs` (Node.js, Python, curl)

Copy button:
- Placement: right end of header bar
- Idle: `Copy` icon (16px) + label from `codeMockupContent.copyButton.label` (hidden below `sm`)
- Copied state (1500ms): `Check` icon `text-green-500` + `codeMockupContent.copyButton.copied`
- Focus ring: `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-ink-950`

Code panel:
- `min-h-[320px] bg-ink-900 p-6`
- Tab content transition: `AnimatePresence mode="wait"` — fade/slide `y: 8 → 0`, `duration: 0.2`
- Code font: `font-mono text-sm text-ink-200`
- Syntax tokens: keywords/strings `text-primary-300`, plain text `text-ink-300`
- In reduced-motion: no AnimatePresence transitions in `SyntaxHighlight`

## Keyboard navigation

ARIA roving tabindex: ArrowRight/Left cycle tabs, Home/End jump to first/last, Enter/Space activate focused tab.

## Content

All strings from `app/content/relay/code-mockup.ts`. No inline copy in the component.
