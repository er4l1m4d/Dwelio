import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { buildConversationId } from "@/lib/messages/conversation";

export default async function MessagesPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen px-6 py-16 text-slate-600">
        Please log in to view messages.
      </div>
    );
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, receiver_id, property_id, content, created_at, is_read")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  type Message = NonNullable<typeof messages>[number];
  const conversationMap = new Map<string, Message>();

  messages?.forEach((message) => {
    const otherUserId =
      message.sender_id === user.id ? message.receiver_id : message.sender_id;
    const key = `${otherUserId}-${message.property_id}`;
    if (!conversationMap.has(key)) {
      conversationMap.set(key, message);
    }
  });

  const conversations = Array.from(conversationMap.values());
  const participantIds = conversations.map((message) =>
    message.sender_id === user.id ? message.receiver_id : message.sender_id,
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .in("id", participantIds);

  const profileMap = new Map(
    profiles?.map((profile) => [profile.id, profile]) ?? [],
  );

  const propertyIds = conversations.map((message) => message.property_id);
  const { data: properties } = await supabase
    .from("properties")
    .select("id, title")
    .in("id", propertyIds);

  const propertyMap = new Map(
    properties?.map((property) => [property.id, property]) ?? [],
  );

  return (
    <div className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="font-headline text-4xl font-black tracking-[-0.04em] text-primary-container">Messages</h1>
          <p className="text-base text-on-surface-variant">
            Chat with landlords and tenants in one place.
          </p>
        </header>

        <div className="grid gap-4">
          {conversations.length > 0 ? (
            conversations.map((message) => {
              const otherUserId =
                message.sender_id === user.id
                  ? message.receiver_id
                  : message.sender_id;
              const profile = profileMap.get(otherUserId);
              const property = propertyMap.get(message.property_id);
              const isUnread = !message.is_read && message.receiver_id === user.id;
              const conversationId = buildConversationId(
                otherUserId,
                message.property_id,
              );

              return (
                <Link
                  key={message.id}
                  href={`/messages/${conversationId}`}
                  className={`flex flex-col gap-3 rounded-[2rem] bg-surface-container-lowest p-5 shadow-[var(--shadow-elevated-panel)] transition hover:bg-surface-container-low ${isUnread ? 'ring-2 ring-primary-container/30' : ''}`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-headline text-sm font-bold text-primary-container">
                        {profile?.full_name ?? "Dwelio user"}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {property?.title ?? "Property"}
                      </p>
                    </div>
                    {isUnread && (
                      <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{message.content}</p>
                </Link>
              );
            })
          ) : (
            <p className="text-on-surface-variant">No conversations yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
