"use client";

import { cn } from "@/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import React from "react";
import { NAV_LINKS, Routes } from "@/constants";
import { Button } from "@/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  BookOpen,
  ClipboardList,
  HelpCircle,
  FileText,
  Calendar,
  Mail,
  User,
  LogIn,
  ArrowUpRight,
} from "lucide-react";
import { ease } from "@/motion/variants";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const getIcon = (label: string) => {
  const cls = "size-5 text-muted-foreground group-hover:text-primary transition-colors duration-200";
  switch (label.toLowerCase()) {
    case "learn":      return <BookOpen className={cls} />;
    case "surveys":    return <ClipboardList className={cls} />;
    case "trivia":     return <HelpCircle className={cls} />;
    case "articles":   return <FileText className={cls} />;
    case "events":     return <Calendar className={cls} />;
    case "faq":        return <HelpCircle className={cls} />;
    case "contact":    return <Mail className={cls} />;
    default:           return null;
  }
};

// ─── Desktop dropdown ─────────────────────────────────────────────────────────
function DesktopDropdown({
  isOpen,
  setIsOpen,
}: Props) {
  const { isLoggedIn, loading: authLoading } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.18, ease: ease.out }}
          className="hidden lg:flex flex-col absolute top-[calc(100%+12px)] right-0 w-64 bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20 p-2 z-[100]"
        >
          <ul className="flex flex-col w-full space-y-0.5">
            {NAV_LINKS.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.2, ease: ease.out }}
                className="w-full"
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="group flex items-center justify-between w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium rounded-xl hover:bg-foreground/[0.04] transition-all duration-200"
                >
                  <span className="flex items-center gap-3">
                    {getIcon(item.label)}
                    {item.label}
                  </span>
                  <ArrowUpRight className="size-3.5 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </motion.li>
            ))}
            {!authLoading && (
              <>
                <li className="h-px bg-border/40 my-1.5" />
                <motion.li
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: NAV_LINKS.length * 0.04,
                    duration: 0.2,
                    ease: ease.out,
                  }}
                  className="w-full"
                >
                  <Link
                    href={isLoggedIn ? Routes.Learn : Routes.Login}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between w-full px-3 py-2.5 text-sm text-primary hover:text-primary/80 font-semibold rounded-xl hover:bg-primary/[0.06] transition-all duration-200"
                  >
                    <span className="flex items-center gap-3">
                      {isLoggedIn ? (
                        <BookOpen className="size-5 text-primary/80 group-hover:text-primary transition-colors" />
                      ) : (
                        <LogIn className="size-5 text-primary/80 group-hover:text-primary transition-colors" />
                      )}
                      {isLoggedIn ? "Go to Learn Hub" : "Sign in to account"}
                    </span>
                    <ArrowUpRight className="size-3.5 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </Link>
                </motion.li>
              </>
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Mobile full-screen overlay ───────────────────────────────────────────────
function MobileOverlay({ isOpen, setIsOpen }: Props) {
  const { isLoggedIn, loading: authLoading, user } = useAuth();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden fixed inset-0 z-[98] bg-background/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Slide-up sheet */}
          <motion.div
            key="sheet"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.38, ease: ease.expo }}
            className="lg:hidden fixed bottom-0 inset-x-0 z-[99] bg-background border-t border-border/60 rounded-t-3xl shadow-2xl shadow-black/30 flex flex-col max-h-[85dvh] overflow-hidden"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-foreground/20" />
            </div>

            {/* Nav items */}
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
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between w-full px-4 py-3.5 text-base font-medium rounded-2xl text-foreground hover:text-primary hover:bg-foreground/[0.04] active:scale-[0.98] transition-all duration-200"
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
                    onClick={() => setIsOpen(false)}
                    className="w-full border-t border-border/40 pt-2 mt-2"
                  >
                    <Link
                    href={isLoggedIn ? Routes.Learn : Routes.Login}
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

              {/* CTA */}
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

// ─── Combined export ──────────────────────────────────────────────────────────
const MobileMenu = ({ isOpen, setIsOpen }: Props) => {
  return (
    <>
      <DesktopDropdown isOpen={isOpen} setIsOpen={setIsOpen} />
      <MobileOverlay isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default MobileMenu;
