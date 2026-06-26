"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/ui/section-badge";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Play, Users, Target, CheckCircle, ArrowUpRight } from "lucide-react";

const partners = [
    {
        name: "Sen Media & Events",
        href: "https://senmedia-events.co.ke/",
        image: "/images/senmedia.png",
        role: "Events production and audience engagement",
        description: "Specializing in high-impact media events and civic storytelling that bridges the gap between policy and the public.",
    },
    {
        name: "The Continental Pot",
        href: "https://continentalpot.africa/",
        image: "/images/The-Continental-Pot-Vertical-removebg-preview.png",
        role: "Pan-African civic storytelling and media",
        description: "A leading platform for Pan-African narratives, focusing on governance, equity, and sustainable development across the continent.",
    },
    {
        name: "Colour Twist Media",
        href: "https://colortwistmedia.com/",
        image: "/images/colortwist.png",
        role: "Creative production and digital campaigns",
        description: "Experts in digital creativity, producing compelling visual content that mobilizes youth and simplifies complex fiscal data.",
    },
];

const activities = [
    {
        title: "Simplified Storytelling",
        description: "Translating technical budgets into relatable TikToks, Reels, and Podcasts for mass consumption.",
        icon: Play,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "Grassroots Organizing",
        description: "Establishing university and community chapters to build a nationwide network of budget trackers.",
        icon: Users,
        color: "text-primary",
        bg: "bg-primary/10",
    },
    {
        title: "Impact Monitoring",
        description: "Generating real-time snapshots that compare fiscal promises with actual community delivery.",
        icon: Target,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Verification Hub",
        description: "A shared evidence desk for journalists and youth to fact-check budget claims with data.",
        icon: CheckCircle,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
];

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
                        <SectionBadge title="Consortium of Partners" />
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-6 bg-linear-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                            A Kenya-wide <span className="text-primary">youth-led</span> consortium
                        </h2>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                            BNS is a collaborative force of media, policy, and creative experts turning public finance into a national conversation.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Main Overview Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="md:col-span-12 lg:col-span-8 rounded-[2.5rem] border border-foreground/10 bg-cardbox/50 backdrop-blur-sm p-8 md:p-12 relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-4">The BNS Mission</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                                We help young people understand how budgets shape jobs, healthcare, education, and the cost of living. By combining fiscal analysis with creator-led storytelling, we increase literacy and demand accountability.
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
                                        <span className="mt-3 text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover/partner:text-primary transition-colors">
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
                            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                                <ArrowUpRight className="size-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 leading-tight">National Scale Participation</h3>
                            <p className="text-primary-foreground/80 leading-relaxed">
                                Our consortium reach extends into digital economy governance and equity, scaling through Project TERRA to reach 20k+ youth.
                            </p>
                        </div>
                        <Link 
                            href="/about" 
                            className="mt-8 inline-flex items-center gap-2 font-bold hover:gap-3 transition-all"
                        >
                            Explore Impact Story
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
                                <activity.icon className="size-6" />
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

