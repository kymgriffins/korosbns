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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("cs-nav", scrolled && "scrolled")}>
      <div className="cs-nav-inner">
        <Link href="/" className="cs-nav-logo">
          BNS.
        </Link>
        <nav className="cs-nav-links" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="cs-nav-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
