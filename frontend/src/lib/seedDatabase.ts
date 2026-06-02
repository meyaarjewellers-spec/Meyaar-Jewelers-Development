import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { PRODUCT_IMAGE_MAPPING } from './productImageMapping';

interface ProductToCreate {
  category_id: string;
  sku: string;
  name: string;
  description: string;
  base_price: number;
  material?: string;
  gemstone_type?: string;
}

// Singleton admin client - created once and reused everywhere
let adminClient: any = null;

function getAdminClient() {
  // Return existing admin client if already created (singleton pattern)
  if (adminClient) {
    return adminClient;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('⚠️ Service role key not available, using regular client');
    adminClient = supabase;
    return adminClient;
  }
  
  // Create once and cache
  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
  
  return adminClient;
}

/**
 * Seed sample jewelry products to database
 * Call this once to populate initial product data
 */
export async function seedProducts() {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  try {
    // First, create sample categories
    const categories = [
      { name: 'Necklaces', slug: 'necklaces', description: 'Elegant necklaces and pendants' },
      { name: 'Bracelets', slug: 'bracelets', description: 'Stunning bracelets and bangles' },
      { name: 'Earrings', slug: 'earrings', description: 'Gorgeous earrings for all styles' },
    ];

    const categoryMap: Record<string, string> = {};

    // Create/fetch categories and map by name
    for (const cat of categories) {
      // Try to insert, but if it already exists, just fetch it
      const { data: insertData, error: insertError } = await adminClient
        .from('categories')
        .insert([cat])
        .select('id')
        .single();

      if (insertError && !insertError.message.includes('duplicate')) {
        console.warn(`Category insert error for ${cat.name}:`, insertError);
      }

      if (insertData) {
        categoryMap[cat.name] = insertData.id;
      } else {
        // If insert failed, fetch the existing category
        const { data: fetchData } = await adminClient
          .from('categories')
          .select('id')
          .eq('name', cat.name)
          .single();
        if (fetchData) {
          categoryMap[cat.name] = fetchData.id;
        }
      }
    }

    // Sample products
    const products: ProductToCreate[] = [
      // Necklaces
      {
        category_id: categoryMap['Necklaces'] || '',
        sku: 'NECK-001',
        name: 'Emerald Pearl Layered Necklace',
        description: 'An exquisite handcrafted necklace featuring luminous pearls and emerald green crystal beads in a sophisticated multi-strand design.',
        base_price: 189,
      },
      {
        category_id: categoryMap['Necklaces'] || '',
        sku: 'NECK-002',
        name: 'Green Beaded Multi-Strand Necklace',
        description: 'Beautiful multi-strand necklace with green beads in an elegant design.',
        base_price: 165,
      },
      // Bracelets
      {
        category_id: categoryMap['Bracelets'] || '',
        sku: 'BRACE-001',
        name: 'Double Pearl Bracelet',
        description: 'Elegant double pearl bracelet for any occasion.',
        base_price: 95,
      },
      {
        category_id: categoryMap['Bracelets'] || '',
        sku: 'BRACE-002',
        name: 'Pearl Branch Bracelet',
        description: 'Sophisticated pearl branch bracelet with intricate detailing.',
        base_price: 115,
      },
      {
        category_id: categoryMap['Bracelets'] || '',
        sku: 'BRACE-003',
        name: 'Pink & Pearl Statement Bracelet',
        description: 'Bold statement bracelet combining pink accents with pearls.',
        base_price: 135,
      },
      {
        category_id: categoryMap['Bracelets'] || '',
        sku: 'BRACE-004',
        name: 'Fuchsia Pearl Cluster Bracelet',
        description: 'Eye-catching fuchsia pearl cluster bracelet.',
        base_price: 125,
      },
      // Earrings
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-001',
        name: 'Crystal Beaded Hoop Earrings',
        description: 'Modern hoop earrings with crystalline beads.',
        base_price: 89,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-002',
        name: 'Turquoise Fan Earrings',
        description: 'Vibrant turquoise fan-shaped earrings.',
        base_price: 145,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-003',
        name: 'Aqua Pearl Fan Earrings',
        description: 'Elegant aqua pearls in fan design.',
        base_price: 135,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-004',
        name: 'Vintage Bronze Flower Earrings',
        description: 'Timeless vintage-inspired bronze flower earrings.',
        base_price: 78,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-005',
        name: 'Pearl Cluster Chain Earrings',
        description: 'Dainty pearl clusters suspended from delicate chains.',
        base_price: 85,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-006',
        name: 'Gold Geometric Pearl Earrings',
        description: 'Contemporary geometric earrings with pearl accents.',
        base_price: 125,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-007',
        name: 'Pearl Chain Drop Earrings',
        description: 'Graceful pearl drops suspended by delicate chains.',
        base_price: 95,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-008',
        name: 'Pink Beaded Chain Earrings',
        description: 'Charming pink beaded chain earrings.',
        base_price: 75,
      },
      {
        category_id: categoryMap['Earrings'] || '',
        sku: 'EAR-009',
        name: 'Blue Crystal Tassel Earrings',
        description: 'Stunning blue crystal tassels for a dramatic look.',
        base_price: 85,
      },
    ];

    // Insert products with images
    const insertedProducts = [];
    for (const product of products) {
      // Skip if no valid category_id
      if (!product.category_id) {
        console.warn(`Skipping product ${product.sku} - no valid category_id`);
        continue;
      }

      const { data, error } = await adminClient
        .from('products')
        .insert([product])
        .select('id, sku')
        .single();

      if (error) {
        console.warn(`Product ${product.sku} might already exist:`, error);
        continue;
      }

      if (!data) continue;

      insertedProducts.push(data);

      // Add images for this product
      const imageFiles = PRODUCT_IMAGE_MAPPING[product.sku] || [];
      for (const imageFile of imageFiles) {
        // Build Supabase Storage public URL
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const imageUrl = `${supabaseUrl}/storage/v1/object/public/product-images/products/${imageFile}`;

        try {
          await addProductImage(data.id, imageUrl, product.sku, true);
        } catch (imgError) {
          console.warn(`Failed to add image for ${product.sku}:`, imgError);
        }
      }
    }

    console.log(`✅ Seeded ${insertedProducts.length} products`);
    return insertedProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
}

/**
 * Clear all products and categories from database
 */
export async function clearProducts() {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  try {
    // Delete product images first (foreign key constraint)
    await adminClient.from('product_images').delete().gte('created_at', '2000-01-01');
    
    // Delete products
    await adminClient.from('products').delete().gte('created_at', '2000-01-01');
    
    // Delete categories
    await adminClient.from('categories').delete().gte('created_at', '2000-01-01');
    
    console.log('✅ Cleared all products and categories');
  } catch (error) {
    console.error('Error clearing products:', error);
    throw error;
  }
}

/**
 * Add image to product
 */
export async function addProductImage(
  productId: string,
  imageUrl: string,
  altText: string,
  isPrimary: boolean = false
) {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  const { data, error } = await adminClient
    .from('product_images')
    .insert([
      {
        product_id: productId,
        image_url: imageUrl,
        alt_text: altText,
        is_primary: isPrimary,
      },
    ]);

  if (error) throw error;
  return data;
}

/**
 * Get all products with their images
 */
export async function getProductsWithImages() {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  console.log('Fetching products from database...');

  // Fetch all products WITH category information
  const { data: productsData, error: productsError } = await adminClient
    .from('products')
    .select('*, categories(id, name, slug, description)');

  if (productsError) {
    console.error('Error fetching products:', productsError);
    throw productsError;
  }

  console.log(`Found ${productsData?.length || 0} products in database`);

  if (!productsData || productsData.length === 0) {
    console.warn('No products found in database');
    return [];
  }

  // Fetch images for each product
  const result = [];
  for (const product of productsData) {
    const { data: images } = await adminClient
      .from('product_images')
      .select('*')
      .eq('product_id', product.id);

    result.push({
      ...product,
      category: Array.isArray(product.categories) ? product.categories[0] : product.categories,
      product_images: images || []
    });
  }

  console.log(`Returning ${result.length} products with images`);
  return result;
}

/**
 * Get a single product with its images by ID - OPTIMIZED for product detail page
 * Only 2 queries instead of N+1
 */
export async function getProductWithImages(productId: string) {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  // Query 1: Get product with category (single query)
  const { data: product, error: productError } = await adminClient
    .from('products')
    .select('*, categories(id, name, slug, description)')
    .eq('id', productId)
    .single();

  if (productError || !product) {
    console.error('Product not found:', productError);
    return null;
  }

  // Query 2: Get all images for this product (single query for this product only)
  const { data: images } = await adminClient
    .from('product_images')
    .select('*')
    .eq('product_id', productId);

  return {
    ...product,
    category: Array.isArray(product.categories) ? product.categories[0] : product.categories,
    product_images: images || []
  };
}

/**
 * Get products by category with images - OPTIMIZED
 * Fetches only products from a specific category (great for related products)
 * Uses single query instead of N+1
 */
export async function getProductsByCategory(categoryId: string, limit: number = 10) {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  // Single query: Get all products from category with their images in one shot
  const { data: productsData, error } = await adminClient
    .from('products')
    .select('*, categories(id, name, slug, description), product_images(*)')
    .eq('category_id', categoryId)
    .limit(limit);

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  if (!productsData || productsData.length === 0) {
    return [];
  }

  // Transform the data
  return productsData.map((product: any) => ({
    ...product,
    category: Array.isArray(product.categories) ? product.categories[0] : product.categories,
    product_images: product.product_images || []
  }));
}

/**
 * Get products from OTHER categories (excluding current category)
 * Perfect for "You May Also Like" section showing diverse products
 * Shows products from different categories than the current one
 */
export async function getProductsFromOtherCategories(excludeCategoryId: string, limit: number = 6) {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  // Single query: Get all products NOT from current category
  const { data: productsData, error } = await adminClient
    .from('products')
    .select('*, categories(id, name, slug, description), product_images(*)')
    .neq('category_id', excludeCategoryId)
    .limit(limit);

  if (error) {
    console.error('Error fetching products from other categories:', error);
    return [];
  }

  if (!productsData || productsData.length === 0) {
    return [];
  }

  // Transform and return
  return productsData.map((product: any) => ({
    ...product,
    category: Array.isArray(product.categories) ? product.categories[0] : product.categories,
    product_images: product.product_images || []
  }));
}
