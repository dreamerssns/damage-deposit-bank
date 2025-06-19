// app/houses/[id]/edit/page.tsx
"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface EditHousePageProps {
  params: Promise<{ id: string }>;
}

type FormState = {
  name: string;
  description: string;
  address: string;
  city: string;
  image: string;
};

export default function EditHousePage({ params }: EditHousePageProps) {
  const { id: houseId } = use(params);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    address: "",
    city: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
      return;
    }
    fetch(`/api/houses/${houseId}`)
      .then((res) => {
        if (!res.ok) throw new Error("House not found");
        return res.json();
      })
      .then((data) => {
        setForm({
          name: data.name || "",
          description: data.description || "",
          address: data.address || "",
          city: data.city || "",
          image: data.image || "",
        });
      })
      .catch((err) => {
        console.error(err);
        // router.replace("/404")
      })
      .finally(() => setLoading(false));
  }, [session, status, houseId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/houses/${houseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push(`/houses/${houseId}`);
    else alert("Failed to update house");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit House</h1>

      <label className="block mb-2">
        <span className="block text-sm font-medium">Name</span>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        <span className="block text-sm font-medium">Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        <span className="block text-sm font-medium">Address</span>
        <input
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        <span className="block text-sm font-medium">City</span>
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-medium">Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="w-full"
        />
      </label>
      {form.image && (
        <div className="mb-4">
          <Image
            src={form.image}
            alt="Preview"
            width={320}
            height={160}
            className="object-cover"
            style={{ maxHeight: "10rem", width: "auto" }}
            unoptimized
          />
        </div>
      )}

      <button type="submit" className="btn-primary">
        Save Changes
      </button>
    </form>
  );
}
