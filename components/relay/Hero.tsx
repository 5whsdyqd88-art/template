"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { heroContent } from "@/app/content/relay/hero";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50 via-primary-50 to-background min-h-[600px] flex items-center pt-24 pb-8">
      <div className="max-w-[1280px] mx-auto px-8 lg:px-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              {heroContent.eyebrow}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
              className="text-display-xl font-bold leading-[1.18] text-ink-900 text-balance max-w-2xl"
            >
              {heroContent.headline}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: 0.1 }}
            >
              <p className="text-[1.125rem] text-ink-600 max-w-prose leading-relaxed">
                {heroContent.subhead}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0, 0, 0.2, 1], delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-medium leading-6 transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-ink-900 min-h-[52px] shadow-cta"
              >
                {heroContent.primaryCta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-[2px]" />
              </Link>
              <Link
                href="#"
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-transparent hover:bg-ink-50 text-ink-900 font-medium leading-6 transition-colors duration-base focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-ink-900 min-h-[52px]"
              >
                {heroContent.secondaryCta}
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              className="aspect-square max-w-[480px] w-full relative overflow-hidden rounded-xl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0, 0, 0.2, 1] }}
            >
              <div className="absolute inset-0 bg-primary-300 rounded-full blur-3xl opacity-20 mix-blend-multiply animate-blob"></div>
              <div
                className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-20 mix-blend-multiply"
                style={{
                  animation: prefersReducedMotion
                    ? "none"
                    : "blob 11s infinite reverse",
                }}
              ></div>
              <div
                className="absolute bottom-[-20%] left-[-20%] w-64 h-64 bg-ink-200 rounded-full blur-3xl opacity-20 mix-blend-multiply"
                style={{
                  animation: prefersReducedMotion
                    ? "none"
                    : "blob 13s infinite reverse",
                }}
              ></div>
              <div
                className="absolute top-[40%] left-[20%] w-48 h-48 bg-primary-300 rounded-full blur-3xl opacity-20 mix-blend-multiply"
                style={{
                  animation: prefersReducedMotion
                    ? "none"
                    : "blob 9s infinite reverse",
                }}
              ></div>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-card border border-ink-100">
                <code className="font-mono text-xs text-ink-700">
                  {heroContent.codeChipText}
                </code>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
