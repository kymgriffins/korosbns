"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Container from '@/components/ui/container';
import { APPLE_EASE } from '@/constants/motion';
import { Marquee } from '@/components/ui/marquee';

interface CloudinaryImage {
    src: string;
    alt: string;
    width: number;
    height: number;
}

const GustoCloudinaryGallery = () => {
    const [images, setImages] = useState<CloudinaryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch('/api/images/cohort');
                const data = await res.json();
                if (data.images) {
                    setImages(data.images);
                }
            } catch (error) {
                console.error("Failed to fetch cohort images:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) return (
        <div className="h-[40vh] flex items-center justify-center bg-black">
            <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="g-mono text-white/40"
            >
                Loading Gallery...
            </motion.div>
        </div>
    );

    // Split images into two rows
    const half = Math.ceil(images.length / 2);
    const row1 = images.slice(0, half);
    const row2 = images.slice(half);

    return (
        <section className="py-24 md:py-32 bg-black overflow-hidden flex flex-col gap-12">
            <Container size="ultra">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: APPLE_EASE }}
                    viewport={{ once: true }}
                >
                    <span className="g-eyebrow text-primary mb-4 block">Visual Impact</span>
                    <h2 className="g-headline text-white max-w-4xl tracking-[-0.03em]">
                        Documenting the <span className="text-primary italic">Movement</span> in the field.
                    </h2>
                </motion.div>
            </Container>

            <div className="relative flex flex-col gap-8 md:gap-12">
                {/* Row 1: Left */}
                <Marquee
                    pauseOnHover
                    className="[--duration:60s] [--gap:2.5rem]"
                >
                    {row1.map((image, i) => (
                        <GalleryItem key={`row1-${i}`} image={image} />
                    ))}
                </Marquee>

                {/* Row 2: Right */}
                <Marquee
                    reverse
                    pauseOnHover
                    className="[--duration:55s] [--gap:2.5rem]"
                >
                    {row2.map((image, i) => (
                        <GalleryItem key={`row2-${i}`} image={image} />
                    ))}
                </Marquee>

                {/* Overlays for depth */}
                <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-linear-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-linear-to-l from-black to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
};

const GalleryItem = ({ image }: { image: CloudinaryImage }) => {
    return (
        <motion.div
            className="relative w-[300px] md:w-[450px] aspect-[4/3] rounded-[24px] overflow-hidden group cursor-pointer border border-white/5 transition-all duration-700 hover:scale-[1.02]"
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 300px, 450px"
            />

            {/* Minimal Caption Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end p-6 md:p-10">
                <p className="text-white/80 g-mono text-[11px] md:text-[12px] tracking-widest uppercase">
                    {image.alt}
                </p>
            </div>
        </motion.div>
    );
};

export default GustoCloudinaryGallery;
