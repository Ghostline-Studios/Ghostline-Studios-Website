"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SiteChrome } from "@/components/SiteChrome";
import { rememberLinkCode, pendingLinkCode, clearLinkCode, formatLinkCode, GAME_NAMES } from "@/lib/link";

// Sign a Ghostline game in: the game shows a code, the player signs in here (any way:
// email, Google, Apple) and enters it. See supabase/game_links.sql.

const ERRORS: Record<string, string> = {
  not_found: "That code doesn't match anything. Check it against the one on your screen.",
  expired: "That code has expired. Ask the game for a new one.",
  already_used: "That code has already been used. Ask the game for a new one.",
  not_signed_in: "Sign in first.",
};

function LinkContent() {
  const { user, profile, loading, openAuth } = useAuth();
  const params = useSearchParams();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ game: string; device: string | null } | null>(null);

  // the code from the link (?code=), or one waiting from before a sign-in
  useEffect(() => {
    const fromUrl = params.get("code");
    const start = fromUrl ?? pendingLinkCode() ?? "";
    if (start) setCode(formatLinkCode(start));
  }, [params]);

  // keep it through a sign-in round trip
  useEffect(() => {
    if (code.replace("-", "").length === 8 && !user) rememberLinkCode(code);
  }, [code, user]);

  const approve = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { data, error: err } = await supabase.rpc("link_approve", { p_code: code });
    setBusy(false);
    if (err) {
      setError("Something went wrong. Try again in a moment.");
      return;
    }
    if (!data?.ok) {
      setError(ERRORS[data?.error] ?? "That didn't work. Try a new code.");
      return;
    }
    clearLinkCode();
    setDone({ game: GAME_NAMES[data.game_id] ?? data.game_id, device: data.device_name });
  };

  if (loading) return null;
  const who = profile?.display_name || (profile?.username ? "@" + profile.username : user?.email);
  const ready = code.replace("-", "").length === 8;

  return (
    <main className="welcome-page">
      <div className="welcome-inner">
        <div className="auth-mark" style={{ margin: "0 auto 24px" }} />
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "var(--spectral)",
            textTransform: "uppercase",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          Ghostline ID
        </div>
        {done ? (
          <>
            <h1 className="welcome-title">You&apos;re in</h1>
            <p className="welcome-sub">
              {done.game}
              {done.device ? ` on ${done.device}` : ""} is now signed in as {who}. You can go back to the game.
            </p>
          </>
        ) : !user ? (
          <>
            <h1 className="welcome-title">Sign in a game</h1>
            <p className="welcome-sub">
              Sign in with your Ghostline ID, then enter the code the game is showing.
              {ready && <> Your code <strong>{code}</strong> will be waiting.</>}
            </p>
            <div className="auth-form welcome-form">
              <button className="auth-submit" type="button" onClick={() => openAuth("signin")}>
                Sign in
              </button>
              <button className="auth-submit" type="button" style={{ opacity: 0.75 }} onClick={() => openAuth("signup")}>
                Create a Ghostline ID
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="welcome-title">Sign in a game</h1>
            <p className="welcome-sub">
              Enter the code the game is showing to sign it in as <strong>{who}</strong>.
            </p>
            <form className="auth-form welcome-form" onSubmit={approve}>
              <label className="auth-label">
                Code
                <input
                  className={"auth-input" + (error ? " error" : "")}
                  type="text"
                  inputMode="text"
                  autoCapitalize="characters"
                  autoComplete="one-time-code"
                  spellCheck={false}
                  value={code}
                  onChange={(e) => {
                    setCode(formatLinkCode(e.target.value));
                    setError("");
                  }}
                  placeholder="K7QM-4XPD"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 24, letterSpacing: "0.2em", textAlign: "center" }}
                  autoFocus
                />
                {error && <span className="username-hint error">{error}</span>}
              </label>
              <button className="auth-submit" type="submit" disabled={busy || !ready}>
                {busy ? "Signing in…" : "Sign the game in"}
              </button>
            </form>
            <p className="welcome-sub" style={{ fontSize: 12, marginTop: 20 }}>
              Only enter a code from a game on a device you own. Not you? Sign out from your account menu first.
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export default function LinkPage() {
  return (
    <SiteChrome>
      <Suspense fallback={null}>
        <LinkContent />
      </Suspense>
    </SiteChrome>
  );
}
