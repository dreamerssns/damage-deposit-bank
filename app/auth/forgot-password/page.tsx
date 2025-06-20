// app/auth/forgot-password/page.tsx
"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setMessage("If that email exists, a reset link has been sent.");
      }
    } catch {
      setError("Network error.");
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

      {message ? (
        <p className="text-green-600">{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-4 p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full py-2 bg-primary text-white rounded"
          >
            Send Reset Link
          </button>
        </form>
      )}

      <p className="mt-4 text-center">
        <a href="/auth/login" className="text-blue-600">
          Back to Login
        </a>
      </p>
    </div>
  );
}
