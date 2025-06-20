"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IUser } from "@/models/UserModel";
import { MessageDTO } from "@/models/Subject";

export default function Chat({
  subjectId,
  initialMessages,
  title,
}: {
  subjectId: string;
  title: string;
  initialMessages: MessageDTO[];
}) {
  const { data: session } = useSession();
  const isAdminUser = session?.user?.role === "admin";

  const [messages, setMessages] = useState<MessageDTO[]>(initialMessages);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toBase64 = (f: File) =>
    new Promise<string>((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(f);
    });
  const handleApprove = async (messageId: string) => {
    try {
      const res = await fetch(`/api/messages/${messageId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error(await res.text());

      // update local copy
      setMessages((prev) =>
        prev.map((m) => (m._id === messageId ? { ...m, approved: true } : m))
      );
    } catch (err) {
      console.error("Approval failed:", err);
      // you could also toast an error here
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    let imageBase64: string | undefined;
    if (file) {
      imageBase64 = await toBase64(file);
    }

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subjectId: subjectId.toString(),
        content: text.trim(),
        image: imageBase64,
      }),
    });

    if (res.ok) {
      const newMsg: MessageDTO = await res.json();
      setMessages((prev) =>
        Array.isArray(prev) ? [...prev, newMsg] : [newMsg]
      );
      setText("");
      setFile(null);
    }
  };

  const noMessages = !messages || messages.length === 0;

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[600px]">
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
        {title || "Subject"}
      </h2>

      {/* Messages container */}
      <div
        className="flex-1 overflow-y-auto mb-4 space-y-4 px-2"
        style={{ scrollBehavior: "smooth" }}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {noMessages && (
          <p className="text-center text-gray-500 italic select-none">
            No messages yet
          </p>
        )}

        {messages.map((msg) => {
          const {
            _id: messageId,
            approved,
            content,
            createdAt,
            image,
            sender: senderData,
          } = msg;
          const sender: IUser = senderData as IUser;
          const isAdmin = sender?.role === "admin";

          return (
            <div
              key={messageId?.toString()}
              className={`flex items-start gap-3 ${
                isAdmin ? "justify-start" : "justify-start"
              }`}
            >
              <Image
                src={
                  sender?.avatarUrl
                    ? sender.avatarUrl
                    : "/avatar-placeholder.png"
                }
                alt={
                  sender?.firstName
                    ? `${sender.firstName} avatar`
                    : "User Avatar"
                }
                width={40}
                height={40}
                className="rounded-full object-cover"
                unoptimized
              />

              <div className="max-w-[75%]">
                <div
                  className={`rounded-lg p-3 ${
                    isAdmin
                      ? "bg-green-100 text-green-900"
                      : "bg-gray-100 text-gray-900"
                  } shadow-sm`}
                >
                  <p className="text-sm font-semibold mb-1 flex items-center gap-2">
                    {sender?.firstName} {sender?.lastName}
                    <span
                      className={`inline-block rounded-full px-2 text-xs font-semibold ${
                        isAdmin
                          ? "bg-green-300 text-green-900"
                          : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {sender?.role}
                    </span>
                  </p>

                  {content && (
                    <p className="whitespace-pre-wrap break-words max-h-80 overflow-y-auto">
                      {content}
                    </p>
                  )}

                  {image && (
                    <Image
                      src={image}
                      alt="Uploaded image"
                      width={240}
                      height={240}
                      className="mt-2 rounded max-h-60 object-contain"
                    />
                  )}

                  {approved && (
                    <p className="text-green-600 text-xs mt-1 font-medium">
                      Approved by admin
                    </p>
                  )}
                  {/* 2️If not yet approved, show button to admin users */}
                  {!approved && isAdminUser && !isAdmin && (
                    <button
                      onClick={() => handleApprove(messageId)}
                      className="mt-2 text-primary-dark text-sm hover:underline cursor-pointer shadow-sm rounded px-2 py-1 bg-white border border-primary-dark"
                    >
                      Approve
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(createdAt).toLocaleString(undefined, {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      {session && (
        <form onSubmit={handleSend} className="space-y-2 border-t pt-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message…"
            rows={3}
            className="w-full resize-none rounded border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Message input"
          />

          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="file-upload"
              className="cursor-pointer rounded bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 transition"
            >
              {file ? `Selected: ${file.name}` : "Attach Image"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              aria-label="Upload image"
            />

            <button
              type="submit"
              disabled={!text.trim() && !file}
              className={`btn-primary px-6 py-2 rounded text-white font-semibold transition ${
                !text.trim() && !file
                  ? "bg-indigo-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              aria-disabled={!text.trim() && !file}
            >
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
