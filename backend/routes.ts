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

  // Stripe Payment Intent endpoint
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, currency = "usd", cardNumber, expiryDate, cvc } = req.body;

      // Validate input
      if (!amount || !cardNumber || !expiryDate || !cvc) {
        return res.status(400).json({ 
          message: "Missing required payment fields" 
        });
      }

      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({
          message: "Stripe API key not configured",
        });
      }

      // Parse expiry date (MM/YY format)
      const [month, year] = expiryDate.split("/");
      const expYear = parseInt("20" + year);
      const expMonth = parseInt(month);

      // Create a payment method token using card details
      try {
        const token = await stripe.tokens.create({
          card: {
            number: cardNumber,
            exp_month: expMonth.toString(),
            exp_year: expYear.toString(),
            cvc: cvc,
          },
        });

        // Create Charge directly (simplified version)
        const charge = await stripe.charges.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency,
          source: token.id,
          description: "Meyaar Jewellers Order",
        });

        // Return success with payment ID
        res.json({
          success: true,
          paymentId: charge.id,
          amount: charge.amount / 100,
          status: charge.status,
          message: "Payment processed successfully",
        });
      } catch (stripeError: any) {
        console.error("Stripe card error:", stripeError);
        const message = stripeError.message || "Card was declined";
        res.status(400).json({
          success: false,
          message: message,
        });
      }
    } catch (error) {
      console.error("Error in payment endpoint:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process payment";
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  });

  // Google Pay endpoint
  app.post("/api/process-google-pay", async (req, res) => {
    try {
      const { paymentToken, amount, currency = "usd" } = req.body;

      // Validate input
      if (!paymentToken || !amount) {
        return res.status(400).json({
          message: "Missing payment token or amount",
        });
      }

      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({
          message: "Stripe API key not configured",
        });
      }

      try {
        // Parse the Google Pay token to extract the Stripe payment method ID
        let paymentMethodId: string;
        
        try {
          const tokenData = JSON.parse(paymentToken);
          paymentMethodId = tokenData.paymentMethodData?.tokenizationData?.token || paymentToken;
        } catch {
          // If parsing fails, use the token as-is
          paymentMethodId = paymentToken;
        }

        // Create a charge using the payment method
        const charge = await stripe.charges.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency,
          source: paymentMethodId,
          description: "Meyaar Jewellers Order - Google Pay",
        });

        // Return success with payment ID
        res.json({
          success: true,
          paymentId: charge.id,
          amount: charge.amount / 100,
          status: charge.status,
          message: "Payment processed successfully",
        });
      } catch (stripeError: any) {
        console.error("Stripe Google Pay error:", stripeError);
        const message = stripeError.message || "Payment was declined";
        res.status(400).json({
          success: false,
          message: message,
        });
      }
    } catch (error) {
      console.error("Error in Google Pay endpoint:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process Google Pay payment";
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  });

  // Apple Pay merchant validation endpoint
  app.post("/api/validate-apple-pay", async (req, res) => {
    try {
      const { validationURL } = req.body;

      if (!validationURL) {
        return res.status(400).json({
          message: "Missing validation URL",
        });
      }

      // For development, return a mock merchant session
      // In production, you would call Apple's servers with your merchant certificate
      const merchantSession = {
        epochTimestamp: Date.now(),
        expiresAt: Date.now() + 900000, // 15 minutes
        merchantSessionIdentifier: "MERCHANT_SESSION_" + Date.now(),
        nonce: Math.random().toString(36).substring(7),
        merchantIdentifier: "merchant.com.meyaarjewellers",
        domainName: window?.location?.hostname || "localhost",
        signature: "TEST_SIGNATURE",
      };

      res.json({ merchantSession });
    } catch (error) {
      console.error("Error in Apple Pay validation:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to validate Apple Pay merchant";
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  });

  // Apple Pay payment processing endpoint
  app.post("/api/process-apple-pay", async (req, res) => {
    try {
      const { paymentToken, amount, currency = "usd" } = req.body;

      if (!paymentToken || !amount) {
        return res.status(400).json({
          message: "Missing payment token or amount",
        });
      }

      const stripe = getStripe();
      if (!stripe) {
        return res.status(500).json({
          message: "Stripe API key not configured",
        });
      }

      try {
        // Parse the Apple Pay token if needed
        let paymentMethodId: string;

        if (typeof paymentToken === "string") {
          try {
            const tokenData = JSON.parse(paymentToken);
            paymentMethodId = tokenData.paymentData?.token || paymentToken;
          } catch {
            paymentMethodId = paymentToken;
          }
        } else {
          paymentMethodId = JSON.stringify(paymentToken);
        }

        // Create a charge using the payment method
        const charge = await stripe.charges.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency,
          source: paymentMethodId,
          description: "Meyaar Jewellers Order - Apple Pay",
        });

        // Return success with payment ID
        res.json({
          success: true,
          paymentId: charge.id,
          amount: charge.amount / 100,
          status: charge.status,
          message: "Payment processed successfully",
        });
      } catch (stripeError: any) {
        console.error("Stripe Apple Pay error:", stripeError);
        const message = stripeError.message || "Payment was declined";
        res.status(400).json({
          success: false,
          message: message,
        });
      }
    } catch (error) {
      console.error("Error in Apple Pay endpoint:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process Apple Pay payment";
      res.status(500).json({
        success: false,
        message: errorMessage,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
