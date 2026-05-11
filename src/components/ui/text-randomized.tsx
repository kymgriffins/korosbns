"use client";

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/utils';

interface RandomizedTextEffectProps {
    text: string;
    className?: string;
    shouldAnimate?: boolean;
}

export const RandomizedTextEffect: React.FC<RandomizedTextEffectProps> = ({ 
    text, 
    className,
    shouldAnimate = true
}) => {
    const [displayText, setDisplayText] = useState(text);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    const iterations = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!shouldAnimate) return;

        let iteration = 0;
        const targetText = text;
        
        clearInterval(intervalRef.current!);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev => 
                targetText.split("")
                    .map((char, index) => {
                        if(index < iteration) {
                            return targetText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join("")
            );

            if(iteration >= targetText.length){ 
                clearInterval(intervalRef.current!);
            }

            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(intervalRef.current!);
    }, [text, shouldAnimate]);

    return (
        <span className={cn("font-heading", className)}>
            {displayText}
        </span>
    );
};
