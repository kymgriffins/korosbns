"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

const partners = [
    {
        name: "Sen Media & Events",
        href: "https://senmedia-events.co.ke/",
        image: "/images/senmedia.png",
        role: "Events production and audience engagement",
    },
    {
        name: "The Continental Pot",
        href: "https://continentalpot.africa/",
        image: "/images/The-Continental-Pot-Vertical-removebg-preview.png",
        role: "Pan-African civic storytelling and media",
    },
    {
        name: "Colour Twist Media",
        href: "https://colortwistmedia.com/",
        image: "/images/colortwist.png",
        role: "Creative production and digital campaigns",
    },
];

const activities = [
    "Simplifying budgets into TikTok videos, Reels, explainers, and podcasts.",
    "Building youth chapters and training budget organizers in communities and campuses.",
    "Supporting community monitoring snapshots for public accountability.",
    "Strengthening discourse through journalist training and an evidence verification hub.",
];

const ConsortiumPartners = () => {
    return (
        <section id="consortium" className="w-full py-16 lg:py-20">
            <Wrapper>
                <div className="mx-auto max-w-3xl text-center">
                    <SectionBadge title="Consortium of Partners" />
                    <h2 className="title mt-6">A Kenya-wide youth-led consortium</h2>
                    <p className="desc mt-4">
                        Budget Ndio Story translates public budgets into accessible, actionable information to promote civic engagement and accountability across Kenya.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-10 rounded-3xl border border-foreground/10 bg-cardbox p-6 md:p-8"
                >
                    <h3 className="text-xl font-semibold">Overview</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        BNS helps young people understand how budgets shape jobs, healthcare, education, housing, and cost of living, then equips them to participate in fiscal processes with evidence-based insights.
                    </p>
                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {partners.map((partner) => (
                            <Link
                                key={partner.name}
                                href={partner.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group overflow-hidden rounded-2xl border border-foreground/10 bg-background/70 transition-all hover:-translate-y-1 hover:border-primary/40"
                            >
                                <div className="relative h-36 w-full bg-white/70 p-3 dark:bg-muted/30">
                                    <Image
                                        src={partner.image}
                                        alt={`${partner.name} logo`}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-4">
                                    <p className="text-sm font-semibold transition-colors group-hover:text-primary">
                                        {partner.name}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">{partner.role}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 }}
                        className="rounded-3xl border border-foreground/10 bg-background/60 p-6"
                    >
                        <h3 className="text-lg font-semibold">Key Activities</h3>
                        <div className="mt-4 space-y-3">
                            {activities.map((activity, idx) => (
                                <div key={activity} className="flex gap-3">
                                    <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                                        {idx + 1}
                                    </span>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{activity}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.12 }}
                        className="rounded-3xl border border-foreground/10 bg-background/60 p-6"
                    >
                        <h3 className="text-lg font-semibold">Platforms and Impact</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            BNS publishes on YouTube, TikTok, and LinkedIn, while running trainings, tools, and dialogues that deepen youth understanding of fiscal governance.
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            By combining fiscal analysis with creator-led storytelling, BNS increases budget literacy, civic participation, and accountability for better use of public resources.
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Initiatives like Project TERRA extend this work into digital economy governance, equity, and power in taxation and public spending.
                        </p>
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default ConsortiumPartners;

