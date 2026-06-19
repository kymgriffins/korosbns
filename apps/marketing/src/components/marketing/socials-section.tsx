"use client";

import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import Link from "next/link";
import { useOrg } from "@/contexts/org-context";
import { ExternalLink } from "lucide-react";
import {
  XIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  TikTokIcon,
} from "@/components/ui/social-icons";

const platformDefaults: Record<
  string,
  { icon: React.ReactNode; color: string; handle: string }
> = {
  x: {
    icon: <XIcon className="size-5" />,
    color: "hover:bg-black/10 dark:hover:bg-white/10",
    handle: "@BudgetNdioStory",
  },
  instagram: {
    icon: <InstagramIcon className="size-5" />,
    color: "hover:bg-pink-500/10",
    handle: "@budgetndiostory",
  },
  linkedin: {
    icon: <LinkedInIcon className="size-5" />,
    color: "hover:bg-blue-600/10",
    handle: "Budget Ndio Story",
  },
  youtube: {
    icon: <YouTubeIcon className="size-5" />,
    color: "hover:bg-red-600/10",
    handle: "@BudgetNdioStory",
  },
  tiktok: {
    icon: <TikTokIcon className="size-5" />,
    color: "hover:bg-purple-500/10",
    handle: "@budget.ndio.story",
  },
};

export function SocialsSection() {
  const { config } = useOrg();
  const apiSocials = config.socials || [];

  const platforms = apiSocials.length
    ? apiSocials.map((s) => ({
        platform: s.platform,
        url: s.url,
        label: s.label || s.platform,
        ...platformDefaults[s.platform.toLowerCase()],
      }))
    : Object.entries(platformDefaults).map(([key, val]) => ({
        platform: key,
        url: "#",
        label: val.handle,
        ...val,
      }));

  return (
    <section className="w-full py-16 lg:py-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-10"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-2xl md:text-4xl font-bold font-heading tracking-tight mb-3"
          >
            Follow Us
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-muted-foreground text-sm"
          >
            Stay connected for budget updates, civic education, and Kenya
            finance news.
          </motion.p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {platforms.map((platform, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Link
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center gap-3 p-6 rounded-xl border border-border/60 bg-card transition-all duration-200 group hover:shadow-md ${platform.color || "hover:bg-muted/50"}`}
              >
                <div className="size-12 rounded-full bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {platform.icon}
                </div>
                <div className="text-center">
                  <div className="text-sm font-semibold capitalize">
                    {platform.platform}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {platform.handle}
                  </div>
                </div>
                <span className="text-xs text-primary font-medium group-hover:underline inline-flex items-center gap-1">
                  Follow <ExternalLink className="size-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
