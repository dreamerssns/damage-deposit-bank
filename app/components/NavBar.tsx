"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center space-x-6">
      {/* Main links */}
      <div className="hidden md:flex items-center space-x-6">
        <Link href="/" className="text-gray-700 hover:text-primary transition">
          Home
        </Link>
        {isAdmin && (
          <Link
            href="/houses/new"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
          >
            Publish House
          </Link>
        )}
      </div>

      {/* User section */}
      <div className="relative" ref={dropdownRef}>
        {status === "authenticated" && session.user ? (
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <span className="text-gray-700">{session.user.name}</span>
            <span className="text-xs uppercase bg-gray-200 text-gray-600 px-2 py-1 rounded hover:bg-gray-300 cursor-pointer">
              {session.user.role}
            </span>
          </button>
        ) : (
          <Link
            href="/api/auth/signin"
            className="text-gray-700 hover:text-primary transition"
          >
            Login
          </Link>
        )}

        {dropdownOpen && status === "authenticated" && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
            <Link
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </Link>
            <Link
              href="/houses"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Houses
            </Link>
            {isAdmin && (
              <Link
                href="/houses/new"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Publish House
              </Link>
            )}
            <Link
              href="/api/auth/signout"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Logout
            </Link>
          </div>
        )}
      </div>

      {/* Mobile toggle button */}
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              dropdownOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>
    </nav>
  );
}
