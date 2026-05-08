"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import Wrapper from "../global/wrapper";
import SectionBadge from "../ui/section-badge";
import { cn } from "@/utils";

const images = [
    {
        src: "/images/towwnhallmay/129A3863.jpg",
        alt: "Town Hall Meeting",
        title: "Community Dialogue",
        category: "Community",
        className: "md:col-span-2 md:row-span-2",
    },
    {
        src: "/images/towwnhallmay/129A3912.jpg",
        alt: "Budget Presentation",
        title: "Fiscal Literacy",
        category: "Education",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        src: "/images/towwnhallmay/129A3923.jpg",
        alt: "Youth Engagement",
        title: "Youth Voices",
        category: "Action",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        src: "/images/towwnhallmay/129A4056.jpg",
        alt: "Town Hall Forum",
        title: "Direct Accountability",
        category: "Policy",
        className: "md:col-span-1 md:row-span-2",
    },
    {
        src: "/images/towwnhallmay/129A4094.jpg",
        alt: "Community Interaction",
        title: "Local Participation",
        category: "Impact",
        className: "md:col-span-1 md:row-span-1",
    },
    {
        src: "/images/team.png",
        alt: "BNS Team",
        title: "The BNS Team",
        category: "Team",
        className: "md:col-span-1 md:row-span-1",
    },
];

const Gallery = () => {
    return (
        <section id="gallery" className="w-full py-16 lg:py-24 bg-background/50">
            <Wrapper>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <SectionBadge title="The Gallery" />
                    <h2 className="text-3xl md:text-5xl font-bold font-heading tracking-tight mt-6">
                        Moments of Change
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed">
                        Visualizing our journey from complex numbers to actionable community stories across Kenya.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-[250px] lg:auto-rows-[300px]">
                    {images.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={cn(
                                "group relative overflow-hidden rounded-3xl border border-foreground/10 bg-cardbox",
                                image.className
                            )}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-2 backdrop-blur-sm border border-primary/20">
                                    {image.category}
                                </span>
                                <h3 className="text-lg lg:text-xl font-bold text-white leading-tight">
                                    {image.title}
                                </h3>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground"
                    >
                        <span>More moments are being added daily</span>
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <a href="/gallery" className="text-primary font-semibold hover:underline">
                            View full gallery
                        </a>
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default Gallery;
