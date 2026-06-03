import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PromoBar, Footer } from "@/components/home";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ProductDetail from "@/pages/ProductDetail";
import SearchPage from "@/pages/Search";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Checkout from "@/pages/Checkout";
import CheckoutMethod from "@/pages/CheckoutMethod";
import Confirmation from "@/pages/Confirmation";
import Authentication from "@/pages/Authentication";
import Settings from "@/pages/Settings";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsConditions from "@/pages/TermsConditions";
import ReturnPolicy from "@/pages/ReturnPolicy";
import ShippingPolicy from "@/pages/ShippingPolicy";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop/necklaces">
        {() => <CategoryPage category="necklaces" />}
      </Route>
      <Route path="/shop/bracelets">
        {() => <CategoryPage category="bracelets" />}
      </Route>
      <Route path="/shop/earrings">
        {() => <CategoryPage category="earrings" />}
      </Route>
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/search" component={SearchPage} />
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
  );
}

function App() {
  const [location] = useLocation();
  const showFooter = location !== "/checkout" && location !== "/checkout-method" && location !== "/confirmation" && location !== "/authentication" && location !== "/settings";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <PromoBar />
            <Toaster />
            <Router />
            {showFooter && <Footer />}
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
