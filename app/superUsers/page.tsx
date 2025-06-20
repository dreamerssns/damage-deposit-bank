// app/superUsers/page.tsx
import React from "react";
import SuperUsersSection from "@/app/components/SuperUsersSection";

export const metadata = {
  title: "Trusted Landlords & Renters",
  description: "Meet our trusted SuperLandlords and SuperRenters.",
};

export default function SuperUsersPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <SuperUsersSection />
    </main>
  );
}
