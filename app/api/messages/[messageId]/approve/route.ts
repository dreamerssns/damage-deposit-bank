// app/api/messages/[messageId]/approve/route.ts

import SubjectModel from "@/models/Subject";
import connectDB from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";

interface PatchProps {
  params: Promise<{ messageId: string }>;
}

export async function PATCH(req: NextRequest, { params }: PatchProps) {
  const { messageId } = await params;

  try {
    await connectDB();

    // Find the subject containing this message and set approved = true
    const subject = await SubjectModel.findOneAndUpdate(
      { "messages._id": messageId },
      { $set: { "messages.$.approved": true } },
      { new: true }
    );

    if (!subject) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Pull out and return the updated subdocument
    const updatedMessage = subject.messages.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (msg: any) => msg._id && msg._id.toString() === messageId
    );
    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Error approving message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
