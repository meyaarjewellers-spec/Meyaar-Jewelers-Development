import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { ImageZoomViewer } from "@/components/product/ImageZoomViewer";
import { ProductHeader } from "@/components/product/ProductHeader";
import { ProductDetails } from "@/components/product/ProductDetails";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { SizeGuideButton } from "@/components/product/SizeGuideButton";
import { ProductFilters } from "@/components/product/ProductFilters";
import { getProductsWithImages } from "@/lib/seedDatabase";
import { supabase } from "@/lib/supabase";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addItem, itemCount } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const allProducts = await getProductsWithImages();
        
        // Find the product by ID or SKU
        const currentProduct = allProducts.find((p: any) => 
          p.id === params?.id || p.sku === params?.id
        );

        if (currentProduct) {
          setProduct(currentProduct);
          
          // Get related products from same category
          const related = allProducts
            .filter((p: any) => 
              p.category?.id === currentProduct.category?.id && 
              p.id !== currentProduct.id
            )
            .slice(0, 3)
            .map((p: any) => ({
              id: p.id,
              name: p.name,
              price: p.base_price,
              image: (p.product_images?.[0]?.image_url || ''),
              rating: 5,
              reviewCount: Math.floor(Math.random() * 100) + 30,
            }));
          
          setRelatedProducts(related);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        setLoading(false);
      }
    };

    if (params?.id) {
      loadProduct();
    }
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={itemCount} />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading product...</p>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={itemCount} />
        <main className="flex-1 flex items-center justify-center">
          <p>Product not found</p>
        </main>
      </div>
    );
  }

  const primaryImage = product.product_images?.[0]?.image_url || '';
  const categoryName = product.category?.name?.toLowerCase() || 'jewelry';

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.base_price,
      image: primaryImage,
      category: categoryName,
    });
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}`,
    });
    setQuantity(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={itemCount} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <ImageZoomViewer 
              src={primaryImage}
              alt={product.name}
            />

            <div className="space-y-6">
              <ProductHeader product={{
                id: product.id,
                name: product.name,
                price: product.base_price,
                rating: 5,
                reviewCount: Math.floor(Math.random() * 100) + 30,
                isLimited: false,
              }} />

              <p 
                className="text-muted-foreground"
                data-testid="text-product-description"
              >
                {product.description}
              </p>

              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                />
                <SizeGuideButton category={categoryName} />
              </div>

              <ProductDetails
                materials={product.material || 'Premium handcrafted jewelry'}
                dimensions={product.dimensions || 'Custom size'}
                care={product.care_instructions || 'Handle with care. Avoid water and chemicals.'}
              />
            </div>
          </div>

          <RelatedProducts products={relatedProducts} />
        </div>
      </main>
    </div>
  );
}
