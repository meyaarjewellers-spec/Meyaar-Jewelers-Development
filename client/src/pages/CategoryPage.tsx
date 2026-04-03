import Header from "@/components/Header";
import CategoryGrid from "@/components/CategoryGrid";
import { useCart } from "@/contexts/CartContext";
import { useCategoryData } from "@/components/category/useCategoryData";
import { CategoryHeader } from "@/components/category/CategoryHeader";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import type { Product } from "@/components/ProductCard";

interface CategoryPageProps {
  category: "necklaces" | "bracelets" | "earrings";
}

export default function CategoryPage({ category }: CategoryPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);
  
  const { itemCount } = useCart();
  const { title, description, products, loading } = useCategoryData(category);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={itemCount} />
      
      <main className="flex-1">
        <CategoryHeader title={title} description={description} />

        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : (
            <CategoryGrid products={products as any} onQuickView={handleQuickView} />
          )}
        </div>
      </main>

      {/* Quick View Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name || 'Product'}</DialogTitle>
            <DialogDescription>
              {selectedProduct?.category ? selectedProduct.category.charAt(0).toUpperCase() + selectedProduct.category.slice(1) : 'Jewelry'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Image */}
              <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold mb-3">
                    {selectedProduct.name}
                  </h3>
                  
                  {/* Rating */}
                  {selectedProduct.rating && selectedProduct.reviewCount !== undefined && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-500">★</span>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({selectedProduct.reviewCount})
                      </span>
                    </div>
                  )}
                  
                  <p className="text-3xl font-serif font-bold text-primary mb-4">
                    ${selectedProduct.price}
                  </p>
                  
                  {selectedProduct.isLimited && (
                    <p className="text-sm font-semibold text-amber-600 mb-4">
                      ✨ Limited Edition
                    </p>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link href={`/product/${selectedProduct.id}`} className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      View Full Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
