"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useOrg } from "@/contexts/org-context";
import { socialLinks as defaultSocialLinks } from "@/constants/links";
import { socialIconComponents } from "@/components/ui/social-icons";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Programmes", href: "/programmes" },
  { label: "Budget Glossary", href: "/glossary" },
  { label: "Help & FAQ", href: "/help" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];


type FooterLogo = {
  id: string;
  name: string;
  href: string;
  logo_url: string;
  external?: boolean;
};

const PARTNER_LOGOS: FooterLogo[] = [
  {
    id: "house-of-fiscal-wisdom",
    name: "House of Fiscal Wisdom",
    href: "https://house-of-fiscal-wisdom.org/",
    logo_url: "/images/partners/house-of-fiscal-wisdom.png",
    external: true,
  },
  {
    id: "committee-on-fiscal-studies",
    name: "Committee on Fiscal Studies",
    href: "https://cfs.uonbi.ac.ke/",
    logo_url: "/images/partners/committee-on-fiscal-studies.png",
    external: true,
  },
  {
    id: "tisa",
    name: "TISA Kenya",
    href: "https://newtisa.tisa.co.ke/",
    logo_url: "/images/partners/tisa.svg",
    external: true,
  },
];

function normalizeSocialIcon(platform: string): string {
  const key = platform.trim().toLowerCase();
  return key === "twitter" ? "x" : key;
}

export default function Footer() {
  const { config } = useOrg();

  const footerBlurb =
    config.layout?.footer_note ||
    config.tagline ||
    "Discover Kenya's budget through journeys that stay in your stories — civic literacy that lives beyond the headlines.";
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

  const partnerLogos = useMemo<FooterLogo[]>(() => {
    const bns: FooterLogo = {
      id: "budget-ndio-story",
      name: organizationTitle,
      href: "/",
      logo_url: "/logo.svg",
      external: false,
    };
    return [bns, ...PARTNER_LOGOS];
  }, [organizationTitle]);

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

              <ul
                className="flex flex-wrap items-center gap-2.5 pt-1"
                aria-label="BNS and partner logos"
              >
                {partnerLogos.map((partner) => {
                  const logo = (
                    <span className="relative flex h-10 w-24 items-center justify-center">
                      <Image
                        src={partner.logo_url}
                        alt={`${partner.name} logo`}
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </span>
                  );

                  return (
                    <li key={partner.id}>
                      {partner.external ? (
                        <a
                          href={partner.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${partner.name}`}
                          className="block outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {logo}
                        </a>
                      ) : (
                        <Link
                          href={partner.href}
                          aria-label={partner.name}
                          className="block outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {logo}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
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
                {displaySocial.map((social) => {
                  const Icon = socialIconComponents[social.icon];
                  return (
                    <li key={`${social.label}-${social.href}`}>
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-surface-invert-foreground/60 transition-colors hover:text-surface-invert-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {Icon ? (
                          <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                        ) : null}
                        <span>{social.label}</span>
                      </Link>
                    </li>
                  );
                })}
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
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/glossary" className="hover:text-foreground transition-colors">
              Budget Glossary
            </Link>
            <Link href="/help" className="hover:text-foreground transition-colors">
              Help & FAQ
            </Link>
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
