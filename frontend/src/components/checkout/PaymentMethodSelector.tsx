import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Apple } from "lucide-react";

interface PaymentMethodSelectorProps {
  paymentMethod: "card" | "apple-pay";
  onPaymentMethodChange: (method: "card" | "apple-pay") => void;
}

export function PaymentMethodSelector({
  paymentMethod,
  onPaymentMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">💳 Payment Method</CardTitle>
        <CardDescription>Select your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => onPaymentMethodChange(value as "card" | "apple-pay")}
        >
          <div className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="h-4 w-4" />
              Credit/Debit Card
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="apple-pay" id="apple-pay" />
            <Label htmlFor="apple-pay" className="flex items-center gap-2 cursor-pointer flex-1">
              <Apple className="h-4 w-4" />
              Apple Pay
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
