import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface Props {
  /** Render as a plain div instead of a link (e.g. in the footer) */
  asDiv?: boolean;
  className?: string;
}

/**
 * BarberPro wordmark logo.
 *
 * Uses the Playfair Display typeface (--font-display) and the razor-gold
 * accent colour. The dot after "Pro" is a deliberate design touch.
 *
 * Generic: swap the name via NEXT_PUBLIC_APP_NAME without code changes.
 */
export function Logo({ asDiv = false, className }: Props): React.JSX.Element {
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "BarberPro";

  const content = (
    <span
      className={cn("inline-flex items-baseline gap-0.5 select-none", className)}
    >
      <span
        className="text-xl font-black tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          color: "var(--color-text-primary)",
        }}
      >
        {appName}
      </span>
      <span
        className="text-xl font-black"
        style={{ color: "var(--color-accent)" }}
        aria-hidden="true"
      >
        .
      </span>
    </span>
  );

  if (asDiv) {
    return <div>{content}</div>;
  }

  return (
    <Link href="/" aria-label={`${appName} — Go to homepage`}>
      {content}
    </Link>
  );
}