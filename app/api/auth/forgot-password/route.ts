// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import UserModel from "@/models/UserModel";
import { sendPasswordResetEmail } from "@/utils/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  await connectDB();
  const user = await UserModel.findOne({ email });

  // Always return success so attackers can’t enumerate emails
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1h
    await user.save();
    await sendPasswordResetEmail(email, token);
  }

  return NextResponse.json(
    { message: "If email exists, reset link sent" },
    { status: 200 }
  );
}
