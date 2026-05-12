"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export function AuthModal() {
  const { authOpen, authTab, closeAuth } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(authTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => setTab(authTab), [authTab]);

  // Reset form on open
  useEffect(() => {
    if (authOpen) {
      setEmail("");
      setPassword("");
      setMsg(null);
    }
  }, [authOpen]);

  // Manage inert + aria-hidden imperatively (not as JSX props, to avoid
  // React re-render conflicts), and handle focus on open/close.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (authOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      panel.removeAttribute("inert");
      panel.removeAttribute("aria-hidden");
      requestAnimationFrame(() => emailInputRef.current?.focus());
    } else {
      panel.setAttribute("inert", "");
      panel.setAttribute("aria-hidden", "true");
      triggerRef.current?.focus();
      triggerRef.current = null;
    }
  }, [authOpen]);

  // Set initial closed state on first mount (before any open event)
  useEffect(() => {
    const panel = panelRef.current;
    if (panel && !authOpen) {
      panel.setAttribute("inert", "");
      panel.setAttribute("aria-hidden", "true");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus trap — keep Tab/Shift+Tab inside the dialog while open
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") { closeAuth(); return; }
    if (e.key !== "Tab") return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), ' +
        'textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [closeAuth]);

  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg({ ok: false, text: error.message });
    else closeAuth();
    setBusy(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/welcome`,
      },
    });
    if (error) setMsg({ ok: false, text: error.message });
    else setMsg({ ok: true, text: "Check your email to confirm your Ghostline ID." });
    setBusy(false);
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <>
      {/* Backdrop — click outside to close, hidden from a11y tree */}
      <div
        className={"auth-backdrop" + (authOpen ? " open" : "")}
        onClick={closeAuth}
        aria-hidden="true"
      />

      {/* Dialog panel — inert + aria-hidden managed imperatively via ref */}
      <div
        ref={panelRef}
        className={"auth-panel" + (authOpen ? " open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Ghostline ID — sign in or create account"
        onKeyDown={handleKeyDown}
      >
        <button className="auth-close" onClick={closeAuth} aria-label="Close Ghostline ID">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <div className="auth-header">
          <div className="auth-mark" aria-hidden="true" />
          <h2 className="auth-title">Ghostline ID</h2>
          <p className="auth-subtitle">Profiles, friends &amp; messages — all in one place.</p>
        </div>

        <div className="auth-tabs" role="tablist" aria-label="Sign in or create account">
          <button
            role="tab"
            aria-selected={tab === "signin"}
            className={"auth-tab" + (tab === "signin" ? " active" : "")}
            onClick={() => { setTab("signin"); setMsg(null); }}
          >
            Sign in
          </button>
          <button
            role="tab"
            aria-selected={tab === "signup"}
            className={"auth-tab" + (tab === "signup" ? " active" : "")}
            onClick={() => { setTab("signup"); setMsg(null); }}
          >
            Create account
          </button>
        </div>

        {tab === "signin" ? (
          <form className="auth-form" onSubmit={handleSignIn} aria-label="Sign in">
            <label className="auth-label" htmlFor="auth-email-signin">
              Email
              <input
                ref={emailInputRef}
                id="auth-email-signin"
                className="auth-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@somewhere.net"
                required
                autoComplete="email"
              />
            </label>
            <label className="auth-label" htmlFor="auth-password-signin">
              Password
              <input
                id="auth-password-signin"
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </label>
            {msg && (
              <div
                className={"auth-msg" + (msg.ok ? " ok" : "")}
                role="status"
                aria-live="polite"
              >
                {msg.text}
              </div>
            )}
            <button className="auth-submit" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
            <button
              type="button"
              className="auth-forgot"
              onClick={async () => {
                if (!email) { setMsg({ ok: false, text: "Enter your email above first." }); return; }
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/auth/callback?next=/account`,
                });
                if (error) setMsg({ ok: false, text: error.message });
                else setMsg({ ok: true, text: "Password reset email sent — check your inbox." });
              }}
            >
              Forgot password?
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleSignUp} aria-label="Create account">
            <label className="auth-label" htmlFor="auth-email-signup">
              Email
              <input
                ref={emailInputRef}
                id="auth-email-signup"
                className="auth-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@somewhere.net"
                required
                autoComplete="email"
              />
            </label>
            <label className="auth-label" htmlFor="auth-password-signup">
              Password
              <input
                id="auth-password-signup"
                className="auth-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="8+ characters"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </label>
            {msg && (
              <div
                className={"auth-msg" + (msg.ok ? " ok" : "")}
                role="status"
                aria-live="polite"
              >
                {msg.text}
              </div>
            )}
            <button className="auth-submit" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create Ghostline ID"}
            </button>
          </form>
        )}

        <div className="auth-divider" aria-hidden="true"><span>or</span></div>

        <div className="auth-oauth">
          <button className="auth-oauth-btn" type="button" onClick={() => handleOAuth("google")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button className="auth-oauth-btn" type="button" onClick={() => handleOAuth("apple")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.45c1.4.07 2.37.7 3.19.72.96-.09 1.98-.73 3.22-.62 1.87.17 3.27 1.07 3.95 2.61-3.57 2.05-2.77 6.9.64 8.12zm-3.76-15.84c-.28 1.46-1.06 2.76-2.44 3.64-1.4.9-2.82.88-4.26-.09 0-.17 0-.35.01-.52.19-2.03 1.43-3.53 2.99-4.07.8-.27 1.57-.36 2.31-.13.26.08.52.2.75.34.24.14.48.29.64.83z"/>
            </svg>
            Continue with Apple
          </button>
        </div>

        <p className="auth-legal">
          By continuing you agree to the{" "}
          <a href="/terms">Terms of Use</a> and <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </>
  );
}
