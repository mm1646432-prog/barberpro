import type { Metadata } from "next";
import { HeroSection } from "@/components/public/home/HeroSection";

export const metadata: Metadata = {
  title: "BarberPro — Premium Barber Shop",
  description:
    "Book your next haircut online. Browse our services, meet our team, and secure your appointment in minutes.",
};

export default function HomePage(): React.JSX.Element {
  return (
    <>
      <HeroSection />
    </>
  );
}