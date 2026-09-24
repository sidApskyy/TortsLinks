"use server";

import { headers } from "next/headers";
import { leadSchema } from "./schema";
import { sendMail, escapeHtml } from "./mail";

export type FormState = { ok: boolean; error?: string };

const MIN_FILL_MS = 2500;
const MAX_FILL_MS = 60 * 60 * 1000;

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.warn("TURNSTILE_SECRET_KEY not set; skipping verification");
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

async function claimTrustedForm(certUrl: string, email: string): Promise<void> {
  const key = process.env.TRUSTEDFORM_API_KEY;
  if (!key || !certUrl) return;
  try {
    await fetch("https://api.trustedform.com/certificates/claim", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`API:${key}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cert: { url: certUrl },
        reference: `lander-lead:${email}`,
        vendor: "The Torts Attorney",
      }),
    });
  } catch (err) {
    console.error("TrustedForm claim failed:", err);
  }
}

export async function submitLead(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = leadSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    zip: formData.get("zip"),
    campaign: formData.get("campaign"),
    description: formData.get("description") ?? "",
    consent: formData.get("consent"),
    company: formData.get("company") ?? "",
    ts: formData.get("ts"),
    certUrl: formData.get("xxTrustedFormCertUrl") ?? "",
    certToken: formData.get("xxTrustedFormToken") ?? "",
    turnstileToken: formData.get("cf-turnstile-response") ?? "",
  });

  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Please check the form and try again.";
    return { ok: false, error: msg };
  }

  const lead = parsed.data;

  if (lead.company) return { ok: true };

  const elapsed = Date.now() - lead.ts;
  if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
    return { ok: false, error: "Submission rejected. Please try again." };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";

  const human = await verifyTurnstile(lead.turnstileToken, ip);
  if (!human) {
    return { ok: false, error: "Verification failed. Please refresh and try again." };
  }

  const submittedAt = new Date().toISOString();
  await claimTrustedForm(lead.certUrl, lead.email);

  const e = escapeHtml;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top">${label}</td><td style="padding:6px 12px">${value || "&mdash;"}</td></tr>`;

  const notifyHtml = `
    <h2 style="font-family:sans-serif">New intake lead &mdash; ${e(lead.campaign)}</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${row("Name", `${e(lead.firstName)} ${e(lead.lastName)}`)}
      ${row("Email", e(lead.email))}
      ${row("Phone", e(lead.phone))}
      ${row("ZIP", e(lead.zip))}
      ${row("Campaign", e(lead.campaign))}
      ${row("Description", e(lead.description).replace(/\n/g, "<br>"))}
      ${row("TrustedForm cert", lead.certUrl ? `<a href="${e(lead.certUrl)}">${e(lead.certUrl)}</a>` : "(not captured)")}
      ${row("TrustedForm token", e(lead.certToken))}
      ${row("Submitted", submittedAt)}
      ${row("IP", e(ip))}
    </table>`;

  const confirmHtml = `
    <div style="font-family:sans-serif;max-width:560px">
      <h2>We received your request</h2>
      <p>Hi ${e(lead.firstName)},</p>
      <p>We received your request regarding <strong>${e(lead.campaign)}</strong>. Our team will review your information and reach out if you may qualify. There is no cost and no obligation.</p>
      <p style="color:#666;font-size:13px">The Torts Attorney &mdash; attorney advertising. This is not a guarantee of outcome.</p>
    </div>`;

  const notifyTo = process.env.CONTACT_NOTIFICATION_EMAIL;
  try {
    if (notifyTo) {
      await sendMail({
        to: notifyTo,
        subject: `New lead: ${lead.campaign} — ${lead.firstName} ${lead.lastName}`,
        html: notifyHtml,
        replyTo: lead.email,
      });
    }
    await sendMail({
      to: lead.email,
      subject: "We received your free case review request",
      html: confirmHtml,
    });
  } catch (err) {
    console.error("Lead email failed:", err);
    return { ok: false, error: "Something went wrong sending your request. Please try again." };
  }

  return { ok: true };
}
