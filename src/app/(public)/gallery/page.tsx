import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionDivider } from "@/components/common/SectionDivider";
import { GalleryGrid } from "@/components/public/gallery/GalleryGrid";
import type { LightboxPhoto } from "@/components/public/gallery/Lightbox";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our portfolio of cuts and styles. Real work from our barbers — sharp lines, clean fades, and classic cuts.",
};

async function getPhotos(): Promise<LightboxPhoto[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("gallery_photos")
    .select("id, public_url, caption")
    .order("display_order");

  return (data ?? []).map((p) => ({
    id: p.id,
    publicUrl: p.public_url,
    caption: p.caption,
  }));
}

export default async function GalleryPage(): Promise<React.JSX.Element> {
  const photos = await getPhotos();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Our work"
          heading="The Gallery"
          description="A glimpse into the craft. Every cut tells a story — here are some of ours."
          centered
        />
      </div>

      <SectionDivider />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <GalleryGrid photos={photos} />
      </div>
    </>
  );
}