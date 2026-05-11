export type ProfileRow = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type WishlistRow = { id: string; user_id: string; game_id: string; created_at: string };

export type NewsletterPrefRow = {
  user_id: string;
  subscribed: boolean;
  studio_updates: boolean;
  devlog_scraplings: boolean;
  devlog_spectral_sabre: boolean;
  updated_at: string;
};

export type DevlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  game_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FriendshipRow = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  updated_at: string;
};

export type ConversationRow = {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  created_at: string;
};

export type MessageRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
};

export type ReportRow = {
  id: string;
  reporter_id: string | null;
  reported_id: string | null;
  conversation_id: string | null;
  context: string | null;
  status: "pending" | "reviewed" | "dismissed";
  created_at: string;
  updated_at: string;
};
