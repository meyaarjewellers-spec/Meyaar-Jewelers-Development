import { Link } from "wouter";
import { IMAGES } from "@/lib/imageConfig";
import { Instagram, Facebook, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <img src={IMAGES.logoTransparent} alt="Meyaar Jewellers" className="h-16 mb-4" />
            <p className="text-sm text-muted-foreground">
              Handcrafted artisan jewelry since 2025.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-4" data-testid="text-footer-shop">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop/necklaces">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-necklaces">
                    Necklaces
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop/bracelets">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-bracelets">
                    Bracelets
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shop/earrings">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-earrings">
                    Earrings
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4" data-testid="text-footer-about">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-about">
                    Our Story
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-contact">
                    Contact Us
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4" data-testid="text-footer-policies">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-privacy">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-terms">
                    Terms & Conditions
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/return-policy">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-returns">
                    Return Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy">
                  <span className="text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-footer-shipping">
                    Shipping Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4" data-testid="text-footer-connect">Connect</h3>
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/meyaarjewellers/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  data-testid="button-instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => console.log("Facebook clicked")}
                data-testid="button-facebook"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => console.log("Email clicked")}
                data-testid="button-email"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            © {currentYear} Meyaar Jewellers. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
