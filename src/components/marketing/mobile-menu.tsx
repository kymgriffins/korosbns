"use client";

import { cn } from "@/utils";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import React from 'react';
import { NAV_LINKS, Routes } from "@/constants";
import { Button } from "../ui/button";

interface Props {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu = ({ isOpen, setIsOpen }: Props) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    className="fixed inset-0 top-0 left-0 w-full h-screen bg-white/90 dark:bg-black/90 z-[100] flex flex-col p-8 pt-24 lg:hidden"
                >
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="absolute top-8 right-8 size-12 flex items-center justify-center rounded-full bg-foreground/5"
                    >
                        <motion.span 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xl font-bold"
                        >
                            ✕
                        </motion.span>
                    </button>

                    <div className="flex flex-col h-full">
                        <ul className="space-y-6">
                            {NAV_LINKS.map((item, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-4xl font-bold tracking-tight hover:text-primary transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.li>
                            ))}
                        </ul>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: NAV_LINKS.length * 0.1 + 0.2 }}
                            className="mt-auto pb-12"
                        >
                            <Link href={Routes.JoinUs}>
                                <Button
                                    size="lg"
                                    className="w-full h-16 rounded-2xl text-xl font-bold shadow-2xl shadow-primary/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Join the Collective
                                </Button>
                            </Link>
                            
                            <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
                                Decentralizing fiscal oversight across 47 counties.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};

export default MobileMenu;
