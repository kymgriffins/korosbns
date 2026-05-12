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

const brandColors: Record<string, string> = {
    x: '#000000',
    linkedin: '#0077B5',
    whatsapp: '#25D366',
    youtube: '#FF0000',
    tiktok: '#000000',
    instagram: '#E4405F',
    facebook: '#1877F2'
};

const GustoFooter = () => {
    return (
        <footer className="relative bg-background text-foreground overflow-hidden flex flex-col justify-between pt-16 pb-0 z-0">
            {/* Atmospheric Depth Layers */}
            <div className="absolute inset-0 z-0 opacity-100 pointer-events-none bg-linear-to-b from-[#F7F7F5] to-[#E8E8E4] dark:from-[#050505] dark:to-[#0C0C0C]" />
            <div className="absolute inset-0 z-0 opacity-[0.6] pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(255,255,255,1)_0%,_transparent_70%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08)_0%,_transparent_60%)]" />
            <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-noise" />

            <Container size="ultra" className="relative z-10 flex flex-col h-full flex-1">

                {/* MIDDLE: Columnar Layout & Socials */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-12 gap-y-12 py-12 md:py-16">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="flex flex-wrap gap-5">
                            {socialLinks.map((social) => (
                                <SocialIcon 
                                    key={social.label} 
                                    icon={brandIcons[social.icon] || social.icon} 
                                    href={social.href}
                                />
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-light">
                            Transforming complex national budgets into actionable narratives for the next generation.
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
                            <p className="g-mono text-[11px] opacity-20 uppercase tracking-[0.4em]">Global HQ</p>
                            <p className="text-lg font-light text-muted-foreground">Nairobi, Kenya</p>
                        </div>
                    </div>
                </div>

                {/* BOTTOM: Bidirectional Watermark Marquee */}
                <div className="mt-auto w-full overflow-hidden border-t border-foreground/5 pt-8">
                    <div className="flex flex-col gap-0 group">
                        <ScrollBaseAnimation 
                            baseVelocity={3} 
                            scrollDependent={true}
                            clasname="text-[8vw] font-black uppercase tracking-[-0.04em] leading-[0.9] select-none text-foreground"
                        >
                            BUDGET NDIO STORY
                        </ScrollBaseAnimation>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-8 g-mono text-[11px] text-muted-foreground border-t border-foreground/5 mt-8 px-2">
                        <p className="tracking-widest uppercase">© 2026 BUDGET NDIO STORY. NATIONAL CIVIC INITIATIVE.</p>
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
        <span className="g-mono text-[11px] text-primary/30 font-black uppercase tracking-[0.4em]">{title}</span>
        <ul className="space-y-3">
            {links.map((link) => (
                <li key={link.label}>
                    <Link href={link.href} className="text-base md:text-lg font-light text-muted-foreground hover:text-primary transition-all duration-500">
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);

const SocialIcon = ({ icon, href }: { icon: string; href: string }) => (
    <motion.a 
        href={href} 
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ 
            scale: 1.05, 
            backgroundColor: 'var(--primary)', 
            borderColor: 'var(--primary)', 
            color: 'var(--primary-foreground)' 
        }}
        className="w-11 h-11 rounded-full border border-foreground/10 flex items-center justify-center transition-all duration-500 text-foreground"
    >
        <Icon icon={icon} className="w-5 h-5" />
    </motion.a>
);

export default GustoFooter;
