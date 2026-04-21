"use client";

import { useState } from 'react'
import { cn } from "@/utils";
import {
    HelpCircle, ChevronDown, ChevronRight, ArrowRight, FileText, Building2, TrendingUp, 
    AlertTriangle, DollarSign, Wallet, Menu, X, ArrowUpRight, ArrowDownRight,
    Play, Volume2, BookOpen, Folder, Download, BarChart3, Clock, ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";

type LearnMode = 'video' | 'audio' | 'article' | 'story' | 'docs'

const bpsVideos = [
  { id: 'intro', title: 'Introduction to BPS', duration: '4:32', url: 'https://www.youtube.com/embed/A_EXLueEMlk' },
  { id: 'pillars', title: 'BETA Agenda Pillars Explained', duration: '8:15', url: 'https://www.youtube.com/embed/jLZe3iPSMfc' },
  { id: 'numbers', title: 'Budget Numbers Deep Dive', duration: '6:48', url: 'https://www.youtube.com/embed/KeNCrx6krl0' },
  { id: 'risks', title: 'Fiscal Risks Analysis', duration: '5:22', url: 'https://www.youtube.com/embed/SfPwtqUFyj4' },
]

const budgetData = [
  { year: '2022/23', revenue: 2.14, expenditure: 2.79, deficit: 0.65 },
  { year: '2023/24', revenue: 2.44, expenditure: 3.42, deficit: 0.98 },
  { year: '2024/25', revenue: 2.70, expenditure: 3.67, deficit: 0.97 },
  { year: '2025/26', revenue: 3.37, expenditure: 4.30, deficit: 0.93 },
  { year: '2026/27', revenue: 3.59, expenditure: 4.74, deficit: 1.15 },
]

const debtBreakdown = [
  { label: 'Domestic Debt', value: 924, color: 'bg-blue-500' },
  { label: 'Foreign Debt', value: 225.5, color: 'bg-teal-500' },
]

const pillarData = [
  { name: 'Agriculture', allocation: 68.5, growth: 12 },
  { name: 'MSMEs', allocation: 52.3, growth: 18 },
  { name: 'Healthcare', allocation: 47.8, growth: 15 },
  { name: 'Housing', allocation: 38.2, growth: 8 },
  { name: 'Digital', allocation: 28.4, growth: 22 },
]

const documents = [
  { name: 'BPS 2026 Full Document', type: 'PDF', size: '2.4 MB' },
  { name: 'BETA Implementation Plan', type: 'PDF', size: '1.8 MB' },
  { name: 'County Allocation Guidelines', type: 'PDF', size: '0.9 MB' },
  { name: 'Fiscal Risk Statement', type: 'PDF', size: '1.2 MB' },
  { name: 'Revenue Administration', type: 'PDF', size: '0.7 MB' },
  { name: 'Budget Procedure Manual', type: 'PDF', size: '3.1 MB' },
]

const storyChapters = [
  { id: 1, title: 'The Blueprint', emoji: '🚪', duration: '3 min' },
  { id: 2, title: 'The BETA Journey', emoji: '🚀', duration: '4 min' },
  { id: 3, title: 'Counties Get Their Share', emoji: '🏛️', duration: '2 min' },
  { id: 4, title: 'The Numbers Game', emoji: '💰', duration: '3 min' },
  { id: 5, title: 'Watching the Risks', emoji: '⚡', duration: '2 min' },
]

import { useEffect, useRef } from 'react'

interface DataCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'up' | 'down'
  prefix?: string
  suffix?: string
}

function AnimatedNumber({ target, prefix = '', suffix = '' }: { target: string; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0)
  const targetNum = parseFloat(target.replace(/[^0-9.]/g, ''))
  const hasDecimal = target.includes('.')
  const rafRef = useRef<number>(0)
  
  useEffect(() => {
    const duration = 1500
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(eased * targetNum)
      
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }
    
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [targetNum])
  
  return (
    <>{prefix}{hasDecimal ? display.toFixed(2) : Math.round(display)}{suffix}</>
  )
}

function DataCard({ label, value, change, changeType, prefix = '', suffix = '' }: DataCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-sm overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="text-[10px] text-foreground/40 uppercase tracking-widest font-medium mb-2">{label}</div>
        <div className="text-3xl font-bold tracking-tight">
          <AnimatedNumber target={value.replace(/[^0-9.]/g, '')} prefix={prefix} suffix={suffix} />
        </div>
        {change && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn("mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", 
              changeType === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}
          >
            {changeType === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {change}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function BarGraph({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm">
            <span className="text-foreground/60 font-medium">{item.label}</span>
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="font-bold tabular-nums"
            >
              KES {item.value}T
            </motion.span>
          </div>
          <div className="relative h-10 rounded-xl bg-white/[0.05] overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 0.8, delay: idx * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-2 left-0 rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-teal-400" />
              <motion.div 
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              style={{ transformOrigin: 'left' }}
              className="absolute inset-0 border border-white/10 rounded-xl"
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {data.map((item, idx) => {
            const percentage = (item.value / total) * 100
            const radius = 40
            const circumference = 2 * Math.PI * radius
            const strokeDashoffset = circumference - (percentage / 100) * circumference
            
            return (
              <motion.circle
                key={idx}
                cx="50"
                cy="50"
                r={radius - idx * 3}
                fill="none"
                stroke={item.color.replace('bg-', '').replace('-500', '').replace('blue', '#3b82f6').replace('teal', '#14b8a6')}
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, delay: idx * 0.2, ease: 'easeOut' }}
                className="drop-shadow-lg"
                style={{
                  filter: `drop-shadow(0 0 8px ${item.color.replace('bg-', '').replace('-500', '').replace('blue', 'rgba(59,130,246,0.5)').replace('teal', 'rgba(20,184,166,0.5)')})`,
                }}
              />
            )
          })}
        </svg>
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-xs text-foreground/40 uppercase tracking-widest">Total</div>
            <div className="text-2xl font-bold tabular-nums">KES</div>
            <div className="text-lg font-semibold tabular-nums">{total.toFixed(1)}B</div>
          </div>
        </motion.div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-xs">
        {data.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + idx * 0.1 }}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5"
          >
            <div className={cn("w-3 h-3 rounded-full shadow-lg", item.color)} />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] text-foreground/40 truncate">{item.label}</div>
              <div className="text-sm font-semibold tabular-nums">KES {item.value}B</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function Research() {
  const [mode, setMode] = useState<LearnMode>('article')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sidebarTab, setSidebarTab] = useState<'modes' | 'docs'>('modes')
  
  return (
    <section className="relative w-full min-h-screen bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 blur-[120px] rounded-full" 
        />
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/10 md:hidden"
      >
        <Menu className="size-5" />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -320 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-black/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">Learning Hub</h2>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
              <X className="size-4" />
            </button>
          </div>
          
          {/* Mode Tabs - Scrollable on mobile */}
          <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto">
            {[
              { id: 'article', label: 'Article', icon: FileText, color: 'text-blue-400' },
              { id: 'video', label: 'Videos', icon: Play, color: 'text-red-400' },
              { id: 'audio', label: 'Audio', icon: Volume2, color: 'text-purple-400' },
              { id: 'story', label: 'Stories', icon: BookOpen, color: 'text-amber-400' },
              { id: 'docs', label: 'Documents', icon: Folder, color: 'text-teal-400' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => { setMode(item.id as LearnMode); setSidebarOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all",
                    mode === item.id ? "bg-white/10" : "hover:bg-white/5"
                  )}
                >
                  <Icon className={cn("size-5", mode === item.id ? item.color : "text-foreground/50")} />
                  <span className={cn("text-sm", mode === item.id ? "font-medium" : "text-foreground/60")}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Document Repository */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">Document Repository</h3>
          <div className="space-y-2">
            {documents.map((doc, idx) => (
              <a
                key={idx}
                href="https://drive.google.com/drive/folders/1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <FileText className="size-4 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{doc.name}</div>
                  <div className="text-xs text-foreground/50">{doc.type} • {doc.size}</div>
                </div>
                <Download className="size-4 text-foreground/30" />
              </a>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <Wrapper className="w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center pt-12 md:pt-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
              <BarChart3 className="size-3.5" /><span>Research & Analysis</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight mb-4 px-2">
              Kenya's Budget Policy Statement 2026
            </h1>
            <p className="text-foreground/60 max-w-2xl mx-auto text-sm sm:text-base px-4">
              A comprehensive analysis of Kenya's fiscal roadmap for FY 2026/27, examining the BETA Agenda, 
              budget allocations, and fiscal risks facing the nation's economy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 text-xs sm:text-sm text-foreground/50 px-4">
              <span className="flex items-center gap-1"><Clock className="size-3 sm:size-4" /> Updated April 2026</span>
              <span>•</span>
              <span>By Millicent Makini</span>
            </div>
          </motion.div>

          {/* Mode Content */}
          <AnimatePresence mode="wait">
            {/* ARTICLE MODE */}
            {mode === 'article' && (
              <motion.div
                key="article"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <DataCard label="Total Revenue" value="KES 3.59T" change="+6.5%" changeType="up" prefix="KES " suffix="T" />
                  <DataCard label="Total Expenditure" value="KES 4.74T" change="+10.1%" changeType="up" prefix="KES " suffix="T" />
                  <DataCard label="Fiscal Deficit" value="KES 1.15T" change="+23.7%" changeType="down" prefix="KES " suffix="T" />
                  <DataCard label="Debt Interest" value="KES 1.2T" change="+8.2%" changeType="down" prefix="KES " suffix="T" />
                </div>

                {/* Budget Trend Graph */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Budget Trend (KES Trillion)</h3>
                  <BarGraph 
                    data={budgetData.map(d => ({ label: d.year, value: d.expenditure }))}
                    maxValue={5}
                  />
                </div>

                {/* Executive Summary */}
                <div className="typography">
                  <h2>Executive Summary</h2>
                  <p>
                    The Budget Policy Statement (BPS) 2026 represents a pivotal moment in Kenya's fiscal 
                    trajectory. With a total budget of KES 4.74 trillion, the government continues its 
                    commitment to the Bottom-Up Economic Transformation Agenda (BETA) while addressing 
                    emerging fiscal challenges.
                  </p>
                  
                  <h3>Key Highlights</h3>
                  <ul>
                    <li>Revenue target of KES 3.59 trillion represents a 6.5% increase from FY 2025/26</li>
                    <li>Fiscal deficit of KES 1.15 trillion (3.0% of GDP) - financed through borrowing</li>
                    <li>County allocation increased to KES 420 billion (+KES 5 billion)</li>
                    <li>Interest payments on public debt consume KES 1.2 trillion - 25% of revenue</li>
                  </ul>

                  <h2>The BETA Agenda</h2>
                  <p>
                    The Bottom-Up Economic Transformation Agenda remains the cornerstone of government policy, 
                    focusing on five key pillars:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose my-8">
                    {pillarData.map((pillar, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="group relative p-5 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 overflow-hidden"
                      >
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <div className="relative">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-lg">{pillar.name}</span>
                            <motion.span 
                              whileHover={{ scale: 1.1 }}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium"
                            >
                              <ArrowUpRight className="size-3" />
                              +{pillar.growth}%
                            </motion.span>
                          </div>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1 + 0.2 }}
                            className="text-3xl font-bold tracking-tight"
                          >
                            KES {pillar.allocation}B
                          </motion.div>
                          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(pillar.allocation / 70) * 100}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.1 + 0.3 }}
                              className="h-full bg-gradient-to-r from-primary to-teal-400 rounded-full"
                            />
                          </div>
                          <div className="mt-2 text-xs text-foreground/40">allocated for FY 2026/27</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <h2>Debt Sustainability</h2>
                  <p>
                    Interest payments on public debt now consume a significant share of government revenue. 
                    The graphic below shows how the deficit is financed:
                  </p>
                  
                  <div className="not-prose my-6">
                    <DonutChart data={debtBreakdown} />
                  </div>

                  <h2>Fiscal Risks</h2>
                  <p>The BPS identifies five key fiscal risks that could impact Kenya's fiscal sustainability:</p>
                  <div className="not-prose my-6 grid gap-3">
                    {[
                      { icon: AlertTriangle, title: 'Public Debt Risk', desc: 'Rising debt levels create interest payment pressures', color: 'text-red-400', bg: 'bg-red-500/20' },
                      { icon: Building2, title: 'Contingent Liabilities', desc: 'State-owned enterprises may require bailouts', color: 'text-orange-400', bg: 'bg-orange-500/20' },
                      { icon: TrendingUp, title: 'Macroeconomic Risks', desc: 'Exchange rate and inflation shocks', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
                      { icon: DollarSign, title: 'Climate Change', desc: 'Droughts and floods affecting revenue', color: 'text-amber-400', bg: 'bg-amber-500/20' },
                      { icon: Wallet, title: 'Devolution Pressures', desc: 'Increased county government demands', color: 'text-blue-400', bg: 'bg-blue-500/20' },
                    ].map((risk, idx) => {
                      const Icon = risk.icon
                      return (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-colors"
                        >
                          <div className={cn("p-2.5 rounded-xl", risk.bg)}>
                            <Icon className={cn("size-5", risk.color)} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{risk.title}</h4>
                            <p className="text-sm text-foreground/50">{risk.desc}</p>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIDEO MODE */}
            {mode === 'video' && (
              <motion.div
                key="video"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Video Series</h2>
                <div className="space-y-4">
                  {bpsVideos.map((video, idx) => (
                    <button
                      key={video.id}
                      onClick={() => setCurrentVideo(idx)}
                      className={cn(
                        "w-full p-4 rounded-xl bg-white/5 border border-white/10 text-left flex items-center gap-4 hover:bg-white/10 transition-all",
                        currentVideo === idx && "border-primary bg-primary/10"
                      )}
                    >
                      <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Play className="size-6 text-primary ml-1" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{video.title}</div>
                        <div className="text-sm text-foreground/50">{video.duration}</div>
                      </div>
                      <ChevronRight className="size-5 text-foreground/30" />
                    </button>
                  ))}
                </div>

                {/* Video Player */}
                <div className="aspect-video rounded-2xl bg-black overflow-hidden relative">
                  <iframe
                    src={`${bpsVideos[currentVideo].url}?autoplay=0`}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </motion.div>
            )}

            {/* AUDIO MODE */}
            {mode === 'audio' && (
              <motion.div
                key="audio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Audio Guides</h2>
                <p className="text-foreground/60">Listen to our podcast series on the Budget Policy Statement.</p>
                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
                  <Volume2 className="size-12 text-foreground/30 mx-auto mb-4" />
                  <p className="text-foreground/50">Audio content coming soon</p>
                </div>
              </motion.div>
            )}

            {/* STORY MODE */}
            {mode === 'story' && (
              <motion.div
                key="story"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Interactive Stories</h2>
                <p className="text-foreground/60">Swipe through interactive lessons and test your knowledge.</p>
                <Link href="/learn">
                  <Button size="lg" className="h-12 px-8 rounded-xl">
                    Launch Story Mode <Play className="size-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* DOCS MODE */}
            {mode === 'docs' && (
              <motion.div
                key="docs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold">Document Repository</h2>
                <a 
                  href="https://drive.google.com/drive/folders/1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <Folder className="size-10 text-primary" />
                    <div className="flex-1">
                      <div className="font-semibold">Google Drive Repository</div>
                      <div className="text-sm text-foreground/60">Official budget documents and resources</div>
                    </div>
                    <ExternalLink className="size-5 text-foreground/30" />
                  </div>
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="pt-8 border-t border-white/5 text-center text-sm text-foreground/30">
            <p>© 2026 Budget Ndio Story. Research & Analysis.</p>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}