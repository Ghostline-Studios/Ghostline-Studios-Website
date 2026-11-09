// A game link code the player was in the middle of approving (see /link). Kept across a
// sign-in round trip (Google / Apple sign-in comes back to the home page, not /link).

const KEY = "gid_link_code";
const MAX_AGE_MS = 15 * 60 * 1000;

export function rememberLinkCode(code: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ code, t: Date.now() }));
  } catch {}
}

export function pendingLinkCode(): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { code, t } = JSON.parse(raw);
    if (typeof code !== "string" || Date.now() - t > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      return null;
    }
    return code;
  } catch {
    return null;
  }
}

export function clearLinkCode() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

// "k7qm4xpd" / "K7QM-4XPD" -> "K7QM-4XPD"
export function formatLinkCode(raw: string): string {
  const c = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return c.length > 4 ? c.slice(0, 4) + "-" + c.slice(4) : c;
}

export const GAME_NAMES: Record<string, string> = { gofpv: "GoFPV" };
