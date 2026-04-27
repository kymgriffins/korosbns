"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { motion } from "motion/react";
import { CalendarDays, Rocket, Users2 } from "lucide-react";

const projects = [
    {
        title: "Town Halls",
        timeline: "47 Counties",
        summary: "Physical forums in every county where youth interrogate local budget estimates with MPs and MCAs.",
        tags: ["Direct dialogue", "Duty bearers", "Budget estimates"],
    },
    {
        title: "Campus Hubs",
        timeline: "20 Universities",
        summary: "Permanent student chapters dedicated to fiscal analysis, debate, and peer-to-peer education.",
        tags: ["Student leaders", "Fiscal analysis", "Peer education"],
    },
    {
        title: "Budget Verification Hub",
        timeline: "National Scale",
        summary: "A shared desk connecting youth, journalists, and experts to verify fiscal claims with evidence.",
        tags: ["Fact-checking", "Open civic data", "Evidence-based"],
    },
];

const UpcomingProjects = () => {
    return (
        <section id="engagement" className="w-full py-16 lg:py-20">
            <Wrapper>
                <div className="mx-auto max-w-3xl text-center">
                    <SectionBadge title="The Engagement" />
                    <h2 className="title mt-6">From Online Outrage to Offline Action</h2>
                    <p className="desc mt-4">
                        We are building permanent spaces for direct dialogue and peer-to-peer education across the country.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.article
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: index * 0.08 }}
                            className="rounded-2xl border border-foreground/10 bg-cardbox p-6"
                        >
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-foreground/10 px-3 py-1 text-xs text-muted-foreground">
                                <CalendarDays className="size-3.5" />
                                {project.timeline}
                            </div>
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{project.summary}</p>
                            <div className="mt-5 space-y-2">
                                {project.tags.map((tag) => (
                                    <div key={tag} className="flex items-center gap-2 text-xs text-foreground/80">
                                        <Rocket className="size-3.5 text-primary" />
                                        <span>{tag}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.article>
                    ))}
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Users2 className="size-4" />
                    <span>Built with youth leaders, creators, and civic partners</span>
                </div>
            </Wrapper>
        </section>
    );
};

export default UpcomingProjects;

