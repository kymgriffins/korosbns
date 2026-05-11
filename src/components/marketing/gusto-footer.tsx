"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { APPLE_EASE } from '@/constants/motion';
import Container from '@/components/ui/container';
import { Button } from '../ui/button';
import { Icon } from '@iconify/react';
import { ArrowRight, Mail } from 'lucide-react';
import { socialLinks } from '@/constants/links';
import ScrollBaseAnimation from '@/components/ui/scroll-text-marque';

const brandIcons: Record<string, string> = {
    x: 'ri:twitter-x-fill',
    linkedin: 'lucide:linkedin',
    whatsapp: 'lucide:whatsapp',
    youtube: 'lucide:youtube',
    tiktok: 'ri:tiktok-fill',
    instagram: 'lucide:instagram',
    facebook: 'lucide:facebook'
};

const GustoFooter = () => {
    return (
        <footer className="relative bg-background text-foreground overflow-hidden h-screen flex flex-col justify-between pt-24 pb-12 z-0">
            {/* Background Grain */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-noise" />

            <Container size="ultra" className="relative z-10 flex flex-col h-full flex-1">
                {/* TOP: Monumental CTA */}
                <div className="pt-20 pb-32 border-b border-foreground/5 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-16">
                    <div className="max-w-4xl">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-8xl font-black tracking-[-0.06em] leading-[0.85] mb-12"
                        >
                            Fund fiscal <br />
                            <span className="text-primary italic font-light">literacy today.</span>
                        </motion.h2>
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <a href="mailto:info@budgetndiostory.org" className="flex items-center gap-4 text-2xl md:text-3xl font-light hover:text-primary transition-colors group">
                                <Mail className="w-8 h-8 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                                <span>info@budgetndiostory.org</span>
                            </a>
                        </div>
                    </div>
                    <Button variant="outline" size="lg" className="rounded-full px-12 h-20 text-2xl font-black group shadow-premium active:scale-95 border-primary/20 hover:bg-primary/5">
                        Join the Narrative <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                </div>

                {/* MIDDLE: Precise Columnar Layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-24 py-24 md:py-32">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex flex-wrap gap-6">
                            {socialLinks.map((social) => (
                                <SocialIcon 
                                    key={social.label} 
                                    icon={brandIcons[social.icon] || social.icon} 
                                    href={social.href}
                                />
                            ))}
                        </div>
                        <p className="text-base text-muted-foreground max-w-sm leading-relaxed font-light">
                            Budget Ndio Story is a youth-led Kenyan initiative transforming complex national budgets into actionable narratives for democratic participation.
                        </p>
                    </div>
                    
                    <FooterColumn 
                        title="Platform" 
                        links={[
                            { label: 'Narratives', href: '/learn' },
                            { label: 'Data Hub', href: '/research' },
                            { label: 'County Tracker', href: '/challenges' },
                            { label: 'About Us', href: '/about' }
                        ]} 
                    />
                    <FooterColumn 
                        title="Movement" 
                        links={[
                            { label: 'Donate', href: '/donate' },
                            { label: 'Join Network', href: '/join' },
                            { label: 'Volunteer', href: '/volunteer' },
                            { label: 'Impact Report', href: '/careers' }
                        ]} 
                    />
                    
                    <div className="lg:col-span-2 flex flex-col justify-end items-start lg:items-end">
                        <div className="text-left lg:text-right space-y-2">
                            <p className="g-mono text-[9px] opacity-20 uppercase tracking-[0.5em]">Global HQ</p>
                            <p className="text-lg font-light text-muted-foreground">Nairobi, Kenya</p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM: Watermark Monument */}
                <div className="mt-auto pt-12">
                    <div className="opacity-[0.03] dark:opacity-[0.05] hover:opacity-10 transition-opacity duration-1000">
                        <ScrollBaseAnimation 
                            baseVelocity={-0.5} 
                            scrollDependent={true}
                            clasname="text-[15vw] font-black uppercase tracking-[-0.05em] leading-none select-none text-foreground"
                        >
                            BUDGET NDIO STORY
                        </ScrollBaseAnimation>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-12 g-mono text-[10px] opacity-20 border-t border-foreground/5 mt-12">
                        <p className="tracking-widest">© 2026 BUDGET NDIO STORY. NATIONAL CIVIC INITIATIVE.</p>
                        <div className="flex gap-12">
                            <Link href="/privacy" className="hover:text-primary transition-colors tracking-widest uppercase">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-primary transition-colors tracking-widest uppercase">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

const FooterColumn = ({ title, links }: { title: string; links: { label: string; href: string }[] }) => (
    <div className="space-y-8">
        <span className="g-mono text-[9px] text-primary/30 font-black uppercase tracking-[0.4em]">{title}</span>
        <ul className="space-y-4">
            {links.map((link) => (
                <li key={link.label}>
                    <Link href={link.href} className="text-xl md:text-2xl font-light text-muted-foreground hover:text-primary transition-all duration-500">
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const SocialIcon = ({ icon, href }: { icon: string; href: string }) => (
    <a 
        href={href} 
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center transition-all duration-500 hover:border-primary hover:text-primary hover:scale-110"
    >
        <Icon icon={icon} className="w-6 h-6" />
    </a>
);

export default GustoFooter;
