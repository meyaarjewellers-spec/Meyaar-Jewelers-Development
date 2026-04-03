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

// Create admin client for seeding (bypasses RLS with service role key)
function getAdminClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.warn('⚠️ Service role key not available, using regular client');
    return supabase;
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
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

    // Insert categories and get their IDs
    for (const cat of categories) {
      const { data, error } = await adminClient
        .from('categories')
        .insert([cat])
        .select('id')
        .single();

      if (error && !error.message.includes('duplicate')) {
        console.warn(`Category ${cat.name} might already exist:`, error);
      } else if (data) {
        categoryMap[cat.name] = data.id;
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
      if (!product.category_id) continue;

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

  // Fetch all products without complex joins
  const { data: productsData, error: productsError } = await adminClient
    .from('products')
    .select('*');

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
      product_images: images || []
    });
  }

  console.log(`Returning ${result.length} products with images`);
  return result;
}

/**
 * Clear all products and images before reseeding
 */
export async function clearProducts() {
  const adminClient = getAdminClient();
  if (!adminClient) throw new Error('Supabase not initialized');

  try {
    // Delete all product images first (foreign key constraint)
    const { error: imagesError } = await adminClient
      .from('product_images')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (imagesError && !imagesError.message.includes('0 rows')) {
      console.warn('Error clearing images:', imagesError);
    }

    // Delete all products
    const { error: productsError } = await adminClient
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (productsError && !productsError.message.includes('0 rows')) {
      console.warn('Error clearing products:', productsError);
    }

    // Delete all categories
    const { error: categoriesError } = await adminClient
      .from('categories')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (categoriesError && !categoriesError.message.includes('0 rows')) {
      console.warn('Error clearing categories:', categoriesError);
    }

    console.log('✅ Database cleared');
    return true;
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}
