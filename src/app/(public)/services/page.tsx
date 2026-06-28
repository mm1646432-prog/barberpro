import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ServicesGrid } from "@/components/public/services/ServicesGrid";
import type { ServiceCardProps } from "@/components/public/services/ServiceCard";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse our full range of grooming services. From classic cuts to precision fades — find the perfect service for you.",
};

async function getServices(): Promise<ServiceCardProps[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select("id, name, description, duration_min, price, category")
    .eq("is_visible", true)
    .order("display_order");

  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    durationMin: s.duration_min,
    price: s.price,
    category: s.category,
  }));
}

export default async function ServicesPage(): Promise<React.JSX.Element> {
  const services = await getServices();

  return (
    <>
      {/* Page header */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What we offer"
          heading="Our Services"
          description="Every service is performed by experienced barbers using premium tools. Choose what suits you and book instantly."
        />
      </div>

      <SectionDivider />

      {/* Services grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {services.length > 0 ? (
          <ServicesGrid services={services} />
        ) : (
          <p
            className="py-12 text-center text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            No services available at the moment. Please check back soon.
          </p>
        )}
      </div>
    </>
  );
}