import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BarberPro — Coming Soon",
};

/**
 * Temporary placeholder home page.
 * Replaced in Phase 4 with the full public-facing marketing site.
 */
export default function HomePage(): React.JSX.Element {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8">
      {/* Razor gold hairline */}
      <div
        className="h-px w-32"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        }}
      />

      <div className="text-center">
        <p
          className="mb-2 text-sm tracking-[0.2em] uppercase"
          style={{ color: "var(--color-accent)" }}
        >
          BarberPro
        </p>
        <h1
          className="text-4xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Foundation Ready
        </h1>
        <p
          className="mt-3 text-base"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Phase 1 complete. Building Phase 2 next.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {[
          "Next.js 16",
          "React 19",
          "TypeScript",
          "Tailwind v4",
          "Supabase",
          "shadcn/ui",
        ].map((tech) => (
          <span
            key={tech}
            className="rounded-full border px-3 py-1 text-xs"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-secondary)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Razor gold hairline */}
      <div
        className="h-px w-32"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
        }}
      />
    </main>
  );
}