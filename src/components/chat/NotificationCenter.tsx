"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";

type Toast = {
  id: string;
  type: "message" | "friend_request";
  title: string;
  body: string;
  convId?: string;
  friendId?: string;
  friend?: { id: string; display_name: string | null; username: string | null };
};

function ToastCard({ toast, onDismiss, onAction }: { toast: Toast; onDismiss: () => void; onAction: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 6000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="notif-toast" onClick={onAction}>
      <div className="notif-icon">
        {toast.type === "message" ? (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M17 2H3C2.45 2 2 2.45 2 3v10c0 .55.45 1 1 1h3l2 3 2-3h7c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <div className="notif-text">
        <span className="notif-title">{toast.title}</span>
        <span className="notif-body">{toast.body}</span>
      </div>
      <button
        className="notif-close"
        onClick={e => { e.stopPropagation(); onDismiss(); }}
        aria-label="Dismiss"
      >×</button>
    </div>
  );
}

export function NotificationCenter() {
  const { user } = useAuth();
  const { openChat, isOpen, isMinimised } = useChat();
  const router = useRouter();
  const supabase = createClient();
  const [toasts, setToasts] = useState<Toast[]>([]);
  // Track conversations the user is involved in: convId → friendProfile
  const convFriendMap = useRef<Record<string, { id: string; display_name: string | null; username: string | null }>>({});

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev.slice(-4), { ...toast, id }]); // cap at 5
  }, []);

  // Build conv→friend map for message attribution
  const buildConvMap = useCallback(async () => {
    if (!user) return;
    const { data: convs } = await supabase
      .from("conversations")
      .select("id, participant_1, participant_2")
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`);
    if (!convs) return;

    const friendIds = convs.map((c: { id: string; participant_1: string; participant_2: string }) =>
      c.participant_1 === user.id ? c.participant_2 : c.participant_1
    );
    if (!friendIds.length) return;

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, display_name, username")
      .in("id", friendIds);

    const profileMap: Record<string, { id: string; display_name: string | null; username: string | null }> = {};
    (profiles ?? []).forEach((p: { id: string; display_name: string | null; username: string | null }) => { profileMap[p.id] = p; });

    convs.forEach((c: { id: string; participant_1: string; participant_2: string }) => {
      const friendId = c.participant_1 === user.id ? c.participant_2 : c.participant_1;
      if (profileMap[friendId]) convFriendMap.current[c.id] = profileMap[friendId];
    });
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user) return;
    buildConvMap();

    // ── New message notifications ──────────────────────────────
    const msgChannel = supabase
      .channel("notif-messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async (payload) => {
          const msg = payload.new as { id: string; conversation_id: string; sender_id: string; content: string };
          if (msg.sender_id === user.id) return; // own message

          // Skip if window is open and not minimised
          if (isOpen(msg.conversation_id) && !isMinimised(msg.conversation_id)) return;

          let friend = convFriendMap.current[msg.conversation_id];
          if (!friend) {
            // New conversation — rebuild map then retry
            await buildConvMap();
            friend = convFriendMap.current[msg.conversation_id];
          }
          if (!friend) return;

          const name = friend.display_name || friend.username || "Someone";
          addToast({
            type: "message",
            title: name,
            body: msg.content.length > 60 ? msg.content.slice(0, 60) + "…" : msg.content,
            convId: msg.conversation_id,
            friend,
          });
        }
      )
      .subscribe();

    // ── Friend request notifications ───────────────────────────
    const friendChannel = supabase
      .channel("notif-friends")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "friendships",
          filter: `addressee_id=eq.${user.id}`,
        },
        async (payload) => {
          const row = payload.new as { requester_id: string };
          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, username")
            .eq("id", row.requester_id)
            .single();
          const name = profile?.display_name || profile?.username || "Someone";
          addToast({
            type: "friend_request",
            title: "Friend request",
            body: `${name} wants to be friends`,
            friendId: row.requester_id,
          });
        }
      )
      .subscribe();

    // Also update conv map when new conversations are created
    const convChannel = supabase
      .channel("notif-convs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations" }, buildConvMap)
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(friendChannel);
      supabase.removeChannel(convChannel);
    };
  }, [user, isOpen, isMinimised, addToast, buildConvMap]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = (toast: Toast) => {
    dismiss(toast.id);
    if (toast.type === "message" && toast.convId && toast.friend) {
      openChat(toast.friend, toast.convId);
    } else if (toast.type === "friend_request") {
      router.push("/social?tab=requests");
    }
  };

  if (!user || toasts.length === 0) return null;

  return (
    <div className="notif-stack">
      {toasts.map(t => (
        <ToastCard key={t.id} toast={t} onDismiss={() => dismiss(t.id)} onAction={() => handleAction(t)} />
      ))}
    </div>
  );
}
