"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion"

import { statsContent } from "@/app/content/relay/stats"

const EASE = [0.0, 0.0, 0.2, 1] as [number, number, number, number]

function detectDecimals(n: number): number {
  const str = n.toString()
  const dot = str.indexOf(".")
  return dot === -1 ? 0 : str.length - dot - 1
}

function Counter({
  to,
  decimals,
  delay,
}: {
  to: number
  decimals: number
  delay: number
}) {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)
  const count = useMotionValue(0)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const formatted = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  )

  useEffect(() => {
    if (!isInView) return
    if (shouldReduceMotion) {
      count.set(to)
      return
    }
    const controls = animate(count, to, {
      duration: 1.6,
      ease: EASE,
      delay,
    })
    return controls.stop
  }, [isInView, shouldReduceMotion, to, delay, count])

  const finalLabel =
    decimals > 0 ? to.toFixed(decimals) : Math.round(to).toString()

  return (
    <>
      <motion.span ref={ref} aria-hidden="true">
        {formatted}
      </motion.span>
      <span className="sr-only">{finalLabel}</span>
    </>
  )
}

export default function Stats() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section aria-label="Key statistics" className="py-20 md:py-24 border-b border-ink-100">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.4 }}
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: 0.6, ease: EASE }
          }
        >
          {statsContent.items.map((item, index) => {
            const decimals = detectDecimals(item.number)
            return (
              <div
                key={index}
                className={`flex flex-col px-8 py-10${index > 0 ? " md:border-l border-ink-100" : ""}`}
              >
                <p className="text-display-lg md:text-display-xl font-bold text-ink-900 tabular-nums">
                  <Counter to={item.number} decimals={decimals} delay={index * 0.08} />
                  {item.suffix}
                </p>
                <p className="mt-3 text-sm font-semibold text-ink-600 uppercase tracking-[0.14em]">
                  {item.label}
                </p>
                <p className="mt-2 text-[15px] text-ink-600 md:max-w-[30ch]">
                  {item.detail}
                </p>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
