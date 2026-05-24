"use client";

import { cn } from "@/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import React from 'react';
import { NAV_LINKS, Routes } from "@/constants";
import { Button } from "@/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { 
    BookOpen, 
    ClipboardList, 
    HelpCircle, 
    FileText, 
    Calendar, 
    Mail, 
    User, 
    LogIn,
    ChevronRight
} from "lucide-react";

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const getIcon = (label: string, isMobile: boolean) => {
    const sizeClass = isMobile ? "size-5" : "size-4";
    const colorClass = isMobile 
        ? "text-foreground/75 group-hover:text-primary transition-colors" 
        : "text-muted-foreground/70 group-hover:text-foreground transition-colors";
    const className = cn("mr-3", sizeClass, colorClass);

    switch (label.toLowerCase()) {
        case "learn":
            return <BookOpen className={className} />;
        case "surveys":
            return <ClipboardList className={className} />;
        case "trivia":
            return <HelpCircle className={className} />;
        case "articles":
            return <FileText className={className} />;
        case "events":
            return <Calendar className={className} />;
        case "faq":
            return <HelpCircle className={className} />;
        case "contact":
            return <Mail className={className} />;
        default:
            return null;
    }
};

const MobileMenu = ({ isOpen, setIsOpen }: Props) => {
    const { isLoggedIn, loading: authLoading } = useAuth();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Mobile Menu (Accordion view on smaller viewports) */}
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{
                            duration: 0.15,
                            ease: [0.22, 0.61, 0.36, 1]
                        }}
                        className="flex flex-col flex-1 px-4 pb-6 overflow-y-auto lg:hidden"
                    >
                        <ul className="flex flex-col items-start flex-1 w-full space-y-1 py-4">
                            {NAV_LINKS.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: index * 0.04,
                                        duration: 0.25
                                    }}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full"
                                >
                                    <Link
                                        href={item.href}
                                        className="group flex items-center justify-between w-full px-4 py-3 text-base font-medium rounded-xl text-foreground hover:text-primary hover:bg-foreground/5 active:scale-98 transition transform duration-200"
                                    >
                                        <span className="flex items-center">
                                            {getIcon(item.label, true)}
                                            {item.label}
                                        </span>
                                        <ChevronRight className="size-5 opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
                                    </Link>
                                </motion.li>
                            ))}
                            {!authLoading && (
                                <motion.li
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: NAV_LINKS.length * 0.04,
                                        duration: 0.25
                                    }}
                                    onClick={() => setIsOpen(false)}
                                    className="w-full border-t border-border/40 pt-2 mt-2"
                                >
                                    <Link
                                        href={isLoggedIn ? Routes.Account : Routes.Login}
                                        className="group flex items-center justify-between w-full px-4 py-3 text-base font-semibold rounded-xl text-primary hover:bg-foreground/5 active:scale-98 transition transform duration-200"
                                    >
                                        <span className="flex items-center">
                                            {isLoggedIn ? (
                                                <User className="size-5 mr-3 text-primary" />
                                            ) : (
                                                <LogIn className="size-5 mr-3 text-primary" />
                                            )}
                                            {isLoggedIn ? "Account Dashboard" : "Sign in to your account"}
                                        </span>
                                        <ChevronRight className="size-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                                    </Link>
                                </motion.li>
                            )}
                        </ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: (NAV_LINKS.length + 1) * 0.04,
                                duration: 0.25
                            }}
                            className="flex flex-col gap-3 pt-4 border-t border-border/40"
                        >
                            <Link href={Routes.JoinUs}>
                                <Button
                                    size="default"
                                    variant="white"
                                    className="w-full h-11 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Join us
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Desktop Dropdown (Absolute-positioned floating card) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{
                            duration: 0.15,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                        className="hidden lg:flex flex-col absolute top-[calc(100%+8px)] right-4 w-64 bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl p-2 z-[100]"
                    >
                        <ul className="flex flex-col w-full space-y-0.5">
                            {NAV_LINKS.map((item, index) => (
                                <li key={index} className="w-full">
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group flex items-center justify-between w-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground font-medium rounded-xl hover:bg-foreground/[0.03] transition-all duration-200"
                                    >
                                        <span className="flex items-center">
                                            {getIcon(item.label, false)}
                                            {item.label}
                                        </span>
                                        <ChevronRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                    </Link>
                                </li>
                            ))}
                            {!authLoading && (
                                <>
                                    <li className="h-px bg-border/40 my-1.5" />
                                    <li className="w-full">
                                        <Link
                                            href={isLoggedIn ? Routes.Account : Routes.Login}
                                            onClick={() => setIsOpen(false)}
                                            className="group flex items-center justify-between w-full px-3 py-2.5 text-sm text-primary hover:text-primary/80 font-semibold rounded-xl hover:bg-foreground/[0.03] transition-all duration-200"
                                        >
                                            <span className="flex items-center">
                                                {isLoggedIn ? (
                                                    <User className="size-4 mr-3 text-primary/80 group-hover:text-primary transition-colors" />
                                                ) : (
                                                    <LogIn className="size-4 mr-3 text-primary/80 group-hover:text-primary transition-colors" />
                                                )}
                                                {isLoggedIn ? "Account Dashboard" : "Sign in to account"}
                                            </span>
                                            <ChevronRight className="size-4 text-primary opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default MobileMenu;
