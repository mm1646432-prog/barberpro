import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/public/home/HeroSection";
import { ServicesPreview } from "@/components/public/home/ServicesPreview";
import { TeamPreview } from "@/components/public/home/TeamPreview";
import { GalleryPreview } from "@/components/public/home/GalleryPreview";
import { BusinessInfo } from "@/components/public/home/BusinessInfo";
import { SectionDivider } from "@/components/common/SectionDivider";
import type { ServicePreviewItem } from "@/components/public/home/ServicesPreview";
import type { TeamMemberPreviewItem } from "@/components/public/home/TeamPreview";
import type { GalleryPhotoItem } from "@/components/public/home/GalleryPreview";
import type { BusinessInfoData } from "@/components/public/home/BusinessInfo";

export const metadata: Metadata = {
  title: "BarberPro — Premium Barber Shop",
  description:
    "Book your next haircut online. Browse our services, meet our team, and secure your appointment in minutes.",
};

/* ─────────────────────────────────────────────────────────────────────────────
   Data fetching — all queries run in parallel
───────────────────────────────────────────────────────────────────────────── */

async function getHomePageData(): Promise<{
  services: ServicePreviewItem[];
  members: TeamMemberPreviewItem[];
  photos: GalleryPhotoItem[];
  business: BusinessInfoData | null;
}> {
  const supabase = await createClient();

  const [
    { data: servicesData },
    { data: employeesData },
    { data: photosData },
    { data: businessData },
    { data: hoursData },
  ] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, description, duration_min, price, category")
      .eq("is_visible", true)
      .order("display_order")
      .limit(6),

    supabase
      .from("employees")
      .select("id, name, slug, bio, avatar_url, specialties")
      .eq("is_active", true)
      .order("display_order")
      .limit(3),

    supabase
      .from("gallery_photos")
      .select("id, public_url, caption")
      .order("display_order")
      .limit(6),

    supabase
      .from("business_profile")
      .select(
        "name, address, city, phone, email, maps_embed",
      )
      .single(),

    supabase
      .from("shop_hours")
      .select("day_of_week, open_time, close_time, is_closed")
      .order("day_of_week"),
  ]);

  const services: ServicePreviewItem[] = (servicesData ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.description,
    durationMin: s.duration_min,
    price: s.price,
    category: s.category,
  }));

  const members: TeamMemberPreviewItem[] = (employeesData ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    bio: e.bio,
    avatarUrl: e.avatar_url,
    specialties: e.specialties ?? [],
  }));

  const photos: GalleryPhotoItem[] = (photosData ?? []).map((p) => ({
    id: p.id,
    publicUrl: p.public_url,
    caption: p.caption,
  }));

  const business: BusinessInfoData | null =
    businessData !== null
      ? {
          name: businessData.name,
          address: businessData.address,
          city: businessData.city,
          phone: businessData.phone,
          email: businessData.email,
          mapsEmbed: businessData.maps_embed,
          shopHours: (hoursData ?? []).map((h) => ({
            dayOfWeek: h.day_of_week,
            openTime: h.open_time,
            closeTime: h.close_time,
            isClosed: h.is_closed,
          })),
        }
      : null;

  return { services, members, photos, business };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────────────────── */

export default async function HomePage(): Promise<React.JSX.Element> {
  const { services, members, photos, business } = await getHomePageData();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Services ──────────────────────────────────────────────────── */}
      {services.length > 0 && (
        <>
          <SectionDivider />
          <ServicesPreview services={services} />
        </>
      )}

      {/* ── Team ──────────────────────────────────────────────────────── */}
      {members.length > 0 && (
        <>
          <SectionDivider />
          <TeamPreview members={members} />
        </>
      )}

      {/* ── Gallery ───────────────────────────────────────────────────── */}
      {photos.length > 0 && (
        <>
          <SectionDivider />
          <GalleryPreview photos={photos} />
        </>
      )}

      {/* ── Business Info ─────────────────────────────────────────────── */}
      {business !== null && (
        <>
          <SectionDivider />
          <BusinessInfo data={business} />
        </>
      )}
    </>
  );
}