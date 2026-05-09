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
        description: "Translating dry fiscal data into stories that move people. Our narrative framework ensures complex budgets become accessible civic knowledge.",
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
        <section id="consortium" className="w-full py-60 bg-background relative overflow-hidden">
            <Wrapper>
                <div className="max-w-4xl mb-32">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl md:text-[9rem] font-bold tracking-[-0.06em] leading-[0.85] mb-12"
                    >
                        Collective <br />
                        <span className="text-primary italic">Power.</span>
                    </motion.h2>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl">
                        A unified mission driven by specialized expertise. We don't just track numbers; we build infrastructure for truth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Lead Partner - High Hierarchy */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="md:col-span-2 rounded-[4rem] bg-primary/5 border border-primary/10 p-16 flex flex-col justify-between group hover:border-primary/30 transition-all duration-700"
                    >
                        <div>
                            <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-12">
                                <BookOpen className="size-10 text-primary" />
                            </div>
                            <h3 className="text-5xl font-bold mb-6 tracking-tight">{partners[0].name}</h3>
                            <p className="text-2xl text-muted-foreground leading-relaxed max-w-xl">
                                {partners[0].description}
                            </p>
                        </div>
                        <div className="mt-20 flex flex-wrap gap-4">
                            {partners[0].features.map(f => (
                                <span key={f} className="px-6 py-2 rounded-full border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest bg-primary/5">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Secondary Partners */}
                    <div className="flex flex-col gap-6">
                        {partners.slice(1).map((partner, idx) => {
                            const Icon = partner.icon;
                            return (
                                <motion.div
                                    key={partner.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    className="flex-1 rounded-[3rem] bg-white/[0.02] border border-white/5 p-10 hover:border-primary/20 transition-all duration-500 group"
                                >
                                    <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary/10 transition-colors">
                                        <Icon className="size-6 text-white group-hover:text-primary transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                                        {partner.role}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </Wrapper>
        </section>
    );
};

export default ConsortiumPartners;

