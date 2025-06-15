// -----------------------------
// pages/api/auth/forgot-password.ts
// -----------------------------
import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "../../../utils/db";
import UserModel from "../../../models/UserModel";
import { sendPasswordResetEmail } from "../../../utils/email";
import crypto from "crypto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end();
  const { email } = req.body;
  await connectDB();
  const user = await UserModel.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({ message: "If email exists, reset link sent" });
  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1h
  await user.save();
  await sendPasswordResetEmail(email, token);
  return res.status(200).json({ message: "If email exists, reset link sent" });
}
