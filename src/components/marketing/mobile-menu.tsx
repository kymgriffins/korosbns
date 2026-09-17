"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  NAV_LINKS,
  Routes,
} from "@/constants";
import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  FileBarChart,
  FileText,
  Calendar,
  Mail,
  LogIn,
  ArrowUpRight,
  Newspaper,
  FolderKanban,
  Layers,
  Clapperboard,
  Users,
  UserPlus,
  Home,
  CircleDot,
  XIcon,
  Compass,
  MapPin,
} from "lucide-react";
import { ease } from "@/motion/variants";
import { SHOW_MARKETING_SIGN_IN } from "@/lib/marketing-chrome";
import { MEGA_MENU_DATA } from "@/components/marketing/mega-menu";
import { ThemeToggle } from "@/components/marketing/theme-toggle";

const PROGRAMME_MOBILE_ITEMS =
  MEGA_MENU_DATA.find((s) => s.id === "programmes")?.items ?? [
    {
      title: "BNS Connect",
      href: "/programmes/connect",
      description: "National budget tracking and public finance scrutiny.",
      icon: Compass,
    },
    {
      title: "BNS Mashinani",
      href: "/programmes/mashinani",
      description: "County-level budget tracking in focus hubs.",
      icon: MapPin,
    },
    {
      title: "Wanahabari Lab",
      href: "/programmes/wanahabari-lab",
      description: "Newsroom training and fiscal reporting.",
      icon: Newspaper,
    },
  ];

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navConfig?: any;
}

function isActiveNav(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isProgrammesLink(item: { label?: string; href?: string }) {
  const label = (item.label || "").toLowerCase();
  return label === "programmes" || item.href === "/programmes";
}

function ProgrammeLinksBlock({
  onNavigate,
  pathname,
}: {
  onNavigate: () => void;
  pathname: string;
}) {
  return (
    <div className="space-y-1 border-y border-border/40 py-2">
      <Link
        href="/programmes"
        onClick={onNavigate}
        className={cn(
          "group flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold transition-colors",
          isActiveNav(pathname, "/programmes")
            ? "text-primary"
            : "text-foreground hover:text-primary",
        )}
      >
        <span className="flex items-center gap-3">
          <Layers className={ICON_CLS} aria-hidden />
          Programmes
        </span>
        <ArrowUpRight className="size-3.5 opacity-40" />
      </Link>
      <ul className="space-y-0.5 pb-1 pl-2">
        {PROGRAMME_MOBILE_ITEMS.map((prog) => {
          const Icon = prog.icon;
          return (
            <li key={prog.href}>
              <Link
                href={prog.href}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-3 py-2.5 transition-colors",
                  isActiveNav(pathname, prog.href)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-foreground/[0.04]",
                )}
              >
                <span className="flex items-start gap-2.5">
                  <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-foreground">
                      {prog.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                      {prog.description}
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const ICON_CLS =
  "size-5 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-primary group-[.nav-active]:text-primary";

function NavItemIcon({ label }: { label: string }) {
  const key = label.toLowerCase();
  switch (key) {
    case "home":
      return <Home className={ICON_CLS} aria-hidden />;
    case "programmes":
    case "partners":
      return <Layers className={ICON_CLS} aria-hidden />;
    case "learn":
    case "stories":
    case "budget guides":
      return <BookOpen className={ICON_CLS} aria-hidden />;
    case "about":
    case "about bns":
    case "team":
      return <Users className={ICON_CLS} aria-hidden />;
    case "studios":
    case "bns studios":
    case "media":
      return <Clapperboard className={ICON_CLS} aria-hidden />;
    case "projects":
      return <FolderKanban className={ICON_CLS} aria-hidden />;
    case "budget hub":
    case "budget news":
      return <Newspaper className={ICON_CLS} aria-hidden />;
    case "surveys":
    case "events":
    case "surveys & events":
    case "events & surveys":
      return <Calendar className={ICON_CLS} aria-hidden />;
    case "reports":
      return <FileBarChart className={ICON_CLS} aria-hidden />;
    case "trivia":
    case "faq":
      return <HelpCircle className={ICON_CLS} aria-hidden />;
    case "articles":
    case "documents":
      return <FileText className={ICON_CLS} aria-hidden />;
    case "contact":
      return <Mail className={ICON_CLS} aria-hidden />;
    case "join us":
    case "careers":
      return <UserPlus className={ICON_CLS} aria-hidden />;
    case "sign in":
    case "login":
      return <LogIn className={ICON_CLS} aria-hidden />;
    default:
      return <CircleDot className={ICON_CLS} aria-hidden />;
  }
}

function MenuPanel({ isOpen, setIsOpen, navConfig }: Props) {
  const pathname = usePathname();
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const links = (navConfig?.navLinks as any[]) || NAV_LINKS;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - same for all screen sizes */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[98] bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Desktop: right-side nav panel */}
          <motion.div
            key="desktop-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: ease.expo }}
            className="fixed top-0 right-0 bottom-0 z-[99] hidden lg:flex w-full min-w-[320px] max-w-md flex-col bg-background border-l border-border/60 shadow-2xl shadow-black/20"
          >
            <div className="flex items-center justify-between px-6 h-16 shrink-0 border-b border-border/40">
              <span className="text-sm font-semibold text-muted-foreground">Navigation</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="flex flex-col space-y-1">
                {links.map((item: any, index: number) =>
                  isProgrammesLink(item) ? (
                    <motion.li
                      key={`programmes-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.05 + index * 0.06,
                        duration: 0.35,
                        ease: ease.expo,
                      }}
                      className="w-full"
                    >
                      <ProgrammeLinksBlock
                        pathname={pathname}
                        onNavigate={() => setIsOpen(false)}
                      />
                    </motion.li>
                  ) : (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 + index * 0.06,
                      duration: 0.35,
                      ease: ease.expo,
                    }}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      {...("newTab" in item && item.newTab
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={cn(
                        "group flex w-full items-center justify-between px-4 py-3.5 text-base font-medium transition-all duration-200 active:scale-[0.98]",
                        isActiveNav(pathname, item.href)
                          ? "nav-active bg-primary/10 text-primary"
                          : "text-foreground hover:bg-foreground/[0.04] hover:text-primary",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <NavItemIcon label={item.label} />
                        {item.label}
                      </span>
                      <ArrowUpRight className="size-4 opacity-30 transition-opacity duration-200 group-hover:opacity-80" />
                    </Link>
                  </motion.li>
                  ),
                )}
              </ul>
              {(SHOW_MARKETING_SIGN_IN || isLoggedIn) ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 + (NAV_LINKS.length + 1) * 0.06,
                    duration: 0.35,
                    ease: ease.expo,
                  }}
                  className="pt-4 border-t border-border/40 mt-4"
                >
                  <Link href={isLoggedIn ? Routes.Home : Routes.Login} onClick={() => setIsOpen(false)}>
                    <Button
                      size="default"
                      variant="white"
                      className="w-full h-12 rounded-full font-semibold text-base shadow-md gap-2"
                    >
                      {isLoggedIn ? (
                        <>
                          <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary shrink-0">
                            {user?.email?.charAt(0).toUpperCase() ?? "?"}
                          </span>
                          Welcome back, {user?.first_name ?? user?.email ?? "Citizen"}
                        </>
                      ) : (
                        <>
                          <LogIn className="size-5 shrink-0" aria-hidden />
                          Sign in
                        </>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              ) : null}
            </div>
          </motion.div>

          {/* Mobile: bottom sheet */}
          <motion.div
            key="mobile-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: ease.expo }}
            className="fixed bottom-0 inset-x-0 z-[99] lg:hidden bg-background border-t border-border/60 shadow-2xl shadow-black/30 flex flex-col max-h-[85dvh] overflow-hidden"
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-foreground/20" />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
              <ul className="flex flex-col space-y-1">
                {links.map((item: any, index: number) =>
                  isProgrammesLink(item) ? (
                    <motion.li
                      key={`programmes-m-${index}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.06 + index * 0.05,
                        duration: 0.3,
                        ease: ease.expo,
                      }}
                      className="w-full"
                    >
                      <ProgrammeLinksBlock
                        pathname={pathname}
                        onNavigate={() => setIsOpen(false)}
                      />
                    </motion.li>
                  ) : (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 + index * 0.05,
                      duration: 0.3,
                      ease: ease.expo,
                    }}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      {...("newTab" in item && item.newTab
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={cn(
                        "group flex w-full items-center justify-between px-4 py-3.5 text-base font-medium transition-all duration-200 active:scale-[0.98]",
                        isActiveNav(pathname, item.href)
                          ? "nav-active bg-primary/10 text-primary"
                          : "text-foreground hover:bg-foreground/[0.04] hover:text-primary",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <NavItemIcon label={item.label} />
                        {item.label}
                      </span>
                      <ArrowUpRight className="size-4 opacity-30 transition-opacity duration-200 group-hover:opacity-80" />
                    </Link>
                  </motion.li>
                  ),
                )}
              </ul>
              <div className="flex items-center justify-between py-3 px-3 mt-3 rounded-lg bg-muted/30 border border-border/40">
                <span className="text-sm font-medium text-muted-foreground">Appearance</span>
                <ThemeToggle />
              </div>
              {(SHOW_MARKETING_SIGN_IN || isLoggedIn) ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.06 + (NAV_LINKS.length + 1) * 0.05,
                    duration: 0.3,
                    ease: ease.expo,
                  }}
                  className="pt-4 border-t border-border/40 mt-4"
                >
                  <Link href={isLoggedIn ? Routes.Home : Routes.Login} onClick={() => setIsOpen(false)}>
                    <Button
                      size="default"
                      variant="white"
                      className="w-full h-12 rounded-full font-semibold text-base shadow-md gap-2"
                    >
                      {isLoggedIn ? (
                        <>
                          <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary shrink-0">
                            {user?.email?.charAt(0).toUpperCase() ?? "?"}
                          </span>
                          Welcome back, {user?.first_name ?? user?.email ?? "Citizen"}
                        </>
                      ) : (
                        <>
                          <LogIn className="size-5 shrink-0" aria-hidden />
                          Sign in
                        </>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MenuPanel;
