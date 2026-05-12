"use client";

import React from 'react';
import { motion } from 'motion/react';
import { team } from '@/constants/team';
import Image from 'next/image';
import Link from 'next/link';
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
        <section className="py-24 md:py-40 bg-background overflow-hidden">
            <Container size="ultra">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: APPLE_EASE }}
                    viewport={{ once: true }}
                    className="mb-16 md:mb-32 text-center"
                >
                    <span className="g-eyebrow text-primary mb-6 block tracking-[0.4em]">The Architects</span>
                    <h2 className="g-display text-foreground">
                        Minds behind <br />
                        <span className="text-primary font-medium">the story</span>.
                    </h2>
                </motion.div>

                <div className="space-y-32 md:space-y-64">
                    {sortedTeam.slice(0, 6).map((member, index) => (
                        <div key={member.name} className={cn(index >= 2 && "hidden md:block")}>
                            <TeamMemberRow
                                member={member}
                                index={index}
                                quote={teamQuotes[member.name]}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Team Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-20 text-center md:hidden"
                >
                    <Link href="/team" className="g-mono text-[10px] tracking-[0.3em] uppercase text-primary/60 hover:text-primary transition-colors">
                        View full collective —
                    </Link>
                </motion.div>
            </Container>
        </section>
    );
};

const TeamMemberRow = ({ member, index, quote }: { member: any; index: number; quote?: string }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={cn(
            "flex flex-col items-center gap-12 md:gap-24 lg:gap-32",
            isEven ? 'md:flex-row' : 'md:flex-row-reverse'
        )}>
            {/* Image Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-1/2 lg:w-[42%]"
            >
                <div className="relative aspect-[4/5] rounded-[32px] md:rounded-[48px] overflow-hidden bg-muted group max-w-[320px] mx-auto md:max-w-none">
                    <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className={cn(
                            "object-cover grayscale transition-all duration-[2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grayscale-0 group-hover:scale-[1.05] object-top"
                        )}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>
            </motion.div>

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: APPLE_EASE, delay: 0.2 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-1/2 flex flex-col justify-center text-center md:text-left"
            >
                <div className="space-y-1 mb-4">
                    <span className="g-mono text-primary font-black tracking-[0.4em] block">
                        {member.role}
                    </span>
                    <h3 className="g-headline text-foreground">
                        {member.name}
                    </h3>

                    {/* Social Icons Inline */}
                    <div className="flex gap-4 pt-2 justify-center md:justify-start">
                        {member.socials?.linkedin && (
                            <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-primary transition-colors">
                                <Icon icon="lucide:linkedin" className="w-4 h-4" />
                            </a>
                        )}
                        {member.socials?.x && (
                            <a href={member.socials.x} target="_blank" rel="noopener noreferrer" className="text-foreground/20 hover:text-primary transition-colors">
                                <Icon icon="ri:twitter-x-fill" className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="g-text text-foreground/70 max-w-xl mx-auto md:mx-0 line-clamp-3 md:line-clamp-none text-[16px] md:text-[18px]">
                        {member.bio || member.description}
                    </p>

                    {quote && (
                        <motion.div
                            initial={{ opacity: 0, x: isEven ? 10 : -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className={cn(
                                "relative pl-6 border-l border-primary/20 py-1 hidden md:block",
                                !isEven && "md:pl-0 md:pr-6 md:border-l-0 md:border-r md:text-right"
                            )}
                        >
                            <p className="text-[18px] font-medium tracking-tight text-foreground/90 leading-tight">
                                &ldquo;{quote}&rdquo;
                            </p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default GustoTeamSection;
