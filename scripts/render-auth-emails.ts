/**
 * Renders the Supabase auth email templates to HTML files.
 * Run with:  npx tsx scripts/render-auth-emails.ts
 *
 * Then paste each file's contents into:
 *   Supabase → Authentication → Email Templates
 *
 * Supabase variable syntax:  {{ .ConfirmationURL }}  etc.
 * These are preserved as-is since the templates use them as default props.
 */
import React from "react";
import { render } from "@react-email/render";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import ConfirmEmail from "../src/emails/ConfirmEmail";
import ResetPasswordEmail from "../src/emails/ResetPasswordEmail";

const OUT = join(process.cwd(), "scripts", "email-html");
mkdirSync(OUT, { recursive: true });

async function renderAndWrite(name: string, component: React.ReactElement) {
  const html = await render(component);
  const path = join(OUT, `${name}.html`);
  writeFileSync(path, html, "utf-8");
  console.log(`✓  ${path}`);
}

(async () => {
  await renderAndWrite("confirm-signup",   React.createElement(ConfirmEmail, {}));
  await renderAndWrite("reset-password",   React.createElement(ResetPasswordEmail, {}));
  console.log("\nPaste each file into Supabase → Authentication → Email Templates");
  console.log("The {{ .ConfirmationURL }} placeholder is preserved and replaced by Supabase at send time.");
})();
