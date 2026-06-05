import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { fetchMyOrders, type AccountOrder } from "@/lib/checkoutApi";
import { adminApi } from "@/lib/adminApi";
import AddressBook from "@/components/account/AddressBook";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-primary/10 text-primary",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-gray-100 text-gray-600",
  refunded: "bg-gray-100 text-gray-600",
};

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<AccountOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const data = await fetchMyOrders();
        if (mounted) setOrders(data);
      } catch {
        // Order history is non-critical here.
      } finally {
        if (mounted) setOrdersLoading(false);
      }
    })();
    adminApi.me().then(() => mounted && setIsAdmin(true)).catch(() => {});
    return () => {
      mounted = false;
    };
  }, [user]);

  const handleLogout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut();
      setLocation("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to logout");
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header cartItemCount={itemCount} />
        <div className="container mx-auto max-w-2xl flex-1 px-4 py-12">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please sign in to view your account.{" "}
              <Link href="/authentication" className="font-semibold underline">Sign in</Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header cartItemCount={itemCount} />

      <div className="container mx-auto max-w-3xl flex-1 px-4 py-12">
        <h1 className="font-serif text-4xl">My Account</h1>
        <p className="mt-2 text-muted-foreground">Welcome back{user.user_metadata?.name ? `, ${user.user_metadata.name}` : ""}.</p>

        {error && (
          <Alert className="mt-6 border-destructive/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Account info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{user.email || "Not available"}</p>
            </div>
            {user.user_metadata?.name && (
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{user.user_metadata.name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order history */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <Package className="h-5 w-5 text-primary" /> Order History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <p className="py-4 text-sm text-muted-foreground">Loading your orders…</p>
            ) : orders.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm text-muted-foreground">You haven't placed any orders yet.</p>
                <Link href="/shop/necklaces">
                  <Button variant="outline" className="mt-4 rounded-full">Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {orders.map((o) => (
                  <li key={o.orderNumber} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{o.orderNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(o.createdAt).toLocaleDateString()} · {o.items.reduce((n, i) => n + i.quantity, 0)} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${STATUS_STYLES[o.status] || "bg-muted"}`}>
                          {o.status}
                        </span>
                        <p className="mt-1 font-serif">${o.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Saved addresses */}
        <AddressBook />

        {/* Admin */}
        {isAdmin && (
          <Card className="mt-6 border-primary/30">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Store Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">Manage orders, products, inventory, reviews, and subscribers.</p>
              <Link href="/admin">
                <Button className="rounded-full px-8">Open Admin Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Sign out */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleLogout} disabled={isLoading} variant="outline" className="flex-1 rounded-full">
            {isLoading ? "Signing out…" : "Sign Out"}
          </Button>
          <Button onClick={() => setLocation("/")} className="flex-1 rounded-full">Back to Home</Button>
        </div>
      </div>
    </div>
  );
}
