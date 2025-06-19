// app/api/houses/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // wherever you define your NextAuth options
import connectDB from "@/utils/db";
import HouseModel from "@/models/House";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const data = await req.json();
  const { id } = params;

  const updated = await HouseModel.findByIdAndUpdate(
    id,
    {
      name: data.name,
      description: data.description,
      address: data.address,
      city: data.city,
      ...(data.image ? { image: data.image } : {}),
    },
    { new: true }
  ).lean();

  if (!updated) {
    return NextResponse.json({ error: "House not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const house = await HouseModel.findById(params.id).lean();
  if (!house) {
    return NextResponse.json({ error: "House not found" }, { status: 404 });
  }
  // .lean() still returns BSON types, so stringify
  const serialized = JSON.parse(JSON.stringify(house));
  return NextResponse.json(serialized);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  await HouseModel.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "House deleted" });
}
