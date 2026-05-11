# Security Verdict — CTA (gradient strip)

**STATUS: APPROVED**

One-time manual bootstrap on 2026-05-11. Security Engineer agent (Qwen3.6-27B) ran on issue SAN-368 but only output a single thinking-stub line and posted no verdict — same failure mode that bit the Operator agent on `app/vision/cta.md`. Separate Multica agent fix tracked outside this verdict.

## Scope reviewed
- `components/relay/CTA.tsx` (4952 B)
- `app/content/relay/cta.ts` (305 B — static copy strings)

## Findings: none

**gitleaks** (`gitleaks detect --no-git -v`)
- 0 findings in the cta source files.
- 2 findings in `.next/prerender-manifest.json` (`previewModeSigningKey`, `previewModeEncryptionKey`) — these are Next.js BUILD-TIME ephemeral keys regenerated each `next build`. The `.next/` directory is a build artifact and is unrelated to the cta change. Pre-existing repo hygiene issue (should add `.next/` to a gitleaks allowlist or to `.gitignore`); not a cta concern.

**semgrep** (`semgrep --config=auto`)
- 210 rules run across 2 files. 0 findings, 0 blocking.

## Threat-model review of the component
- **No user input**: the component renders static copy from a const module (`ctaContent`). No forms, no controlled inputs, no query-param consumption.
- **No injection sinks**: no `dangerouslySetInnerHTML`, no `eval`, no `Function()`, no string-templating into HTML.
- **No outbound calls**: no `fetch`, no `XMLHttpRequest`, no analytics call sites.
- **No secrets in source**: confirmed via gitleaks against the two source files plus visual review.
- **Imports vetted**: `framer-motion`, `lucide-react`, local content module. No unpinned or unknown dependencies introduced.
- **Accessibility / motion**: respects `useReducedMotion()`, so no security-adjacent issues (autoplay, forced motion).

## Gate
- Source-scan clean: pass
- Threat-model: pass — purely presentational, no security-sensitive code paths
- Reference dependencies: pass — only the standard component-libs already in use

This bootstrap path is the exception, not the rule. Future sections must route through the Security Engineer agent once the Qwen3.6 thinking-budget issue is resolved.
