"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { MagazineGlobalContent } from "@/lib/cms-live-data";

type MagazineShellProps = {
  children: ReactNode;
  content: MagazineGlobalContent;
};

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MagazineShell({ children, content }: MagazineShellProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const chromeDisabled =
    pathname.startsWith("/learn") || pathname.startsWith("/stories");

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.classList.add("magazine-menu-open");
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.classList.remove("magazine-menu-open");
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  if (chromeDisabled) return children;

  const { dispatch, masthead, footer } = content;

  return (
    <div className="magazine-shell">
      <header className="magazine-header">
        <aside className="magazine-dispatch" aria-label={dispatch.label}>
          <p className="magazine-dispatch-label">{dispatch.label}</p>
          <div className="magazine-dispatch-window">
            <div className="magazine-dispatch-track">
              {[false, true].map((duplicate) => (
                <div
                  key={duplicate ? "duplicate" : "primary"}
                  className="magazine-dispatch-set"
                  aria-hidden={duplicate || undefined}
                >
                  {dispatch.items.map((item) => (
                    <Link key={`${duplicate}-${item.id}`} href={item.href}>
                      {item.text}
                      <span aria-hidden="true"> &#8594;</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="magazine-dispatch-edition">{masthead.edition}</p>
        </aside>

        <div className="magazine-masthead">
          <p className="magazine-masthead-edition">{masthead.edition}</p>
          <Link
            href="/"
            className="magazine-wordmark"
            aria-label={`${masthead.name} home`}
          >
            <span>{masthead.shortName}</span>
            <small>{masthead.name}</small>
          </Link>
          <button
            type="button"
            className="magazine-menu-toggle"
            aria-expanded={isOpen}
            aria-controls="magazine-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "Close" : "Menu"}
          </button>
          <nav
            id="magazine-navigation"
            className={`magazine-navigation${isOpen ? " is-open" : ""}`}
            aria-label="Primary navigation"
          >
            {masthead.navigation.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {children}

      <footer className="magazine-footer">
        <div className="magazine-footer-lede">
          <p>{footer.kicker}</p>
          <h2>{footer.statement}</h2>
        </div>

        <nav className="magazine-footer-navigation" aria-label="Footer">
          {footer.navigation.map((item) => (
            <Link key={item.id} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="magazine-partners">
          <p>{footer.partnersLabel}</p>
          <ul>
            {footer.partners.map((partner) => (
              <li key={partner.id}>
                <a href={partner.href} target="_blank" rel="noopener noreferrer">
                  {partner.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="magazine-colophon">
          <p>
            &copy; {new Date().getFullYear()} {masthead.name}. {footer.copyright}
          </p>
          <nav aria-label="Legal">
            {footer.legal.map((item) => (
              <Link key={item.id} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
