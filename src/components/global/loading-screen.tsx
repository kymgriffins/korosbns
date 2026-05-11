"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

interface CloudinaryImage {
    src: string;
    alt: string;
}

const LoadingScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [images, setImages] = useState<CloudinaryImage[]>([]);

    const overlayRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const progressFillRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const imagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/images/cohort');
                const data = await res.json();
                if (data.images) {
                    // Take up to 12 images for the background grid
                    setImages(data.images.slice(0, 12));
                }
            } catch (error) {
                console.error("Failed to fetch images for loading screen:", error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const overlay = overlayRef.current;
        const progressBar = progressBarRef.current;
        const progressFill = progressFillRef.current;
        const logo = logoRef.current;
        const imagesContainer = imagesContainerRef.current;

        if (!overlay || !progressBar || !progressFill || !logo || !imagesContainer) return;

        const tl = gsap.timeline({
            onComplete: () => {
                setTimeout(() => {
                    setIsLoading(false);
                }, 0);
            }
        });

        // Get all individual image items
        const imageItems = imagesContainer.querySelectorAll('.bg-image-item');
        
        // Separate items for directional animation (Left 2 cols move down, Right 2 cols move up)
        const topMoving = Array.from(imageItems).filter((_, i) => (i % 4) < 2);
        const bottomMoving = Array.from(imageItems).filter((_, i) => (i % 4) >= 2);

        tl.set(overlay, { opacity: 1 })
            .set(progressBar, { opacity: 0, y: 20 })
            .set(logo, { opacity: 0, scale: 0.8, filter: 'blur(10px)' })
            .set(progressFill, { scaleX: 0, transformOrigin: 'left' })
            .set(imageItems, { opacity: 0, scale: 1, filter: 'grayscale(100%) contrast(1.2)' })
            .set(topMoving, { y: -100 }) // Starts at top, moves down to 0
            .set(bottomMoving, { y: 100 }) // Starts at bottom, moves up to 0

            // 1. Fade in images with a directional "pop"
            .to(imageItems, {
                opacity: 0.6,
                y: 0,
                filter: 'grayscale(0%) contrast(1)',
                duration: 1.8,
                stagger: {
                    amount: 0.8,
                    from: "edges"
                },
                ease: "power3.out"
            })

            // 2. Fade in logo after images start appearing
            .to(logo, {
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                duration: 0.8,
                ease: "power3.out",
            }, "-=0.4")

            // 3. Show progress bar
            .to(progressBar, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
            }, "-=0.2")

            // 4. Fill progress bar
            .to(progressFill, {
                scaleX: 1,
                duration: 1.5,
                ease: "power2.inOut",
            })

            // 5. Exit animation
            .to([logo, progressBar, imagesContainer], {
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
    }, [images.length > 0]); // Re-run when images are loaded

    if (!isLoading) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[10000] bg-background flex items-center justify-center overflow-hidden"
            style={{ willChange: 'transform', opacity: 1 }}
        >
            {/* Grayscale background images grid */}
            <div 
                ref={imagesContainerRef}
                className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-1 p-1 pointer-events-none"
            >
                {images.length > 0 ? (
                    images.map((img, i) => (
                        <div key={i} className="bg-image-item relative w-full h-full overflow-hidden rounded-lg bg-background shadow-sm">
                            <div className="relative w-full h-full overflow-hidden">
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover"
                                    sizes="25vw"
                                    priority
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    // Placeholder items if images haven't loaded yet
                    Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-image-item w-full h-full rounded-lg bg-muted/10" />
                    ))
                )}
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-background opacity-30" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-4">
                <div
                    ref={logoRef}
                    style={{
                        willChange: 'transform, opacity, filter',
                        opacity: 0,
                    }}
                    className="flex justify-center"
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
                    className="w-32 md:w-48 h-1 bg-foreground/10 rounded-full overflow-hidden mt-4 backdrop-blur-sm"
                    style={{
                        willChange: 'transform, opacity',
                        opacity: 0,
                    }}
                >
                    <div
                        ref={progressFillRef}
                        className="h-full bg-primary rounded-full"
                        style={{
                            willChange: 'transform',
                            transform: 'scaleX(0)',
                            transformOrigin: 'left'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;

