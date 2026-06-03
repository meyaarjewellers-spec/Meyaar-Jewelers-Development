import { Link, useLocation } from "wouter";
import { Menu, X, User, Search, Heart } from "lucide-react";
import { useState } from "react";
import { IMAGES } from "@/lib/imageConfig";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import CartDrawer from "@/components/CartDrawer";

interface HeaderProps {
  cartItemCount?: number;
}

const navLinks = [
  { path: "/shop/necklaces", label: "Necklaces" },
  { path: "/shop/bracelets", label: "Bracelets" },
  { path: "/shop/earrings", label: "Earrings" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setMobileMenuOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left: mobile menu + nav */}
          <div className="flex flex-1 items-center gap-1">
            <button
              className="md:hidden -ml-1 p-2 text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <nav className="hidden items-center gap-6 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-[13px] font-medium uppercase tracking-[0.12em] transition-colors hover:text-primary ${
                    location === link.path ? "text-primary" : "text-foreground/80"
                  }`}
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center: logo */}
          <Link href="/" data-testid="link-home" className="shrink-0">
            <img src={IMAGES.logoTransparent} alt="Meyaar Jewellers" className="h-11 w-auto" />
          </Link>

          {/* Right: search + user + cart */}
          <div className="flex flex-1 items-center justify-end gap-1">
            <button
              className="p-2 text-foreground/80 transition-colors hover:text-primary"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              data-testid="button-search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist" aria-label="Wishlist" className="relative hidden p-2 text-foreground/80 transition-colors hover:text-primary sm:block">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link href={user ? "/settings" : "/authentication"} data-testid="link-user" className="p-2 text-foreground/80 transition-colors hover:text-primary">
              <User className="h-5 w-5" />
            </Link>
            <CartDrawer />
          </div>
        </div>

        {/* Expandable search */}
        {searchOpen && (
          <form onSubmit={submitSearch} className="border-t border-border py-3">
            <div className="relative mx-auto max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for necklaces, pearls, gold…"
                className="w-full rounded-full border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
                data-testid="input-search"
              />
            </div>
          </form>
        )}

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <nav className="border-t border-border py-3 md:hidden" data-testid="nav-mobile-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-2 py-3 text-sm font-medium uppercase tracking-[0.1em] text-foreground/80 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
