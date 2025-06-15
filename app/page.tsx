// pages/index.tsx
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaShieldAlt, FaMoneyBillWave, FaComments } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <Head>
        <title>Damage Deposit Bank</title>
        <meta
          name="description"
          content="Secure your rental deposits with Damage Deposit Bank"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            width={48}
            height={48}
            alt="Damage Deposit Bank logo"
          />
          <span className="ml-3 text-2xl font-heading text-navy">
            Damage Deposit Bank
          </span>
        </div>
        <nav className="space-x-6">
          <Link
            href="/login"
            className="text-navy hover:text-primary transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-navy hover:text-primary transition"
          >
            Register
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative flex items-center justify-center h-[80vh] bg-gradient-to-r from-primary to-secondary">
        {/* Shield SVG behind */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-3/4 h-3/4 opacity-10"
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
        <div className="relative z-10 text-center px-4 max-w-xl">
          <h1 className="text-5xl font-heading font-bold text-white mb-4">
            Secure Your Rental Deposits
          </h1>
          <p className="text-lg text-white/90 mb-8">
            Reliable, transparent, and hassle‐free deposit management for
            renters and landlords.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-primary font-semibold rounded-lg shadow-lg hover:shadow-xl transition"
            >
              Get Started
            </Link>
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
              <FaShieldAlt className="text-primary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Secure Vault
              </h3>
              <p className="text-gray-600">
                Multi-layer encryption keeps every deposit locked until
                verified.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <FaMoneyBillWave className="text-secondary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Easy Deposits
              </h3>
              <p className="text-gray-600">
                Upload your e-transfer proof in seconds and track status in real
                time.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <FaComments className="text-primary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                In-App Chat
              </h3>
              <p className="text-gray-600">
                Communicate per house, per subject with renter, landlord, and
                admin all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-navy text-white">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <span className="text-sm">
            &copy; {new Date().getFullYear()} Damage Deposit Bank
          </span>
          <nav className="space-x-4 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-white hover:text-secondary transition text-sm"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-white hover:text-secondary transition text-sm"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
