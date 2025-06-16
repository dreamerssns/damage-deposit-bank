// app/page.tsx
import Link from "next/link";
import { FaShieldAlt, FaMoneyBillWave, FaComments } from "react-icons/fa";

export default function Home() {
  return (
    <>
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
              href="/auth/register"
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
                Reliable Moderation
              </h3>
              <p className="text-gray-600">
                Our moderation team ensures each e-transfer deposit is
                validated.
              </p>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <FaMoneyBillWave className="text-secondary text-5xl mb-4" />
              <h3 className="text-xl font-heading text-navy mb-2">
                Easy Deposits
              </h3>
              <p className="text-gray-600">
                Upload your e-transfer proof in seconds and get confirmation by
                the moderator in minutes.
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
    </>
  );
}
