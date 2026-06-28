import { cn } from "@/lib/utils/cn";

interface Props {
  eyebrow?: string;
  heading: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

/**
 * Reusable section heading block.
 * Used in ServicesPreview, TeamPreview, GalleryPreview, etc.
 */
export function SectionHeader({
  eyebrow,
  heading,
  description,
  centered = false,
  className,
}: Props): React.JSX.Element {
  return (
    <div
      className={cn(
        "mb-12 max-w-2xl space-y-4",
        centered && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow !== undefined && eyebrow.length > 0 && (
        <p
          className="text-xs font-semibold uppercase tracking-[0.2em]"
          style={{ color: "var(--color-accent)" }}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className="text-3xl font-black leading-tight tracking-tight sm:text-4xl"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text-primary)",
        }}
      >
        {heading}
      </h2>

      {description !== undefined && description.length > 0 && (
        <p
          className="text-base leading-relaxed sm:text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}