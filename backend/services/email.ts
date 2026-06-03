/**
 * Transactional email. Provider precedence: Resend (production) → Gmail/SMTP
 * (dev) → console (no-op). Callers never block on delivery; failures are logged.
 */
import nodemailer from "nodemailer";
import { env } from "../config/env";
import { log } from "../logger";
import { centsToMajor } from "./money";

const FROM = env.EMAIL_FROM || env.GMAIL_USER || "Meyaar Jewellers <meyaarjewellers@gmail.com>";

let smtp: nodemailer.Transporter | null = null;
function getSmtp(): nodemailer.Transporter | null {
  if (smtp) return smtp;
  if (!env.GMAIL_APP_PASSWORD) return null;
  smtp = nodemailer.createTransport({
    service: "gmail",
    auth: { user: env.GMAIL_USER || "meyaarjewellers@gmail.com", pass: env.GMAIL_APP_PASSWORD },
  });
  return smtp;
}

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/** Send an email via the best available provider. Resolves even on failure. */
export async function sendEmail(msg: EmailMessage): Promise<{ ok: boolean; provider: string }> {
  // 1) Resend (HTTP API — no SDK dependency).
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: FROM, to: msg.to, subject: msg.subject, html: msg.html, reply_to: msg.replyTo }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
      return { ok: true, provider: "resend" };
    } catch (err) {
      log(`Resend send failed: ${(err as Error).message}`, "email");
    }
  }

  // 2) Gmail/SMTP.
  const transport = getSmtp();
  if (transport) {
    try {
      await transport.sendMail({ from: FROM, to: msg.to, subject: msg.subject, html: msg.html, replyTo: msg.replyTo });
      return { ok: true, provider: "smtp" };
    } catch (err) {
      log(`SMTP send failed: ${(err as Error).message}`, "email");
    }
  }

  // 3) No provider configured.
  log(`email not sent (no provider configured): "${msg.subject}" → ${msg.to}`, "email");
  return { ok: false, provider: "none" };
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------
const BRAND = "#a76244";

function shell(title: string, body: string): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#2b2b2b">
    <div style="background:${BRAND};color:#fff;padding:28px;text-align:center">
      <h1 style="margin:0;font-family:Georgia,serif;font-weight:500;font-size:24px">Meyaar Jewellers</h1>
    </div>
    <div style="padding:28px 24px">
      <h2 style="font-family:Georgia,serif;font-weight:500">${title}</h2>
      ${body}
    </div>
    <div style="padding:18px;text-align:center;color:#999;font-size:12px;border-top:1px solid #eee">
      Handcrafted with care · Meyaar Jewellers
    </div>
  </div>`;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName?: string;
  items: Array<{ productName: string; quantity: number; unitPriceCents: number }>;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  currency: string;
}

export function orderConfirmationEmail(to: string, d: OrderEmailData): EmailMessage {
  const fmt = (c: number) => `$${centsToMajor(c).toFixed(2)}`;
  const rows = d.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0">${i.productName} × ${i.quantity}</td><td style="padding:8px 0;text-align:right">${fmt(
          i.unitPriceCents * i.quantity,
        )}</td></tr>`,
    )
    .join("");
  const line = (label: string, c: number) =>
    `<tr><td style="padding:4px 0;color:#666">${label}</td><td style="padding:4px 0;text-align:right">${fmt(c)}</td></tr>`;

  const body = `
    <p>Hi ${d.customerName || "there"}, thank you for your order — we're preparing it with care.</p>
    <p style="background:#f7f1ec;padding:10px 14px;border-radius:8px">Order <strong>${d.orderNumber}</strong></p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px">
      ${rows}
      <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:10px 0"></td></tr>
      ${line("Subtotal", d.subtotalCents)}
      ${d.discountCents > 0 ? line("Discount", -d.discountCents) : ""}
      ${line("Shipping", d.shippingCents)}
      ${line("Tax", d.taxCents)}
      <tr><td style="padding:8px 0;font-weight:700">Total</td><td style="padding:8px 0;text-align:right;font-weight:700">${fmt(
        d.totalCents,
      )}</td></tr>
    </table>
    <p style="margin-top:18px">We'll email you tracking details once your order ships (1–2 business days).</p>`;

  return { to, subject: `Your Meyaar order ${d.orderNumber} is confirmed`, html: shell("Order Confirmed", body) };
}

export function newsletterWelcomeEmail(to: string): EmailMessage {
  const body = `
    <p>Welcome to the Meyaar circle ✨</p>
    <p>As a thank you, here's <strong>15% off</strong> your first order with code <strong>WELCOME15</strong>.</p>
    <p>You'll be first to hear about new limited-edition releases and artisan stories.</p>`;
  return { to, subject: "Welcome to Meyaar — here's 15% off", html: shell("Welcome", body) };
}
