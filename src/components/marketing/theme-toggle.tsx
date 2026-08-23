"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/utils";

/** Shared chrome size with Join us — keep header actions optically synced */
export const NAV_CONTROL_SIZE = "h-9 w-9";
export const NAV_CONTROL_RADIUS = "rounded-[10px]";
export const NAV_CONTROL_BORDER =
  "border border-border bg-background text-foreground transition-[border-color,background-color,color,transform] duration-200 ease-out hover:border-foreground/25 hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const iconTransition = reduced
    ? { duration: 0 }
    : { duration: 0.22, ease: [0.25, 0.4, 0, 1] as const };

  if (!mounted) {
    return (
      <span
        className={cn(
          NAV_CONTROL_SIZE,
          NAV_CONTROL_RADIUS,
          NAV_CONTROL_BORDER,
          "inline-flex items-center justify-center",
          className,
        )}
        aria-hidden
      >
        <Sun className="size-4 text-amber-500/70" />
      </span>
    );
  }

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={{ duration: 0.18, ease: [0.25, 0.4, 0, 1] }}
      className={cn(
        NAV_CONTROL_SIZE,
        NAV_CONTROL_RADIUS,
        NAV_CONTROL_BORDER,
        "relative inline-flex shrink-0 items-center justify-center",
        className,
      )}
      aria-label={`Theme: ${theme ?? "system"}. Click to change.`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.span
            key="light"
            initial={reduced ? false : { opacity: 0, rotate: -80, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, rotate: 80, scale: 0.6 }}
            transition={iconTransition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="size-4 text-amber-500 dark:text-amber-400" />
          </motion.span>
        ) : null}
        {theme === "dark" ? (
          <motion.span
            key="dark"
            initial={reduced ? false : { opacity: 0, rotate: -80, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, rotate: 80, scale: 0.6 }}
            transition={iconTransition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="size-4 text-sky-400 dark:text-sky-300" />
          </motion.span>
        ) : null}
        {theme === "system" || !theme ? (
          <motion.span
            key="system"
            initial={reduced ? false : { opacity: 0, rotate: -80, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, rotate: 80, scale: 0.6 }}
            transition={iconTransition}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Monitor className="size-4 text-primary" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}
