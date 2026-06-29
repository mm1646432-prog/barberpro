"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { AdminNavItem } from "@/config/adminNavigation";

interface Props extends AdminNavItem {
  collapsed?: boolean;
  onClick?: () => void;
}

export function AdminNavLink({
  label,
  href,
  icon: Icon,
  collapsed = false,
  onClick,
}: Props): React.JSX.Element {
  const pathname = usePathname();

  const isActive =
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={collapsed ? label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5",
        "text-sm font-medium transition-all duration-150",
        collapsed ? "justify-center px-2" : "justify-start",
        isActive
          ? "text-[var(--color-bg)]"
          : "hover:bg-[var(--color-surface-raised)]",
      )}
      style={{
        backgroundColor: isActive ? "var(--color-accent)" : undefined,
        color: isActive
          ? "var(--color-bg)"
          : "var(--color-text-secondary)",
      }}
    >
      <Icon
        className={cn(
          "shrink-0 transition-colors duration-150",
          collapsed ? "h-5 w-5" : "h-4 w-4",
          !isActive && "group-hover:text-[var(--color-text-primary)]",
        )}
        aria-hidden="true"
      />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}