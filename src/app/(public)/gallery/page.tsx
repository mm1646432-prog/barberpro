import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/common/SectionHeader";
import { GalleryPreview } from "@/components/public/home/GalleryPreview";
import type { GalleryPhotoItem } from "@/components/public/home/GalleryPreview";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse our portfolio of cuts and styles. Real work from our barbers — sharp lines, clean fades, and classic cuts.",
};

async function getPhotos(): Promise<GalleryPhotoItem[]> {
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
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Our work"
        heading="The Gallery"
        description="A glimpse into the craft. Every cut tells a story — here are some of ours."
        centered
      />

      {photos.length > 0 ? (
        <GalleryPreview photos={photos} />
      ) : (
        <p
          className="text-center text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Gallery coming soon.
        </p>
      )}
    </div>
  );
}