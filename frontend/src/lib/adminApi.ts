/** Client for the admin API. All calls send the Supabase JWT. */
import { supabase } from "./supabase";

const API = import.meta.env.VITE_API_BASE_URL || "";

async function headers(): Promise<Record<string, string>> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  try {
    const { data } = (await supabase?.auth.getSession?.()) ?? { data: null };
    const token = data?.session?.access_token;
    if (token) h.Authorization = `Bearer ${token}`;
  } catch {
    /* no session */
  }
  return h;
}

async function req<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${API}/api/v1${path}`, {
    method,
    headers: await headers(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `Request failed (${res.status})`);
  return json.data as T;
}

export const adminApi = {
  me: () => req<{ isAdmin: boolean }>("/admin/me"),
  stats: () => req<{ orders: number; revenue: number; products: number; subscribers: number; pendingReviews: number }>("/admin/stats"),
  orders: () => req<{ orders: AdminOrder[] }>("/admin/orders").then((d) => d.orders),
  setOrderStatus: (id: string, status: string) => req(`/admin/orders/${id}`, "PATCH", { status }),
  products: () => req<{ products: AdminProduct[] }>("/admin/products").then((d) => d.products),
  updateProduct: (id: string, patch: Partial<Pick<AdminProduct, "isActive" | "isFeatured" | "basePrice" | "discountPrice">>) =>
    req(`/admin/products/${id}`, "PATCH", patch),
  reviews: () => req<{ reviews: AdminReview[] }>("/admin/reviews").then((d) => d.reviews),
  setReviewStatus: (id: string, status: string) => req(`/admin/reviews/${id}`, "PATCH", { status }),
  subscribers: () => req<{ subscribers: AdminSubscriber[] }>("/admin/subscribers").then((d) => d.subscribers),
};

export interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  guestEmail?: string | null;
  guestName?: string | null;
  createdAt: string;
  items: Array<{ name: string; quantity: number; unitPrice: number }>;
}
export interface AdminProduct {
  id: string;
  name: string;
  sku: string;
  basePrice: number;
  discountPrice: number | null;
  isActive: boolean;
  isFeatured: boolean;
  stock: number | null;
}
export interface AdminReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string | null;
  content: string;
  status: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}
export interface AdminSubscriber {
  id: string;
  email: string;
  source: string | null;
  createdAt: string;
}
