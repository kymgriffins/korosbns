"use client";

import { ThemeProvider } from 'next-themes';
import React from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <TooltipProvider>
                <Toaster />
                {children}
            </TooltipProvider>
        </ThemeProvider>
    );
};

export default Providers;

