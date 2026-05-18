"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import {
  Search,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  TrendingUp,
  Users,
  MapPin,
  Building2,
  Sparkles,
  Menu,
  X,
  FileText,
  CheckCircle2,
  Play,
  Volume2,
  VolumeX,
  BookOpen
} from "lucide-react";
import bnsConfig from "@/constants/bnsConfig.json";

// Theme and Local Isolated Styles
const stylesText = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.sunday-canvas {
  --color-canvas-white: #ffffff;
  --color-midnight-ink: #000000;
  --color-subtle-gray: #736f7c;
  --color-border-ash: #dedede;
  --color-accent-slate: #7f7f7f;
  --color-ghost-shadow: #8b8893;
  --color-divider-silver: #bdbdbd;
  --color-vivid-orchid: #ff17e9;
  
  --font-helvetica-neue: 'Helvetica Neue', ui-sans-serif, system-ui, -apple-system, sans-serif;
  
  background-color: var(--color-canvas-white) !important;
  color: var(--color-midnight-ink) !important;
  font-family: var(--font-helvetica-neue);
}

/* Ensure next-themes class dark overrides are contained and forced back to light styles */
.sunday-canvas,
.sunday-canvas.dark,
.dark .sunday-canvas {
  background-color: var(--color-canvas-white) !important;
  color: var(--color-midnight-ink) !important;
}

.sunday-canvas ::selection {
  background-color: var(--color-vivid-orchid) !important;
  color: var(--color-canvas-white) !important;
}

.sunday-canvas a, 
.sunday-canvas p, 
.sunday-canvas span, 
.sunday-canvas h1, 
.sunday-canvas h2, 
.sunday-canvas h3, 
.sunday-canvas h4, 
.sunday-canvas h5, 
.sunday-canvas h6,
.sunday-canvas input,
.sunday-canvas button,
.sunday-canvas label,
.sunday-canvas select {
  color: var(--color-midnight-ink);
}

.sunday-canvas .text-muted {
  color: var(--color-subtle-gray) !important;
}

/* Typographic Scale */
.sunday-canvas .text-caption {
  font-size: 12px;
  line-height: 1.78;
  letter-spacing: 0.96px; /* 0.08em */
}

.sunday-canvas .text-body-sm {
  font-size: 14px;
  line-height: 1.2;
  letter-spacing: 1.12px;
}

.sunday-canvas .text-body {
  font-size: 16px;
  line-height: 1.25;
}

.sunday-canvas .text-subheading {
  font-size: 18px;
  line-height: 1.14;
}

.sunday-canvas .text-heading {
  font-size: 24px;
  line-height: 1.13;
}

.sunday-canvas .text-heading-lg {
  font-size: 48px;
  line-height: 0.95;
  letter-spacing: -0.48px;
}

.sunday-canvas .text-display-lg {
  font-size: 64px;
  line-height: 0.8;
  letter-spacing: -1.92px;
}

.sunday-canvas .text-display {
  font-size: 100px;
  line-height: 1;
  letter-spacing: -4px;
}
@media (min-width: 768px) {
  .sunday-canvas .text-display {
    font-size: 200px;
    letter-spacing: -10px;
  }
}

/* Core Buttons */
.sunday-canvas .btn-primary {
  background-color: var(--color-midnight-ink) !important;
  color: var(--color-canvas-white) !important;
  border-radius: 64px !important;
  padding: 12px 28px !important;
  font-size: 14px;
  line-height: 1.2;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid var(--color-midnight-ink) !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.sunday-canvas .btn-primary:hover {
  transform: translateY(-2px);
  background-color: var(--color-canvas-white) !important;
  color: var(--color-midnight-ink) !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.sunday-canvas .btn-outline {
  background-color: transparent !important;
  color: var(--color-midnight-ink) !important;
  border-radius: 64px !important;
  padding: 12px 28px !important;
  font-size: 14px;
  border: 1px solid var(--color-midnight-ink) !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.sunday-canvas .btn-outline:hover {
  background-color: var(--color-midnight-ink) !important;
  color: var(--color-canvas-white) !important;
  transform: translateY(-2px);
}

.sunday-canvas .btn-ghost {
  background-color: transparent !important;
  color: var(--color-midnight-ink) !important;
  border-radius: 0 !important;
  padding: 0 !important;
  font-size: 14px;
  line-height: 1.25;
  transition: opacity 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.sunday-canvas .btn-ghost:hover {
  opacity: 0.7;
}

/* Custom Cards */
.sunday-canvas .card-standard {
  background-color: rgba(14, 7, 29, 0.04) !important;
  border-radius: 16px !important;
  padding: 40px !important;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid transparent;
}
.sunday-canvas .card-standard:hover {
  transform: translateY(-4px);
  background-color: rgba(14, 7, 29, 0.06) !important;
  border-color: rgba(0, 0, 0, 0.04);
}

.sunday-canvas .card-asymmetric-left {
  background-color: rgba(14, 7, 29, 0.04) !important;
  border-radius: 48px 0px 0px 48px !important;
  padding: 80px !important;
}

.sunday-canvas .card-asymmetric-right {
  background-color: rgba(14, 7, 29, 0.04) !important;
  border-radius: 0px 48px 48px 0px !important;
  padding: 80px !important;
}

/* Text Input Field */
.sunday-canvas .input-field {
  background: transparent !important;
  color: var(--color-midnight-ink) !important;
  border-radius: 16px 16px 0 0 !important;
  border-bottom: 1px solid var(--color-border-ash) !important;
  padding: 16px 16px 12px 16px !important;
  transition: all 0.3s ease;
  width: 100%;
}
.sunday-canvas .input-field::placeholder {
  color: var(--color-subtle-gray) !important;
}
.sunday-canvas .input-field:focus {
  outline: none !important;
  border-bottom-color: var(--color-vivid-orchid) !important;
  background-color: rgba(14, 7, 29, 0.02) !important;
}

/* Navigation Shadow */
.sunday-canvas .nav-shadow {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 12px 60px 0px !important;
}

/* Neon Pulse Dot */
.sunday-canvas .pulse-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--color-vivid-orchid);
  box-shadow: 0 0 10px var(--color-vivid-orchid);
  animation: neonPulse 2s infinite ease-in-out;
  display: inline-block;
}

@keyframes neonPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;

// County modeled data matching BNS standard
interface CountyData {
  name: string;
  allocation: string;
  sectors: { name: string; amount: string; pct: number }[];
  explainer: string;
  action: string;
}

const countyBudgets: CountyData[] = [
  {
    name: "Nairobi County",
    allocation: "KSh 42.3 Billion",
    sectors: [
      { name: "Health Services", amount: "KSh 8.4B", pct: 20 },
      { name: "Infrastructure & Roads", amount: "KSh 6.1B", pct: 14 },
      { name: "Youth & Sports", amount: "KSh 1.2B", pct: 3 },
      { name: "Administration & Salaries", amount: "KSh 15.2B", pct: 36 }
    ],
    explainer: "Nairobi receives the highest allocation in Kenya. However, direct public spending on Youth & Sports stands at under 3% of the total budget. Over 36% goes directly into administrative salaries.",
    action: "BNS Nairobi Chapter is organizing community petition drives on June 5 to advocate raising youth bursary funds to 6% of the budget."
  },
  {
    name: "Mombasa County",
    allocation: "KSh 14.8 Billion",
    sectors: [
      { name: "Blue Economy & Trade", amount: "KSh 2.2B", pct: 15 },
      { name: "Education & ECD", amount: "KSh 1.8B", pct: 12 },
      { name: "Health & Sanitation", amount: "KSh 3.4B", pct: 23 },
      { name: "County Assembly Bills", amount: "KSh 1.5B", pct: 10 }
    ],
    explainer: "Mombasa prioritizes trade and water access. However, youth organizers are actively tracking how much of the KSh 2.2 Billion Blue Economy fund flows into actual training programs for young fishers vs administration.",
    action: "Join BNS Mombasa's Coast Chapter online webinar on May 24 tracking coastal development allocations."
  },
  {
    name: "Kisumu County",
    allocation: "KSh 12.1 Billion",
    sectors: [
      { name: "Healthcare Operations", amount: "KSh 2.5B", pct: 21 },
      { name: "Agriculture & Fisheries", amount: "KSh 1.9B", pct: 16 },
      { name: "Lakefront Development", amount: "KSh 1.5B", pct: 12 },
      { name: "Governor's Direct Projects", amount: "KSh 950M", pct: 8 }
    ],
    explainer: "Kisumu leads agricultural and healthcare investments in Western Kenya. BNS chapters monitor whether these equipment budgets translate into real delivery and medication access on the ground.",
    action: "BNS Kisumu chapter runs monthly community audit walks at local health dispensaries to compare actual drug stocks with their allocated budgets."
  },
  {
    name: "Nakuru County",
    allocation: "KSh 18.5 Billion",
    sectors: [
      { name: "Agriculture & Extension Services", amount: "KSh 3.2B", pct: 17 },
      { name: "Water & Environment", amount: "KSh 2.8B", pct: 15 },
      { name: "Vocational Polytechnics", amount: "KSh 800M", pct: 4 },
      { name: "Road Networks", amount: "KSh 2.1B", pct: 11 }
    ],
    explainer: "Nakuru prioritizes clean water access and smallholder agriculture. Our chapters at Egerton University are tracking water project completions against Nakuru's infrastructure budgets.",
    action: " Nakuru Chapter public townhall: May 30 at Nakuru Library, focusing on community water system auditing."
  },
  {
    name: "Kakamega County",
    allocation: "KSh 16.3 Billion",
    sectors: [
      { name: "Health Services & Equipment", amount: "KSh 3.9B", pct: 24 },
      { name: "Infrastructure & Roads", amount: "KSh 2.5B", pct: 15 },
      { name: "SME Support & Grants", amount: "KSh 650M", pct: 4 },
      { name: "Education & Polytechs", amount: "KSh 1.6B", pct: 10 }
    ],
    explainer: "With almost a quarter of the budget directed to Health, Kakamega constructs widespread ward clinics. BNS matches clinic equipment procurement logs with real-time on-ground staffing levels.",
    action: "Get the Kakamega County scorecard. Sign up as a community verification volunteer to monitor clinics in Kakamega."
  }
];

export default function SundayClient() {
  const [activeTab, setActiveTab] = useState<"county" | "terra" | "verification">("county");
  const [selectedCounty, setSelectedCounty] = useState<string>("Nairobi County");
  const [emailInput, setEmailInput] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const activeCountyData = countyBudgets.find((c) => c.name === selectedCounty) || countyBudgets[0];

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

  const smoothScrollTo = (id: string) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText("Copied!");
    setTimeout(() => setCopiedText(""), 2000);
  };

  return (
    <div className="sunday-canvas w-full min-h-screen relative overflow-x-hidden selection:bg-[#ff17e9]/20 select-none pb-20">
      <style dangerouslySetInnerHTML={{ __html: stylesText }} />

      {/* ── STICKY NAVIGATION BAR ── */}
      <nav className="nav-bar h-20 px-6 md:px-12 flex items-center justify-between border-b border-[#dedede] bg-white transition-all duration-300">
        <div className="flex items-center gap-3">
          <span
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-bold text-xl md:text-2xl tracking-[-0.05em] cursor-pointer hover:opacity-85 transition-opacity"
            style={{ fontFamily: "'Outfit', 'Helvetica Neue', sans-serif" }}
          >
            BUDGET NDIO STORY
          </span>
          <span className="text-[9px] font-medium tracking-[0.12em] px-2 py-0.5 border border-[#dedede] rounded-full uppercase text-[#ff17e9] bg-[#ff17e9]/5 flex items-center gap-1.5 select-none">
            <span className="pulse-dot" />
            Sunday
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {[
            { name: "Core Mission", target: "mission" },
            { name: "Value Proposition", target: "values" },
            { name: "Live Simulator", target: "simulator" },
            { name: "Consortium", target: "consortium" },
            { name: "Programs", target: "programs" },
            { name: "Leadership", target: "leadership" }
          ].map((link, idx) => (
            <button
              key={idx}
              onClick={() => smoothScrollTo(link.target)}
              className="text-[13px] font-medium tracking-[0.03em] px-4 py-2 text-[#7f7f7f] hover:text-[#000000] hover:bg-black/5 rounded-full transition-all duration-200"
            >
              {link.name}
            </button>
          ))}
        </div>

        {/* CTA & Mobile trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => smoothScrollTo("newsletter")}
            className="btn-primary hidden md:inline-flex"
          >
            Get Involved
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-50 bg-white border-b border-[#dedede] shadow-lg py-6 px-6 flex flex-col gap-4 lg:hidden"
          >
            {[
              { name: "Core Mission", target: "mission" },
              { name: "Value Proposition", target: "values" },
              { name: "Live Simulator", target: "simulator" },
              { name: "Consortium", target: "consortium" },
              { name: "Programs", target: "programs" },
              { name: "Leadership", target: "leadership" }
            ].map((link, idx) => (
              <button
                key={idx}
                onClick={() => smoothScrollTo(link.target)}
                className="w-full text-left py-3 border-b border-[#dedede]/50 text-subheading font-medium hover:text-[#ff17e9] transition-colors"
              >
                {link.name}
              </button>
            ))}
            <button
              onClick={() => smoothScrollTo("newsletter")}
              className="btn-primary w-full mt-4 justify-center"
            >
              Get Involved
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 max-w-[1328px] mx-auto px-6 md:px-12">
        {/* ── 1. STUNNING SPLIT-LAYOUT HERO SECTION ── */}
        <section className="py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline copy */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="badge-highlight">
              <span className="pulse-dot" />
              Youth-Led Fiscal Transparency
            </div>

            <h1 className="text-heading-lg md:text-display-lg font-bold tracking-[-0.04em] leading-[0.9] text-balance">
              Kenya's Budgets. <br />
              <span className="text-[#ff17e9]" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Translated
              </span>{" "}
              for Action.
            </h1>

            <p className="text-subheading text-muted font-normal max-w-xl leading-relaxed">
              {bnsConfig.tagline} We simplify technical fiscal blueprints into relatable, evidence-based narratives, empowering the next generation to demand local accountability.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button
                onClick={() => smoothScrollTo("simulator")}
                className="btn-primary flex items-center gap-2"
              >
                Explore Live Simulator
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => smoothScrollTo("mission")}
                className="btn-outline"
              >
                Read Core Mission
              </button>
            </div>

            {/* Quick Micro-stats row */}
            <div className="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-[#dedede]">
              {bnsConfig.impact.slice(0, 3).map((stat) => (
                <div key={stat.id} className="flex flex-col">
                  <span className="text-heading font-bold text-black">{stat.value}</span>
                  <span className="text-caption text-muted uppercase font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Mockup Product visual */}
          <div className="lg:col-span-6">
            <div className="card-standard relative overflow-hidden border border-black/5 bg-slate-50/50">
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <span className="text-caption text-muted ml-2 font-medium">bns-ledger-mockup.key</span>
              </div>

              {/* Sub-tabs inside mockup */}
              <div className="mt-8 flex border-b border-[#dedede] gap-4 pb-2">
                {[
                  { id: "county", label: "County Allocations" },
                  { id: "terra", label: "Project TERRA" },
                  { id: "verification", label: "Verification Hub" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`text-caption pb-1.5 font-semibold transition-colors border-b-2 uppercase ${
                      activeTab === tab.id
                        ? "text-[#ff17e9] border-[#ff17e9]"
                        : "text-[#7f7f7f] border-transparent hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Interactive Panel within Mockup */}
              <div className="mt-6 min-h-[300px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {activeTab === "county" && (
                    <motion.div
                      key="county-mock"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-[#dedede]">
                        <span className="text-caption font-semibold">Select Target County</span>
                        <select
                          value={selectedCounty}
                          onChange={(e) => setSelectedCounty(e.target.value)}
                          className="bg-transparent border-0 text-caption font-bold text-[#ff17e9] focus:outline-none cursor-pointer"
                        >
                          {countyBudgets.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-[#dedede] flex flex-col gap-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-body-sm font-semibold">{activeCountyData.name} Allocation</span>
                          <span className="text-heading font-bold text-[#ff17e9]">
                            {activeCountyData.allocation}
                          </span>
                        </div>
                        <p className="text-body-sm text-muted">
                          {activeCountyData.explainer}
                        </p>
                      </div>

                      <div className="bg-[#ff17e9]/5 p-3.5 rounded-xl border border-[#ff17e9]/20 flex items-start gap-2.5">
                        <span className="pulse-dot mt-1.5 flex-shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold tracking-widest text-[#ff17e9] uppercase">
                            Youth Action Plan
                          </span>
                          <p className="text-caption text-black font-medium leading-snug mt-0.5">
                            {activeCountyData.action}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "terra" && (
                    <motion.div
                      key="terra-mock"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="bg-white p-4 rounded-xl border border-[#dedede] flex flex-col gap-3">
                        <span className="text-caption tracking-widest text-[#ff17e9] font-bold uppercase">
                          Project TERRA Active Brief
                        </span>
                        <h3 className="text-heading font-bold leading-tight">
                          {bnsConfig.programs[0].focus}
                        </h3>
                        <p className="text-body-sm text-muted">
                          {bnsConfig.programs[0].description}
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-xl border border-[#dedede] flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-caption font-semibold uppercase text-[#7f7f7f]">
                            Current Status
                          </span>
                          <span className="text-body font-bold text-[#ff17e9] uppercase mt-0.5">
                            {bnsConfig.programs[0].stage}
                          </span>
                        </div>
                        <button
                          onClick={() => smoothScrollTo("programs")}
                          className="btn-outline py-2 px-5 text-caption font-semibold"
                        >
                          View Program
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "verification" && (
                    <motion.div
                      key="verification-mock"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="bg-white p-4 rounded-xl border border-[#dedede] flex flex-col gap-3">
                        <span className="text-caption tracking-widest text-emerald-600 font-bold uppercase">
                          Budget Verification Hub
                        </span>
                        <h3 className="text-heading font-bold leading-tight">
                          {bnsConfig.programs[1].focus}
                        </h3>
                        <p className="text-body-sm text-muted">
                          {bnsConfig.programs[1].description}
                        </p>
                      </div>

                      <div className="bg-[#ff17e9]/5 p-4 rounded-xl border border-[#ff17e9]/10 flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-[#ff17e9] tracking-widest uppercase">
                          Action items in progress
                        </span>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-caption font-medium">
                            Verifying domestic revenue projection gaps
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-caption font-medium">
                            Drafting KSh 3.7T National budget audit explainer
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between border-t border-[#dedede] pt-4 mt-6">
                  <span className="text-[10px] text-[#7f7f7f] uppercase font-bold tracking-widest">
                    Interactive Simulator v1.0
                  </span>
                  <div className="flex items-center gap-1.5 text-caption text-[#ff17e9] font-bold uppercase cursor-pointer" onClick={() => smoothScrollTo("simulator")}>
                    <span>Launch Dashboard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. CORE MISSION & OVERVIEW (STANDARD CARDS GRID) ── */}
        <section id="mission" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-caption text-muted uppercase font-bold tracking-widest block mb-2">
              01 // Groundwork
            </span>
            <h2 className="text-heading-lg font-bold tracking-tight">
              Our Core Mandate
            </h2>
            <p className="text-subheading text-muted mt-2">
              Budget Ndio Story brings data integrity to community organizing. We replace anecdotes with public ledgers, building systemic fiscal literacy among Kenyan youth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-standard flex flex-col justify-between gap-8 bg-zinc-50 border border-black/5">
              <div className="flex flex-col gap-4">
                <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                  Our Mission
                </span>
                <p className="text-heading font-medium leading-snug">
                  {bnsConfig.mission}
                </p>
              </div>
              <div className="flex items-center gap-2 text-caption text-muted uppercase font-semibold">
                <Building2 className="w-4 h-4 text-[#ff17e9]" />
                <span>BNS Core Mandate</span>
              </div>
            </div>

            <div className="card-standard flex flex-col justify-between gap-8 bg-zinc-50 border border-black/5">
              <div className="flex flex-col gap-4">
                <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                  Overview Summary
                </span>
                <p className="text-body text-muted leading-relaxed">
                  {bnsConfig.overview}
                </p>
                <p className="text-body text-muted leading-relaxed">
                  Our youth chapter consortium consists of creators, policy researchers, events organizers, and on-ground campus auditors driving structural accountability across 47 counties.
                </p>
              </div>
              <div className="flex items-center gap-2 text-caption text-muted uppercase font-semibold">
                <Users className="w-4 h-4 text-[#ff17e9]" />
                <span>Consortium Synergy</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. VALUE PROPOSITION (ASYMMETRIC SECTION GRID) ── */}
        <section id="values" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-caption text-muted uppercase font-bold tracking-widest block mb-2">
              02 // Value Proposition
            </span>
            <h2 className="text-heading-lg font-bold tracking-tight">
              Bridging the Informational Gap
            </h2>
            <p className="text-subheading text-muted mt-2">
              How we dismantle structural complexity, translate fiscal codes, and empower ordinary citizens to actively participate in public spending decisions.
            </p>
          </div>

          {/* Asymmetric layout sections */}
          <div className="flex flex-col gap-12">
            {/* Split row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-7 bg-zinc-50 rounded-2xl border border-black/5 p-12 md:p-16 flex flex-col justify-center gap-6" style={{ borderRadius: "48px 16px 16px 48px" }}>
                <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                  Translating Complexity
                </span>
                <h3 className="text-heading-lg font-bold tracking-tight leading-tight">
                  {bnsConfig.valueProposition[0]}
                </h3>
                <p className="text-body text-muted leading-relaxed">
                  We read thousands of pages of national budget policy statements, county finance bills, and auditor general reports. Then, we transform these massive PDFs into bite-sized visual explainers, TikTok/Reels segments, and beautiful interactive graphics.
                </p>
              </div>

              <div className="lg:col-span-5 bg-zinc-50 rounded-2xl border border-black/5 p-12 flex flex-col justify-between gap-8" style={{ borderRadius: "16px 48px 48px 16px" }}>
                <div className="flex flex-col gap-4">
                  <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                    Youth Capacity Building
                  </span>
                  <h3 className="text-heading font-bold leading-tight">
                    {bnsConfig.valueProposition[1]}
                  </h3>
                  <p className="text-body-sm text-muted leading-relaxed">
                    By scaling our dedicated Youth Chapters in campuses and community hubs, BNS equips community leaders with budget trackers and public participation tools to actively monitor localized county funding.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-caption text-muted uppercase font-semibold">
                  <BookOpen className="w-4 h-4 text-[#ff17e9]" />
                  <span>Educational Blueprint</span>
                </div>
              </div>
            </div>

            {/* Split row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              <div className="lg:col-span-5 bg-zinc-50 rounded-2xl border border-black/5 p-12 flex flex-col justify-between gap-8" style={{ borderRadius: "48px 16px 16px 48px" }}>
                <div className="flex flex-col gap-4">
                  <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                    Connecting Stakeholders
                  </span>
                  <h3 className="text-heading font-bold leading-tight">
                    {bnsConfig.valueProposition[2]}
                  </h3>
                  <p className="text-body-sm text-muted leading-relaxed">
                    BNS acts as a core bridge. We link youth content creators, investigative journalists, policy experts, and community members, elevating the level of public evidence and removing groundless political rhetoric.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-caption text-muted uppercase font-semibold">
                  <Users className="w-4 h-4 text-[#ff17e9]" />
                  <span>Evidence-Backed Discourse</span>
                </div>
              </div>

              <div className="lg:col-span-7 bg-zinc-50 rounded-2xl border border-black/5 p-12 md:p-16 flex flex-col justify-center gap-6" style={{ borderRadius: "16px 48px 48px 16px" }}>
                <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                  Everyday Realities
                </span>
                <h3 className="text-heading-lg font-bold tracking-tight leading-tight">
                  {bnsConfig.valueProposition[3]}
                </h3>
                <p className="text-body text-muted leading-relaxed">
                  We relate state budgets directly to cost of living, university funding models, local medical supplies, street lighting, and job creation projects. We make public spending personal, tangible, and actionable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. LIVE INTERACTIVE SIMULATOR (COUNTY & SECTOR CHART EXPLORER) ── */}
        <section id="simulator" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-caption text-muted uppercase font-bold tracking-widest block mb-2">
              03 // Live Simulator
            </span>
            <h2 className="text-heading-lg font-bold tracking-tight">
              Interactive County Budget Explorer
            </h2>
            <p className="text-subheading text-muted mt-2">
              Pick a major Kenyan county to explore their public allocations. Observe sector percentages, read simplified explainers, and access community action points.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Selector list left */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {countyBudgets.map((county) => (
                <button
                  key={county.name}
                  onClick={() => setSelectedCounty(county.name)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                    selectedCounty === county.name
                      ? "bg-black text-white border-black"
                      : "bg-zinc-50 text-black border-[#dedede] hover:bg-black/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 ${selectedCounty === county.name ? "text-[#ff17e9]" : "text-black"}`} />
                    <span className="text-body font-semibold">{county.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedCounty === county.name ? "text-[#ff17e9]" : "text-[#7f7f7f]"}`} />
                </button>
              ))}
            </div>

            {/* Display Dashboard Right */}
            <div className="lg:col-span-8 bg-zinc-50 rounded-2xl border border-[#dedede] p-8 md:p-12 flex flex-col justify-between gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 border-b border-[#dedede] pb-4">
                  <h3 className="text-heading-lg font-bold tracking-tight">
                    {activeCountyData.name}
                  </h3>
                  <span className="text-heading font-extrabold text-[#ff17e9] bg-[#ff17e9]/5 px-4 py-1.5 rounded-full border border-[#ff17e9]/20">
                    {activeCountyData.allocation} Total
                  </span>
                </div>

                <p className="text-body text-muted leading-relaxed">
                  {activeCountyData.explainer}
                </p>

                {/* Progress bars representing allocations */}
                <div className="flex flex-col gap-4 mt-4">
                  <span className="text-caption text-black uppercase font-bold tracking-widest">
                    Sector Allocations Breakdown
                  </span>
                  {activeCountyData.sectors.map((sector, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-baseline text-caption font-semibold">
                        <span>{sector.name}</span>
                        <span className="text-black font-bold">
                          {sector.amount} ({sector.pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-[#dedede] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${sector.pct}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            sector.name.includes("Youth") || sector.name.includes("Blue")
                              ? "bg-[#ff17e9]"
                              : sector.name.includes("Admin")
                              ? "bg-black/60"
                              : "bg-black"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom active chapter notice */}
              <div className="bg-[#ff17e9]/5 p-6 rounded-xl border border-[#ff17e9]/25 flex items-start gap-4">
                <span className="pulse-dot mt-2 flex-shrink-0" />
                <div className="flex flex-col gap-1">
                  <span className="text-caption font-bold text-[#ff17e9] tracking-widest uppercase">
                    Chapter Action Hub In Action
                  </span>
                  <p className="text-body-sm text-black font-semibold leading-relaxed">
                    {activeCountyData.action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. ACTIVITIES SHOWCASE (ASYMMETRIC CARD SECTION) ── */}
        <section id="activities" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-caption text-muted uppercase font-bold tracking-widest block mb-2">
              04 // What We Do
            </span>
            <h2 className="text-heading-lg font-bold tracking-tight">
              Our Core Activities
            </h2>
            <p className="text-subheading text-muted mt-2">
              Our everyday actions designed to build institutional structures and media networks for public interest policy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bnsConfig.activities.map((activity, idx) => (
              <div
                key={activity.id}
                className="card-standard flex flex-col justify-between gap-8 bg-zinc-50 border border-black/5 hover:border-[#ff17e9]/20"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activity.channels.map((chan, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] font-bold text-[#ff17e9] uppercase tracking-widest bg-[#ff17e9]/5 px-2 py-0.5 border border-[#ff17e9]/10 rounded-full"
                      >
                        {chan}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-heading font-bold leading-tight mt-2">
                    {activity.title}
                  </h3>

                  <p className="text-body-sm text-muted leading-relaxed">
                    {activity.description}
                  </p>
                </div>

                <div className="flex justify-between items-center text-caption font-bold uppercase tracking-widest border-t border-[#dedede]/50 pt-4 mt-2">
                  <span className="text-[#7f7f7f]">Activity No. 0{idx + 1}</span>
                  <div className="flex items-center gap-1 text-[#ff17e9]">
                    <span>Track Action</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. CONSORTIUM AND PARTNERS (HIGH-CONTRAST MARQUEE & GRID) ── */}
        <section id="consortium" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-caption text-muted uppercase font-bold tracking-widest block mb-2">
              05 // The Consortium
            </span>
            <h2 className="text-heading-lg font-bold tracking-tight">
              Leading Organizations
            </h2>
            <p className="text-subheading text-muted mt-2">
              {bnsConfig.consortium.summary} Meets media, technology, and public policy expertise under a single youth coalition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bnsConfig.consortium.partners.map((partner) => {
              const imageMap: Record<string, string> = {
                "sen-media-events": "/images/senmedia.png",
                "continental-pot": "/images/The-Continental-Pot-Vertical-removebg-preview.png",
                "colour-twist-media": "/images/colortwist.png"
              };
              
              const logoSrc = imageMap[partner.id] || "/logo.svg";

              return (
                <div
                  key={partner.id}
                  className="card-standard flex flex-col justify-between gap-8 bg-zinc-50 border border-black/5 hover:border-[#ff17e9]/30"
                >
                  <div className="flex flex-col gap-4">
                    <div className="relative w-full h-16 grayscale hover:grayscale-0 transition-all duration-300">
                      <Image
                        src={logoSrc}
                        alt={partner.name}
                        fill
                        className="object-contain object-left"
                      />
                    </div>

                    <h3 className="text-heading font-bold mt-2">{partner.name}</h3>
                    <p className="text-caption font-bold text-[#ff17e9] tracking-widest uppercase bg-[#ff17e9]/5 self-start px-2 py-0.5 border border-[#ff17e9]/10 rounded-full">
                      {partner.id.replace(/-/g, " ")}
                    </p>
                    
                    <p className="text-body-sm text-muted leading-relaxed mt-1">
                      {partner.role}
                    </p>
                  </div>

                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-widest text-[#ff17e9] hover:underline"
                  >
                    <span>Visit website</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 7. ACTIVE PROGRAMS SHOWCASE (STARK MINIMALIST GRID) ── */}
        <section id="programs" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-caption text-muted uppercase font-bold tracking-widest block mb-2">
              06 // Public Programs
            </span>
            <h2 className="text-heading-lg font-bold tracking-tight">
              Investigative Initiatives
            </h2>
            <p className="text-subheading text-muted mt-2">
              Explore our systematic programs designed to audit legislation, train local organizers, and establish evidence-backed journalism.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {bnsConfig.programs.map((prog, idx) => (
              <div
                key={prog.id}
                className="card-standard flex flex-col justify-between gap-8 bg-zinc-50 border border-black/5 hover:border-black/10"
              >
                <div className="flex flex-col gap-3">
                  <span className={`text-caption font-bold tracking-widest uppercase bg-transparent self-start px-3 py-1 border rounded-full ${
                    prog.stage === "active" 
                      ? "text-[#ff17e9] border-[#ff17e9]/30 bg-[#ff17e9]/5" 
                      : "text-amber-600 border-amber-600/30 bg-amber-600/5"
                  }`}>
                    {prog.stage}
                  </span>

                  <h3 className="text-heading font-extrabold mt-3">{prog.name}</h3>

                  <span className="text-caption font-bold text-black uppercase tracking-widest border-b border-[#dedede] pb-2">
                    Focus: {prog.focus}
                  </span>

                  <p className="text-body-sm text-muted leading-relaxed mt-2">
                    {prog.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-caption font-bold uppercase tracking-widest text-black border-t border-[#dedede]/50 pt-4 cursor-pointer hover:text-[#ff17e9] transition-colors" onClick={() => smoothScrollTo("newsletter")}>
                  <span>Get program updates</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 8. INVESTMENT LEADERSHIP (TEAM & ADVISORS WITH REAL AVATARS) ── */}
        <section id="leadership" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          <div className="max-w-2xl">
            <span className="text-caption text-muted uppercase font-bold tracking-widest block mb-2">
              07 // Narrative Leadership
            </span>
            <h2 className="text-heading-lg font-bold tracking-tight">
              Investigative & Production Directors
            </h2>
            <p className="text-subheading text-muted mt-2">
              Our directors, advisors, and field operations team managing public finance analysis and content operations across Kenya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Movine Omondi */}
            {bnsConfig.leadership.executive.map((exec, idx) => (
              <div
                key={idx}
                className="card-standard flex flex-col justify-between gap-6 bg-zinc-50 border border-black/5"
              >
                <div className="flex flex-col gap-4">
                  <div className="relative w-full aspect-square grayscale hover:grayscale-0 transition-all duration-300 rounded-xl overflow-hidden border border-[#dedede]">
                    <Image
                      src={exec.image}
                      alt={exec.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-heading font-bold">{exec.name}</h3>
                    <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                      {exec.role}
                    </span>
                  </div>

                  <p className="text-body-sm text-muted leading-relaxed">
                    {exec.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#dedede]/50 pt-4 mt-2">
                  {exec.socials.x && (
                    <a
                      href={exec.socials.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-caption font-bold uppercase tracking-widest text-[#ff17e9] hover:underline"
                    >
                      X (Twitter)
                    </a>
                  )}
                  {exec.socials.linkedin && (
                    <a
                      href={exec.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-caption font-bold uppercase tracking-widest text-[#ff17e9] hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Directors */}
            {bnsConfig.leadership.directors.map((dir, idx) => (
              <div
                key={idx}
                className="card-standard flex flex-col justify-between gap-6 bg-zinc-50 border border-black/5"
              >
                <div className="flex flex-col gap-4">
                  <div className="relative w-full aspect-square grayscale hover:grayscale-0 transition-all duration-300 rounded-xl overflow-hidden border border-[#dedede]">
                    <Image
                      src={dir.image}
                      alt={dir.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-heading font-bold">{dir.name}</h3>
                    <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                      {dir.role}
                    </span>
                  </div>

                  <p className="text-body-sm text-muted leading-relaxed">
                    {dir.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#dedede]/50 pt-4 mt-2">
                  <span className="text-caption text-muted font-bold uppercase tracking-widest">
                    BNS BOARD MEMBER
                  </span>
                </div>
              </div>
            ))}

            {/* Operations */}
            {bnsConfig.leadership.operations.map((op, idx) => (
              <div
                key={idx}
                className="card-standard flex flex-col justify-between gap-6 bg-zinc-50 border border-black/5"
              >
                <div className="flex flex-col gap-4">
                  <div className="relative w-full aspect-square grayscale hover:grayscale-0 transition-all duration-300 rounded-xl overflow-hidden border border-[#dedede]">
                    <Image
                      src={op.image}
                      alt={op.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 350px"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-heading font-bold">{op.name}</h3>
                    <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                      {op.role}
                    </span>
                  </div>

                  <p className="text-body-sm text-muted leading-relaxed">
                    {op.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t border-[#dedede]/50 pt-4 mt-2">
                  <span className="text-caption text-[#ff17e9] font-bold uppercase tracking-widest">
                    Budget Mtaani Podcast
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 9. DYNAMIC ACTION CAPTURE (NEWSLETTER FORM WITH STYLISH STATUS) ── */}
        <section id="newsletter" className="py-24 border-t border-[#dedede] flex flex-col gap-12">
          {/* Asymmetric Section Card with generous 80px padding and unique rounding */}
          <div className="card-asymmetric-right bg-zinc-50 border border-black/5 p-8 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#ff17e9]/5 blur-3xl" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#ff17e9]/5 blur-3xl" />

            <div className="max-w-xl relative z-10 flex flex-col gap-4">
              <span className="text-caption text-[#ff17e9] uppercase font-bold tracking-widest flex items-center gap-2">
                <span className="pulse-dot" />
                Join the Movement
              </span>
              <h2 className="text-heading-lg font-bold tracking-tight">
                Receive the Weekly Budget Story
              </h2>
              <p className="text-body text-muted leading-relaxed">
                Stay updated with simplified national and county policy updates, private invitations to podcast sessions, community scorecards, and local civic events in your area.
              </p>
            </div>

            <div className="w-full lg:max-w-md relative z-10">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="input-field text-body"
                  />
                  <span className="text-caption text-muted pl-4">
                    We respect your privacy. No spam. Unsubscribe anytime.
                  </span>
                </div>

                <button type="submit" className="btn-primary w-full justify-center">
                  Join Newsletter
                </button>
              </form>

              {/* Status popup */}
              <AnimatePresence>
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 p-4 bg-black text-white rounded-xl border border-black flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#ff17e9] flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-caption font-bold text-[#ff17e9] uppercase tracking-widest">
                        Welcome Aboard
                      </span>
                      <span className="text-body-sm font-medium">
                        You've successfully subscribed to the Sunday Edition.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* ── 10. PREMIUM STARK MINIMALIST FOOTER ── */}
        <footer className="py-16 border-t border-[#dedede] mt-12 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo & credits */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <span
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="font-extrabold text-2xl tracking-[-0.05em] cursor-pointer"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              BUDGET NDIO STORY
            </span>
            <p className="text-body-sm text-muted leading-relaxed max-w-sm">
              We translate public finance blueprints into accessible, youth-led civic action. Driving transparency, accountability, and evidence-backed discourse across Kenya.
            </p>
            <div className="flex items-center gap-3">
              {bnsConfig.platforms.slice(0, 5).map((plat, idx) => (
                <a
                  key={idx}
                  href={plat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caption font-bold uppercase tracking-widest text-[#ff17e9] hover:underline"
                >
                  {plat.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-caption text-black font-bold uppercase tracking-widest">
                Consortium partners
              </span>
              <div className="flex flex-col gap-2">
                {bnsConfig.consortium.partners.map((p) => (
                  <a
                    key={p.id}
                    href={p.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-body-sm text-muted hover:text-black transition-colors"
                  >
                    {p.name}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-caption text-black font-bold uppercase tracking-widest">
                Public References
              </span>
              <div className="flex flex-col gap-2">
                {bnsConfig.references.publicPages.map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => smoothScrollTo("mission")}
                    className="text-body-sm text-muted text-left hover:text-black transition-colors"
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
              <span className="text-caption text-black font-bold uppercase tracking-widest">
                Share this page
              </span>
              <p className="text-caption text-muted">
                Copy the link below to invite creators, journalists, and policy builders.
              </p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleCopyLink("https://budgetndiostory.org/sunday")}
                  className="btn-outline py-2.5 px-4 text-caption font-semibold flex items-center gap-2 w-full justify-center"
                >
                  <span>{copiedText || "Copy URL Link"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-12 border-t border-[#dedede]/50 pt-8 mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-caption text-muted">
            <span>
              &copy; {new Date().getFullYear()} {bnsConfig.legalName}. All Rights Reserved.
            </span>
            <div className="flex items-center gap-4">
              <span>Locale: {bnsConfig.locale}</span>
              <span>Country: {bnsConfig.country}</span>
              <span>Seed v{bnsConfig.seedVersion}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
