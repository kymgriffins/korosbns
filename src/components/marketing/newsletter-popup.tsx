"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";

import { useOrg } from "@/contexts/org-context";
import {
  newsletterSubscribeErrorMessage,
  subscribeNewsletter,
} from "@/lib/newsletter-subscribe";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NEWSLETTER_SEEN_KEY = "hasSeenNewsletterPopup";
const NEWSLETTER_TIME_ON_PAGE_MS = 45_000;
const NEWSLETTER_SCROLL_TRIGGER = 0.5;

export default function NewsletterPopup() {
  const { showNewsletter } = useOrg();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    if (!showNewsletter) return;
    const hasSeenPopup = sessionStorage.getItem(NEWSLETTER_SEEN_KEY);
    if (hasSeenPopup) return;

    let hasTriggered = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const openIfEligible = () => {
      if (hasTriggered) return;
      if (sessionStorage.getItem(NEWSLETTER_SEEN_KEY)) return;
      hasTriggered = true;
      setIsOpen(true);
      window.removeEventListener("scroll", handleScrollDepth);
    };

    const handleScrollDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const ratio = window.scrollY / scrollable;
      if (ratio >= NEWSLETTER_SCROLL_TRIGGER) {
        openIfEligible();
      }
    };

    timer = setTimeout(openIfEligible, NEWSLETTER_TIME_ON_PAGE_MS);
    window.addEventListener("scroll", handleScrollDepth, { passive: true });
    handleScrollDepth();

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("scroll", handleScrollDepth);
    };
  }, [showNewsletter]);

  const dismiss = () => {
    sessionStorage.setItem(NEWSLETTER_SEEN_KEY, "true");
    setIsOpen(false);
  };

  const handleSubscribe = async (event: FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const { alreadySubscribed } = await subscribeNewsletter({
        email,
        name: email.split("@")[0],
        source: "homepage_popup",
      });
      setSubscribed(true);
      setEmail("");
      sessionStorage.setItem(NEWSLETTER_SEEN_KEY, "true");
      if (alreadySubscribed) {
        toast.info("You're already subscribed. Check your inbox (and Spam/Junk folder)!");
      } else {
        toast.success("You're subscribed! Check your inbox (and Spam/Junk folder).");
      }
    } catch (err) {
      toast.error(newsletterSubscribeErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!showNewsletter) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) dismiss(); }}>
      <DialogContent className="md:max-w-4xl p-0 rounded-none gap-0" showCloseButton={false}>
        <DialogHeader className="sr-only">
          <DialogTitle>Subscribe to Budget Ndio Story</DialogTitle>
        </DialogHeader>
        <div className="flex md:flex-row flex-col">
          <div className="md:max-w-md w-full">
            <img
              src="/images/towwnhallmay/129A4056.jpg"
              alt="Budget Ndio Story"
              className="w-full object-cover sm:h-full h-40"
            />
          </div>

          {subscribed ? (
            <div className="md:p-16 p-6 w-full">
              <div className="space-y-4 py-2">
                <Alert variant="default" className="border-emerald-500/30 bg-emerald-500/5">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800 dark:text-emerald-200">
                    <span className="font-semibold">You&apos;re subscribed!</span> Keep an eye on your inbox for our latest updates.
                  </AlertDescription>
                </Alert>
                <Alert variant="default" className="border-amber-500/30 bg-amber-500/5">
                  <Inbox className="size-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <span className="font-semibold">Don&apos;t see our email?</span> Check your <strong>Spam</strong> or <strong>Junk</strong> folder — sometimes our messages land there. Mark us as &ldquo;Not Spam&rdquo; so you never miss an update.
                  </AlertDescription>
                </Alert>
                <div className="pt-2">
                  <Button onClick={dismiss} className="w-full">
                    Got it
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="md:p-16 p-6 w-full">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h2 className={T.subheading}>
                    Get budget updates in your inbox
                  </h2>
                  <p className={T.lead}>
                    Subscribe for explainers, stories, and policy highlights from Budget Ndio Story.
                  </p>
                </div>
                <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      required
                      autoFocus
                      className="dark:bg-background rounded-lg h-9 shadow-xs"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="rounded-lg h-10 cursor-pointer hover:bg-primary/80"
                    >
                      {loading ? "Subscribing…" : "Subscribe now"}
                    </Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="newsletter" className="cursor-pointer" />
                    <Label
                      htmlFor="newsletter"
                      className="text-sm text-muted-foreground font-normal cursor-pointer"
                    >
                      I agree to receive email updates
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={dismiss}
                    className="w-full mt-2"
                  >
                    Not now
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
