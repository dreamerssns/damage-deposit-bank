// app/not-found.tsx
"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-xl mb-6">
          Oops! We can’t find the page you’re looking for.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
