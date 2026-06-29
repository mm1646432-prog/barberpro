import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Scissors,
  Clock,
  Image,
  Building2,
  UserCircle,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
  },
  {
    label: "Employees",
    href: "/admin/employees",
    icon: Users,
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Scissors,
  },
  {
    label: "Hours & Holidays",
    href: "/admin/hours",
    icon: Clock,
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: UserCircle,
  },
  {
    label: "Business Profile",
    href: "/admin/business",
    icon: Building2,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];