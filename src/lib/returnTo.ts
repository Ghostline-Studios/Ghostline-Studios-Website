// Post-auth return target (e.g. "scicrime"). The primary carrier is the
// ?returnTo= query in the email link; this storage value is only a fallback.
// localStorage (not sessionStorage) so it is visible when the confirmation
// link opens in a new tab.

const STORAGE_KEY = "gid_return_to";
const TTL_MS = 60 * 60 * 1000; // 1 hour

// The only values that may ever be acted on. Anything else is ignored.
const ALLOWED_RETURN_TARGETS = ["scicrime"] as const;

export function safeReturnTo(value: string | null | undefined): string {
  return ALLOWED_RETURN_TARGETS.find((t) => t === value) ?? "";
}

export function setReturnTo(value: string): void {
  const safe = safeReturnTo(value);
  if (!safe) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ value: safe, expires: Date.now() + TTL_MS })
    );
  } catch {
    // Storage blocked or full: the query param still carries the value.
  }
}

export function getReturnTo(): string {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return "";
    const { value, expires } = JSON.parse(raw) as {
      value?: unknown;
      expires?: unknown;
    };
    if (typeof expires !== "number" || expires < Date.now()) {
      clearReturnTo();
      return "";
    }
    return safeReturnTo(typeof value === "string" ? value : null);
  } catch {
    return "";
  }
}

export function clearReturnTo(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
