'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { heroContent } from '@/app/content/relay/hero';
import Link from 'next/link';

const blobAnimations = [
  {
    color: '#A9B3FF',
    size: 'h-[60%] w-[60%]',
    position: 'top-[-8%] left-[-12%]',
    ampX: 18,
    ampY: 28,
    duration: 11,
    delay: 0,
    zIndex: 'z-0',
  },
  {
    color: '#5B6CFF',
    size: 'h-[55%] w-[55%]',
    position: 'top-[18%] right-[-10%]',
    ampX: 24,
    ampY: 16,
    duration: 9,
    delay: 1.2,
    zIndex: 'z-10',
  },
  {
    color: '#E5E7EB',
    size: 'h-[45%] w-[45%]',
    position: 'bottom-[-6%] left-[8%]',
    ampX: 14,
    ampY: 22,
    duration: 13,
    delay: 0.6,
    zIndex: 'z-0',
  },
];

const Blob = ({
  color,
  size,
  position,
  ampX,
  ampY,
  duration,
  delay,
  zIndex,
  reducedMotion,
}: {
  color: string;
  size: string;
  position: string;
  ampX: number;
  ampY: number;
  duration: number;
  delay: number;
  zIndex: string;
  reducedMotion: boolean;
}) => {
  if (reducedMotion) {
    return (
      <div
        className={`absolute ${size} ${position} rounded-full blur-3xl opacity-50 mix-blend-normal ${zIndex}`}
        style={{ backgroundColor: color }}
      />
    );
  }

  return (
    <motion.div
      className={`absolute ${size} ${position} rounded-full blur-3xl opacity-50 mix-blend-normal ${zIndex}`}
      style={{ backgroundColor: color }}
      animate={{
        x: [-ampX, ampX, -ampX],
        y: [-ampY, ampY, -ampY],
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
        delay,
      }}
    />
  );
};

export default function Hero() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className="relative w-full bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,_var(--tw-gradient-stops))] from-[#F4F5FF] via-white to-white pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-x-12 lg:gap-x-16 items-center pt-24 lg:pt-20 md:pt-16 sm:pt-14 pb-20 lg:pb-16 md:pb-12 sm:pb-12">

          <div className="lg:col-span-3 lg:order-1 order-1 space-y-6 md:space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white ring-1 ring-ink-200 shadow-card">
              <span className="relative flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary-500 motion-safe:animate-ping" />
                <span className="text-xs font-medium tracking-wide uppercase text-ink-700">
                  {heroContent.eyebrow}
                </span>
              </span>
            </div>

            <motion.h1
              id="hero-headline"
              className="text-display-xl lg:text-display-xl md:text-display-lg sm:text-display-md text-ink-900 max-w-2xl text-balance font-sans"
              initial={{ opacity: 0, y: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1] }}
            >
              {heroContent.headline}
            </motion.h1>

            <motion.p
              className="text-[1.125rem] lg:text-[1.125rem] md:text-base text-ink-600 max-w-prose max-w-[520px] leading-7 lg:leading-7 md:leading-6 font-normal"
              initial={{ opacity: 0, y: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.08 }}
            >
              {heroContent.subhead}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-3 lg:mt-10 md:mt-10 sm:mt-8"
              initial={{ opacity: 0, y: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0, 0, 0.2, 1], delay: 0.16 }}
            >
              <Link
                href="#"
                className="group relative inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-primary-500 hover:bg-primary-600 text-white text-sm font-bold shadow-cta transition-[background-color,transform,box-shadow] duration-300 ease-[0,0,0.2,1]"
                onClick={(e) => e.preventDefault()}
              >
                {heroContent.primaryCta}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:motion-safe:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="#"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-transparent hover:bg-ink-50 border border-ink-200 hover:border-ink-300 text-ink-800 text-sm font-semibold transition-[background-color,border-color] duration-150 ease-[0,0,0.2,1]"
                onClick={(e) => e.preventDefault()}
              >
                {heroContent.secondaryCta}
              </Link>
            </motion.div>
          </div>

          <div className="lg:col-span-2 lg:order-2 order-2 mx-auto max-w-[480px] aspect-square relative overflow-hidden rounded-[28px]">
            {blobAnimations.map((blob, i) => (
              <Blob
                key={i}
                color={blob.color}
                size={blob.size}
                position={blob.position}
                ampX={blob.ampX}
                ampY={blob.ampY}
                duration={blob.duration}
                delay={blob.delay}
                zIndex={blob.zIndex}
                reducedMotion={reducedMotion}
              />
            ))}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0, 0, 0.2, 1], delay: 0.8 }}
              className="absolute bottom-[16%] left-[10%] z-20 px-4 py-3 rounded-xl bg-white/80 backdrop-blur-md ring-1 ring-ink-200/80 shadow-card"
              aria-hidden="true"
            >
              <code className="font-mono text-[13px] leading-5 font-medium text-ink-800">
                {heroContent.codeChipText}
              </code>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}