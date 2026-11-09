// Ghostline ID: sign a game in with a link code (see supabase/game_links.sql).
//
// POST {action: "start", game: "gofpv", secret, device?}
//   -> {code: "K7QM4XPD", display: "K7QM-4XPD", expires_in: 600}
// POST {action: "poll", code, secret}
//   -> {status: "pending" | "expired" | "used" | "unknown"}
//   -> {status: "approved", access_token, refresh_token, expires_in, user: {id}}
//
// The secret never leaves the game except to this function, and only its hash is stored,
// so seeing a code on someone's screen isn't enough to take their session. A session is
// handed out once: the row is marked consumed before the token is minted.

import { createClient } from "npm:@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const GAMES = new Set(["gofpv"]);
// no 0/O, 1/I/L: easy to read off a phone screen and type
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const TTL_S = 600;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function reply(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function newCode(): string {
  const out: string[] = [];
  const bytes = new Uint8Array(16);
  while (out.length < 8) {
    crypto.getRandomValues(bytes);
    for (const b of bytes) {
      // reject the top of the range so every letter is equally likely
      if (b < 256 - (256 % ALPHABET.length) && out.length < 8) out.push(ALPHABET[b % ALPHABET.length]);
    }
  }
  return out.join("");
}

function clean(code: unknown): string {
  return String(code ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return reply({ error: "method" }, 405);
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return reply({ error: "bad_json" }, 400);
  }
  const admin = createClient(URL, SERVICE, { auth: { persistSession: false, autoRefreshToken: false } });
  const secret = String(body.secret ?? "");
  if (secret.length < 32 || secret.length > 128) return reply({ error: "bad_secret" }, 400);

  if (body.action === "start") {
    const game = String(body.game ?? "");
    if (!GAMES.has(game)) return reply({ error: "unknown_game" }, 400);
    // tidy up: codes a day past their expiry
    await admin.from("game_links").delete().lt("expires_at", new Date(Date.now() - 86_400_000).toISOString());
    const hash = await sha256(secret);
    const device = String(body.device ?? "").slice(0, 60) || null;
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = newCode();
      const { error } = await admin.from("game_links").insert({
        code,
        game_id: game,
        device_secret_hash: hash,
        device_name: device,
        expires_at: new Date(Date.now() + TTL_S * 1000).toISOString(),
      });
      if (!error) return reply({ code, display: code.slice(0, 4) + "-" + code.slice(4), expires_in: TTL_S });
      if (error.code !== "23505") return reply({ error: "db" }, 500); // anything but a duplicate code
    }
    return reply({ error: "busy" }, 503);
  }

  if (body.action === "poll") {
    const code = clean(body.code);
    const { data: row } = await admin.from("game_links").select("*").eq("code", code).maybeSingle();
    if (!row || row.device_secret_hash !== (await sha256(secret))) return reply({ status: "unknown" });
    if (row.consumed_at) return reply({ status: "used" });
    if (!row.approved_at) {
      return reply({ status: new Date(row.expires_at).getTime() < Date.now() ? "expired" : "pending" });
    }
    // claim it (only one poll can win), then sign that account in
    const { data: claimed } = await admin.from("game_links").update({ consumed_at: new Date().toISOString() })
      .eq("code", code).is("consumed_at", null).select("user_id").maybeSingle();
    if (!claimed) return reply({ status: "used" });
    const { data: u, error: ue } = await admin.auth.admin.getUserById(claimed.user_id);
    if (ue || !u?.user?.email) return reply({ error: "no_user" }, 500);
    const { data: link, error: le } = await admin.auth.admin.generateLink({ type: "magiclink", email: u.user.email });
    if (le || !link?.properties?.hashed_token) return reply({ error: "link" }, 500);
    const anon = createClient(URL, ANON, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: v, error: ve } = await anon.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "email" });
    if (ve || !v?.session) return reply({ error: "verify" }, 500);
    return reply({
      status: "approved",
      access_token: v.session.access_token,
      refresh_token: v.session.refresh_token,
      expires_in: v.session.expires_in,
      user: { id: v.session.user.id },
    });
  }

  return reply({ error: "action" }, 400);
});
