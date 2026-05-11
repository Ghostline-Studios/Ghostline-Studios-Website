"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useChat, type ChatFriend } from "@/context/ChatContext";
import type { MessageRow, ConversationRow } from "@/lib/supabase/database.types";

// ── Types ──────────────────────────────────────────────────────────
type FriendProfile = ChatFriend;
type ConvRow = ConversationRow;
type Message = MessageRow;

// ── Small avatar ───────────────────────────────────────────────────
function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div className="chat-avatar" style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ── Individual chat window ─────────────────────────────────────────
function ChatWindow({
  win,
  userId,
  onMinimise,
  onClose,
  onUnread,
}: {
  win: { convId: string; friend: FriendProfile; minimised: boolean };
  userId: string;
  onMinimise: () => void;
  onClose: () => void;
  onUnread: (convId: string, count: number) => void;
}) {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  // Load history
  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", win.convId)
      .order("created_at", { ascending: true })
      .limit(60)
      .then(({ data }) => {
        if (data) { setMessages(data as Message[]); setTimeout(scrollToBottom, 50); }
      });
  }, [win.convId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Realtime new messages
  useEffect(() => {
    const channel = supabase
      .channel(`conv-${win.convId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${win.convId}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages(prev => {
            // deduplicate
            if (prev.some(m => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          setTimeout(scrollToBottom, 50);
          // Count unread if window is minimised
          if (win.minimised && msg.sender_id !== userId) {
            onUnread(win.convId, 1);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [win.convId, win.minimised, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark messages read when window opens
  useEffect(() => {
    if (!win.minimised) {
      onUnread(win.convId, 0);
      supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", win.convId)
        .neq("sender_id", userId)
        .is("read_at", null)
        .then(() => {});
    }
  }, [win.minimised, win.convId, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const [sendError, setSendError] = useState("");

  const send = async () => {
    const text = draft.trim();
    if (!text || sending) return;
    setDraft("");
    setSendError("");
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      conversation_id: win.convId,
      sender_id: userId,
      content: text,
    });
    if (error) { setSendError("Failed to send."); setDraft(text); }
    else {
      await supabase.from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", win.convId);
    }
    setSending(false);
    inputRef.current?.focus();
  };

  const friendName = win.friend.display_name || win.friend.username || "Unknown";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={"chat-window" + (win.minimised ? " minimised" : "")}>
      {/* Header */}
      <div className="chat-window-header" onClick={() => win.minimised && onMinimise()}>
        <Avatar name={friendName} size={28} />

        {/* Clickable name → dropdown */}
        <div className="chat-window-name-wrap" ref={menuRef}>
          <button
            className="chat-window-name"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
          >
            {friendName}
            <span className="chat-name-caret">▾</span>
          </button>
          {menuOpen && (
            <div className="chat-name-menu">
              {win.friend.username && (
                <Link
                  href={`/u/${win.friend.username}`}
                  className="chat-name-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  View profile
                </Link>
              )}
              <Link
                href={`/report?user=${win.friend.id}&conv=${win.convId}`}
                className="chat-name-menu-item danger"
                onClick={() => setMenuOpen(false)}
              >
                Report user
              </Link>
              <button
                className="chat-name-menu-item"
                onClick={() => { setMenuOpen(false); onMinimise(); }}
              >
                {win.minimised ? "Expand" : "Minimise"}
              </button>
            </div>
          )}
        </div>

        <button className="chat-window-btn" onClick={onClose} aria-label="Close">×</button>
      </div>

      {/* Body */}
      {!win.minimised && (
        <>
          <div className="chat-messages">
            {messages.length === 0 && (
              <p className="chat-empty">Say hi to {friendName}!</p>
            )}
            {messages.map(m => (
              <div key={m.id} className={"chat-msg" + (m.sender_id === userId ? " mine" : "")}>
                <span className="chat-bubble">{m.content}</span>
                <span className="chat-time">
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {sendError && <p className="chat-send-error">{sendError}</p>}
          <div className="chat-compose">
            <input
              ref={inputRef}
              className="chat-input"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Message…"
              autoFocus
            />
            <button className="chat-send-btn" onClick={send} disabled={!draft.trim() || sending}>↑</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Main overlay ───────────────────────────────────────────────────
export function ChatOverlay() {
  const { user, loading } = useAuth();
  const { openWindows, openChat, closeChat, toggleMinimise } = useChat();
  const supabase = createClient();

  const [panelOpen, setPanelOpen] = useState(false);
  const [friends, setFriends] = useState<FriendProfile[]>([]);
  const [convMap, setConvMap] = useState<Record<string, string>>({}); // friendId → convId
  const [unread, setUnread] = useState<Record<string, number>>({}); // convId → count
  const panelRef = useRef<HTMLDivElement>(null);

  // Total unread across all convs
  const totalUnread = Object.values(unread).reduce((a, b) => a + b, 0);

  // Load friends + their conversation IDs
  const loadFriends = useCallback(async () => {
    if (!user) return;
    const { data: friendships } = await supabase
      .from("friendships")
      .select("requester_id, addressee_id")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq("status", "accepted");

    if (!friendships?.length) return;

    const friendIds = friendships.map(f => f.requester_id === user.id ? f.addressee_id : f.requester_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .in("id", friendIds);

    if (profiles) setFriends(profiles as FriendProfile[]);

    // Load existing conversations
    const { data: convs } = await supabase
      .from("conversations")
      .select("id, participant_1, participant_2")
      .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`);

    if (convs) {
      const map: Record<string, string> = {};
      (convs as ConvRow[]).forEach((c) => {
        const other = c.participant_1 === user.id ? c.participant_2 : c.participant_1;
        map[other] = c.id;
      });
      setConvMap(map);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading && user) loadFriends();
  }, [user, loading, loadFriends]);

  // Realtime: new conversations
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations-watch")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "conversations" }, loadFriends)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, loadFriends]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node))
        setPanelOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const startChat = async (friend: FriendProfile) => {
    if (!user) return;
    setPanelOpen(false);

    // Get or create conversation
    let convId = convMap[friend.id];
    if (!convId) {
      const p1 = user.id < friend.id ? user.id : friend.id;
      const p2 = user.id < friend.id ? friend.id : user.id;
      const { data } = await supabase
        .from("conversations")
        .upsert({ participant_1: p1, participant_2: p2 }, { onConflict: "participant_1,participant_2" })
        .select()
        .single();
      if (data) {
        convId = data.id;
        setConvMap(prev => ({ ...prev, [friend.id]: convId }));
      }
    }

    if (!convId) return;
    openChat(friend, convId);
  };

  const handleUnread = useCallback((convId: string, count: number) => {
    setUnread(prev => {
      if (count === 0) { const n = { ...prev }; delete n[convId]; return n; }
      return { ...prev, [convId]: (prev[convId] ?? 0) + count };
    });
  }, []);

  const handleMinimise = (convId: string) => toggleMinimise(convId);
  const handleClose = (convId: string) => { closeChat(convId); handleUnread(convId, 0); };

  if (!user) return null;

  return (
    <div className="chat-overlay" ref={panelRef}>

      {/* Open chat windows (right → left) */}
      {openWindows.map(win => (
        <ChatWindow
          key={win.convId}
          win={win}
          userId={user.id}
          onMinimise={() => handleMinimise(win.convId)}
          onClose={() => handleClose(win.convId)}
          onUnread={handleUnread}
        />
      ))}

      {/* Friends panel */}
      {panelOpen && (
        <div className="chat-panel">
          <div className="chat-panel-head">
            <span>Messages</span>
          </div>
          {friends.length === 0 ? (
            <p className="chat-panel-empty">Add friends to start chatting.</p>
          ) : (
            <div className="chat-panel-list">
              {friends.map(f => {
                const convId = convMap[f.id];
                const unreadCount = convId ? (unread[convId] ?? 0) : 0;
                const name = f.display_name || f.username || "Unknown";
                return (
                  <button key={f.id} className="chat-panel-row" onClick={() => startChat(f)}>
                    <Avatar name={name} size={34} />
                    <div className="chat-panel-info">
                      <span className="chat-panel-name">{name}</span>
                      {f.username && <span className="chat-panel-username">@{f.username}</span>}
                    </div>
                    {unreadCount > 0 && <span className="chat-unread-dot">{unreadCount}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setPanelOpen(v => !v)}
        aria-label="Messages"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17 2H3C2.45 2 2 2.45 2 3v10c0 .55.45 1 1 1h3l2 3 2-3h7c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        </svg>
        {totalUnread > 0 && <span className="chat-toggle-badge">{totalUnread}</span>}
      </button>

    </div>
  );
}
