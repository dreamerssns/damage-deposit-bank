// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
    } else {
      // Move to step 2: choose role
      setStep(2);
    }
  }

  function chooseRole(role: "renter" | "landlord") {
    // TODO: call your onboard/api to save the role, then navigate onward
    // e.g. fetch("/api/auth/onboard", { method:"POST", body: JSON.stringify({ role }) })
    console.log("Selected role:", role);
    router.push("/"); // or wherever comes next
  }

  return (
    <div className="min-h-screen flex flex-col">
      {step === 1 && (
        <main className="flex-grow container mx-auto px-6 py-12">
          <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-heading mb-4">Create your account</h1>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mb-4 p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white rounded"
            >
              Sign Up
            </button>
          </form>
        </main>
      )}

      {step === 2 && (
        <main className="flex-grow container mx-auto px-6 py-12 flex flex-col items-center">
          <h1 className="text-4xl font-heading text-navy mb-6">
            Welcome to Damage Deposit Bank
          </h1>
          <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
            Let’s get started! First, tell us whether you’re here as a renter or
            a landlord.
          </p>
          <div className="flex space-x-6">
            <button
              onClick={() => chooseRole("renter")}
              className="px-8 py-4 bg-primary text-white font-semibold rounded-lg shadow hover:shadow-lg transition"
            >
              I’m a Renter
            </button>
            <button
              onClick={() => chooseRole("landlord")}
              className="px-8 py-4 bg-secondary text-white font-semibold rounded-lg shadow hover:shadow-lg transition"
            >
              I’m a Landlord
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
