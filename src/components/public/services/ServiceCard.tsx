import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils/format";
import { formatDuration } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

export interface ServiceCardProps {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: number;
  category: string | null;
}

export function ServiceCard({
  id,
  name,
  description,
  durationMin,
  price,
  category,
}: ServiceCardProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden",
        "rounded-xl border p-6 transition-all duration-300",
      )}
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Top hover accent */}
      <div
        className="absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="space-y-3">
        {category !== null && category.length > 0 && (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              color: "var(--color-accent)",
            }}
          >
            {category}
          </span>
        )}

        <h3
          className="text-lg font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {name}
        </h3>

        {description !== null && description.length > 0 && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {description}
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="text-xl font-black"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-primary)",
            }}
          >
            {formatPrice(price)}
          </span>

          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Clock className="h-3 w-3" aria-hidden="true" />
            {formatDuration(durationMin)}
          </span>
        </div>

        <Link
          href={`/booking?service=${id}`}
          className="group/link flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
          style={{ color: "var(--color-accent)" }}
          aria-label={`Book ${name}`}
        >
          Book
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}