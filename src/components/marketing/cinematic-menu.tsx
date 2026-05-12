"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { X, ArrowRight, Mail } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { Icon } from "@iconify/react";
import { Routes } from "@/constants";
import { MAIN_MENU_SECTIONS } from "@/constants/navigation";
import { mailtoOrg, ORG_CONTACT_EMAIL } from "@/constants/org";
import { socialLinks } from "@/constants/links";
import { Button } from "../ui/button";

const brandIcons: Record<string, string> = {
  x: "ri:twitter-x-fill",
  linkedin: "lucide:linkedin",
  whatsapp: "lucide:whatsapp",
  youtube: "lucide:youtube",
  tiktok: "ri:tiktok-fill",
  instagram: "lucide:instagram",
  facebook: "lucide:facebook",
};

interface CinematicMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const CinematicMenu = ({ isOpen, onClose }: CinematicMenuProps) => {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0% 0 0% 0)" }}
          exit={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { duration: 0.65, ease: [0.76, 0, 0.24, 1] }
          }
          className="fixed inset-0 z-[200] flex max-h-[100dvh] flex-col bg-background text-foreground md:overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-b from-primary/[0.06] via-transparent to-muted/50 dark:from-primary/12 dark:to-background" />
            <motion.div
              className="absolute -left-[20%] top-[18%] h-[min(85vw,560px)] w-[min(85vw,560px)] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/18"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      x: [0, 36, 0],
                      y: [0, -28, 0],
                      opacity: [0.22, 0.42, 0.22],
                    }
              }
              transition={
                reduceMotion ? undefined : { duration: 18, repeat: Infinity, ease: "easeInOut" }
              }
            />
            <div className="absolute inset-0 bg-noise opacity-[0.035]" />
          </div>

          <div className="relative z-10 flex shrink-0 items-center justify-between border-b border-border/60 px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-12 md:pb-5 md:pt-[max(1.25rem,env(safe-area-inset-top))]">
            <Link
              href={Routes.Home}
              onClick={onClose}
              className="flex items-center gap-2 opacity-90 transition-opacity hover:opacity-100"
            >
              <Image
                src="/logo.svg"
                alt="Budget Ndio Story"
                width={132}
                height={26}
                className="h-6 w-auto dark:invert"
              />
            </Link>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="flex size-11 items-center justify-center rounded-full border border-border/80 bg-muted/50 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative z-10 grid min-h-0 flex-1 md:grid-cols-[1fr_minmax(280px,400px)] lg:grid-cols-[1.2fr_minmax(320px,420px)]">
            <nav
              className="min-h-0 overflow-y-auto overscroll-contain px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] md:px-12 md:py-12 lg:px-20"
              aria-label="Primary navigation"
            >
              <div className="mx-auto max-w-xl space-y-10 md:mx-0 md:max-w-none">
                {MAIN_MENU_SECTIONS.map((section, sIdx) => (
                  <div key={section.id}>
                    <p className="g-mono mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-muted-foreground">
                      {section.title}
                    </p>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => (
                        <motion.li
                          key={`${item.href}-${item.label}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: reduceMotion ? 0 : 0.06 + sIdx * 0.05 + i * 0.035,
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="group flex items-center justify-between rounded-xl py-2 text-3xl font-semibold tracking-tight text-foreground transition-colors hover:text-primary md:text-4xl lg:text-[2.75rem] lg:leading-[1.05]"
                          >
                            <span>{item.label}</span>
                            <ArrowRight className="size-5 shrink-0 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 md:size-6" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>

            <aside className="flex min-h-0 flex-col gap-10 overflow-y-auto overscroll-contain border-t border-border/60 bg-muted/25 px-5 py-10 md:border-l md:border-t-0 md:px-10 md:py-12 lg:px-14">
              <div className="space-y-4">
                <p className="g-mono text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                  Support
                </p>
                <h3 className="text-xl font-semibold leading-snug md:text-2xl">
                  Help keep civic fiscal education independent.
                </h3>
                <Button size="lg" className="h-12 rounded-full px-8" asChild>
                  <Link href={Routes.Donate} onClick={onClose}>
                    Donate & partner
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4 border-t border-border/50 pt-8">
                <p className="g-mono text-[10px] font-black uppercase tracking-[0.35em] text-primary">
                  Updates
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Weekly breakdowns and release notes—tell us you want the newsletter when you reach out.
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-full border-border/80 px-8 bg-transparent"
                  asChild
                >
                  <Link href={`${Routes.Contact}#newsletter`} onClick={onClose}>
                    Request the newsletter
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-border/50 pt-8">
                {[
                  { value: 47, label: "Counties", suffix: "" },
                  { value: 20, label: "Reach", suffix: "K+" },
                  { value: 500, label: "Members", suffix: "+" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                      <NumberFlow value={stat.value} />
                      {stat.suffix}
                    </div>
                    <p className="g-mono mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto space-y-6 border-t border-border/50 pt-8 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <a
                  href={mailtoOrg}
                  className="inline-flex items-center gap-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-background">
                    <Mail className="size-4 text-primary" />
                  </span>
                  <span className="break-all font-mono text-[11px] uppercase tracking-widest md:break-normal">
                    {ORG_CONTACT_EMAIL}
                  </span>
                </a>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-background text-foreground/70 transition-colors hover:border-primary hover:text-primary"
                      aria-label={s.label}
                    >
                      <Icon icon={brandIcons[s.icon] ?? s.icon} className="size-4" />
                    </a>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicMenu;
