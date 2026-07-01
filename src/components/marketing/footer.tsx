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
import { IconBrandX, IconBrandLinkedin, IconBrandWhatsapp, IconBrandYoutube, IconBrandTiktok, IconBrandInstagram, IconBrandFacebook } from "@tabler/icons-react";
import { socialLinks as defaultSocialLinks } from "@/constants/links";
import { useOrg } from "@/contexts/org-context";
import { newsletterSubscribeErrorMessage, subscribeNewsletter } from "@/lib/newsletter-subscribe";

const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  x: IconBrandX, twitter: IconBrandX, linkedin: IconBrandLinkedin, whatsapp: IconBrandWhatsapp,
  youtube: IconBrandYoutube, tiktok: IconBrandTiktok, instagram: IconBrandInstagram, facebook: IconBrandFacebook,
};

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const staggerFooter = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const fadeUpFooter = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOut } },
};

const Footer = () => {
  const { config, showNewsletter } = useOrg();
  const [email, setEmail] = useState("");
  const displaySocial = useMemo(() => {
    const api = config.socials?.filter((s) => s.url && s.platform && s.platform !== "website");
    return api?.length ? api.map((s) => ({ label: s.label?.trim() || s.platform, href: s.url, icon: s.platform === "twitter" ? "x" : s.platform })) : defaultSocialLinks;
  }, [config.socials]);
  const footerBlurb = config.layout?.footer_note || config.tagline || config.mission || "Budget Ndio Story — civic fiscal literacy for Kenya.";
  const organizationTitle = config.seo?.title || "Budget Ndio Story";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const { alreadySubscribed } = await subscribeNewsletter({ email, name: email.split("@")[0], source: "website_footer" });
      if (alreadySubscribed) toast.info("You're already subscribed. Check your inbox!");
      else toast.success("Thanks for subscribing! Check your inbox!");
      setEmail("");
    } catch (error) { toast.error(newsletterSubscribeErrorMessage(error)); }
  };

  return (
    <motion.footer initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerFooter} className="w-full relative mt-16 lg:mt-24 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-foreground/0 via-foreground/20 to-foreground/0" />
      <div className="absolute top-0 inset-x-0 w-1/2 mx-auto h-4 bg-foreground/40 blur-[4rem]" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      <Wrapper className="py-16 flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 w-full max-w-6xl mx-auto mb-12">
          <motion.div variants={fadeUpFooter} className="lg:col-span-2 flex flex-col items-start text-left">
            <Link href="/" className="inline-block group mb-4">
              <Image src="/logo.svg" alt={organizationTitle} width={160} height={32} className="h-6 lg:h-7 w-auto transition-all group-hover:brightness-110" />
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{footerBlurb}</p>
            {showNewsletter && (
              <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
                <p className="text-sm font-medium mb-3">Subscribe to the Story</p>
                <div className="flex gap-2">
                  <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required className="flex-1 h-10 text-sm bg-foreground/5 border-foreground/10 focus-visible:ring-0 focus-visible:ring-transparent rounded-full px-4" />
                  <Button type="submit" size="sm" className="h-10 px-6 rounded-full">Subscribe</Button>
                </div>
              </form>
            )}
          </motion.div>
          <motion.div variants={fadeUpFooter} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Product</h4>
            {footerLinks.product.map((link, idx) => <Link key={idx} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{link.label}</Link>)}
          </motion.div>
          <motion.div variants={fadeUpFooter} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Resources</h4>
            {footerLinks.resources.map((link, idx) => <Link key={idx} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{link.label}</Link>)}
          </motion.div>
          <motion.div variants={fadeUpFooter} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Company</h4>
            {footerLinks.company.map((link, idx) => <Link key={idx} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">{link.label}</Link>)}
          </motion.div>
        </div>
        <motion.div variants={fadeUpFooter} className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-foreground/5 w-full max-w-6xl mx-auto">
          <div className="text-center sm:text-left text-xs text-muted-foreground space-y-0.5">
            <p>&copy; {new Date().getFullYear()} {organizationTitle}. All rights reserved.</p>
            {config.layout?.footer_note ? <p className="text-[11px] text-muted-foreground/90">{config.layout.footer_note}</p> : null}
          </div>
          <div className="flex items-center gap-3">
            {displaySocial.map((social) => (
              <Link key={`${social.label}-${social.href}`} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} className="group relative size-9 flex items-center justify-center rounded-full bg-foreground/10 hover:bg-primary/15 transition-colors overflow-hidden border border-foreground/15 hover:border-primary/40" title={social.label}>
                <motion.div whileHover={{ y: -1, scale: 1.1 }} transition={{ duration: 0.15 }}>
                  {(() => { const Icon = socialIconMap[social.icon as string]; return Icon ? <Icon className="size-[18px] text-foreground/80 group-hover:text-primary transition-colors" /> : <span className="text-xs font-semibold text-foreground/80 group-hover:text-primary transition-colors uppercase">{String(social.icon).charAt(0)}</span>; })()}
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
          </div>
        </motion.div>
      </Wrapper>
    </motion.footer>
  );
};

export default Footer;
