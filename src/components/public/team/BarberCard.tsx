import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BarberCardProps {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatarUrl: string | null;
  specialties: string[];
}

export function BarberCard({
  id,
  name,
  slug,
  bio,
  avatarUrl,
  specialties,
}: BarberCardProps): React.JSX.Element {
  const initial = name.charAt(0);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border",
        "transition-all duration-300",
      )}
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Top hover accent */}
      <div
        className="absolute inset-x-0 top-0 z-10 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Avatar */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "3 / 4" }}
      >
        {avatarUrl !== null ? (
          <Image
            src={avatarUrl}
            alt={`Photo of ${name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: "var(--color-surface-raised)" }}
          >
            <span
              className="text-6xl font-black"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-border)",
              }}
              aria-hidden="true"
            >
              {initial}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-surface) 0%, transparent 55%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3
          className="text-xl font-bold"
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--color-text-primary)",
          }}
        >
          {name}
        </h3>

        {bio !== null && bio.length > 0 && (
          <p
            className="mt-2 line-clamp-3 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {bio}
          </p>
        )}

        {/* Specialties */}
        {specialties.length > 0 && (
          <div
            className="mt-4 flex flex-wrap gap-1.5"
            aria-label={`Specialties: ${specialties.join(", ")}`}
          >
            {specialties.map((specialty) => (
              <span
                key={specialty}
                className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{
                  backgroundColor: "var(--color-surface-raised)",
                  color: "var(--color-text-muted)",
                }}
              >
                {specialty}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div
          className="my-5 h-px"
          style={{ backgroundColor: "var(--color-border)" }}
          aria-hidden="true"
        />

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href={`/booking?barber=${id}`}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5",
              "text-sm font-semibold transition-all duration-200",
              "hover:opacity-90 active:scale-[0.98]",
            )}
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            Book Appointment
          </Link>

          <Link
            href={`/team/${slug}`}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
              "transition-all duration-200",
              "hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
            )}
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-muted)",
            }}
            aria-label={`View ${name}'s profile`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}