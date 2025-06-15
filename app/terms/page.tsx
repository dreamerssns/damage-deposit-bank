// app/terms/page.tsx
import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="flex-grow container mx-auto px-6 py-12">
      <h1 className="text-4xl font-heading text-navy mb-6">Terms of Service</h1>
      <p className="text-gray-700 mb-4">
        Welcome to Damage Deposit Bank. By using our service, you agree to these
        terms…
      </p>
      <h2 className="text-2xl font-semibold text-navy mt-8 mb-4">
        1. Account Terms
      </h2>
      <p className="text-gray-700 mb-4">
        You must be 18 years or older to use this service. You are responsible
        for all activity on your account…
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
