import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { IMAGES } from "@/lib/imageConfig";

interface HeaderProps {
  cartItemCount?: number;
}

export default function Header({ cartItemCount = 0 }: HeaderProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/shop/necklaces", label: "Necklaces" },
    { path: "/shop/bracelets", label: "Bracelets" },
    { path: "/shop/earrings", label: "Earrings" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate cursor-pointer px-2 py-1 rounded-md">
              <img src={IMAGES.logoTransparent} alt="Meyaar Jewellers" className="h-10 w-auto" />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} data-testid={`link-${link.label.toLowerCase()}`}>
                <Button
                  variant={location === link.path ? "secondary" : "ghost"}
                  size="sm"
                  className="text-sm font-medium"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/checkout" data-testid="link-checkout">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                data-testid="button-cart"
              >
                <ShoppingCart className="h-7 w-7" />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -bottom-1 -right-1 h-5 w-5 flex items-center justify-center text-xs font-bold text-white rounded-full"
                    style={{backgroundColor: 'rgb(167, 98, 68)'}}
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t" data-testid="nav-mobile-menu">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <Button
                  variant={location === link.path ? "secondary" : "ghost"}
                  className="w-full justify-start text-left"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
