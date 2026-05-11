"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, Easing } from "framer-motion";
import { Zap, ChevronDown, Menu, X, ArrowRight } from "lucide-react";

import { topNavContent } from "@/app/content/relay/topnav";

interface NavItem {
  label: string;
  href: string;
}

interface WindowWithLenis extends Window {
  Lenis?: {
    scrollTo: (y: number, options?: { duration?: number; easing?: Easing }) => void;
  };
}

const easing: Easing = [0.43, 0.13, 0.23, 0.96];
const reducedMotionEasing: Easing = [0.4, 0, 0.2, 1];

export default function TopNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const prefersReducedMotion = useReducedMotion() || false;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setScrolled(scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const handleBrandClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.button !== 0) return;

    const lenis = (window as WindowWithLenis).Lenis;
    const target = document.getElementById("top");

    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(0, { duration: prefersReducedMotion ? 0 : 0.8, easing });
    } else if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    }
  };

  const closeDrawer = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] ${
        scrolled ? "bg-white/80 backdrop-blur-md border-b border-ink-100" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center justify-between">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: prefersReducedMotion ? reducedMotionEasing : easing }}
          className="flex items-center gap-2 z-50"
        >
          <a href="#top" onClick={handleBrandClick} className="inline-flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-8 w-8 bg-primary-50 rounded-md">
              <Zap className="h-5 w-5 text-primary-500" strokeWidth="2" />
            </span>
            <span className="text-base font-semibold tracking-tight text-ink-900">
              {topNavContent.brand}
            </span>
          </a>
        </motion.div>

        <nav className="hidden md:flex flex-1 flex justify-center items-center" aria-label="Primary">
          <div className="flex items-center gap-8 lg:gap-10">
            {topNavContent.nav.map((item) => (
              <NavItem key={item.label} item={item} scrolled={scrolled} />
            ))}
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-3 z-50">
          <GhostLink href="#" scrolled={scrolled}>
            {topNavContent.signIn}
          </GhostLink>
          <OutlinedPill href="#" scrolled={scrolled}>
            {topNavContent.contactSales}
          </OutlinedPill>
          <PrimaryPill href="#" scrolled={scrolled}>
            {topNavContent.startCta} <ArrowRight className="h-4 w-4" />
          </PrimaryPill>
        </div>

        <button
          className="md:hidden h-11 w-11 flex items-center justify-center rounded-lg text-ink-700 hover:text-ink-900 focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label={topNavContent.mobileMenuLabel}
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileDrawer
            open={mobileOpen}
            onClose={closeDrawer}
            scrolled={scrolled}
            content={topNavContent}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

interface NavItemProps {
  item: NavItem;
  scrolled: boolean;
}

function NavItem({ item }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const underlineTransition = {
    duration: prefersReducedMotion ? 0 : 0.2,
    ease: "easeOut",
  };

  const caretTransition = {
    duration: prefersReducedMotion ? 0.08 : 0.18,
    ease: "easeOut",
  };

  return (
    <a
      href={item.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative inline-flex items-center gap-1 text-sm font-medium text-ink-700 hover:text-ink-900 focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-2 focus-visible:ring-offset-white"
      style={{ color: isHovered ? "rgb(26,26,26)" : "rgb(82,82,82)" }}
      aria-label={item.label}
    >
      {item.label}
      <motion.span
        style={{ display: "inline-flex" }}
        animate={{ rotate: isHovered ? 180 : 0 }}
        transition={{ ...caretTransition, ease: prefersReducedMotion ? reducedMotionEasing : easing }}
      >
        <ChevronDown className="h-3 w-3" />
      </motion.span>
        <motion.div
          className="absolute left-0 h-[1.5px] bg-ink-900 origin-left"
          style={{ top: "-2px", width: "100%" }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ ...underlineTransition, ease: prefersReducedMotion ? reducedMotionEasing : easing }}
      />
    </a>
  );
}

interface CtaPillProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function CtaPillBase({ href, children, className, style, onMouseEnter, onMouseLeave }: CtaPillProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isPressed, setIsPressed] = useState(false);

  const pressTransition = {
    duration: prefersReducedMotion ? 0 : 0.08,
    ease: "easeOut",
  };

  return (
    <a
      href={href}
      onMouseEnter={(e) => {
        setIsPressed(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsPressed(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`inline-flex items-center justify-center h-9 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-2 focus-visible:ring-offset-white ${className}`}
      style={style}
    >
      <motion.span
        animate={{ scale: isPressed ? 0.98 : 1 }}
        transition={{ ...pressTransition, ease: prefersReducedMotion ? reducedMotionEasing : easing }}
      >
        {children}
      </motion.span>
    </a>
  );
}

interface GhostLinkProps extends CtaPillProps {
  scrolled: boolean;
}

const GhostLink = ({ href, children, scrolled, className, style }: GhostLinkProps) => {
  return (
    <a
      href={href}
      className={`text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 ring-offset-2 focus-visible:ring-offset-white ${className || ""} ${
        scrolled ? "text-ink-700 hover:text-ink-900" : "text-ink-700 hover:text-ink-900"
      }`}
      aria-label={children as string}
      style={style}
    >
      {children}
    </a>
  );
};

interface OutlinedPillProps extends CtaPillProps {
  scrolled: boolean;
}

function OutlinedPill({ href, children, scrolled, className, style }: OutlinedPillProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CtaPillBase
      href={href}
      className={`border ${scrolled ? "border-ink-200 text-ink-900" : "border-ink-200 text-ink-900"} ${isHovered ? "bg-ink-900 text-white border-ink-900" : ""} focus-visible:ring-primary-300 ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      {children}
    </CtaPillBase>
  );
}

interface PrimaryPillProps extends CtaPillProps {
  scrolled?: boolean;
}

function PrimaryPill({ href, children, className, style }: PrimaryPillProps) {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <CtaPillBase
      href={href}
      className={`bg-primary-500 text-white shadow-cta ${isHovered ? "bg-primary-600" : ""} focus-visible:ring-primary-500 ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={style}
    >
      <span className="inline-flex items-center gap-2">
        <motion.span
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.18, ease: prefersReducedMotion ? reducedMotionEasing : easing }}
        >
          {children}
        </motion.span>
      </span>
    </CtaPillBase>
  );
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  scrolled: boolean;
  content: typeof topNavContent;
  prefersReducedMotion: boolean;
}

function MobileDrawer({ open, onClose, scrolled, content, prefersReducedMotion }: MobileDrawerProps) {
  const drawerTransition = prefersReducedMotion
    ? {
        enter: { opacity: 1, x: 0, transition: { duration: 0.12 } },
        exit: { opacity: 0, x: 100, transition: { duration: 0.08 } },
      }
    : {
        enter: {
          x: 0,
          opacity: 1,
          transition: {
            x: { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] },
            opacity: { duration: 0.32 },
          },
        },
        exit: {
          x: 100,
          opacity: 0,
          transition: { x: { duration: 0.22, ease: "easeOut" }, opacity: { duration: 0.16 } },
        },
      };

  const scrimTransition = prefersReducedMotion
    ? {
        enter: { opacity: 1, transition: { duration: 0.12 } },
        exit: { opacity: 0, transition: { duration: 0.08 } },
      }
    : {
        enter: { opacity: 1, transition: { duration: 0.18 } },
        exit: { opacity: 0, transition: { duration: 0.16 } },
      };

  const focusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open && focusRef.current) {
      focusRef.current.focus();
    }
  }, [open]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 bg-ink-900/40"
        initial="exit"
        animate="enter"
        exit="exit"
        variants={scrimTransition}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={content.mobileMenuLabel}
        className="fixed top-0 right-0 z-50 h-full w-[min(360px,85vw)] bg-white border-l border-ink-100 shadow-card"
        initial="exit"
        animate="enter"
        exit="exit"
        variants={drawerTransition}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-6 py-6 border-b border-ink-100">
            <span className="text-base font-semibold tracking-tight text-ink-900">
              {content.brand}
            </span>
            <button
              ref={focusRef}
              onClick={onClose}
              className="h-11 w-11 flex items-center justify-center rounded-lg text-ink-700 hover:text-ink-900 focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              aria-label={content.mobileMenuCloseLabel}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav className="space-y-1">
              <div className="space-y-1" role="none">
                {content.nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={onClose}
                    className="block px-2 py-3 text-base font-medium text-ink-700 hover:text-ink-900 rounded-lg"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="mt-6 pt-6 border-t border-ink-100 space-y-3">
              <GhostLink href="#" scrolled={scrolled} className="block w-full text-center">
                {content.signIn}
              </GhostLink>
              <OutlinedPill href="#" scrolled={scrolled} className="block w-full">
                {content.contactSales}
              </OutlinedPill>
              <PrimaryPill href="#" scrolled={scrolled} className="block w-full">
                {content.startCta}
              </PrimaryPill>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
