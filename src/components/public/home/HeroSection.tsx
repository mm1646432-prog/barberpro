"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, CalendarDays, Star } from "lucide-react";
import { BOOKING_CTA } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";

/* ─────────────────────────────────────────────────────────────────────────────
   Animation variants
───────────────────────────────────────────────────────────────────────────── */

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Decorative background
───────────────────────────────────────────────────────────────────────────── */

function HeroBackground(): React.JSX.Element {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full opacity-[0.07] blur-3xl"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-accent) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg))",
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Image placeholder
───────────────────────────────────────────────────────────────────────────── */

function HeroImagePlaceholder(): React.JSX.Element {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-30 blur-sm"
        style={{
          background:
            "linear-gradient(135deg, var(--color-accent), transparent 60%)",
        }}
      />
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          aspectRatio: "4 / 5",
        }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 0, transparent 50%)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full border-2"
            style={{
              borderColor: "var(--color-accent)",
              backgroundColor:
                "color-mix(in srgb, var(--color-accent) 10%, transparent)",
            }}
          >
            <CalendarDays
              className="h-9 w-9"
              style={{ color: "var(--color-accent)" }}
            />
          </div>
          <p
            className="text-center text-sm font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            Hero image goes here
          </p>
        </div>
        <div
          className="absolute right-0 top-0 h-24 w-24 opacity-20"
          style={{
            background:
              "radial-gradient(circle at top right, var(--color-accent), transparent 70%)",
          }}
        />
      </div>

      {/* Floating badge — reviews */}
      <div
        className="absolute -bottom-4 -left-4 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-surface-raised) 90%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        <div className="flex items-center gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              className="h-3 w-3 fill-current"
              style={{ color: "var(--color-accent)" }}
            />
          ))}
        </div>
        <div>
          <p
            className="text-xs font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            5.0 rating
          </p>
          <p
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            200+ reviews
          </p>
        </div>
      </div>

      {/* Floating badge — availability */}
      <div
        className="absolute -right-4 -top-4 flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--color-surface-raised) 90%, transparent)",
          borderColor: "var(--color-border)",
        }}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ backgroundColor: "var(--color-success)" }}
          />
          <span
            className="relative inline-flex h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: "var(--color-success)" }}
          />
        </span>
        <p
          className="text-xs font-semibold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Slots available today
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────────────────────────────────────── */

export function HeroSection(): React.JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const initial = shouldReduceMotion ? "visible" : "hidden";
  const animate = "visible";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100vh-72px)] overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
      aria-label="Hero"
    >
      <HeroBackground />

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-7xl flex-col items-center justify-center px-4 py-20 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-32">

        {/* ── Left: Text content ──────────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left">

          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5"
            style={{
              borderColor:
                "color-mix(in srgb, var(--color-accent) 40%, transparent)",
              backgroundColor:
                "color-mix(in srgb, var(--color-accent) 8%, transparent)",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent)" }}
            />
            <span
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: "var(--color-accent)" }}
            >
              Premium Barbershop
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="mb-6 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span style={{ color: "var(--color-text-primary)" }}>
              Sharp cuts.
            </span>
            <br />
            <span style={{ color: "var(--color-text-primary)" }}>
              Clean lines.
            </span>
            <br />
            <span
              className="relative inline-block"
              style={{ color: "var(--color-accent)" }}
            >
              Every time.
              <motion.span
                variants={fadeIn}
                initial={initial}
                animate={animate}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
                className="absolute -bottom-1 left-0 h-0.5 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-accent), transparent)",
                }}
                aria-hidden="true"
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="mb-10 max-w-lg text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Experience precision grooming from master barbers. Book your
            appointment online in minutes and walk in looking your best.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="flex flex-col items-center gap-4 sm:flex-row lg:items-start"
          >
            <Link
              href={BOOKING_CTA.href}
              className={cn(
                "group inline-flex items-center gap-2 rounded-lg px-7 py-3.5",
                "text-sm font-semibold transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
              )}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              <CalendarDays className="h-4 w-4" />
              {BOOKING_CTA.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/services"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg border px-7 py-3.5",
                "text-sm font-semibold transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
              )}
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
                backgroundColor: "transparent",
              }}
            >
              View Services
            </Link>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            variants={fadeUp}
            initial={initial}
            animate={animate}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
            className="mt-12 flex items-center gap-6"
          >
            {[
              { value: "10+", label: "Years experience" },
              { value: "5k+", label: "Happy clients" },
              { value: "4.9", label: "Average rating" },
            ].map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-6">
                <div>
                  <p
                    className="text-xl font-black"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
                {index < 2 && (
                  <div
                    className="h-8 w-px"
                    style={{ backgroundColor: "var(--color-border)" }}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </motion.div>

        </div>

        {/* ── Right: Image ─────────────────────────────────────────────── */}
        <motion.div
          variants={fadeIn}
          initial={initial}
          animate={animate}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="mt-16 w-full flex-1 lg:mt-0"
        >
          <HeroImagePlaceholder />
        </motion.div>

      </div>
    </section>
  );
}