import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy is shipped in report-only mode so it cannot break the
// live site. Check the browser console for violations, then switch the header
// name to "Content-Security-Policy" to enforce it.
//
// Origins in use:
// - next/font (Google fonts) are self-hosted at build time, so font-src is 'self'.
// - Supabase REST/auth over https and realtime over wss on *.supabase.co.
// - Google/Apple OAuth are top-level navigations, so they are not governed by connect-src.
// - Inline JSON-LD and inline <style>/style attributes need 'unsafe-inline'.
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js inline bootstrap scripts need 'unsafe-inline' without nonces.
  // 'unsafe-eval' is only needed by the dev server (React debugging, HMR).
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
