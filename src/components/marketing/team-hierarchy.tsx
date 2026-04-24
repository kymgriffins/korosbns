"use client";

import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";
import { team } from "@/constants";
import { motion } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Linkedin } from "lucide-react";

type TeamMember = (typeof team)[number];

const leadershipRoles = new Set(["Executive Director"]);
const advisorRoles = new Set(["Board Advisor"]);
const getMemberUsername = (member: TeamMember) =>
    member.socials?.x?.split("/").pop() || member.name.toLowerCase().replace(/\s+/g, "");

const TeamTile = ({ member }: { member: TeamMember }) => {
    const router = useRouter();
    const username = getMemberUsername(member);

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/team/${username}`)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/team/${username}`);
                }
            }}
            className="group block cursor-pointer rounded-2xl border border-foreground/10 bg-cardbox p-4 transition-colors hover:border-primary/30 md:p-5"
        >
            <div className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-foreground/10">
                    <Image src={member.image} alt={member.name} fill className="object-cover object-top" sizes="64px" />
                </div>
                <div className="min-w-0">
                    <h4 className="truncate text-base font-semibold">{member.name}</h4>
                    <p className="truncate text-xs text-muted-foreground">{member.role}</p>
                    <div className="mt-2 flex items-center gap-3">
                        {member.socials?.x && (
                            <a
                                href={member.socials.x}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(event) => event.stopPropagation()}
                                className="text-xs text-foreground/70 hover:text-primary"
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
                                className="text-foreground/70 hover:text-primary"
                            >
                                <Linkedin className="size-3.5" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TeamHierarchy = () => {
    const advisors = team.filter((member) => advisorRoles.has(member.role));
    const leadership = team.filter((member) => leadershipRoles.has(member.role));
    const directors = team.filter((member) => member.role.toLowerCase().includes("director") && !leadershipRoles.has(member.role));
    const operations = team.filter((member) => !advisorRoles.has(member.role) && !leadershipRoles.has(member.role) && !member.role.toLowerCase().includes("director"));

    return (
        <section id="team" className="w-full py-16 lg:py-20 bg-background/40">
            <Wrapper>
                <div className="mx-auto max-w-3xl text-center">
                    <SectionBadge title="Leadership Team" />
                    <h2 className="title mt-6">Team structure built for clarity</h2>
                    <p className="desc mt-4">
                        The same team visuals you liked, now arranged in a clean hierarchy that is smoother on mobile and easier to scan.
                    </p>
                </div>

                <div className="mt-10 space-y-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-foreground/10 bg-background/60 p-4 md:p-6">
                        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Governance</p>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {advisors.map((member) => <TeamTile key={member.name} member={member} />)}
                            {leadership.map((member) => <TeamTile key={member.name} member={member} />)}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} viewport={{ once: true }} className="rounded-3xl border border-foreground/10 bg-background/60 p-4 md:p-6">
                        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Directors</p>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {directors.map((member) => <TeamTile key={member.name} member={member} />)}
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} viewport={{ once: true }} className="rounded-3xl border border-foreground/10 bg-background/60 p-4 md:p-6">
                        <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">Programs and Community</p>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {operations.map((member) => <TeamTile key={member.name} member={member} />)}
                        </div>
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default TeamHierarchy;

