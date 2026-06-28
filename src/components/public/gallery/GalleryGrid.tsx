"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Lightbox } from "@/components/public/gallery/Lightbox";
import type { LightboxPhoto } from "@/components/public/gallery/Lightbox";
import { cn } from "@/lib/utils/cn";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

interface Props {
  photos: LightboxPhoto[];
}

export function GalleryGrid({ photos }: Props): React.JSX.Element {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const prevPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? photos.length - 1 : prev - 1;
    });
  }, [photos.length]);

  const nextPhoto = useCallback(() => {
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === photos.length - 1 ? 0 : prev + 1;
    });
  }, [photos.length]);

  if (photos.length === 0) {
    return (
      <p
        className="py-12 text-center text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        Gallery coming soon.
      </p>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="columns-2 gap-3 sm:columns-3 lg:columns-4"
      >
        {photos.map((photo, index) => (
          <motion.button
            key={photo.id}
            variants={itemVariants}
            type="button"
            onClick={() => openLightbox(index)}
            className={cn(
              "group relative mb-3 block w-full overflow-hidden rounded-lg border",
              "cursor-pointer transition-all duration-300",
            )}
            style={{ borderColor: "var(--color-border)" }}
            aria-label={
              photo.caption !== null && photo.caption.length > 0
                ? `Open photo: ${photo.caption}`
                : `Open photo ${index + 1}`
            }
          >
            <div className="relative w-full">
              <Image
                src={photo.publicUrl}
                alt={photo.caption ?? `Gallery photo ${index + 1}`}
                width={600}
                height={800}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "color-mix(in srgb, var(--color-accent) 12%, transparent)",
              }}
              aria-hidden="true"
            />

            {/* Caption overlay */}
            {photo.caption !== null && photo.caption.length > 0 && (
              <div
                className="absolute inset-x-0 bottom-0 translate-y-full px-3 py-2 transition-transform duration-300 group-hover:translate-y-0"
                style={{
                  background:
                    "linear-gradient(to top, var(--color-bg), transparent)",
                }}
              >
                <p
                  className="line-clamp-2 text-xs font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {photo.caption}
                </p>
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>

      <Lightbox
        photos={photos}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevPhoto}
        onNext={nextPhoto}
      />
    </>
  );
}