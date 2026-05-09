"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { motion } from "motion/react";
import { 
    BookOpen, 
    Users, 
    BarChart3, 
    ShieldCheck, 
    ArrowUpRight 
} from "lucide-react";
import { cn } from "@/utils";

const partners = [
    {
        name: "Storytelling",
        role: "Narrative Strategy",
        icon: BookOpen,
        features: ["Civic Briefs", "Impact Stories", "Digital Media"]
    },
    {
        name: "Organizing",
        role: "Community Building",
        icon: Users,
        features: ["Campus Hubs", "Town Halls", "Youth Networks"]
    },
    {
        name: "Monitoring",
        role: "Data Oversight",
        icon: BarChart3,
        features: ["Budget Tracking", "Policy Analysis", "Live Tickers"]
    },
    {
        name: "Verification",
        role: "Truth Protocol",
        icon: ShieldCheck,
        features: ["Fact Checking", "Evidence Desk", "Hansard Audit"]
    }
];

const ConsortiumPartners = () => {
    return (
        <section id="consortium" className="w-full py-40 bg-background relative overflow-hidden">
            <Wrapper>
                <div className="max-w-4xl mb-24">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-8xl font-bold tracking-[-0.05em] leading-[0.9]"
                    >
                        Collective Power.<br />
                        <span className="text-primary italic">Unified Mission.</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {partners.map((partner, idx) => {
                        const Icon = partner.icon;
                        return (
                            <motion.div
                                key={partner.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className={cn(
                                    "group relative overflow-hidden rounded-[2rem] bg-white/[0.03] border border-white/5",
                                    "p-10 flex flex-col h-full hover:border-primary/20 transition-all duration-500"
                                )}
                            >
                                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110">
                                    <Icon className="size-8 text-primary" />
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{partner.name}</h3>
                                    <p className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                                        {partner.role}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    {partner.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-muted-foreground text-sm font-medium">
                                            <div className="size-1.5 rounded-full bg-primary/20" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between group/link cursor-pointer">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 group-hover/link:text-primary transition-colors">
                                        Learn More
                                    </span>
                                    <ArrowUpRight className="size-4 text-foreground/20 group-hover/link:text-primary transition-all" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Wrapper>
        </section>
    );
};

export default ConsortiumPartners;

