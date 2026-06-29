"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { AdminNavLink } from "@/components/admin/layout/AdminNavLink";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { ADMIN_NAV_ITEMS } from "@/config/adminNavigation";

const sidebarVariants: Variants = {
  expanded: {
    width: "240px",
    transition: { duration: 0.25, ease: "easeInOut" },
  },
  collapsed: {
    width: "64px",
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

export function AdminSidebar(): React.JSX.Element {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="expanded"
      animate={collapsed ? "collapsed" : "expanded"}
      className="relative hidden h-screen flex-col border-r lg:flex"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
        minWidth: collapsed ? "64px" : "240px",
      }}
    >
      {/* Logo */}
      <div
        className="flex h-16 items-center border-b px-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <AnimatePresence mode="wait">
          {collapsed ? (
            <motion.div
              key="collapsed-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                href="/admin"
                aria-label="Admin dashboard"
                className="flex h-8 w-8 items-center justify-center rounded-md"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <span
                  className="text-sm font-black"
                  style={{ color: "var(--color-bg)" }}
                >
                  B
                </span>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="expanded-logo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Logo />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav
        className="flex-1 overflow-y-auto px-2 py-4"
        aria-label="Admin navigation"
      >
        <ul className="space-y-0.5" role="list">
          {ADMIN_NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <AdminNavLink {...item} collapsed={collapsed} />
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
          showLabel={!collapsed}
          variant="ghost"
          className="w-full justify-start gap-3 text-sm"
        />
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border shadow-sm transition-colors"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-muted)",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </motion.aside>
  );
}