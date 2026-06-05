import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AddressInput } from "@/lib/addressApi";

interface AddressFormProps {
  initial?: Partial<AddressInput>;
  submitLabel?: string;
  onSubmit: (a: AddressInput) => void | Promise<void>;
  onCancel?: () => void;
  busy?: boolean;
}

const empty: AddressInput = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "US",
};

export default function AddressForm({ initial, submitLabel = "Save address", onSubmit, onCancel, busy }: AddressFormProps) {
  const [form, setForm] = useState<AddressInput>({ ...empty, ...initial });
  const set = (k: keyof AddressInput, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const valid = form.fullName && form.line1 && form.city && form.postalCode && form.country;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSubmit(form);
      }}
      className="space-y-3"
    >
      <Input placeholder="Full name" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
      <Input placeholder="Phone (optional)" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
      <Input placeholder="Address line 1" value={form.line1} onChange={(e) => set("line1", e.target.value)} required />
      <Input placeholder="Address line 2 (optional)" value={form.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} />
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} required />
        <Input placeholder="State / Province" value={form.state ?? ""} onChange={(e) => set("state", e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input placeholder="Postal code" value={form.postalCode} onChange={(e) => set("postalCode", e.target.value)} required />
        <Input placeholder="Country (e.g. US)" maxLength={2} value={form.country} onChange={(e) => set("country", e.target.value.toUpperCase())} required />
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={!valid || busy} className="rounded-full px-6">
          {busy ? "Saving…" : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
