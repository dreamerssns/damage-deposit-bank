"use client";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <SessionProvider>
          <Header />
          <main className="flex-grow">{children}</main>
        </SessionProvider>
        <Footer />
      </body>
    </html>
  );
}
