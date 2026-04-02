import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FirstTimePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("meyaar_first_visit");
    if (!hasVisited) {
      setIsOpen(true);
      localStorage.setItem("meyaar_first_visit", "true");
    }
  }, []);

  const handleSubscribe = () => {
    if (email) {
      // Here you would typically send the email to your backend
      console.log("Subscribed with email:", email);
      setIsOpen(false);
      setEmail("");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-amber-50 border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-serif text-amber-900">
            15% Off Your First Order!
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Sign up to stay up to date on our newest releases, biggest sales, & latest news.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-6">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-amber-200"
            />
            <Button
              onClick={handleSubscribe}
              className="bg-amber-900 hover:bg-amber-800 text-white"
            >
              →
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="w-full text-amber-900"
          >
            No thanks
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
