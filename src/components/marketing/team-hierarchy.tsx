"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { team } from "@/constants";
import { getMemberUsername, type TeamMember } from "@/lib/team";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowUpRight,
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
import { useRef, useState } from "react";

const leadershipRoles = new Set(["Team Leader - Strategy", "Research Lead", "Media Lead - Communications", "Executive Director"]);
const advisorRoles = new Set(["Board Advisor"]);

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
    const [imageError, setImageError] = useState(false);
    const initials = member.name
        .split(" ")
        .map((part) => part[0] ?? "")
        .join("")
        .slice(0, 2)
        .toUpperCase();

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
            className="group relative h-[290px] w-[215px] shrink-0 snap-center cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/25 transition-colors hover:border-white/20 sm:h-[315px] sm:w-[230px]"
        >
            {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/60 via-primary/40 to-black/50">
                    <span className="text-3xl font-bold tracking-wide text-white/95">{initials}</span>
                </div>
            ) : (
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    onError={() => setImageError(true)}
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 250px, 280px"
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-3.5">
                <h4 className="truncate text-sm font-semibold text-white">{member.name}</h4>
                <p className="truncate text-[11px] text-white/75 mb-2">{member.role}</p>
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
    const [isDragging, setIsDragging] = useState(false);

    const scrollByCards = (direction: "left" | "right") => {
        const row = rowRef.current;
        if (!row) return;
        const firstCard = row.firstElementChild as HTMLElement | null;
        const gap = 16;
        const cardWidth = firstCard ? firstCard.offsetWidth + gap : 246;
        const delta = direction === "left" ? -cardWidth : cardWidth;
        row.scrollBy({ left: delta, behavior: "smooth" });
    };

    const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        if (!rowRef.current) return;
        setIsDragging(true);
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
        setIsDragging(false);
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
                style={{ cursor: isDragging ? "grabbing" : "default" }}
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
    const previewMembers = sortedMembers.slice(0, 6);

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
                        className="rounded-2xl border border-foreground/10 bg-background/60 p-4 md:p-5"
                    >
                        <TeamCarousel members={previewMembers} />
                    </motion.div>
                    <div className="mt-6 flex justify-center">
                        <Link
                            href="/about#team"
                            className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        >
                            See full team
                            <ArrowUpRight className="size-4" />
                        </Link>
                    </div>
                </div>
            </Wrapper>
        </section>
    );
};

export default TeamHierarchy;

