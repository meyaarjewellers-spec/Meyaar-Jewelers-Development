interface TaxCalculationResponse {
  success: boolean;
  tax: number;
  taxRate: string;
  calculation_id?: string;
  error?: string;
}

export async function calculateTaxWithStripe(
  zipCode: string,
  subtotal: number
): Promise<TaxCalculationResponse> {
  try {
    const response = await fetch("/api/calculate-tax", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        zipCode: zipCode.trim(),
        subtotal,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to calculate tax");
    }

    const data: TaxCalculationResponse = await response.json();
    return data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Tax calculation error:", errorMessage);
    throw new Error(errorMessage);
  }
}
