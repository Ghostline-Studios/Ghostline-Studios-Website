"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type ChatFriend = {
  id: string;
  username: string | null;
  display_name: string | null;
};

export type OpenWindow = {
  convId: string;
  friend: ChatFriend;
  minimised: boolean;
};

interface ChatContextType {
  openWindows: OpenWindow[];
  openChat: (friend: ChatFriend, convId: string) => void;
  closeChat: (convId: string) => void;
  toggleMinimise: (convId: string) => void;
  isOpen: (convId: string) => boolean;
  isMinimised: (convId: string) => boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  const openChat = useCallback((friend: ChatFriend, convId: string) => {
    setOpenWindows(prev => {
      const existing = prev.find(w => w.convId === convId);
      if (existing) return prev.map(w => w.convId === convId ? { ...w, minimised: false } : w);
      return [...prev, { convId, friend, minimised: false }];
    });
  }, []);

  const closeChat = useCallback((convId: string) => {
    setOpenWindows(prev => prev.filter(w => w.convId !== convId));
  }, []);

  const toggleMinimise = useCallback((convId: string) => {
    setOpenWindows(prev => prev.map(w => w.convId === convId ? { ...w, minimised: !w.minimised } : w));
  }, []);

  const isOpen = useCallback((convId: string) =>
    openWindows.some(w => w.convId === convId), [openWindows]);

  const isMinimised = useCallback((convId: string) =>
    openWindows.some(w => w.convId === convId && w.minimised), [openWindows]);

  return (
    <ChatContext.Provider value={{ openWindows, openChat, closeChat, toggleMinimise, isOpen, isMinimised }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
