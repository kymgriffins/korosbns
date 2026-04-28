"use client";

import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import React from 'react';

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <TooltipProvider>
            <Toaster />
            {children}
        </TooltipProvider>
    );
};

export default Providers;

