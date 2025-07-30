import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-6 bg-navy text-white">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        <span className="text-sm">
          &copy; {new Date().getFullYear()} Damage Deposit Bank Holder
        </span>
        <nav className="space-x-4 mt-4 md:mt-0">
          <Link
            href="/terms"
            className="text-white hover:text-secondary text-sm"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-white hover:text-secondary text-sm"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
