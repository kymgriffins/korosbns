"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Play, Users, Target, CheckCircle, ArrowUpRight } from "lucide-react";
import { consortiumContent } from "@/content";

const activityIconMap: Record<string, React.ComponentType<{ className?: string }>> = { Play, Users, Target, CheckCircle };

const partners = consortiumContent.partners;

const activities = consortiumContent.activities;

const ConsortiumPartners = () => {
    return (
        <section id="consortium" className="w-full py-20 lg:py-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 size-96 bg-primary/5 rounded-full blur-[10rem]" />
                <div className="absolute bottom-1/4 right-1/4 size-96 bg-blue-500/5 rounded-full blur-[10rem]" />
            </div>

            <Wrapper>
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <SectionBadge title={consortiumContent.hero.badge} />
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-6 text-foreground">
                            {consortiumContent.hero.title}
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            {consortiumContent.hero.description}
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Main Overview Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="md:col-span-12 lg:col-span-8 rounded-[2.5rem] border border-foreground/10 bg-card p-8 md:p-12 relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">{consortiumContent.mission.heading}</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                                {consortiumContent.mission.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {partners.map((partner, idx) => (
                                    <Link 
                                        key={partner.name}
                                        href={partner.href}
                                        target="_blank"
                                        className="group/partner flex flex-col items-center sm:items-start"
                                    >
                                        <div className="relative h-16 w-32 grayscale opacity-50 group-hover/partner:grayscale-0 group-hover/partner:opacity-100 transition-all duration-300">
                                            <Image
                                                src={partner.image}
                                                alt={partner.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="mt-3 text-xs font-semibold text-muted-foreground group-hover/partner:text-primary transition-colors">
                                            {partner.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Decorative Gradient */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-primary/5 to-transparent -z-0 pointer-events-none" />
                    </motion.div>

                    {/* Impact Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-12 lg:col-span-4 rounded-[2.5rem] border border-foreground/10 bg-primary p-8 md:p-10 text-primary-foreground flex flex-col justify-between"
                    >
                        <div>
                            <div className="size-12 rounded-2xl bg-background/20 flex items-center justify-center mb-6">
                                <ArrowUpRight className="size-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 leading-tight">{consortiumContent.impactCard.heading}</h3>
                            <p className="text-primary-foreground/80 leading-relaxed">
                                {consortiumContent.impactCard.description}
                            </p>
                        </div>
                        <Link 
                            href="/about" 
                            className="mt-8 inline-flex items-center gap-2 font-bold hover:gap-3 transition-all"
                        >
                            {consortiumContent.impactCard.ctaLabel}
                            <ArrowUpRight className="size-5" />
                        </Link>
                    </motion.div>

                    {/* Activity Cards */}
                    {activities.map((activity, idx) => (
                        <motion.div
                            key={activity.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 + (idx * 0.05) }}
                            className="md:col-span-6 lg:col-span-3 rounded-[2rem] border border-foreground/10 bg-cardbox/40 p-8 hover:bg-cardbox/60 transition-colors"
                        >
                            <div className={`size-12 rounded-xl ${activity.bg} ${activity.color} flex items-center justify-center mb-6`}>
                                {(() => { const Icon = activityIconMap[activity.icon as string] || Play; return <Icon className="size-6" />; })()}
                            </div>
                            <h4 className="text-lg font-bold mb-3">{activity.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {activity.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </Wrapper>
        </section>
    );
};

export default ConsortiumPartners;

