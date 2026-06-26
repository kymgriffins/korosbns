"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function LandingFooter() {
    return (
        <footer className="bg-black text-white pt-24 md:pt-36 pb-12 md:pb-20 overflow-hidden border-t border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 md:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-24 md:mb-32">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="gusto-heading mb-12"
                        >
                            Let's write the <br />
                            <span className="text-primary italic font-heading">next chapter</span> together.
                        </motion.h2>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:hello@budgetndiostory.org" className="text-2xl md:text-4xl font-black hover:text-primary transition-colors tracking-tight">
                                hello@budgetndiostory.org
                            </a>
                            <p className="text-white/40 tracking-[0.2em] uppercase text-xs">Join the movement</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-6">
                            <h4 className="text-white/40 text-xs font-semibold">Explore</h4>
                            <ul className="space-y-4">
                                <li><Link href="/learn" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Stories</Link></li>
                                <li><Link href="/learn" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Learn</Link></li>
                                <li><Link href="/about" className="text-base md:text-lg hover:text-primary transition-colors inline-block">About</Link></li>
                                <li><Link href="/contact" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-white/40 text-xs font-semibold">Social</h4>
                            <ul className="space-y-4">
                                <li><a href="https://instagram.com/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Instagram</a></li>
                                <li><a href="https://twitter.com/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Twitter / X</a></li>
                                <li><a href="https://youtube.com/@budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">YouTube</a></li>
                                <li><a href="https://linkedin.com/company/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-black tracking-tighter text-white">BNS.</span>
                        <span className="text-white/20 text-xs">© 2026 Budget Ndio Story</span>
                    </div>
                    <div className="flex gap-6 text-white/40 text-xs font-semibold">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
