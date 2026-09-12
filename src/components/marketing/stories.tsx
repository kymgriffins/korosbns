"use client";

import { motion } from 'motion/react';
import Wrapper from '@/components/global/wrapper';
import SectionBadge from '@/components/ui/section-badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Eye } from 'lucide-react';
import { storiesContent } from "@/content";

type StoryItem = {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    views: string;
    image?: string;
    href: string;
    visual?: "budget-vs-debt";
};

const stories: StoryItem[] = storiesContent.items as StoryItem[];

const BudgetDebtVisual = () => {
    const debtBars = [54, 64, 72, 86, 94];
    const budgetBars = [42, 47, 55, 61, 67];
    const years = ["2022", "2023", "2024", "2025", "2026"];

    return (
        <div className="absolute inset-0 overflow-hidden bg-card">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:16px_16px]" />
            <motion.div
                className="absolute -top-8 -left-8 size-40 rounded-full bg-primary/30 blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute -bottom-8 -right-8 size-44 rounded-full bg-rose-500/30 blur-2xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.35, 0.2, 0.35] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="absolute inset-x-3 top-3 flex items-center justify-between rounded-lg border border-white/15 bg-black/35 px-2.5 py-1.5 text-[10px] text-white/80 backdrop-blur-sm">
                <span className="font-semibold">Kenya Budget vs Debt</span>
                <span>KES Trillions</span>
            </div>

            <div className="absolute inset-x-3 bottom-3 top-12 rounded-xl border border-white/10 bg-black/25 p-2 backdrop-blur-sm">
                <div className="flex h-full items-end justify-between gap-1.5">
                    {years.map((year, idx) => (
                        <div key={year} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                            <div className="flex h-full w-full items-end justify-center gap-1">
                                <motion.div
                                    className="w-[42%] rounded-t-sm bg-primary"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${budgetBars[idx]}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.07 }}
                                />
                                <motion.div
                                    className="w-[42%] rounded-t-sm bg-destructive"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${debtBars[idx]}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: idx * 0.09 }}
                                />
                            </div>
                            <span className="text-[9px] text-white/70">{year}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StoryCard = ({ story, index }: { story: StoryItem; index: number }) => {
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
                        {story.visual === "budget-vs-debt" ? (
                            <BudgetDebtVisual />
                        ) : (
                            <Image
                                src={story.image || "/images/gradient.svg"}
                                alt={story.title}
                                fill
                                className="object-cover transition-all duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        )}
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
                    <SectionBadge title={storiesContent.hero.badge} />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mt-6"
                    >
                        {storiesContent.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed"
                    >
                        {storiesContent.hero.description}
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
                            {storiesContent.hero.ctaLabel}
                            <ArrowRight className="ml-2 size-4" />
                        </Button>
                    </Link>
                </motion.div>
            </Wrapper>
        </section>
    );
};

export default Stories;
