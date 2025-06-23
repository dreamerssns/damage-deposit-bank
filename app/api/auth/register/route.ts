// -----------------------------
// app/api/auth/register/route.ts
// -----------------------------
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import UserModel from "@/models/UserModel";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, password, firstName, lastName, avatar, role } =
    await req.json();

  if (!email || !password || !firstName || !lastName || !role) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: email, password, firstName, lastName, role",
      },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
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

    return NextResponse.json(
      { message: "User created", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
