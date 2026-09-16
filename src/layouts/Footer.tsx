"use client";

import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { socialLinks as defaultSocialLinks } from "@/constants/links";
import { useOrg } from "@/contexts/org-context";
import {
  newsletterSubscribeErrorMessage,
  subscribeNewsletter,
} from "@/lib/newsletter-subscribe";
import { socialIconComponents } from "@/components/ui/social-icons";

// Lean footer links with only working pages
const footerLinks = {
  product: [
    { label: "Stories", href: "/projects" },
    { label: "Explainers", href: "/about" },
    { label: "Events", href: "/events" },
  ],
  resources: [
    { label: "Budget Guides", href: "/reports" },
    { label: "Budget Glossary", href: "/glossary" },
    { label: "Help & FAQ", href: "/help" },
    { label: "Surveys", href: "/surveys" },
    { label: "Contact", href: "/contact" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Careers", href: "/careers" },
  ],
};

export function Footer() {
  const { config, showNewsletter } = useOrg();
  const [email, setEmail] = useState<string>("");

  const displaySocial = useMemo(() => {
    const api = config.socials?.filter((s) => s.url && s.platform);
    if (api?.length) {
      return api.map((s) => ({
        label: s.label?.trim() || s.platform,
        href: s.url,
        icon: s.platform === "twitter" ? "x" : s.platform,
      }));
    }
    return defaultSocialLinks;
  }, [config.socials]);

  const footerBlurb =
    config.layout?.footer_note ||
    config.tagline ||
    config.mission ||
    "Budget Ndio Story - civic fiscal literacy for Kenya.";
  const organizationTitle = config.seo?.title || "Budget Ndio Story";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      const { alreadySubscribed } = await subscribeNewsletter({
        email,
        name: email.split("@")[0],
        source: "website_footer",
      });
      if (alreadySubscribed) {
        toast.info("You're already subscribed. Check your inbox (and check your Spam/Junk folder if you do not see our emails)!");
      } else {
        toast.success("Thanks for subscribing! Check your inbox (and check your Spam/Junk folder if you do not receive it in a few minutes)!");
      }
      setEmail("");
    } catch (error) {
      toast.error(newsletterSubscribeErrorMessage(error));
    }
  };

  return (
    <footer className="w-full relative mt-16 lg:mt-24 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-foreground/0 via-foreground/20 to-foreground/0" />
      <div className="absolute top-0 inset-x-0 w-1/2 mx-auto h-4 bg-foreground/40 blur-[4rem]" />

      <Wrapper className="py-12 lg:py-16 flex flex-col">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 w-full max-w-6xl mx-auto mb-10">
          {/* Brand Column */}
          <div className="flex flex-col items-start text-left">
            <Link href="/" className="inline-block group mb-3">
              <Image
                src="/logo.svg"
                alt={organizationTitle}
                width={140}
                height={28}
                className="h-6 w-auto transition-opacity group-hover:opacity-80"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {footerBlurb}
            </p>

            {showNewsletter && (
              <form onSubmit={handleSubmit} className="mt-5 w-full max-w-sm">
                <p className="text-xs font-medium mb-2 text-foreground/70">
                  Subscribe to updates
                </p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-9 text-sm bg-background border-border/60 focus-visible:ring-1 focus-visible:ring-primary rounded-lg px-3"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-9 px-4 rounded-lg text-sm"
                  >
                    Join
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1">
              Product
            </h4>
            {footerLinks.product.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1">
              Resources
            </h4>
            {footerLinks.resources.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/50 mb-1">
              Company
            </h4>
            {footerLinks.company.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col gap-4 pt-6 border-t border-border/40 w-full max-w-6xl mx-auto">
          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-3">
            {displaySocial.map((social) => {
              const Icon = socialIconComponents[social.icon as string];
              return (
                <Link
                  key={`${social.label}-${social.href}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="group relative size-9 flex items-center justify-center rounded-full bg-muted/50 hover:bg-primary/10 border border-border/60 hover:border-primary/30 transition-all duration-200"
                >
                  {Icon ? (
                    <Icon className="size-[18px] opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {social.label[0]}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Copyright & Legal Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p className="text-center sm:text-left">
              © {new Date().getFullYear()} {organizationTitle}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/glossary"
                className="hover:text-foreground transition-colors"
              >
                Glossary
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/help"
                className="hover:text-foreground transition-colors"
              >
                Help & FAQ
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <span className="text-border">•</span>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
}
