"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SiteChrome } from "@/components/SiteChrome";
import { ProjectsIndexNav, SiteFooter } from "@/components/sections";

type ReportedProfile = { id: string; username: string | null; display_name: string | null };
type Message = { id: string; sender_id: string; content: string; created_at: string };

const REASONS = [
  "Harassment or bullying",
  "Hate speech or discrimination",
  "Spam or scam",
  "Inappropriate content",
  "Impersonation",
  "Other",
];

function ReportContent() {
  const { user, loading, openAuth } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();

  const reportedId = params.get("user");
  const convId = params.get("conv");

  const [reportedProfile, setReportedProfile] = useState<ReportedProfile | null>(null);
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [reason, setReason] = useState(REASONS[0]);
  const [context, setContext] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) { openAuth("signin"); router.push("/"); }
  }, [user, loading, openAuth, router]);

  useEffect(() => {
    if (!reportedId) return;
    supabase.from("profiles").select("id, username, display_name").eq("id", reportedId).single()
      .then(({ data }) => { if (data) setReportedProfile(data as ReportedProfile); });
  }, [reportedId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!convId) return;
    supabase.from("messages").select("id, sender_id, content, created_at")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setChatLog(data as Message[]); });
  }, [convId]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async () => {
    if (!user || !reportedId) return;
    setSubmitting(true);
    setError("");

    const { error: err } = await supabase.from("reports").insert({
      reporter_id: user.id,
      reported_id: reportedId,
      conversation_id: convId ?? null,
      context: `Reason: ${reason}\n\n${context}`,
    });

    if (err) { setError(err.message); setSubmitting(false); return; }

    // Notify admins (non-blocking)
    const reporterName = user.user_metadata?.display_name ?? user.email ?? "User";
    const reporterUsername = user.user_metadata?.username ?? "";
    fetch("/api/send/report-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reporterName,
        reporterUsername,
        reportedName: reportedProfile?.display_name ?? reportedProfile?.username ?? reportedId,
        reportedUsername: reportedProfile?.username ?? "",
        reason,
        context,
        reportedAt: new Date().toISOString(),
      }),
    }).catch(() => {});

    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading || !user) return null;

  if (submitted) {
    return (
      <div className="report-page">
        <div className="container">
          <div className="report-card glass">
            <div className="report-success-icon">✓</div>
            <h2 className="report-success-title">Report submitted</h2>
            <p className="report-success-sub">
              Our team will review this report. Thank you for helping keep Ghostline safe.
            </p>
            <button className="profile-save-btn" onClick={() => router.back()}>Go back</button>
          </div>
        </div>
      </div>
    );
  }

  const reportedName = reportedProfile?.display_name || reportedProfile?.username || "this user";

  return (
    <div className="report-page">
      <div className="container">
        <div className="report-header">
          <button className="devlog-back" onClick={() => router.back()}>← Back</button>
          <div className="admin-eyebrow" style={{ marginTop: 16 }}>Report</div>
          <h1 className="report-title">Report {reportedName}</h1>
          <p className="report-sub">
            Reports are reviewed by Ghostline admins. False reports may result in account action.
          </p>
        </div>

        <div className="report-layout">
          {/* Form */}
          <div className="report-form-col">
            <div className="report-card glass">
              <h3 className="report-section-label">Reason</h3>
              <div className="report-reasons">
                {REASONS.map(r => (
                  <label key={r} className={"report-reason" + (reason === r ? " active" : "")}>
                    <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} />
                    {r}
                  </label>
                ))}
              </div>

              <h3 className="report-section-label" style={{ marginTop: 24 }}>Additional context</h3>
              <textarea
                className="auth-input auth-textarea"
                rows={5}
                value={context}
                onChange={e => setContext(e.target.value)}
                placeholder="Describe what happened in your own words…"
              />

              {error && <p className="profile-save-error">{error}</p>}

              <button
                className="auth-submit"
                style={{ marginTop: 20 }}
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </div>

          {/* Chat log */}
          {chatLog.length > 0 && (
            <div className="report-log-col">
              <div className="report-card glass">
                <h3 className="report-section-label">Chat log</h3>
                <p className="report-log-note">This conversation will be attached to your report.</p>
                <div className="report-log">
                  {chatLog.map(m => (
                    <div key={m.id} className={"report-log-msg" + (m.sender_id === user.id ? " mine" : "")}>
                      <span className="report-log-bubble">{m.content}</span>
                      <span className="report-log-time">
                        {new Date(m.created_at).toLocaleString("en-GB", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <SiteChrome>
      <ProjectsIndexNav />
      <Suspense fallback={null}>
        <ReportContent />
      </Suspense>
      <SiteFooter />
    </SiteChrome>
  );
}
