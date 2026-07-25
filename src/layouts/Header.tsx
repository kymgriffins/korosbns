"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Routes } from "@/constants";
import MobileMenu from "@/components/marketing/mobile-menu";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { useAuth } from "@/contexts/auth-context";
import {
  ThemeToggle,
  NAV_CONTROL_BORDER,
  NAV_CONTROL_RADIUS,
  NAV_CONTROL_SIZE,
} from "@/components/marketing/theme-toggle";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { navbarEnter } from "@/motion/variants";
import { landingContent } from "@/content";
import { cn } from "@/utils";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";

const PRIMARY_NAV =
  landingContent.navigation.primary ??
  landingContent.navigation.desktop.filter((item) =>
    ["/programmes", "/learn", "/about"].includes(item.href),
  );

const SECONDARY_NAV =
  landingContent.navigation.secondary ??
  landingContent.navigation.desktop.filter(
    (item) => !["/programmes", "/learn", "/about"].includes(item.href),
  );

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  active,
  reduced,
}: {
  href: string;
  label: string;
  active: boolean;
  reduced: boolean | null;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative isolate rounded-[10px] px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "text-foreground"
          : "border border-transparent text-muted-foreground hover:border-border hover:bg-muted/50 hover:text-foreground",
      )}
    >
      {active ? (
        <motion.span
          layoutId="header-nav-active"
          className="absolute inset-0 -z-10 rounded-[10px] border border-border bg-muted/70"
          transition={
            reduced
              ? { duration: 0 }
              : { type: "spring", stiffness: 420, damping: 34, mass: 0.6 }
          }
        />
      ) : null}
      <span className="relative z-10">{label}</span>
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
    const isMobileDevice = () => window.innerWidth < 1024;

    if (isOpen && isMobileDevice()) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleResize = () => {
      if (!isMobileDevice()) {
        document.body.classList.remove("overflow-hidden");
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
        className="fixed inset-x-0 top-0 z-[100] border-b border-border bg-background"
      >
        <div
          className={cn(
            SECTION_SHELL_INNER,
            "relative flex h-14 items-center justify-between gap-4 md:h-16",
          )}
        >
          <div className="flex min-w-0 items-center gap-6 lg:gap-8">
            <Link
              href={Routes.Home}
              className="group flex shrink-0 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-[10px]"
            >
              <motion.span
                whileHover={reduced ? undefined : { scale: 1.03 }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.25, 0.4, 0, 1] }}
                className="inline-flex"
              >
                <Image
                  src="/logo.svg"
                  alt="Budget Ndio Story"
                  width={140}
                  height={28}
                  className="h-5 w-auto lg:h-6"
                  priority
                />
              </motion.span>
            </Link>

            {/* Primary links — always on desktop (md+) */}
            <nav
              className="hidden items-center gap-0.5 md:flex"
              aria-label="Primary"
            >
              {PRIMARY_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActivePath(pathname, item.href)}
                  reduced={reduced}
                />
              ))}
            </nav>

            {/* Secondary — from lg so desktop always has full set without crowding tablet */}
            <nav
              className="hidden items-center gap-0.5 lg:flex"
              aria-label="More"
            >
              {SECONDARY_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  active={isActivePath(pathname, item.href)}
                  reduced={reduced}
                />
              ))}
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />

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
                    "inline-flex h-9 max-w-[11rem] items-center justify-center gap-2 truncate px-4 text-sm font-semibold",
                    NAV_CONTROL_RADIUS,
                    isLoggedIn
                      ? NAV_CONTROL_BORDER
                      : "border border-primary bg-primary text-primary-foreground transition-[background-color,border-color,transform] duration-200 ease-out hover:border-primary/90 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  {isLoggedIn ? (
                    <>
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">
                        {user?.email?.charAt(0).toUpperCase() ?? "?"}
                      </span>
                      <span className="truncate">{joinLabel}</span>
                    </>
                  ) : (
                    joinLabel
                  )}
                </Link>
              </motion.div>
            ) : (
              <span
                className={cn(
                  "hidden sm:inline-flex",
                  NAV_CONTROL_SIZE,
                  NAV_CONTROL_RADIUS,
                  "border border-border bg-muted/40",
                )}
                aria-hidden
              />
            )}

            <motion.button
              type="button"
              whileTap={reduced ? undefined : { scale: 0.94 }}
              transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                NAV_CONTROL_SIZE,
                NAV_CONTROL_RADIUS,
                NAV_CONTROL_BORDER,
                "relative inline-flex items-center justify-center lg:hidden",
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
