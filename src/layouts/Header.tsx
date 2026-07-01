"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Routes } from "@/constants";
import MobileMenu from "@/components/marketing/mobile-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { motion, AnimatePresence } from "motion/react";
import { navbarEnter } from "@/motion/variants";
export function Header() {
  const { isLoggedIn, loading: authLoading, user } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useClickOutside(() => setIsOpen(false));

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

  return (
    <div ref={ref} className="relative w-full">
      <motion.header
        variants={navbarEnter}
        initial="hidden"
        animate="visible"
        className="fixed top-0 inset-x-0 z-[100] border-b border-border/50 bg-background/95 backdrop-blur-md"
      >
        <div className="relative mx-auto flex h-12 max-w-[1400px] items-center justify-between gap-4 px-4 md:h-16 md:px-16 lg:px-6">
          <div className="flex min-w-0 shrink-0 items-center">
            <Link href={Routes.Home} className="group flex shrink-0 items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
              >
                <Image
                  src="/logo.svg"
                  alt="Budget Ndio Story"
                  width={140}
                  height={28}
                  className="h-5 w-auto transition-all group-hover:brightness-110 lg:h-6"
                />
              </motion.div>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            <ThemeToggle />
            {!authLoading && (
              <Link href={isLoggedIn ? Routes.Learn : Routes.JoinUs} className="hidden sm:block">
                <Button variant="white" size="sm" className="h-9 px-4 font-medium gap-2">
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
            transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
          >
            <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative h-9 w-9 overflow-hidden"
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
      </motion.header>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
