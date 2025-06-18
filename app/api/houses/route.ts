// app/api/houses/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import HouseModel from "@/models/House";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const houses = await HouseModel.find({ isPublished: true }).lean();
  return NextResponse.json(houses);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();
  await connectDB();
  const house = await HouseModel.create({
    ...data,
    landlord: session.user.id,
    isPublished: true,
  });
  return NextResponse.json(house);
}
