// app/privacy/page.tsx
import React from "react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="flex-grow container mx-auto px-6 py-12">
      <h1 className="text-4xl font-heading text-navy mb-6">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        Your privacy is important to us. This policy explains how we collect,
        use, and protect your data…
      </p>
      <h2 className="text-2xl font-semibold text-navy mt-8 mb-4">
        Information Collection
      </h2>
      <p className="text-gray-700 mb-4">
        We collect personal information that you provide when registering,
        including name, email, and role…
      </p>
      {/* add more sections as needed */}
      <div className="mt-12">
        <Link href="/">
          <a className="text-primary font-semibold hover:underline">
            ← Back to Home
          </a>
        </Link>
      </div>
    </main>
  );
}
