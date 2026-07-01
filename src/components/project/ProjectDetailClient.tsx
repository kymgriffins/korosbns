"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, MapPin, Target, FileText, ExternalLink } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/motion/variants";
import { ProjectTimeline } from "./ProjectTimeline";
import { SectionShell, SectionHeader } from "@/layouts/section-shell";
import { useCohortImages } from "@/hooks/use-marketing";

const projectDetails: Record<string, {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  gallery: string[];
  documents: { name: string; url: string }[];
  objectives: string[];
}> = {
  "budget-literacy": {
    id: "budget-literacy",
    title: "Budget Literacy Programme",
    description: "Interactive learning modules that break down the budget cycle, sector allocations, and parliamentary processes into digestible lessons for all Kenyans.",
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749180/cohort-1_kcmbmm.jpg",
    location: "Nationwide, Kenya",
    gallery: [
      "/images/towwnhallmay/129A3912.jpg",
      "/images/towwnhallmay/129A3863.jpg",
      "/images/towwnhallmay/129A3923.jpg",
    ],
    documents: [
      { name: "Budget Cycle Guide", url: "#" },
      { name: "Sector Allocation Breakdown", url: "#" },
      { name: "Learning Module Catalog", url: "#" },
    ],
    objectives: [
      "Demystify the national budget process for everyday citizens",
      "Provide interactive tools to understand sector allocations",
      "Bridge the gap between policy documents and public understanding",
    ],
  },
  "county-budget-tracking": {
    id: "county-budget-tracking",
    title: "County Budget Tracking",
    description: "Hyper-local budget analysis for all 47 counties, enabling citizens to track development projects and county expenditure in real-time.",
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749200/cohort-2_p9p1yi.jpg",
    location: "All 47 Counties",
    gallery: [
      "/images/towwnhallmay/129A4056.jpg",
      "/images/towwnhallmay/129A4094.jpg",
      "/images/towwnhallmay/129A3912.jpg",
    ],
    documents: [
      { name: "County Budget Toolkit", url: "#" },
      { name: "47 County Allocations Report", url: "#" },
      { name: "Expenditure Tracking Template", url: "#" },
    ],
    objectives: [
      "Enable citizens to monitor county-level budget execution",
      "Provide comparative analysis across all 47 counties",
      "Track development project milestones and expenditure",
    ],
  },
  "public-participation": {
    id: "public-participation",
    title: "Public Participation Hub",
    description: "A centralized platform that notifies citizens about public comment windows and guides them through submitting memoranda on budget and finance bills.",
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749218/cohort-3_ezpn3o.jpg",
    location: "Nairobi & Online",
    gallery: [
      "/images/towwnhallmay/129A3863.jpg",
      "/images/towwnhallmay/129A3923.jpg",
      "/images/towwnhallmay/129A4056.jpg",
    ],
    documents: [
      { name: "Public Participation Guide", url: "#" },
      { name: "Memorandum Template", url: "#" },
      { name: "Finance Bill Summary", url: "#" },
    ],
    objectives: [
      "Notify citizens of upcoming public participation windows",
      "Simplify the memorandum submission process",
      "Increase civic engagement in budget making",
    ],
  },
  "bns-studio": {
    id: "bns-studio",
    title: "BNS Studio",
    description: "Professional videography, photography, and post-production services to fund operations and expand storytelling capacity for civic engagement.",
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749235/cohort-4_j0t3yq.jpg",
    location: "Nairobi, Kenya",
    gallery: [
      "/images/towwnhallmay/129A4094.jpg",
      "/images/towwnhallmay/129A3912.jpg",
      "/images/towwnhallmay/129A3863.jpg",
    ],
    documents: [
      { name: "Studio Rate Card", url: "#" },
      { name: "Portfolio Showcase", url: "#" },
      { name: "Booking Terms", url: "#" },
    ],
    objectives: [
      "Fund civic operations through professional media services",
      "Expand storytelling capacity for budget narratives",
      "Create compelling visual content for civic education",
    ],
  },
  "community-outreach": {
    id: "community-outreach",
    title: "Community Outreach & Workshops",
    description: "On-the-ground civic workshops, townhalls, and community engagements across the country empowering citizens to take action on budget matters.",
    image: "https://res.cloudinary.com/dn8lut2fc/image/upload/v1740749250/cohort-5_h1p5bb.jpg",
    location: "Various Counties",
    gallery: [
      "/images/towwnhallmay/129A3923.jpg",
      "/images/towwnhallmay/129A4056.jpg",
      "/images/towwnhallmay/129A4094.jpg",
    ],
    documents: [
      { name: "Workshop Facilitator Guide", url: "#" },
      { name: "Townhall Report Template", url: "#" },
      { name: "Community Feedback Form", url: "#" },
    ],
    objectives: [
      "Take budget education directly to communities across Kenya",
      "Facilitate townhall discussions on county allocations",
      "Collect citizen feedback to inform budget advocacy",
    ],
  },
};

export function ProjectDetailClient() {
  const params = useParams();
  const id = String(params.id || "");
  const project = projectDetails[id];
  const { data: cohortData } = useCohortImages();
  const cohortImages = cohortData?.images ?? [];

  if (!project) {
    return (
      <SectionShell>
        <div className="max-w-4xl mx-auto text-center py-20">
          <Target className="size-16 mx-auto text-muted-foreground/40 mb-6" />
          <h2 className="text-3xl font-bold mb-3">Project Not Found</h2>
          <p className="text-muted-foreground mb-8">The project you are looking for does not exist.</p>
          <Link
            href="/bns-project"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to all projects
          </Link>
        </div>
      </SectionShell>
    );
  }

  return (
    <>
      {/* Hero */}
      <SectionShell className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
        <div className="relative z-10">
          <Link
            href="/bns-project"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to all projects
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                {project.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border/60 rounded-full px-4 py-2">
                  <MapPin className="size-4 text-primary" />
                  {project.location}
                </span>
                <span className="flex items-center gap-2 text-sm text-muted-foreground bg-card border border-border/60 rounded-full px-4 py-2">
                  <Calendar className="size-4 text-primary" />
                  Ongoing Initiative
                </span>
              </div>

              {/* Objectives */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Objectives</p>
                <ul className="space-y-1.5">
                  {project.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Target className="size-3.5 text-primary shrink-0 mt-0.5" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden border border-border/60">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </SectionShell>

      {/* Timeline */}
      <SectionShell>
        <SectionHeader
          eyebrow="Journey"
          title="Project Timeline"
          description="From inception to scale — the milestones that define our growth."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeInUp}>
            <ProjectTimeline />
          </motion.div>
        </motion.div>
      </SectionShell>

      {/* Gallery */}
      <SectionShell className="bg-muted/30">
        <SectionHeader
          eyebrow="Gallery"
          title="Project in Pictures"
          description="Visual moments from our fieldwork and community engagements."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {[...project.gallery, ...cohortImages.slice(0, 3).map(i => i.src)].slice(0, 6).map((imgSrc, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              custom={i}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/60 bg-card"
            >
              <img
                src={imgSrc}
                alt={`${project.title} gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </motion.div>
      </SectionShell>

      {/* Documentation */}
      <SectionShell>
        <SectionHeader
          eyebrow="Resources"
          title="Documentation & Guides"
          description="Downloadable resources to help you understand and engage with this project."
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {project.documents.map((doc, i) => (
            <motion.div key={i} variants={fadeInUp} custom={i}>
              <a
                href={doc.url}
                className="group flex items-start gap-4 p-5 rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {doc.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    View <ExternalLink className="size-3" />
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </SectionShell>
    </>
  );
}
