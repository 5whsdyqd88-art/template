STATUS: CHANGES REQUESTED

## Blockers

### B1 — Active tab text invisible (a11y serious)
`components/relay/CodeMockup.tsx:84` — `text-ink-900` on `bg-ink-950` = 1.13:1 contrast (WCAG AA requires 4.5:1)

### B2 — Inactive tabs fail color contrast (a11y serious)  
`components/relay/CodeMockup.tsx:84` — `text-ink-500` with `opacity: 0.7` on `bg-ink-950` = 2.44:1

### B3 — Terminal card overflows viewport on tablet/mobile
`components/relay/CodeMockup.tsx:211` — No overflow handling for code panel at < 768 px

### B4 — Headline overflows on mobile
`components/relay/CodeMockup.tsx:176` — `text-4xl sm:text-5xl` doesn't fit 390 px viewport

## Checklist (passing items)

| Check | Status |
|-------|--------|
| `use client` present | ✅ |
| Icons from lucide-react | ✅ (`Copy`, `Check`, `ArrowRight`) |
| Design spec present | ✅ |
| `npx tsc --noEmit` passes | ✅ |
| `npm run build` passes | ✅ |
| Scope: only expected files changed | ✅ |

---
*Reviewer verdict — 2026-05-11*
