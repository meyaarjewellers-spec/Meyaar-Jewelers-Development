import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PromoBar, Footer } from "@/components/home";
import ConsentBanner from "@/components/ConsentBanner";
import { trackPageView } from "@/lib/analytics";
import Home from "@/pages/Home";

// Route-level code splitting — only the landing page is eager for fast first paint.
const CategoryPage = lazy(() => import("@/pages/CategoryPage"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const SearchPage = lazy(() => import("@/pages/Search"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const CheckoutMethod = lazy(() => import("@/pages/CheckoutMethod"));
const Confirmation = lazy(() => import("@/pages/Confirmation"));
const Authentication = lazy(() => import("@/pages/Authentication"));
const Settings = lazy(() => import("@/pages/Settings"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("@/pages/TermsConditions"));
const ReturnPolicy = lazy(() => import("@/pages/ReturnPolicy"));
const ShippingPolicy = lazy(() => import("@/pages/ShippingPolicy"));
const Wishlist = lazy(() => import("@/pages/Wishlist"));
const NotFound = lazy(() => import("@/pages/not-found"));

function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop/necklaces">{() => <CategoryPage category="necklaces" />}</Route>
        <Route path="/shop/bracelets">{() => <CategoryPage category="bracelets" />}</Route>
        <Route path="/shop/earrings">{() => <CategoryPage category="earrings" />}</Route>
        <Route path="/product/:id" component={ProductDetail} />
        <Route path="/search" component={SearchPage} />
        <Route path="/wishlist" component={Wishlist} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/checkout-method" component={CheckoutMethod} />
        <Route path="/confirmation" component={Confirmation} />
        <Route path="/authentication" component={Authentication} />
        <Route path="/settings" component={Settings} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-conditions" component={TermsConditions} />
        <Route path="/return-policy" component={ReturnPolicy} />
        <Route path="/shipping-policy" component={ShippingPolicy} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  const [location] = useLocation();
  const showFooter = !["/checkout", "/checkout-method", "/confirmation", "/authentication", "/settings"].includes(location);

  // Track a GA4 page_view on every route change (no-op until consent + ID).
  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <TooltipProvider>
              <PromoBar />
              <Toaster />
              <Router />
              {showFooter && <Footer />}
              <ConsentBanner />
            </TooltipProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
