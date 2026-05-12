"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteChrome } from "@/components/SiteChrome";

function SignUpContent() {
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const supabase = createClient();

  // Persist returnTo before the email-verification redirect wipes query params
  useEffect(() => {
    if (returnTo) sessionStorage.setItem("gid_return_to", returnTo);
  }, [returnTo]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://www.ghostlinestudios.com/welcome",
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setConfirmed(true);
    }
    setBusy(false);
  };

  return (
    <main className="welcome-page">
      <div className="welcome-inner">
        <div className="auth-mark" style={{ margin: "0 auto 20px" }} />

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
          Ghostline Studios
        </div>

        <h1 className="welcome-title" style={{ marginBottom: 8 }}>
          Create a Ghostline ID
        </h1>
        <p className="welcome-sub">
          Your key to profiles, friends &amp; messages — and every Ghostline
          world.
        </p>

        {returnTo === "scicrime" && !confirmed && (
          <p
            style={{
              fontSize: 13,
              color: "var(--spectral)",
              textAlign: "center",
              marginBottom: 24,
              padding: "10px 14px",
              background: "rgba(77,208,225,0.07)",
              border: "1px solid rgba(77,208,225,0.22)",
              borderRadius: 8,
            }}
          >
            Once set up, you&apos;ll be taken back to SciCrime.
          </p>
        )}

        {confirmed ? (
          <div
            style={{
              background: "rgba(77,208,225,0.07)",
              border: "1px solid rgba(77,208,225,0.22)",
              borderRadius: 12,
              padding: "28px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(77,208,225,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: 22,
              }}
            >
              ✓
            </div>
            <p
              style={{
                fontSize: 17,
                fontWeight: 400,
                color: "white",
                marginBottom: 10,
              }}
            >
              Check your inbox
            </p>
            <p
              style={{ fontSize: 13, color: "var(--wraith)", lineHeight: 1.6 }}
            >
              We&apos;ve sent a verification link to{" "}
              <strong style={{ color: "var(--spectral)" }}>{email}</strong>.
              Once verified, you&apos;ll be taken to complete your profile.
            </p>
          </div>
        ) : (
          <form className="auth-form welcome-form" onSubmit={handleSignUp}>
            <label className="auth-label">
              Email
              <input
                className="auth-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@somewhere.net"
                required
                autoComplete="email"
                autoFocus
              />
            </label>

            <label className="auth-label">
              Password
              <input
                className="auth-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8+ characters"
                required
                autoComplete="new-password"
                minLength={8}
              />
            </label>

            {error && (
              <div className="auth-msg" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button className="auth-submit" type="submit" disabled={busy}>
              {busy ? "Creating…" : "Create Ghostline ID"}
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: 28,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            alignItems: "center",
          }}
        >
          <a
            href="/?openAuth=true"
            style={{ fontSize: 13, color: "var(--wraith-soft)" }}
          >
            Already have a Ghostline ID? Sign in →
          </a>

          {returnTo === "scicrime" && (
            <a
              href="https://scicrime.com"
              style={{ fontSize: 13, color: "var(--wraith-faint)" }}
            >
              ← Back to SciCrime
            </a>
          )}
        </div>

        <p className="auth-legal" style={{ marginTop: 24 }}>
          By continuing you agree to the{" "}
          <a href="/terms">Terms of Use</a> and{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <SiteChrome>
      <Suspense>
        <SignUpContent />
      </Suspense>
    </SiteChrome>
  );
}
