"use client";

import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { footerLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";

import { socialLinks as defaultSocialLinks } from "@/constants/links";
import { useOrg } from "@/contexts/org-context";
import {
  newsletterSubscribeErrorMessage,
  subscribeNewsletter,
} from "@/lib/newsletter-subscribe";

function integrationIconAsset(icon: string): string {
  const key =
    icon === "x" || icon === "twitter"
      ? "social-x"
      : icon === "link" || !icon
        ? "layers"
        : icon;
  return `/icons/integrations/${key}.svg`;
}

const Footer = () => {
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
    "Budget Ndio Story — civic fiscal literacy for Kenya.";
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
        toast.info("You're already subscribed.");
      } else {
        toast.success("Thanks for subscribing!");
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

      <Wrapper className="py-16 flex flex-col">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 w-full max-w-6xl mx-auto mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col items-start text-left">
            <Link href="/" className="inline-block group mb-4">
              <Image
                src="/logo.svg"
                alt={organizationTitle}
                width={160}
                height={32}
                className="h-6 lg:h-7 w-auto transition-all group-hover:brightness-110"
              />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{footerBlurb}</p>

            {showNewsletter && (
              <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
                <p className="text-sm font-medium mb-3">Subscribe to the Story</p>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-10 text-sm bg-foreground/5 border-foreground/10 focus-visible:ring-0 focus-visible:ring-transparent rounded-full px-4"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="h-10 px-6 rounded-full"
                  >
                    Subscribe
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Product Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Product
            </h4>
            {footerLinks.product.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Resources Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Resources
            </h4>
            {footerLinks.resources.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">
              Company
            </h4>
            {footerLinks.company.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-foreground/5 w-full max-w-6xl mx-auto">
          <div className="text-center sm:text-left text-xs text-muted-foreground space-y-0.5">
            <p>
              © {new Date().getFullYear()} {organizationTitle}. All rights reserved.
            </p>
            {config.layout?.footer_note ? (
              <p className="text-[11px] text-muted-foreground/90">{config.layout.footer_note}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-4">
            {displaySocial.map((social, index) => (
              <Link
                key={`${social.label}-${social.href}`}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="group relative size-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors overflow-hidden border border-foreground/10"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border border-primary/25"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12 + index * 1.2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <motion.span
                  aria-hidden
                  className="absolute -top-1 -right-1 size-2 rounded-full bg-primary/70 blur-[1px]"
                  animate={{ opacity: [0.2, 0.9, 0.2], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.08 }}
                />
                <motion.div whileHover={{ y: -1.5, scale: 1.06 }} transition={{ duration: 0.2 }}>
                  <Image
                    src={integrationIconAsset(String(social.icon))}
                    alt={social.label}
                    width={20}
                    height={20}
                    className={social.icon === "x" ? "size-4" : "size-5"}
                  />
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
};

export default Footer;
