/**
 * Inventory reservation & decrement. Operates inside a transaction with row
 * locks (SELECT ... FOR UPDATE) to prevent oversell under concurrency.
 *
 * MVP policy: if a product has no inventory row it is treated as made-to-order
 * (unlimited) and skipped — so the store still functions before stock is loaded.
 */
import { and, eq, isNull } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { productInventory } from "../../shared/schema";
import type { ResolvedLineItem } from "./pricing";
import * as schema from "../../shared/schema";

type Tx = NodePgDatabase<typeof schema>;

export class InventoryError extends Error {
  status = 409;
}

function whereInv(productId: string, variantId?: string) {
  return variantId
    ? and(eq(productInventory.productId, productId), eq(productInventory.variantId, variantId))
    : and(eq(productInventory.productId, productId), isNull(productInventory.variantId));
}

/** Reserve stock for each line item; throws InventoryError if insufficient. */
export async function reserveStock(tx: Tx, items: ResolvedLineItem[]): Promise<void> {
  for (const item of items) {
    const [row] = await tx
      .select()
      .from(productInventory)
      .where(whereInv(item.productId, item.variantId))
      .for("update");

    if (!row) continue; // made-to-order: no tracked stock

    const free = (row.quantityAvailable ?? 0) - (row.quantityReserved ?? 0);
    if (free < item.quantity) {
      throw new InventoryError(`Insufficient stock for ${item.productSku}`);
    }
    await tx
      .update(productInventory)
      .set({ quantityReserved: (row.quantityReserved ?? 0) + item.quantity, updatedAt: new Date() })
      .where(eq(productInventory.id, row.id));
  }
}

/** On successful payment: convert reservations into actual decrements. */
export async function decrementStock(
  tx: Tx,
  items: Array<{ productId: string; variantId?: string | null; quantity: number }>,
): Promise<void> {
  for (const item of items) {
    const [row] = await tx
      .select()
      .from(productInventory)
      .where(whereInv(item.productId, item.variantId ?? undefined))
      .for("update");

    if (!row) continue;

    const available = Math.max(0, (row.quantityAvailable ?? 0) - item.quantity);
    const reserved = Math.max(0, (row.quantityReserved ?? 0) - item.quantity);
    await tx
      .update(productInventory)
      .set({ quantityAvailable: available, quantityReserved: reserved, updatedAt: new Date() })
      .where(eq(productInventory.id, row.id));
  }
}
