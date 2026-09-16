"use client";

import { cn } from "@/utils";
import { MenuIcon, XIcon, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants";
import MobileMenu from "./mobile-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { useAuth } from "@/contexts/auth-context";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { navbarEnter } from "@/motion/variants";
import { toast } from "sonner";
import { SHOW_MARKETING_SIGN_IN } from "@/lib/marketing-chrome";
import defaultNavigation from "@/content/navigation.json";

const Navbar = () => {
  const { isLoggedIn, loading: authLoading, user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState(false);
  const [navConfig, setNavConfig] = useState(defaultNavigation);
  const ref = useClickOutside(() => setIsOpen(false));

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
      {/* Single-line desktop bar, max 80px tall */}
      <motion.header
        variants={navbarEnter}
        initial="hidden"
        animate="visible"
        className={cn(
          "fixed top-0 inset-x-0 z-[100] h-14 max-h-20 md:h-16",
          "border-b border-border/30 backdrop-blur-md transition-colors duration-300",
          scrolled ? "bg-background/95 shadow-xs" : "bg-background/85",
        )}
      >
        <div
          ref={ref}
          className="mx-auto flex h-full max-w-6xl flex-row flex-nowrap items-center justify-between gap-3 px-4 md:px-8"
        >
          <div className="flex min-w-0 shrink-0 items-center">
            <Link href={navConfig.logo?.href || Routes.Home} className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
              >
                <Image
                  src={navConfig.logo?.src || "/logo.svg"}
                  alt={navConfig.logo?.alt || "Budget Ndio Story"}
                  width={180}
                  height={40}
                  className="h-8 w-auto lg:h-9 transition-all group-hover:brightness-110"
                  priority
                />
              </motion.div>
            </Link>
          </div>

          <nav
            className="hidden min-w-0 flex-1 lg:flex items-center justify-center gap-0.5 xl:gap-1 whitespace-nowrap overflow-x-auto"
            aria-label="Desktop primary navigation"
          >
            {(navConfig.navLinks || []).map(
              (link: { id?: string; href: string; label: string }) => (
                <Link
                  key={link.id || link.href}
                  href={link.href}
                  className="px-2.5 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors inline-flex items-center rounded-md"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
            {navConfig.actions?.cta?.show !== false && (
              <Link
                href={navConfig.actions?.cta?.href || "/contact?intent=partner"}
                className="hidden sm:inline-flex"
              >
                <Button
                  variant={
                    navConfig.actions?.cta?.variant === "primary" ? "default" : "white"
                  }
                  size="sm"
                  className="h-9 px-4 rounded-full font-medium"
                >
                  {navConfig.actions?.cta?.label || "Discuss Partnership"}
                </Button>
              </Link>
            )}
            {!authLoading &&
              (isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link href={Routes.Home}>
                    <Button
                      variant="white"
                      size="sm"
                      className="h-9 px-4 rounded-full font-medium gap-2"
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
                    className="h-9 px-3 text-foreground/90 hover:text-foreground"
                    aria-label="Log out"
                  >
                    <LogOut className="size-4" />
                  </Button>
                </div>
              ) : (navConfig.actions?.showSignIn ?? SHOW_MARKETING_SIGN_IN) ? (
                <Link href={navConfig.actions?.signInHref || Routes.Login}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-3 rounded-full font-medium text-foreground hover:bg-muted/40"
                  >
                    {navConfig.actions?.signInLabel || "Sign in"}
                  </Button>
                </Link>
              ) : null)}
            <motion.div
              whileTap={{ scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0, 1] }}
              className="lg:hidden"
            >
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsOpen((prev) => !prev)}
                className="h-9 w-9 relative overflow-hidden text-foreground"
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

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} navConfig={navConfig} />
    </div>
  );
};

export default Navbar;
