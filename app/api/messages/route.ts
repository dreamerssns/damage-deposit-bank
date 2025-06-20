// app/api/messages/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/utils/db";
import SubjectModel from "@/models/Subject";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { subjectId, content, image } = await request.json();
  await connectDB();
  const subject = await SubjectModel.findById(subjectId);
  if (!subject)
    return NextResponse.json({ error: "Subject not found" }, { status: 404 });

  const isFirst = subject.messages.length === 0;
  subject.messages.push({
    sender: new mongoose.Types.ObjectId(session.user.id),
    content: content || "",
    image,
    approved: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  await subject.save();

  const savedMsg = subject.messages[subject.messages.length - 1];

  if (isFirst) {
    // send email to admin
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT!),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New conversation started: "${subject.title}"`,
      text: `User ${session.user.email} wrote:\n\n${
        content || "[Image]"
      }\n\nin subject "${subject.title}" at ${process.env.BASE_URL}/houses/${
        subject.house
      }/subjects/${subject.id}.`,
    });
  }

  // Populate sender fields for the response
  const populated = await SubjectModel.populate(savedMsg, {
    path: "sender",
    select: "name avatarUrl email firstName lastName role",
  });

  return NextResponse.json(populated);
}
