"use client";

import { ArrowUpRight, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Routes } from "@/constants";
import { socialLinks } from "@/constants/links";
import MobileMenu from "@/components/marketing/mobile-menu";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { useAuth } from "@/contexts/auth-context";
import {
  ThemeToggle,
  NAV_CONTROL_BORDER,
  NAV_CONTROL_SIZE,
} from "@/components/marketing/theme-toggle";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { navbarEnter } from "@/motion/variants";
import { landingContent } from "@/content";
import { cn } from "@/utils";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { socialIconComponents } from "@/components/ui/social-icons";

const DESKTOP_NAV =
  landingContent.navigation.desktop ??
  [
    ...(landingContent.navigation.primary ?? []),
    ...(landingContent.navigation.secondary ?? []),
  ];

/** Compact social set for dark SaaS chrome — real URLs only */
const HEADER_SOCIAL = socialLinks.filter((s) =>
  ["x", "linkedin", "youtube"].includes(s.icon),
);

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-sm font-medium outline-none transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
        active
          ? "text-white"
          : "text-white/55 hover:text-white",
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const ref = useClickOutside(() => setIsOpen(false));
  const reduced = useReducedMotion();

  useEffect(() => {
    const isMobileDevice = () => window.innerWidth < 768;

    if (isOpen && isMobileDevice()) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleResize = () => {
      if (!isMobileDevice()) {
        document.body.classList.remove("overflow-hidden");
        setIsOpen(false);
      } else if (isOpen) {
        document.body.classList.add("overflow-hidden");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const joinHref = isLoggedIn ? Routes.Learn : Routes.JoinUs;
  const joinLabel = isLoggedIn
    ? user?.first_name
      ? `Hi, ${user.first_name}`
      : "Account"
    : "Join us";

  return (
    <div ref={ref} className="relative w-full">
      <motion.header
        variants={navbarEnter}
        initial={reduced ? false : "hidden"}
        animate="visible"
        className="fixed inset-x-0 top-0 z-[100] border-b border-white/10 bg-neutral-950"
      >
        <div
          className={cn(
            SECTION_SHELL_INNER,
            "flex h-14 items-center justify-between gap-4 md:h-16",
          )}
        >
          {/* Left — mark + wordmark + flat links */}
          <div className="flex min-w-0 items-center gap-6 lg:gap-8">
            <Link
              href={Routes.Home}
              className="group inline-flex shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
            >
              <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                <Image
                  src="/icons/icon.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="size-7"
                  priority
                />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight text-white sm:inline">
                Budget Ndio Story
              </span>
              <span className="sr-only">Budget Ndio Story home</span>
            </Link>

            <nav
              className="hidden items-center gap-0.5 md:flex"
              aria-label="Primary"
            >
              {DESKTOP_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActivePath(pathname, item.href)}
                />
              ))}
            </nav>
          </div>

          {/* Right — socials, Contact, Join CTA, theme, mobile menu */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-0.5 lg:flex">
              {HEADER_SOCIAL.map((social) => {
                const Icon = socialIconComponents[social.icon];
                if (!Icon) return null;
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-8 items-center justify-center rounded-md text-white/50 outline-none transition-colors hover:bg-white/5 hover:text-white focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Icon className="size-3.5" />
                  </Link>
                );
              })}
            </div>

            <Link
              href={Routes.Contact}
              className="hidden rounded-md px-2.5 py-1.5 text-sm font-medium text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/40 sm:inline"
            >
              Contact
            </Link>

            {!authLoading ? (
              <motion.div
                whileHover={reduced ? undefined : { scale: 1.02 }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
                className="hidden sm:block"
              >
                <Link
                  href={joinHref}
                  className={cn(
                    "inline-flex h-9 max-w-[12rem] items-center justify-center gap-1.5 truncate rounded-full border border-white/80 bg-transparent px-4 text-sm font-medium text-white outline-none transition-colors duration-200",
                    "hover:bg-white hover:text-neutral-950",
                    "focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                    isLoggedIn && "border-white/40",
                  )}
                >
                  {isLoggedIn ? (
                    <>
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold text-white">
                        {user?.email?.charAt(0).toUpperCase() ?? "?"}
                      </span>
                      <span className="truncate">{joinLabel}</span>
                    </>
                  ) : (
                    <>
                      {joinLabel}
                      <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                    </>
                  )}
                </Link>
              </motion.div>
            ) : (
              <span
                className={cn(
                  "hidden sm:inline-flex",
                  NAV_CONTROL_SIZE,
                  "rounded-full border border-white/20 bg-white/5",
                )}
                aria-hidden
              />
            )}

            <ThemeToggle
              className="border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/10"
            />

            <motion.button
              type="button"
              whileTap={reduced ? undefined : { scale: 0.94 }}
              transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                NAV_CONTROL_SIZE,
                NAV_CONTROL_BORDER,
                "relative inline-flex items-center justify-center rounded-full border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/10 md:hidden",
              )}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="close"
                    initial={reduced ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, rotate: 90, scale: 0.6 }}
                    transition={{ duration: reduced ? 0 : 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <XIcon className="size-5" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={reduced ? false : { opacity: 0, rotate: 90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, rotate: -90, scale: 0.6 }}
                    transition={{ duration: reduced ? 0 : 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <MenuIcon className="size-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
