"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full border border-border/50">
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            </Button>
        );
    }

    const toggleTheme = () => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full border border-border/50 bg-background hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait">
                {theme === "light" && (
                    <motion.div
                        key="light"
                        initial={{ opacity: 0, rotate: -90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] text-orange-500" />
                    </motion.div>
                )}
                {theme === "dark" && (
                    <motion.div
                        key="dark"
                        initial={{ opacity: 0, rotate: -90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
                    </motion.div>
                )}
                {theme === "system" && (
                    <motion.div
                        key="system"
                        initial={{ opacity: 0, rotate: -90, scale: 0 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Monitor className="h-[1.2rem] w-[1.2rem] text-primary" />
                    </motion.div>
                )}
            </AnimatePresence>
        </Button>
    );
}
