// app/api/subjects/[subjectId]/send-all-messages/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/utils/db";
import SubjectModel from "@/models/Subject";
import nodemailer from "nodemailer";

interface PostProps {
  params: Promise<{ subjectId: string }>;
}

export async function POST(request: Request, { params }: PostProps) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { subjectId } = await params;
  const subject = await SubjectModel.findById(subjectId).populate(
    "messages.sender",
    "name email"
  );
  if (!subject)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  let bodyText = `Conversation for "${subject.title}":\n\n`;
  interface Sender {
    name: string;
    email: string;
  }

  interface Message {
    sender: Sender;
    createdAt: Date;
    content?: string;
    image?: string;
  }

  interface Subject {
    title: string;
    messages: Message[];
  }

  const subjectTyped = subject as unknown as Subject;

  subjectTyped.messages.forEach((msg: Message) => {
    bodyText += `${msg.sender.name} <${
      msg.sender.email
    }> [${msg.createdAt.toLocaleString()}]:\n`;
    if (msg.content) bodyText += `${msg.content}\n`;
    if (msg.image) bodyText += `[Image attached as Base64]\n`;
    bodyText += `\n`;
  });

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
    subject: `Full conversation: "${subject.title}"`,
    text: bodyText,
  });

  return NextResponse.json({ message: "Email sent" });
}
