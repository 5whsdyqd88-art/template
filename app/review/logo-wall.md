# Verdict — LogoWall (SAN-12)

**Status:** CHANGES REQUESTED  
**Branch / commit reviewed:** `feature/logowall` @ `0ff7d5d`  
**Inputs:** `app/design/relay/logo-wall-design.md`, `components/relay/LogoWall.tsx`, `content/relay/logo-wall.ts`

## Design spec compliance

**BLOCKER: §2.2 color tokens violated**

Spec §2.2 explicitly mandates:
- Color (rest): `text-ink-400`
- Color (hover): `text-ink-700`

Implementation uses `text-ink-500` rest / `hover:text-ink-800`.

Spec §6.3 documents this alternative as: "**Document this swap as a future-PR option; do not pre-emptively apply it.**"

The current implementation pre-empts the spec's primary requirement without an audit trigger. This requires Designer sign-off to ship.

## Other checklist items

- ✅ Composition matches architect.md
- ✅ Tailwind class structure (const maps) matches architect recommendations
- ✅ Copy imported from content module — none inlined in JSX
- ✅ No icons used (allowed: none required)
- ✅ `"use client"` only when needed (framer-motion animations justified)
- ✅ Scope: only LogoWall.tsx and content/relay/logo-wall.ts changed as expected

## Blockers

1. **design** — `components/relay/LogoWall.tsx:208` — Spec §2.2 mandates `text-ink-400` rest / `text-ink-700` hover; implementation uses `text-ink-500`/`hover:text-ink-800` per §6.3 which must only be applied when "an audit later requires AA" — not pre-emptively per spec guidance.

## Recommended action

Restore `text-ink-400` / `hover:text-ink-700` per spec §2.2, or obtain explicit Designer approval to ship the a11y-fix variant.
