// app/components/AdminEditLink.tsx
"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AdminEditLink({ houseId }: { houseId: string }) {
  const { data: session } = useSession();

  if (session?.user.role !== "admin") return null;

  return (
    <div className="flex justify-end mb-4">
      <Link
        href={`/houses/${houseId}/edit`}
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Edit
      </Link>
    </div>
  );
}
