"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { studiosEvidenceData } from "@/data/studios-evidence";
import { useStudioTheme } from "@/contexts/studio-theme-context";
import { STUDIO_REEL_SLIDE_COUNT } from "@/lib/studio-reel-slides";
import { cn } from "@/utils";

export type StudioNavActive = "home" | "work" | "about";

type Props = {
  variant?: "overlay" | "solid";
  active?: StudioNavActive;
  onSearchOpen?: () => void;
};

const FEATURED_COUNT = studiosEvidenceData.getFeaturedProjects().length;
const WORK_COUNT = studiosEvidenceData.getAllProjects().length;

export function StudioSiteNav({
  variant = "solid",
  active,
  onSearchOpen,
}: Props) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useStudioTheme();
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  const resolvedActive: StudioNavActive =
    active ??
    (pathname === "/bns-studio/work"
      ? "work"
      : pathname === "/bns-studio/about"
        ? "about"
        : "home");

  const isOverlay = variant === "overlay";

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const menuLinks = [
    { href: "/", label: "← Back to BNS Main Site", key: "main" },
    { href: "/bns-studio", label: `Formats [${STUDIO_REEL_SLIDE_COUNT}]`, key: "home" },
    { href: "/bns-studio/work", label: `Featured work [${FEATURED_COUNT}]`, key: "work" },
    { href: "/bns-studio/about", label: "About Studios", key: "about" },
    { href: "/programmes", label: "All Programmes", key: "programmes" },
    { href: "/reports", label: "Budget Reports", key: "reports" },
    { href: "/bns-studio/about#contact", label: "Commission Studio", key: "contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "studio-site-nav",
          isOverlay ? "studio-site-nav-overlay" : "studio-site-nav-solid",
        )}
      >
        <nav className="studio-site-nav-inner" aria-label="BNS Studios">
          {/* Desktop left links - hidden on mobile */}
          <div className="studio-site-nav-left studio-nav-desktop-only flex items-center gap-3">
            <Link
              href="/"
              className="studio-site-nav-link text-xs opacity-75 hover:opacity-100"
            >
              ← BNS Main
            </Link>
            <span className="text-muted-foreground/40 text-xs">/</span>
            <Link
              href="/bns-studio/work"
              className={cn(
                "studio-site-nav-link",
                resolvedActive === "work" && "studio-site-nav-link-active",
              )}
            >
              Featured work [{FEATURED_COUNT}]
            </Link>
            <Link
              href="/bns-studio"
              className={cn(
                "studio-site-nav-link",
                resolvedActive === "home" && "studio-site-nav-link-active",
              )}
            >
              Formats [{STUDIO_REEL_SLIDE_COUNT}]
            </Link>
          </div>

          {/* Mobile hamburger - visible on mobile only */}
          <div className="studio-nav-mobile-left">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="studio-site-nav-search"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>

          <Link href="/bns-studio" className="studio-site-nav-brand flex items-center gap-1.5" title="Budget Ndio Story Studios">
            <span>BNS</span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/20 text-primary">Studios</span>
          </Link>

          <div className="studio-site-nav-right">
            <div className="studio-nav-desktop-only-links">
              <Link
                href="/bns-studio/about"
                className={cn(
                  "studio-site-nav-link",
                  resolvedActive === "about" && "studio-site-nav-link-active",
                )}
              >
                About
              </Link>
              <Link
                href="/bns-studio/about#contact"
                className="studio-site-nav-link"
              >
                Contact
              </Link>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="studio-site-nav-search"
              aria-label={theme === "dark" ? "Light theme" : "Dark theme"}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            {resolvedActive === "work" ? (
              <button
                type="button"
                onClick={onSearchOpen}
                className="studio-site-nav-search"
                aria-label="Focus search"
              >
                <Search className="size-4" aria-hidden />
              </button>
            ) : (
              <Link
                href="/bns-studio/work"
                className="studio-site-nav-search"
                aria-label="Search productions"
              >
                <Search className="size-4" aria-hidden />
              </Link>
            )}
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="studio-mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="studio-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="BNS Studios menu"
          >
            <div className="studio-mobile-menu-top">
              <span className="studio-site-nav-brand">BNS</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="studio-site-nav-search"
                aria-label="Close menu"
                autoFocus
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <nav className="studio-mobile-menu-links" aria-label="BNS Studios">
              {menuLinks.map((link, i) => (
                <motion.div
                  key={link.href + link.label}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.35,
                    delay: reduceMotion ? 0 : 0.06 * i,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "studio-mobile-menu-link",
                      resolvedActive === link.key &&
                        "studio-mobile-menu-link-active",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : 0.25 }}
              className="studio-mobile-menu-foot"
            >
              <p>{WORK_COUNT} commissions</p>
              <p>
                <a
                  href="https://instagram.com/budgetndiostory"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <span aria-hidden> · </span>
                <a
                  href="https://youtube.com/@budgetndiostory"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export function StudioSiteFooter({ variant = "solid" }: { variant?: "overlay" | "solid" }) {
  const isOverlay = variant === "overlay";

  return (
    <footer
      className={cn(
        "studio-site-footer",
        isOverlay ? "studio-site-footer-overlay" : "studio-site-footer-solid",
      )}
    >
      <div className="studio-site-footer-inner">
        <p>© {new Date().getFullYear()} Budget Ndio Story</p>
        <p className="studio-site-footer-meta">
          <span>{WORK_COUNT} commissions</span>
          <span aria-hidden>·</span>
          <a href="https://instagram.com/budgetndiostory" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <span aria-hidden>·</span>
          <a href="https://youtube.com/@budgetndiostory" target="_blank" rel="noopener noreferrer">
            YouTube
          </a>
        </p>
        <p>
          <Link href="/bns-studio/about">Studio</Link>
          <span aria-hidden> · </span>
          <Link href="/privacy">Privacy</Link>
        </p>
      </div>
    </footer>
  );
}
