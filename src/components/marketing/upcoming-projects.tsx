"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/container";
import { APPLE_EASE } from "@/constants/motion";

const projects = [
    {
        title: "TOWN HALLS",
        subtitle: "The street level of democracy.",
        summary: "Physical forums in every county where youth interrogate local budget estimates with leaders. Moving from digital outrage to physical accountability.",
        image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1778387783/129A3912_ubzwvg.jpg",
        href: "/learn",
    },
    {
        title: "CAMPUS HUBS",
        subtitle: "The engine of civic intelligence.",
        summary: "Permanent student chapters dedicated to fiscal analysis, debate, and peer education. Turning universities into research-driven advocacy centers.",
        image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1778387782/129A4056_xjfn5g.jpg",
        href: "/learn?story=civic-compass-v2",
    },
    {
        title: "VERIFICATION",
        subtitle: "Truth is a shared responsibility.",
        summary: "A national desk connecting youth and experts to verify fiscal claims with evidence. Translating 'he said, she said' into 'data said'.",
        image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1778481262/129A4186_h6a6gh.jpg",
        href: "/challenges",
    },
];

const UpcomingProjects = () => {
    return (
        <section id="engagement" className="py-24 md:py-48 bg-background overflow-hidden">
            <Container size="ultra">
                <div className="flex flex-col gap-24 md:gap-64">
                    {projects.map((project, i) => (
                        <ProjectFrame key={i} project={project} index={i} />
                    ))}
                </div>
            </Container>
        </section>
    );
};

const ProjectFrame = ({ project, index }: { project: any; index: number }) => {
    const frameRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: frameRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const isEven = index % 2 === 0;

    return (
        <div 
            ref={frameRef}
            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-24 items-center`}
        >
            {/* Image Side */}
            <div className="w-full md:w-3/5 overflow-hidden rounded-[32px] md:rounded-[48px] bg-zinc-900 aspect-[4/3] md:aspect-auto md:h-[60vh] relative">
                <motion.div style={{ scale: 1.1, y }} className="absolute inset-0">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover grayscale opacity-60 md:opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000 object-top"
                        sizes="(max-width: 768px) 100vw, 60vw"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-60" />
            </div>

            {/* Text Side */}
            <div className={`w-full md:w-2/5 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isEven ? 20 : -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: APPLE_EASE }}
                    viewport={{ once: true }}
                >
                    <span className="g-eyebrow text-primary/60 mb-4 block">Initiative {index + 1}</span>
                    <h3 className="g-display mb-4 tracking-tighter text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.85]">{project.title}</h3>
                    <p className="g-subheadline mb-4 text-[19px] md:text-2xl text-foreground font-medium leading-tight">
                        {project.subtitle}
                    </p>
                    <p className="g-text mb-8 text-muted-foreground leading-relaxed text-[16px] md:text-[18px] max-w-md mx-auto md:mx-0">
                        {project.summary}
                    </p>
                    <Link href={project.href} className="group inline-flex items-center gap-4">
                        <span className="text-[12px] font-bold uppercase tracking-widest border-b border-foreground/20 pb-1 group-hover:border-primary transition-colors">
                            Enter Brief
                        </span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default UpcomingProjects;
