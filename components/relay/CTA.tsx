"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ctaContent } from "@/app/content/relay/cta";

export default function CTA() {
  const shouldReduceMotion = useReducedMotion();
  const contentRef = useRef<HTMLDivElement>(null);

  const variants = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
  };

  const transition = {
    duration: 0.6,
    ease: [0.0, 0.0, 0.2, 1] as const,
  };

  return (
    <section
      id="cta"
      aria-labelledby="cta-headline"
      className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 py-20 px-6 md:py-24 md:px-8"
    >
      <svg
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full pointer-events-none"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="cta-glow" cx="80%" cy="0%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="1440" height="600" fill="url(#cta-glow)" />
        <path
          d="M -120 460 Q 360 260 720 480 T 1560 420"
          stroke="white"
          stroke-opacity="0.07"
          stroke-width="1.5"
          fill="none"
        />
        <path
          d="M -120 180 Q 360 -40 720 220 T 1560 200"
          stroke="white"
          stroke-opacity="0.10"
          stroke-width="1.5"
          fill="none"
        />
      </svg>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        {shouldReduceMotion ? (
          <div ref={contentRef}>
            <Content />
          </div>
        ) : (
          <motion.div
            ref={contentRef}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            transition={transition}
          >
            <Content />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function Content() {
  return (
    <>
      <h2
        id="cta-headline"
        className="display-md mb-5 text-balance font-sans font-semibold tracking-[-0.01em] leading-[1.15] text-white sm:text-3xl"
      >
        {ctaContent.headline}
      </h2>
      <p
        className="text-lg text-pretty text-white mx-auto max-w-2xl md:text-xl"
        style={{ opacity: 0.88 }}
      >
        {ctaContent.subhead}
      </p>
      <div className="mt-10 flex flex-col gap-3 justify-center items-stretch sm:items-center sm:flex-row md:gap-4 sm:mt-8">
        <a
          href="#start"
          className="h-14 w-full rounded-full bg-white px-7 py-4 text-base font-semibold leading-none text-primary-700 inline-flex items-center justify-center gap-2 shadow-cta hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(91,108,255,0.55)] active:translate-y-0 active:scale-[0.98] transition duration-300 ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600 sm:w-auto"
        >
          <span>{ctaContent.primaryCta}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
        <a
          href="#contact"
          className="h-14 w-full rounded-full bg-transparent px-7 py-4 text-base font-medium leading-none text-white border border-white/70 inline-flex items-center justify-center hover:bg-white/10 hover:border-white transition duration-300 ease-out-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-600 sm:w-auto"
        >
          <span>{ctaContent.secondaryCta}</span>
        </a>
      </div>
    </>
  );
}
