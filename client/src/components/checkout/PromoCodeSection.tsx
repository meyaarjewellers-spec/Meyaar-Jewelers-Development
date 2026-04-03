import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Gift } from "lucide-react";

interface PromoCodeSectionProps {
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  promoApplied: boolean;
  onApplyPromo: () => void;
  onRemovePromo: () => void;
}

export function PromoCodeSection({
  promoCode,
  onPromoCodeChange,
  promoApplied,
  onApplyPromo,
  onRemovePromo,
}: PromoCodeSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5" />
          Promo Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter promo code (e.g., SAVE10)"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            disabled={promoApplied}
            className="placeholder:text-gray-400"
          />
          {!promoApplied ? (
            <Button onClick={onApplyPromo} className="bg-emerald-600 hover:bg-emerald-700">
              Apply
            </Button>
          ) : (
            <Button variant="outline" onClick={onRemovePromo}>
              Remove
            </Button>
          )}
        </div>
        {promoApplied && (
          <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
            ✅ Promo code applied! 10% discount activated
          </div>
        )}
      </CardContent>
    </Card>
  );
}
