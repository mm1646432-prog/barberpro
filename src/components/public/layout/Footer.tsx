import { Logo } from "@/components/common/Logo";import Link from "next/link";
const Instagram = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const Facebook = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Youtube = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.5 6.2A3 3 0 0 0 21.4 4C19.5 3.5 12 3.5 12 3.5S4.5 3.5 2.6 4A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8A3 3 0 0 0 2.6 20C4.5 20.5 12 20.5 12 20.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.2C24 15.9 24 12 24 12s0-3.9-.5-5.8z" />
  </svg>
);

const Twitter = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.2 2.2h3.3l-7.2 8.3 8.5 11.2H16.2l-5.2-6.8-5.9 6.8H1.7l7.7-8.8L1.3 2.2H8l4.7 6.2z" />
  </svg>
);import { FOOTER_SECTIONS, BOOKING_CTA } from "@/config/navigation";
import type { SocialLink } from "@/types/navigation";

/* ── Social icon renderer ────────────────────────────────────────────────── */

interface SocialIconProps {
  icon: SocialLink["icon"];
  className?: string;
}

function SocialIcon({ icon, className }: SocialIconProps): React.JSX.Element {
  const cls = className ?? "h-3.5 w-3.5";

  if (icon === "instagram") {
    return <Instagram className={cls} aria-hidden="true" />;
  }
  if (icon === "facebook") {
    return <Facebook className={cls} aria-hidden="true" />;
  }
  if (icon === "youtube") {
    return <Youtube className={cls} aria-hidden="true" />;
  }
  if (icon === "twitter") {
    return <Twitter className={cls} aria-hidden="true" />;
  }

  /* TikTok — not in Lucide, minimal inline SVG */
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cls}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07Z" />
    </svg>
  );
}

/* ── Footer ──────────────────────────────────────────────────────────────── */

interface FooterProps {
  socialLinks?: SocialLink[];
}

export function Footer({
  socialLinks = [],
}: FooterProps): React.JSX.Element {
  const currentYear = new Date().getFullYear();
  const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "BarberPro";

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <hr className="section-divider" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

          {/* ── Brand column ──────────────────────────────────────────── */}
          <div className="space-y-4 md:col-span-1">
            <Logo asDiv />

            <p
              className="max-w-xs text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Premium grooming services tailored to you. Book your appointment
              online in minutes.
            </p>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.icon}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-8 w-8 items-center justify-center rounded-md border transition-all duration-200 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    style={{
                      borderColor: "var(--color-border)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    <SocialIcon icon={social.icon} className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Navigation sections ───────────────────────────────────── */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.heading} className="space-y-4">
              <h3
                className="text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {section.heading}
              </h3>

              <ul className="space-y-3" role="list">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.external === true ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors duration-150 hover:text-[var(--color-text-primary)]"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-150 hover:text-[var(--color-text-primary)]"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Book CTA column ───────────────────────────────────────── */}
          <div className="space-y-4">
            <h3
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--color-text-muted)" }}
            >
              Ready?
            </h3>

            <Link
              href={BOOKING_CTA.href}
              className="inline-flex items-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors duration-150 hover:bg-[var(--color-accent-hover)]"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              {BOOKING_CTA.label}
            </Link>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────── */}
        <div
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs sm:flex-row"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <p>
            &copy; {currentYear} {appName}. All rights reserved.
          </p>
          <p>
            Built with{" "}
            <span
              aria-hidden="true"
              style={{ color: "var(--color-accent)" }}
            >
              ♦
            </span>{" "}
            for modern barbershops
          </p>
        </div>
      </div>
    </footer>
  );
}