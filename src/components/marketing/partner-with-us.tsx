"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { EditorialPill, PillButtonGroup } from "@/components/ui/editorial";
import { SECTION_SHELL_INNER } from "@/layouts/section-shell";
import { cn } from "@/utils";
import {
  Megaphone,
  Shield,
  TrendingUp,
  Handshake,
  Globe,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Megaphone,
  Shield,
  TrendingUp,
  Handshake,
  Globe,
  Users,
};

type PartnerFeature = {
  icon: string;
  title: string;
  description: string;
};

type PartnerLogo = {
  src: string;
  alt: string;
};

type PartnerWithUsProps = {
  variant: "split-image" | "text-only" | "marquee" | "full-width-image";
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: string;
  imageAlt?: string;
  partnerLogos?: PartnerLogo[];
  features?: PartnerFeature[];
  className?: string;
};

function SplitImageVariant(props: PartnerWithUsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-8"
      >
        <motion.div variants={fadeInUp}>
          <EditorialPill>{props.eyebrow}</EditorialPill>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground"
        >
          {props.title}
        </motion.h2>
        {props.description && (
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground leading-relaxed max-w-xl"
          >
            {props.description}
          </motion.p>
        )}
        {props.features && props.features.length > 0 && (
          <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {props.features.map((feature) => {
              const Icon = ICON_MAP[feature.icon] || Megaphone;
              return (
                <div key={feature.title} className="space-y-3">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <h4 className="font-semibold text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </motion.div>
        )}
        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
          {props.primaryCta && (
            <PillButtonGroup
              href={props.primaryCta.href}
              label={props.primaryCta.label}
              variant="primary"
            />
          )}
          {props.secondaryCta && (
            <PillButtonGroup
              href={props.secondaryCta.href}
              label={props.secondaryCta.label}
              variant="outline"
            />
          )}
        </motion.div>
      </motion.div>

      {props.image && (
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden"
        >
          <Image
            src={props.image}
            alt={props.imageAlt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </motion.div>
      )}

      {props.partnerLogos && props.partnerLogos.length > 0 && (
        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-8 mt-8 lg:mt-0"
        >
          {props.partnerLogos.map((logo) => (
            <div key={logo.alt} className="relative h-12 w-32 opacity-60 hover:opacity-100 transition-opacity">
              <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="128px" />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function TextOnlyVariant(props: PartnerWithUsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="max-w-3xl mx-auto text-center space-y-8"
    >
      <motion.div variants={fadeInUp}>
        <EditorialPill>{props.eyebrow}</EditorialPill>
      </motion.div>
      <motion.h2
        variants={fadeInUp}
        className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground"
      >
        {props.title}
      </motion.h2>
      {props.description && (
        <motion.p
          variants={fadeInUp}
          className="text-lg text-muted-foreground leading-relaxed"
        >
          {props.description}
        </motion.p>
      )}
      {props.features && props.features.length > 0 && (
        <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8">
          {props.features.map((feature) => {
            const Icon = ICON_MAP[feature.icon] || Megaphone;
            return (
              <div key={feature.title} className="space-y-4">
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Icon className="size-6 text-primary" />
                </div>
                <h4 className="font-semibold">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </motion.div>
      )}
      <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 pt-4">
        {props.primaryCta && (
          <PillButtonGroup
            href={props.primaryCta.href}
            label={props.primaryCta.label}
            variant="primary"
          />
        )}
        {props.secondaryCta && (
          <PillButtonGroup
            href={props.secondaryCta.href}
            label={props.secondaryCta.label}
            variant="outline"
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function MarqueeVariant(props: PartnerWithUsProps) {
  return (
    <div className="space-y-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="text-center space-y-6"
      >
        <motion.div variants={fadeInUp}>
          <EditorialPill>{props.eyebrow}</EditorialPill>
        </motion.div>
        <motion.h2
          variants={fadeInUp}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground"
        >
          {props.title}
        </motion.h2>
        {props.description && (
          <motion.p
            variants={fadeInUp}
            className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          >
            {props.description}
          </motion.p>
        )}
      </motion.div>

      {props.partnerLogos && props.partnerLogos.length > 0 && (
        <div className="overflow-hidden border-y border-border/50 py-8">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-16 w-max"
          >
            {[...props.partnerLogos, ...props.partnerLogos].map((logo, i) => (
              <div key={`${logo.alt}-${i}`} className="relative h-10 w-28 opacity-50">
                <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="112px" />
              </div>
            ))}
          </motion.div>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-8"
      >
        {props.features?.map((feature) => {
          const Icon = ICON_MAP[feature.icon] || Megaphone;
          return (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              className="text-center space-y-4"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Icon className="size-6 text-primary" />
              </div>
              <h4 className="font-semibold">{feature.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center gap-4"
      >
        {props.primaryCta && (
          <PillButtonGroup
            href={props.primaryCta.href}
            label={props.primaryCta.label}
            variant="primary"
          />
        )}
        {props.secondaryCta && (
          <PillButtonGroup
            href={props.secondaryCta.href}
            label={props.secondaryCta.label}
            variant="outline"
          />
        )}
      </motion.div>
    </div>
  );
}

function FullWidthImageVariant(props: PartnerWithUsProps) {
  return (
    <div className="relative">
      {props.image && (
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src={props.image}
            alt={props.imageAlt || ""}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      )}
      <div className="absolute inset-0 flex items-end">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={cn(SECTION_SHELL_INNER, "pb-12 md:pb-20")}
        >
          <div className="max-w-2xl space-y-6">
            <motion.div variants={fadeInUp}>
              <EditorialPill>{props.eyebrow}</EditorialPill>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white"
            >
              {props.title}
            </motion.h2>
            {props.description && (
              <motion.p
                variants={fadeInUp}
                className="text-lg text-white/80 leading-relaxed"
              >
                {props.description}
              </motion.p>
            )}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              {props.primaryCta && (
                <PillButtonGroup
                  href={props.primaryCta.href}
                  label={props.primaryCta.label}
                  variant="primary"
                />
              )}
              {props.secondaryCta && (
                <PillButtonGroup
                  href={props.secondaryCta.href}
                  label={props.secondaryCta.label}
                  variant="outline"
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const VARIANTS = {
  "split-image": SplitImageVariant,
  "text-only": TextOnlyVariant,
  "marquee": MarqueeVariant,
  "full-width-image": FullWidthImageVariant,
};

export function PartnerWithUsSection({
  variant = "split-image",
  ...props
}: PartnerWithUsProps) {
  const Variant = VARIANTS[variant] || SplitImageVariant;

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground py-16 md:py-24",
        props.className
      )}
      aria-label={props.title}
    >
      <div className={SECTION_SHELL_INNER}>
        <Variant {...props} variant={variant} />
      </div>
    </section>
  );
}
