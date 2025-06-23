// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// initialize NextAuth handler
const nextAuthHandler = NextAuth(authOptions);

// expose it under both GET and POST
export { nextAuthHandler as GET, nextAuthHandler as POST };
