"use client";

import { useEffect, useState } from "react";
import logoWallContent from "@/content/relay/logo-wall";

const weightClasses: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

const trackingClasses: Record<string, string> = {
  "tracking-tight": "tracking-tight",
  "tracking-normal": "tracking-normal",
  "tracking-wide": "tracking-wide",
  "tracking-wider": "tracking-wider",
  "tracking-widest": "tracking-widest",
};

export default function LogoWall() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <section
      className="max-w-6xl mx-auto py-16 md:py-20 px-6 bg-white"
      aria-labelledby="logo-wall-eyebrow"
    >
      <p
        id="logo-wall-eyebrow"
        className="text-center text-ink-500 text-sm uppercase tracking-[0.18em] mb-12"
      >
        {logoWallContent.eyebrow}
      </p>

      <ul
        aria-label={logoWallContent.ariaLabel}
        className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6"
      >
        {logoWallContent.brands.map((brand, index) => {
          const fontClass = brand.mono ? "font-mono" : "font-sans";
          const weightClass = weightClasses[brand.weightHint] || "font-normal";
          const trackingClass = trackingClasses[brand.trackingHint] || "tracking-normal";

          const wordmarkClasses = `${fontClass} ${weightClass} ${trackingClass} text-ink-400 hover:text-ink-700 transition-colors`;
          const animationDelay = `${index * 0.14}s`;

          return (
            <li key={brand.name}>
              <span
                className={`${wordmarkClasses} cursor-default`}
                style={{
                  animation: `fadeInUp 0.42s ease-out-soft ${animationDelay} forwards`,
                  animationDelay: animationDelay,
                }}
              >
                {brand.name}
              </span>
            </li>
          );
        })}
      </ul>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
