"use client";

import React from 'react';
import { motion } from 'motion/react';
import { team } from '@/constants/team';
import Image from 'next/image';
import Container from '@/components/ui/container';
import { APPLE_EASE } from '@/constants/motion';
import { cn } from '@/utils';
import { Icon } from '@iconify/react';

const teamQuotes: Record<string, string> = {
    "Movine Omondi": "Transparency in the national budget is not just about numbers; it's about the dignity and future of every Kenyan youth.",
    "Peculiar Koros": "Data is the most powerful tool for accountability. When we digitize the budget, we democratize the truth.",
    "Shem Odhiambo Ojunga": "Storytelling bridges the gap between fiscal policy and the people. If the youth don't see themselves in the budget, the budget has failed.",
    "Nelly Maina": "Bringing budget talk to the streets is how we reclaim our voice. Every shilling has a story that needs to be told.",
    "James Maingi Mutinda": "Connecting resources with civic action is how we build a sustainable democracy that works for everyone.",
    "Millicent Makina": "Governance is the backbone of impact. Ensuring our mission aligns with fiscal reality is our greatest responsibility."
};

const GustoTeamSection = () => {
    // Maintain Millicent + James hierarchy
    const sortedTeam = [...team].sort((a, b) => {
        const order = ["Millicent Makina", "James Maingi Mutinda"];
        const aIdx = order.indexOf(a.name);
        const bIdx = order.indexOf(b.name);
        if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
        if (aIdx !== -1) return -1;
        if (bIdx !== -1) return 1;
        return 0;
    });

    return (
        <section className="py-32 md:py-48 bg-background overflow-hidden">
            <Container size="ultra">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: APPLE_EASE }}
                    viewport={{ once: true }}
                    className="mb-32 md:mb-56 text-center"
                >
                    <span className="g-eyebrow text-primary mb-6 block tracking-[0.4em]">The Architects</span>
                    <h2 className="g-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.9] tracking-[-0.03em]">
                        Minds behind <br />
                        <span className="text-primary font-medium">the Kenyan story</span>.
                    </h2>
                </motion.div>

                <div className="space-y-48 md:space-y-72">
                    {sortedTeam.map((member, index) => (
                        <TeamMemberRow
                            key={member.name}
                            member={member}
                            index={index}
                            quote={teamQuotes[member.name]}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
};

const TeamMemberRow = ({ member, index, quote }: { member: any; index: number; quote?: string }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={cn(
            "flex flex-col items-center gap-16 md:gap-32 lg:gap-40",
            isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        )}>
            {/* Image Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 24 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-1/2 lg:w-[45%]"
            >
                <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-muted group shadow-2xl shadow-black/10">
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className={cn(
                            "object-cover grayscale transition-all duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:scale-[1.02]",
                            (member.name === "Peculiar Koros" || member.name === "Millicent Makina" || member.name === "James Maingi Mutinda") ? "object-top" : "object-center"
                        )}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
            </motion.div>

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, x: isEven ? 24 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: APPLE_EASE, delay: 0.3 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-1/2 flex flex-col justify-center"
            >
                <div className="space-y-4 mb-10">
                    <span className="font-mono text-[11px] text-primary font-black uppercase tracking-[0.4em] block">
                        {member.role}
                    </span>
                    <h3 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-[0.9] text-foreground">
                        {member.name}
                    </h3>

                    {/* Social Icons Inline */}
                    <div className="flex gap-4 pt-4">
                        {member.socials?.linkedin && (
                            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-primary transition-colors">
                                <Icon icon="lucide:linkedin" className="w-5 h-5" />
                            </a>
                        )}
                        {member.socials?.x && (
                            <a href={member.socials.x} target="_blank" rel="noopener noreferrer" className="text-foreground/30 hover:text-primary transition-colors">
                                <Icon icon="ri:twitter-x-fill" className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="space-y-10">
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-xl">
                        {member.bio || member.description}
                    </p>

                    {quote && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            viewport={{ once: true }}
                            className="relative pl-10 border-l-2 border-primary/20 py-2"
                        >
                            <p className="text-xl md:text-2xl font-medium tracking-tight text-foreground/80 leading-snug">
                                "{quote}"
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default GustoTeamSection;
