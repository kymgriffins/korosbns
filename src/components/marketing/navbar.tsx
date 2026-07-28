"use client";

import { cn } from "@/utils";
import { MenuIcon, XIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants";
import MobileMenu from "./mobile-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { useAuth } from "@/contexts/auth-context";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { navbarEnter } from "@/motion/variants";
import { toast } from "sonner";

const Navbar = () => {
  const { isLoggedIn, loading: authLoading, user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  async function handleLogout() {
    try {
      await logout();
      toast.success("Logged out");
      router.push(Routes.Home);
    } catch {
      toast.error("Failed to log out");
    }
  }

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
              ? "bg-transparent border-border/60 shadow-lg shadow-black/10"
              : "bg-transparent border-border/30"
          )}
        >
          <div className="flex items-center justify-between w-full px-4 min-h-14 md:min-h-16 shrink-0">
            {/* Logo */}
            <div className="flex items-center flex-1">
              <Link href={Routes.Home} className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
                >
                  <Image
                    src="/logo.svg"
                    alt="Budget Ndio Story"
                    width={180}
                    height={50}
                    className="w-auto h-8 lg:h-10 transition-all group-hover:brightness-110"
                    priority
                  />
                </motion.div>
              </Link>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 md:gap-3">
              <ThemeToggle />
              {!authLoading && (
                isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <Link href={Routes.Learn}>
                      <Button
                        variant="white"
                        size="sm"
                        className="h-9 px-4 rounded-lg font-medium gap-2"
                      >
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary shrink-0">
                          {user?.email?.charAt(0).toUpperCase() ?? "?"}
                        </span>
                        {user?.first_name ?? user?.email ?? "Citizen"}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogout}
                      className="h-9 px-3 rounded-lg text-muted-foreground hover:text-foreground"
                      aria-label="Log out"
                    >
                      <LogOut className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href={Routes.JoinUs}>
                    <Button
                      variant="white"
                      size="sm"
                      className="h-9 px-4 rounded-lg font-medium gap-2"
                    >
                      Join us
                    </Button>
                  </Link>
                )
              )}
              <motion.div
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
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
        </div>
      </motion.header>

      {/* Mobile full-screen overlay menu */}
      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Navbar;
