import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, X } from "lucide-react";
import { calculateTaxWithStripe } from "@/lib/taxService";

interface TaxSectionProps {
  subtotal: number;
  onTaxCalculated?: (tax: number | null) => void;
}

export function TaxSection({ subtotal, onTaxCalculated }: TaxSectionProps) {
  const [zipCode, setZipCode] = useState("");
  const [calculatedTax, setCalculatedTax] = useState<number | null>(null);
  const [isTaxLoading, setIsTaxLoading] = useState(false);
  const [taxError, setTaxError] = useState<string | null>(null);

  const handleCheckTax = async () => {
    if (!zipCode.trim() || zipCode.length < 5) {
      setTaxError("Please enter a valid 5-digit ZIP code");
      return;
    }

    setIsTaxLoading(true);
    setTaxError(null);

    try {
      const result = await calculateTaxWithStripe(zipCode, subtotal);
      if (result.success) {
        setCalculatedTax(result.tax);
        onTaxCalculated?.(result.tax);
        setTaxError(null);
      } else {
        setTaxError(result.error || "Failed to calculate tax");
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Failed to calculate tax";
      setTaxError(errorMsg);
    } finally {
      setIsTaxLoading(false);
    }
  };

  const handleClearTax = () => {
    setZipCode("");
    setCalculatedTax(null);
    onTaxCalculated?.(null);
    setTaxError(null);
  };

  return (
    <div className="space-y-2 border-t pt-4">
      <div className="flex justify-between">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">
          {calculatedTax !== null 
            ? `$${calculatedTax.toFixed(2)}`
            : "-"
          }
        </span>
      </div>

      {calculatedTax === null ? (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Enter your ZIP code to calculate tax.</p>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value.slice(0, 5))}
              className="flex-1 text-sm"
              maxLength={5}
              disabled={isTaxLoading}
            />
          <Button 
            size="icon"
            onClick={handleCheckTax}
            disabled={!zipCode.trim() || isTaxLoading}
            className="bg-amber-900 hover:bg-amber-900/90 h-9 w-9"
          >
            {isTaxLoading ? (
              <span className="h-4 w-4 animate-spin inline-block">⚙︎</span>
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>        </div>      ) : (
        <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border text-sm">
          <span className="font-semibold text-gray-700">{zipCode}</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleClearTax}
            className="h-6 w-6 hover:bg-red-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      )}
      {taxError && <p className="text-red-600 text-xs">{taxError}</p>}
    </div>
  );
}
