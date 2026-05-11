import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { ctaContent } from "@/app/content/relay/cta"

type Transition = {
  duration: number
  ease: readonly [number, number, number, number]
}

type MotionVariants = {
  hidden: { opacity: number; y?: number }
  visible: { opacity: number; y?: number }
}

function getVariants(
  prefersReducedMotion: boolean
): MotionVariants {
  return prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 },
      }
}

function getButtonVariants(
  prefersReducedMotion: boolean
): MotionVariants {
  return prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }
}

function getTransition(): Transition {
  return {
    duration: 0.5,
    ease: [0, 0, 0.2, 1] as const,
  }
}

function getButtonTransition(): Transition {
  return {
    duration: 0.4,
    ease: [0, 0, 0.2, 1] as const,
  }
}

export default function CTA() {
  const prefersReducedMotion = useReducedMotion() ?? false

  const contentVariants = getVariants(prefersReducedMotion)
  const transition = getTransition()

  return (
    <section
      id="cta"
      className="relative flex w-full flex-col items-center py-24 font-sans"
      style={{
        background:
          "linear-gradient(135deg, #3B46B8 0%, #5B6CFF 50%, #4A58E0 100%)",
      }}
    >
      <SVGDecorativeLayer />

      <div className="relative z-10 mx-auto max-w-[75rem] px-8 text-center">
        <motion.h2
          className="mx-auto max-w-3xl text-display-md font-medium leading-[1.15] tracking-[-0.01em] text-white"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          transition={transition}
        >
          {ctaContent.headline}
        </motion.h2>

        <motion.p
          className="mx-auto mt-8 max-w-2xl text-lg font-normal leading-7 text-white/80"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          transition={{ ...transition, delay: 0.1 }}
        >
          {ctaContent.subhead}
        </motion.p>

        <motion.div
          className="mx-auto mt-8 flex flex-col items-center justify-center gap-4 md:flex-row"
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          transition={{ ...transition, delay: 0.2 }}
        >
          <CTAPrimary prefersReducedMotion={prefersReducedMotion} />
          <CTASecondary prefersReducedMotion={prefersReducedMotion} />
        </motion.div>
      </div>
    </section>
  )
}

function SVGDecorativeLayer() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0 pointer-events-none"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,200 C200,300 400,100 600,200 C800,300 1000,100 1440,200 L1440,400 L0,400 Z"
          fill="white"
          fillOpacity={0.08}
        />
        <path
          d="M0,300 C300,200 600,350 900,250 C1200,150 1440,300 1440,300 L1440,400 L0,400 Z"
          fill="white"
          fillOpacity={0.06}
        />
      </svg>
    </div>
  )
}

function CTAPrimary({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const buttonVariants = getButtonVariants(prefersReducedMotion)
  const transition = getButtonTransition()

  return (
    <motion.a
      href="#start"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-medium text-primary-700 shadow-cta transition-colors duration-base hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={{ minHeight: "44px", minWidth: "44px" }}
      initial="hidden"
      animate="visible"
      variants={buttonVariants}
      transition={transition}
    >
      {ctaContent.primaryCta}
      <ArrowRight size={18} />
    </motion.a>
  )
}

function CTASecondary({ prefersReducedMotion }: { prefersReducedMotion: boolean }) {
  const buttonVariants = getButtonVariants(prefersReducedMotion)
  const transition = getButtonTransition()

  return (
    <motion.a
      href="#contact"
      className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-base font-medium text-white transition-opacity duration-base hover:bg-white/10 hover:border-white/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={{ minHeight: "44px", minWidth: "44px" }}
      initial="hidden"
      animate="visible"
      variants={buttonVariants}
      transition={transition}
    >
      {ctaContent.secondaryCta}
    </motion.a>
  )
}
