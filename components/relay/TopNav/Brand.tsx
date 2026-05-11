"use client";

import { Zap } from "lucide-react";

import { topNavContent } from "@/app/content/relay/topnav";

interface WindowWithLenis extends Window {
  Lenis?: {
    scrollTo: (y: number, options?: { duration?: number }) => void;
  };
}

export default function Brand() {
  const handleBrandClick = () => {
    const windowWithLenis = window as WindowWithLenis;
    if (windowWithLenis.Lenis) {
      windowWithLenis.Lenis.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <a
      href="#"
      onClick={handleBrandClick}
      className="flex items-center gap-2 text-ink-900 hover:text-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
      aria-label={topNavContent.brand}
    >
      <Zap className="h-5 w-5 text-primary-500" />
      <span className="text-base font-bold tracking-tight">{topNavContent.brand}</span>
    </a>
  );
}
