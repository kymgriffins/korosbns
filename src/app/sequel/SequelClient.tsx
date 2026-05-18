"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { 
  Play, 
  X, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  Compass
} from "lucide-react";

// Google Fonts and local isolated styles
const stylesText = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700&display=swap');

.sequel-canvas {
  --color-midnight-void: #000000;
  --color-cloud-whisper: #ffffff;
  --color-slate-dust: #f5f5f0;
  --color-steel-gray: #202020;
  --color-mist-gray: #c0c0c0;
  --color-charcoal-tone: #333333;
  --color-ash-accent: #999999;
  --color-light-ash: #cccccc;
  --color-cadet-gray: #b3b3b3;
  --color-badge-overlay: rgba(51, 51, 51, 0.4);

  --font-visueltpro: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-bradford: 'Cormorant Garamond', Georgia, ui-serif, serif;
  
  background-color: var(--color-midnight-void);
  color: var(--color-cloud-whisper);
  font-family: var(--font-visueltpro);
}

.font-bradford {
  font-family: var(--font-bradford);
  font-weight: 500;
}

.font-visueltpro {
  font-family: var(--font-visueltpro);
}

/* Custom Scrollbar for premium restraint */
.sequel-canvas ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.sequel-canvas ::-webkit-scrollbar-track {
  background: var(--color-midnight-void);
}
.sequel-canvas ::-webkit-scrollbar-thumb {
  background: var(--color-charcoal-tone);
  border-radius: 9999px;
}
.sequel-canvas ::-webkit-scrollbar-thumb:hover {
  background: var(--color-ash-accent);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

interface CloudinaryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

interface VideoItem {
  id: string;
  title: string;
  duration: string;
  url: string;
  subtitle: string;
  category: string;
}

export default function SequelClient() {
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [cloudinaryImages, setCloudinaryImages] = useState<CloudinaryImage[]>([]);
  const [isImagesLoading, setIsImagesLoading] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);

  // Fallback high-key townhall & avatar photos
  const fallbackImages: CloudinaryImage[] = [
    {
      src: "/images/towwnhallmay/129A3912.jpg",
      alt: "Civic Deliberation",
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
      alt: "Public Budget Presentation",
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
    },
    {
      src: "/images/avatars/avatar1.jpg",
      alt: "Lead Narrative Designer",
      width: 600,
      height: 600,
    },
    {
      src: "/images/avatars/avatar4.jpg",
      alt: "Lead Public Finance Auditor",
      width: 600,
      height: 600,
    }
  ];

  // YouTube videos definitions (from youtube_links.txt)
  const youtubeVideos: VideoItem[] = [
    { 
      id: "intro", 
      title: "Introduction to Budget Ndio Story", 
      subtitle: "Bridging youth voice and financial governance structures.",
      duration: "4:32", 
      url: "https://www.youtube.com/embed/A_EXLueEMlk",
      category: "Foundation"
    },
    { 
      id: "pillars", 
      title: "BETA Agenda Pillars Explained", 
      subtitle: "Breaking down national economic frameworks in Kenya.",
      duration: "8:15", 
      url: "https://www.youtube.com/embed/jLZe3iPSMfc",
      category: "Analysis"
    },
    { 
      id: "numbers", 
      title: "Budget Numbers Deep Dive", 
      subtitle: "Demystifying county allocations and spending patterns.",
      duration: "6:48", 
      url: "https://www.youtube.com/embed/KeNCrx6krl0",
      category: "Deep Dive"
    },
    { 
      id: "risks", 
      title: "Fiscal Risks Analysis & Action", 
      subtitle: "Tracking national debt and structural policy hazards.",
      duration: "5:22", 
      url: "https://www.youtube.com/embed/SfPwtqUFyj4",
      category: "Advocacy"
    }
  ];

  // Fetch Cloudinary images on load
  useEffect(() => {
    async function fetchImages() {
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
    }
    fetchImages();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setEmailInput("");
      }, 5000);
    }
  };

  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveVideoUrl(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, []);

  const smoothScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="sequel-canvas w-full min-h-screen relative overflow-x-hidden selection:bg-[#ffffff]/10 select-none">
      <style dangerouslySetInnerHTML={{ __html: stylesText }} />

      {/* ── STICKY TOP NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/65 backdrop-blur-md border-b border-[#202020]/30 py-4 px-6 md:px-12 flex items-center justify-between transition-all duration-500">
        <div className="flex items-center gap-3">
          <span 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-bradford text-xl md:text-2xl font-semibold tracking-[-0.05em] cursor-pointer hover:opacity-80 transition-opacity"
          >
            SEQUEL
          </span>
          <span className="text-[9px] font-visueltpro font-light tracking-[0.1em] px-2 py-0.5 border border-[#c0c0c0]/20 rounded-full bg-white/5 uppercase text-[var(--color-mist-gray)] select-none">
            BNS Archive
          </span>
        </div>

        {/* Center Minimal Links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Brief", target: "brief" },
            { name: "Broadcasts", target: "broadcasts" },
            { name: "Cohort", target: "cohort" },
            { name: "Auditors", target: "auditors" },
          ].map((link, idx) => (
            <button
              key={idx}
              onClick={() => smoothScrollTo(link.target)}
              className="text-[12px] font-visueltpro font-light tracking-[0.06em] text-[var(--color-light-ash)] hover:text-white transition-colors uppercase duration-300"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* Right Primary Lozenge Button */}
        <div>
          <button 
            onClick={() => smoothScrollTo("newsletter")}
            className="bg-[#f5f5f0] text-[#000000] text-[11px] md:text-[12px] font-visueltpro font-medium tracking-[0.03em] uppercase py-2.5 px-6 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[rgba(255,255,255,0.12)_0px_4px_20px_0px]"
          >
            Reserve Seat
          </button>
        </div>
      </nav>

      {/* ── 1. CINEMATIC HERO SECTION ── */}
      <section className="relative w-full h-screen overflow-hidden flex flex-col justify-end bg-black">
        {/* Full-bleed Grayscale Looping Background Video from Cloudinary */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#000000]/70 z-10 mix-blend-multiply" />
          <video
            autoPlay
            muted={isVideoMuted}
            loop
            playsInline
            className="w-full h-full object-cover grayscale opacity-65 scale-105 transition-all duration-1000"
          >
            <source 
              src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4" 
              type="video/mp4" 
            />
            {/* Fallback backdrops if video load fails */}
            <div className="w-full h-full bg-zinc-950" />
          </video>
        </div>

        {/* Volume Mute Toggle Overlay (Circular Play Button Style) */}
        <button
          onClick={() => setIsVideoMuted(!isVideoMuted)}
          className="absolute bottom-12 right-6 md:right-12 z-20 w-11 h-11 rounded-full border border-white/30 flex items-center justify-center bg-black/45 hover:bg-white hover:text-black transition-all duration-300 group"
          title={isVideoMuted ? "Unmute Cinematic Background" : "Mute Background"}
        >
          {isVideoMuted ? (
            <VolumeX className="w-4 h-4 text-white group-hover:text-black" />
          ) : (
            <Volume2 className="w-4 h-4 text-white group-hover:text-black" />
          )}
        </button>

        {/* Hero Interactive Typography & CTA */}
        <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 md:px-12 pb-16 md:pb-24 flex flex-col gap-6 select-none">
          <div className="inline-flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#f5f5f0] animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-visueltpro font-light tracking-[0.15em] text-[var(--color-mist-gray)] uppercase">
              A Civic Narrative Reimagined
            </span>
          </div>

          <div className="max-w-4xl">
            <h1 className="font-bradford text-white text-[clamp(2.4rem,7vw,7.5rem)] font-light tracking-[-0.05em] leading-[0.92] text-balance">
              Where Civic Restraint <br />
              Meets <span className="italic font-serif">Sculpted Truth</span>.
            </h1>
          </div>

          <div className="max-w-2xl mt-2">
            <p className="text-[14px] md:text-[16px] font-visueltpro font-light tracking-[-0.02em] leading-[1.5] text-[var(--color-light-ash)] text-balance">
              A quiet, hyper-focused canvas translating Kenya's massive national budget frameworks into visual gravity. Empowering Nairobi's upcoming generation through rigorous documentation and premium documentary filmmaking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            {/* Primary Lozenge Button */}
            <button
              onClick={() => smoothScrollTo("brief")}
              className="bg-[#f5f5f0] text-[#000000] text-[13px] font-visueltpro font-medium tracking-[0.03em] uppercase py-3.5 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[rgba(255,255,255,0.15)_0px_4px_25px_0px] flex items-center gap-2 group"
            >
              Explore Brief
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Ghost Lozenge Button */}
            <button
              onClick={() => smoothScrollTo("broadcasts")}
              className="bg-transparent text-white text-[13px] font-visueltpro font-normal tracking-[0.03em] uppercase py-3.5 px-7 rounded-full border border-white/20 hover:border-white transition-all duration-300 hover:bg-white/5"
            >
              Watch the Series
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-6 md:left-12 z-20 hidden md:flex items-center gap-2">
          <span className="text-[9px] font-visueltpro tracking-[0.2em] uppercase text-white/30">Scroll</span>
          <div className="w-8 h-[1px] bg-white/20" />
        </div>
      </section>

      {/* ── 2. THE MANIFESTO / EDITORIAL BRIEF ── */}
      <section id="brief" className="relative py-24 md:py-40 border-b border-[#202020]/20 bg-[#000000]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Bold Copywriting */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <span className="text-[10px] font-visueltpro font-light tracking-[0.2em] uppercase text-[var(--color-ash-accent)]">
              01 // The Narrative manifesto
            </span>
            
            <h2 className="font-bradford text-white text-[32px] md:text-[54px] font-light tracking-[-0.03em] leading-[1.05] text-balance">
              Translating Public Outrage <br />
              Into <span className="italic font-serif">Aspirational Blueprint</span>.
            </h2>
            
            <div className="flex flex-col gap-5 mt-4 text-[var(--color-light-ash)] text-[14px] md:text-[15px] font-light leading-[1.7] tracking-[-0.015em]">
              <p>
                We do not believe public budgets are dry, inaccessible, or static spreadsheets. We believe they represent the architectural master plan of our collective democratic future. Yet, their density acts as a gatekeeper, creating massive informational asymmetry.
              </p>
              <p>
                Budget Ndio Story exists to completely redefine this dynamic. By marrying meticulous financial investigation with high-end documentary film and beautiful, interactive aesthetics, we elevate civic engagement into a serious, intellectual art form. 
              </p>
              <p className="border-l border-[#f5f5f0]/20 pl-4 text-white font-bradford italic text-lg leading-relaxed mt-2 text-[var(--color-mist-gray)]">
                "Our focus remains strictly on Kenyan human subjects — capturing their reflective intelligence, their drive for systemic clarity, and their leadership in rebuilding civic space."
              </p>
            </div>

            {/* Micro Stats Grid using Spacing Units */}
            <div className="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-[#202020]">
              {[
                { number: "KSh 3.7T", label: "National Budget Tracked" },
                { number: "47", label: "Counties Visualized" },
                { number: "250K+", label: "Youth Leaders Reached" }
              ].map((stat, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <span className="font-bradford text-xl md:text-3xl text-white font-light tracking-[-0.03em]">{stat.number}</span>
                  <span className="text-[9px] font-visueltpro uppercase tracking-[0.06em] text-[var(--color-ash-accent)]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Editorial Featured Card with 10px rounded corners & no box shadow */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative w-full aspect-[4/5] rounded-[10px] overflow-hidden bg-[#202020]/20 border border-[#202020]/40 group">
              <Image
                src="/images/towwnhallmay/129A3912.jpg"
                alt="Documentary Townhall Discourse"
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />
              {/* Badge Overlay */}
              <div className="absolute top-4 left-4 z-20">
                <span className="text-[9px] font-visueltpro tracking-[0.1em] uppercase py-1.5 px-3 rounded-full bg-black/60 border border-white/10 text-white font-medium">
                  Nairobi Cohort
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent z-10 flex flex-col justify-end p-6 select-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-[10px] font-visueltpro tracking-[0.1em] text-white/50 uppercase mb-1">Location Spotlight</span>
                <p className="font-bradford text-white text-lg tracking-wide leading-tight">Town Hall Assembly · May 2026</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-1 text-[11px] text-[var(--color-ash-accent)] font-visueltpro uppercase tracking-[0.05em]">
              <span>Grayscale Portraiture Series</span>
              <span>Plate No. 012</span>
            </div>
          </div>

        </div>
      </section>

      {/* ── 3. THE BROADCAST SERIES (YOUTUBE VIDEOS) ── */}
      <section id="broadcasts" className="relative py-24 md:py-40 bg-[#000000] border-b border-[#202020]/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
          <div className="max-w-3xl flex flex-col gap-4">
            <span className="text-[10px] font-visueltpro font-light tracking-[0.2em] uppercase text-[var(--color-ash-accent)]">
              02 // The Broadcast series
            </span>
            <h2 className="font-bradford text-white text-[32px] md:text-[54px] font-light tracking-[-0.03em] leading-[1.05]">
              Cinematic Investigations.
            </h2>
            <p className="text-[14px] md:text-[16px] font-visueltpro font-light tracking-[-0.02em] leading-[1.6] text-[var(--color-light-ash)] mt-2">
              Explore our core media portfolio documenting public finance decisions, critical fiscal risk variables, and local youth accountability paths.
            </p>
          </div>
        </div>

        {/* 2x2 Asymmetric Media Card Grid */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {youtubeVideos.map((video, idx) => (
            <div 
              key={video.id}
              className="group flex flex-col gap-4 cursor-pointer"
              onMouseEnter={() => setHoveredVideoId(video.id)}
              onMouseLeave={() => setHoveredVideoId(null)}
              onClick={() => setActiveVideoUrl(video.url)}
            >
              {/* Standard Card Container (0px border-radius, no shadow, relies on pure content hierarchy) */}
              <div className="relative w-full aspect-video overflow-hidden bg-[#202020]/10 border border-[#202020]/50 rounded-none transition-all duration-500 group-hover:border-[#c0c0c0]/30">
                {/* Fallback beautiful video backdrop using townhall imagery */}
                <Image
                  src={
                    idx === 0 ? "/images/towwnhallmay/129A3863.jpg" :
                    idx === 1 ? "/images/towwnhallmay/129A3923.jpg" :
                    idx === 2 ? "/images/towwnhallmay/129A4056.jpg" :
                    "/images/towwnhallmay/129A4094.jpg"
                  }
                  alt={video.title}
                  fill
                  className="object-cover grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  sizes="(max-width: 768px) 100vw, 650px"
                />
                
                {/* Dark Vignette */}
                <div className="absolute inset-0 bg-[#000000]/25 group-hover:bg-[#000000]/10 transition-colors duration-500" />

                {/* perfectly circular play button, transparent background, white border */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center bg-transparent backdrop-blur-xs group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <Play className="w-5 h-5 text-white fill-white group-hover:text-black group-hover:fill-black ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge overlay */}
                <div className="absolute bottom-4 right-4 z-20 bg-black/75 px-3 py-1 text-[10px] font-visueltpro tracking-widest text-white border border-white/10 rounded-full font-light">
                  {video.duration} MIN
                </div>

                {/* Left Category Overlay */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[9px] font-visueltpro tracking-[0.15em] uppercase py-1 px-3 rounded-full bg-white/10 border border-white/5 text-[var(--color-slate-dust)]">
                    {video.category}
                  </span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-bradford text-xl md:text-2xl text-white font-light group-hover:text-[var(--color-slate-dust)] transition-colors leading-tight">
                    {video.title}
                  </h3>
                  <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <p className="text-[13px] font-visueltpro font-light leading-relaxed text-[var(--color-ash-accent)] max-w-xl group-hover:text-[var(--color-light-ash)] transition-colors">
                  {video.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. MOVEMENT GALLERY (CLOUDINARY & PUBLIC COHORT ASSETS) ── */}
      <section id="cohort" className="relative py-24 md:py-40 bg-[#000000] overflow-hidden border-b border-[#202020]/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl flex flex-col gap-4">
            <span className="text-[10px] font-visueltpro font-light tracking-[0.2em] uppercase text-[var(--color-ash-accent)]">
              03 // The Cohort Archives
            </span>
            <h2 className="font-bradford text-white text-[32px] md:text-[54px] font-light tracking-[-0.03em] leading-[1.05]">
              Documenting the Movement.
            </h2>
            <p className="text-[14px] md:text-[15px] font-visueltpro font-light leading-relaxed text-[var(--color-light-ash)] max-w-xl">
              A high-precision image catalog capturing Kenya's upcoming finance leadership, public dialogues, and community builders in the field. 
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-visueltpro tracking-[0.1em] uppercase text-white/40">Visual Stream</span>
            <span className="text-[10px] font-visueltpro tracking-[0.1em] uppercase py-1 px-3 bg-white/5 border border-white/10 text-white rounded-full">
              Cloudinary Optimized
            </span>
          </div>
        </div>

        {/* Dynamic Horizontal Image Roll */}
        <div className="w-full overflow-x-auto no-scrollbar py-6 flex flex-nowrap gap-6 md:gap-8 px-6 md:px-12 select-none cursor-grab active:cursor-grabbing">
          {cloudinaryImages.map((image, idx) => (
            <div 
              key={idx}
              className="flex-shrink-0 w-[280px] md:w-[420px] aspect-[4/5] relative rounded-[10px] overflow-hidden border border-[#202020] bg-zinc-950 group"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                sizes="(max-width: 768px) 280px, 420px"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 select-none">
                <span className="text-[9px] font-visueltpro uppercase tracking-[0.1em] text-white/50 mb-1">
                  Public Ledger Image
                </span>
                <p className="font-bradford text-lg text-white font-light tracking-wide leading-tight">
                  {image.alt.replace(/_/g, " ").replace(/-/g, " ")}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] font-visueltpro tracking-widest text-[#f5f5f0] uppercase">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Minimal constant badge */}
              <div className="absolute bottom-4 left-4 z-20 group-hover:opacity-0 transition-opacity duration-300">
                <span className="bg-black/60 backdrop-blur-xs border border-white/15 text-white/80 font-visueltpro text-[9px] tracking-widest uppercase py-1 px-2.5 rounded-full font-light">
                  No. 0{idx + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. COHORT PORTRAIT LEADERSHIP SECTION ── */}
      <section id="auditors" className="relative py-24 md:py-40 bg-[#000000] border-b border-[#202020]/20">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading Copy */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-28">
            <span className="text-[10px] font-visueltpro font-light tracking-[0.2em] uppercase text-[var(--color-ash-accent)]">
              04 // The Leaders
            </span>
            
            <h2 className="font-bradford text-white text-[32px] md:text-[54px] font-light tracking-[-0.03em] leading-[1.05]">
              The Core <br />
              <span className="italic font-serif">Narrative Team</span>.
            </h2>
            
            <p className="text-[14px] font-visueltpro font-light leading-relaxed text-[var(--color-light-ash)] mt-2">
              Meet the investigative budget researchers, documentary visual artists, and youth policy specialists directing our civic programs across Kenya.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {[
                { name: "Public Policy Lab", location: "Nairobi, KE" },
                { name: "Visual Media Center", location: "Mombasa, KE" },
              ].map((loc, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-[#202020] text-[12px] font-visueltpro uppercase tracking-[0.05em] text-[var(--color-ash-accent)]">
                  <span>{loc.name}</span>
                  <span className="text-white font-light">{loc.location}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Portrait Cards (Standard Cards - 0px radius) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {[
              {
                name: "Wanjiku Kamau",
                role: "Lead Public Finance Auditor",
                desc: "Specializes in translating county appropriation bills and state debt indicators into clear legislative report formats.",
                img: "/images/avatars/avatar1.jpg"
              },
              {
                name: "Koros Kipchirchir",
                role: "Director of Visual Narrative",
                desc: "Award-winning documentary cinematographer managing the Budget Mtaani video series and on-street media interviews.",
                img: "/images/avatars/avatar2.jpg"
              },
              {
                name: "Amina Omondi",
                role: "Chief Civic Design Strategist",
                desc: "Directs outreach curricula for tertiary institutions, establishing high-engagement budget clubs across Nairobi.",
                img: "/images/avatars/avatar3.jpg"
              },
              {
                name: "Nduku Mutua",
                role: "Executive Campaign Producer",
                desc: "Coordinates civic partnerships and organizes local townhall events matching youth energy with regulatory experts.",
                img: "/images/avatars/avatar4.jpg"
              }
            ].map((leader, idx) => (
              <div 
                key={idx} 
                className="group flex flex-col gap-4 rounded-none border border-[#202020]/50 p-6 bg-zinc-950/20 hover:border-[#c0c0c0]/20 transition-all duration-300"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-zinc-900/60 rounded-none border border-[#202020]">
                  <Image
                    src={leader.img}
                    alt={leader.name}
                    fill
                    className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 ease-in-out"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-bradford text-xl md:text-2xl text-white font-light group-hover:text-[var(--color-slate-dust)] transition-colors">
                      {leader.name}
                    </span>
                    <span className="text-[10px] font-visueltpro tracking-[0.05em] uppercase text-[var(--color-ash-accent)]">
                      Plate 0{idx + 1}
                    </span>
                  </div>
                  
                  <span className="text-[11px] font-visueltpro text-[#f5f5f0] tracking-[0.08em] uppercase">
                    {leader.role}
                  </span>
                  
                  <p className="text-[13px] font-visueltpro font-light leading-relaxed text-[var(--color-cadet-gray)] mt-1">
                    {leader.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. CINEMATIC PARTING STATEMENT & ACTION CAPTURE ── */}
      <section id="newsletter" className="relative py-28 md:py-48 bg-[#000000]">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          
          {/* Featured Card (10px border radius, no shadow) with embedded background looping video */}
          <div className="relative w-full rounded-[10px] overflow-hidden border border-[#202020] bg-zinc-950 py-24 px-8 md:p-32 flex flex-col items-center justify-center text-center">
            
            {/* Grayscale Video Layer */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-black/85 z-10 mix-blend-multiply" />
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover grayscale opacity-35"
              >
                <source 
                  src="https://res.cloudinary.com/dn8lut2fc/video/upload/v1778496651/Untitled_design_maph6q.mp4" 
                  type="video/mp4" 
                />
              </video>
            </div>

            {/* Content Foreground */}
            <div className="relative z-20 max-w-3xl flex flex-col gap-6">
              <span className="text-[10px] font-visueltpro font-light tracking-[0.3em] uppercase text-[#f5f5f0]/80">
                Reserving Future Space
              </span>
              
              <h2 className="font-bradford text-white text-[32px] md:text-[64px] font-light tracking-[-0.03em] leading-[1.05] text-balance">
                Your Seat at the Table, <br />
                <span className="italic font-serif">Reserved</span>.
              </h2>
              
              <p className="text-[14px] md:text-[16px] font-visueltpro font-light leading-relaxed text-[var(--color-light-ash)] max-w-xl mx-auto text-balance">
                Join our next cohort, receive high-precision public finance newsletters, and get private invitations to visual townhall broadcasts.
              </p>

              {/* Ultra-minimalist Email Capture Form */}
              <form 
                onSubmit={handleNewsletterSubmit}
                className="w-full max-w-md mx-auto mt-8 flex flex-col md:flex-row items-center gap-4"
              >
                <div className="w-full relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-[var(--color-cadet-gray)] font-visueltpro text-[14px] py-3.5 px-1 border-b border-white/20 focus:border-white focus:outline-none transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto bg-[#f5f5f0] text-black text-[12px] font-visueltpro font-medium tracking-[0.05em] uppercase py-3.5 px-8 rounded-full transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-[rgba(255,255,255,0.18)_0px_4px_20px_0px] flex-shrink-0"
                >
                  Join Cohort
                </button>
              </form>

              {/* Status Indicator */}
              <AnimatePresence>
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[12px] font-visueltpro text-green-400 mt-4 tracking-wider uppercase"
                  >
                    Narrative Seat Reserved. Check your inbox soon.
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </section>

      {/* ── 7. PREMIUM STARK MINIMALIST FOOTER ── */}
      <footer className="relative bg-[#000000] border-t border-[#202020]/40 pt-20 pb-12 px-6 md:px-12 z-20">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#202020]/50">
          
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <span className="font-bradford text-2xl font-bold tracking-[-0.05em] text-white">
              BUDGET NDIO STORY
            </span>
            <p className="text-[13px] font-visueltpro font-light leading-relaxed text-[var(--color-ash-accent)] max-w-sm">
              We build high-precision visual records and cinematic narratives to support public financial literacy, county budget transparency, and structural policy dialogue among Kenyan youth.
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
                  className="text-[11px] font-visueltpro tracking-[0.05em] text-[var(--color-cadet-gray)] hover:text-white uppercase transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <span className="text-[9px] font-visueltpro font-semibold tracking-[0.25em] text-white uppercase">
              The Archive
            </span>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Brief Narrative", target: "brief" },
                { label: "Investigative Broadcasts", target: "broadcasts" },
                { label: "Cohort Catalog", target: "cohort" },
                { label: "Team Directory", target: "auditors" }
              ].map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => smoothScrollTo(link.target)}
                  className="text-[13px] font-visueltpro font-light text-[var(--color-light-ash)] hover:text-white text-left transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Links Col 2 */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-[9px] font-visueltpro font-semibold tracking-[0.25em] text-white uppercase">
              Platforms
            </span>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Learn Portal", href: "/learn/" },
                { label: "Research Data", href: "/research/" },
                { label: "Main Gallery", href: "/gallery/" },
                { label: "Civic Surveys", href: "/surveys/" }
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="text-[13px] font-visueltpro font-light text-[var(--color-light-ash)] hover:text-white transition-colors flex items-center gap-1"
                >
                  {link.label}
                  <ExternalLink className="w-3 h-3 opacity-30" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Col 3 */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <span className="text-[9px] font-visueltpro font-semibold tracking-[0.25em] text-white uppercase">
              Regulatory
            </span>
            <div className="flex flex-col gap-2.5 text-[13px] font-visueltpro font-light text-[var(--color-light-ash)]">
              <a href="/privacy/" className="hover:text-white transition-colors">Privacy Charter</a>
              <a href="/terms/" className="hover:text-white transition-colors">Terms of Canvas</a>
              <a href="/faq/" className="hover:text-white transition-colors">FAQ Support</a>
            </div>
          </div>

        </div>

        {/* Fine Print / Credits */}
        <div className="max-w-[1400px] mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] md:text-[11px] font-visueltpro text-[var(--color-ash-accent)]">
          <div className="flex items-center gap-2">
            <span>© 2026 Budget Ndio Story.</span>
            <span>·</span>
            <span>All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-1 text-[var(--color-light-ash)]">
            <span>Sculpted to standard in Nairobi</span>
            <Compass className="w-3.5 h-3.5 text-white/50" />
          </div>
        </div>
      </footer>

      {/* ── IMMERSIVE FULLSCREEN VIDEO MODAL OVERLAY ── */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10001] bg-[#000000]/98 flex items-center justify-center p-4 md:p-12 select-none"
            onClick={() => setActiveVideoUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden border border-[#202020]/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${activeVideoUrl}?autoplay=1&rel=0&modestbranding=1`}
                title="Cinematic Broadcast Player"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              
              {/* Close Button: Stark, ghost style, text close */}
              <button
                onClick={() => setActiveVideoUrl(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-white hover:text-black border border-white/20 py-2 px-4 rounded-full text-[10px] font-visueltpro tracking-[0.15em] uppercase text-white font-medium transition-all duration-300 flex items-center gap-1.5"
              >
                Close <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
