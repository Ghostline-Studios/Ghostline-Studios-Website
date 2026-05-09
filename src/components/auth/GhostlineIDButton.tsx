"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function GhostlineIDButton() {
  const { user, profile, loading, openAuth, signOut } = useAuth();
  const [dropOpen, setDropOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) return <div className="gid-btn gid-skeleton" aria-hidden />;

  if (!user) {
    return (
      <button className="gid-btn" onClick={() => openAuth("signin")}>
        <span className="gid-mark" />
        <span>Ghostline ID</span>
      </button>
    );
  }

  const displayLabel = profile?.display_name || user.email || "G";
  const initials = displayLabel.slice(0, 2).toUpperCase();

  return (
    <div className="gid-signed-in" ref={ref}>
      <button
        className="gid-avatar"
        onClick={() => setDropOpen(v => !v)}
        aria-label="Account menu"
        aria-expanded={dropOpen}
      >
        {initials}
      </button>
      {dropOpen && (
        <div className="gid-dropdown">
          <div className="gid-dropdown-user">
            {profile?.display_name || user.email}
          </div>
          <Link
            href="/account"
            className="gid-dropdown-item"
            onClick={() => setDropOpen(false)}
          >
            Profile
          </Link>
          {profile?.is_admin && (
            <Link
              href="/admin"
              className="gid-dropdown-item"
              onClick={() => setDropOpen(false)}
            >
              Admin
            </Link>
          )}
          <button
            className="gid-dropdown-item gid-signout"
            onClick={() => { signOut(); setDropOpen(false); }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
