"use client";

import { cn } from "@/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Routes, NAV_LINKS } from "@/constants";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "../ui/button";
import MobileMenu from "./mobile-menu";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    return (
        <header className="fixed top-0 inset-x-0 z-50 pt-6 px-4 pointer-events-none">
            <nav className={cn(
                "mx-auto max-w-5xl pointer-events-auto transition-all duration-500 ease-[0.16,1,0.3,1]",
                "backdrop-blur-xl bg-white/70 dark:bg-black/70",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_20px_40px_-10px_rgba(0,0,0,0.05)]",
                "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_30px_60px_-15px_rgba(0,0,0,0.4)]",
                isOpen ? "rounded-[2rem] h-[calc(100vh-3rem)]" : "rounded-full h-16"
            )}>
                <div className="h-16 flex items-center justify-between px-6">
                    {/* Logo */}
                    <Link href={Routes.Home} className="flex items-center gap-2 group shrink-0">
                        <Image 
                            src="/logo.svg" 
                            alt="Budget Ndio Story" 
                            width={130} 
                            height={26} 
                            className="w-auto h-5 transition-transform duration-500 group-hover:scale-105" 
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1">
                        {NAV_LINKS.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                className="relative px-5 py-2 text-sm font-semibold tracking-tight text-foreground/60 hover:text-foreground transition-colors duration-300"
                            >
                                <span className="relative z-10">{item.label}</span>
                                <AnimatePresence>
                                    {hoveredIndex === index && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            className="absolute inset-0 bg-foreground/5 rounded-full -z-0"
                                        />
                                    )}
                                </AnimatePresence>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link href={Routes.JoinUs} className="hidden lg:block">
                            <Button variant="default" size="sm" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                                Join Us
                            </Button>
                        </Link>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden size-10 flex items-center justify-center rounded-full bg-foreground/5"
                        >
                            {isOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
                        </button>
                    </div>
                </div>

                <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            </nav>
        </header>
    );
};

export default Navbar;
