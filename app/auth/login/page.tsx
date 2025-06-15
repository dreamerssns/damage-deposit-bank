"use client";
// -----------------------------
// app/auth/login/page.tsx
// -----------------------------
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
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
        Sign In
      </button>
      <p className="mt-4 text-center">
        <a href="/auth/forgot-password" className="text-sm text-blue-600">
          Forgot Password?
        </a>
      </p>
      <p className="mt-2 text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/auth/register" className="text-blue-600">
          Register
        </a>
      </p>
    </form>
  );
}
