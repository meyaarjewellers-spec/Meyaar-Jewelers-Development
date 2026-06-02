import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { 
  ImageZoomViewer, 
  ProductHeader, 
  ProductDetails, 
  QuantitySelector, 
  RelatedProducts, 
  SizeGuideButton, 
  CustomerReviews 
} from "@/components/product";
import { getProductWithImages, getProductsFromOtherCategories } from "@/lib/productCatalog";

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
      if (!params?.id) return;
      
      try {
        // Query 1: Fetch only THIS product (2 queries)
        const currentProduct = await getProductWithImages(params.id);

        if (currentProduct) {
          setProduct(currentProduct);
          
          // Scroll to top when product loads
          window.scrollTo({ top: 0, behavior: 'smooth' });
          
          // Query 2: Fetch products from OTHER categories for "You May Also Like"
          // Shows diverse products from different categories
          if (currentProduct.category?.id) {
            const otherCategoryProducts = await getProductsFromOtherCategories(currentProduct.category.id, 6);
            const related = otherCategoryProducts
              .slice(0, 3)
              .map((p: any) => ({
                id: p.id,
                name: p.name,
                price: p.base_price,
                image: (p.product_images?.[0]?.image_url || ''),
                rating: 0,
                reviewCount: 0,
              }));
            
            setRelatedProducts(related);
          }
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

          <CustomerReviews productId={product.id} />
        </div>
      </main>
    </div>
  );
}
