import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProductDetailsProps {
  materials?: string;
  dimensions?: string;
  care?: string;
}

export function ProductDetails({ materials, dimensions, care }: ProductDetailsProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {materials && (
        <AccordionItem value="materials">
          <AccordionTrigger data-testid="accordion-materials">Materials</AccordionTrigger>
          <AccordionContent data-testid="text-materials">
            {materials}
          </AccordionContent>
        </AccordionItem>
      )}
      {dimensions && (
        <AccordionItem value="dimensions">
          <AccordionTrigger data-testid="accordion-dimensions">Dimensions</AccordionTrigger>
          <AccordionContent data-testid="text-dimensions">
            {dimensions}
          </AccordionContent>
        </AccordionItem>
      )}
      {care && (
        <AccordionItem value="care">
          <AccordionTrigger data-testid="accordion-care">Care Instructions</AccordionTrigger>
          <AccordionContent data-testid="text-care">
            {care}
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
