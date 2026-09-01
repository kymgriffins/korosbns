"use client";

import Link from "next/link";
import { useOrg } from "@/contexts/org-context";
import { socialLinks as defaultSocialLinks } from "@/constants/links";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";
import { useMemo } from "react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Programmes", href: "/programmes" },
  { label: "Learn", href: "/learn" },
  { label: "Reports", href: "/reports" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const { config } = useOrg();

  const footerBlurb =
    config.layout?.footer_note ||
    config.tagline ||
    "Discover Kenya's budget through journeys that stay in your stories — civic literacy that lives beyond the headlines.";
  const organizationTitle = config.seo?.title || "Budget Ndio Story";

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

  return (
    <footer className="mt-16 lg:mt-24">
      {/* Dark editorial band — Marwa-style */}
      <div className="editorial-surface-invert relative bg-surface-invert">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--surface-invert)_0%,_transparent_70%)] opacity-60"
          aria-hidden
        />

        <div className={cn(SECTION_SHELL_INNER, "relative z-10 py-16 md:py-20 lg:py-24")}>
          <div className="grid gap-12 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5 space-y-5">
              <Link href="/" className="inline-block">
                <span className="font-heading text-2xl font-bold text-surface-invert-foreground md:text-3xl">
                  {organizationTitle}
                </span>
              </Link>
              <div className="h-px w-12 bg-surface-invert-foreground/20" />
              <p className="max-w-sm text-sm leading-relaxed text-surface-invert-foreground/70 md:text-base">
                {footerBlurb}
              </p>
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <h3 className="mb-4 text-sm font-semibold text-surface-invert-foreground">
                Navigation
              </h3>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-invert-foreground/60 transition-colors hover:text-surface-invert-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h3 className="mb-4 text-sm font-semibold text-surface-invert-foreground">
                Social
              </h3>
              <ul className="space-y-3">
                {displaySocial.map((social) => (
                  <li key={social.href}>
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-surface-invert-foreground/60 transition-colors hover:text-surface-invert-foreground"
                    >
                      {social.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-footer utility bar */}
      <div className="border-t border-border/40 bg-background">
        <div
          className={cn(
            SECTION_SHELL_INNER,
            "flex flex-col items-center justify-between gap-3 py-4 text-xs text-muted-foreground sm:flex-row",
          )}
        >
          <p>
            © {new Date().getFullYear()} {organizationTitle}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
