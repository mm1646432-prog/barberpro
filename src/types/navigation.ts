/**
 * Navigation types — shared across public Navbar and Footer.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  heading: string;
  links: FooterLink[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: "instagram" | "facebook" | "tiktok" | "twitter" | "youtube";
}