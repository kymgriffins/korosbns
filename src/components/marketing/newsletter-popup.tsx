"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Mail, Sparkles, Inbox } from "lucide-react";
import { toast } from "sonner";

import { useOrg } from "@/contexts/org-context";
import {
  newsletterSubscribeErrorMessage,
  subscribeNewsletter,
} from "@/lib/newsletter-subscribe";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

const NEWSLETTER_SEEN_KEY = "hasSeenNewsletterPopup";
const NEWSLETTER_DELAY_MS = 10_000;

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

    const timer = setTimeout(() => {
      if (!sessionStorage.getItem(NEWSLETTER_SEEN_KEY)) {
        setIsOpen(true);
      }
    }, NEWSLETTER_DELAY_MS);

    return () => clearTimeout(timer);
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
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto sm:mx-0 size-10 rounded-full bg-primary/10 flex items-center justify-center mb-1">
            <Mail className="size-5 text-primary" />
          </div>
          <DialogTitle className="text-center sm:text-left">Get budget updates in your inbox</DialogTitle>
          <DialogDescription className="text-center sm:text-left">
            Subscribe for explainers, stories, and policy highlights from Budget Ndio Story.
          </DialogDescription>
        </DialogHeader>

        {subscribed ? (
          <div className="space-y-4 py-2">
            <Alert variant="default" className="border-emerald-500/30 bg-emerald-500/5">
              <Sparkles className="size-4 text-emerald-600" />
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
            <DialogFooter className="sm:justify-center pt-1">
              <Button onClick={dismiss} className="w-full sm:w-auto">
                Got it
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="space-y-4 py-2">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
            <DialogFooter className="sm:justify-between gap-2">
              <Button type="button" variant="outline" onClick={dismiss} className="w-full sm:w-auto">
                Not now
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto gap-1.5">
                {loading ? "Subscribing…" : <><Mail className="size-4" /> Join</>}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
