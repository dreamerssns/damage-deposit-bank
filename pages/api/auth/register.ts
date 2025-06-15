// -----------------------------
// pages/api/auth/register.ts
// -----------------------------
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/db";
import UserModel from "../../../models/UserModel";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const { email, password } = req.body;
  await connectDB();
  const existing = await UserModel.findOne({ email });
  if (existing) return res.status(400).json({ error: "User already exists" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ email, passwordHash, role: "renter" });
  return res.status(201).json({ message: "User created", userId: user._id });
}
