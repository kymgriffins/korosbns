"use client";

import { cn } from "@/utils";
import Link from "next/link";
import { useState, useRef } from "react";
import { Routes } from "@/constants";
import { motion, useScroll, useMotionValueEvent, useSpring, useMotionValue } from "motion/react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import CinematicMenu from "./cinematic-menu";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [hidden, setHidden] = useState(false);
    const { scrollY } = useScroll();
    const lastScrollY = useRef(0);

    const [isScrolled, setIsScrolled] = useState(false);

    // Magnetic Menu Button
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
    const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x * 0.35);
        mouseY.set(y * 0.35);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = lastScrollY.current;
        const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

        // Hide on scroll down, reveal on scroll up
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }

        // Appearance changes after hero section
        if (latest > viewportHeight * 0.8) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }

        lastScrollY.current = latest;
    });

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0, opacity: 1 },
                    hidden: { y: -100, opacity: 0 },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1]
                }}
                className="fixed inset-x-0 top-[max(1.25rem,env(safe-area-inset-top))] z-[150] mx-auto w-full pointer-events-none px-3 sm:px-4"
            >
                <div
                    className={cn(
                        "pointer-events-auto mx-auto flex max-w-[min(92vw,1280px)] items-center justify-between rounded-[999px] px-3 py-1.5 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] sm:px-5 md:px-6 md:py-2",
                        "backdrop-blur-2xl",
                        isScrolled
                            ? "scale-[0.985] border border-black/8 bg-white/78 shadow-premium dark:border-white/12 dark:bg-black/55"
                            : "border border-white/14 bg-white/8 dark:border-white/10 dark:bg-black/20",
                        !isScrolled &&
                            "supports-[backdrop-filter]:bg-white/6 supports-[backdrop-filter]:dark:bg-black/15"
                    )}
                >
                    {/* LEFT: Logo */}
                    <div className="flex items-center">
                        <Link href={Routes.Home} className="flex items-center gap-2 group/logo transition-transform active:scale-95">
                            <Image
                                src="/logo.svg"
                                alt="Budget Ndio Story"
                                width={140}
                                height={28}
                                className={cn(
                                    "w-auto h-6 md:h-7 transition-all duration-500 group-hover/logo:scale-105",
                                    !isScrolled && "brightness-0 invert dark:brightness-100 dark:invert-0 opacity-80 hover:opacity-100"
                                )}
                            />
                        </Link>
                    </div>

                    {/* RIGHT: Controls */}
                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Theme Toggle - Embedded styling */}
                        <div className={cn(
                            "flex items-center justify-center rounded-full transition-all duration-500",
                            isScrolled ? "bg-black/5 dark:bg-white/5" : "bg-white/10 dark:bg-black/10"
                        )}>
                            <ThemeToggle />
                        </div>

                        <Link href={Routes.JoinUs} className="inline-flex">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "h-9 rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.14em] transition-all sm:h-10 sm:px-6 sm:text-xs sm:tracking-widest",
                                    !isScrolled
                                        ? "text-white hover:bg-white/12"
                                        : "text-foreground hover:bg-black/6 dark:hover:bg-white/8"
                                )}
                            >
                                Join
                            </Button>
                        </Link>

                        {/* Animated Menu Button */}
                        <motion.button
                            style={{ x: springX, y: springY }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsMenuOpen(true)}
                            className={cn(
                                "group/menu relative flex h-9 items-center gap-2 overflow-hidden rounded-full px-4 transition-all duration-500 md:h-10 md:gap-3 md:px-6",
                                isScrolled
                                    ? "bg-primary text-primary-foreground shadow-[0_8px_32px_-12px_var(--primary)]"
                                    : "border border-white/18 bg-white/12 text-white hover:bg-white hover:text-black dark:border-white/12 dark:bg-white/8"
                            )}
                        >
                            <span className="z-10 text-[10px] font-bold uppercase tracking-[0.14em] md:text-[11px] md:tracking-[0.1em]">
                                Menu
                            </span>

                            <div className="relative w-4 h-3 z-10 flex flex-col justify-between items-center py-0.5">
                                <motion.span
                                    animate={isMenuOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                                    className="block w-full h-0.5 bg-current rounded-full origin-center"
                                />
                                <motion.span
                                    animate={isMenuOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                                    className="block w-full h-0.5 bg-current rounded-full origin-center"
                                />
                            </div>

                            {/* Blue glow effect on hover */}
                            <div className="absolute inset-0 bg-primary opacity-0 group-hover/menu:opacity-100 transition-opacity blur-xl -z-10" />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            <CinematicMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    )
};

export default Navbar;
