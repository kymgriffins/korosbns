"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Routes } from "@/constants";
import MobileMenu from "@/components/marketing/mobile-menu";
import { Button } from "@/ui/button";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { motion, AnimatePresence } from "motion/react";
import { navbarEnter } from "@/motion/variants";

export function Header() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useClickOutside(() => setIsOpen(false));

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
    <div className="relative w-full">
      <motion.header
        variants={navbarEnter}
        initial="hidden"
        animate="visible"
        className="fixed top-0 inset-x-0 z-[100] border-b border-border/50 bg-background/95 backdrop-blur-md"
      >
        <div
          ref={ref}
          className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-6 md:h-16 md:px-16"
        >
          <div className="flex items-center flex-1 min-w-0">
            <Link href={Routes.Home} className="flex items-center gap-2 group shrink-0">
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

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <ThemeToggle />
            <Link href={Routes.JoinUs}>
              <Button variant="white" size="sm" className="h-9 px-4 font-medium">
                Join us
              </Button>
            </Link>
            <motion.div
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsOpen((prev) => !prev)}
                className="h-9 w-9 relative overflow-hidden"
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
