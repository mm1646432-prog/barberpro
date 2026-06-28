import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/common/SectionHeader";
import { TeamPreview } from "@/components/public/home/TeamPreview";
import type { TeamMemberPreviewItem } from "@/components/public/home/TeamPreview";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the barbers behind the craft. Experienced, passionate, and dedicated to making you look your best.",
};

async function getTeam(): Promise<TeamMemberPreviewItem[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("employees")
    .select("id, name, slug, bio, avatar_url, specialties")
    .eq("is_active", true)
    .order("display_order");

  return (data ?? []).map((e) => ({
    id: e.id,
    name: e.name,
    slug: e.slug,
    bio: e.bio,
    avatarUrl: e.avatar_url,
    specialties: (e.specialties as string[] | null) ?? [],
  }));
}

export default async function TeamPage(): Promise<React.JSX.Element> {
  const members = await getTeam();

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="The crew"
        heading="Meet Our Barbers"
        description="Master craftsmen dedicated to precision grooming and a great experience every visit."
      />

      {members.length > 0 ? (
        <TeamPreview members={members} />
      ) : (
        <p
          className="text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Team information coming soon.
        </p>
      )}
    </div>
  );
}