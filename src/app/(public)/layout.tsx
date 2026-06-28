import { Navbar } from "@/components/public/layout/Navbar";
import { Footer } from "@/components/public/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1 pt-[72px]" id="main-content">
        {children}
      </main>

      {/* <Footer /> */}
    </div>
  );
}