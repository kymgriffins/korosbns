"use client";

import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { footerLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api-config";
import { PRIMARY_ORG_SLUG } from "@/constants/org";
import {
  type OrgSiteManifest,
  footerBlurbFromManifest,
  normalizeSocialLinksForFooter,
  orgDisplayNameFromManifest,
} from "@/lib/org-site-manifest";

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
  const [email, setEmail] = useState<string>("");
  const [siteManifest, setSiteManifest] = useState<OrgSiteManifest | null>(null);

  useEffect(() => {
    let alive = true;
    void fetch(`/api/public/site/${PRIMARY_ORG_SLUG}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (alive && data && typeof data === "object") {
          setSiteManifest(data as OrgSiteManifest);
        }
      })
      .catch(() => undefined);
    return () => { alive = false; };
  }, []);

  const displaySocial = useMemo(
    () => normalizeSocialLinksForFooter(siteManifest),
    [siteManifest],
  );
  const footerBlurb = footerBlurbFromManifest(siteManifest);
  const organizationTitle = orgDisplayNameFromManifest(siteManifest);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/newsletter/subscribe/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "website_footer" }),
      });
      if (response.ok) {
        toast.success("Thanks for joining the story! 🎉");
        setEmail("");
      } else {
        toast.error("Failed to subscribe");
      }
    } catch (error) {
      toast.error("Network error. Try again.");
    }
  };

  return (
    <footer className="w-full relative py-24 lg:py-40 bg-white dark:bg-black overflow-hidden">
      {/* Horizon Glow */}
      <div className="absolute bottom-0 inset-x-0 h-[30rem] bg-linear-to-t from-primary/10 to-transparent -z-10 blur-[8rem] opacity-40" />
      
      <Wrapper>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 max-w-7xl mx-auto">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <Link href="/" className="group mb-8">
              <Image
                src="/logo.svg"
                alt={organizationTitle}
                width={160}
                height={32}
                className="h-8 w-auto transition-transform duration-500 group-hover:scale-105"
              />
            </Link>
            <p className="text-xl font-medium tracking-tight leading-relaxed text-muted-foreground mb-12 max-w-md">
              {footerBlurb}
            </p>

            <div className="w-full max-w-md p-8 rounded-[2rem] bg-foreground/5 border border-foreground/5 backdrop-blur-sm">
              <h4 className="text-lg font-bold mb-2">Join the Story</h4>
              <p className="text-sm text-muted-foreground mb-6">Get weekly insights into the national budget, simplified.</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white dark:bg-black/50 border-foreground/10 rounded-full px-6 focus-visible:ring-1 focus-visible:ring-primary/30"
                />
                <Button type="submit" className="h-12 px-6 rounded-full font-bold">
                  Join
                </Button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6">
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Product</h5>
              {footerLinks.product.map((link) => (
                <Link key={link.label} href={link.href} className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Resources</h5>
              {footerLinks.resources.map((link) => (
                <Link key={link.label} href={link.href} className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-6">
              <h5 className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Social</h5>
              {displaySocial.map((social) => (
                <Link key={social.label} href={social.href} target="_blank" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  {social.label}
                  <Image src={integrationIconAsset(String(social.icon))} alt="" width={16} height={16} className="opacity-40 grayscale" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center md:justify-start gap-8 text-xs font-bold uppercase tracking-widest text-foreground/30">
            <p>© {new Date().getFullYear()} {organizationTitle}</p>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">System Operational</span>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
};

export default Footer;
