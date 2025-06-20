// app/houses/[houseId]/subjects/[subjectId]/page.tsx
import connectDB from "@/utils/db";
import SubjectModel from "@/models/Subject";
import "@/models/UserModel";
import { notFound } from "next/navigation";
import Chat from "@/app/components/Chat";
import { ISubject } from "@/models/Subject";

interface SubjectPageProps {
  params: Promise<{ subjectId: string }>;
}

export default async function SubjectPage({ params }: SubjectPageProps) {
  const { subjectId } = await params;
  await connectDB();

  // 1) Grab plain JS objects
  const subject = await SubjectModel.findById(subjectId)
    .populate({
      path: "messages.sender",
      select: "firstName lastName avatarUrl role",
    })
    .lean<
      ISubject & {
        messages: Array<{
          _id: string;
          content: string;
          image?: string;
          approved: boolean;
          createdAt: Date;
          updatedAt: Date;
          sender: {
            _id: string;
            firstName: string;
            lastName: string;
            avatarUrl?: string;
            role: string;
          };
        }>;
      }
    >();

  if (!subject) notFound();

  // 2) Convert everything to POJOs
  const msgSubjectId = subject._id!.toString();
  const cleanedMessages = subject.messages.map((msg) => ({
    _id: msg._id!.toString(),
    content: msg.content,
    image: msg.image || null,
    approved: msg.approved,
    createdAt: msg.createdAt.toISOString(),
    updatedAt: msg.updatedAt.toISOString(),
    sender:
      typeof msg.sender === "object" && "firstName" in msg.sender
        ? {
            _id: msg.sender._id!.toString(),
            firstName: msg.sender.firstName,
            lastName: msg.sender.lastName,
            avatarUrl: msg.sender.avatarUrl || null,
            role: msg.sender.role as "renter" | "landlord" | "admin", // Add type guard here
          }
        : {
            _id: msg.sender.toString(),
            firstName: "",
            lastName: "",
            avatarUrl: null,
            role: "renter" as "renter" | "landlord" | "admin", // Default to a valid role
          },
  }));

  return (
    <Chat
      subjectId={msgSubjectId}
      title={subject.title}
      initialMessages={cleanedMessages}
    />
  );
}
