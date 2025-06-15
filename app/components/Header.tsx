"use client";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div>
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" width={48} height={48} alt="Logo" />
          <span className="ml-3 text-2xl font-heading text-navy">
            Damage Deposit Bank
          </span>
        </Link>
      </div>
      <nav className="space-x-6">
        <Link href="/auth/login" className="text-navy hover:text-primary">
          Login
        </Link>
        <Link href="/auth/register" className="text-navy hover:text-primary">
          Register
        </Link>
      </nav>
    </header>
  );
}
