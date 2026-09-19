"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/utils";

const NAV_ITEMS = [
  { label: "Programmes", href: "/programmes" },
  { label: "Connect", href: "/programmes/connect" },
  { label: "Studio", href: "/programmes/studios" },
  { label: "Wanahabari", href: "/programmes/wanahabari-lab" },
  { label: "Mashinani", href: "/programmes/mashinani" },
  { label: "Contact", href: "/contact" },
];

export function CleanSlateNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className={cn("cs-nav", scrolled && "scrolled")}>
      <div className="cs-nav-inner">
        <Link href="/" className="cs-nav-logo" onClick={() => setMenuOpen(false)}>
          BNS.
        </Link>

        {/* Desktop nav */}
        <nav className="cs-nav-links" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="cs-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="cs-nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={cn("cs-hamburger-line", menuOpen && "open")} />
          <span className={cn("cs-hamburger-line", menuOpen && "open")} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div className={cn("cs-mobile-menu", menuOpen && "open")}>
        <nav aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="cs-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
