"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { cn } from "@/lib/utils/cn";

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface GalleryPhotoItem {
  id: string;
  publicUrl: string;
  caption: string | null;
}

/* ── Animation ───────────────────────────────────────────────────────────── */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/* ── Lightbox ────────────────────────────────────────────────────────────── */

interface LightboxProps {
  photos: GalleryPhotoItem[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxProps): React.JSX.Element {
  const photo = photos[currentIndex];

  if (photo === undefined) return <></>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "color-mix(in srgb, var(--color-bg) 92%, transparent)",
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text-secondary)",
        }}
        aria-label="Close lightbox"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Prev */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-secondary)",
          }}
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      {/* Image */}
      <div
        className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ aspectRatio: "4/3" }}
      >
        <Image
          src={photo.publicUrl}
          alt={photo.caption ?? "Gallery photo"}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 896px"
          priority
        />
        {photo.caption !== null && photo.caption.length > 0 && (
          <div
            className="absolute inset-x-0 bottom-0 px-6 py-4"
            style={{
              background:
                "linear-gradient(to top, var(--color-bg), transparent)",
            }}
          >
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-text-primary)" }}
            >
              {photo.caption}
            </p>
          </div>
        )}
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-text-secondary)",
          }}
          aria-label="Next photo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      {/* Counter */}
      <p
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs"
        style={{ color: "var(--color-text-muted)" }}
      >
        {currentIndex + 1} / {photos.length}
      </p>
    </motion.div>
  );
}

/* ── GalleryPreview ──────────────────────────────────────────────────────── */

interface Props {
  photos: GalleryPhotoItem[];
}

export function GalleryPreview({ photos }: Props): React.JSX.Element {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return <></>;

  const preview = photos.slice(0, 6);

  function openLightbox(index: number): void {
    setLightboxIndex(index);
  }

  function closeLightbox(): void {
    setLightboxIndex(null);
  }

  function prevPhoto(): void {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? preview.length - 1 : prev - 1;
    });
  }

  function nextPhoto(): void {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === preview.length - 1 ? 0 : prev + 1;
    });
  }

  return (
    <>
      <section
        className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8"
        aria-labelledby="gallery-heading"
      >
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="Our work"
            heading="The Gallery"
            description="A glimpse of the craft. Every cut tells a story."
            className="mb-0"
          />

          <Link
            href="/gallery"
            className="flex shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
            style={{ color: "var(--color-accent)" }}
          >
            View full gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3"
        >
          {preview.map((photo, index) => (
            <motion.button
              key={photo.id}
              variants={itemVariants}
              type="button"
              onClick={() => openLightbox(index)}
              className={cn(
                "group relative overflow-hidden rounded-xl border",
                "cursor-pointer transition-all duration-300",
                "hover:border-[var(--color-accent)]/50",
                index === 0 && "col-span-2 row-span-2 sm:col-span-1 sm:row-span-1",
              )}
              style={{
                aspectRatio: "1 / 1",
                borderColor: "var(--color-border)",
              }}
              aria-label={`Open photo ${index + 1}${photo.caption !== null ? `: ${photo.caption}` : ""}`}
            >
              <Image
                src={photo.publicUrl}
                alt={photo.caption ?? `Gallery photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 384px"
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "color-mix(in srgb, var(--color-accent) 15%, transparent)",
                }}
                aria-hidden="true"
              />
            </motion.button>
          ))}
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={preview}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>
    </>
  );
}