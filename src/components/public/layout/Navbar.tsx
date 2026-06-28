"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { NavLink } from "@/components/public/layout/NavLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { PUBLIC_NAV_LINKS, BOOKING_CTA } from "@/config/navigation";

/**
 * Public site Navbar.
 *
 * - Transparent on top of hero, solid background on scroll.
 * - Fully responsive: desktop nav + mobile slide-down menu.
 * - Respects prefers-reduced-motion via Framer Motion.
 * - Accessible: focus trap not needed (links remain in DOM on mobile).
 */
export function Navbar(): React.JSX.Element {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const handleResize = (e: MediaQueryListEvent): void => {
      if (e.matches) setIsMobileOpen(false);
    };
    mql.addEventListener("change", handleResize);
    return () => mql.removeEventListener("change", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  function closeMobile(): void {
    setIsMobileOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          isScrolled
            ? "border-b py-3 backdrop-blur-md"
            : "py-5",
        )}
        style={
          isScrolled
            ? {
                backgroundColor: "color-mix(in srgb, var(--color-bg) 90%, transparent)",
                borderColor: "var(--color-border)",
              }
            : undefined
        }
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Logo />

          {/* Desktop links */}
          <ul
            className="hidden items-center gap-8 md:flex"
            role="list"
          >
            {PUBLIC_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink {...link} />
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button
              asChild
              size="sm"
              className="font-semibold"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              <Link href={BOOKING_CTA.href}>{BOOKING_CTA.label}</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="flex items-center justify-center rounded-md p-2 transition-colors md:hidden"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
          >
            {isMobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              style={{
                backgroundColor: "color-mix(in srgb, var(--color-bg) 60%, transparent)",
              }}
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              key="panel"
              id="mobile-menu"
              role="dialog"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-x-0 top-[57px] z-50 border-b px-4 pb-6 pt-4"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <ul className="space-y-1" role="list">
                {PUBLIC_NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <NavLink {...link} mobile onClick={closeMobile} />
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <hr
                className="my-4"
                style={{ borderColor: "var(--color-border)" }}
              />

              {/* Mobile CTA */}
              <Button
                asChild
                className="w-full font-semibold"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-bg)",
                }}
              >
                <Link href={BOOKING_CTA.href} onClick={closeMobile}>
                  {BOOKING_CTA.label}
                </Link>
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}