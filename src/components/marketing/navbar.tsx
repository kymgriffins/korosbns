"use client";

import { cn } from "@/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import { Routes } from "@/constants";
import { motion, useScroll, useMotionValueEvent, AnimatePresence, useTransform, useSpring, useMotionValue } from "motion/react";
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
                className="fixed top-6 inset-x-0 mx-auto z-[150] w-full pointer-events-none"
            >
                <div 
                    className={cn(
                        "mx-auto max-w-[95%] md:max-w-[92%] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto",
                        "flex items-center justify-between",
                        "rounded-full px-4 md:px-6 py-1.5 md:py-2",
                        isScrolled 
                            ? "bg-white/70 dark:bg-black/50 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-premium scale-[0.98]" 
                            : "bg-white/5 dark:bg-black/10 backdrop-blur-md border border-white/5 dark:border-black/5"
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
                        
                        <Link href={Routes.JoinUs} className="hidden sm:block">
                            <Button 
                                variant="ghost" 
                                className={cn(
                                    "h-10 px-6 rounded-full text-xs font-bold tracking-widest uppercase transition-all",
                                    !isScrolled ? "text-white hover:bg-white/10" : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
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
                                "h-9 md:h-10 px-5 md:px-6 flex items-center gap-3 rounded-full transition-all duration-500 group/menu relative overflow-hidden",
                                isScrolled 
                                    ? "bg-primary text-white" 
                                    : "bg-white/10 dark:bg-white/5 text-white backdrop-blur-md border border-white/10 hover:bg-white hover:text-black"
                            )}
                        >
                            <span className="text-[11px] font-bold tracking-[0.1em] uppercase z-10">Menu</span>
                            
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
