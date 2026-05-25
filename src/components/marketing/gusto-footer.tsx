"use client";

import React from 'react';
import Link from 'next/link';
import Container from '../global/container';
import { motion } from 'motion/react';

const GustoFooter = () => {
    return (
        <footer className="bg-black text-white pt-24 md:pt-48 pb-12 md:pb-24 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-8 md:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="gusto-heading mb-12"
                        >
                            Let's write the <br />
                            <span className="text-primary italic font-serif">next chapter</span> together.
                        </motion.h2>
                        <div className="flex flex-col gap-4">
                            <a href="mailto:hello@budgetndiostory.org" className="text-3xl md:text-5xl font-medium hover:text-primary transition-colors">
                                hello@budgetndiostory.org
                            </a>
                            <p className="text-white/40 tracking-[0.2em] uppercase text-sm">Join the movement</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-white/40 uppercase tracking-widest text-xs">Explore</h4>
                            <ul className="space-y-4">
                                <li><Link href="/learn" className="text-xl hover:translate-x-2 transition-transform inline-block">Stories</Link></li>
                                <li><Link href="/research" className="text-xl hover:translate-x-2 transition-transform inline-block">Research</Link></li>
                                <li><Link href="/about" className="text-xl hover:translate-x-2 transition-transform inline-block">About</Link></li>
                                <li><Link href="/contact" className="text-xl hover:translate-x-2 transition-transform inline-block">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-white/40 uppercase tracking-widest text-xs">Social</h4>
                            <ul className="space-y-4">
                                <li><a href="https://instagram.com/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-xl hover:translate-x-2 transition-transform inline-block">Instagram</a></li>
                                <li><a href="https://twitter.com/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-xl hover:translate-x-2 transition-transform inline-block">Twitter / X</a></li>
                                <li><a href="https://youtube.com/@budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-xl hover:translate-x-2 transition-transform inline-block">YouTube</a></li>
                                <li><a href="https://linkedin.com/company/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-xl hover:translate-x-2 transition-transform inline-block">LinkedIn</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold tracking-tighter">BNS.</span>
                        <span className="text-white/20 text-sm">© 2026 Budget Ndio Story</span>
                    </div>
                    <div className="flex gap-8 text-white/40 text-xs uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default GustoFooter;
