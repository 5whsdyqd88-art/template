"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { statsContent } from "@/app/content/relay/stats";

type StatItem = (typeof statsContent.items)[number];

function Counter({ item, delay }: { item: StatItem; delay: number }) {
  const count = useMotionValue(0);
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  const decimals =
    item.number % 1 !== 0
      ? (item.number.toString().split(".")[1]?.length ?? 0)
      : 0;

  const displayValue = useTransform(count, (v) =>
    decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
  );

  useEffect(() => {
    if (!inView) return;
    if (shouldReduceMotion) {
      count.set(item.number);
      return;
    }
    const controls = animate(count, item.number, {
      duration: 1.6,
      delay,
      ease: [0.0, 0.0, 0.2, 1],
    });
    return () => controls.stop();
  }, [inView, count, item.number, delay, shouldReduceMotion]);

  return (
    <>
      <span className="sr-only">
        {item.number}
        {item.suffix}
      </span>
      <span ref={ref} aria-hidden="true">
        <motion.span>{displayValue}</motion.span>
        {item.suffix}
      </span>
    </>
  );
}

export default function Stats() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section aria-label="Key statistics" className="py-20 md:py-24 border-b border-ink-100">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.0, 0.0, 0.2, 1] }}
          className="grid grid-cols-1 md:grid-cols-3"
        >
          {statsContent.items.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col px-8 py-10${
                i > 0 ? " md:border-l border-ink-100" : ""
              }`}
            >
              <p className="text-display-lg md:text-display-xl font-bold text-ink-900 tabular-nums">
                <Counter item={stat} delay={i * 0.08} />
              </p>
              <p className="mt-3 text-sm font-semibold text-ink-600 uppercase tracking-[0.14em]">
                {stat.label}
              </p>
              <p className="mt-2 text-[15px] text-ink-400 md:max-w-[30ch]">{stat.detail}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
