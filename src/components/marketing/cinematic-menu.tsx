"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { X, Mail, ArrowRight } from 'lucide-react';
import { NAV_LINKS, Routes } from '@/constants';
import { Button } from '../ui/button';
import Image from 'next/image';
import NumberFlow from '@number-flow/react';
import { cn } from '@/utils';

interface CinematicMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const CinematicMenu = ({ isOpen, onClose }: CinematicMenuProps) => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Lock body scroll when menu is open
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

    const menuItems = [
        { label: "Learn", href: Routes.Learn },
        { label: "Challenges", href: Routes.Challenges },
        { label: "Stories", href: "/learn" },
        { label: "Research", href: "/research" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    animate={{ clipPath: "inset(0% 0 0% 0)" }}
                    exit={{ clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[200] bg-black text-white flex flex-col md:flex-row overflow-hidden"
                >
                    {/* Background Layer with Drifting Blobs */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-black to-black" />
                        
                        {/* Drifting Blur Blobs */}
                        <motion.div 
                            animate={{ 
                                x: [0, 100, -100, 0],
                                y: [0, -50, 50, 0],
                            }}
                            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-primary/20 blur-[120px] rounded-full"
                        />
                        <motion.div 
                            animate={{ 
                                x: [0, -80, 80, 0],
                                y: [0, 60, -60, 0],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-blue-500/10 blur-[100px] rounded-full"
                        />

                        {/* Enhanced Grain Overlay */}
                        <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay" />
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-8 right-8 z-[210] p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all active:scale-90 group"
                    >
                        <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
                    </button>

                    {/* Left Section: Nav Links */}
                    <div className="flex-[1.4] flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10 pt-24 md:pt-0">
                        <nav className="flex flex-col gap-1 md:gap-2">
                            {menuItems.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 + index * 0.08, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    className="relative group"
                                >
                                    <Link 
                                        href={item.href}
                                        onClick={onClose}
                                        className={cn(
                                            "inline-block text-4xl md:text-6xl lg:text-8xl font-black uppercase tracking-tighter transition-all duration-500 py-1",
                                            hoveredIndex !== null && hoveredIndex !== index 
                                                 ? "opacity-20 blur-[1px]" 
                                                 : "opacity-100",
                                            hoveredIndex === index ? "text-[#0066FF] translate-x-4" : "text-white"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                    
                                    {/* Animated Underline Tracking Hover */}
                                    <motion.div 
                                        className="absolute bottom-0 left-0 h-1 bg-[#0066FF] rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: hoveredIndex === index ? "100%" : 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                    />
                                </motion.div>
                            ))}
                        </nav>
                    </div>

                    {/* Right Section: Info & Newsletter */}
                    <div className="flex-1 border-l border-white/5 flex flex-col justify-between p-8 md:p-16 lg:p-20 z-10 bg-white/[0.02] backdrop-blur-3xl">
                        <div className="space-y-16">
                            {/* Block 1: Support */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <p className="g-mono text-primary mb-3 text-xs tracking-[0.2em]">Institutional Trust</p>
                                <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">Support civic education across Kenya.</h3>
                                <Button variant="white" size="lg" className="rounded-full gap-3 h-14 px-8 text-lg hover:scale-105 active:scale-95 transition-all">
                                    Donate Now <ArrowRight className="w-5 h-5" />
                                </Button>
                            </motion.div>

                            {/* Block 2: Newsletter */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <p className="g-mono text-primary mb-3 text-xs tracking-[0.2em]">Join the Narrative</p>
                                <h3 className="text-xl md:text-2xl font-bold mb-6 opacity-80">Weekly budget breakdowns delivered.</h3>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        className="bg-white/5 border border-white/10 rounded-full px-8 py-4 focus:outline-none focus:ring-2 focus:ring-primary w-full text-base transition-all focus:bg-white/10"
                                    />
                                    <Button variant="white" className="rounded-full px-10 h-14 text-base font-bold shadow-premium hover:scale-105 transition-all">Join</Button>
                                </div>
                            </motion.div>

                            {/* Block 3: Metrics */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5"
                            >
                                {[
                                    { value: 47, label: "Counties" },
                                    { value: 20, label: "Reach", suffix: "K+" },
                                    { value: 500, label: "Members", suffix: "+" }
                                ].map((stat) => (
                                    <div key={stat.label}>
                                        <div className="text-2xl md:text-3xl font-black text-primary">
                                            <NumberFlow value={stat.value} />{stat.suffix}
                                        </div>
                                        <p className="g-mono text-[9px] opacity-40 mt-1">{stat.label}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Contact Bottom */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="pt-8 border-t border-white/5 flex flex-col gap-4"
                        >
                            <a href="mailto:info@budgetndiostory.org" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors group">
                                <div className="p-2 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="font-mono text-[11px] tracking-widest uppercase">info@budgetndiostory.org</span>
                            </a>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CinematicMenu;
