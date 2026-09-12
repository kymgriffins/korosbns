"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, MessageSquare, Send } from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandWhatsapp,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";
import Balancer from "react-wrap-balancer";
import { toast } from "sonner";
import { useOrg } from "@/contexts/org-context";
import { CONTACT_INTENT_COPY } from "@/constants/programmes-content";
import { citizenApi } from "@/lib/api-client";
import { ApiRequestError } from "@/lib/api-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MarketingPageBody,
  MarketingPageHero,
  MarketingPageShell,
} from "@/components/marketing/marketing-page-frame";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { GsapReveal } from "@/motion/gsap";
import { cn } from "@/utils";
import defaultContact from "@/content/contact.json";
import { useEffect } from "react";

const socials = [
  { name: "X", icon: IconBrandX, href: "https://x.com/budgetndiostory" },
  { name: "YouTube", icon: IconBrandYoutube, href: "https://youtube.com/@budgetndiostory" },
  { name: "Instagram", icon: IconBrandInstagram, href: "https://instagram.com/budgetndiostory" },
  { name: "LinkedIn", icon: IconBrandLinkedin, href: "https://www.linkedin.com/company/budget-ndio-story/" },
  { name: "WhatsApp", icon: IconBrandWhatsapp, href: "https://wa.me/254790631623" },
  { name: "TikTok", icon: IconBrandTiktok, href: "https://www.tiktok.com/@budget.ndio.story" },
  { name: "Facebook", icon: IconBrandFacebook, href: "https://www.facebook.com/share/1CPg2LgfVJ/" },
] as const;

export default function ContactPage() {
  const { config } = useOrg();
  const [contactData, setContactData] = useState(defaultContact);
  const searchParams = useSearchParams();
  const intentKey = searchParams.get("intent")?.trim().toLowerCase() ?? "";
  const intent = CONTACT_INTENT_COPY[intentKey];

  useEffect(() => {
    fetch("/api/cms/contact")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) {
          setContactData(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const contactEmail =
    contactData?.directContact?.email ||
    config?.contact?.email ||
    "info@budgetndiostory.org";
  const contactPhone =
    contactData?.directContact?.phone ||
    "+254 790 631 623";
  const contactPrompt =
    contactData?.directContact?.prompt ||
    "Ready to collaborate?";
  const [isSending, setIsSending] = useState(false);
  const [formExpanded, setFormExpanded] = useState(Boolean(intent));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: intent?.messagePrefill ?? "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSending(true);
    try {
      await citizenApi.submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        source: intentKey ? `contact-page:${intentKey}` : "contact-page",
      });
      toast.success("Message sent! We'll reply within 48 hours.");
      setFormData({ name: "", email: "", message: "" });
      setFormExpanded(false);
    } catch (error) {
      const message =
        error instanceof ApiRequestError
          ? error.message
          : "Network error. Check your connection.";
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  const heroTitle = intent ? (
    intent.title
  ) : (
    <>
      {contactData?.hero?.title || (
        <>
          Let&apos;s talk <span className={T.highlight}>budget stories</span>
        </>
      )}
    </>
  );

  return (
    <MarketingPageShell>
      <MarketingPageHero
        eyebrow={intent ? "Get in touch" : (contactData?.hero?.eyebrow || "Contact")}
        title={heroTitle}
        description={
          intent?.blurb ??
          (contactData?.hero?.description ||
            "Have a question or want to collaborate? We read every message and typically reply within 48 hours.")
        }
        align="center"
      />

      <MarketingPageBody className="space-y-10">
        <GsapReveal className="mx-auto max-w-2xl space-y-8">
          <ul className="flex flex-wrap justify-center gap-2">
            {socials.map((social) => (
              <li key={social.name}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <social.icon className="size-4" aria-hidden />
                  <span className="hidden sm:inline">{social.name}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="space-y-4 text-center">
            <h2 className={T.sectionTitle}>{contactPrompt}</h2>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-foreground/75">
              <p>
                Email:{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {contactEmail}
                </a>
              </p>
              {contactPhone && (
                <>
                  <span aria-hidden className="text-border">·</span>
                  <p>
                    Direct / WhatsApp:{" "}
                    <a
                      href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {contactPhone}
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>

          {!formExpanded ? (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setFormExpanded(true)}
                className={cn(T.btnPrimary, "rounded-full px-8")}
              >
                <MessageSquare className="mr-2 size-4" aria-hidden />
                Start a conversation
                <ArrowRight className="ml-2 size-4" aria-hidden />
              </Button>
            </div>
          ) : (
            <form
              className="space-y-4 rounded-2xl border border-border/60 bg-card p-5 sm:p-6"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, email: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="What's on your mind?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, message: e.target.value }))
                  }
                  className="min-h-[120px] resize-none"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className={cn(T.btnPrimary, "h-11 flex-1 rounded-full")}
                  disabled={isSending}
                >
                  {isSending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" aria-hidden />
                  ) : (
                    <Send className="mr-2 size-3.5" aria-hidden />
                  )}
                  {isSending ? "Sending…" : "Send message"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-11 rounded-full px-4 text-muted-foreground"
                  onClick={() => setFormExpanded(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </GsapReveal>

        <footer className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-muted-foreground sm:flex-row">
          <p className="text-xs">© 2026 Budget Ndio Story.</p>
          <nav className="flex items-center gap-4 text-[10px] font-semibold uppercase tracking-wider">
            <a href={`mailto:${contactEmail}`} className="hover:text-foreground">
              Email
            </a>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </nav>
        </footer>
      </MarketingPageBody>
    </MarketingPageShell>
  );
}
