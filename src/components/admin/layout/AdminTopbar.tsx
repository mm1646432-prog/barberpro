"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/config/adminNavigation";

interface Props {
  onMobileMenuOpen: () => void;
}

export function AdminTopbar({ onMobileMenuOpen }: Props): React.JSX.Element {
  const pathname = usePathname();

  const currentItem = ADMIN_NAV_ITEMS.find((item) =>
    item.href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(item.href),
  );

  const pageTitle = currentItem?.label ?? "Admin";

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Left: mobile menu button + page title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuOpen}
          className="flex h-9 w-9 items-center justify-center rounded-lg border transition-colors lg:hidden"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
          aria-label="Open navigation menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <h1
          className="text-base font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {pageTitle}
        </h1>
      </div>

          {/* Right: view public site link */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-medium transition-colors"
        style={{ color: "var(--color-text-muted)" }}
      >
        View site ↗
      </a>
    </header>
  );
}