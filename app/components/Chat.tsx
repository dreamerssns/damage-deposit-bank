"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IMessage as Msg } from "@/models/Subject";
import { IUser } from "@/models/UserModel";

// Chat component
export default function Chat({
  subjectId,
  initialMessages,
  title,
}: {
  subjectId: string;
  title: string;
  initialMessages: Msg[];
}) {
  const { data: session } = useSession();

  // Messages state
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Helper to convert File to base64
  const toBase64 = (f: File) =>
    new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(f);
    });

  // Send message handler
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageBase64: string | undefined;
    if (file) {
      imageBase64 = await toBase64(file);
    }

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectId: subjectId.toString(),
        content: text,
        image: imageBase64,
      }),
    });

    if (res.ok) {
      const newMsg: Msg = await res.json();
      // Validate previous state before appending
      setMessages((prev) => {
        if (Array.isArray(prev)) {
          return [...prev, newMsg];
        }
        return [newMsg];
      });
      setText("");
      setFile(null);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Display subject title (fallback to passed-in title) */}
      <h2 className="text-2xl font-semibold mb-4">{title || "Subject"}</h2>

      {/* Messages list */}
      <div className="border p-4 mb-4 space-y-4 overflow-y-auto max-h-[400px]">
        {!messages && (
          <div className="text-center text-gray-500">No messages yet</div>
        )}

        {messages &&
          messages.map((msg) => {
            const {
              _id: messageId,
              approved,
              content,
              createdAt,
              image,
              sender: senderData,
            } = msg;
            const sender: IUser = senderData as IUser;
            return (
              <div
                key={messageId?.toString()}
                className="flex items-start gap-3"
              >
                <Image
                  src={
                    typeof sender === "object" &&
                    sender !== null &&
                    "avatarUrl" in sender &&
                    sender.avatarUrl
                      ? (sender.avatarUrl as string)
                      : "/avatar-placeholder.png"
                  }
                  alt={
                    typeof sender === "object" &&
                    sender !== null &&
                    "firstName" in sender &&
                    sender.firstName
                      ? (sender.firstName as string)
                      : "User Avatar"
                  }
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />

                <div>
                  <p className="text-sm font-medium">
                    {`${sender.firstName} ${sender.lastName}`} -{" "}
                    <span
                      className={`${
                        sender.role === "admin" ? "bg-green-100" : "bg-gray-100"
                      } inline-block rounded-full px-2 text-xs font-medium`}
                    >
                      {`${sender.role}`}
                    </span>
                  </p>
                  {content && <p>{content}</p>}
                  {image && (
                    <Image
                      src={image}
                      alt="upload"
                      width={240}
                      height={240}
                      className="mt-2 max-h-60 rounded"
                    />
                  )}
                  {approved && (
                    <span className="text-green-500 text-xs">
                      Approved by admin
                    </span>
                  )}
                  <p className="text-xs text-gray-500">
                    {new Date(createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
      </div>

      {/* Message input */}
      {session && (
        <form onSubmit={handleSend} className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            type="submit"
            disabled={!text && !file}
            className="btn-primary"
          >
            Send
          </button>
        </form>
      )}
    </div>
  );
}
