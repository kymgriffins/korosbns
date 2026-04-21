"use client";

import { motion } from 'motion/react';
import Wrapper from '@/components/global/wrapper';
import SectionBadge from '@/components/ui/section-badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Eye } from 'lucide-react';

const stories = [
    {
        id: 1,
        title: "Education Budget: Where the Money Goes",
        excerpt: "Breaking down the KES 630B allocated to education and how it impacts classrooms across Kenya.",
        category: "Education",
        readTime: "5 min read",
        views: "45.2k",
        image: "/images/project.svg",
        href: "/stories/education-budget-2026"
    },
    {
        id: 2,
        title: "Healthcare Funding in the 2026 Budget",
        excerpt: "Understanding the SHA rollout and what KES 47B means for universal health coverage.",
        category: "Healthcare",
        readTime: "7 min read",
        views: "38.7k",
        image: "/images/client.svg",
        href: "/stories/healthcare-funding-2026"
    },
    {
        id: 3,
        title: "County Budgets: Your Local spending Guide",
        excerpt: "How the KES 420B equitable share is distributed across all 47 counties.",
        category: "Devolution",
        readTime: "6 min read",
        views: "29.1k",
        image: "/images/invoices.svg",
        href: "/stories/county-budgets-guide"
    },
    {
        id: 4,
        title: "Debt & Deficits: The Big Picture",
        excerpt: "Explaining Kenya's KES 1.15T fiscal deficit and what it means for future generations.",
        category: "Economics",
        readTime: "8 min read",
        views: "52.3k",
        image: "/images/gradient.svg",
        href: "/stories/debt-deficit-explained"
    },
    {
        id: 5,
        title: "BETA Pillars Explained in Plain English",
        excerpt: "Agriculture, MSMEs, Healthcare, Housing, Digital - what do they actually mean?",
        category: "Policy",
        readTime: "6 min read",
        views: "41.8k",
        image: "/images/blob.svg",
        href: "/stories/beta-pillars-breakdown"
    },
    {
        id: 6,
        title: "Fiscal Risks You Should Know About",
        excerpt: "The five major risks identified in the BPS 2026 and why they matter to you.",
        category: "Risk Analysis",
        readTime: "5 min read",
        views: "33.4k",
        image: "/images/project.svg",
        href: "/stories/fiscal-risks-2026"
    }
];

const StoryCard = ({ story, index }: { story: typeof stories[0]; index: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link href={story.href} className="group block h-full">
                <div className="h-full rounded-2xl lg:rounded-3xl overflow-hidden bg-foreground/5 border border-foreground/10 hover:border-primary/30 transition-all duration-300">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                            src={story.image}
                            alt={story.title}
                            fill
                            className="object-cover transition-all duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-xs font-medium bg-primary/90 text-white rounded-full">
                                {story.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {story.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
                            {story.excerpt}
                        </p>

                        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-foreground/5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                {story.readTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Eye className="size-3.5" />
                                {story.views}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const Stories = () => {
    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden">
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full"
                />
            </div>

            <Wrapper className="relative z-10 py-12 lg:py-20">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
                    <SectionBadge title="Budget Stories" />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mt-6"
                    >
                        Understanding Kenya&apos;s budget, one story at a time
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed"
                    >
                        Explore our collection of explainers, analyses, and deep dives into Kenya&apos;s fiscal policy. From education to healthcare, we break down where your taxes go.
                    </motion.p>
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
                    {stories.map((story, index) => (
                        <StoryCard key={story.id} story={story} index={index} />
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="text-center mt-16"
                >
                    <Link href="/learn">
                        <Button size="lg" className="text-base">
                            View Full Learning Module
                            <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </Link>
                </motion.div>
            </Wrapper>
        </section>
    );
};

export default Stories;
