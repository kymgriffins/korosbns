"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useOrg } from "@/contexts/org-context";
import { socialLinks as defaultSocialLinks } from "@/constants/links";
import { socialIconComponents } from "@/components/ui/social-icons";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

/** Partner-oriented chrome: no Learn/Reports capture paths. */
const minimalNavLinks = [
  { label: "Programmes", href: "/programmes" },
  { label: "About", href: "/about" },
  { label: "Studios", href: "/bns-studio" },
  { label: "Budget Glossary", href: "/glossary" },
  { label: "Help & FAQ", href: "/help" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

function normalizeSocialIcon(platform: string): string {
  const key = platform.trim().toLowerCase();
  return key === "twitter" ? "x" : key;
}

export default function MinimalFooter() {
  const { config } = useOrg();
  const organizationTitle = config.seo?.title || "Budget Ndio Story";

  const displaySocial = useMemo(() => {
    const api = config.socials?.filter(
      (s) => s.url && s.platform && s.platform !== "website",
    );
    if (api?.length) {
      return api.map((s) => ({
        label: s.label?.trim() || s.platform,
        href: s.url,
        icon: normalizeSocialIcon(s.platform),
      }));
    }
    return defaultSocialLinks.map((s) => ({
      ...s,
      icon: normalizeSocialIcon(s.icon),
    }));
  }, [config.socials]);

  return (
    <footer className="w-full border-t border-border/40 bg-background/95 text-foreground py-8 sm:py-10">
      <div className={cn(SECTION_SHELL_INNER, "flex flex-col gap-6 sm:gap-8")}>
        {/* Top Row: Brand Summary & Navigation Links */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/30">
          <div className="space-y-1.5">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <Image
                src="/logo.svg"
                alt={organizationTitle}
                width={130}
                height={26}
                className="h-5 sm:h-6 w-auto transition-opacity group-hover:opacity-85 dark:brightness-110"
              />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-md">
              Civic fiscal literacy for Kenya. Strictly non-partisan, editorially independent, and
              grounded in verified public finance records.
            </p>
          </div>

          {/* Navigation links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium">
            {minimalNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Row: Legal Note, Copyright & Social Icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-center sm:text-left font-mono text-[11px]">
            <span>© {new Date().getFullYear()} {organizationTitle}.</span>
            <span className="hidden sm:inline text-border">•</span>
            <span>Article 201 · CoK 2010</span>
            <span className="hidden sm:inline text-border">•</span>
            <span>All rights reserved.</span>
          </div>

          {/* Compact Socials */}
          <div className="flex items-center gap-2">
            {displaySocial.map((social) => {
              const Icon = socialIconComponents[social.icon];
              return (
                <Link
                  key={`${social.label}-${social.href}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="size-8 rounded-full flex items-center justify-center border border-border/60 bg-muted/30 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  title={social.label}
                >
                  {Icon ? (
                    <Icon className="size-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold uppercase">{social.label.charAt(0)}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
