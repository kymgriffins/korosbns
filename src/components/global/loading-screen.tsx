"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

const LoadingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const overlayRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const overlay = overlayRef.current;
        const progressBar = progressBarRef.current;
        const progressFill = progressFillRef.current;
        const logo = logoRef.current;

        if (!overlay || !progressBar || !progressFill || !logo) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 0);
            }
        });

        tl.set(overlay, { opacity: 1 })
            .set(progressBar, { opacity: 0, y: 20 })
            .set(logo, { opacity: 0, scale: 0.8, filter: 'blur(10px)' })
            .set(progressFill, { scaleX: 0, transformOrigin: 'left' })

            // 1. Fade in logo
            .to(logo, {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: "power3.out",
            })

            // 2. Show progress bar
            .to(progressBar, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
            }, "-=0.2")

            // 3. Fill progress bar
            .to(progressFill, {
                scaleX: 1,
                duration: 1.5,
                ease: "power2.inOut",
            })

            // 4. Exit animation
            .to([logo, progressBar], {
                opacity: 0,
                scale: 0.95,
                filter: 'blur(10px)',
                duration: 0.6,
                ease: "power2.inOut"
            })
            .to(overlay, {
                y: '-100%',
                duration: 1,
                ease: "expo.inOut",
            }, "-=0.2");

        return () => {
            tl.kill();
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[10000] bg-background flex items-center justify-center overflow-hidden [will-change:transform] opacity-100"
        >
            <div className="relative z-10 flex flex-col items-center gap-4">
                <div
                    ref={logoRef}
                    className="flex justify-center [will-change:transform,opacity,filter] opacity-0"
                >
                    <Image
                        src="/logo.svg"
                        alt="Logo"
                        width={180}
                        height={50}
                        className="h-12 w-auto md:h-16"
                        priority
                    />
                </div>

                <div
                    ref={progressBarRef}
                    className="w-32 md:w-48 h-1 bg-foreground/10 rounded-full overflow-hidden mt-4 backdrop-blur-sm [will-change:transform,opacity] opacity-0"
                >
                    <div
                        ref={progressFillRef}
                        className="h-full bg-primary rounded-full [will-change:transform] scale-x-0 origin-left"
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;
