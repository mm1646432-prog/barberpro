"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
/* ── Types ───────────────────────────────────────────────────────────────── */

export interface ServicePreviewItem {
  id: string;
  name: string;
  description: string | null;
  durationMin: number;
  price: number;
  category: string | null;
}

/* ── Animation ───────────────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
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

/* ── ServiceCard ─────────────────────────────────────────────────────────── */

interface ServiceCardProps {
  service: ServicePreviewItem;
}

function ServiceCard({ service }: ServiceCardProps): React.JSX.Element {
  return (
    <motion.div
      variants={cardVariants}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden",
        "rounded-xl border p-6 transition-all duration-300",
        "hover:border-[var(--color-accent)]/40",
      )}
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Top accent line — appears on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="space-y-3">
        {/* Category badge */}
        {service.category !== null && service.category.length > 0 && (
          <span
            className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-accent) 10%, transparent)",
              color: "var(--color-accent)",
            }}
          >
            {service.category}
          </span>
        )}

        {/* Name */}
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          {service.name}
        </h3>

        {/* Description */}
        {service.description !== null && service.description.length > 0 && (
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {service.description}
          </p>
        )}
      </div>

      {/* Footer row */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Price */}
          <span
            className="text-xl font-black"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text-primary)",
            }}
          >
            {formatPrice(service.price)}
          </span>

          {/* Duration */}
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            <Clock className="h-3 w-3" aria-hidden="true" />
{service.durationMin} min          </span>
        </div>

        {/* Book link */}
        <Link
          href={`/booking?service=${service.id}`}
          className="flex items-center gap-1 text-xs font-semibold transition-colors duration-200"
          style={{ color: "var(--color-accent)" }}
          aria-label={`Book ${service.name}`}
        >
          Book
          <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ── ServicesPreview ─────────────────────────────────────────────────────── */

interface Props {
  services: ServicePreviewItem[];
}

export function ServicesPreview({ services }: Props): React.JSX.Element {
  if (services.length === 0) return <></>;

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="services-heading"
    >
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeader
          eyebrow="What we offer"
          heading="Our Services"
          description="Precision cuts and grooming services tailored to your style."
          className="mb-0"
        />

        <Link
          href="/services"
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
          style={{ color: "var(--color-accent)" }}
        >
          View all services
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {services.slice(0, 6).map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </motion.div>
    </section>
  );
}