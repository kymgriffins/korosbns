"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useOrg } from "@/contexts/org-context";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Learn", href: "/learn" },
  { label: "Budget News", href: "/budgetnews" },
  { label: "Contact", href: "/contact" },
  { label: "Team", href: "/team" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy", href: "/privacy" },
];

export default function Footer() {
  const { config } = useOrg();
  const footerBlurb =
    config.layout?.footer_note ||
    config.tagline ||
    "Stay informed with budget updates, civic education content, and policy insights from Budget Ndio Story.";
  const organizationTitle = config.seo?.title || "Budget Ndio Story";

  return (
    <footer className="relative overflow-hidden border-t border-border bg-muted/40 text-foreground dark:bg-card/50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/14 dark:via-primary/6" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-24 lg:px-8">
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-12">
            <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both">
              <div className="col-span-12 md:col-span-3">
                <p className="w-full text-sm leading-relaxed text-muted-foreground md:text-base">
                  {footerBlurb}
                </p>
              </div>
              <div className="md:col-span-1" />
              <div className="col-span-12 md:col-span-8">
                <div className="flex flex-col gap-5 lg:flex-row lg:gap-10">
                  <form className="flex flex-1 gap-2">
                    <Input
                      required
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="h-11 rounded-full border-border/80 bg-background/90 py-2 text-foreground shadow-sm placeholder:text-muted-foreground dark:bg-background/70"
                    />
                    <Button
                      type="submit"
                      className="h-11 cursor-pointer rounded-full px-5 font-medium"
                    >
                      Subscribe
                    </Button>
                  </form>
                  <p className="flex-1 text-sm text-muted-foreground">
                    By subscribing, you agree to receive our promotional emails.
                    You can unsubscribe at any time.
                  </p>
                </div>
              </div>
            </div>
            <Separator className="bg-border/80" />
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both md:col-span-7">
              <h2 className="mb-6 text-3xl font-medium text-foreground sm:text-5xl">
                Translating Numbers into{" "}
                <span className="font-heading italic text-primary">Narratives</span>{" "}
                — join us today.
              </h2>
              <Button
                asChild
                className="h-auto rounded-full px-6 py-3.5 font-semibold"
              >
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
            <div className="md:col-span-1" />
            <div className="col-span-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-100 ease-in-out fill-mode-both md:col-span-2">
              <div className="flex flex-col gap-4">
                {footerLinks.slice(0, 4).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-base text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="col-span-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 ease-in-out fill-mode-both md:col-span-2">
              <div className="flex flex-col gap-4">
                {footerLinks.slice(4, 8).map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-base text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <Separator className="bg-border/80" />
            <p className="animate-in fade-in slide-in-from-bottom-10 text-sm text-muted-foreground duration-1000 delay-300 ease-in-out fill-mode-both">
              © {new Date().getFullYear()} {organizationTitle}. All Rights
              Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
