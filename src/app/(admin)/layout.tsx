"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/layout/AdminSidebar";
import { AdminTopbar } from "@/components/admin/layout/AdminTopbar";
import { AdminMobileNav } from "@/components/admin/layout/AdminMobileNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Desktop sidebar */}
      <AdminSidebar />

      {/* Mobile nav */}
      <AdminMobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar onMobileMenuOpen={() => setMobileNavOpen(true)} />

        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6"
          id="admin-main-content"
        >
          {children}
        </main>
      </div>
    </div>
  );
}