import type { NavLink, FooterSection } from "@/types/navigation";

/**
 * Public navigation configuration.
 *
 * Centralised here so adding a new page requires only one change.
 * Generic enough to work for any service-based business.
 */

export const PUBLIC_NAV_LINKS: NavLink[] = [
  { label: "Services",  href: "/services" },
  { label: "Our Team",  href: "/team"     },
  { label: "Gallery",   href: "/gallery"  },
  { label: "Contact",   href: "/contact"  },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    heading: "Navigate",
    links: [
      { label: "Home",     href: "/"         },
      { label: "Services", href: "/services" },
      { label: "Our Team", href: "/team"     },
      { label: "Gallery",  href: "/gallery"  },
      { label: "Contact",  href: "/contact"  },
    ],
  },
  {
    heading: "Booking",
    links: [
      { label: "Book Appointment", href: "/booking"  },
      { label: "Manage Booking",   href: "/booking/manage" },
    ],
  },
];

/** Primary CTA shown in the Navbar and Hero section */
export const BOOKING_CTA = {
  label: "Book Now",
  href:  "/booking",
} as const;