"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { team } from "@/constants";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Linkedin } from "lucide-react";
import { useRef } from "react";

type TeamMember = (typeof team)[number];

const leadershipRoles = new Set(["Executive Director"]);
const advisorRoles = new Set(["Board Advisor"]);
const getMemberUsername = (member: TeamMember) =>
    member.socials?.x?.split("/").pop() || member.name.toLowerCase().replace(/\s+/g, "");

const TeamTile = ({ member }: { member: TeamMember }) => {
    const router = useRouter();
    const username = getMemberUsername(member);

    return (
        <article
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/team/${username}`)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/team/${username}`);
                }
            }}
            className="group relative h-[340px] w-[250px] shrink-0 snap-center overflow-hidden rounded-2xl border border-white/15 bg-black/30 sm:h-[380px] sm:w-[280px]"
        >
            <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 250px, 280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4">
                <h4 className="truncate text-base font-semibold text-white">{member.name}</h4>
                <p className="truncate text-xs text-white/75">{member.role}</p>
                <div className="mt-2 flex items-center gap-3">
                    {member.socials?.x && (
                        <a
                            href={member.socials.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="text-xs text-white/70 hover:text-white"
                        >
                            X
                        </a>
                    )}
                    {member.socials?.linkedin && (
                        <a
                            href={member.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                            className="text-white/70 hover:text-white"
                        >
                            <Linkedin className="size-3.5" />
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
};

const TeamCarousel = ({ members }: { members: TeamMember[] }) => {
    const rowRef = useRef<HTMLDivElement>(null);

    const scrollByCards = (direction: "left" | "right") => {
        if (!rowRef.current) return;
        const cardWidth = 296;
        const delta = direction === "left" ? -cardWidth : cardWidth;
        rowRef.current.scrollBy({ left: delta, behavior: "smooth" });
    };

    return (
        <div className="relative">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Swipe left or right to explore the team</p>
                <div className="hidden items-center gap-2 md:flex">
                    <button
                        type="button"
                        aria-label="Scroll team left"
                        onClick={() => scrollByCards("left")}
                        className="inline-flex size-8 items-center justify-center rounded-full border border-foreground/15 bg-background/70 hover:border-primary/40"
                    >
                        <ChevronLeft className="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label="Scroll team right"
                        onClick={() => scrollByCards("right")}
                        className="inline-flex size-8 items-center justify-center rounded-full border border-foreground/15 bg-background/70 hover:border-primary/40"
                    >
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
            <div
                ref={rowRef}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]"
            >
                {members.map((member) => (
                    <TeamTile key={member.name} member={member} />
                ))}
            </div>
        </div>
    );
};

const TeamHierarchy = () => {
    const sortedMembers = [
        ...team.filter((member) => advisorRoles.has(member.role)),
        ...team.filter((member) => leadershipRoles.has(member.role)),
        ...team.filter((member) => member.role.toLowerCase().includes("director") && !leadershipRoles.has(member.role)),
        ...team.filter((member) => !advisorRoles.has(member.role) && !leadershipRoles.has(member.role) && !member.role.toLowerCase().includes("director")),
    ];

    return (
        <section id="team" className="w-full py-16 lg:py-20 bg-background/40">
            <Wrapper>
                <div className="mx-auto max-w-3xl text-center">
                    <SectionBadge title="Leadership Team" />
                    <h2 className="title mt-6">Meet the team behind the stories</h2>
                    <p className="desc mt-4">
                        Browse team profiles as a swipeable carousel and tap any card to open full details.
                    </p>
                </div>

                <div className="mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl border border-foreground/10 bg-background/60 p-4 md:p-6"
                    >
                        <TeamCarousel members={sortedMembers} />
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default TeamHierarchy;

