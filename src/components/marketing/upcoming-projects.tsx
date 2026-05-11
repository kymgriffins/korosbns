"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/container";
import { APPLE_EASE } from "@/constants/motion";

const projects = [
    {
        title: "Town Halls",
        timeline: "47 Counties Active",
        summary: "Physical forums in every county where youth interrogate local budget estimates with leaders.",
        image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1778387783/129A3912_ubzwvg.jpg",
        href: "/learn",
        cta: "Open brief",
    },
    {
        title: "Campus Hubs",
        timeline: "20 Universities",
        summary: "Permanent student chapters dedicated to fiscal analysis, debate, and peer education.",
        image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1778387782/129A4056_xjfn5g.jpg",
        href: "/learn?story=civic-compass-v2",
        cta: "Start story",
    },
    {
        title: "Verification Hub",
        timeline: "National Scale",
        summary: "A shared desk connecting youth and experts to verify fiscal claims with evidence.",
        image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1778481262/129A4186_h6a6gh.jpg",
        href: "/challenges",
        cta: "Join hub",
    },
];

const UpcomingProjects = () => {
    return (
        <section id="engagement" className="py-20 md:py-24 bg-background overflow-hidden">
            <Container size="ultra">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: APPLE_EASE }}
                    viewport={{ once: true }}
                    className="mb-14 md:mb-16"
                >
                    <span className="g-eyebrow text-primary mb-4 block">Engagement</span>
                    <h2 className="g-headline">Online Outrage to <br /><span className="text-primary">Offline Action</span>.</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {projects.map((project, i) => (
                        <FeatureCard key={i} project={project} index={i} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

const FeatureCard = ({ project, index }: { project: any; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 150 };
    const rotateX = useSpring(useTransform(mouseY, [-100, 100], [4, -4]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-100, 100], [-4, 4]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: APPLE_EASE, delay: index * 0.06 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative h-[520px] rounded-[32px] border border-foreground/5 bg-card overflow-hidden shadow-premium transition-all duration-700 hover:border-primary/20"
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src={project.image} 
                    alt={project.title} 
                    fill 
                    className="object-cover grayscale opacity-20 group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-105 transition-all duration-1000" 
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
            </div>

            {/* Radial Glow */}
            <motion.div 
                className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(circle 300px at ${50 + (x as number) / 2}% ${50 + (y as number) / 2}%, rgba(0, 85, 255, 0.1), transparent)`
                    )
                }}
            />

            <div className="relative z-20 h-full p-8 flex flex-col justify-end">
                <span className="g-mono text-primary mb-3">{project.timeline}</span>
                <h3 className="g-headline text-2xl md:text-3xl mb-3">{project.title}</h3>
                <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed mb-6 group-hover:text-foreground transition-colors duration-500">
                    {project.summary}
                </p>
                <Link href={project.href} className="group/btn">
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-full transition-all group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:gap-4">
                        <span className="g-eyebrow !text-inherit">{project.cta}</span>
                        <ArrowRight className="size-4" />
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

export default UpcomingProjects;

