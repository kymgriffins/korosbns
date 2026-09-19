"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useOrg } from "@/contexts/org-context";
import { useThemeStructure } from "@/hooks/use-theme-preset";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";

/** Partner-oriented chrome: no Learn/Reports capture paths. */
const minimalNavLinks = [
  { label: "Programmes", href: "/programmes", primary: true },
  { label: "About", href: "/about", primary: true },
  { label: "Studios", href: "/bns-studio", primary: false },
  { label: "Budget Glossary", href: "/glossary", primary: false },
  { label: "Help & FAQ", href: "/help", primary: false },
  { label: "Privacy", href: "/privacy", primary: false },
  { label: "Terms", href: "/terms", primary: false },
  { label: "Contact", href: "/contact", primary: true },
];

const fallbackPartnerMarks = [
  "Wanahabari Lab",
  "House of Fiscal Wisdom",
  "BNS Studio",
];

export default function MinimalFooter() {
  const { config } = useOrg();
  const structure = useThemeStructure();
  const isEditorial = structure === "editorial";
  const organizationTitle = config.seo?.title || "Budget Ndio Story";

  const partnerMarks = useMemo(() => {
    const names =
      config.partners
        ?.map((partner) => partner.name?.trim())
        .filter((name): name is string => Boolean(name)) ?? [];

    return names.length ? names.slice(0, 6) : fallbackPartnerMarks;
  }, [config.partners]);

  const primaryLinks = minimalNavLinks.filter((l) => l.primary);
  const extraLinks = minimalNavLinks.filter((l) => !l.primary);

  return (
    <footer
      data-editorial-footer={isEditorial ? "true" : undefined}
      className={cn(
        "w-full border-t border-stone-950 bg-[#f7f5ef] text-stone-950",
        isEditorial ? "py-6 sm:py-8" : "py-8 sm:py-10",
      )}
    >
      <div
        className={cn(
          SECTION_SHELL_INNER,
          "flex flex-col px-4 sm:px-6 md:px-10",
          isEditorial ? "gap-4 sm:gap-8" : "gap-6 sm:gap-8",
        )}
      >
        <div
          className={cn(
            "flex flex-col justify-between gap-4 md:flex-row md:items-end",
            isEditorial
              ? "border-b border-stone-950 pb-4 sm:gap-6 sm:pb-6"
              : "gap-6 border-b border-stone-950 pb-6",
          )}
        >
          <div className="max-w-2xl space-y-2">
            <Link href="/" className="group inline-flex items-end gap-3">
              <span className="font-serif text-4xl font-black uppercase leading-none tracking-[0.02em] transition-opacity group-hover:opacity-80">
                BNS
              </span>
              <span className="pb-1 text-[10px] font-semibold uppercase leading-none tracking-[0.28em] text-stone-600">
                Budget Ndio Story
              </span>
            </Link>
            <p
              data-footer-blurb
              className="max-w-xl text-sm leading-relaxed text-stone-700"
            >
              {isEditorial
                ? "Youth-led civic newsroom for Kenya's public money. Non-partisan. Evidence-led."
                : "Civic fiscal literacy for Kenya. Strictly non-partisan, editorially independent, and grounded in verified public finance records."}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-stone-700 transition-colors hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
            {extraLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-footer-nav-extra
                className="text-stone-500 transition-colors hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          data-footer-social
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-stone-950 pb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600 sm:gap-x-6"
          aria-label="Partner marks"
        >
          <span className="text-stone-950">Partner line</span>
          {partnerMarks.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-stone-600 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] sm:gap-3">
            <span>
              (c) {new Date().getFullYear()} {organizationTitle}.
            </span>
            <span className="hidden text-stone-400 sm:inline">/</span>
            <span className="hidden sm:inline">Article 201 / CoK 2010</span>
            <span className="hidden text-stone-400 sm:inline">/</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">
            No paywall. No party line. No noise.
          </p>
        </div>
      </div>
    </footer>
  );
}
