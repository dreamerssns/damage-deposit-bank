// lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../utils/db";
import UserModel, { IUser } from "../models/UserModel";
import bcrypt from "bcryptjs";

// --- TypeScript augmentation so `session.user.id` & `session.user.role` exist ---
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "renter" | "landlord" | "admin";
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    role: "renter" | "landlord" | "admin";
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "renter" | "landlord" | "admin";
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        // IUser comes from your mongoose model
        const user = (await UserModel.findOne({
          email: credentials.email,
        })) as IUser | null;
        if (!user) return null;
        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );
        if (!isValid) return null;
        // return a minimal user object
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // on first sign in, `user` is defined
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        role: token.role as "renter" | "landlord" | "admin",
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/onboard",
  },
};

export default NextAuth(authOptions);
