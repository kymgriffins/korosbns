"use client";

import { cn } from "@/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Routes } from "@/constants";
import MobileMenu from "./mobile-menu";
import { Button } from "@/ui/button";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { navbarEnter } from "@/motion/variants";

const Navbar = () => {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);
  });

  useEffect(() => {
    const isMobileDevice = () => window.innerWidth < 1024;

    if (isOpen && isMobileDevice()) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleResize = () => {
      if (!isMobileDevice()) {
        document.body.style.overflow = "";
      } else if (isOpen) {
        document.body.style.overflow = "hidden";
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  return (
    <div className="relative w-full h-full">
      {/* Gradient fade behind navbar */}
      <div className="z-[99] hidden lg:block fixed pointer-events-none inset-x-0 h-[88px] bg-background/80 backdrop-blur-sm [mask:linear-gradient(to_bottom,#000_20%,transparent_calc(100%-20%))]" />

      {/* Navbar bar */}
      <motion.header
        variants={navbarEnter}
        initial="hidden"
        animate="visible"
        className={cn(
          "fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-[100]",
          "transition-[height] duration-300 ease-in-out",
          isOpen ? "h-14 md:h-16" : "h-14 md:h-16"
        )}
      >
        <div
          ref={ref}
          className={cn(
            // No pill — straight rounded-xl on all breakpoints
            "rounded-xl border h-full flex flex-col relative transition-all duration-300",
            scrolled
              ? "bg-background/80 backdrop-blur-xl border-border/60 shadow-lg shadow-black/10"
              : "bg-background/40 backdrop-blur-md border-border/30"
          )}
        >
          <div className="flex items-center justify-between w-full px-4 min-h-14 md:min-h-16 shrink-0">
            {/* Logo */}
            <div className="flex items-center flex-1">
              <Link href={Routes.Home} className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Image
                    src="/logo.svg"
                    alt="Budget Ndio Story"
                    width={140}
                    height={28}
                    className="w-auto h-5 lg:h-6 transition-all group-hover:brightness-110"
                  />
                </motion.div>
              </Link>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              {!authLoading && (
                <Link href={isLoggedIn ? Routes.Learn : Routes.JoinUs}>
                  <Button
                    variant="white"
                    size="sm"
                    className="h-9 px-4 rounded-lg font-medium gap-2"
                  >
                    {isLoggedIn ? (
                      <>
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary shrink-0">
                          {user?.email?.charAt(0).toUpperCase() ?? "?"}
                        </span>
                        Welcome back, {user?.first_name ?? user?.email ?? "Citizen"}
                      </>
                    ) : (
                      "Join us"
                    )}
                  </Button>
                </Link>
              )}
              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setIsOpen((prev) => !prev)}
                  className="h-9 w-9 rounded-lg relative overflow-hidden"
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {isOpen ? (
                      <motion.span
                        key="close"
                        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <XIcon className="size-5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="open"
                        initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <MenuIcon className="size-5" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
          <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </motion.header>
    </div>
  );
};

export default Navbar;
