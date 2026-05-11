"use client";

import { ThemeProvider } from 'next-themes';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import { LenisProvider } from './lenis-provider';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
                <Toaster />
                <LenisProvider>
                    {children}
                </LenisProvider>
            </TooltipProvider>
        </ThemeProvider>
    );
};

export default Providers;

