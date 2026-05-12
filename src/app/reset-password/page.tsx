"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SiteChrome } from "@/components/SiteChrome";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const returnToParam = searchParams.get("returnTo") ?? "";

  const [isRecovery, setIsRecovery] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  // Persist returnTo so it survives the recovery email redirect
  useEffect(() => {
    if (returnToParam) sessionStorage.setItem("gid_return_to", returnToParam);
  }, [returnToParam]);

  // Detect recovery session — both on initial load (hash) and via auth state change
  useEffect(() => {
    // Check hash immediately to avoid flash
    if (
      typeof window !== "undefined" &&
      window.location.hash.includes("type=recovery")
    ) {
      setIsRecovery(true);
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });

    // Also check active session type
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (
        session?.user &&
        typeof window !== "undefined" &&
        window.location.hash.includes("type=recovery")
      ) {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: "https://www.ghostlinestudios.com/reset-password" }
    );

    if (resetError) {
      setError(resetError.message);
    } else {
      setRequestSent(true);
    }
    setBusy(false);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      setError(updateError.message);
      setBusy(false);
      return;
    }

    // Resolve returnTo: query param first, then sessionStorage
    const returnTo =
      returnToParam || sessionStorage.getItem("gid_return_to") || "";
    sessionStorage.removeItem("gid_return_to");

    if (returnTo === "scicrime") {
      window.location.href = "https://scicrime.com";
    } else {
      router.push("/account");
    }
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
          Ghostline ID
        </div>

        <h1
          className="welcome-title"
          style={{ marginBottom: 8, fontSize: "clamp(24px,4vw,34px)" }}
        >
          {isRecovery ? "Set a new password" : "Reset your password"}
        </h1>

        {!isRecovery && !requestSent && (
          <p className="welcome-sub">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        )}

        {requestSent ? (
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
              We&apos;ve sent password reset instructions to{" "}
              <strong style={{ color: "var(--spectral)" }}>{email}</strong>.
            </p>
          </div>
        ) : isRecovery ? (
          <form
            className="auth-form welcome-form"
            onSubmit={handleSetNewPassword}
          >
            <label className="auth-label">
              New password
              <input
                className="auth-input"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="8+ characters"
                required
                autoComplete="new-password"
                minLength={8}
                autoFocus
              />
            </label>

            {error && (
              <div className="auth-msg" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button className="auth-submit" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save new password"}
            </button>
          </form>
        ) : (
          <form
            className="auth-form welcome-form"
            onSubmit={handleRequestReset}
          >
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

            {error && (
              <div className="auth-msg" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <button className="auth-submit" type="submit" disabled={busy}>
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        {!isRecovery && (
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <a
              href="/?openAuth=true"
              style={{ fontSize: 13, color: "var(--wraith-soft)" }}
            >
              ← Back to sign in
            </a>
          </div>
        )}
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <SiteChrome>
      <Suspense>
        <ResetPasswordContent />
      </Suspense>
    </SiteChrome>
  );
}
