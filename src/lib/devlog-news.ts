import type { DevlogRow } from "@/lib/supabase/database.types";

/** Subset of a devlog row shown in the homepage news list. */
export type NewsPost = Pick<DevlogRow, "id" | "title" | "slug" | "game_id" | "published_at" | "created_at">;

/** Columns selected for the homepage news list. Ordered by published_at desc, limit 6. */
export const NEWS_COLUMNS = "id, title, slug, game_id, published_at, created_at";
export const NEWS_LIMIT = 6;
