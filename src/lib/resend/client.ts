import "server-only";
import { Resend } from "resend";
import { serverEnv } from "@/lib/env";

let cachedClient: Resend | null = null;

/** Resend client, or null when RESEND_API_KEY / RESEND_FROM_EMAIL are not set. */
export function getResend(): Resend | null {
  const apiKey = serverEnv.resendApiKey();
  if (!apiKey) return null;
  if (!cachedClient) cachedClient = new Resend(apiKey);
  return cachedClient;
}

/** Best-effort send — never throws, so email failures can't break checkout. */
export async function sendEmail(input: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = getResend();
    const from = serverEnv.resendFromEmail();
    if (!client || !from) return { ok: false, error: "Resend not configured" };
    const { data, error } = await client.emails.send({
      from,
      to: Array.isArray(input.to) ? input.to : [input.to],
      replyTo: input.replyTo,
      subject: input.subject,
      html: input.html,
    });
    if (error) return { ok: false, error: error.message };
    if (!data?.id) return { ok: false, error: "Resend returned no message id" };
    return { ok: true };
  } catch (error) {
    console.error("[resend:sendEmail]", (error as Error).message);
    return { ok: false, error: (error as Error).message };
  }
}
