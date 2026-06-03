/**
 * Catalog read access for the storefront.
 *
 * Uses the shared **anon** Supabase client only. Catalog tables are public-read
 * under Row-Level Security, so the browser never needs (and must never hold)
 * the service-role key. All writes/seeding happen server-side, not here.
 */
import { supabase } from './supabase';

function requireClient() {
  if (!supabase) throw new Error('Supabase client is not configured');
  return supabase;
}

interface ProductWithCategory {
  [key: string]: any;
  category?: any;
  product_images: Array<{ image_url: string; [key: string]: any }>;
}

function normalize(product: any): ProductWithCategory {
  return {
    ...product,
    category: Array.isArray(product.categories) ? product.categories[0] : product.categories,
    product_images: product.product_images || [],
  };
}

/** Map a DB product (with images + category) to the ProductCard shape. */
export function toCardProduct(p: any): {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "necklaces" | "bracelets" | "earrings";
  isLimited?: boolean;
  rating?: number;
  reviewCount?: number;
} {
  const cat = (p.category?.slug || p.categories?.slug || "").toLowerCase();
  const primary =
    p.product_images?.find((i: any) => i.is_primary)?.image_url || p.product_images?.[0]?.image_url || "";
  return {
    id: p.id,
    name: p.name,
    price: Number(p.discount_price ?? p.base_price ?? 0),
    image: primary,
    category: (["necklaces", "bracelets", "earrings"].includes(cat) ? cat : "necklaces") as any,
    isLimited: Boolean(p.is_featured),
    rating: p.average_rating ? Number(p.average_rating) : undefined,
    reviewCount: typeof p.total_reviews === "number" ? p.total_reviews : undefined,
  };
}

/** All active products with category + images. */
export async function getProductsWithImages(): Promise<ProductWithCategory[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(id, name, slug, description), product_images(*)')
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return (data || []).map(normalize);
}

/** A single product (with category + images) by id. Returns null if not found. */
export async function getProductWithImages(productId: string): Promise<ProductWithCategory | null> {
  const client = requireClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(id, name, slug, description), product_images(*)')
    .eq('id', productId)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    if (error && error.code !== 'PGRST116') console.error('Product not found:', error);
    return null;
  }
  return normalize(data);
}

/** Active products within a category (for related products). */
export async function getProductsByCategory(categoryId: string, limit = 10): Promise<ProductWithCategory[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(id, name, slug, description), product_images(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
  return (data || []).map(normalize);
}

/** Active products from other categories (for "You May Also Like"). */
export async function getProductsFromOtherCategories(excludeCategoryId: string, limit = 6): Promise<ProductWithCategory[]> {
  const client = requireClient();
  const { data, error } = await client
    .from('products')
    .select('*, categories(id, name, slug, description), product_images(*)')
    .neq('category_id', excludeCategoryId)
    .eq('is_active', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching products from other categories:', error);
    return [];
  }
  return (data || []).map(normalize);
}

/** Active categories for navigation / homepage grids. */
export async function getCategories(): Promise<Array<{ id: string; name: string; slug: string; description?: string; image_url?: string }>> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, image_url')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data || [];
}

/**
 * Featured products for the homepage. Prefers `is_featured` rows; if none are
 * flagged, falls back to the most recent active products so the homepage is
 * never empty when the catalog has data.
 */
export async function getFeaturedProducts(limit = 8): Promise<ProductWithCategory[]> {
  if (!supabase) return [];
  const featured = await supabase
    .from('products')
    .select('*, categories(id, name, slug), product_images(*)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(limit);

  if (!featured.error && featured.data && featured.data.length > 0) {
    return featured.data.map(normalize);
  }

  const recent = await supabase
    .from('products')
    .select('*, categories(id, name, slug), product_images(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (recent.error) {
    console.error('Error fetching featured products:', recent.error);
    return [];
  }
  return (recent.data || []).map(normalize);
}
