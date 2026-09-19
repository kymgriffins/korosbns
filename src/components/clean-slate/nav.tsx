"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type NavigationItem = {
  label: string;
  href: string;
};

type CleanSlateNavProps = {
  items: NavigationItem[];
};

export function CleanSlateNav({ items }: CleanSlateNavProps) {
  const pathname = usePathname();
  const activeHref = items.reduce<string | undefined>((active, item) => {
    const matches =
      item.href === "/"
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
    return matches && (!active || item.href.length > active.length) ? item.href : active;
  }, undefined);
  const isActive = (href: string) => href === activeHref;

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-sm text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Budget Ndio Story
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {items.map((item) => (
            <Button
              key={item.href}
              asChild
              variant={isActive(item.href) ? "secondary" : "ghost"}
              size="sm"
            >
              <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button className="lg:hidden" variant="outline" size="icon" aria-label="Open navigation">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Budget Ndio Story</SheetTitle>
              <SheetDescription>Explore our programmes and contact the team.</SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4" aria-label="Mobile navigation">
              {items.map((item) => (
                <SheetClose key={item.href} asChild>
                  <Button
                    asChild
                    className="justify-start"
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                  >
                    <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                      {item.label}
                    </Link>
                  </Button>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
