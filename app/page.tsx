"use client";
// app/page.tsx
import Link from "next/link";
import {
  FaStar,
  FaClipboardCheck,
  FaPhoneSlash,
  FaExclamationTriangle,
  FaHome,
  FaAward,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center justify-center h-[80vh] bg-gradient-to-r from-primary to-secondary">
        {/* Shield SVG behind */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-4/5 h-4/5 opacity-10"
            viewBox="0 0 320 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M160 20 L300 80 V180 Q160 300 20 180 V80 Z"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="4"
            />
          </svg>
        </div>
        {/* Content */}
        <div className="relative z-10 text-center px-5 max-w-xl">
          <h1 className="text-5xl font-heading font-bold text-white mb-4">
            Build Trust. Protect Deposits.
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Damage Deposit Bank helps landlords and renters stay transparent,
            organized, and stress-free when it comes to damage deposits.
          </p>
          <div className="flex justify-center space-x-4">
            {status === "authenticated" && session.user ? (
              <Link
                href="/houses"
                className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition hover:bg-primary-dark"
              >
                See Houses
              </Link>
            ) : (
              <Link
                href="/auth/register"
                className="px-6 py-3 bg-white text-primary font-semibold rounded-lg shadow-lg hover:shadow-xl transition"
              >
                Get Started
              </Link>
            )}
            <Link
              href="#features"
              className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-heading text-center text-navy mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center px-4">
              <FaStar className="text-primary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Build Trust
              </h3>
              <p className="text-gray-600">
                Build credibility with your renters by using a verified deposit
                platform.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <FaClipboardCheck className="text-secondary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Track Deposits
              </h3>
              <p className="text-gray-600">
                Keep clear, organized records of each tenant’s damage deposit—no
                more confusion.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <FaPhoneSlash className="text-primary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                End Deposit Anxiety
              </h3>
              <p className="text-gray-600">
                Eliminate repetitive texts and calls from renters wondering
                about their deposit status.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <FaExclamationTriangle className="text-secondary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Report Bad Renters
              </h3>
              <p className="text-gray-600">
                Leave feedback on LTreview.com for renters who cause serious
                damages—publicly visible.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <FaHome className="text-primary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Rent Easier
              </h3>
              <p className="text-gray-600">
                Attract better tenants—renters prefer landlords who use Damage
                Deposit Bank.
              </p>
            </div>

            <div className="flex flex-col items-center text-center px-4">
              <FaAward className="text-secondary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Superlandlord Badge
              </h3>
              <p className="text-gray-600">
                Show you’re a trusted landlord and earn our “Superlandlord”
                designation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
