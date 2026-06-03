/** POST /api/v1/newsletter — capture an email subscriber (server-side). */
import { Router } from "express";
import { z } from "zod";
import { getDb } from "../db";
import { newsletterSubscribers } from "../../shared/schema";
import { validateBody } from "../middleware/validate";
import { strictLimiter } from "../middleware/security";
import { sendEmail, newsletterWelcomeEmail } from "../services/email";
import { log } from "../logger";

export const newsletterRouter = Router();

const schema = z.object({
  email: z.string().email().max(255),
  source: z.string().max(50).optional(),
});

newsletterRouter.post("/newsletter", strictLimiter, validateBody(schema), async (req, res, next) => {
  try {
    const { email, source } = req.body as z.infer<typeof schema>;
    const db = getDb();

    // Idempotent: re-subscribing the same email is a no-op success.
    const inserted = await db
      .insert(newsletterSubscribers)
      .values({ email: email.toLowerCase(), source: source ?? "site" })
      .onConflictDoNothing({ target: newsletterSubscribers.email })
      .returning();

    // Send the welcome email only to brand-new subscribers.
    if (inserted.length > 0) {
      void sendEmail(newsletterWelcomeEmail(email)).catch((err) =>
        log(`welcome email error: ${(err as Error).message}`, "newsletter"),
      );
    }

    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});
