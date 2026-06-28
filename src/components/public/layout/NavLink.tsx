"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { NavLink as NavLinkType } from "@/types/navigation";

interface Props extends NavLinkType {
  onClick?: () => void;
  mobile?: boolean;
}

/**
 * A single navigation link — highlights when the current path matches.
 * Used in both desktop and mobile menus.
 */
export function NavLink({
  label,
  href,
  onClick,
  mobile = false,
}: Props): React.JSX.Element {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "block w-full px-4 py-3 text-base font-medium rounded-md transition-colors",
          isActive
            ? "text-accent bg-surface-raised"
            : "text-text-secondary hover:text-text-primary hover:bg-surface-raised",
        )}
        style={
          isActive
            ? { color: "var(--color-accent)" }
            : undefined
        }
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className="relative text-sm font-medium transition-colors group"
      style={{
        color: isActive
          ? "var(--color-text-primary)"
          : "var(--color-text-secondary)",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      {/* Animated underline */}
      <span
        className={cn(
          "absolute -bottom-0.5 left-0 h-px transition-all duration-200",
          isActive ? "w-full" : "w-0 group-hover:w-full",
        )}
        style={{ backgroundColor: "var(--color-accent)" }}
        aria-hidden="true"
      />
    </Link>
  );
}