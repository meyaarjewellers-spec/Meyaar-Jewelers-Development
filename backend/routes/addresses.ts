/**
 * Address book — saved shipping addresses for authenticated users.
 *   GET    /api/v1/addresses
 *   POST   /api/v1/addresses
 *   PUT    /api/v1/addresses/:id
 *   DELETE /api/v1/addresses/:id
 * Every row is scoped to the caller's user id; you can never touch another user's.
 */
import { Router } from "express";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../db";
import { userAddresses } from "../../shared/schema";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";

export const addressesRouter = Router();

const addressSchema = z.object({
  fullName: z.string().min(1).max(255),
  phone: z.string().max(30).optional(),
  line1: z.string().min(1).max(255),
  line2: z.string().max(255).optional(),
  city: z.string().min(1).max(120),
  state: z.string().max(120).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2).default("US"),
  isDefault: z.boolean().optional(),
});

function serialize(a: typeof userAddresses.$inferSelect) {
  return {
    id: a.id,
    fullName: a.fullName,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    postalCode: a.postalCode,
    country: a.country,
    isDefault: a.isDefault,
  };
}

addressesRouter.get("/addresses", requireAuth, async (req, res, next) => {
  try {
    const db = getDb();
    const rows = await db
      .select()
      .from(userAddresses)
      .where(eq(userAddresses.userId, req.userId!))
      .orderBy(desc(userAddresses.isDefault), desc(userAddresses.createdAt));
    res.json({ data: { addresses: rows.map(serialize) } });
  } catch (err) {
    next(err);
  }
});

addressesRouter.post("/addresses", requireAuth, validateBody(addressSchema), async (req, res, next) => {
  try {
    const db = getDb();
    const body = req.body as z.infer<typeof addressSchema>;

    // First saved address is the default; or honor an explicit isDefault.
    const existing = await db.select({ id: userAddresses.id }).from(userAddresses).where(eq(userAddresses.userId, req.userId!));
    const makeDefault = body.isDefault || existing.length === 0;
    if (makeDefault) {
      await db.update(userAddresses).set({ isDefault: false }).where(eq(userAddresses.userId, req.userId!));
    }

    const [created] = await db
      .insert(userAddresses)
      .values({ ...body, userId: req.userId!, isDefault: makeDefault })
      .returning();
    res.status(201).json({ data: { address: serialize(created) } });
  } catch (err) {
    next(err);
  }
});

addressesRouter.put("/addresses/:id", requireAuth, validateBody(addressSchema.partial()), async (req, res, next) => {
  try {
    const id = z.string().uuid().safeParse(req.params.id);
    if (!id.success) return res.status(400).json({ error: { message: "Invalid id" } });
    const db = getDb();
    const body = req.body as Partial<z.infer<typeof addressSchema>>;

    if (body.isDefault) {
      await db.update(userAddresses).set({ isDefault: false }).where(eq(userAddresses.userId, req.userId!));
    }
    const [updated] = await db
      .update(userAddresses)
      .set({ ...body, updatedAt: new Date() })
      .where(and(eq(userAddresses.id, id.data), eq(userAddresses.userId, req.userId!)))
      .returning();
    if (!updated) return res.status(404).json({ error: { message: "Address not found" } });
    res.json({ data: { address: serialize(updated) } });
  } catch (err) {
    next(err);
  }
});

addressesRouter.delete("/addresses/:id", requireAuth, async (req, res, next) => {
  try {
    const id = z.string().uuid().safeParse(req.params.id);
    if (!id.success) return res.status(400).json({ error: { message: "Invalid id" } });
    const db = getDb();
    await db.delete(userAddresses).where(and(eq(userAddresses.id, id.data), eq(userAddresses.userId, req.userId!)));
    res.json({ data: { success: true } });
  } catch (err) {
    next(err);
  }
});
