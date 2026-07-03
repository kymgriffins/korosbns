"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, RefreshCcw, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  newsletterSubscribeErrorMessage,
  subscribeNewsletter,
} from "@/lib/newsletter-subscribe";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const { alreadySubscribed } = await subscribeNewsletter({
        email,
        name: email.split("@")[0],
        source: "learn_page",
      });
      setSubscribed(true);
      if (alreadySubscribed) {
        toast.info("You're already subscribed.");
      } else {
        toast.success("You're subscribed. Check your inbox for updates.");
      }
    } catch (error) {
      toast.error(newsletterSubscribeErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30"
      >
        <CheckCircle className="size-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
        <p className="text-foreground/60">You'll receive budget updates.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-muted/30 border border-border"
    >
      <div className="text-center mb-6">
        <Mail className="size-10 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold">Stay Updated</h3>
        <p className="text-sm text-foreground/60">
          Get budget insights delivered.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-muted/30 border border-border text-sm"
          required
        />
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="px-4 rounded-xl"
        >
          {loading ? (
            <RefreshCcw className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </motion.div>
  );
}
