// app/api/subjects/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/utils/db";
import SubjectModel from "@/models/Subject";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!["landlord", "renter", "admin"].includes(session.user.role!))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { houseId, title } = await request.json();
  await connectDB();

  const subject = new SubjectModel({
    house: houseId,
    title,
    messages: [],
  });
  await subject.save();

  return NextResponse.json(subject);
}
