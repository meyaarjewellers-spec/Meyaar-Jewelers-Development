import { useEffect, useMemo, useState } from "react";
import { useSearch } from "wouter";
import Seo from "@/components/Seo";
import Header from "@/components/Header";
import CategoryGrid from "@/components/home/CategoryGrid";
import { useCart } from "@/contexts/CartContext";
import { getProductsWithImages, toCardProduct } from "@/lib/productCatalog";
import type { Product } from "@/components/ProductCard";

export default function SearchPage() {
  const search = useSearch();
  const query = useMemo(() => new URLSearchParams(search).get("q")?.trim() ?? "", [search]);
  const { itemCount } = useCart();

  const [all, setAll] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    let mounted = true;
    (async () => {
      setLoading(true);
      const products = await getProductsWithImages();
      if (mounted) {
        setAll(products);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const results: Product[] = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return all
      .filter((p) => {
        const hay = [p.name, p.description, p.material, p.gemstone_type, p.category?.name]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .map(toCardProduct);
  }, [all, query]);

  return (
    <div className="flex min-h-screen flex-col">
      <Seo title={query ? `Search: ${query}` : "Search"} path="/search" noIndex />
      <Header cartItemCount={itemCount} />
      <main className="container mx-auto flex-1 px-4 py-14">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Search</p>
        <h1 className="mt-2 font-serif text-3xl md:text-4xl">
          {query ? <>Results for “{query}”</> : "Search our collection"}
        </h1>

        <div className="mt-10">
          {loading ? (
            <p className="text-center text-muted-foreground">Searching…</p>
          ) : results.length > 0 ? (
            <>
              <p className="mb-8 text-sm text-muted-foreground">{results.length} piece{results.length === 1 ? "" : "s"} found</p>
              <CategoryGrid products={results} />
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                {query ? `No pieces match “${query}”.` : "Type a search above to begin."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
