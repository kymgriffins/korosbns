"use client";

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Image from 'next/image';

interface CloudinaryImage {
    src: string;
    alt: string;
    width: number;
    height: number;
}

const CloudinaryGallery = () => {
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

    if (loading) return <div className="h-96 flex items-center justify-center">Loading Gallery...</div>;

    return (
        <section className="py-20 md:py-36 bg-background overflow-x-hidden border-b border-border/40">
            <div className="max-w-[1400px] mx-auto px-6 md:px-16 mb-12 md:mb-16">
                <span className="text-muted-foreground uppercase tracking-[0.3em] text-xs mb-4 block">Visual Impact</span>
                <h2 className="gusto-subheading text-foreground max-w-2xl">Documenting the <span className="italic font-heading text-primary">Movement</span> in the field.</h2>
            </div>

            <div className="flex flex-nowrap gap-6 md:gap-10 px-6 md:px-16 overflow-x-auto no-scrollbar py-8 max-w-full">
                {images.map((image, i) => (
                    <GalleryItem key={i} image={image} index={i} />
                ))}
            </div>
        </section>
    );
};

const GalleryItem = ({ image, index }: { image: CloudinaryImage; index: number }) => {
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 5 : -5]);

    return (
        <motion.div
            ref={ref}
            style={{ scale, rotate }}
            className="relative flex-shrink-0 w-[300px] md:w-[450px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl"
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-110"
                sizes="(max-width: 768px) 300px, 450px"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <p className="text-foreground text-sm tracking-widest uppercase">{image.alt}</p>
            </div>
        </motion.div>
    );
};

export default CloudinaryGallery;
