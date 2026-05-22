"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { useOrg } from "@/contexts/org-context";
import {
  newsletterSubscribeErrorMessage,
  subscribeNewsletter,
} from "@/lib/newsletter-subscribe";

const NEWSLETTER_SEEN_KEY = "hasSeenNewsletterPopup";
const SURVEY_HANDLED_KEY = "surveyPopupHandled";
const SURVEY_HANDLED_EVENT = "bns:survey-popup-handled";
const NEWSLETTER_DELAY_MS = 12_000;

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

    let timer: ReturnType<typeof setTimeout> | null = null;

    const startNewsletterTimer = () => {
      if (timer) return;
      timer = setTimeout(() => {
        if (!sessionStorage.getItem(NEWSLETTER_SEEN_KEY)) {
          setIsOpen(true);
        }
      }, NEWSLETTER_DELAY_MS);
    };

    if (
      localStorage.getItem(SURVEY_HANDLED_KEY) === "true" ||
      sessionStorage.getItem(SURVEY_HANDLED_KEY) === "true"
    ) {
      startNewsletterTimer();
    } else {
      window.addEventListener(SURVEY_HANDLED_EVENT, startNewsletterTimer, { once: true });
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(SURVEY_HANDLED_EVENT, startNewsletterTimer);
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
        toast.info("You're already subscribed.");
      } else {
        toast.success("You're subscribed. Check your inbox for updates.");
      }
    } catch (err) {
      toast.error(newsletterSubscribeErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!showNewsletter || !isOpen) return null;

  return (
    <div className="fixed bottom-4 right-2 left-2 sm:right-4 sm:left-auto z-[200] w-auto sm:w-[92vw] sm:max-w-md">
      <div className="relative w-full rounded-2xl border border-border bg-background p-5 text-foreground shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-2 text-white/80 transition hover:bg-black/35 hover:text-white"
          aria-label="Close newsletter popup"
        >
          <X size={18} />
        </button>
        <p className="mb-2 text-xs font-semibold tracking-wide text-primary">NEWSLETTER</p>
        <h3 className="mb-2 text-xl font-semibold">Get budget updates in your inbox</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Subscribe for explainers, stories, and policy highlights from Budget Ndio Story.
        </p>

        {subscribed ? (
          <p className="rounded-xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">
            You are subscribed. Thank you for joining us.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-foreground/5 px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
            />
            <button
              type="button"
              onClick={dismiss}
              className="h-11 rounded-xl border border-border bg-foreground/5 px-4 text-sm font-medium text-foreground transition hover:bg-foreground/10 w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70 w-full sm:w-auto"
            >
              {loading ? "..." : "Join"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
