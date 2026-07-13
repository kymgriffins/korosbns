"use client";

import { useState } from "react";
import Link from "next/link";
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
import Wrapper from "@/components/global/wrapper";
import { useOrg } from "@/contexts/org-context";
import { citizenApi } from "@/lib/api-client";
import { ApiRequestError } from "@/lib/api-errors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils";

const socials = [
  { name: "X", icon: IconBrandX, href: "https://x.com/budgetndiostory", chipClass: "bg-foreground text-background" },
  { name: "YouTube", icon: IconBrandYoutube, href: "https://youtube.com/@budgetndiostory", chipClass: "bg-destructive text-destructive-foreground" },
  { name: "Instagram", icon: IconBrandInstagram, href: "https://instagram.com/budgetndiostory", chipClass: "bg-primary text-primary-foreground" },
  { name: "LinkedIn", icon: IconBrandLinkedin, href: "https://www.linkedin.com/company/budget-ndio-story/", chipClass: "bg-sky-600 text-white" },
  { name: "WhatsApp", icon: IconBrandWhatsapp, href: "https://wa.me/254790631623", chipClass: "bg-emerald-600 text-white" },
  { name: "TikTok", icon: IconBrandTiktok, href: "https://www.tiktok.com/@budget.ndio.story", chipClass: "bg-foreground text-background" },
  { name: "Facebook", icon: IconBrandFacebook, href: "https://www.facebook.com/share/1CPg2LgfVJ/", chipClass: "bg-blue-600 text-white" },
] as const;

export default function ContactPage() {
  const { config } = useOrg();
  const contactEmail = config?.contact?.email || "info@budgetndiostory.org";
  const [isSending, setIsSending] = useState(false);
  const [formExpanded, setFormExpanded] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

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
        source: "contact-page",
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

  return (
    <section className="relative min-h-dvh bg-background">
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <Wrapper className="relative z-10 flex min-h-[calc(100dvh-5rem)] flex-col justify-between py-6">
        <div className="flex flex-1 flex-col justify-center py-4">
          <div className="mx-auto w-full max-w-2xl space-y-8 px-4 sm:space-y-10 sm:px-6">
            <div className="space-y-3 text-center">
              <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
                Let&apos;s talk{" "}
                <span className="text-primary">Budget Stories.</span>
              </h1>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:text-base">
                <Balancer>
                  Have a question or want to collaborate? We read every message and
                  typically reply within 48 hours.
                </Balancer>
              </p>
            </div>

            <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {socials.map((social) => (
                <li key={social.name}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-xs font-medium transition-transform hover:-translate-y-0.5",
                      social.chipClass,
                    )}
                  >
                    <social.icon className="size-4" aria-hidden />
                    <span className="hidden sm:inline">{social.name}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-lg font-semibold">Ready to collaborate?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Or email us at{" "}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {contactEmail}
                  </a>
                </p>
              </div>

              {!formExpanded ? (
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={() => setFormExpanded(true)}
                    className="h-11 rounded-xl px-6 text-sm font-medium shadow-lg shadow-primary/10"
                  >
                    <MessageSquare className="mr-2 size-4" aria-hidden />
                    Start a conversation
                    <ArrowRight className="ml-2 size-4" aria-hidden />
                  </Button>
                </div>
              ) : (
                <form
                  className="space-y-4 rounded-2xl border border-border bg-card/80 p-4 sm:p-6"
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
                      className="min-h-[100px] resize-none"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="h-10 flex-1 text-sm"
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
                      className="h-10 px-3 text-sm text-muted-foreground"
                      onClick={() => setFormExpanded(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <footer className="mx-auto flex w-full max-w-3xl flex-col items-center justify-between gap-4 border-t border-border px-4 pt-6 text-muted-foreground sm:flex-row sm:px-6">
          <p className="text-xs">© 2026 Budget Ndio Story.</p>
          <nav className="flex items-center gap-4 text-[10px] font-medium uppercase tracking-wider">
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
      </Wrapper>
    </section>
  );
}
