"use client";

import { cn } from "@/utils";
import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Routes } from "@/constants";
import MobileMenu from "./mobile-menu";
import { Button } from "@/ui/button";
import Image from "next/image";
import { useClickOutside } from "@/hooks";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useClickOutside(() => setIsOpen(false));

    useEffect(() => {
        const isMobileDevice = () => window.innerWidth < 1024;
        
        if (isOpen && isMobileDevice()) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        const handleResize = () => {
            if (!isMobileDevice()) {
                document.body.style.overflow = '';
            } else if (isOpen) {
                document.body.style.overflow = 'hidden';
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);

    return (
        <div className="relative w-full h-full">
            <div className="z-100 hidden lg:block fixed pointer-events-none inset-x-0 h-[88px] bg-background/80 backdrop-blur-sm [mask:linear-gradient(to_bottom,#000_20%,transparent_calc(100%-20%))]"></div>
            <header
                className={cn(
                    "fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-100 transition-all duration-300 ease-in-out",
                    isOpen ? "h-[calc(100dvh-2rem)] lg:h-16" : "h-14 md:h-16"
                )}
            >
                <div 
                    ref={ref}
                    className={cn(
                        "backdrop-blur-xl rounded-xl lg:rounded-full border border-border h-full flex flex-col relative bg-background/50 transition-all duration-300",
                        isOpen ? "overflow-hidden lg:overflow-visible" : "overflow-hidden"
                    )}
                >
                    <div className="flex items-center justify-between w-full px-4 min-h-14 md:min-h-16 shrink-0 pb-1">
                        <div className="flex items-center flex-1">
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

                        <div className="flex items-center gap-2 md:gap-3">
                            <ThemeToggle />
                            <Link href={Routes.JoinUs}>
                                <Button variant="white" size="sm" className="h-9 px-4 rounded-lg font-medium">
                                    Join us
                                </Button>
                            </Link>
                            <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => setIsOpen((prev) => !prev)}
                                className="h-9 w-9 rounded-lg"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? <XIcon className="size-5 duration-300" /> : <MenuIcon className="size-5 duration-300" />}
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
