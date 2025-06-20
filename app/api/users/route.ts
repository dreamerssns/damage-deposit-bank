import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/db";
import UserModel from "@/models/UserModel";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const filter: { role: unknown } = { role: "renter" }; // Default to renters
  if (role) filter.role = role;

  // Exclude admins from results
  filter.role = { $ne: "admin", ...(role ? { $eq: role } : {}) };

  const users = await UserModel.find(filter).select(
    "-password -verificationToken"
  );
  return NextResponse.json(users);
}
