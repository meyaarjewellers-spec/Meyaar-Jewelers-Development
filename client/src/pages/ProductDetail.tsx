import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

import necklace1 from "@assets/generated_images/Statement_necklace_product_9a7d889c.png";
import necklace2 from "@assets/generated_images/Layered_necklace_product_6a0328df.png";
import earring1 from "@assets/generated_images/Geometric_hoop_earrings_f96346b0.png";
import bracelet1 from "@assets/generated_images/Chain_bracelet_product_cd59a224.png";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const mockProduct = {
    id: params?.id || "1",
    name: "Artisan Circle Necklace",
    price: 189,
    image: necklace1,
    description: "A stunning handcrafted necklace featuring intricate circular mandala designs. This piece showcases expert metalwork and attention to detail, making it a true statement piece for any occasion.",
    isLimited: true,
    materials: "Bronze, copper accents",
    dimensions: "Pendant: 2.5 inches diameter, Chain: 18 inches",
    care: "Clean with soft cloth. Avoid water and harsh chemicals. Store in a dry place.",
  };

  const relatedProducts = [
    { id: "2", name: "Layered Necklace", price: 145, image: necklace2 },
    { id: "3", name: "Hoop Earrings", price: 89, image: earring1 },
    { id: "4", name: "Chain Bracelet", price: 125, image: bracelet1 },
  ];

  const handleAddToCart = () => {
    console.log("Added to cart:", mockProduct.name, "Quantity:", quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} × ${mockProduct.name}`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            <div>
              <Card className="overflow-hidden aspect-square">
                <img
                  src={mockProduct.image}
                  alt={mockProduct.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product-detail"
                />
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                {mockProduct.isLimited && (
                  <Badge 
                    className="mb-2 bg-primary text-primary-foreground"
                    data-testid="badge-limited-edition"
                  >
                    Limited Edition
                  </Badge>
                )}
                <h1 
                  className="font-serif text-4xl font-bold mb-2"
                  data-testid="text-product-name"
                >
                  {mockProduct.name}
                </h1>
                <p 
                  className="text-3xl font-serif text-foreground"
                  data-testid="text-product-price"
                >
                  ${mockProduct.price}
                </p>
              </div>

              <p 
                className="text-muted-foreground"
                data-testid="text-product-description"
              >
                {mockProduct.description}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span 
                    className="px-4 font-medium"
                    data-testid="text-quantity"
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  Add to Cart
                </Button>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="materials">
                  <AccordionTrigger data-testid="accordion-materials">Materials</AccordionTrigger>
                  <AccordionContent data-testid="text-materials">
                    {mockProduct.materials}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="dimensions">
                  <AccordionTrigger data-testid="accordion-dimensions">Dimensions</AccordionTrigger>
                  <AccordionContent data-testid="text-dimensions">
                    {mockProduct.dimensions}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="care">
                  <AccordionTrigger data-testid="accordion-care">Care Instructions</AccordionTrigger>
                  <AccordionContent data-testid="text-care">
                    {mockProduct.care}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className="mt-20">
            <h2 
              className="font-serif text-3xl font-bold mb-8"
              data-testid="text-related-title"
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover-elevate cursor-pointer"
                  data-testid={`card-related-${product.id}`}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{product.name}</h3>
                    <p className="text-lg font-serif">${product.price}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
