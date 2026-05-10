"use client"

import { logoWallContent } from "@/content/relay/logo-wall"
import { motion, useReducedMotion } from "framer-motion"

type WordmarkData = {
  label: string
  weightHint: "light" | "regular" | "medium" | "semibold" | "bold"
  trackingHint: "tighter" | "tight" | "normal" | "wide" | "widest"
  italic?: boolean
  mono?: boolean
}

const weightMap: Record<string, string> = {
  light: "font-light",
  regular: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
}

const trackingMap: Record<string, string> = {
  tighter: "tracking-tighter",
  tight: "tracking-tight",
  normal: "tracking-normal",
  wide: "tracking-wide",
  widest: "tracking-widest",
}

function Wordmark({ wordmark }: { wordmark: WordmarkData }) {
  const { label, weightHint, trackingHint, italic, mono } = wordmark

  const baseClasses = "text-ink-400 text-lg md:text-xl transition-colors duration-fast ease-out-soft"
  const weightClass = weightMap[weightHint] || "font-medium"
  const trackingClass = trackingMap[trackingHint] || "tracking-normal"
  const italicClass = italic ? "italic" : ""
  const monoClass = mono ? "font-mono" : "font-sans"

  return (
    <li>
      <span className={`${baseClasses} ${weightClass} ${trackingClass} ${italicClass} ${monoClass} hover:text-ink-700`}>
        {label}
      </span>
    </li>
  )
}

export default function LogoWall() {
  const shouldReduceMotion = useReducedMotion()

  const rowAnimation = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: [0, 1], y: [12, 0] }

  const rowTransition = shouldReduceMotion
    ? undefined
    : { duration: 0.42, ease: "easeOut" as const, delay: 0.14 }

  const eyebrowAnimation = shouldReduceMotion
    ? { opacity: 1, y: 0 }
    : { opacity: [0, 1], y: [8, 0] }

  const eyebrowTransition = shouldReduceMotion
    ? undefined
    : { duration: 0.36, ease: "easeOut" as const }

  return (
    <section className="bg-white" aria-labelledby="logo-wall-eyebrow">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-10 py-16 md:py-20">
        <motion.p
          id="logo-wall-eyebrow"
          className="text-sm font-medium tracking-[0.18em] uppercase text-ink-500 text-center"
          animate={eyebrowAnimation}
          transition={eyebrowTransition}
        >
          {logoWallContent.eyebrow}
        </motion.p>
        <motion.ul
          aria-label={logoWallContent.ariaLabel}
          className="flex flex-wrap items-center justify-center mt-10 md:mt-12 gap-x-8 md:gap-x-10 lg:gap-x-12 gap-y-6"
          animate={rowAnimation}
          transition={rowTransition}
        >
          {logoWallContent.wordmarks.map((wordmark) => (
            <Wordmark key={wordmark.label} wordmark={wordmark as WordmarkData} />
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
