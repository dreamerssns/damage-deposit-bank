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
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email, password, firstName, lastName, avatar, role } = req.body;
  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({
      error:
        "Missing required fields: email, password, firstName, lastName, role",
    });
  }

  await connectDB();

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      email,
      passwordHash,
      firstName,
      lastName,
      avatarUrl: avatar,
      role,
    });

    return res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
