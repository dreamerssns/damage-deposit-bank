// app/components/CreateSubjectForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateSubjectForm({ houseId }: { houseId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");

  if (!session || !["landlord", "renter", "admin"].includes(session.user.role!))
    return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ houseId, title }),
    });
    if (res.ok) {
      setTitle("");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New subject title"
        required
        className="flex-grow p-2 border rounded"
      />
      <button type="submit" className="btn-primary">
        Create
      </button>
    </form>
  );
}
