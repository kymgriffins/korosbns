"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { motion } from "motion/react";
import { CalendarDays, Rocket, Users2 } from "lucide-react";

const projects = [
    {
        title: "Project TERRA",
        timeline: "Q3 2026",
        summary: "Exploring fiscal governance in the digital economy, with youth-centered tax justice storytelling.",
        tags: ["Digital economy", "Tax equity", "Research + creators"],
    },
    {
        title: "Campus Budget Chapters",
        timeline: "Rolling 2026",
        summary: "Launching and mentoring student-led chapters that monitor county and national allocations.",
        tags: ["University chapters", "Budget clubs", "Peer organizers"],
    },
    {
        title: "Budget Verification Hub",
        timeline: "Q4 2026",
        summary: "A shared desk connecting youth, journalists, and experts to verify fiscal claims with evidence.",
        tags: ["Journalist support", "Fact-checking", "Open civic data"],
    },
];

const UpcomingProjects = () => {
    return (
        <section id="upcoming-projects" className="w-full py-16 lg:py-20">
            <Wrapper>
                <div className="mx-auto max-w-3xl text-center">
                    <SectionBadge title="Upcoming Projects" />
                    <h2 className="title mt-6">What we are building next</h2>
                    <p className="desc mt-4">
                        New initiatives focused on youth participation, evidence-based accountability, and more accessible public finance conversations.
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

