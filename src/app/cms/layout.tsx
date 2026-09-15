import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MASTER_CMS_EMAIL } from "@/lib/headless-cms";

export const metadata: Metadata = {
  title: "Headless CMS Portal | Budget Ndio Story",
  description:
    "Dedicated Content Management System panel for Budget Ndio Story pages, blogs, and custom dynamic pages.",
};

export default function CmsStandaloneLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--surface-canvas,#ffffff)] text-[var(--color-midnight-ink,#061b31)] flex flex-col font-sans selection:bg-[var(--color-indigo-ink,#533afd)]/20">
      {/* Brand Agency Sticky Top Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-frost,#e5edf5)] bg-white/90 backdrop-blur-md dark:bg-[#061b31]/90 supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/cms"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-[var(--color-frost,#e5edf5)] bg-white shadow-xs group-hover:border-[var(--color-lavender-border,#b9b9f9)] transition-colors">
                <Image
                  src="/logo.svg"
                  alt="Budget Ndio Story"
                  width={26}
                  height={26}
                  className="object-contain"
                  priority
                />
              </span>
              <div>
                <span className="text-sm font-semibold tracking-[-0.14px] text-[var(--color-midnight-ink,#061b31)] dark:text-white flex items-center gap-1.5">
                  Budget Ndio Story
                  <Sparkles className="size-3 text-[var(--color-indigo-ink,#533afd)]" />
                </span>
                <span className="block font-mono text-[10px] text-[var(--color-slate,#64748d)] font-medium">
                  Brand Agency CMS Studio
                </span>
              </div>
            </Link>

            <Badge
              variant="outline"
              className="hidden sm:inline-flex border-[var(--color-lavender-border,#b9b9f9)] bg-[var(--color-periwinkle-wash,#e8e9ff)]/60 font-mono text-[11px] font-semibold text-[var(--color-indigo-ink,#533afd)] rounded-[4px] px-2 py-0.5"
            >
              /cms
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 rounded-[4px] border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloudflare R2: Live Sync</span>
            </div>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden md:inline-flex gap-1 text-xs border-[var(--color-frost,#e5edf5)] hover:border-[var(--color-lavender-border,#b9b9f9)] text-[var(--color-midnight-ink,#061b31)] hover:text-[var(--color-indigo-ink,#533afd)] rounded-[4px] px-3 font-medium transition-all"
            >
              <Link href="/" target="_blank" rel="noreferrer">
                <span>View Live Site</span>
                <ArrowUpRight className="size-3.5 text-[var(--color-indigo-ink,#533afd)]" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden md:inline-flex gap-1 text-xs border-[var(--color-frost,#e5edf5)] hover:border-[var(--color-lavender-border,#b9b9f9)] text-[var(--color-midnight-ink,#061b31)] hover:text-[var(--color-indigo-ink,#533afd)] rounded-[4px] px-3 font-medium transition-all"
            >
              <Link href="/programmes" target="_blank" rel="noreferrer">
                <span>/programmes</span>
                <ArrowUpRight className="size-3.5 text-[var(--color-indigo-ink,#533afd)]" />
              </Link>
            </Button>

            <div className="h-4 w-px bg-[var(--color-frost,#e5edf5)] hidden sm:block" />

            <div className="flex items-center gap-1.5 rounded-[4px] border border-[var(--color-lavender-border,#b9b9f9)] bg-[var(--color-periwinkle-wash,#e8e9ff)]/40 px-2.5 py-1 text-xs">
              <ShieldCheck className="size-3.5 text-[var(--color-indigo-ink,#533afd)]" />
              <span className="hidden sm:inline text-[var(--color-slate,#64748d)] text-[11px]">Master:</span>
              <span className="font-mono text-[11px] font-semibold text-[var(--color-midnight-ink,#061b31)]">
                {MASTER_CMS_EMAIL}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-[var(--color-frost,#e5edf5)] bg-[var(--surface-band,#f8fafd)] py-6 text-center text-xs text-[var(--color-slate,#64748d)]">
        <div className="mx-auto max-w-[1320px] px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] font-light">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--color-midnight-ink,#061b31)]">Budget Ndio Story</span>
            <span>&middot;</span>
            <span>Brand Agency Headless Studio</span>
          </div>
          <div className="font-mono text-[11px] text-[var(--color-steel,#50617a)]">
            Authoritative route: <code className="font-bold text-[var(--color-indigo-ink,#533afd)] bg-[var(--color-periwinkle-wash,#e8e9ff)] px-1.5 py-0.5 rounded-[4px]">/cms</code>
          </div>
        </div>
      </footer>
    </div>
  );
}

