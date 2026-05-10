import { Resend } from "resend";

// Lazily initialised so missing env var doesn't crash the build
let _resend: Resend | null = null;
export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment variable");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

export const FROM = "Ghostline Studios <no-reply@ghostlinestudios.com>";
