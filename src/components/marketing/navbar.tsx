"use client";

import { cn } from "@/utils";
import Link from "next/link";
import { useState } from "react";
import { Routes } from "@/constants";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import CinematicMenu from "./cinematic-menu";

const CENTER_LINKS = [
    { label: "Learn", href: Routes.Learn },
    { label: "Research", href: Routes.Research },
    { label: "About", href: Routes.About },
] as const;

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
        if (latest > viewportHeight * 0.12) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    });

    return (
        <>
            <motion.header
                initial={false}
                className={cn(
                    "fixed inset-x-0 top-0 z-[150] w-full border-b transition-[background-color,border-color,box-shadow] duration-300 ease-out",
                    isScrolled
                        ? "border-black/[0.06] bg-background/82 shadow-[0_1px_0_rgba(0,0,0,0.03)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/[0.08] dark:bg-background/78 dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]"
                        : "border-white/[0.12] bg-black/25 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-black/15",
                )}
            >
                <div className="mx-auto grid h-11 w-full max-w-[1068px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 sm:h-12 md:px-6 lg:px-8">
                    <div className="flex min-w-0 justify-start">
                        <Link
                            href={Routes.Home}
                            className="flex items-center outline-none ring-offset-2 ring-offset-transparent transition-opacity hover:opacity-90 focus-visible:rounded-md focus-visible:ring-2 focus-visible:ring-white/40 md:ring-offset-background"
                        >
                            <Image
                                src="/logo.svg"
                                alt="Budget Ndio Story"
                                width={140}
                                height={28}
                                priority
                                className={cn(
                                    "h-[1.25rem] w-auto md:h-7",
                                    !isScrolled &&
                                        "brightness-0 invert drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)] dark:brightness-100 dark:invert-0 dark:drop-shadow-none",
                                )}
                            />
                        </Link>
                    </div>

                    <nav
                        className="hidden items-center justify-center gap-0.5 lg:flex"
                        aria-label="Primary"
                    >
                        {CENTER_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-full px-3 py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors",
                                    isScrolled
                                        ? "text-foreground/80 hover:bg-foreground/[0.06] hover:text-foreground"
                                        : "text-white/90 hover:bg-white/12 hover:text-white",
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
                        <div
                            className={cn(
                                "flex items-center justify-center rounded-full p-0.5 transition-colors",
                                isScrolled
                                    ? "bg-black/[0.04] dark:bg-white/[0.06]"
                                    : "bg-white/15",
                            )}
                        >
                            <ThemeToggle />
                        </div>

                        <Link
                            href={Routes.JoinUs}
                            className={cn(
                                "hidden rounded-full px-3 py-1.5 text-[13px] font-medium tracking-[-0.01em] transition-colors sm:inline-flex sm:px-4",
                                isScrolled
                                    ? "text-foreground/90 hover:bg-foreground/[0.06]"
                                    : "text-white/95 hover:bg-white/12",
                            )}
                        >
                            Join
                        </Link>

                        <button
                            type="button"
                            aria-expanded={isMenuOpen}
                            aria-controls="site-navigation-dialog"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            onClick={() => setIsMenuOpen(true)}
                            className={cn(
                                "inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium tracking-[-0.01em] transition-colors sm:h-9 sm:px-4",
                                isScrolled
                                    ? "bg-foreground text-background hover:bg-foreground/88"
                                    : "border border-white/25 bg-white/15 text-white hover:bg-white hover:text-black",
                            )}
                        >
                            Menu
                            <span className="flex flex-col gap-[5px]" aria-hidden>
                                <span className="block h-[2px] w-[14px] rounded-full bg-current" />
                                <span className="block h-[2px] w-[14px] rounded-full bg-current" />
                            </span>
                        </button>
                    </div>
                </div>
            </motion.header>

            <CinematicMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Navbar;
