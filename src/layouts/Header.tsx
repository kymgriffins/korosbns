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
  NAV_CONTROL_BORDER,
  NAV_CONTROL_SIZE,
} from "@/components/marketing/theme-toggle";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { navbarEnter } from "@/motion/variants";
import { landingContent } from "@/content";
import { cn } from "@/utils";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { socialIconComponents } from "@/components/ui/social-icons";
import { MegaMenu } from "@/components/marketing/mega-menu";
import { ScrollMotionProgress } from "@/motion/scroll-motion-progress";
import { SHOW_MARKETING_SIGN_IN } from "@/lib/marketing-chrome";
import { Button } from "@/components/ui/button";
import defaultNavigation from "@/content/navigation.json";

const DESKTOP_NAV =
  landingContent.navigation.desktop ??
  [
    ...(landingContent.navigation.primary ?? []),
    ...(landingContent.navigation.secondary ?? []),
  ];

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
  newTab = false,
}: {
  href: string;
  label: string;
  active: boolean;
  newTab?: boolean;
}) {
  const linkProps = newTab
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <Link
      href={href}
      {...linkProps}
      className={cn(
        "px-3 py-1.5 text-sm font-medium outline-none transition-colors duration-200",
        "drop-shadow-[0_1px_8px_hsl(0_0%_0%/0.28)]",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        active
          ? "text-foreground"
          : "text-foreground/80 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navConfig, setNavConfig] = useState(defaultNavigation);
  const pathname = usePathname();
  const ref = useClickOutside(() => setIsOpen(false));
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();

  useEffect(() => {
    fetch("/api/cms/navigation")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) {
          setNavConfig(json.data);
        }
      })
      .catch(() => {});
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

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

  const joinHref = isLoggedIn ? Routes.Home : Routes.Login;
  const joinLabel = isLoggedIn
    ? user?.first_name
      ? `Hi, ${user.first_name}`
      : "Account"
    : "Sign in";

  return (
    <div ref={ref}>
      {/* Fixed at top - light scrim so full-bleed heroes show through */}
      <motion.header
        variants={navbarEnter}
        initial={reduced ? false : "hidden"}
        animate="visible"
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border/40 shadow-xs"
            : "bg-background/80 backdrop-blur-md border-b border-border/20 shadow-2xs",
        )}
          data-marketing-nav
      >
        <div
          className={cn(
            SECTION_SHELL_INNER,
            "flex h-14 items-center justify-between gap-4 md:h-16",
          )}
        >
          <div className="flex min-w-0 items-center gap-6 lg:gap-10">
            <Link
              href={Routes.Home}
              className="group inline-flex shrink-0 items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden drop-shadow-[0_1px_10px_hsl(0_0%_0%/0.35)]">
                <Image
                  src={navConfig.logo?.src || "/logo.svg"}
                  alt={navConfig.logo?.alt || "Budget Ndio Story"}
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                  priority
                />
              </span>
              <span className="hidden text-sm font-semibold tracking-tight text-foreground drop-shadow-[0_1px_8px_hsl(0_0%_0%/0.28)] sm:inline">
                Budget Ndio Story
              </span>
              <span className="sr-only">Budget Ndio Story home</span>
            </Link>

            <p className="hidden text-xs text-foreground/70 drop-shadow-[0_1px_8px_hsl(0_0%_0%/0.25)] xl:block">
              Based in: Kenya
            </p>

            <div className="hidden items-center md:flex">
              <MegaMenu />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 drop-shadow-[0_1px_8px_hsl(0_0%_0%/0.28)]">
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
                    className="inline-flex size-8 items-center justify-center text-foreground/80 outline-none transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Icon className="size-3.5" />
                  </Link>
                );
              })}
            </div>

            {(() => {
              const contactItem = (navConfig.navLinks || []).find((l: any) =>
                (l.id || "").toLowerCase().includes("contact") ||
                (l.href || "").toLowerCase().includes("contact")
              );
              const label = contactItem?.label || "Contact";
              const href = contactItem?.href || Routes.Contact;
              return (
                <Link
                  href={href}
                  className="hidden px-3 py-1.5 text-sm font-medium text-foreground/80 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring sm:inline"
                >
                  {label}
                </Link>
              );
            })()}

            {navConfig.actions?.cta?.show !== false && !isLoggedIn && (
              <Link
                href={navConfig.actions?.cta?.href || "/contact?intent=partner"}
                className="hidden sm:inline-flex"
              >
                <Button
                  variant={navConfig.actions?.cta?.variant === "primary" ? "default" : "white"}
                  size="sm"
                  className="h-9 px-4 rounded-full font-medium"
                >
                  {navConfig.actions?.cta?.label || "Discuss Partnership"}
                </Button>
              </Link>
            )}

            {isLoggedIn ? (
              <motion.div
                whileHover={reduced ? undefined : { scale: 1.02 }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
                className="hidden sm:block"
              >
                <Link
                  href={joinHref}
                  className={cn(
                    "inline-flex h-9 max-w-[12rem] items-center justify-center gap-1.5 truncate rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground outline-none transition-colors duration-200",
                    "hover:bg-primary/90",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  )}
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px] font-bold text-primary-foreground">
                    {user?.email?.charAt(0).toUpperCase() ?? "?"}
                  </span>
                  <span className="truncate">{joinLabel}</span>
                </Link>
              </motion.div>
            ) : navConfig.actions?.showSignIn ? (
              <motion.div
                whileHover={reduced ? undefined : { scale: 1.02 }}
                whileTap={reduced ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
                className="hidden sm:block"
              >
                <Link
                  href={navConfig.actions?.signInHref || Routes.Login}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-border/60 bg-card px-4 text-sm font-medium text-foreground outline-none transition-colors duration-200",
                    "hover:bg-muted/60",
                    "focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  {navConfig.actions?.signInLabel || "Sign in"}
                  <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                </Link>
              </motion.div>
            ) : null}

            <motion.button
              type="button"
              whileTap={reduced ? undefined : { scale: 0.94 }}
              transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                NAV_CONTROL_SIZE,
                NAV_CONTROL_BORDER,
                "relative inline-flex items-center justify-center border-transparent bg-transparent text-foreground hover:bg-muted md:hidden",
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
        <ScrollMotionProgress />
      </motion.header>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} navConfig={navConfig} />
    </div>
  );
}
