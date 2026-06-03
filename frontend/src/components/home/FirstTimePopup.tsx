import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FirstTimePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("meyaar_first_visit");
    if (!hasVisited) {
      const t = setTimeout(() => setIsOpen(true), 1200);
      localStorage.setItem("meyaar_first_visit", "true");
      return () => clearTimeout(t);
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Email capture is wired to the ESP in Priority 2.
    setDone(true);
    setTimeout(() => setIsOpen(false), 1600);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        <DialogTitle className="sr-only">Welcome offer</DialogTitle>
        <div className="bg-primary px-8 py-6 text-center text-primary-foreground">
          <p className="text-[11px] uppercase tracking-[0.3em] opacity-80">Welcome to Meyaar</p>
          <p className="mt-2 font-serif text-4xl">15% Off</p>
          <p className="text-sm opacity-90">your first order</p>
        </div>

        <div className="px-8 py-7 text-center">
          {done ? (
            <p className="py-6 font-serif text-xl text-foreground">Thank you — check your inbox ✨</p>
          ) : (
            <>
              <p className="mb-5 text-sm text-muted-foreground">
                Join our list for first access to new releases, artisan stories, and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <Input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-center"
                />
                <Button type="submit" className="w-full rounded-full py-5 text-sm font-semibold uppercase tracking-[0.12em]">
                  Unlock 15% Off
                </Button>
              </form>
              <button onClick={() => setIsOpen(false)} className="mt-4 text-xs text-muted-foreground underline-offset-4 hover:underline">
                No thanks, I'll pay full price
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
