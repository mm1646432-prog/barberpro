import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BookingWizard } from "@/components/public/booking/BookingWizard";
import { SectionHeader } from "@/components/common/SectionHeader";
import type { Service, Employee } from "@/types/booking";

export const metadata: Metadata = {
  title: "Book Appointment",
  description: "Book your next appointment online in minutes.",
  robots: { index: false, follow: true },
};

async function getBookingData(): Promise<{
  services: Service[];
  employees: Employee[];
}> {
  const supabase = await createClient();

  const [{ data: servicesData }, { data: employeesData }] =
    await Promise.all([
      supabase
        .from("services")
        .select(
          "id, name, slug, category, description, duration_min, price, is_visible, display_order",
        )
        .eq("is_visible", true)
        .order("display_order"),

      supabase
        .from("employees")
        .select(
          "id, name, slug, bio, avatar_url, color_tag, specialties, is_active, display_order",
        )
        .eq("is_active", true)
        .order("display_order"),
    ]);

  const services: Service[] = (servicesData ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    category: s.category,
    description: s.description,
    durationMin: s.duration_min,
    price: s.price,
    isVisible: s.is_visible,
    displayOrder: s.display_order,
  }));

  const employees: Employee[] = (employeesData ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    bio: e.bio,
    avatarUrl: e.avatar_url,
    colorTag: e.color_tag,
    specialties: (e.specialties as string[] | null) ?? [],
    isActive: e.is_active,
    displayOrder: e.display_order,
  }));

  return { services, employees };
}

export default async function BookingPage(): Promise<React.JSX.Element> {
  const { services, employees } = await getBookingData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Online booking"
        heading="Book an Appointment"
        description="Choose your service, pick your barber, and secure your slot in minutes."
        className="mb-10"
      />

      <BookingWizard services={services} employees={employees} />
    </div>
  );
}