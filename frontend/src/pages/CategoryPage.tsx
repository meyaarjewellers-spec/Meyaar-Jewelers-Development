import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import Seo, { BASE_URL } from "@/components/Seo";
import Header from "@/components/Header";
import CategoryGrid from "@/components/home/CategoryGrid";
import { useCart } from "@/contexts/CartContext";
import { useCategoryData } from "@/components/category/useCategoryData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/components/ProductCard";

interface CategoryPageProps {
  category: "necklaces" | "bracelets" | "earrings";
}

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

const PRICE_BANDS = [
  { label: "All prices", min: 0, max: Infinity },
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $150", min: 100, max: 150 },
  { label: "$150+", min: 150, max: Infinity },
];

export default function CategoryPage({ category }: CategoryPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");
  const [band, setBand] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category]);

  const { itemCount } = useCart();
  const { title, description, products, loading } = useCategoryData(category);

  const visible = useMemo(() => {
    const { min, max } = PRICE_BANDS[band];
    let list = (products as unknown as Product[]).filter((p) => p.price >= min && p.price < max);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [products, sort, band]);

  return (
    <div className="flex min-h-screen flex-col">
      <Seo
        title={title || category}
        description={description || `Shop handcrafted ${category} from Meyaar Jewellers.`}
        path={`/shop/${category}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: title || category, item: `${BASE_URL}/shop/${category}` },
          ],
        }}
      />
      <Header cartItemCount={itemCount} />

      <main className="flex-1">
        {/* Header band */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-12 text-center">
            <nav className="mb-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{title || category}</span>
            </nav>
            <h1 className="font-serif text-4xl md:text-5xl">{title || category}</h1>
            {description && <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{description}</p>}
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {/* Filter / sort toolbar */}
          <div className="mb-8 flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {PRICE_BANDS.map((b, i) => (
                <button
                  key={b.label}
                  onClick={() => setBand(i)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    band === i
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground/70 hover:border-primary/50"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{visible.length} items</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-full border border-input bg-background px-4 py-1.5 text-sm outline-none focus:border-primary"
                data-testid="select-sort"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-xl bg-muted" />
                  <div className="mx-auto mt-4 h-4 w-2/3 rounded bg-muted" />
                  <div className="mx-auto mt-2 h-3 w-1/4 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <CategoryGrid products={visible} onQuickView={setSelectedProduct} />
          )}
        </div>
      </main>

      {/* Quick View */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">{selectedProduct?.name || "Product"}</DialogTitle>
            <DialogDescription className="capitalize">{selectedProduct?.category || "Jewelry"}</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-lg bg-muted">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  {selectedProduct.isLimited && (
                    <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-primary">
                      Limited Edition
                    </span>
                  )}
                  <p className="font-serif text-3xl text-primary">${selectedProduct.price.toFixed(2)}</p>
                </div>
                <Link href={`/product/${selectedProduct.id}`} className="mt-6">
                  <Button className="w-full rounded-full">View Full Details</Button>
                </Link>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
