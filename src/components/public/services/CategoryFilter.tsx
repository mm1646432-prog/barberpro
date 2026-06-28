"use client";

import { cn } from "@/lib/utils/cn";

interface Props {
  categories: string[];
  active: string;
  onChange: (category: string) => void;
}

const ALL_LABEL = "All";

export function CategoryFilter({
  categories,
  active,
  onChange,
}: Props): React.JSX.Element {
  const tabs = [ALL_LABEL, ...categories];

  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="Filter services by category"
    >
      {tabs.map((tab) => {
        const isActive = tab === active;

        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium",
              "transition-all duration-200",
            )}
            style={{
              backgroundColor: isActive
                ? "var(--color-accent)"
                : "transparent",
              borderColor: isActive
                ? "var(--color-accent)"
                : "var(--color-border)",
              color: isActive
                ? "var(--color-bg)"
                : "var(--color-text-secondary)",
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}