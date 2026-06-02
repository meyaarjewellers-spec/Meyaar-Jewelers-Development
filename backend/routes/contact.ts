/** POST /api/v1/contact — contact form. Inputs are validated and HTML-escaped. */
import { Router } from "express";
import { z } from "zod";
import nodemailer from "nodemailer";
import { validateBody } from "../middleware/validate";
import { strictLimiter } from "../middleware/security";
import { env } from "../config/env";
import { log } from "../logger";

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(255),
  message: z.string().min(1).max(5000),
});

const GMAIL_TO = env.GMAIL_USER || "meyaarjewellers@gmail.com";

let cachedTransporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  if (!env.GMAIL_APP_PASSWORD) {
    log("GMAIL_APP_PASSWORD not set — contact emails disabled.", "contact");
    return null;
  }
  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_TO, pass: env.GMAIL_APP_PASSWORD },
  });
  return cachedTransporter;
}

/** Escape HTML special characters to prevent injection into the email body. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

contactRouter.post("/contact", strictLimiter, validateBody(contactSchema), (req, res) => {
  const { name, email, message } = req.body as z.infer<typeof contactSchema>;

  // Respond immediately; send email out-of-band.
  res.json({ data: { success: true, message: "Your message has been sent successfully!" } });

  const transporter = getTransporter();
  if (!transporter) return;

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

  const toOwner = {
    from: GMAIL_TO,
    to: GMAIL_TO,
    replyTo: email,
    subject: `New Contact Message from ${safeName}`,
    html: `<h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      <p><strong>Message:</strong></p><p>${safeMessage}</p>
      <hr><p><em>Sent at ${new Date().toLocaleString()}</em></p>`,
  };
  const toCustomer = {
    from: GMAIL_TO,
    to: email,
    subject: "We received your message — Meyaar Jewellers",
    html: `<h2>Thank you for contacting Meyaar Jewellers!</h2>
      <p>Hello ${safeName},</p>
      <p>We've received your message and will get back to you as soon as possible.</p>
      <p>Best regards,<br>Meyaar Jewellers Team</p>`,
  };

  Promise.all([transporter.sendMail(toOwner), transporter.sendMail(toCustomer)]).catch((err) =>
    log(`contact email failed: ${(err as Error).message}`, "contact"),
  );
});
