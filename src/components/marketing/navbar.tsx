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
    const [scrolledAmount, setScrolledAmount] = useState(0);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolledAmount(latest);
        if (latest > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    });

    const navHeight = isScrolled ? "h-14 sm:h-16" : "h-16 md:h-20";
    const navBg = isScrolled 
        ? "border-black/[0.04] bg-background/80 shadow-[0_4px_30px_rgba(0,0,0,0.03)] backdrop-blur-3xl dark:border-white/[0.04] dark:bg-background/70"
        : "border-white/10 bg-black/10 backdrop-blur-xl";

    return (
        <>
            <motion.header
                initial={false}
                className={cn(
                    "fixed inset-x-0 top-0 z-[150] w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b",
                    navHeight,
                    navBg
                )}
            >
                <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-2 px-5 md:px-10">
                    <div className="flex min-w-0 justify-start">
                        <Link
                            href={Routes.Home}
                            className="flex items-center outline-none transition-opacity hover:opacity-80"
                        >
                            <Image
                                src="/logo.svg"
                                alt="Budget Ndio Story"
                                width={160}
                                height={32}
                                priority
                                className={cn(
                                    "h-6 w-auto md:h-6 transition-all duration-500 scale-125 md:scale-100",
                                    !isScrolled && "brightness-0 invert dark:brightness-100 dark:invert-0"
                                )}
                            />
                        </Link>
                    </div>

                    <nav
                        className="hidden items-center justify-center gap-1 lg:flex"
                        aria-label="Primary"
                    >
                        {CENTER_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
                                    isScrolled
                                        ? "text-foreground/70 hover:bg-foreground/[0.05] hover:text-foreground"
                                        : "text-white/80 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-4">
                        <div
                            className={cn(
                                "flex items-center justify-center rounded-full p-0.5 transition-colors",
                                isScrolled
                                    ? "bg-black/[0.03] dark:bg-white/[0.05]"
                                    : "bg-white/10"
                            )}
                        >
                            <ThemeToggle />
                        </div>

                        <button
                            type="button"
                            aria-expanded={isMenuOpen}
                            aria-controls="site-navigation-dialog"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            onClick={() => setIsMenuOpen(true)}
                            className={cn(
                                "inline-flex h-11 items-center gap-3 rounded-full px-4 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-500 md:h-11",
                                isScrolled
                                    ? "text-foreground bg-foreground/[0.03] hover:bg-foreground/[0.08]"
                                    : "text-white bg-white/10 hover:bg-white/20"
                            )}
                        >
                            <span className="hidden sm:inline">Explore</span>
                            <span className="flex flex-col gap-[5px]" aria-hidden>
                                <span className="block h-[1.5px] w-[16px] rounded-full bg-current" />
                                <span className="block h-[1.5px] w-[16px] rounded-full bg-current" />
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
