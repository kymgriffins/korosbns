"use client";

import { cn } from "@/utils";
import { ArrowRightIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import { usePathname } from "next/navigation";
import Icons from "../global/icons";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";
import MobileMenu from "./mobile-menu";
import { NAV_LINKS, Routes } from "@/constants";
import { motion } from "motion/react";
import { useIsMobile } from "@/hooks";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <div className="relative w-full h-full">
            <div className="z-100 hidden lg:block fixed pointer-events-none inset-x-0 h-[88px] bg-background/80 backdrop-blur-sm [mask:linear-gradient(to_bottom,#000_20%,transparent_calc(100%-20%))]"></div>
            <header
                className={cn(
                    "fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-100 transition-all duration-300 ease-in-out",
                    isOpen ? "h-[calc(100dvh-2rem)]" : "h-14 md:h-16"
                )}
            >
                <div className="backdrop-blur-xl rounded-xl lg:rounded-full border border-border h-full flex flex-col overflow-hidden relative bg-background/50">
                    <div className="flex items-center justify-between w-full px-4 min-h-14 md:min-h-16 shrink-0 pb-1">
                        <div className="flex items-center flex-1 lg:flex-none">
                            <Link href={Routes.Home} className="flex items-center gap-2 group">
                                <Image 
                                    src="/logo.svg" 
                                    alt="Budget Ndio Story" 
                                    width={140} 
                                    height={28} 
                                    className="w-auto h-5 lg:h-6 transition-all group-hover:brightness-110" 
                                />
                            </Link>
                        </div>

                        <div className="lg:flex items-center hidden gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            {NAV_LINKS.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className="relative px-6 py-2.5 group"
                                >
                                    <motion.span
                                        className="relative z-10 text-sm font-medium text-foreground/70 transition-colors group-hover:text-primary inline-block"
                                        whileHover={{ 
                                            y: -2,
                                            scale: 1.02,
                                            textShadow: "0 0 8px rgba(0, 85, 255, 0.4)"
                                        }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                    
                                    {/* Animated Background Pill */}
                                    <motion.div
                                        layoutId="nav-pill-active"
                                        className="absolute inset-0 bg-primary/5 rounded-full border border-primary/10 opacity-0 group-hover:opacity-100 -z-10"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileHover={{ 
                                            opacity: 1, 
                                            scale: 1,
                                            boxShadow: [
                                                "0 0 10px rgba(0, 85, 255, 0.1)",
                                                "0 0 20px rgba(0, 85, 255, 0.2)",
                                                "0 0 10px rgba(0, 85, 255, 0.1)"
                                            ]
                                        }}
                                        transition={{ 
                                            boxShadow: { repeat: Infinity, duration: 2 },
                                            opacity: { duration: 0.2 }
                                        }}
                                    />

                                    {/* Shimmering 'Comet' Flare */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 pointer-events-none"
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                    >
                                        <motion.div 
                                            className="absolute inset-0 w-1/2 h-full bg-linear-to-r from-transparent via-primary/20 to-transparent -skew-x-12"
                                            animate={{ 
                                                x: ["-100%", "200%"],
                                            }}
                                            transition={{ 
                                                repeat: Infinity, 
                                                duration: 1.5, 
                                                ease: "easeInOut",
                                            }}
                                        />
                                    </motion.div>

                                    {/* Bottom Animated Bar */}
                                    <motion.div
                                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1.5px] bg-primary rounded-full"
                                        initial={{ width: 0 }}
                                        whileHover={{ width: "40%" }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 200, 
                                            damping: 15 
                                        }}
                                    />
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 lg:gap-3">
                            <ThemeToggle />
                            <Link href={Routes.JoinUs}>
                                <Button variant="white" className="hidden lg:flex">
                                    Join us
                                </Button>
                            </Link>
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="lg:hidden"
                            >
                                {isOpen ? <XIcon className="size-4 duration-300" /> : <MenuIcon className="size-4 duration-300" />}
                            </Button>
                        </div>
                    </div>

                    <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
                </div>
            </header>
        </div>
    )
};

export default Navbar;
