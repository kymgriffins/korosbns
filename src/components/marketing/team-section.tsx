"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { team } from "@/data/org";
import { slugifyName } from "@/lib/team";
import { IconBrandLinkedin, IconBrandX, IconBrandInstagram } from "@tabler/icons-react";
import { ArrowUpRight, Mail } from "lucide-react";
import { ease } from "@/motion/variants";
import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/components/ui/section-badge";

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
  const icons = {
    linkedin: IconBrandLinkedin,
    x: IconBrandX,
    instagram: IconBrandInstagram,
    email: Mail,
  };

  const Icon = icons[platform as keyof typeof icons];
  if (!Icon) return null;

  const link = platform === "email" && !href.startsWith("mailto:") ? `mailto:${href}` : href;

  return (
    <motion.a
      href={link}
      target={platform === "email" ? undefined : "_blank"}
      rel={platform === "email" ? undefined : "noopener noreferrer"}
      onClick={(e) => e.stopPropagation()}
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex size-9 items-center justify-center rounded-full bg-background/10 border border-white/20 text-white/90 hover:bg-white/20 hover:border-white/40 transition-all duration-200"
      aria-label={`${platform} profile`}
    >
      <Icon className="size-4" />
    </motion.a>
  );
};

const TeamCard = ({ member, index }: { member: TeamMember; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const username = slugifyName(member.name);

  const initials = member.name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.article
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: ease.expo }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/team/${username}`} className="block">
        <div className="relative rounded-2xl lg:rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-lg">
          {/* Image container with 3:4 aspect ratio */}
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/60 via-primary/40 to-primary/20">
                <span className="text-5xl font-bold tracking-wide text-white/95">
                  {initials}
                </span>
              </div>
            ) : (
              <Image
                src={member.image}
                alt={member.name}
                fill
                onError={() => setImageError(true)}
                className="object-cover object-top transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
            )}

            {/* Gradient overlay */}
            <motion.div
              animate={{ opacity: isHovered ? 0.95 : 0.85 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"
            />

            {/* Hover state: Show description */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25, ease: ease.out }}
                  className="absolute inset-0 flex items-center justify-center p-6 bg-background/90"
                >
                  <p className="text-sm text-white/90 text-center leading-relaxed">
                    {member.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info overlay (always visible) */}
          <div className="absolute bottom-0 inset-x-0 p-5 lg:p-6">
            <motion.div
              animate={{ y: isHovered ? -4 : 0 }}
              transition={{ duration: 0.3, ease: ease.out }}
            >
              <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-white/75 font-medium mb-3">
                {member.role}
              </p>

              {/* Social links */}
              {member.socials && Object.keys(member.socials).length > 0 && (
                <div className="flex items-center gap-2">
                  {Object.entries(member.socials).map(([platform, href]) =>
                    href ? (
                      <SocialIcon key={platform} platform={platform} href={href} />
                    ) : null
                  )}
                </div>
              )}
            </motion.div>

            {/* View profile indicator */}
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/20 border border-white/20 text-white text-xs font-semibold"
            >
              View profile
              <ArrowUpRight className="size-3.5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const TeamSection = () => {
  return (
    <section id="team" className="relative w-full py-16 lg:py-24 bg-background overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.08, 0.12, 0.08] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-teal-500/10 blur-[120px] rounded-full"
        />
      </div>

      <Wrapper>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: ease.expo }}
          >
            <SectionBadge title="Leadership Team" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: ease.expo }}
            className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight mt-6 leading-tight"
          >
            The team behind the stories
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: ease.expo }}
            className="text-base md:text-lg text-muted-foreground mt-4 leading-relaxed"
          >
            Meet the visionaries driving budget transparency across Kenya
          </motion.p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {team.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: ease.expo }}
          className="mt-12 lg:mt-16 text-center"
        >
          <Link
            href="/about#join-us"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            Join our team
            <ArrowUpRight className="size-4" />
          </Link>
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default TeamSection;
