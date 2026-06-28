import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BarberPro — Premium Barber Shop",
  description:
    "Book your next haircut online. Browse our services, meet our team, and secure your appointment in minutes.",
};

/**
 * Public home page placeholder.
 * Replaced in Module 4 with the full marketing page.
 */
export default function HomePage(): React.JSX.Element {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p
        className="text-xs font-semibold uppercase tracking-[0.25em]"
        style={{ color: "var(--color-accent)" }}
      >
        Coming Soon
      </p>
      <h1
        className="text-5xl font-black sm:text-6xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Module 4 builds this page
      </h1>
      <p
        className="max-w-md text-base"
        style={{ color: "var(--color-text-secondary)" }}
      >
        The full home page — Hero, Services, Team, Gallery, and Business Info
        — will be built in Module 4.
      </p>
    </section>
  );
}