"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function SurveyPopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup after a short delay
        const timer = setTimeout(() => {
            const hasSeenPopup = sessionStorage.getItem("hasSeenSurveyPopup");
            if (!hasSeenPopup) {
                setIsOpen(true);
                sessionStorage.setItem("hasSeenSurveyPopup", "true");
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 transition-opacity duration-300">
            <div className="relative w-full max-w-sm bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom duration-300">
                {/* Close Button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="relative w-full aspect-[2/3] max-h-[80vh] flex flex-col items-center justify-center text-white overflow-hidden bg-black">
                    <a href="https://bit.ly/4tPZnLm" target="_blank" rel="noopener noreferrer" className="relative w-full h-full block group">
                        <Image
                            src="/images/survey/bnssurvey1.jpeg"
                            alt="National Youth Budget Perception Pilot Survey"
                            fill
                            className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
                            priority
                        />
                    </a>
                </div>
            </div>
        </div>
    );
}
