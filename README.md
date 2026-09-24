# Torts Link

Standalone victim-intake lander for The Torts Attorney, served at tortslink.com.
Separate from thetortsattorney.com — noindex, no links between the two.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion · Server Actions · Nodemailer (Resend fallback) · Cloudflare Turnstile · TrustedForm

## Setup

1. `npm install`
2. `cp .env.example .env.local` and fill in values
3. Drop the logo at `public/TTA_2@4x.webp`
4. `npm run dev`

## Env vars

See `.env.example`. SMTP uses Hostinger (`smtp.hostinger.com:465`); if `RESEND_API_KEY` is
set, Resend is used as a fallback transport. TrustedForm certs are claimed server-side via
`TRUSTEDFORM_API_KEY`. Turnstile requires `tortslink.com` in the site's allowed hostnames.

## Deploy (Render)

- Build: `npm install && npm run build`
- Start: `npm start`
- Set all env vars from `.env.example` in the Render dashboard, then point tortslink.com at the service.

## URL params

`?campaign=<slug>` pre-selects the campaign (case-insensitive, e.g. `/?campaign=suboxone`).
Unknown values fall back to "Other / Not sure".
