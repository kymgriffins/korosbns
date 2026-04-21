"use client";

import { useEffect } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    useEffect(() => {
        console.error(
            "404 Error: User attempted to access non-existent route:",
            window.location.pathname
        );
    }, []);

    return (
        <div className="min-h-dvh flex items-center justify-center bg-background px-4 relative overflow-hidden">
            {/* Ambient background */}
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

            <div className="max-w-lg w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="inline-block">
                        <span className="text-[180px] md:text-[240px] font-bold leading-none bg-linear-to-b from-primary/20 via-primary/10 to-transparent bg-clip-text text-transparent">
                            404
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-2xl md:text-3xl font-bold mb-4"
                >
                    Page not found
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-muted-foreground mb-8 leading-relaxed"
                >
                    The page you&apos;re looking for seems to have vanished into the budget ether. Maybe it was reallocated to a different department?
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link href="/">
                        <Button size="lg" className="gap-2">
                            <Home className="size-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/research">
                        <Button size="lg" variant="outline" className="gap-2">
                            <Search className="size-4" />
                            Browse Research
                        </Button>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12 pt-8 border-t border-foreground/10"
                >
                    <p className="text-sm text-muted-foreground mb-3">Or go back to where you came from</p>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                    >
                        <ArrowLeft className="size-4" />
                        Go back
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
