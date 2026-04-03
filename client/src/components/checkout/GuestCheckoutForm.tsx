import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestForm {
  guestName: string;
  guestEmail: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
}

interface GuestCheckoutFormProps {
  guestForm: GuestForm;
  onGuestFormChange: (form: GuestForm) => void;
}

export function GuestCheckoutForm({
  guestForm,
  onGuestFormChange,
}: GuestCheckoutFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>📮 Guest Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guestName">Full Name</Label>
            <Input
              id="guestName"
              placeholder="John Doe"
              value={guestForm.guestName}
              onChange={(e) => onGuestFormChange({ ...guestForm, guestName: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="guestEmail">Email</Label>
            <Input
              id="guestEmail"
              type="email"
              placeholder="your@email.com"
              value={guestForm.guestEmail}
              onChange={(e) => onGuestFormChange({ ...guestForm, guestEmail: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="guestPhone">Phone</Label>
          <Input
            id="guestPhone"
            placeholder="+1 (555) 000-0000"
            value={guestForm.phone}
            onChange={(e) => onGuestFormChange({ ...guestForm, phone: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="guestAddress">Address</Label>
          <Input
            id="guestAddress"
            placeholder="123 Main Street"
            value={guestForm.address}
            onChange={(e) => onGuestFormChange({ ...guestForm, address: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="guestCity">City</Label>
            <Input
              id="guestCity"
              placeholder="New York"
              value={guestForm.city}
              onChange={(e) => onGuestFormChange({ ...guestForm, city: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="guestCountry">Country</Label>
            <Input
              id="guestCountry"
              placeholder="USA"
              value={guestForm.country}
              onChange={(e) => onGuestFormChange({ ...guestForm, country: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="guestZip">ZIP Code</Label>
            <Input
              id="guestZip"
              placeholder="10001"
              value={guestForm.zipCode}
              onChange={(e) => onGuestFormChange({ ...guestForm, zipCode: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
