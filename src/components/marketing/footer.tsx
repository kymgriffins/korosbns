"use client";

import React, { useState } from 'react';
import Wrapper from '@/components/global/wrapper';
import { socialLinks } from '@/constants';
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

            <Wrapper className="py-12 flex flex-col items-center text-center">
                <div className="max-w-md w-full flex flex-col items-center">
                    <Link href="/" className="inline-block group">
                        <Image 
                            src="/logo.svg" 
                            alt="Budget Ndio Story" 
                            width={160} 
                            height={32} 
                            className="h-6 lg:h-7 w-auto transition-all group-hover:brightness-110" 
                        />
                    </Link>
                    <p className="text-sm text-muted-foreground mt-4 max-w-xs">
                        Youth-led budget clarity for Kenya
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 w-full">
                        <p className="text-sm font-medium mb-3">Subscribe to the Story</p>
                        <div className="flex gap-2 max-w-sm mx-auto">
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

                <div className="flex flex-col items-center gap-6 mt-12 pt-8 w-full border-t border-foreground/5">
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

                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Budget Ndio Story. All rights reserved.
                    </p>
                </div>
            </Wrapper>
        </footer>
    );
};

export default Footer;
