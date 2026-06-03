import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { analyticsConfigured, consentDecided, setConsent, initAnalytics } from "@/lib/analytics";

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only ask if analytics is configured and the user hasn't decided yet.
    if (analyticsConfigured && !consentDecided()) setVisible(true);
    else initAnalytics(); // re-init on reload if previously granted
  }, []);

  if (!visible) return null;

  const decide = (granted: boolean) => {
    setConsent(granted);
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-card/95 px-4 py-4 backdrop-blur">
      <div className="container mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use cookies to understand how our store is used and improve your experience. You can opt out anytime.
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={() => decide(false)}>
            Decline
          </Button>
          <Button size="sm" className="rounded-full" onClick={() => decide(true)}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
