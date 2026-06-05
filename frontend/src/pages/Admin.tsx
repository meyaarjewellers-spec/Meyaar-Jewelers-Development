import { useEffect, useState } from "react";
import { Link } from "wouter";
import Seo from "@/components/Seo";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { adminApi, type AdminOrder, type AdminProduct, type AdminReview, type AdminSubscriber } from "@/lib/adminApi";

const ORDER_STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function Admin() {
  const { user, loading } = useAuth();
  const { itemCount } = useCart();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      setAuthorized(false);
      return;
    }
    adminApi.me().then(() => setAuthorized(true)).catch(() => setAuthorized(false));
  }, [user, loading]);

  return (
    <div className="flex min-h-screen flex-col">
      <Seo title="Admin" path="/admin" noIndex />
      <Header cartItemCount={itemCount} />
      <main className="container mx-auto flex-1 px-4 py-12">
        <h1 className="font-serif text-4xl">Admin</h1>

        {authorized === null && <p className="mt-8 text-muted-foreground">Checking access…</p>}

        {authorized === false && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-lg text-muted-foreground">
              {user ? "Your account doesn't have admin access." : "Please sign in with an admin account."}
            </p>
            <Link href={user ? "/" : "/authentication"}>
              <Button className="mt-5 rounded-full px-8">{user ? "Back to store" : "Sign in"}</Button>
            </Link>
          </div>
        )}

        {authorized && <Dashboard />}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <Tabs defaultValue="overview" className="mt-8">
      <TabsList className="flex-wrap">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
      </TabsList>
      <TabsContent value="overview"><Overview /></TabsContent>
      <TabsContent value="orders"><Orders /></TabsContent>
      <TabsContent value="products"><Products /></TabsContent>
      <TabsContent value="reviews"><Reviews /></TabsContent>
      <TabsContent value="subscribers"><Subscribers /></TabsContent>
    </Tabs>
  );
}

function Overview() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof adminApi.stats>> | null>(null);
  useEffect(() => {
    adminApi.stats().then(setStats).catch(() => setStats(null));
  }, []);
  if (!stats) return <p className="py-8 text-muted-foreground">Loading…</p>;
  const cards = [
    { label: "Orders", value: stats.orders },
    { label: "Revenue", value: `$${stats.revenue.toFixed(2)}` },
    { label: "Products", value: stats.products },
    { label: "Subscribers", value: stats.subscribers },
    { label: "Pending reviews", value: stats.pendingReviews },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-5">
      {cards.map((c) => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
          <p className="mt-2 font-serif text-2xl">{c.value}</p>
        </div>
      ))}
    </div>
  );
}

function Orders() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    adminApi.orders().then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const update = async (id: string, status: string) => {
    try {
      await adminApi.setOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      toast({ title: "Order updated" });
    } catch (e) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };

  if (loading) return <p className="py-8 text-muted-foreground">Loading…</p>;
  if (orders.length === 0) return <p className="py-8 text-muted-foreground">No orders yet.</p>;
  return (
    <div className="overflow-x-auto py-6">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr><th className="py-2">Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="py-3 font-medium">{o.orderNumber}</td>
              <td>{o.guestEmail || o.guestName || "—"}</td>
              <td>{o.items.reduce((n, i) => n + i.quantity, 0)}</td>
              <td>${o.total.toFixed(2)}</td>
              <td>{new Date(o.createdAt).toLocaleDateString()}</td>
              <td>
                <select value={o.status} onChange={(e) => update(o.id, e.target.value)} className="rounded-md border border-input bg-background px-2 py-1 text-sm">
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Products() {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    adminApi.products().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const patch = async (id: string, patch: Partial<AdminProduct>) => {
    try {
      await adminApi.updateProduct(id, patch as any);
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    } catch (e) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };

  if (loading) return <p className="py-8 text-muted-foreground">Loading…</p>;
  if (products.length === 0) return <p className="py-8 text-muted-foreground">No products.</p>;
  return (
    <div className="overflow-x-auto py-6">
      <table className="w-full min-w-[720px] text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr><th className="py-2">Product</th><th>SKU</th><th>Price</th><th>Stock</th><th>Active</th><th>Featured</th></tr>
        </thead>
        <tbody className="divide-y divide-border">
          {products.map((p) => (
            <tr key={p.id}>
              <td className="py-3 font-medium">{p.name}</td>
              <td className="text-muted-foreground">{p.sku}</td>
              <td>
                <PriceEditor value={p.basePrice} onSave={(v) => patch(p.id, { basePrice: v })} />
              </td>
              <td>{p.stock ?? "—"}</td>
              <td><Toggle on={p.isActive} onClick={() => patch(p.id, { isActive: !p.isActive })} /></td>
              <td><Toggle on={p.isFeatured} onClick={() => patch(p.id, { isFeatured: !p.isFeatured })} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PriceEditor({ value, onSave }: { value: number; onSave: (v: number) => void }) {
  const [v, setV] = useState(value.toFixed(2));
  return (
    <Input
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={() => {
        const n = Number.parseFloat(v);
        if (Number.isFinite(n) && n !== value) onSave(n);
      }}
      className="h-8 w-24"
    />
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`rounded-full px-3 py-1 text-xs font-medium ${on ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
      {on ? "Yes" : "No"}
    </button>
  );
}

function Reviews() {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    adminApi.reviews().then(setReviews).catch(() => {}).finally(() => setLoading(false));
  }, []);
  const setStatus = async (id: string, status: string) => {
    try {
      await adminApi.setReviewStatus(id, status);
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } catch (e) {
      toast({ title: "Update failed", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };
  if (loading) return <p className="py-8 text-muted-foreground">Loading…</p>;
  if (reviews.length === 0) return <p className="py-8 text-muted-foreground">No reviews.</p>;
  return (
    <div className="space-y-3 py-6">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">{r.authorName} · {"★".repeat(r.rating)}{r.isVerifiedPurchase ? " · ✓ verified" : ""}</p>
              {r.title && <p className="text-sm font-medium">{r.title}</p>}
              <p className="text-sm text-muted-foreground">{r.content}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${r.status === "approved" ? "bg-primary/10 text-primary" : r.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
              {r.status !== "approved" && <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus(r.id, "approved")}>Approve</Button>}
              {r.status !== "rejected" && <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus(r.id, "rejected")}>Reject</Button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Subscribers() {
  const [subs, setSubs] = useState<AdminSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    adminApi.subscribers().then(setSubs).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const exportCsv = () => {
    const rows = [["email", "source", "date"], ...subs.map((s) => [s.email, s.source || "", new Date(s.createdAt).toISOString()])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="py-8 text-muted-foreground">Loading…</p>;
  return (
    <div className="py-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{subs.length} subscriber(s)</p>
        {subs.length > 0 && <Button size="sm" variant="outline" className="rounded-full" onClick={exportCsv}>Export CSV</Button>}
      </div>
      {subs.length === 0 ? (
        <p className="text-muted-foreground">No subscribers yet.</p>
      ) : (
        <ul className="divide-y divide-border text-sm">
          {subs.map((s) => (
            <li key={s.id} className="flex items-center justify-between py-2">
              <span>{s.email}</span>
              <span className="text-xs text-muted-foreground">{s.source} · {new Date(s.createdAt).toLocaleDateString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
