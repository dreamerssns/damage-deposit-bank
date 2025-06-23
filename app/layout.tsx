/*************  ✨ Windsurf Command 🌟  *************/
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
      <head>
        <meta
          name="google-site-verification"
          content="hn3wx3-wjl04-EJYlM95lDkk6JyByIjPOn_0JC6jQZM"
        />
      </head>
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

/*******  77320114-6e3b-4e7e-b459-b7a2c2f51455  *******/
