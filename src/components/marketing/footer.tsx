"use client";

import React, { useState } from 'react';
import Wrapper from '@/components/global/wrapper';
import { socialLinks, footerLinks } from '@/constants';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { cn } from "@/utils";

const Footer = () => {

    const [email, setEmail] = useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Newsletter:', email);
        setEmail('');
    };

    return (
        <footer className="w-full relative mt-16 lg:mt-24 overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-foreground/0 via-foreground/20 to-foreground/0" />
            <div className="absolute top-0 inset-x-0 w-1/2 mx-auto h-4 bg-foreground/40 blur-[4rem]" />

            <Wrapper className="py-16 flex flex-col">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 w-full max-w-6xl mx-auto mb-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2 flex flex-col items-start text-left">
                        <Link href="/" className="inline-block group mb-4">
                            <Image
                                src="/logo.svg"
                                alt="Budget Ndio Story"
                                width={160}
                                height={32}
                                className="h-6 lg:h-7 w-auto transition-all group-hover:brightness-110"
                            />
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            Youth-led budget clarity for Kenya. We turn complex budget data into simple stories everyone can understand.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-6 w-full max-w-sm">
                            <p className="text-sm font-medium mb-3">Subscribe to the Story</p>
                            <div className="flex gap-2">
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="flex-1 h-10 text-sm bg-foreground/5 border-foreground/10 focus-visible:ring-0 focus-visible:ring-transparent rounded-full px-4"
                                />
                                <Button type="submit" size="sm" className="h-10 px-6 rounded-full">
                                    Subscribe
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Product Links */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Product</h4>
                        {footerLinks.product.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Resources Links */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Resources</h4>
                        {footerLinks.resources.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Company Links */}
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/60">Company</h4>
                        {footerLinks.company.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-foreground/5 w-full max-w-6xl mx-auto">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Budget Ndio Story. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="opacity-60 hover:opacity-100 transition-opacity"
                            >
                                <Image
                                    src={`/icons/integrations/${social.icon === 'x' ? 'social-x' : social.icon}.svg`}
                                    alt={social.label}
                                    width={24}
                                    height={24}
                                    className={cn(
                                        "size-5 grayscale invert",
                                        social.icon === "x" && "size-4.5",
                                    )}
                                />
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                        <span>•</span>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                    </div>
                </div>
            </Wrapper>
        </footer>
    );
};

export default Footer;
