"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewHousePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    image: "",
  });

  if (session?.user.role !== "admin")
    return <p className="p-6">Unauthorized</p>;
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/houses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) router.push("/houses");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        required
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="address"
        placeholder="Address"
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="city"
        placeholder="City"
        onChange={handleChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="image"
        placeholder="Image URL"
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
      />
      <button type="submit" className="btn-primary">
        Publish
      </button>
    </form>
  );
}
// className =
//   "bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition";
