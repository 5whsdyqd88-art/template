'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Zap, ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { topNavContent } from '@/app/content/relay/topnav';
import { motion, useScroll, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Lenis?: { scrollTo: (y: number, options?: { duration?: number }) => void };
  }
}

type NavItem = { label: string; href: string };
type EasingTuple = [number, number, number, number];

const easeOutSoft: EasingTuple = [0.43, 0.13, 0.23, 0.96];

export default function TopNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const bodyRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    bodyRef.current = document.body;
    const unsubscribe = scrollY.on('change', (latest) => {
      setScrolled(latest > 8);
    });
    return unsubscribe;
  }, [scrollY]);

  useEffect(() => {
    if (mobileOpen) {
      bodyRef.current?.style.setProperty('overflow', 'hidden');
    } else {
      bodyRef.current?.style.removeProperty('overflow');
    }
  }, [mobileOpen]);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.Lenis) {
      e.preventDefault();
      (window.Lenis as { scrollTo: (y: number, options?: { duration?: number }) => void }).scrollTo(0, { duration: 0.8 });
    } else {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  const mobileMenuVariants = {
    enter: {
      x: '100%',
      opacity: 0.95,
      transition: {
        x: { duration: 0.32, ease: easeOutSoft },
        opacity: { duration: 0.32, ease: easeOutSoft },
      },
    },
    center: { x: 0, opacity: 1 },
    exit: {
      x: '100%',
      opacity: 0,
      transition: {
        x: { duration: 0.22, ease: easeOutSoft },
        opacity: { duration: 0.22, ease: easeOutSoft },
      },
    },
  };

  const scrimVariants = {
    enter: { opacity: 0, transition: { opacity: { duration: 0.18, ease: easeOutSoft } } },
    center: { opacity: 0.4, transition: { opacity: { duration: 0 } } },
    exit: { opacity: 0, transition: { opacity: { duration: 0.16, ease: easeOutSoft } } },
  };

  const backdropVariants = {
    resting: {
      backgroundColor: 'rgba(255,255,255,0)',
      backdropFilter: 'blur(0px)',
      borderBottom: 'none',
    },
    scrolled: {
      backgroundColor: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgb(242,242,242)',
    },
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 h-[72px]"
      variants={backdropVariants}
      animate={scrolled ? 'scrolled' : 'resting'}
      transition={{
        backgroundColor: { duration: 0.2, ease: easeOutSoft },
        backdropFilter: { duration: 0.2, ease: easeOutSoft },
        borderBottom: { duration: 0.2, ease: easeOutSoft },
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            className="bg-primary-50 h-8 w-8 rounded-md flex items-center justify-center"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.08, ease: easeOutSoft }}
          >
            <Zap className="h-5 w-5 text-primary-500" strokeWidth={2} />
          </motion.div>
          <motion.a
            href="#top"
            onClick={handleBrandClick}
            className="text-ink-900 text-base font-semibold tracking-tight"
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.08, ease: easeOutSoft }}
          >
            {topNavContent.brand}
          </motion.a>
        </div>

        <nav className="hidden md:flex items-center flex-1 justify-center gap-8 lg:gap-10" aria-label="Primary">
          {topNavContent.nav.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <GhostLink label={topNavContent.signIn} />
          <OutlinedPill label={topNavContent.contactSales} />
          <PrimaryPill label={topNavContent.startCta} />
        </div>

        <button
          className="md:hidden h-11 w-11 flex items-center justify-center rounded-full hover:bg-ink-100 active:scale-98 transition-transform"
          aria-label={topNavContent.mobileMenuLabel}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6 text-ink-700" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-ink-900/40 z-50"
              variants={scrimVariants}
              initial="enter"
              animate="center"
              exit="exit"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-0 right-0 w-[min(360px,85vw)] h-full bg-white rounded-l-2xl border-l border-ink-100 shadow-card z-50 overflow-hidden"
              variants={mobileMenuVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <div className="px-6 py-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary-500" strokeWidth={2} />
                  <span className="text-ink-900 text-base font-semibold tracking-tight">{topNavContent.brand}</span>
                </div>
                <button
                  className="h-11 w-11 flex items-center justify-center rounded-full hover:bg-ink-100 active:scale-98 transition-transform"
                  aria-label={topNavContent.mobileMenuCloseLabel}
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-6 w-6 text-ink-700" />
                </button>
              </div>

              <div className="px-6 pb-6 flex flex-col gap-1">
                {topNavContent.nav.map((item) => (
                  <NavItem key={item.label} item={item} mobile onClick={() => setMobileOpen(false)} />
                ))}
              </div>

              <div className="border-t border-ink-100 pt-6 px-6 flex flex-col gap-3">
                <GhostLink label={topNavContent.signIn} mobile />
                <OutlinedPill label={topNavContent.contactSales} mobile />
                <PrimaryPill label={topNavContent.startCta} mobile />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavItem({ item, mobile, onClick }: { item: NavItem; mobile?: boolean; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex items-center gap-1 group ${mobile ? 'text-base font-medium' : 'text-sm font-medium'} py-3`}
    >
      <span className="text-ink-700 group-hover:text-ink-900 transition-colors" style={{ transitionDuration: reducedMotion ? '0ms' : '150ms' }}>
        {item.label}
      </span>
      <ChevronDown
        className={`h-4 w-4 text-ink-700 group-hover:text-ink-900 transition-transform ${reducedMotion ? '' : 'group-hover:rotate-180'}`}
        style={{ transitionDuration: reducedMotion ? '80ms' : '180ms' }}
      />
      <span
        className={`absolute bottom-[-2px] left-0 h-[1.5px] bg-ink-900 origin-left transition-transform ${reducedMotion ? '' : 'group-hover:scale-x-100'}`}
        style={{
          width: '100%',
          transitionDuration: reducedMotion ? '0ms' : '200ms',
          scale: hovered ? '1' : '0',
        }}
      />
      <span className="absolute inset-0" aria-hidden="true" />
    </Link>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function GhostLink({ label, mobile }: { label: string; mobile?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`h-9 px-2 py-2 ${hovered ? 'text-ink-900' : 'text-ink-700'} transition-colors text-sm font-medium`}
      style={{ transitionDuration: reducedMotion ? '0ms' : '150ms' }}
    >
      {label}
    </a>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function OutlinedPill({ label, mobile }: { label: string; mobile?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`h-9 px-4 rounded-full border transition-all text-sm font-medium flex items-center justify-center gap-2`}
      style={{
        borderColor: hovered ? 'rgb(24,24,27)' : 'rgb(229,229,229)',
        backgroundColor: hovered ? 'rgb(24,24,27)' : 'transparent',
        color: hovered ? 'rgb(255,255,255)' : 'rgb(24,24,27)',
        transitionDuration: reducedMotion ? '0ms' : '200ms',
      }}
    >
      {label}
    </a>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function PrimaryPill({ label, mobile }: { label: string; mobile?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="h-9 px-4 rounded-full bg-primary-500 text-white shadow-cta flex items-center justify-center gap-2 text-sm font-semibold transition-all hover:bg-primary-600"
      style={{
        boxShadow: hovered ? '0 10px 20px rgba(74,88,224,0.55)' : undefined,
        transitionDuration: reducedMotion ? '0ms' : '200ms',
      }}
    >
      <span className="transition-transform" style={{ transitionDuration: reducedMotion ? '0ms' : '180ms', transform: hovered ? 'translateX(2px)' : 'none' }}>
        {label}
      </span>
      <ArrowRight className={`h-4 w-4 transition-transform ${reducedMotion ? '' : hovered ? 'translate-x-2' : ''}`} />
    </a>
  );
}
