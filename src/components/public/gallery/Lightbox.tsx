"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxPhoto {
  id: string;
  publicUrl: string;
  caption: string | null;
}

interface Props {
  photos: LightboxPhoto[];
  currentIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export function Lightbox({
  photos,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: Props): React.JSX.Element {
  const isOpen = currentIndex !== null;
  const photo =
    currentIndex !== null ? (photos[currentIndex] ?? null) : null;

  /* ── Keyboard navigation ─────────────────────────────────────────────── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [isOpen, onClose, onPrev, onNext],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Body scroll lock ────────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && photo !== null && (
        <motion.div
          key="lightbox-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-bg) 92%, transparent)",
          }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Close lightbox"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Prev button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-colors duration-200"
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

          {/* Image panel */}
          <motion.div
            key={photo.id}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-4xl overflow-hidden rounded-xl"
            style={{ aspectRatio: "4 / 3" }}
            onClick={(e) => e.stopPropagation()}
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
          </motion.div>

          {/* Next button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border transition-colors duration-200"
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
          {photos.length > 1 && (
            <p
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tabular-nums"
              style={{ color: "var(--color-text-muted)" }}
            >
              {currentIndex !== null ? currentIndex + 1 : 0} / {photos.length}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}