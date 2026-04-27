"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { team } from "@/constants";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    ChevronRight,
    Facebook,
    Github,
    Globe,
    Instagram,
    Linkedin,
    Mail,
    Youtube,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type TeamMember = (typeof team)[number];

const leadershipRoles = new Set(["Team Leader - Strategy", "Research Lead", "Media Lead - Communications", "Executive Director"]);
const advisorRoles = new Set(["Board Advisor"]);
const getMemberUsername = (member: TeamMember) =>
    member.socials?.x?.split("/").pop() || member.name.toLowerCase().replace(/\s+/g, "");

const XLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M18.244 2H21.5l-7.11 8.129L22.75 22h-6.548l-5.126-6.702L5.2 22H1.94l7.605-8.693L1.5 2h6.712l4.633 6.11L18.244 2zm-1.143 18h1.804L7.228 3.893H5.292L17.101 20z" />
    </svg>
);

const socialIconMap = {
    x: XLogo,
    linkedin: Linkedin,
    instagram: Instagram,
    facebook: Facebook,
    youtube: Youtube,
    github: Github,
    website: Globe,
    email: Mail,
} as const;

const iconOrder: Array<keyof typeof socialIconMap> = [
    "x",
    "linkedin",
    "instagram",
    "facebook",
    "youtube",
    "github",
    "website",
    "email",
];

const SocialLinks = ({ member }: { member: TeamMember }) => {
    const socials = (member.socials ?? {}) as Record<string, string | undefined>;

    return (
        <div className="mt-2 flex items-center gap-2">
            {iconOrder.map((key) => {
                const href = socials[key];
                if (!href) return null;
                const Icon = socialIconMap[key];
                const link = key === "email" && !href.startsWith("mailto:") ? `mailto:${href}` : href;

                return (
                    <a
                        key={`${member.name}-${key}`}
                        href={link}
                        target={key === "email" ? undefined : "_blank"}
                        rel={key === "email" ? undefined : "noopener noreferrer"}
                        onClick={(event) => event.stopPropagation()}
                        className="inline-flex size-7 items-center justify-center rounded-full bg-black/35 text-white/80 transition-colors hover:text-white"
                        aria-label={`${member.name} ${key}`}
                    >
                        <Icon className="size-3.5" />
                    </a>
                );
            })}
        </div>
    );
};

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
            <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="truncate text-base font-semibold text-white">{member.name}</h4>
                <p className="truncate text-xs text-white/75 mb-2">{member.role}</p>
                <p className="text-[10px] text-white/60 line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {member.description}
                </p>
                <SocialLinks member={member} />
            </div>
        </article>
    );
};

const TeamCarousel = ({ members }: { members: TeamMember[] }) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const dragStartXRef = useRef(0);
    const dragStartScrollRef = useRef(0);
    const hasDraggedRef = useRef(false);
    const isHoveredRef = useRef(false);
    const isDraggingRef = useRef(false);
    const [isDragging, setIsDragging] = useState(false); // cursor style only

    const loopMembers = useMemo(() => [...members, ...members], [members]);

    const scrollByCards = (direction: "left" | "right") => {
        if (!rowRef.current) return;
        const cardWidth = 296;
        const delta = direction === "left" ? -cardWidth : cardWidth;
        rowRef.current.scrollBy({ left: delta, behavior: "smooth" });
    };

    useEffect(() => {
        const row = rowRef.current;
        if (!row) return;

        const timer = window.setInterval(() => {
            if (isHoveredRef.current || isDraggingRef.current) return;
            row.scrollLeft += 1;
            const halfway = row.scrollWidth / 2;
            if (row.scrollLeft >= halfway) {
                row.scrollLeft -= halfway;
            }
        }, 16);

        return () => window.clearInterval(timer);
    }, []); // ← empty deps: runs once, no teardown on hover/drag

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!rowRef.current) return;
        isDraggingRef.current = true;   // ← ref for interval check
        setIsDragging(true);             // ← state for cursor style
        hasDraggedRef.current = false;
        dragStartXRef.current = event.clientX;
        dragStartScrollRef.current = rowRef.current.scrollLeft;
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging || !rowRef.current) return;
        const delta = event.clientX - dragStartXRef.current;
        if (Math.abs(delta) > 5) {
            hasDraggedRef.current = true;
        }
        rowRef.current.scrollLeft = dragStartScrollRef.current - delta;
    };

    const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        isDraggingRef.current = false;  // ← ref
        setIsDragging(false);            // ← state
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
                onMouseEnter={() => { isHoveredRef.current = true; }}
                onMouseLeave={() => { isHoveredRef.current = false; }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClickCapture={(event) => {
                    if (hasDraggedRef.current) {
                        event.preventDefault();
                        event.stopPropagation();
                        hasDraggedRef.current = false;
                    }
                }}
                className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
                {loopMembers.map((member, index) => (
                    <TeamTile key={`${member.name}-${index}`} member={member} />
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
                    <SectionBadge title="The Architects" />
                    <h2 className="title mt-6">Expertise Meeting Execution</h2>
                    <p className="desc mt-4">
                        A multidisciplinary team of policy experts, researchers, and digital storytellers building the future of civic participation.
                    </p>
                </div>

                <div className="mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-3xl bg-background/60 p-4 md:p-6"
                    >
                        <TeamCarousel members={sortedMembers} />
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default TeamHierarchy;

