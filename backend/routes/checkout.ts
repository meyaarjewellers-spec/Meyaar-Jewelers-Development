/** POST /api/v1/checkout/quote — display-only server-computed price breakdown. */
import { Router } from "express";
import { z } from "zod";
import { cartLineItemSchema } from "../../shared/schema";
import { validateBody } from "../middleware/validate";
import { strictLimiter } from "../middleware/security";
import { computeBreakdown, breakdownToResponse, PricingError } from "../services/pricing";

export const checkoutRouter = Router();

const quoteSchema = z.object({
  items: z.array(cartLineItemSchema).min(1).max(50),
  couponCode: z.string().max(100).optional(),
  shippingAddress: z
    .object({ postalCode: z.string().max(20).optional(), country: z.string().max(2).optional() })
    .optional(),
});

checkoutRouter.post("/checkout/quote", strictLimiter, validateBody(quoteSchema), async (req, res, next) => {
  try {
    const { items, couponCode, shippingAddress } = req.body as z.infer<typeof quoteSchema>;
    const breakdown = await computeBreakdown(items, couponCode, shippingAddress);
    res.json({ data: breakdownToResponse(breakdown) });
  } catch (err) {
    if (err instanceof PricingError) return res.status(err.status).json({ error: { message: err.message } });
    next(err);
  }
});
