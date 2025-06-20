// app/api/users/[id]/toggleSuper/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/utils/db";
import UserModel from "@/models/UserModel";

interface PostProps {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: PostProps) {
  await connectDB();
  const { id } = await params;
  const { isSuper } = await req.json();

  // TODO: Add authentication and admin check!

  const user = await UserModel.findByIdAndUpdate(
    id,
    { isSuper },
    { new: true }
  );
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ success: true, isSuper: user.isSuper });
}
