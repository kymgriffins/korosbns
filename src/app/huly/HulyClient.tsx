"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { 
  Play, 
  X, 
  ArrowRight, 
  ChevronRight, 
  Activity, 
  Folder, 
  Users, 
  Video,
  FileText,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  Database,
  ExternalLink,
  Info,
  Clock,
  Send,
  Sliders,
  Check,
  Zap,
  Globe
} from "lucide-react";
import { team } from "@/constants/team";

// Huly Theme Styles - Derived exactly from hulyDESIGN.md
const stylesText = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap');

.huly-canvas {
  --color-pitch-black: #090a0c;
  --color-charcoal-grey: #111111;
  --color-shadow-ink: #303236;
  --color-ash-cloud: #4a4b50;
  --color-storm-grey: #61656b;
  --color-battleship-grey: #95979e;
  --color-silver-mist: #a9a9aa;
  --color-cloud-burst: #d1d1d1;
  --color-canvas-white: #ffffff;
  --color-electric-blue: #5683da;
  --color-sunset-orange: #ff8964;
  --gradient-warm-ivory-gradient: linear-gradient(103.7deg, rgba(188, 155, 143, 0.05) 38.66%, rgba(233, 132, 99, 0.06) 68.55%, rgba(233, 132, 99, 0.1) 85.01%, rgba(255, 255, 255, 0.15) 92.12%);
  --gradient-peach-bloom-gradient: linear-gradient(90deg, rgb(255, 235, 164) 50%, rgba(0, 0, 0, 0) 50%);

  --font-esbuild: 'Montserrat', sans-serif;
  --font-inter: 'Inter', sans-serif;

  --shadow-md: rgba(0, 0, 0, 0.35) 0px 4px 16px 0px;
  --shadow-subtle: rgba(255, 255, 255, 0.4) 0px 0px 0px 6px;
  --shadow-sm: rgba(0, 0, 0, 0.15) 0px 4px 6px 0px;
  --shadow-xl: rgba(0, 0, 0, 0.5) 0px 6px 25px 0px;

  background-color: var(--color-pitch-black);
  color: var(--color-canvas-white);
  font-family: var(--font-inter);
  min-height: 100vh;
}

/* Custom Scrollbar */
.huly-canvas ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.huly-canvas ::-webkit-scrollbar-track {
  background: var(--color-pitch-black);
}
.huly-canvas ::-webkit-scrollbar-thumb {
  background: var(--color-shadow-ink);
  border-radius: 9999px;
}
.huly-canvas ::-webkit-scrollbar-thumb:hover {
  background: var(--color-ash-cloud);
}

.font-esbuild {
  font-family: var(--font-esbuild);
}
.font-inter {
  font-family: var(--font-inter);
}

/* Heading scales from Huly specs */
.text-huly-caption {
  font-size: 10px;
  line-height: 1.5;
  letter-spacing: -0.4px;
}
.text-huly-body-lg {
  font-size: 14px;
  line-height: 1.5;
  letter-spacing: -0.56px;
}
.text-huly-heading-sm {
  font-size: 22px;
  line-height: 1.25;
  letter-spacing: -0.44px;
}
.text-huly-heading {
  font-size: 28px;
  line-height: 1.0;
  letter-spacing: -1.4px;
}
.text-huly-heading-lg {
  font-size: 32px;
  line-height: 0.9;
  letter-spacing: -1.6px;
}
.text-huly-display {
  font-size: clamp(2.5rem, 7vw, 80px);
  line-height: 0.8;
  letter-spacing: -4px;
}

/* Buttons */
.btn-huly-primary {
  background-color: var(--color-electric-blue);
  color: var(--color-canvas-white);
  border-radius: 4px;
  padding: 0 16px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border: none;
}
.btn-huly-primary:hover {
  opacity: 0.95;
  box-shadow: 0 0 15px rgba(86, 131, 218, 0.4);
  transform: translateY(-1px);
}

.btn-huly-ghost {
  background: transparent;
  color: var(--color-canvas-white);
  border: 1px solid var(--color-canvas-white);
  border-radius: 0px;
  padding: 0 16px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}
.btn-huly-ghost:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.btn-huly-pill {
  background-color: var(--color-cloud-burst);
  color: var(--color-shadow-ink);
  border-radius: 9999px;
  padding: 0 64px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-inter);
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
}
.btn-huly-pill:hover {
  background-color: var(--color-canvas-white);
}

.nav-huly-link {
  background: transparent;
  color: var(--color-shadow-ink);
  border: 1px solid var(--color-shadow-ink);
  border-radius: 0px;
  padding: 8px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-inter);
  font-weight: 500;
  font-size: 13px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}
.nav-huly-link:hover {
  color: var(--color-canvas-white);
  border-color: var(--color-canvas-white);
}

/* Card classes */
.card-huly-standard {
  background-color: var(--color-charcoal-grey);
  border-radius: 12px;
  border: 1px solid var(--color-shadow-ink);
  padding: 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-huly-standard:hover {
  border-color: var(--color-storm-grey);
}

.card-huly-elevated {
  background-color: var(--color-charcoal-grey);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-ash-cloud);
  padding: 20px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-huly-elevated:hover {
  box-shadow: var(--shadow-xl);
  border-color: var(--color-silver-mist);
}

.list-huly-accent {
  background-color: var(--color-charcoal-grey);
  border-radius: 30px;
  box-shadow: var(--shadow-subtle);
  border: 1px solid var(--color-shadow-ink);
  padding: 16px 24px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.list-huly-accent:hover {
  box-shadow: rgba(255, 255, 255, 0.6) 0px 0px 0px 8px;
}

/* Glowing Radial Accents */
.huly-glow-orange {
  position: absolute;
  width: 450px;
  height: 450px;
  background: radial-gradient(circle, rgba(255, 137, 100, 0.08) 0%, rgba(255, 137, 100, 0) 70%);
  filter: blur(40px);
  pointer-events: none;
}
.huly-glow-blue {
  position: absolute;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(86, 131, 218, 0.08) 0%, rgba(86, 131, 218, 0) 70%);
  filter: blur(40px);
  pointer-events: none;
}
.huly-glow-mesh {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(at 0% 0%, rgba(255, 137, 100, 0.06) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(86, 131, 218, 0.06) 0px, transparent 50%);
  pointer-events: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Custom interactive workspace elements */
.workspace-container {
  border: 1px solid var(--color-shadow-ink);
  border-radius: 12px;
  background-color: #0b0c0f;
  box-shadow: rgba(0, 0, 0, 0.6) 0px 24px 80px;
  overflow: hidden;
}

.workspace-sidebar {
  border-right: 1px solid var(--color-shadow-ink);
  background-color: #0f1013;
}

.workspace-header {
  border-bottom: 1px solid var(--color-shadow-ink);
  background-color: #0f1013;
}

.tab-active {
  background-color: var(--color-charcoal-grey);
  border-left: 2px solid var(--color-electric-blue);
  color: var(--color-canvas-white);
}

.glass-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
`;

interface CloudinaryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface YouTubeVideo {
  id: string;
  title: string;
  published: string;
  thumbnail: string;
}

export default function HulyClient() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [isVideosLoading, setIsVideosLoading] = useState(true);
  
  // Interactive product demo state
  const [workspaceTab, setWorkspaceTab] = useState<"tasks" | "sprint" | "budget" | "team">("tasks");
  const [completedDemoTasks, setCompletedDemoTasks] = useState<number[]>([1]);
  const [emailInput, setEmailInput] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Local beautiful fallbacks derived from real BNS assets
  const fallbackImages: CloudinaryImage[] = [
    {
      src: "/images/towwnhallmay/129A3912.jpg",
      alt: "Civic Deliberation Townhall",
      width: 800,
      height: 600,
    },
    {
      src: "/images/towwnhallmay/129A3863.jpg",
      alt: "Youth Engagement Spotlight",
      width: 800,
      height: 600,
    },
    {
      src: "/images/towwnhallmay/129A3923.jpg",
      alt: "Public Budget Presentation Assembly",
      width: 800,
      height: 600,
    },
    {
      src: "/images/towwnhallmay/129A4056.jpg",
      alt: "County Accountability Workshop",
      width: 800,
      height: 600,
    },
    {
      src: "/images/towwnhallmay/129A4094.jpg",
      alt: "Collective Consensus Gathering",
      width: 800,
      height: 600,
    }
  ];

  const fallbackVideos: YouTubeVideo[] = [
    { 
      id: "A_EXLueEMlk", 
      title: "Introduction to Budget Ndio Story", 
      published: "2026-05-18T13:23:51Z",
      thumbnail: "https://img.youtube.com/vi/A_EXLueEMlk/mqdefault.jpg"
    },
    { 
      id: "jLZe3iPSMfc", 
      title: "BETA Agenda Pillars Explained", 
      published: "2026-05-18T13:23:51Z",
      thumbnail: "https://img.youtube.com/vi/jLZe3iPSMfc/mqdefault.jpg"
    },
    { 
      id: "KeNCrx6krl0", 
      title: "Budget Numbers Deep Dive - National & County Splits", 
      published: "2026-05-18T13:23:51Z",
      thumbnail: "https://img.youtube.com/vi/KeNCrx6krl0/mqdefault.jpg"
    },
    { 
      id: "SfPwtqUFyj4", 
      title: "Fiscal Risks Analysis - Critical State Variables", 
      published: "2026-05-18T13:23:51Z",
      thumbnail: "https://img.youtube.com/vi/SfPwtqUFyj4/mqdefault.jpg"
    }
  ];

  // Fetch YouTube feed and Cloudinary cohort pictures dynamically on load
  useEffect(() => {
    async function loadDynamicAssets() {
      // 1. Fetch Cloudinary images
      try {
        const res = await fetch("/api/images/cohort");
        if (res.ok) {
          const data = await res.json();
          if (data.images && data.images.length > 0) {
            setCloudinaryImages(data.images);
          } else {
            setCloudinaryImages(fallbackImages);
          }
        } else {
          setCloudinaryImages(fallbackImages);
        }
      } catch (error) {
        console.error("Failed to load Cloudinary images", error);
        setCloudinaryImages(fallbackImages);
      } finally {
        setIsImagesLoading(false);
      }

      // 2. Fetch YouTube RSS Feed
      try {
        const res = await fetch("/api/youtube");
        if (res.ok) {
          const data = await res.json();
          if (data.videos && data.videos.length > 0) {
            setYoutubeVideos(data.videos);
          } else {
            setYoutubeVideos(fallbackVideos);
          }
        } else {
          setYoutubeVideos(fallbackVideos);
        }
      } catch (error) {
        console.error("Failed to load YouTube videos", error);
        setYoutubeVideos(fallbackVideos);
      } finally {
        setIsVideosLoading(false);
      }
    }

    loadDynamicAssets();
  }, []);

  // Handle newsletter capture
  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setNewsletterStatus("loading");
    
    setTimeout(() => {
      setNewsletterStatus("success");
      setEmailInput("");
      
      // Reset back to idle after a delay
      setTimeout(() => setNewsletterStatus("idle"), 6000);
    }, 1500);
  };

  const toggleDemoTask = (id: number) => {
    if (completedDemoTasks.includes(id)) {
      setCompletedDemoTasks(completedDemoTasks.filter(item => item !== id));
    } else {
      setCompletedDemoTasks([...completedDemoTasks, id]);
    }
  };

  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="huly-canvas w-full min-h-screen relative overflow-x-hidden selection:bg-[#5683da]/20 select-none">
      <style dangerouslySetInnerHTML={{ __html: stylesText }} />
      <div className="huly-glow-mesh" />

      {/* ── STICKY NAVIGATION BAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090a0c]/80 backdrop-blur-lg border-b border-[#303236]/30 py-3.5 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-esbuild text-xl md:text-2xl font-bold tracking-[-0.05em] text-white cursor-pointer select-none"
          >
            HULY <span className="text-[var(--color-electric-blue)] font-light font-sans text-lg">×</span> BNS
          </span>
          <span className="text-[9px] font-inter font-medium tracking-[0.12em] px-2.5 py-0.5 border border-[#303236] rounded-full bg-[#111111] uppercase text-[var(--color-silver-mist)]">
            Command Center
          </span>
        </div>

        {/* Center Navigation Links (Styled exactly according to hulyDESIGN.md) */}
        <div className="hidden md:flex items-center gap-4">
          {[
            { name: "Workspace", target: "workspace" },
            { name: "Civic Agenda", target: "agenda" },
            { name: "Broadcasts", target: "broadcasts" },
            { name: "Cohort Record", target: "gallery" },
            { name: "Narrative Team", target: "team" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => smoothScrollTo(item.target)}
              className="nav-huly-link uppercase tracking-wider text-[11px]"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Call to Action Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => smoothScrollTo("newsletter")}
            className="btn-huly-primary"
          >
            Enter Console
          </button>
        </div>
      </nav>

      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-36 px-6 md:px-12 max-w-[1280px] mx-auto flex flex-col items-center text-center overflow-hidden">
        {/* Glow Spheres */}
        <div className="huly-glow-orange top-12 left-10 opacity-60" />
        <div className="huly-glow-blue top-24 right-10 opacity-60" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] border border-[#303236] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-sunset-orange)]" />
          <span className="text-[10px] font-inter uppercase tracking-[0.15em] text-[var(--color-battleship-grey)]">
            Open-Source Civic Operating System
          </span>
        </div>

        {/* Display headline using Montserrat with negative letter spacing and tight line height */}
        <h1 className="font-esbuild text-white text-[clamp(2.4rem,8.5vw,84px)] font-semibold tracking-[-0.04em] leading-[0.85] max-w-5xl text-balance">
          Everything App <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[var(--color-sunset-orange)]">
            For Your Civic Teams.
          </span>
        </h1>

        {/* Description body with Inter and negative letter spacing */}
        <p className="font-inter text-[var(--color-battleship-grey)] text-[15px] md:text-[18px] font-light tracking-[-0.015em] leading-[1.5] max-w-2xl mt-8 text-balance">
          Huly, an open-source platform designed to orchestrate high-precision public finance research, visual media delivery, and county accountability records. Redefine youth coordination from Nairobi to Mombasa.
        </p>

        {/* Hero Interactive Call to Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <button 
            onClick={() => smoothScrollTo("workspace")}
            className="btn-huly-primary flex items-center gap-2 group"
          >
            Launch Command Center
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button 
            onClick={() => smoothScrollTo("broadcasts")}
            className="btn-huly-ghost"
          >
            Watch Broadcast Feeds
          </button>
        </div>

        {/* ── INTERACTIVE WORKSPACE SCREENSHOWCASE (A HIGH-TECH SIMULATION OF HULY WORKSPACE) ── */}
        <div id="workspace" className="w-full max-w-[1100px] mt-20 relative z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-[#090a0c] via-transparent to-transparent z-10 pointer-events-none h-20 bottom-0" />
          
          {/* Glowing frame */}
          <div className="workspace-container text-left flex flex-col md:flex-row h-[550px] md:h-[600px] w-full">
            
            {/* Simulation Left Navigation Panel */}
            <div className="workspace-sidebar w-full md:w-64 flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-[#303236] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[var(--color-electric-blue)] flex items-center justify-center font-esbuild text-xs font-bold text-white">
                    H
                  </div>
                  <span className="font-esbuild font-bold text-[13px] tracking-wider text-white">
                    BNS PORTAL
                  </span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Sidebar Tabs */}
              <div className="flex-1 py-4 flex flex-col gap-1 px-2">
                {[
                  { id: "tasks", label: "Active Pipelines", icon: LayoutDashboard },
                  { id: "sprint", label: "Milestones", icon: Calendar },
                  { id: "budget", label: "Public Ledger Audit", icon: TrendingUp },
                  { id: "team", label: "Cohort Sync", icon: Users }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = workspaceTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setWorkspaceTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[12px] font-medium tracking-wide transition-all uppercase ${
                        isActive 
                          ? "bg-[#111111] text-white border-l-2 border-[var(--color-electric-blue)]" 
                          : "text-[var(--color-battleship-grey)] hover:bg-[#111111]/40 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-[var(--color-electric-blue)]" : "text-[var(--color-storm-grey)]"}`} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Console Info */}
              <div className="p-4 border-t border-[#303236] bg-[#090a0c]/40 text-[10px] text-[var(--color-storm-grey)] flex flex-col gap-1.5 font-mono">
                <div>SYSTEM STATUS: ACTIVE</div>
                <div>RSS INGESTION: DYNAMIC</div>
                <div>MEDIA SERVER: CLOUDINARY</div>
              </div>
            </div>

            {/* Simulation Main Viewport */}
            <div className="flex-1 flex flex-col bg-[#090a0c] overflow-y-auto p-6 relative">
              <div className="huly-glow-orange top-0 right-0 opacity-30" />
              
              {/* Header inside simulated browser */}
              <div className="workspace-header flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-6 border-b border-[#303236]">
                <div>
                  <h3 className="font-esbuild text-white text-lg font-bold tracking-tight uppercase">
                    {workspaceTab === "tasks" && "National & County Issue Board"}
                    {workspaceTab === "sprint" && "Fiscal Year Milestones"}
                    {workspaceTab === "budget" && "KSh 3.7T National Ledger Breakdown"}
                    {workspaceTab === "team" && "Dynamic Field Collaborators"}
                  </h3>
                  <p className="text-[11px] text-[var(--color-battleship-grey)] mt-0.5">
                    {workspaceTab === "tasks" && "Track tasks, verification processes, and real-time civic publications."}
                    {workspaceTab === "sprint" && "Critical delivery schedules matching public hearings and budget cycles."}
                    {workspaceTab === "budget" && "Interactive audit logs mapping allocations against developmental output."}
                    {workspaceTab === "team" && "Active researchers uploading community verification records directly."}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[var(--color-silver-mist)]">
                  <span className="glass-pill">
                    <Activity className="w-3.5 h-3.5 text-[var(--color-sunset-orange)] animate-pulse" />
                    LIVE SESSION
                  </span>
                </div>
              </div>

              {/* Interactive simulated tabs content */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  
                  {/* TAB 1: ACTIVE PIPELINES */}
                  {workspaceTab === "tasks" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="card-huly-standard border-[#303236]/80 p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-center pb-2 border-b border-[#303236]/50">
                          <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--color-sunset-orange)] flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> IN RESEARCH
                          </span>
                          <span className="text-[10px] text-[var(--color-storm-grey)] font-mono">BNS-104</span>
                        </div>
                        <h4 className="font-esbuild text-[14px] font-semibold text-white tracking-tight leading-snug">
                          Translate the FY 2026/27 Budget Policy Statement
                        </h4>
                        <p className="text-[12px] text-[var(--color-battleship-grey)] font-light leading-relaxed">
                          Extract and cross-examine deep-dive numbers on the national deficit allocations to county government packages.
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-zinc-800 border border-[#303236] overflow-hidden relative">
                              <Image src="/images/avatars/team/Movine Omondi_HeadShot.jpg" alt="Movine" fill className="object-cover" />
                            </div>
                            <span className="text-[11px] text-white">Movine Omondi</span>
                          </div>
                          <span className="text-[10px] font-inter py-0.5 px-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full font-medium">
                            PRIORITY
                          </span>
                        </div>
                      </div>

                      <div className="card-huly-standard border-[#303236]/80 p-5 flex flex-col gap-3">
                        <div className="flex justify-between items-center pb-2 border-b border-[#303236]/50">
                          <span className="text-[11px] uppercase font-bold tracking-widest text-[var(--color-electric-blue)] flex items-center gap-1.5">
                            <Activity className="w-3 h-3" /> VERIFICATION
                          </span>
                          <span className="text-[10px] text-[var(--color-storm-grey)] font-mono">BNS-109</span>
                        </div>
                        <h4 className="font-esbuild text-[14px] font-semibold text-white tracking-tight leading-snug">
                          Mombasa Townhall Ingestion & Media Pipeline
                        </h4>
                        <p className="text-[12px] text-[var(--color-battleship-grey)] font-light leading-relaxed">
                          Audit, format, and push civic testimony clips from Mombasa regional assembly to the YouTube and Cloudinary content hubs.
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-zinc-800 border border-[#303236] overflow-hidden relative">
                              <Image src="/images/avatars/team/Shem Odhiambo Ojunga.jpeg" alt="Shem" fill className="object-cover" />
                            </div>
                            <span className="text-[11px] text-white">Shem Ojunga</span>
                          </div>
                          <span className="text-[10px] font-inter py-0.5 px-2 bg-[#5683da]/10 border border-[#5683da]/20 text-[var(--color-electric-blue)] rounded-full font-medium">
                            IN REVIEW
                          </span>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2 card-huly-elevated p-4 border-[var(--color-electric-blue)]/40 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> SYSTEM RECONCILIATION
                          </span>
                          <span className="text-[10px] text-[var(--color-storm-grey)] font-mono">STABLE</span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex flex-col">
                            <span className="text-[13px] font-medium text-white">Cloudinary media asset delivery and YouTube RSS validation</span>
                            <span className="text-[11px] text-[var(--color-battleship-grey)] mt-0.5">Automated cron loops validating storage and stream endpoints are 100% active.</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] py-1 px-3.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                            <Check className="w-3 h-3" /> VERIFIED
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 2: SPRINT PLANNING */}
                  {workspaceTab === "sprint" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      {[
                        { title: "National Assembly Budget Public Hearings Q2", date: "June 05, 2026", progress: 85, lead: "Movine Omondi", badge: "Milestone" },
                        { title: "Mtaani Budget Roadshow: Mombasa & Nakuru", date: "June 20, 2026", progress: 40, lead: "Nelly Maina", badge: "Outreach" },
                        { title: "Civic Ledger Platform API Integration", date: "July 12, 2026", progress: 10, lead: "Peculiar Koros", badge: "Technical" }
                      ].map((item, index) => (
                        <div key={index} className="card-huly-standard p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-mono text-[var(--color-sunset-orange)] uppercase tracking-wider">{item.badge}</span>
                            <h4 className="font-esbuild text-[15px] font-semibold text-white mt-1">{item.title}</h4>
                            <span className="text-[11px] text-[var(--color-battleship-grey)] mt-1 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[var(--color-storm-grey)]" /> Target Date: {item.date}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-2 min-w-[200px]">
                            <div className="flex justify-between w-full text-[11px] font-mono text-[var(--color-battleship-grey)]">
                              <span>PROPORTIONAL SYNC</span>
                              <span className="text-white font-medium">{item.progress}%</span>
                            </div>
                            <div className="w-full bg-[#303236]/35 rounded-full h-1.5 overflow-hidden border border-[#303236]/50">
                              <div 
                                className="h-full bg-gradient-to-r from-[var(--color-electric-blue)] to-[var(--color-sunset-orange)] transition-all duration-1000" 
                                style={{ width: `${item.progress}%` }} 
                              />
                            </div>
                            <span className="text-[10px] text-[var(--color-silver-mist)] uppercase tracking-widest mt-0.5">LEAD: {item.lead}</span>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* TAB 3: BUDGET LEDGER */}
                  {workspaceTab === "budget" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: "Debt Repayment Split", value: "32%", amount: "KSh 1.18 Trillion", status: "CRITICAL LOAD", color: "text-[var(--color-sunset-orange)]" },
                          { title: "County Allocations", value: "11.2%", amount: "KSh 415 Billion", status: "UNDER DEBATE", color: "text-[var(--color-electric-blue)]" },
                          { title: "Development Package", value: "19.5%", amount: "KSh 720 Billion", status: "STAGNANT GAP", color: "text-amber-400" }
                        ].map((stat, idx) => (
                          <div key={idx} className="card-huly-standard p-4 flex flex-col justify-between">
                            <span className="text-[10px] font-mono text-[var(--color-silver-mist)] uppercase tracking-widest">{stat.title}</span>
                            <div className="my-3">
                              <span className="font-esbuild text-3xl font-bold tracking-tight text-white">{stat.value}</span>
                              <p className="text-[12px] text-[var(--color-battleship-grey)] mt-0.5">{stat.amount}</p>
                            </div>
                            <span className={`text-[9px] font-bold tracking-wider uppercase ${stat.color}`}>{stat.status}</span>
                          </div>
                        ))}
                      </div>

                      <div className="card-huly-elevated p-4 flex flex-col gap-3">
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">Interactive Audit Stream</span>
                        <div className="flex flex-col gap-2.5">
                          {[
                            { action: "Peculiar Koros synchronized Mombasa Audit Trail", time: "2 hours ago", size: "234KB" },
                            { action: "Millicent Makina updated Executive Advisory Report", time: "5 hours ago", size: "1.2MB" }
                          ].map((log, lIdx) => (
                            <div key={lIdx} className="flex justify-between items-center py-2 border-b border-[#303236]/30 text-[12px] text-[var(--color-battleship-grey)]">
                              <span className="flex items-center gap-2">
                                <Database className="w-3.5 h-3.5 text-[var(--color-storm-grey)]" />
                                {log.action}
                              </span>
                              <div className="flex items-center gap-3 text-[10px] font-mono text-[var(--color-storm-grey)]">
                                <span>{log.time}</span>
                                <span className="px-1.5 py-0.5 bg-[#303236]/40 rounded border border-[#303236]">{log.size}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* TAB 4: COHORT SYNC */}
                  {workspaceTab === "team" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {team.slice(0, 4).map((member, mIdx) => (
                        <div key={mIdx} className="card-huly-standard p-4 flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#303236]/80 flex-shrink-0 relative">
                            <Image src={member.image} alt={member.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="font-esbuild text-[14px] font-semibold text-white tracking-tight">{member.name}</h4>
                            <p className="text-[11px] text-[var(--color-electric-blue)] uppercase font-semibold mt-0.5 tracking-wider">{member.role}</p>
                            <p className="text-[11px] text-[var(--color-battleship-grey)] mt-1.5 line-clamp-1 font-light">{member.description}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

      </section>

      {/* ── 2. MANIFESTO / CIVIC AGENDA SECTION ── */}
      <section id="agenda" className="relative py-24 md:py-36 bg-[#111111]/40 border-y border-[#303236]/20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-6 flex flex-col gap-6">
            <span className="text-[10px] font-inter font-bold tracking-[0.2em] text-[var(--color-sunset-orange)] uppercase">
              01 // The Narrative Architecture
            </span>
            
            <h2 className="font-esbuild text-white text-[32px] md:text-[52px] font-semibold tracking-[-0.03em] leading-[0.9] text-balance">
              Radical Data. <br />
              Stunning Execution.
            </h2>
            
            <p className="text-[14px] md:text-[16px] font-inter text-[var(--color-battleship-grey)] font-light leading-relaxed tracking-[-0.01em] mt-4">
              We do not treat public budgets as mere numeric tables. We see them as active social contracts shaping Kenya's daily trajectory. By wedding clinical financial research to dynamic visual software interfaces and high-definition media, we create a hyper-clarifying truth tool.
            </p>

            {/* Glowing Accent Bordered List Items - Styled exactly according to hulyDESIGN.md */}
            <div className="flex flex-col gap-5 mt-6">
              {[
                { title: "Centralized Civic Coordination", desc: "A unified system enabling researchers and artists to track budget hearings and deliver outputs synchronously.", icon: Layers },
                { title: "Dynamic RSS and Cloud Ingestion", desc: "Automated aggregation pipelines streaming public testimonies directly onto youth dashboards.", icon: Database },
                { title: "Hyper-Contrasted Accountability Logs", desc: "Frosted-glass detail cards capturing county balance sheets with absolute cryptographic accuracy.", icon: Activity }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="list-huly-accent flex items-start gap-4 p-5">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-[#303236] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[var(--color-electric-blue)]" />
                    </div>
                    <div>
                      <h4 className="font-esbuild text-[15px] font-semibold text-white tracking-tight leading-snug">{item.title}</h4>
                      <p className="text-[12px] text-[var(--color-battleship-grey)] font-light mt-1.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column showing an elevated focus tooltip card */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:sticky lg:top-24">
            
            {/* Huly Elevated Tooltip Card Showcase */}
            <div className="card-huly-elevated flex flex-col gap-5 p-8 border-[#5683da]/30 relative overflow-hidden">
              <div className="huly-glow-blue -top-20 -right-20 opacity-30" />
              
              <div className="flex items-center justify-between pb-3 border-b border-[#303236]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-sunset-orange)] animate-pulse" />
                  <span className="font-esbuild text-xs font-bold uppercase tracking-wider text-white">Live Policy Audit</span>
                </div>
                <span className="text-[10px] font-mono text-[var(--color-storm-grey)]">NODE://5683da</span>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-mono text-[var(--color-silver-mist)] uppercase tracking-widest">TARGET PROFILE</span>
                <h3 className="font-esbuild text-2xl font-semibold tracking-tight leading-none text-white">Kenya National Debt Allocation</h3>
                <p className="text-[13px] text-[var(--color-battleship-grey)] font-light leading-relaxed">
                  Analyzing current structural adjustments and public infrastructure loans to provide a completely transparent youth summary.
                </p>
              </div>

              {/* Elevated Tooltip mock detail */}
              <div className="p-4 bg-[#090a0c] border border-[#303236] rounded-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#111111] border border-[#303236] flex items-center justify-center">
                    <Info className="w-4 h-4 text-[var(--color-electric-blue)]" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-white">System Variable Reconciled</span>
                    <span className="text-[10px] text-[var(--color-storm-grey)] mt-0.5">Audits verify a matching KSh 3.7T split</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  PASS
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 text-[10px] font-mono text-[var(--color-storm-grey)]">
                <span>VERIFIER: PECULIAR KOROS</span>
                <span>SECURE SSL</span>
              </div>
            </div>

            {/* Standard Card detailing outreach statistics */}
            <div className="card-huly-standard p-6 flex items-center justify-between gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--color-sunset-orange)] uppercase tracking-wider">Outreach Target</span>
                <span className="font-esbuild text-3xl font-bold tracking-tight text-white mt-1">250K+</span>
                <span className="text-[11px] text-[var(--color-battleship-grey)] mt-1.5 font-light">Young citizens directly engaged across secondary and tertiary academic loops.</span>
              </div>
              <div className="w-16 h-16 rounded-full border border-[#303236] bg-[#090a0c] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-[var(--color-sunset-orange)]" />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 3. DYNAMIC YOUTUBE RSS BROADCASTS SECTION ── */}
      <section id="broadcasts" className="relative py-24 md:py-36 px-6 md:px-12 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl flex flex-col gap-4">
            <span className="text-[10px] font-inter font-bold tracking-[0.2em] text-[var(--color-sunset-orange)] uppercase">
              02 // Dynamic Broadcast Network
            </span>
            <h2 className="font-esbuild text-white text-[32px] md:text-[52px] font-semibold tracking-[-0.03em] leading-[0.9]">
              Cinematic Ingestion.
            </h2>
            <p className="text-[14px] md:text-[16px] font-inter text-[var(--color-battleship-grey)] font-light leading-relaxed tracking-[-0.01em]">
              Synchronizing directly with our YouTube RSS feed to fetch our latest public budget investigations, citizen dialogues, and accountability briefs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-electric-blue)] animate-pulse" />
            <span className="text-[10px] font-mono text-[var(--color-silver-mist)] uppercase tracking-widest bg-[#111111] px-3.5 py-1.5 border border-[#303236] rounded-full">
              RSS: FEED ACTIVE
            </span>
          </div>
        </div>

        {/* Dynamic Ingest Grid */}
        {isVideosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((loader) => (
              <div key={loader} className="card-huly-standard p-3 flex flex-col gap-3 animate-pulse">
                <div className="w-full aspect-video bg-[#303236]/30 rounded-lg" />
                <div className="h-4 bg-[#303236]/30 rounded w-3/4" />
                <div className="h-3 bg-[#303236]/20 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {youtubeVideos.slice(0, 4).map((video) => (
              <div 
                key={video.id}
                onClick={() => setActiveVideoId(video.id)}
                className="card-huly-standard p-3.5 flex flex-col gap-3.5 group cursor-pointer border-[#303236]/60 hover:border-[var(--color-electric-blue)]/50"
              >
                {/* Simulated glass screenshot container */}
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-[#303236]/50">
                  <Image 
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                    alt={video.title} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-65 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  
                  {/* Glass player button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-xs group-hover:bg-[var(--color-electric-blue)] group-hover:border-transparent transition-all duration-300">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 bg-black/85 text-[9px] font-mono tracking-widest text-white border border-white/10 rounded-full font-light">
                    VIDEO
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h4 className="font-esbuild text-[13.5px] font-bold text-white tracking-tight leading-snug line-clamp-2 group-hover:text-[var(--color-electric-blue)] transition-colors duration-200">
                    {video.title}
                  </h4>
                  <span className="text-[10px] font-mono text-[var(--color-storm-grey)] uppercase tracking-wider">
                    PUBLISHED: {new Date(video.published).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── 4. MOVEMENT MOVEMENT GALLERY (CLOUDINARY COHORT ASSETS) ── */}
      <div id="gallery" className="relative py-24 md:py-36 bg-[#111111]/20 border-t border-[#303236]/20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-4">
            <span className="text-[10px] font-inter font-bold tracking-[0.2em] text-[var(--color-sunset-orange)] uppercase">
              03 // The Cloud Cohort Ledger
            </span>
            <h2 className="font-esbuild text-white text-[32px] md:text-[52px] font-semibold tracking-[-0.03em] leading-[0.9]">
              Field Documentation.
            </h2>
            <p className="text-[14px] md:text-[16px] font-inter text-[var(--color-battleship-grey)] font-light leading-relaxed tracking-[-0.01em]">
              Gathering visual consensus. Photos rendered directly from Cloudinary search logs capturing community townhalls, youth workshops, and grassroots researchers.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono tracking-[0.1em] text-[var(--color-silver-mist)] uppercase bg-[#111111] px-3.5 py-1.5 border border-[#303236] rounded-full">
              STORAGE: CLOUDINARY
            </span>
          </div>
        </div>

        {/* Dynamic Image Slides Container */}
        {isImagesLoading ? (
          <div className="w-full px-6 md:px-12 flex gap-6 overflow-x-auto no-scrollbar py-4">
            {[1, 2, 3, 4, 5].map((loader) => (
              <div key={loader} className="flex-shrink-0 w-[300px] md:w-[400px] aspect-[4/5] bg-[#303236]/30 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="w-full overflow-x-auto no-scrollbar py-6 flex flex-nowrap gap-6 md:gap-8 px-6 md:px-12 cursor-grab active:cursor-grabbing">
            {cloudinaryImages.map((image, idx) => (
              <div 
                key={idx}
                className="flex-shrink-0 w-[290px] md:w-[380px] aspect-[4/5] relative rounded-[10px] overflow-hidden border border-[#303236] bg-zinc-950/80 group"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out opacity-60 group-hover:opacity-100"
                  sizes="(max-width: 768px) 290px, 380px"
                />

                {/* Simulated Glass Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 select-none">
                  <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-[var(--color-sunset-orange)] mb-1">
                    VERIFIED LEDGER ENTRY
                  </span>
                  <h4 className="font-esbuild text-lg text-white font-semibold tracking-wide leading-tight uppercase">
                    {image.alt.replace(/_/g, " ").replace(/-/g, " ").replace(/\.[^/.]+$/, "")}
                  </h4>
                  <div className="mt-3.5 flex items-center gap-1.5 text-[10px] font-inter uppercase tracking-widest text-[var(--color-silver-mist)]">
                    <span>Audit Registry Details</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--color-electric-blue)]" />
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 z-20 group-hover:opacity-0 transition-opacity duration-200">
                  <span className="bg-black/75 backdrop-blur-xs border border-white/10 text-white font-mono text-[9px] tracking-widest uppercase py-1 px-2.5 rounded-full font-light">
                    PLATE NO. 0{idx + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 5. CORE NARRATIVE TEAM PORTRAIT LEADERSHIP SECTION ── */}
      <section id="team" className="relative py-24 md:py-36 px-6 md:px-12 max-w-[1280px] mx-auto border-t border-[#303236]/20">
        <div className="max-w-3xl flex flex-col gap-4 mb-16">
          <span className="text-[10px] font-inter font-bold tracking-[0.2em] text-[var(--color-sunset-orange)] uppercase">
            04 // The Narrative Custodians
          </span>
          <h2 className="font-esbuild text-white text-[32px] md:text-[52px] font-semibold tracking-[-0.03em] leading-none">
            The Core Team.
          </h2>
          <p className="text-[14px] md:text-[16px] font-inter text-[var(--color-battleship-grey)] font-light leading-relaxed tracking-[-0.01em]">
            Investigative budget researchers, digital video cinematographers, and youth program directors driving our operations in Nairobi.
          </p>
        </div>

        {/* Dynamic Grid of Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="card-huly-standard p-6 flex flex-col gap-5 border-[#303236]/60 hover:border-[#5683da]/40 hover:-translate-y-1"
            >
              {/* Product screenshot style avatar container */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-zinc-900 border border-[#303236]/50">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-esbuild text-lg font-bold text-white tracking-tight leading-none uppercase">{member.name}</h3>
                  <span className="text-[10px] font-mono text-[var(--color-storm-grey)]">CUSTODIAN 0{index + 1}</span>
                </div>
                <span className="text-[11px] font-inter text-[var(--color-sunset-orange)] uppercase font-semibold tracking-wider">
                  {member.role}
                </span>
                <p className="text-[13px] font-inter text-[var(--color-battleship-grey)] font-light leading-relaxed mt-2">
                  {member.description}
                </p>
              </div>

              {/* Minimal social linkages */}
              {member.socials && Object.keys(member.socials).length > 0 && (
                <div className="flex items-center gap-3 pt-3 border-t border-[#303236]/30">
                  {member.socials.linkedin && (
                    <a 
                      href={member.socials.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] font-mono text-[var(--color-silver-mist)] hover:text-white uppercase flex items-center gap-1"
                    >
                      LinkedIn <ExternalLink className="w-2.5 h-2.5 text-[var(--color-storm-grey)]" />
                    </a>
                  )}
                  {member.socials.x && (
                    <a 
                      href={member.socials.x} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[10px] font-mono text-[var(--color-silver-mist)] hover:text-white uppercase flex items-center gap-1"
                    >
                      X <ExternalLink className="w-2.5 h-2.5 text-[var(--color-storm-grey)]" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. CONSOLE EMAIL CAPTURE / RESERVATION (WARM IVORY GRADIENT CARD) ── */}
      <section id="newsletter" className="relative py-28 md:py-36 px-6 md:px-12 max-w-[1280px] mx-auto overflow-hidden">
        
        {/* Full-width Warm Ivory Gradient Card from hulyDESIGN.md */}
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#303236] p-8 md:p-24 flex flex-col items-center justify-center text-center">
          
          {/* Subtle Warm Ivory Gradient token as a glowing overlay layer */}
          <div className="absolute inset-0 bg-[#111111]/90 z-0" />
          <div className="absolute inset-0 bg-[var(--gradient-warm-ivory-gradient)] z-0 mix-blend-screen opacity-45 pointer-events-none" />
          <div className="huly-glow-orange -bottom-20 -left-20 opacity-35" />

          {/* Content Foreground */}
          <div className="relative z-20 max-w-2xl flex flex-col gap-6">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[var(--color-sunset-orange)] uppercase">
              REGISTER IN THE SYSTEM
            </span>
            
            <h2 className="font-esbuild text-white text-[32px] md:text-[56px] font-bold tracking-[-0.04em] leading-[0.9] text-balance">
              Secure Your Seat <br />
              <span className="text-[var(--color-electric-blue)]">In The Console.</span>
            </h2>
            
            <p className="text-[14px] md:text-[16px] font-inter text-[var(--color-battleship-grey)] font-light leading-relaxed max-w-md mx-auto text-balance">
              Sign up for automated national budget reports, research alerts, and direct invitations to regional Townhall live broadcasts.
            </p>

            {/* Minimal Form */}
            <form 
              onSubmit={handleNewsletter}
              className="w-full max-w-md mx-auto mt-6 flex flex-col sm:flex-row items-center gap-4"
            >
              <input
                type="email"
                required
                disabled={newsletterStatus === "success"}
                placeholder="Enter your civic email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#090a0c]/60 text-white placeholder-[var(--color-storm-grey)] font-inter text-[13px] h-10 px-4 rounded-[4px] border border-[#303236] focus:border-[var(--color-electric-blue)] focus:outline-none transition-all duration-300 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={newsletterStatus === "loading" || newsletterStatus === "success"}
                className="btn-huly-primary w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {newsletterStatus === "loading" ? "SECURE..." : "JOIN COHORT"}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            <AnimatePresence>
              {newsletterStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[11px] font-mono text-emerald-400 mt-4 tracking-wider uppercase bg-emerald-500/10 border border-emerald-500/20 py-2 px-4 rounded-md"
                >
                  SYSTEM SUCCESS: Narrative Console invitation transmitted. Check inbox.
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      </section>

      {/* ── 7. PREMIUM STARK MINIMALIST FOOTER ── */}
      <footer className="relative bg-[#090a0c] border-t border-[#303236]/30 pt-16 pb-10 px-6 md:px-12 z-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-[#303236]/20">
          
          <div className="md:col-span-6 flex flex-col gap-6">
            <span className="font-esbuild text-2xl font-bold tracking-[-0.05em] text-white">
              BUDGET NDIO STORY
            </span>
            <p className="text-[13px] font-inter font-light leading-relaxed text-[var(--color-battleship-grey)] max-w-sm">
              An independent, youth-led civic initiative translating Kenya's national budget frameworks and public spending statements into high-clarity narratives, interactive tools, and documentary video series.
            </p>
            <div className="flex items-center gap-4 mt-2">
              {[
                { name: "YouTube", href: "https://www.youtube.com/@budgetndiostory" },
                { name: "LinkedIn", href: "https://www.linkedin.com/company/budget-ndio-story/" },
                { name: "TikTok", href: "https://www.tiktok.com/@budget.ndio.story" }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono tracking-[0.05em] text-[var(--color-silver-mist)] hover:text-white uppercase transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-storm-grey)]">Command Navigation</span>
            <div className="flex flex-col gap-2.5">
              {[
                { name: "Workspace Console", target: "workspace" },
                { name: "Research Agenda", target: "agenda" },
                { name: "Broadcast Grid", target: "broadcasts" },
                { name: "Cloud Cohort", target: "gallery" }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => smoothScrollTo(link.target)}
                  className="text-[12px] font-inter text-left text-[var(--color-battleship-grey)] hover:text-white transition-colors duration-200"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-storm-grey)]">System Registry</span>
            <div className="text-[12px] font-inter text-[var(--color-battleship-grey)] flex flex-col gap-2">
              <span>BNS HQ · Nairobi, Kenya</span>
              <span>Primary Tech Stack: Next.js + Cloudinary + YouTube RSS</span>
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-sunset-orange)] uppercase">
                <Globe className="w-3.5 h-3.5" />
                <span>Global Distributed Node</span>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-[1280px] mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-[var(--color-storm-grey)]">
          <span>&copy; 2026 BUDGET NDIO STORY. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition-colors duration-200">PRIVACY PROTOCOL</span>
            <span className="hover:text-white cursor-pointer transition-colors duration-200">TERMS OF SERVICE</span>
          </div>
        </div>
      </footer>

      {/* ── CINEMATIC GLASSMORPHIC YOUTUBE EMBED PLAYER MODAL ── */}
      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#090a0c]/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-[850px] bg-[#111111] border border-[#303236] rounded-xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Bar */}
              <div className="p-4 border-b border-[#303236] flex items-center justify-between bg-[#111111]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-electric-blue)]" />
                  <span className="text-[11px] font-mono text-[var(--color-silver-mist)] uppercase tracking-wider">
                    CINEMATIC BROADCAST EMBED
                  </span>
                </div>
                <button
                  onClick={() => setActiveVideoId(null)}
                  className="w-8 h-8 rounded-full bg-[#090a0c] border border-[#303236] flex items-center justify-center text-[var(--color-silver-mist)] hover:text-white hover:border-white transition-all duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* YouTube Iframe Player Container */}
              <div className="w-full aspect-video bg-black relative">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* Modal Footer info */}
              <div className="p-4 bg-[#090a0c]/85 text-[11px] font-mono text-[var(--color-storm-grey)] flex items-center justify-between">
                <span>STABLE STREAM CONNECTOR</span>
                <span>ESC TO CLOSE</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
