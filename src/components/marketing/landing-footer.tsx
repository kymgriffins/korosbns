"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { EmailObfuscator } from "@/components/global/email-obfuscator";

export default function LandingFooter() {
    return (
        <footer className="bg-card text-card-foreground pt-24 md:pt-36 pb-12 md:pb-20 overflow-hidden border-t border-border">
            <div className="max-w-[1400px] mx-auto px-6 md:px-16">
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 mb-24 md:mb-32"
                >
                    <motion.div variants={fadeInUp}>
                        <h2 className="gusto-heading mb-12">
                            Let's write the <br />
                            <span className="text-primary italic font-heading">next chapter</span> together.
                        </h2>
                        <div className="flex flex-col gap-4">
                            <EmailObfuscator
                                email="hello@budgetndiostory.org"
                                className="text-2xl md:text-4xl font-black hover:text-primary transition-colors tracking-tight"
                            />
                            <p className="text-muted-foreground tracking-[0.2em] uppercase text-xs">Join the movement</p>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-6">
                            <h4 className="text-muted-foreground text-xs font-semibold">Explore</h4>
                            <ul className="space-y-4">
                                <li><Link href="/learn" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Stories</Link></li>
                                <li><Link href="/learn" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Learn</Link></li>
                                <li><Link href="/glossary" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Budget Glossary</Link></li>
                                <li><Link href="/help" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Help & FAQ</Link></li>
                                <li><Link href="/about" className="text-base md:text-lg hover:text-primary transition-colors inline-block">About</Link></li>
                                <li><Link href="/contact" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Contact</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-muted-foreground text-xs font-semibold">Social</h4>
                            <ul className="space-y-4">
                                <li><a href="https://instagram.com/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Instagram</a></li>
                                <li><a href="https://twitter.com/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">Twitter / X</a></li>
                                <li><a href="https://youtube.com/@budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">YouTube</a></li>
                                <li><a href="https://linkedin.com/company/budgetndiostory" target="_blank" rel="noopener noreferrer" className="text-base md:text-lg hover:text-primary transition-colors inline-block">LinkedIn</a></li>
                            </ul>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6"
                >
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-black tracking-tighter text-card-foreground">BNS.</span>
                        <span className="text-muted-foreground/50 text-xs">© 2026 Budget Ndio Story</span>
                    </div>
                    <div className="flex flex-wrap gap-6 text-muted-foreground text-xs font-semibold">
                        <Link href="/glossary" className="hover:text-card-foreground transition-colors">Budget Glossary</Link>
                        <Link href="/help" className="hover:text-card-foreground transition-colors">Help & FAQ</Link>
                        <Link href="/privacy" className="hover:text-card-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-card-foreground transition-colors">Terms of Service</Link>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
