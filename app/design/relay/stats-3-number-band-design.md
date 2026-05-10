# Stats (3-number band) — Visual Spec

Component: `components/relay/Stats.tsx`
Content module: `app/content/relay/stats.ts`

---

## 1. Layout

### Section container

- Element: `<section aria-label="Key statistics">`
- Padding: `py-20` mobile · `md:py-24` desktop
- Border: `border-b border-ink-100` (separates from next section)
- No min-height; height is content-driven

### Inner container

- `mx-auto max-w-6xl px-6 md:px-8`

### Grid

- `grid grid-cols-1 md:grid-cols-3`
- Column cells: `flex flex-col px-8 py-10`
- Dividers: columns 2 and 3 get `md:border-l border-ink-100` (left border on md+, no border on mobile)

---

## 2. Type

| Element | Class | Notes |
|---|---|---|
| Number | `text-display-lg md:text-display-xl font-bold text-ink-900 tabular-nums` | Animated counter; see §4 |
| Label | `mt-3 text-sm font-semibold text-ink-600 uppercase tracking-[0.14em]` | All-caps with 0.14em tracking |
| Detail | `mt-2 text-[15px] text-ink-600 md:max-w-[30ch]` | 15px body, max 30ch at md+ |

---

## 3. Content

Three items from `statsContent.items` in `@/app/content/relay/stats`:

| # | Number | Suffix | Label | Detail |
|---|---|---|---|---|
| 1 | 99.99 | % | Uptime SLA | Guaranteed across all tiers with real-time status. |
| 2 | 4.2 | B+ | Messages / month | Delivered globally with sub-100ms median latency. |
| 3 | 180 | + | Countries | Local numbers and compliance in every region. |

---

## 4. Counter animation

- Library: `framer-motion` — `useMotionValue`, `useTransform`, `animate`, `useInView`
- Trigger: `useInView(ref, { once: true, amount: 0.4 })` on the counter span
- Duration: 1.6 s, ease `[0.0, 0.0, 0.2, 1]`
- Stagger: `delay = index * 0.08` → delays of `[0, 0.08, 0.16]`
- Formatter: `useTransform(count, (v) => decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString())`
- Accessibility: animated span has `aria-hidden="true"`; a `sr-only` span shows the final value for screen readers
- Reduced motion: counter jumps to final value immediately (`count.set(to)`) with no duration

---

## 5. Section entrance animation

- `motion.div` wrapping the grid
- `initial={{ opacity: 0, y: 24 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.4 }}`
- `transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}`
- Reduced motion: `initial={false}`, no `whileInView` (element renders at full opacity, no slide)
