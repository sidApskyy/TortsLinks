import nodemailer from "nodemailer";

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type Mail = { to: string; subject: string; html: string; replyTo?: string };

async function sendSmtp({ to, subject, html, replyTo }: Mail): Promise<void> {
  const port = Number(process.env.SMTP_PORT || 465);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    ...(process.env.SMTP_ALLOW_SELF_SIGNED === "true"
      ? { tls: { rejectUnauthorized: false } }
      : {}),
  });
  await transport.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html,
    replyTo,
  });
}

async function sendResend({ to, subject, html, replyTo }: Mail): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [to],
      subject,
      html,
      reply_to: replyTo,
    }),
  });
  if (!res.ok) throw new Error(`Resend failed: ${res.status} ${await res.text()}`);
}

export async function sendMail(mail: Mail): Promise<void> {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      await sendSmtp(mail);
      return;
    } catch (err) {
      if (!process.env.RESEND_API_KEY) throw err;
      console.error("SMTP send failed, falling back to Resend:", err);
    }
  }
  if (process.env.RESEND_API_KEY) {
    await sendResend(mail);
    return;
  }
  throw new Error("No mail transport configured");
}
