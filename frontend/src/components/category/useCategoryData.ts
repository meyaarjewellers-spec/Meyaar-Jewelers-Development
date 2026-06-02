import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

export function useCategoryData(category: Category) {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const metadata = CATEGORY_METADATA[category];

  useEffect(() => {
    let isMounted = true;
    
    async function fetchCategoryProducts() {
      try {
        if (!supabase) {
          if (isMounted) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }
        const client = supabase;
        const categoryName = CATEGORY_MAPPING[category];

        // Step 1: Get category ID by name
        const { data: categoryData, error: categoryError } = await client
          .from('categories')
          .select('id')
          .eq('name', categoryName)
          .single();

        if (categoryError || !categoryData) {
          console.warn(`Category "${categoryName}" not found:`, categoryError);
          if (isMounted) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }

        const categoryId = categoryData.id;

        // Step 2: Fetch products by category_id
        const { data: productsData, error: productsError } = await client
          .from('products')
          .select('id, name, base_price, description, sku')
          .eq('category_id', categoryId)
          .eq('is_active', true);

        if (productsError || !productsData || productsData.length === 0) {
          console.log(`No products found for category: ${categoryName}`);
          if (isMounted) {
            setProducts([]);
            setLoading(false);
          }
          return;
        }

        console.log(`Fetched ${productsData.length} products for ${categoryName}`);

        // Step 3: Fetch all images for all products at once (batch query - single query)
        const productIds = productsData.map((p: any) => p.id);
        const { data: allImages } = await client
          .from('product_images')
          .select('product_id, image_url')
          .in('product_id', productIds);

        if (!isMounted) return;

        // Step 4: Create a map of product_id -> first image for fast O(1) lookup
        const imageMap = new Map<string, string>();
        allImages?.forEach((img: any) => {
          if (!imageMap.has(img.product_id)) {
            imageMap.set(img.product_id, img.image_url);
          }
        });

        // Step 5: Transform products using the image map
        const transformed = productsData.map((product: any) => ({
          id: product.id,
          name: product.name,
          sku: product.sku,
          description: product.description,
          price: product.base_price,
          base_price: product.base_price,
          category: category,
          image: imageMap.get(product.id) || '',
          product_images: [],
          rating: 0,
          reviewCount: 0,
          isLimited: false,
        }));

        setProducts(transformed);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategoryProducts();
    
    // Cleanup: prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, [category]);

  return {
    title: metadata.title,
    description: metadata.description,
    products,
    loading,
  };
}
