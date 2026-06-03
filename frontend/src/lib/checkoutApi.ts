/**
 * Typed client for the server-authoritative checkout API. The browser sends only
 * product IDs + quantities; the server computes and returns the totals.
 */
import { supabase } from "./supabase";

const API = import.meta.env.VITE_API_BASE_URL || "";

export interface CheckoutItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface GuestDetails {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ShippingAddress {
  fullName?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  status: string;
  currency: string;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  items: Array<{ productId: string; name: string; sku: string; unitPrice: number; quantity: number; lineTotal: number }>;
}

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const { data } = (await supabase?.auth.getSession?.()) ?? { data: null };
    const token = data?.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    // No session → guest checkout.
  }
  return headers;
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}/api/v1${path}`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.error?.message || `Request failed (${res.status})`);
  }
  return json.data as T;
}

/** Create a pending order; the server computes the authoritative totals. */
export function createOrder(input: {
  items: CheckoutItem[];
  couponCode?: string;
  guest?: GuestDetails;
  shippingAddress?: ShippingAddress;
}): Promise<OrderResponse> {
  return post<OrderResponse>("/orders", input);
}

/** Create a PaymentIntent for an existing order; returns the client secret. */
export function createPaymentIntent(orderId: string): Promise<{ clientSecret: string; paymentIntentId: string }> {
  return post("/payments/intent", { orderId });
}

/** Optional: fetch a price preview without creating an order. */
export function getQuote(input: { items: CheckoutItem[]; couponCode?: string; shippingAddress?: { postalCode?: string; country?: string } }) {
  return post<Omit<OrderResponse, "orderId" | "orderNumber" | "status">>("/checkout/quote", input);
}

// ---- Newsletter ----
export function subscribeNewsletter(email: string, source = "site"): Promise<{ success: boolean }> {
  return post("/newsletter", { email, source });
}

// ---- Reviews ----
export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title?: string | null;
  content: string;
  isVerifiedPurchase: boolean;
  date: string;
}

export async function fetchReviews(productId: string): Promise<{ average: number; count: number; reviews: ReviewItem[] }> {
  const res = await fetch(`${API}/api/v1/products/${productId}/reviews`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || "Failed to load reviews");
  return json.data;
}

export function submitReview(
  productId: string,
  input: { authorName: string; rating: number; title?: string; content: string },
): Promise<ReviewItem> {
  return post(`/products/${productId}/reviews`, input);
}

// ---- Account ----
export interface AccountOrder {
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
}

export async function fetchMyOrders(): Promise<AccountOrder[]> {
  const res = await fetch(`${API}/api/v1/orders/mine`, { headers: await authHeaders() });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || "Failed to load orders");
  return json.data.orders;
}
