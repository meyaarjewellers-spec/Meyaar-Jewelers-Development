/** Client for the saved-address (address book) API. Sends the Supabase JWT. */
import { supabase } from "./supabase";

const API = import.meta.env.VITE_API_BASE_URL || "";

export interface Address {
  id: string;
  fullName: string;
  phone?: string | null;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export type AddressInput = Omit<Address, "id" | "isDefault"> & { isDefault?: boolean };

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
  const res = await fetch(`${API}/api/v1${path}`, { method, headers: await headers(), body: body ? JSON.stringify(body) : undefined });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || `Request failed (${res.status})`);
  return json.data as T;
}

export const addressApi = {
  list: () => req<{ addresses: Address[] }>("/addresses").then((d) => d.addresses),
  create: (a: AddressInput) => req<{ address: Address }>("/addresses", "POST", a).then((d) => d.address),
  update: (id: string, a: Partial<AddressInput>) => req<{ address: Address }>(`/addresses/${id}`, "PUT", a).then((d) => d.address),
  remove: (id: string) => req(`/addresses/${id}`, "DELETE"),
};
