import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SectionDivider } from "@/components/common/SectionDivider";
import { TeamGrid } from "@/components/public/team/TeamGrid";
import type { BarberCardProps } from "@/components/public/team/BarberCard";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the barbers behind the craft. Experienced, passionate, and dedicated to making you look your best.",
};

async function getTeam(): Promise<BarberCardProps[]> {
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
    <>
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="The crew"
          heading="Meet Our Barbers"
          description="Master craftsmen dedicated to precision grooming and a great experience every visit. Book directly with the barber of your choice."
        />
      </div>

      <SectionDivider />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TeamGrid members={members} />
      </div>
    </>
  );
}