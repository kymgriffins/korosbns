"use client";

import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { NAV_LINKS, Routes } from "@/constants";
import { cn } from "@/utils";
import { Button } from "@/ui/button";
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
  XIcon,
} from "lucide-react";
import { ease } from "@/motion/variants";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function isActiveNav(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const getIcon = (label: string) => {
  const cls = "size-5 text-muted-foreground group-hover:text-primary transition-colors duration-200";
  switch (label.toLowerCase()) {
    case "learn":        return <BookOpen className={cls} />;
    case "budget hub":   return <Newspaper className={cls} />;
    case "budget news":  return <Newspaper className={cls} />;
    case "surveys":      return <ClipboardList className={cls} />;
    case "reports":      return <FileBarChart className={cls} />;
    case "trivia":       return <HelpCircle className={cls} />;
    case "articles":     return <FileText className={cls} />;
    case "events":       return <Calendar className={cls} />;
    case "faq":          return <HelpCircle className={cls} />;
    case "contact":      return <Mail className={cls} />;
    default:             return null;
  }
};

function MenuPanel({ isOpen, setIsOpen }: Props) {
  const pathname = usePathname();
  const { isLoggedIn, loading: authLoading, user } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — same for all screen sizes */}
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
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-lg"
              >
                <XIcon className="size-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="flex flex-col space-y-1">
                {NAV_LINKS.map((item, index) => (
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
                      className={cn(
                        "group flex items-center justify-between w-full px-4 py-3.5 text-base font-medium rounded-2xl active:scale-[0.98] transition-all duration-200",
                        isActiveNav(pathname, item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary hover:bg-foreground/[0.04]"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {getIcon(item.label)}
                        {item.label}
                      </span>
                      <ArrowUpRight className="size-4 opacity-30 group-hover:opacity-80 transition-opacity duration-200" />
                    </Link>
                  </motion.li>
                ))}
                {!authLoading && (
                  <motion.li
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.05 + NAV_LINKS.length * 0.06,
                      duration: 0.35,
                      ease: ease.expo,
                    }}
                    className="w-full border-t border-border/40 pt-2 mt-2"
                  >
                    <Link
                      href={isLoggedIn ? Routes.Learn : Routes.Login}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between w-full px-4 py-3.5 text-base font-semibold rounded-2xl text-primary hover:bg-primary/[0.06] active:scale-[0.98] transition-all duration-200"
                    >
                      <span className="flex items-center gap-3">
                        {isLoggedIn ? (
                          <BookOpen className="size-5 text-primary" />
                        ) : (
                          <LogIn className="size-5 text-primary" />
                        )}
                        {isLoggedIn ? "Go to Learn Hub" : "Sign in to your account"}
                      </span>
                      <ArrowUpRight className="size-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </motion.li>
                )}
              </ul>
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
                <Link href={isLoggedIn ? Routes.Learn : Routes.JoinUs} onClick={() => setIsOpen(false)}>
                  <Button
                    size="default"
                    variant="white"
                    className="w-full h-12 rounded-2xl font-semibold text-base shadow-md gap-2"
                  >
                    {isLoggedIn ? (
                      <>
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary shrink-0">
                          {user?.email?.charAt(0).toUpperCase() ?? "?"}
                        </span>
                        Welcome back, {user?.first_name ?? user?.email ?? "Citizen"}
                      </>
                    ) : (
                      "Join us"
                    )}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Mobile: bottom sheet */}
          <motion.div
            key="mobile-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: ease.expo }}
            className="fixed bottom-0 inset-x-0 z-[99] lg:hidden bg-background border-t border-border/60 rounded-t-3xl shadow-2xl shadow-black/30 flex flex-col max-h-[85dvh] overflow-hidden"
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-foreground/20" />
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
              <ul className="flex flex-col space-y-1">
                {NAV_LINKS.map((item, index) => (
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
                      className={cn(
                        "group flex items-center justify-between w-full px-4 py-3.5 text-base font-medium rounded-2xl active:scale-[0.98] transition-all duration-200",
                        isActiveNav(pathname, item.href)
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:text-primary hover:bg-foreground/[0.04]"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {getIcon(item.label)}
                        {item.label}
                      </span>
                      <ArrowUpRight className="size-4 opacity-30 group-hover:opacity-80 transition-opacity duration-200" />
                    </Link>
                  </motion.li>
                ))}
                {!authLoading && (
                  <motion.li
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06 + NAV_LINKS.length * 0.05,
                      duration: 0.3,
                      ease: ease.expo,
                    }}
                    className="w-full border-t border-border/40 pt-2 mt-2"
                  >
                    <Link
                      href={isLoggedIn ? Routes.Learn : Routes.Login}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between w-full px-4 py-3.5 text-base font-semibold rounded-2xl text-primary hover:bg-primary/[0.06] active:scale-[0.98] transition-all duration-200"
                    >
                      <span className="flex items-center gap-3">
                        {isLoggedIn ? (
                          <BookOpen className="size-5 text-primary" />
                        ) : (
                          <LogIn className="size-5 text-primary" />
                        )}
                        {isLoggedIn ? "Go to Learn Hub" : "Sign in to your account"}
                      </span>
                      <ArrowUpRight className="size-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity duration-200" />
                    </Link>
                  </motion.li>
                )}
              </ul>
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
                <Link href={isLoggedIn ? Routes.Learn : Routes.JoinUs} onClick={() => setIsOpen(false)}>
                  <Button
                    size="default"
                    variant="white"
                    className="w-full h-12 rounded-2xl font-semibold text-base shadow-md gap-2"
                  >
                    {isLoggedIn ? (
                      <>
                        <span className="flex size-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary shrink-0">
                          {user?.email?.charAt(0).toUpperCase() ?? "?"}
                        </span>
                        Welcome back, {user?.first_name ?? user?.email ?? "Citizen"}
                      </>
                    ) : (
                      "Join us"
                    )}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MenuPanel;
