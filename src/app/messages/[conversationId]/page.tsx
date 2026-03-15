"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  property_id: string;
  content: string;
  created_at: string;
};

export default function ConversationPage() {
  const params = useParams();
  const supabase = createSupabaseBrowserClient();
  const [pending, startTransition] = useTransition();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const conversationId = Array.isArray(params.conversationId)
    ? params.conversationId[0]
    : params.conversationId;
  const [otherUserId, propertyId] = useMemo(
    () => (conversationId ? conversationId.split("-") : ["", ""]),
    [conversationId],
  );

  useEffect(() => {
    const loadConversation = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      setUserId(user.id);

      const { data } = await supabase
        .from("messages")
        .select("id, sender_id, receiver_id, property_id, content, created_at")
        .eq("property_id", propertyId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      setMessages((data as Message[]) ?? []);

      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("receiver_id", user.id)
        .eq("sender_id", otherUserId)
        .eq("property_id", propertyId);
    };

    loadConversation();
  }, [otherUserId, propertyId, supabase]);

  useEffect(() => {
    if (!userId || !propertyId) return;

    const channel = supabase
      .channel(`messages-${propertyId}-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `property_id=eq.${propertyId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [propertyId, supabase, userId]);

  const handleSend = () => {
    if (!text.trim() || !userId) return;

    startTransition(async () => {
      await supabase.from("messages").insert({
        sender_id: userId,
        receiver_id: otherUserId,
        property_id: propertyId,
        content: text.trim(),
      });

      setText("");
    });
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5f0e4,_#ffffff_45%,_#eef8f2)] px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-900">Conversation</h1>
          <p className="text-sm text-slate-600">Stay in sync with tenants and landlords.</p>
        </header>

        <div className="flex flex-1 flex-col gap-4 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-[0_20px_50px_rgba(16,42,24,0.08)] backdrop-blur">
          <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto">
            {messages.map((message) => {
              const isSender = message.sender_id === userId;
              return (
                <div
                  key={message.id}
                  className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${
                    isSender
                      ? "ml-auto bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {message.content}
                </div>
              );
            })}
          </div>

          <div className="mt-auto flex gap-3">
            <input
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Write a message..."
              className="h-12 flex-1 rounded-full border border-slate-200 px-4 text-sm outline-none"
            />
            <button
              type="button"
              disabled={pending}
              onClick={handleSend}
              className="h-12 rounded-full bg-emerald-700 px-6 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
