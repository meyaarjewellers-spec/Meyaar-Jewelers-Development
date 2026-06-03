import React, { createContext, useContext, useEffect, useState } from "react";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "necklaces" | "bracelets" | "earrings";
}

interface WishlistContextType {
  items: WishlistItem[];
  has: (id: string) => boolean;
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
const KEY = "meyaar_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch {
      setItems([]);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, loaded]);

  const has = (id: string) => items.some((i) => i.id === id);
  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const toggle = (item: WishlistItem) =>
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]));

  return (
    <WishlistContext.Provider value={{ items, has, toggle, remove, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
