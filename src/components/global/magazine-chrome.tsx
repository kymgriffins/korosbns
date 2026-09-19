"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/utils";

const dispatchItems = [
  "Independent civic finance coverage",
  "Nairobi edition",
  "Public money, plainly read",
];

const mastheadLinks = [
  { label: "Programmes", href: "/programmes" },
  { label: "About", href: "/about" },
  { label: "Studio", href: "/bns-studio" },
  { label: "Contact", href: "/contact" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MastheadLink({
  href,
  label,
  active,
  onClick,
}: {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "text-[11px] font-semibold uppercase leading-none tracking-[0.22em] text-stone-600 transition-colors hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4",
        active && "text-stone-950",
      )}
    >
      {label}
    </Link>
  );
}

export function MagazineChrome() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-[100] border-b border-stone-950 bg-[#f7f5ef]/96 text-stone-950 backdrop-blur-md"
      data-magazine-chrome
    >
      <div className="border-b border-stone-950">
        <div className="mx-auto flex min-h-8 w-full max-w-[1560px] items-center justify-between gap-4 px-4 py-2 text-[10px] font-semibold uppercase leading-none tracking-[0.18em] text-stone-700 sm:px-6 md:px-10">
          <span>Dispatch</span>
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-3 md:flex">
            {dispatchItems.map((item, index) => (
              <span key={item} className="flex items-center gap-3">
                <span>{item}</span>
                {index < dispatchItems.length - 1 ? (
                  <span aria-hidden="true" className="h-px w-8 bg-stone-400" />
                ) : null}
              </span>
            ))}
          </div>
          <span>{new Date().getFullYear()}</span>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1560px] grid-cols-[1fr_auto_1fr] items-center px-4 py-4 sm:px-6 md:px-10 md:py-5">
        <div className="hidden items-center gap-5 md:flex">
          {mastheadLinks.slice(0, 2).map((link) => (
            <MastheadLink
              key={link.href}
              {...link}
              active={isActivePath(pathname, link.href)}
            />
          ))}
        </div>

        <Link
          href="/"
          className="col-start-1 justify-self-start text-center outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 md:col-start-2 md:justify-self-center"
          aria-label="Budget Ndio Story home"
        >
          <span className="block font-serif text-[clamp(2.15rem,7vw,5.9rem)] font-black uppercase leading-[0.82] tracking-[0.02em]">
            BNS
          </span>
          <span className="mt-1 block text-[10px] font-semibold uppercase leading-none tracking-[0.38em] text-stone-600 sm:text-[11px]">
            Budget Ndio Story
          </span>
        </Link>

        <div className="hidden items-center justify-end gap-5 md:flex">
          {mastheadLinks.slice(2).map((link) => (
            <MastheadLink
              key={link.href}
              {...link}
              active={isActivePath(pathname, link.href)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="col-start-3 inline-flex size-10 items-center justify-center justify-self-end border border-stone-950 text-stone-950 transition-colors hover:bg-stone-950 hover:text-[#f7f5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-4 md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <XIcon className="size-4" /> : <MenuIcon className="size-4" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.nav
            aria-label="Mobile magazine navigation"
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            className="border-t border-stone-950 bg-[#f7f5ef] px-4 py-5 md:hidden"
          >
            <div className="grid gap-4">
              {mastheadLinks.map((link) => (
                <MastheadLink
                  key={link.href}
                  {...link}
                  active={isActivePath(pathname, link.href)}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
