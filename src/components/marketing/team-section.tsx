"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { team } from "@/data/org";
import { slugifyName } from "@/lib/team";
import { IconBrandLinkedin, IconBrandX, IconBrandInstagram } from "@tabler/icons-react";
import { ArrowUpRight, Mail } from "lucide-react";
import { LANDING_TYPOGRAPHY as T } from "@/constants/landing-typography";
import { SECTION_SHELL_INNER, SECTION_SHELL_PADDING } from "@/layouts/section-shell";
import { GsapReveal, GsapStaggerReveal } from "@/motion/gsap";
import { cn } from "@/utils";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    x?: string;
    instagram?: string;
    email?: string;
  };
}

const SocialIcon = ({ platform, href }: { platform: string; href: string }) => {
  if (platform === "x" || platform === "twitter") return null;
  if (!href || typeof href !== "string" || !href.trim() || href === "#") return null;

  const icons = {
    linkedin: IconBrandLinkedin,
    x: IconBrandX,
    instagram: IconBrandInstagram,
    email: Mail,
  };

  const Icon = icons[platform as keyof typeof icons];
  if (!Icon) return null;

  const trimmed = href.trim();
  const link = platform === "email" && !trimmed.startsWith("mailto:") ? `mailto:${trimmed}` : trimmed;

  return (
    <a
      href={link}
      target={platform === "email" ? undefined : "_blank"}
      rel={platform === "email" ? undefined : "noopener noreferrer"}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-background/10 text-white/90 transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:border-white/40 hover:bg-white/20"
      aria-label={`${platform} profile`}
    >
      <Icon className="size-4" />
    </a>
  );
};

const TeamCard = ({ member }: { member: TeamMember }) => {
  const [imageError, setImageError] = useState(false);
  const username = slugifyName(member.name);

  const initials = member.name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group relative">
      <Link href={`/team/${username}`} className="block">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-xs transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/50 group-hover:shadow-xl">
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center border border-primary/20 bg-primary/10">
                <span className="text-5xl font-bold tracking-wide text-primary">{initials}</span>
              </div>
            ) : (
              <Image
                src={member.image}
                alt={member.name}
                fill
                onError={() => setImageError(true)}
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent/10 transition-opacity duration-300 group-hover:from-black/95 group-hover:via-black/45" />

            <div className="absolute right-4 top-4 z-20 inline-flex -translate-x-2 items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <span>View profile</span>
              <ArrowUpRight className="size-3.5" />
            </div>

            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end p-5 lg:p-6">
              <h3 className="mb-1 text-xl font-bold leading-tight text-white lg:text-2xl">
                {member.name}
              </h3>
              <p className="mb-2 text-sm font-semibold text-primary">{member.role}</p>
              <p className="line-clamp-2 text-xs leading-relaxed text-white/80 transition-colors duration-300 group-hover:text-white/95">
                {member.description}
              </p>

              {member.socials && Object.keys(member.socials).length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  {Object.entries(member.socials).map(([platform, href]) =>
                    href ? <SocialIcon key={platform} platform={platform} href={href} /> : null,
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

const TeamSection = () => {
  return (
    <section
      id="team"
      className={cn(SECTION_SHELL_PADDING, "relative w-full overflow-hidden bg-background")}
    >
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-20%] h-[60%] w-[60%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-teal-500/10 blur-[120px]" />
      </div>

      <div className={SECTION_SHELL_INNER}>
        <GsapReveal className="mx-auto mb-12 max-w-3xl space-y-4 text-center lg:mb-16">
          <span className={T.eyebrow}>Leadership team</span>
          <h2 className={T.sectionTitle}>The team behind the stories</h2>
          <p className={cn(T.lead, "text-foreground/75")}>
            Meet the visionaries driving budget transparency across Kenya
          </p>
        </GsapReveal>

        <GsapStaggerReveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </GsapStaggerReveal>

        <GsapReveal className="mt-12 text-center lg:mt-16">
          <Link
            href="/about#join-us"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 hover:shadow-lg"
          >
            Join our team
            <ArrowUpRight className="size-4" />
          </Link>
        </GsapReveal>
      </div>
    </section>
  );
};

export default TeamSection;
