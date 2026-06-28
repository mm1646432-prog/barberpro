"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { MapPin, Phone, Mail, Clock, CalendarDays } from "lucide-react";
import Link from "next/link";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils/cn";
import { getDayName } from "@/lib/utils/dates";

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface ShopHoursItem {
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

export interface BusinessInfoData {
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  email: string | null;
  mapsEmbed: string | null;
  shopHours: ShopHoursItem[];
}

/* ── Animation ───────────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

/* ── HoursRow ────────────────────────────────────────────────────────────── */

function HoursRow({ hours }: { hours: ShopHoursItem }): React.JSX.Element {
  const today = new Date().getDay();
  const isToday = hours.dayOfWeek === today;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-sm",
      )}
      style={{
        backgroundColor: isToday
          ? "color-mix(in srgb, var(--color-accent) 8%, transparent)"
          : "transparent",
      }}
    >
      <span
        className="font-medium"
        style={{
          color: isToday
            ? "var(--color-accent)"
            : "var(--color-text-secondary)",
        }}
      >
        {getDayName(hours.dayOfWeek)}
        {isToday && (
          <span className="ml-2 text-xs opacity-70">(today)</span>
        )}
      </span>

      <span
        style={{
          color: hours.isClosed
            ? "var(--color-text-muted)"
            : "var(--color-text-primary)",
        }}
      >
        {hours.isClosed
          ? "Closed"
          : `${hours.openTime ?? ""} – ${hours.closeTime ?? ""}`}
      </span>
    </div>
  );
}

/* ── ContactItem ─────────────────────────────────────────────────────────── */

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}

function ContactItem({
  icon,
  label,
  value,
  href,
}: ContactItemProps): React.JSX.Element {
  const content = (
    <div className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-accent) 10%, transparent)",
          color: "var(--color-accent)",
        }}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div>
        <p
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {label}
        </p>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {value}
        </p>
      </div>
    </div>
  );

  if (href !== undefined) {
  return (
    <a
      href={href}
      className="block transition-opacity duration-200 hover:opacity-80"
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

  return <div>{content}</div>;
}

/* ── BusinessInfo ────────────────────────────────────────────────────────── */

interface Props {
  data: BusinessInfoData;
}

export function BusinessInfo({ data }: Props): React.JSX.Element {
  const sortedHours = [...data.shopHours].sort(
    (a, b) => a.dayOfWeek - b.dayOfWeek,
  );

  const fullAddress =
    [data.address, data.city].filter(Boolean).join(", ");

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
      aria-labelledby="location-heading"
    >
      <SectionHeader
        eyebrow="Find us"
        heading="Location & Hours"
        description="Walk-ins welcome, but booking ahead guarantees your spot."
        centered
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        {/* Contact details */}
        <motion.div
          variants={fadeUp}
          className="space-y-4 rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="mb-5 text-base font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Contact
          </h3>

          <div className="space-y-4">
            {fullAddress.length > 0 && (
              <ContactItem
                icon={<MapPin className="h-4 w-4" />}
                label="Address"
                value={fullAddress}
                href={
                  data.mapsEmbed !== null
                    ? data.mapsEmbed
                    : `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`
                }
              />
            )}

            {data.phone !== null && (
              <ContactItem
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={data.phone}
                href={`tel:${data.phone}`}
              />
            )}

            {data.email !== null && (
              <ContactItem
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={data.email}
                href={`mailto:${data.email}`}
              />
            )}
          </div>

          {/* Book CTA */}
          <div className="pt-4">
            <Link
              href="/booking"
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg py-3",
                "text-sm font-semibold transition-colors duration-200",
              )}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              <CalendarDays className="h-4 w-4" />
              Book an Appointment
            </Link>
          </div>
        </motion.div>

        {/* Opening hours */}
        <motion.div
          variants={fadeUp}
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <h3
            className="mb-5 flex items-center gap-2 text-base font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            <Clock
              className="h-4 w-4"
              style={{ color: "var(--color-accent)" }}
              aria-hidden="true"
            />
            Opening Hours
          </h3>

          <div className="space-y-1">
            {sortedHours.length > 0 ? (
              sortedHours.map((hours) => (
                <HoursRow key={hours.dayOfWeek} hours={hours} />
              ))
            ) : (
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Hours not available.
              </p>
            )}
          </div>
        </motion.div>

        {/* Map embed or placeholder */}
        <motion.div
          variants={fadeUp}
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          {data.mapsEmbed !== null && data.mapsEmbed.length > 0 ? (
            <iframe
              src={data.mapsEmbed}
              title={`${data.name} location map`}
              className="h-full min-h-[300px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0 }}
            />
          ) : (
            <div
              className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <MapPin
                className="h-10 w-10"
                style={{ color: "var(--color-border)" }}
                aria-hidden="true"
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {fullAddress.length > 0 ? fullAddress : "Address not set"}
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}