"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function CreateSubjectForm({ houseId }: { houseId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session || !["landlord", "renter", "admin"].includes(session.user.role!))
    return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ houseId, title }),
      });
      if (res.ok) {
        setTitle("");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
    >
      <fieldset className="flex flex-col gap-3">
        <legend className="text-lg font-semibold text-gray-700 mb-1">
          Create a New Subject for Discussion in this House
        </legend>
        <label htmlFor="subjectTitle" className="text-sm text-gray-600">
          Subject Title
        </label>
        <input
          id="subjectTitle"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter subject title"
          required
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="self-start px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition disabled:opacity-50"
        >
          {loading ? (
            <span className="animate-pulse">Creating...</span>
          ) : (
            "Create a Chat Room"
          )}
        </button>
      </fieldset>
    </form>
  );
}
