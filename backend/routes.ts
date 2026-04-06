import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from "nodemailer";
import Stripe from "stripe";

// Cache transporter and Stripe client (O(1) reuse instead of recreating each request)
let cachedTransporter: any = null;
let cachedStripe: Stripe | null = null;

// Create Gmail transporter once and cache it
const getGmailTransporter = () => {
  if (cachedTransporter) return cachedTransporter;
  
  const gmailUser = process.env.GMAIL_USER || "meyaarjewellers@gmail.com";
  const gmailPassword = process.env.GMAIL_APP_PASSWORD;

  if (!gmailPassword) {
    console.warn(
      "⚠️  GMAIL_APP_PASSWORD not set. Email sending will not work. " +
      "Set GMAIL_APP_PASSWORD environment variable."
    );
    return null;
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
  });
  
  return cachedTransporter;
};

// Get Stripe client once and cache it
const getStripe = () => {
  if (cachedStripe) return cachedStripe;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return null;
  cachedStripe = new Stripe(stripeKey);
  return cachedStripe;
};



export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Contact form endpoint - Fire and forget emails for O(1) response time
  app.post("/api/contact", (req, res) => {
    try {
      const { name, email, message } = req.body;

      // Validate input
      if (!name || !email || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Send immediate response (O(1))
      res.json({
        success: true,
        message: "Your message has been sent successfully!",
      });

      // Send emails in background (non-blocking)
      (async () => {
        try {
          const transporter = getGmailTransporter();
          if (!transporter) {
            console.warn("Email service not configured");
            return;
          }

          const mailOptions = {
            from: `"${name}" <meyaarjewellers@gmail.com>`,
            to: "meyaarjewellers@gmail.com",
            replyTo: email,
            subject: `New Contact Message from ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, "<br>")}</p>
              <hr>
              <p><em>Sent at ${new Date().toLocaleString()}</em></p>
            `,
          };

          const confirmationEmail = {
            from: "meyaarjewellers@gmail.com",
            to: email,
            subject: "We received your message - Meyaar Jewellers",
            html: `
              <h2>Thank you for contacting Meyaar Jewellers!</h2>
              <p>Hello ${name},</p>
              <p>We've received your message and will get back to you as soon as possible.</p>
              <p>Best regards,<br>Meyaar Jewellers Team</p>
            `,
          };

          // Send both emails in parallel
          await Promise.all([
            transporter.sendMail(mailOptions),
            transporter.sendMail(confirmationEmail),
          ]);
        } catch (error) {
          console.error("Background error sending emails:", error);
        }
      })();
    } catch (error) {
      console.error("Error in contact endpoint:", error);
      res.status(500).json({
        error: "Failed to process message. Please try again later.",
      });
    }
  });

  // Stripe Tax Calculation endpoint

  // Stripe Tax Calculation endpoint
  app.post("/api/calculate-tax", async (req, res) => {
    try {
      const { zipCode, subtotal } = req.body;

      // Validate input
      if (!zipCode || !subtotal) {
        return res.status(400).json({ error: "Missing zipCode or subtotal" });
      }

      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({
          error: "Stripe API key not configured",
        });
      }

      // Use Stripe Tax API for accurate tax calculations
      const taxCalculation = await stripe.tax.calculations.create({
        currency: "usd",
        customer_details: {
          address: {
            postal_code: zipCode,
            country: "US",
          },
          address_source: "shipping",
        },
        line_items: [
          {
            amount: Math.round(subtotal * 100), // Convert to cents
            reference: "order_item_1", // Unique reference for this line item
            // Note: Not specifying tax_code uses general physical goods
          },
        ],
      });

      // Extract tax amount from Stripe response
      const taxAmount = taxCalculation.tax_amount_exclusive
        ? taxCalculation.tax_amount_exclusive / 100
        : 0; // Convert from cents to dollars

      res.json({
        success: true,
        tax: taxAmount,
        taxRate:
          subtotal > 0
            ? (taxAmount / subtotal * 100).toFixed(3)
            : "0.000",
        calculation_id: taxCalculation.id,
        source: "stripe",
      })
    } catch (error) {
      console.error("Error in tax calculation endpoint:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to calculate tax";
      res.status(500).json({
        error: errorMessage,
        success: false,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
