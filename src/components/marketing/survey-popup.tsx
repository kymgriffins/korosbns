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
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-opacity duration-300">
            <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-[210] p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-colors"
                aria-label="Close survey popup"
            >
                <X size={20} />
            </button>
            <div className="relative w-full max-w-md bg-[#0F172A] rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-300">
                <div className="relative w-full aspect-[2/3] max-h-[85vh] flex flex-col items-center justify-center text-white overflow-hidden bg-black">
                    <a href="https://budgetndiostory.surveycto.com/collect/bns_nyouth_budget_v1?caseid=" target="_blank" rel="noopener noreferrer" className="relative w-full h-full block group">
                        <Image
                            src="/images/survey/bnssurvey1.jpeg"
                            alt="National Youth Budget Perception Pilot Survey"
                            fill
                            className="object-contain group-hover:scale-[1.02] transition-transform duration-500"
                            priority
                        />
                    </a>
                </div>
                <div className="flex items-center justify-end gap-2 p-3 bg-[#0B1222] border-t border-white/10">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="h-10 rounded-lg px-4 text-sm font-medium text-white/85 bg-white/10 hover:bg-white/15 transition-colors"
                    >
                        Cancel
                    </button>
                    <a
                        href="https://budgetndiostory.surveycto.com/collect/bns_nyouth_budget_v1?caseid="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 rounded-lg px-4 text-sm font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-colors inline-flex items-center"
                    >
                        Take survey
                    </a>
                </div>
            </div>
        </div>
    );
}
