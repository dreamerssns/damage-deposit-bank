// app/houses/[houseId]/subjects/[subjectId]/page.tsx
import connectDB from "@/utils/db";
import SubjectModel from "@/models/Subject";
import { serializeDoc } from "@/utils/serializeDoc";
import { notFound } from "next/navigation";
import Chat from "@/app/components/Chat";

import { ISubject } from "@/models/Subject";

export default async function SubjectPage(props: {
  params: { subjectId: string };
}) {
  // ① await the props object…
  const { params } = await props;

  // ② then destructure
  const { subjectId } = params;

  await connectDB();

  const subject = await SubjectModel.findById(subjectId)
    .populate({
      path: "messages.sender",
      select: "firstName lastName avatarUrl role", // only bring back the fields you need
    })
    .lean<
      ISubject & {
        messages: Array<{ sender: { name: string; avatarUrl?: string } }>;
      }
    >();
  if (!subject) notFound();

  const ser = serializeDoc(subject);
  const msgSubjectId = ser._id ? String(subject._id) : "";
  const title = ser.title;
  const messages = ser.messages;

  return (
    <Chat
      subjectId={msgSubjectId.toString()}
      title={title}
      initialMessages={messages}
    />
  );
}
