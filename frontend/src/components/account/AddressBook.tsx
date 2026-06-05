import { useEffect, useState } from "react";
import { MapPin, Star, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AddressForm from "@/components/AddressForm";
import { useToast } from "@/hooks/use-toast";
import { addressApi, type Address, type AddressInput } from "@/lib/addressApi";

export default function AddressBook() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () => addressApi.list().then(setAddresses).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);

  const create = async (a: AddressInput) => {
    setBusy(true);
    try {
      const created = await addressApi.create(a);
      setAddresses((prev) => [created, ...prev.map((p) => (created.isDefault ? { ...p, isDefault: false } : p))]);
      setAdding(false);
      toast({ title: "Address saved" });
    } catch (e) {
      toast({ title: "Could not save", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const update = async (id: string, a: Partial<AddressInput>) => {
    setBusy(true);
    try {
      await addressApi.update(id, a);
      await load();
      setEditing(null);
      toast({ title: "Address updated" });
    } catch (e) {
      toast({ title: "Could not update", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await addressApi.remove(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      toast({ title: "Could not delete", description: e instanceof Error ? e.message : undefined, variant: "destructive" });
    }
  };

  const makeDefault = (a: Address) => update(a.id, { isDefault: true });

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 font-serif text-xl">
          <MapPin className="h-5 w-5 text-primary" /> Saved Addresses
        </CardTitle>
        {!adding && !editing && (
          <Button size="sm" variant="outline" className="rounded-full" onClick={() => setAdding(true)}>
            Add address
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {adding && (
          <div className="mb-6 rounded-xl border border-border p-4">
            <p className="mb-3 font-medium">New address</p>
            <AddressForm onSubmit={create} onCancel={() => setAdding(false)} busy={busy} />
          </div>
        )}

        {editing && (
          <div className="mb-6 rounded-xl border border-border p-4">
            <p className="mb-3 font-medium">Edit address</p>
            <AddressForm initial={editing} submitLabel="Update address" onSubmit={(a) => update(editing.id, a)} onCancel={() => setEditing(null)} busy={busy} />
          </div>
        )}

        {loading ? (
          <p className="py-4 text-sm text-muted-foreground">Loading…</p>
        ) : addresses.length === 0 && !adding ? (
          <p className="py-2 text-sm text-muted-foreground">No saved addresses yet. Add one to speed up checkout.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <div key={a.id} className="rounded-xl border border-border p-4 text-sm">
                <div className="mb-1 flex items-center justify-between">
                  <p className="font-medium">{a.fullName}</p>
                  {a.isDefault && (
                    <span className="flex items-center gap-1 text-xs text-primary"><Star className="h-3 w-3 fill-primary" /> Default</span>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
                  {a.city}{a.state ? `, ${a.state}` : ""} {a.postalCode}, {a.country}
                  {a.phone ? <><br />{a.phone}</> : null}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!a.isDefault && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => makeDefault(a)}>Set default</Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setEditing(a)}>
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-destructive" onClick={() => remove(a.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
