import { useRoute, Link } from "wouter";
import { useState, useEffect } from "react";
import { Truck, ShieldCheck, RefreshCcw } from "lucide-react";
import Seo, { BASE_URL } from "@/components/Seo";
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
import { trackViewItem } from "@/lib/analytics";

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
          trackViewItem({
            id: currentProduct.id,
            name: currentProduct.name,
            price: Number(currentProduct.discount_price ?? currentProduct.base_price),
            category: currentProduct.category?.name,
          });

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
      price: Number(product.discount_price ?? product.base_price),
      image: primaryImage,
      category: categoryName,
    });
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}`,
    });
    setQuantity(1);
  };

  const price = Number(product.discount_price ?? product.base_price);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={product.name}
        description={product.description || `${product.name} — handcrafted by Meyaar Jewellers.`}
        path={`/product/${product.id}`}
        type="product"
        image={primaryImage}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description || undefined,
            image: (product.product_images || []).map((i: any) => i.image_url).filter(Boolean),
            sku: product.sku || undefined,
            brand: { "@type": "Brand", name: "Meyaar Jewellers" },
            ...(product.material ? { material: product.material } : {}),
            offers: {
              "@type": "Offer",
              price: price.toFixed(2),
              priceCurrency: (product.currency || "USD"),
              availability: "https://schema.org/InStock",
              url: `${BASE_URL}/product/${product.id}`,
            },
            ...(product.average_rating && product.total_reviews
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: Number(product.average_rating),
                    reviewCount: product.total_reviews,
                  },
                }
              : {}),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
              { "@type": "ListItem", position: 2, name: categoryName, item: `${BASE_URL}/shop/${categoryName}` },
              { "@type": "ListItem", position: 3, name: product.name, item: `${BASE_URL}/product/${product.id}` },
            ],
          },
        ]}
      />
      <Header cartItemCount={itemCount} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <nav className="mb-8 text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/shop/${categoryName}`} className="capitalize hover:text-primary">{categoryName}</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <ImageZoomViewer
              src={primaryImage}
              alt={product.name}
              images={(product.product_images || []).map((img: any) => img.image_url).filter(Boolean)}
            />

            <div className="space-y-6">
              <ProductHeader product={{
                id: product.id,
                name: product.name,
                price: Number(product.discount_price ?? product.base_price),
                rating: product.average_rating ? Number(product.average_rating) : 0,
                reviewCount: product.total_reviews ?? 0,
                isLimited: Boolean(product.is_featured),
              }} />

              <p
                className="leading-relaxed text-muted-foreground"
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

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4 text-center">
                {[
                  { icon: Truck, label: "Free shipping over $100" },
                  { icon: ShieldCheck, label: "Secure checkout" },
                  { icon: RefreshCcw, label: "30-day returns" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                    <span className="text-[11px] leading-tight text-muted-foreground">{label}</span>
                  </div>
                ))}
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
