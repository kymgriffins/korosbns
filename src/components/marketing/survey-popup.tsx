"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

const SURVEY_SEEN_KEY = "hasSeenSurveyPopup";
const SURVEY_HANDLED_KEY = "surveyPopupHandled";
const SURVEY_HANDLED_EVENT = "bns:survey-popup-handled";

const SURVEY_URL = "https://budgetndiostory.surveycto.com/collect/bns_nyouth_budget_v1";

export default function SurveyPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [imgError, setImgError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const close = () => {
        localStorage.setItem(SURVEY_SEEN_KEY, "true");
        localStorage.setItem(SURVEY_HANDLED_KEY, "true");
        window.dispatchEvent(new CustomEvent(SURVEY_HANDLED_EVENT));
        setIsOpen(false);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const hasSeenPopup = localStorage.getItem(SURVEY_SEEN_KEY);
            if (!hasSeenPopup) {
                setIsOpen(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-opacity duration-300">
            <div className="relative w-full max-w-md bg-background rounded-2xl overflow-hidden shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={close}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white/80 hover:text-white transition-colors"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>

                <a href={SURVEY_URL} target="_blank" rel="noopener noreferrer" onClick={close} className="block">
                    {imgError ? (
                        <div className="w-full aspect-[3/4] max-h-[65vh] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center p-6">
                            <div className="text-center text-muted-foreground">
                                <p className="text-sm font-semibold text-foreground mb-1">National Youth Budget Perception Pilot Survey</p>
                                <p className="text-xs">Click to take the survey</p>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-3 min-h-[300px]">
                            <img
                                ref={imgRef}
                                src="/images/survey/bnssurvey1.jpeg"
                                alt="National Youth Budget Perception Pilot Survey"
                                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                                onError={() => setImgError(true)}
                            />
                        </div>
                    )}
                </a>

                <div className="flex items-center justify-end gap-2 p-3 bg-foreground/5 border-t border-border">
                    <button onClick={close} className="h-10 rounded-lg px-4 text-sm font-medium text-foreground/80 bg-foreground/5 hover:bg-foreground/10 transition-colors">
                        Cancel
                    </button>
                    <a
                        href={SURVEY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                        className="h-10 rounded-lg px-4 text-sm font-semibold text-white bg-primary hover:bg-primary/90 transition-colors inline-flex items-center"
                    >
                        Take survey
                    </a>
                </div>
            </div>
        </div>
    );
}
