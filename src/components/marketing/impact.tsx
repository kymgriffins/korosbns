"use client";

import { motion } from 'motion/react';
import Wrapper from '@/components/global/wrapper';
import SectionBadge from '@/components/ui/section-badge';
import { Users, Eye, Map, Calendar, Heart, Share2, type LucideIcon } from 'lucide-react';
import { impactContent } from "@/content";

const iconMap: Record<string, LucideIcon> = {
    Users,
    Map,
    Calendar,
    Eye,
    Heart,
    Share2,
};

const impactMetrics = impactContent.metrics;

const Impact = () => {
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
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <SectionBadge title={impactContent.hero.badge} />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight mt-6"
                    >
                        {impactContent.hero.title}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed"
                    >
                        {impactContent.hero.description}
                    </motion.p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
                    {impactMetrics.map((metric, index) => {
                        const Icon = iconMap[metric.icon as string] ?? Users;
                        return (
                            <motion.div
                                key={metric.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="relative rounded-2xl p-8 bg-foreground/5 border border-foreground/10 hover:border-primary/20 transition-all group"
                            >
                                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <Icon className="size-6 text-primary" />
                                    </div>
                                    <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                                        {metric.value}
                                    </div>
                                    <div className="text-lg font-semibold mb-2">{metric.label}</div>
                                    <p className="text-sm text-muted-foreground">
                                        {metric.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Testimonial/Quote */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl mx-auto text-center mb-20"
                >
                    <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-foreground/90">
                        {impactContent.testimonial.quote}
                    </blockquote>
                    <div className="mt-6">
                        <div className="font-semibold">{impactContent.testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{impactContent.testimonial.source}</div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-center"
                >
                    <div className="rounded-2xl p-8 lg:p-12 bg-foreground/5 border border-foreground/10 max-w-3xl mx-auto">
                        <h2 className="text-2xl lg:text-3xl font-bold mb-4">{impactContent.cta.heading}</h2>
                        <p className="text-muted-foreground mb-6">
                            {impactContent.cta.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/learn" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                                {impactContent.cta.primaryLabel}
                            </a>
                            <a href="https://instagram.com/budgetndiostory" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 bg-foreground/5 border border-foreground/10 rounded-xl font-medium hover:bg-foreground/10 transition-colors">
                                {impactContent.cta.secondaryLabel}
                            </a>
                        </div>
                    </div>
                </motion.div>
            </Wrapper>
        </section>
    );
};

export default Impact;
