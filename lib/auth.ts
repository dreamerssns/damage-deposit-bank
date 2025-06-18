// lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../utils/db";
import UserModel, { IUser } from "../models/UserModel";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "renter" | "landlord" | "admin";
      email?: string | null;
      firstName?: string | null;
      lastName?: string | null;
    };
  }
  interface User {
    id: string;
    role: "renter" | "landlord" | "admin";
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "renter" | "landlord" | "admin";
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
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
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // on first sign in, `user` is defined
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as typeof session.user.role;
      session.user.firstName = token.firstName as string;
      session.user.lastName = token.lastName as string;
      session.user.email = token.email as string | undefined;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/onboard",
  },
};

export default NextAuth(authOptions);
