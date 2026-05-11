"use client";

import { footerContent } from "@/app/content/relay/footer";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const Logo = () => (
  <Image
    src="/logo.svg"
    alt="Relay"
    width={110}
    height={30}
    className="w-[110px] lg:w-[110px] mt-8 lg:mt-0"
  />
);

function AccordionItem({
  heading,
  links,
}: {
  heading: string;
  links: readonly { text: string; href: string }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const slugId = heading.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="border-b border-white/10">
      <button
        id={`footer-trigger-${slugId}`}
        className="flex items-center justify-between w-full py-4 min-h-[44px] text-sm font-medium text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900"
        aria-expanded={isOpen}
        aria-controls={`footer-panel-${slugId}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {heading}
        <motion.svg
          className="w-4 h-4 text-white"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{
            duration: shouldReduceMotion ? 0 : isOpen ? 0.3 : 0.2,
            ease: isOpen ? [0.43, 0.13, 0.23, 0.96] : [0.65, 0.09, 0.38, 0.67],
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </motion.svg>
      </button>
      <motion.div
        id={`footer-panel-${slugId}`}
        role="region"
        aria-labelledby={`footer-trigger-${slugId}`}
        className="overflow-hidden"
        initial={{ maxHeight: 0 }}
        animate={{ maxHeight: isOpen ? "500px" : 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : isOpen ? 0.3 : 0.2,
          ease: isOpen ? [0.43, 0.13, 0.23, 0.96] : [0.65, 0.09, 0.38, 0.67],
        }}
      >
        <ul className="pb-4 flex flex-col space-y-3">
          {links.map((link, index) => (
            <li key={index}>
              <a
                className="text-sm text-ink-200 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 py-[5px]"
                href={link.href}
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer role="contentinfo" className="w-full bg-ink-900">
      <div className="max-w-screen-xl mx-auto px-8 py-10 md:py-12 lg:pt-16 lg:pb-12">
        <div className="flex flex-col gap-0 lg:grid lg:grid-cols-[200px_1fr_1fr_1fr_1fr] lg:gap-10 lg:items-start">
          <div className="flex flex-col">
            <Logo />
            <ul aria-label="Brand links">
              {footerContent.brandMiscLinks.map((link, index) => (
                <li key={index}>
                  <a
                    className="text-sm text-ink-300 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 py-[5px]"
                    href={link.href}
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {footerContent.columns.map((column, index) => (
            <nav key={index} aria-label={`${column.heading} links`} className="hidden lg:flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-white">
                {column.heading}
              </span>
              <span className="block w-full h-px bg-white/20 mt-3 mb-4" />
              <ul className="flex flex-col space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      className="text-sm text-ink-200 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 py-[5px]"
                      href={link.href}
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
                <li className="mt-4">
                  <a
                    className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 py-[5px]"
                    href={column.viewAll.href}
                  >
                    {column.viewAll.text} →
                  </a>
                </li>
              </ul>
            </nav>
          ))}

          {footerContent.columns.map((column, index) => (
            <div key={`mobile-${index}`} className="lg:hidden">
              <AccordionItem
                heading={column.heading}
                links={column.links}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10 mt-12 md:mt-8 pt-6">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs font-normal text-ink-400 leading-normal">
              {footerContent.bottomBar.copyright}
            </p>
            <p className="text-xs text-ink-500 leading-relaxed">
              {footerContent.bottomBar.ccpaNotice}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
