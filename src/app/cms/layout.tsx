import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowUpRight,
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
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/cms"
              className="flex items-center gap-2.5 font-heading text-base font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
                <Image
                  src="/logo.svg"
                  alt="Budget Ndio Story"
                  width={28}
                  height={28}
                  className="object-contain"
                  priority
                />
              </span>
              <div>
                <span className="text-sm font-bold tracking-tight">Budget Ndio Story</span>
                <span className="block font-mono text-[10px] text-muted-foreground font-semibold">
                  CMS Administration Panel
                </span>
              </div>
            </Link>

            <Badge
              variant="outline"
              className="hidden sm:inline-flex border-primary/30 bg-primary/10 font-mono text-[11px] font-semibold text-primary"
            >
              /cms
            </Badge>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Cloudflare R2: bns bucket live</span>
            </div>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Link href="/" target="_blank" rel="noreferrer">
                <span>View Live Site</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden md:inline-flex gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <Link href="/programmes" target="_blank" rel="noreferrer">
                <span>/programmes</span>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </Link>
            </Button>

            <div className="h-4 w-px bg-border/60 hidden sm:block" />

            <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-muted/40 px-2.5 py-1 text-xs">
              <ShieldCheck className="size-3.5 text-primary" />
              <span className="hidden sm:inline text-muted-foreground text-[11px]">Master:</span>
              <span className="font-mono text-[11px] font-semibold text-foreground">
                {MASTER_CMS_EMAIL}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <footer className="border-t border-border/60 bg-muted/20 py-4 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>
            Budget Ndio Story &middot; Headless Visual Studio with Direct Disk &amp; Cloudflare R2 Persistence
          </div>
          <div className="font-mono text-muted-foreground">
            Authoritative route: <code className="font-bold text-foreground">/cms</code>
          </div>
        </div>
      </footer>
    </div>
  );
}
