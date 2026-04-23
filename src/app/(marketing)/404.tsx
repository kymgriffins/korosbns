"use client";

import { useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Particles } from '@/components/ui/particles';

export default function NotFound() {
    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            window.location.pathname
        );
    }, []);

    return (
        <div className="min-h-dvh flex items-center justify-center bg-background px-4 relative overflow-hidden">
            {/* Particles background */}
            <Particles 
                quantity={80} 
                className="absolute inset-0" 
                color="rgba(255,255,255,0.1)" 
                size={0.6}
            />

            {/* Ambient gradient orbs */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-teal-500/10 blur-[150px] rounded-full"
                />
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">
                {/* Floating icon */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="inline-block"
                    >
                        <FileQuestion className="size-28 md:size-36 text-primary/30" strokeWidth={1.5} />
                    </motion.div>
                </motion.div>

                {/* 404 text with gradient */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="inline-block relative">
                        <span className="absolute inset-0 blur-2xl opacity-30 bg-gradient-to-r from-primary to-teal-500 filter"></span>
                        <span className="relative text-[8rem] md:text-[12rem] font-bold leading-none bg-linear-to-b from-primary/20 via-primary/10 to-transparent bg-clip-text text-transparent">
                            404
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-2xl md:text-4xl font-bold mb-4"
                >
                    Page not found
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-muted-foreground mb-10 leading-relaxed max-w-md mx-auto"
                >
                    The page you&apos;re looking for seems to have vanished into the budget ether. Maybe it was reallocated to a different department?
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/">
                        <Button size="lg" className="gap-2 min-w-[160px]">
                            <Home className="size-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/research">
                        <Button size="lg" variant="outline" className="gap-2 min-w-[160px]">
                            <Search className="size-4" />
                            Browse Research
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="mt-12 pt-8 border-t border-foreground/10"
                >
                    <p className="text-sm text-muted-foreground mb-3">Or go back to where you came from</p>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm group"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        Go back
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
