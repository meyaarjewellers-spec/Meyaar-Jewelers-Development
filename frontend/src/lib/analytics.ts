/**
 * GA4 analytics with consent gating. No-ops entirely until BOTH a measurement
 * ID (VITE_GA4_ID) is set AND the user has granted consent. Safe to call the
 * tracking helpers anywhere — they simply do nothing when analytics is off.
 */
const GA_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const CONSENT_KEY = "meyaar_consent";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

let initialized = false;

export function hasConsent(): boolean {
  return typeof localStorage !== "undefined" && localStorage.getItem(CONSENT_KEY) === "granted";
}

export function setConsent(granted: boolean) {
  localStorage.setItem(CONSENT_KEY, granted ? "granted" : "denied");
  if (granted) initAnalytics();
}

export function consentDecided(): boolean {
  return typeof localStorage !== "undefined" && localStorage.getItem(CONSENT_KEY) !== null;
}

/** Load gtag.js once, after consent. */
export function initAnalytics() {
  if (initialized || !GA_ID || !hasConsent()) return;
  initialized = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });
}

function track(event: string, params: Record<string, any> = {}) {
  if (!initialized || !window.gtag) return;
  window.gtag("event", event, params);
}

// ---- Page + ecommerce events ----
export function trackPageView(path: string) {
  if (!initialized || !window.gtag || !GA_ID) return;
  window.gtag("event", "page_view", { page_path: path, page_location: window.location.href });
}

export function trackViewItem(item: { id: string; name: string; price: number; category?: string }) {
  track("view_item", {
    currency: "USD",
    value: item.price,
    items: [{ item_id: item.id, item_name: item.name, item_category: item.category, price: item.price }],
  });
}

export function trackAddToCart(item: { id: string; name: string; price: number; quantity?: number }) {
  track("add_to_cart", {
    currency: "USD",
    value: item.price * (item.quantity ?? 1),
    items: [{ item_id: item.id, item_name: item.name, price: item.price, quantity: item.quantity ?? 1 }],
  });
}

export function trackBeginCheckout(value: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) {
  track("begin_checkout", {
    currency: "USD",
    value,
    items: items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price, quantity: i.quantity })),
  });
}

export function trackPurchase(orderNumber: string, value: number) {
  track("purchase", { transaction_id: orderNumber, currency: "USD", value });
}

export const analyticsConfigured = Boolean(GA_ID);
