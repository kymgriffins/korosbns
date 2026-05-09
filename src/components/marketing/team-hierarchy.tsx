"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { team } from "@/constants";
import { getMemberUsername, type TeamMember } from "@/lib/team";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { 
    IconBrandLinkedin, 
    IconBrandX,
    IconBrandInstagram,
} from "@tabler/icons-react";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/utils";

const socialIconMap = {
    x: IconBrandX,
    linkedin: IconBrandLinkedin,
    instagram: IconBrandInstagram,
} as const;

const LeaderCard = ({ member, size = "md" }: { member: TeamMember, size?: "lg" | "md" }) => {
    const [imageError, setImageError] = useState(false);
    const username = getMemberUsername(member);
    const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0A0A0A] transition-all duration-500",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_10px_20px_-5px_rgba(0,0,0,0.1)]",
                "dark:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.5)]",
                "hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_30px_60px_-15px_rgba(0,0,0,0.2)]",
                "dark:hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_40px_80px_-20px_rgba(0,0,0,0.8)]",
                size === "lg" ? "md:col-span-6" : "md:col-span-4"
            )}
        >
            <Link href={`/team/${username}`} className="block h-full">
                <div className={`relative w-full overflow-hidden ${size === "lg" ? "h-[450px]" : "h-[360px]"}`}>
                    {imageError ? (
                        <div className="flex h-full w-full items-center justify-center bg-muted/30">
                            <span className="text-4xl font-bold text-muted-foreground/40">{initials}</span>
                        </div>
                    ) : (
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            onError={() => setImageError(true)}
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-10">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h3 className={cn(
                                "font-bold tracking-tight text-foreground leading-tight mb-1",
                                size === "lg" ? "text-3xl lg:text-4xl" : "text-2xl"
                            )}>
                                {member.name}
                            </h3>
                            <p className="text-primary font-bold text-xs uppercase tracking-widest">
                                {member.role}
                            </p>
                        </div>
                        <div className="size-12 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                            <ArrowUpRight className="size-5" />
                        </div>
                    </div>
                    
                    <p className="mt-6 text-muted-foreground text-base leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {member.description || member.bio?.slice(0, 100) + "..."}
                    </p>

                    <div className="mt-8 flex items-center gap-4">
                        {Object.entries(member.socials || {}).map(([key, href]) => {
                            if (!href) return null;
                            const Icon = socialIconMap[key as keyof typeof socialIconMap];
                            if (!Icon) return null;
                            return (
                                <span 
                                    key={key}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Icon className="size-5" />
                                </span>
                            );
                        })}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const TeamHierarchy = () => {
    // Tier 1: Leadership & Advisors
    const tier1 = team.filter(m => 
        m.role === "Executive Director" || m.role === "Board Advisor"
    );
    
    // Tier 2: Directors
    const tier2 = team.filter(m => 
        m.role.toLowerCase().includes("director") && m.role !== "Executive Director"
    );
    
    // Tier 3: Specialists
    const tier3 = team.filter(m => 
        !m.role.toLowerCase().includes("director") && m.role !== "Board Advisor"
    );

    return (
        <section id="team" className="w-full py-40 bg-background relative overflow-hidden">
            <Wrapper>
                <div className="max-w-4xl mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-8xl font-bold tracking-[-0.05em] leading-[0.9] mb-12">
                            The Collective Expertise.
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
                            A multidisciplinary group of economists, data scientists, and storytellers building the future of civic participation.
                        </p>
                    </motion.div>
                </div>

                <div className="space-y-12">
                    {/* Tier 1: Senior Leadership */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {tier1.map((member, idx) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-6"
                            >
                                <LeaderCard member={member} size="lg" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Tier 2: Directors */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {tier2.map((member, idx) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 + (idx * 0.1), ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-4"
                            >
                                <LeaderCard member={member} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Tier 3: Specialists */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {tier3.map((member, idx) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 + (idx * 0.1), ease: [0.16, 1, 0.3, 1] }}
                                className="md:col-span-4"
                            >
                                <LeaderCard member={member} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                    className="mt-32 flex"
                >
                    <Link
                        href="/about#team"
                        className="h-16 px-10 flex items-center gap-4 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform"
                    >
                        Meet the full collective
                        <ArrowUpRight className="size-5" />
                    </Link>
                </motion.div>
            </Wrapper>
        </section>
    );
};


export default TeamHierarchy;

