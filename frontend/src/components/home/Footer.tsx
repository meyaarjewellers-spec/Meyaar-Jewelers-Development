import { Link } from "wouter";
import { IMAGES } from "@/lib/imageConfig";
import { Instagram, Facebook, Mail } from "lucide-react";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "Necklaces", href: "/shop/necklaces" },
      { label: "Bracelets", href: "/shop/bracelets" },
      { label: "Earrings", href: "/shop/earrings" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Return Policy", href: "/return-policy" },
      { label: "Shipping Policy", href: "/shipping-policy" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <img src={IMAGES.logoTransparent} alt="Meyaar Jewellers" className="mb-4 h-14" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Handcrafted, limited-edition jewelry — Pakistani-inspired heritage,
              made in small batches since 2025.
            </p>
            <div className="mt-5 flex gap-2">
              <a href="https://www.instagram.com/meyaarjewellers/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="mailto:meyaarjewellers@gmail.com" aria-label="Email" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{col.title}</h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted-foreground transition-colors hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-center text-xs text-muted-foreground sm:flex-row">
          <p data-testid="text-copyright">© {currentYear} Meyaar Jewellers. All rights reserved.</p>
          <p className="tracking-wide">Handcrafted with care · Secure checkout by Stripe</p>
        </div>
      </div>
    </footer>
  );
}
