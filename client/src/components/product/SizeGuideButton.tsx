import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

interface SizeGuideProps {
  category?: string;
}

const SIZE_GUIDES = {
  bracelet: {
    title: "Bracelet Size Guide",
    description: "Measure your wrist to find the ideal bracelet length:",
    sizes: [
      { size: "XS", wrist: "5.5-6\"", length: "6.5\"" },
      { size: "S", wrist: "6-6.5\"", length: "7\"" },
      { size: "M", wrist: "6.5-7\"", length: "7.25\"" },
      { size: "L", wrist: "7-7.5\"", length: "7.5\"" },
      { size: "XL", wrist: "7.5-8\"", length: "8\"" },
    ],
    tips: [
      "Measure around your wrist with soft tape",
      "Keep one finger's width clearance for comfort",
      "Bracelets should sit flat against your wrist",
      "Add 0.5-1 inch for comfort fit",
    ],
  },
  necklace: {
    title: "Necklace Length Guide",
    description: "Choose the perfect necklace length for your style:",
    sizes: [
      { length: "14-16\"", style: "Choker", fit: "Sits at base of neck" },
      { length: "16-18\"", style: "Princess", fit: "Hits at collarbone" },
      { length: "18-20\"", style: "Matinee", fit: "Falls mid-chest" },
      { length: "20-24\"", style: "Opera", fit: "Long statement piece" },
      { length: "24-30\"", style: "Rope", fit: "Very long, layerable" },
    ],
    tips: [
      "Consider your neckline and face shape",
      "Layering different lengths creates dimension",
      "Test with a string for perfect length",
      "Account for pendant weight affecting drape",
    ],
  },
  earring: {
    title: "Earring Fit Guide",
    description: "Most earrings are standard. Check closure type:",
    sizes: [
      { type: "Stud", fit: "Fixed post, push back closure" },
      { type: "Drop/Dangle", fit: "Hangs 1-3 inches below ear" },
      { type: "Hoop", fit: "Available in various diameters" },
      { type: "Chandelier", fit: "Multi-strand, decorative bottom" },
      { type: "Huggie", fit: "Hugs the ear lobe closely" },
    ],
    tips: [
      "Ensure posts are hypoallergenic if sensitive",
      "Heavier earrings may stretch earlobes",
      "Check closure security before wearing",
      "Consider face shape for best proportion",
    ],
  },
};

export function SizeGuideButton({ category = "bracelet" }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const guide = SIZE_GUIDES[category as keyof typeof SIZE_GUIDES] || SIZE_GUIDES.bracelet;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2 text-amber-700 hover:text-amber-900 border-amber-300 hover:bg-amber-50"
      >
        <Ruler className="w-4 h-4" />
        Size Guide
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-amber-900">
              {guide.title}
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              {guide.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Size Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-amber-200">
                    {Object.keys(guide.sizes[0]).map((key) => (
                      <th
                        key={key}
                        className="text-left px-4 py-2 font-semibold text-amber-900 capitalize"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {guide.sizes.map((row, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-amber-100 hover:bg-amber-50"
                    >
                      {Object.values(row).map((value, vIdx) => (
                        <td key={vIdx} className="px-4 py-3 text-amber-800">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">💡 Tips for Best Fit:</h4>
              <ul className="space-y-2">
                {guide.tips.map((tip, idx) => (
                  <li key={idx} className="text-blue-800 flex gap-2">
                    <span className="font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
