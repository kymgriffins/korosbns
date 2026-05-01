"use client";

import { useEffect, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { API_BASE_URL } from "@/lib/api-config";

const NEWSLETTER_SEEN_KEY = "hasSeenNewsletterPopup";
const SURVEY_HANDLED_KEY = "surveyPopupHandled";
const SURVEY_HANDLED_EVENT = "bns:survey-popup-handled";
const NEWSLETTER_DELAY_MS = 12_000;

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
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

    if (sessionStorage.getItem(SURVEY_HANDLED_KEY) === "true") {
      startNewsletterTimer();
    } else {
      window.addEventListener(SURVEY_HANDLED_EVENT, startNewsletterTimer, { once: true });
    }

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(SURVEY_HANDLED_EVENT, startNewsletterTimer);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(NEWSLETTER_SEEN_KEY, "true");
    setIsOpen(false);
  };

  const handleSubscribe = async (event: FormEvent) => {
    event.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: email.split("@")[0],
          source: "homepage_popup",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubscribed(true);
        setEmail("");
        sessionStorage.setItem(NEWSLETTER_SEEN_KEY, "true");
        if (data.status === "already_subscribed") {
          toast.info("Already subscribed. Welcome back!");
        } else {
          toast.success("Newsletter subscription successful.");
        }
      } else {
        toast.error(data.message || "Subscription failed.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[200] w-[92vw] max-w-md">
      <div className="relative w-full rounded-2xl border border-white/15 bg-[#0F172A] p-5 text-white shadow-2xl animate-in fade-in slide-in-from-bottom duration-300">
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-2 text-white/80 transition hover:bg-black/35 hover:text-white"
          aria-label="Close newsletter popup"
        >
          <X size={18} />
        </button>
        <p className="mb-2 text-xs font-semibold tracking-wide text-cyan-300">NEWSLETTER</p>
        <h3 className="mb-2 text-xl font-semibold">Get budget updates in your inbox</h3>
        <p className="mb-4 text-sm text-slate-300">
          Subscribe for explainers, stories, and policy highlights from Budget Ndio Story.
        </p>

        {subscribed ? (
          <p className="rounded-xl bg-emerald-500/20 px-3 py-2 text-sm text-emerald-200">
            You are subscribed. Thank you for joining us.
          </p>
        ) : (
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="h-11 flex-1 rounded-xl border border-white/20 bg-white/10 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-cyan-300"
            />
            <button
              type="button"
              onClick={dismiss}
              className="h-11 rounded-xl border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-11 rounded-xl bg-cyan-500 px-4 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "..." : "Join"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
