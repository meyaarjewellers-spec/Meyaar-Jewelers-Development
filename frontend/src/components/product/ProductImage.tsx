import { Card } from "@/components/ui/card";

interface ProductImageProps {
  src: string;
  alt: string;
}

export function ProductImage({ src, alt }: ProductImageProps) {
  return (
    <Card className="overflow-hidden aspect-square">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        data-testid="img-product-detail"
      />
    </Card>
  );
}
