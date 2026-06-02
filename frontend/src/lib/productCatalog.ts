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
