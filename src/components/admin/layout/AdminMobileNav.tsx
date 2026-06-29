"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { AdminNavLink } from "@/components/admin/layout/AdminNavLink";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ADMIN_NAV_ITEMS } from "@/config/adminNavigation";

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants: Variants = {
  hidden: { x: "-100%" },
  visible: { x: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { x: "-100%", transition: { duration: 0.2, ease: "easeIn" } },
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminMobileNav({ isOpen, onClose }: Props): React.JSX.Element {
  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-nav-backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-bg) 70%, transparent)",
            }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            key="mobile-nav-panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r lg:hidden"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile admin navigation"
          >
            {/* Header */}
            <div
              className="flex h-16 items-center justify-between border-b px-4"
              style={{ borderColor: "var(--color-border)" }}
            >
              <Logo />
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
                aria-label="Close navigation menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav */}
            <nav
              className="flex-1 overflow-y-auto px-2 py-4"
              aria-label="Mobile admin navigation"
            >
              <ul className="space-y-0.5" role="list">
                {ADMIN_NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <AdminNavLink {...item} onClick={onClose} />
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout */}
            <div
              className="border-t p-2"
              style={{ borderColor: "var(--color-border)" }}
            >
              <LogoutButton
                showLabel
                variant="ghost"
                className="w-full justify-start gap-3 text-sm"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}