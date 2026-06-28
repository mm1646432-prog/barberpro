"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Lightbox } from "@/components/public/gallery/Lightbox";
import type { LightboxPhoto } from "@/components/public/gallery/Lightbox";
import { cn } from "@/lib/utils/cn";

/* ── Types ───────────────────────────────────────────────────────────────── */

export type GalleryPhotoItem = LightboxPhoto;

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
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3"
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
              )}
              style={{
                aspectRatio: "1 / 1",
                borderColor: "var(--color-border)",
              }}
              aria-label={
                photo.caption !== null && photo.caption.length > 0
                  ? `Open photo: ${photo.caption}`
                  : `Open photo ${index + 1}`
              }
            >
              <Image
                src={photo.publicUrl}
                alt={photo.caption ?? `Gallery photo ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 384px"
              />

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

      <Lightbox
        photos={preview}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevPhoto}
        onNext={nextPhoto}
      />
    </>
  );
}