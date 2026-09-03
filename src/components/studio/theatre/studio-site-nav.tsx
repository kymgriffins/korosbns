"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Search, Sun } from "lucide-react";
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
  const resolvedActive: StudioNavActive =
    active ??
    (pathname === "/bns-studio/work"
      ? "work"
      : pathname === "/bns-studio/about"
        ? "about"
        : "home");

  const isOverlay = variant === "overlay";

  return (
    <header
      className={cn(
        "studio-site-nav",
        isOverlay ? "studio-site-nav-overlay" : "studio-site-nav-solid",
      )}
    >
      <nav className="studio-site-nav-inner" aria-label="BNS Studios">
        <div className="studio-site-nav-left">
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
              "studio-site-nav-link hidden sm:inline",
              resolvedActive === "home" && "studio-site-nav-link-active",
            )}
          >
            Formats [{STUDIO_REEL_SLIDE_COUNT}]
          </Link>
        </div>

        <Link href="/bns-studio" className="studio-site-nav-brand">
          BNS
        </Link>

        <div className="studio-site-nav-right">
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
