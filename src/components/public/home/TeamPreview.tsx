"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils/cn";

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface TeamMemberPreviewItem {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatarUrl: string | null;
  specialties: string[];
}

/* ── Animation ───────────────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ── BarberCard ──────────────────────────────────────────────────────────── */

interface BarberCardProps {
  member: TeamMemberPreviewItem;
}

function BarberCard({ member }: BarberCardProps): React.JSX.Element {
  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "group relative overflow-hidden rounded-xl border",
        "transition-all duration-300 hover:border-[var(--color-accent)]/40",
      )}
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Avatar */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: "3 / 4" }}
      >
        {member.avatarUrl !== null ? (
          <Image
            src={member.avatarUrl}
            alt={member.name}
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
              className="text-5xl font-black"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-border)",
              }}
            >
              {member.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, var(--color-surface) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {member.name}
        </h3>

        {member.bio !== null && member.bio.length > 0 && (
          <p
            className="mt-1.5 line-clamp-2 text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {member.bio}
          </p>
        )}

        {/* Specialties */}
        {member.specialties.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {member.specialties.slice(0, 3).map((specialty) => (
              <span
                key={specialty}
                className="rounded-full px-2.5 py-0.5 text-xs"
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

        {/* Book CTA */}
        <Link
          href={`/booking?barber=${member.id}`}
          className={cn(
            "mt-5 flex w-full items-center justify-center gap-2 rounded-lg border py-2.5",
            "text-sm font-semibold transition-all duration-200",
            "hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
          )}
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
          aria-label={`Book with ${member.name}`}
        >
          Book with {member.name.split(" ")[0]}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── TeamPreview ─────────────────────────────────────────────────────────── */

interface Props {
  members: TeamMemberPreviewItem[];
}

export function TeamPreview({ members }: Props): React.JSX.Element {
  if (members.length === 0) return <></>;

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="team-heading"
    >
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeader
          eyebrow="The crew"
          heading="Meet Our Barbers"
          description="Master craftsmen dedicated to making you look your best."
          className="mb-0"
        />

        <Link
          href="/team"
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
          style={{ color: "var(--color-accent)" }}
        >
          Meet the full team
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {members.slice(0, 3).map((member) => (
          <BarberCard key={member.id} member={member} />
        ))}
      </motion.div>
    </section>
  );
}