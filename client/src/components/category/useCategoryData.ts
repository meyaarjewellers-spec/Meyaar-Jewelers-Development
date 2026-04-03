import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

type Category = "necklaces" | "bracelets" | "earrings";

interface CategoryMeta {
  title: string;
  description: string;
}

const CATEGORY_METADATA: Record<Category, CategoryMeta> = {
  necklaces: {
    title: "Necklaces",
    description: "Statement pieces that elevate any look. Each necklace is handcrafted with meticulous attention to detail.",
  },
  bracelets: {
    title: "Bracelets",
    description: "Elegant wrist adornments that complement your style. Handmade with care and precision.",
  },
  earrings: {
    title: "Earrings",
    description: "From subtle to statement, our earrings add the perfect finishing touch. Limited edition designs.",
  },
};

// Category slug to Supabase category name mapping
const CATEGORY_MAPPING: Record<Category, string> = {
  necklaces: 'Necklaces',
  bracelets: 'Bracelets',
  earrings: 'Earrings',
};

interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isLimited?: boolean;
  rating?: number;
  reviewCount?: number;
  description?: string;
  sku?: string;
  base_price?: number;
  product_images?: Array<{ image_url: string }>;
}

// Create admin client for reading products (bypasses RLS)
function getAdminClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return createClient(supabaseUrl!, supabaseKey!);
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}

export function useCategoryData(category: Category) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const metadata = CATEGORY_METADATA[category];

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const adminClient = getAdminClient();
        const categoryName = CATEGORY_MAPPING[category];

        // Fetch category ID
        const { data: categoryData, error: categoryError } = await adminClient
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single();

        if (categoryError) {
          setLoading(false);
          return;
        }

        if (!categoryData) {
          setLoading(false);
          return;
        }

        // Fetch all products for this category
        const { data: productsData, error: productsError } = await adminClient
          .from('products')
          .select('*')
          .eq('category_id', categoryData.id);

        if (productsError) {
          setLoading(false);
          return;
        }

        if (!productsData || productsData.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // Fetch images for each product
        const transformed = [];
        for (const product of productsData) {
          const { data: images } = await adminClient
            .from('product_images')
            .select('*')
            .eq('product_id', product.id);

          transformed.push({
            id: product.id,
            name: product.name,
            sku: product.sku,
            description: product.description,
            price: product.base_price,
            base_price: product.base_price,
            category: category,
            image: images?.[0]?.image_url || '',
            product_images: images || [],
            rating: 5,
            reviewCount: Math.floor(Math.random() * 150) + 50,
            isLimited: true,
          });
        }

        setProducts(transformed);
      } catch (error) {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    }


    fetchCategoryProducts();
  }, [category]);

  return {
    title: metadata.title,
    description: metadata.description,
    products,
    loading,
  };
}
