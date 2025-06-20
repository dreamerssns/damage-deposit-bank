// app/api/houses/[id]/route.ts
import { authOptions } from "@/lib/auth"; // wherever you define your NextAuth options
import HouseModel from "@/models/House";
import "@/models/UserModel";
import connectDB from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface PutProps {
  params: Promise<{ id: string }>;
}
export async function PUT(req: NextRequest, { params }: PutProps) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await connectDB();
  const data = await req.json();
  const { id } = await params;

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

interface GetProps {
  params: Promise<{ id: string }>;
}
export async function GET(req: NextRequest, { params }: GetProps) {
  await connectDB();
  const { id } = await params;
  const house = await HouseModel.findById(id).lean();
  if (!house) {
    return NextResponse.json({ error: "House not found" }, { status: 404 });
  }
  // .lean() still returns BSON types, so stringify
  const serialized = JSON.parse(JSON.stringify(house));
  return NextResponse.json(serialized);
}

interface DeleteProps {
  params: Promise<{ id: string }>;
}
export async function DELETE(req: NextRequest, { params }: DeleteProps) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();
  const { id } = await params;
  await HouseModel.findByIdAndDelete(id);
  return NextResponse.json({ message: "House deleted" });
}
