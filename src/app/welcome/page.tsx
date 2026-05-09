"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SiteChrome } from "@/components/SiteChrome";

function WelcomeContent() {
  const { user, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameEdited, setUsernameEdited] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [usernameOk, setUsernameOk] = useState(false);
  const [busy, setBusy] = useState(false);

  // Redirect if not authed
  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  // Pre-fill from OAuth metadata if available
  useEffect(() => {
    if (!user) return;
    const meta = user.user_metadata;
    if (meta?.full_name) setDisplayName(meta.full_name);
    if (meta?.display_name) setDisplayName(meta.display_name);
  }, [user]);

  const toSlug = (val: string) =>
    val.toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_-]/g, "");

  // Auto-populate username from display name unless user has manually edited it
  useEffect(() => {
    if (usernameEdited) return;
    setUsername(toSlug(displayName));
    setUsernameError("");
    setUsernameOk(false);
  }, [displayName, usernameEdited]);

  const validateUsername = (val: string) => {
    if (val.length < 3) return "At least 3 characters";
    if (!/^[a-z0-9_-]+$/.test(val)) return "Lowercase letters, numbers, _ and - only";
    return "";
  };

  // Check availability with a small debounce
  useEffect(() => {
    if (!username || validateUsername(username)) { setUsernameOk(false); return; }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .neq("id", user?.id ?? "")
        .single();
      if (data) {
        // Taken — suggest variations
        setUsernameOk(false);
        setUsernameError(`@${username} is taken`);
        // Auto-suggest first free variation
        for (let i = 2; i <= 9; i++) {
          const candidate = `${username}_${i}`;
          const { data: taken } = await supabase
            .from("profiles").select("id").eq("username", candidate).single();
          if (!taken) {
            setUsernameError(`@${username} is taken — how about @${candidate}?`);
            break;
          }
        }
      } else {
        setUsernameError("");
        setUsernameOk(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [username, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, "");
    setUsername(clean);
    setUsernameEdited(true);
    setUsernameOk(false);
    const err = validateUsername(clean);
    setUsernameError(err);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUsername(username);
    if (err) { setUsernameError(err); return; }
    if (!user) return;

    setBusy(true);

    // Refresh the session before writing — ensures cookie is set after email confirmation redirect
    await supabase.auth.getSession();

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      display_name: displayName || username,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      setUsernameError("Couldn't save — please try again.");
      setBusy(false);
      return;
    }

    await supabase.from("newsletter_preferences")
      .upsert({ user_id: user.id })
      .select();

    await refreshProfile();
    router.push("/account");
  };

  if (loading || !user) return null;

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
          Account setup
        </div>
        <h1 className="welcome-title">Welcome to Ghostline</h1>
        <p className="welcome-sub">
          One last step — choose how you&apos;ll appear across every Ghostline world.
        </p>

        <form className="auth-form welcome-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Display name
            <input
              className="auth-input"
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="How should we address you?"
              autoFocus
            />
          </label>

          <label className="auth-label">
            Username
            <div className="username-wrap">
              <span className="username-at">@</span>
              <input
                className={"auth-input username-input" + (usernameError ? " error" : "")}
                type="text"
                value={username}
                onChange={e => handleUsernameChange(e.target.value)}
                placeholder="ghostrunner"
                required
                autoComplete="username"
              />
            </div>
            {usernameError && (
              <span className="username-hint error">{usernameError}</span>
            )}
            {usernameOk && (
              <span className="username-hint ok">@{username} is available</span>
            )}
          </label>

          <button className="auth-submit" type="submit" disabled={busy || !!usernameError || !usernameOk}>
            {busy ? "Setting up…" : "Enter the Ghostline"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function WelcomePage() {
  return (
    <SiteChrome>
      <WelcomeContent />
    </SiteChrome>
  );
}
