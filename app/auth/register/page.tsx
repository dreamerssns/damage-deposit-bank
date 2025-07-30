// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStep(2);
  }

  function resizeImage(file: File, maxSize = 300): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context is null"));
            return;
          }

          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7); // reduce quality to compress
          resolve(resizedBase64);
        };

        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = reader.result as string;
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function handleRegister(selectedRole: "renter" | "landlord") {
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          avatar,
          role: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setIsSubmitting(false);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Network error – please try again");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-xl font-heading">Damage Deposit Bank Holder</h1>
        </div>
      </header>

      {step === 1 && (
        <main className="flex-grow container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <div className="mb-4 text-sm text-gray-600">
              Step 1 of 2: Create your account
            </div>

            <form onSubmit={handleNext}>
              {error && (
                <p className="text-red-600 mb-4 text-center">{error}</p>
              )}

              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium mb-1"
                >
                  Upload Avatar (optional)
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const resized = await resizeImage(file);
                      setAvatar(resized);
                    } catch (err) {
                      console.error("Image resize failed", err);
                    }
                  }}
                  className="w-full"
                />
                <Image
                  src={avatar || "/avatar-placeholder.png"}
                  alt="Avatar preview"
                  width={80}
                  height={80}
                  className="mt-2 h-20 w-20 object-cover rounded-full border"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary text-white font-semibold rounded transition hover:shadow"
              >
                Continue
              </button>
            </form>
          </div>
        </main>
      )}

      {step === 2 && (
        <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center">
          <div className="max-w-md w-full text-center">
            <div className="mb-4 text-sm text-gray-600">
              Step 2 of 2: Choose your role
            </div>
            <h2 className="text-2xl font-heading mb-2">
              Welcome, {firstName}!
            </h2>
            <p className="text-gray-700 mb-6">
              Are you here as a renter or a landlord?
            </p>
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => handleRegister("renter")}
                disabled={isSubmitting}
                className={`flex-1 py-3 text-white font-semibold rounded-lg shadow transition ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-primary hover:bg-primary-dark"
                }`}
              >
                {isSubmitting ? "Registering…" : "I’m a Renter"}
              </button>
              <button
                onClick={() => handleRegister("landlord")}
                disabled={isSubmitting}
                className={`flex-1 py-3 text-white font-semibold rounded-lg shadow transition ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-secondary hover:bg-secondary-dark"
                }`}
              >
                {isSubmitting ? "Registering…" : "I’m a Landlord"}
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
