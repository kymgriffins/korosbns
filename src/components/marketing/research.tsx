"use client";

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from "@/utils";
import {
    HelpCircle, ChevronDown, ChevronRight, ArrowRight, FileText, Building2, TrendingUp, 
    AlertTriangle, DollarSign, Wallet, Menu, X, ArrowUpRight, ArrowDownRight,
    Play, Volume2, BookOpen, Folder, Download, BarChart3, Clock, ExternalLink,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from "motion/react";
import type { MotionValue } from "motion";
import Link from "next/link";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { Button } from "@/ui/button";
import { fetchDocumentsFromAPI, DocumentType } from "@/constants/documents";

type LearnMode = 'video' | 'audio' | 'article' | 'story' | 'docs'

const bpsVideos = [
  { id: 'intro', title: 'Introduction to BPS', duration: '4:32', url: 'https://www.youtube-nocookie.com/embed/Ed9lP0-komE' },
  { id: 'pillars', title: 'BETA Agenda Pillars Explained', duration: '8:15', url: 'https://www.youtube-nocookie.com/embed/wkPe3sWomoA' },
  { id: 'numbers', title: 'Budget Numbers Deep Dive', duration: '6:48', url: 'https://www.youtube-nocookie.com/embed/FkgRz4v2Llk' },
  { id: 'risks', title: 'Fiscal Risks Analysis', duration: '5:22', url: 'https://www.youtube-nocookie.com/embed/Ed9lP0-komE' },
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

const sections = [
  { id: 'executive-summary', title: 'Executive Summary', label: '01' },
  { id: 'beta-agenda', title: 'The BETA Agenda', label: '02' },
  { id: 'revenue-expenditure', title: 'Revenue & Expenditure', label: '03' },
  { id: 'debt-sustainability', title: 'Debt Sustainability', label: '04' },
  { id: 'fiscal-risks', title: 'Fiscal Risks', label: '05' },
  { id: 'conclusion', title: 'Conclusion', label: '06' },
]

// Fallback documents if API is unavailable
const fallbackDocuments = [
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

interface RevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  threshold?: number
}

function Reveal({ children, delay = 0, direction = 'up', threshold = 0.1 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const transforms = {
    up: useTransform(scrollYProgress, [0, 1], [32, 0]),
    down: useTransform(scrollYProgress, [0, 1], [-32, 0]),
    left: useTransform(scrollYProgress, [0, 1], [-32, 0]),
    right: useTransform(scrollYProgress, [0, 1], [32, 0])
  }
  
  const opacity = useTransform(scrollYProgress, [0, threshold], [0, 1])
  const transform = transforms[direction]
  
  return (
    <motion.div
      ref={ref}
      style={{ opacity, transform }}
      transition={{ 
        opacity: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        transform: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }
      }}
    >
      {children}
    </motion.div>
  )
}

interface ParallaxLayerProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

function ParallaxLayer({ children, speed = 0.2, className }: ParallaxLayerProps) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, speed * 1000])
  
  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface PullQuoteProps {
  text: string
  attribution?: string
}

function PullQuote({ text, attribution }: PullQuoteProps) {
  return (
    <Reveal direction="right" delay={0.1}>
      <blockquote className="my-10 p-6 pl-8 border-l-4 border-primary/80 bg-primary/5 rounded-r-lg">
        <span className="text-4xl text-primary/60 leading-none align-middle mr-2">"</span>
        <span className="text-lg italic text-foreground/80 leading-relaxed">{text}</span>
        {attribution && (
          <cite className="block mt-3 text-xs text-foreground/40 uppercase tracking-widest">
            — {attribution}
          </cite>
        )}
      </blockquote>
    </Reveal>
  )
}

interface SectionHeadingProps {
  id: string
  label: string
  title: string
}

function SectionHeading({ id, label, title }: SectionHeadingProps) {
  return (
    <Reveal direction="up">
      <div id={id} className="scroll-mt-20 pt-14 mb-6">
        <div className="text-[10px] text-primary uppercase tracking-widest font-medium mb-2">
          {label}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold border-b border-white/10 pb-4">
          {title}
        </h2>
      </div>
    </Reveal>
  )
}

interface ProgressBarProps {
  progress: MotionValue<number>
}

function ProgressBar({ progress }: ProgressBarProps) {
  const scaleX = useSpring(progress, { stiffness: 100, damping: 30 })
  
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-0.5 bg-primary/80 origin-left z-50"
    />
  )
}

interface TOCProps {
  sections: { id: string; title: string; label: string }[]
  activeSection: string
}

function TOC({ sections, activeSection }: TOCProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-end gap-1 z-40"
      >
        {sections.map((section) => {
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              title={section.title}
              className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-1 transition-all"
            >
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 8 }}
                className="text-[10px] text-primary uppercase tracking-widest whitespace-nowrap"
              >
                {section.title}
              </motion.span>
              <motion.span
                animate={{ 
                  width: isActive ? 24 : 8,
                  backgroundColor: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.2)'
                }}
                className="h-0.5 rounded-full"
              />
            </button>
          )
        })}
      </motion.div>

      <motion.button
        layoutId="toc-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="lg:hidden fixed bottom-20 right-6 z-40 bg-background/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl min-w-[220px]"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => { scrollTo(section.id); setIsOpen(false) }}
                className="flex items-center gap-3 w-full p-2 border-b border-white/5 last:border-0"
              >
                <span className="text-[10px] text-foreground/40 w-5">{section.label}</span>
                <span className={cn("text-sm", activeSection === section.id ? "text-primary font-medium" : "text-foreground/60")}>
                  {section.title}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}



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

function LineChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  const width = 400
  const height = 200
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  
  const points = data.map((item, idx) => ({
    x: padding.left + (idx / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight - (item.value / maxValue) * chartHeight,
    value: item.value,
    label: item.label
  }))
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
  
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[300px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const y = padding.top + (i / 4) * chartHeight
          const value = maxValue - (i / 4) * maxValue
          return (
            <g key={i}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-foreground/40 text-[10px]">{value.toFixed(1)}T</text>
            </g>
          )
        })}
        
        {/* Area fill */}
        <motion.path
          d={areaD}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        
        {/* Data points */}
        {points.map((point, idx) => (
          <motion.g key={idx}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="0"
              fill="#3b82f6"
              initial={{ r: 0 }}
              animate={{ r: 6 }}
              transition={{ delay: idx * 0.1 + 0.8, type: 'spring', stiffness: 200 }}
              className="drop-shadow-lg"
            />
            <motion.circle
              cx={point.x}
              cy={point.y}
              r="0"
              fill="#1e40af"
              initial={{ r: 0 }}
              animate={{ r: 3 }}
              transition={{ delay: idx * 0.1 + 1 }}
            />
            <motion.text
              x={point.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-foreground/50 text-[10px] font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 + 1 }}
            >
              {point.label}
            </motion.text>
            <motion.g
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 1.2 }}
            >
              <rect x={point.x - 24} y={point.y - 28} width={48} height={20} rx={4} className="fill-background/95 stroke-primary/20" strokeWidth="1" />
              <text x={point.x} y={point.y - 14} textAnchor="middle" className="fill-primary text-[10px] font-semibold">
                {point.value}T
              </text>
            </motion.g>
          </motion.g>
        ))}
      </svg>
      
      <div className="flex justify-center gap-4 mt-4 text-xs text-foreground/50">
        <span className="flex items-center gap-2">
          <span className="w-3 h-0.5 bg-primary rounded-full" />
          Expenditure (KES Trillion)
        </span>
      </div>
    </div>
  )
}

interface DonutSlice {
  d: string
  percentage: number
  color: string
  label: string
  value: number
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum: number, item) => sum + item.value, 0)
  const size = 180
  const center = size / 2
  const radius = 70
  const innerRadius = 45
  
  const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']
  
  const slices: DonutSlice[] = data.map((item: { label: string; value: number; color: string }, idx: number) => {
    const percentage = (item.value / total) * 100
    let startAngle = 0
    for (let i = 0; i < idx; i++) {
      startAngle += (data[i].value / total) * 360
    }
    const endAngle = startAngle + percentage * 3.6
    
    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (endAngle - 90) * (Math.PI / 180)
    
    const x1 = center + radius * Math.cos(startRad)
    const y1 = center + radius * Math.sin(startRad)
    const x2 = center + radius * Math.cos(endRad)
    const y2 = center + radius * Math.sin(endRad)
    
    const ix1 = center + innerRadius * Math.cos(startRad)
    const iy1 = center + innerRadius * Math.sin(startRad)
    const ix2 = center + innerRadius * Math.cos(endRad)
    const iy2 = center + innerRadius * Math.sin(endRad)
    
    const largeArc = percentage > 50 ? 1 : 0
    
    const d = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z'
    ].join(' ')
    
    return { d, percentage, color: colors[idx % colors.length], label: item.label, value: item.value }
  })
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={size} height={size} className="drop-shadow-xl">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
            </filter>
          </defs>
          
          {slices.map((slice: DonutSlice, idx: number) => (
            <motion.path
              key={idx}
              d={slice.d}
              fill={slice.color}
              initial={{ scale: 0, originX: center, originY: center }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05, originX: center, originY: center }}
              filter="url(#shadow)"
              className="cursor-pointer"
            />
          ))}
          
          <motion.circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: 'spring' }}
            className="fill-background"
          />
          
          <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
            <text x={center} y={center - 6} textAnchor="middle" className="fill-primary font-bold text-lg">KES</text>
            <text x={center} y={center + 14} textAnchor="middle" className="fill-foreground text-xl font-bold">{total.toFixed(1)}B</text>
          </motion.g>
        </svg>
      </div>
      
      <div className="mt-8 space-y-3 w-full max-w-[200px]">
        {slices.map((slice: DonutSlice, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: slice.color }} />
              <span className="text-xs text-foreground/70">{slice.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">{slice.value}B</span>
              <span className="text-[10px] text-primary/80 font-medium">{slice.percentage.toFixed(0)}%</span>
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
  const [activeSection, setActiveSection] = useState(sections[0].id)
  const [repoDocs, setRepoDocs] = useState<DocumentType[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    async function loadDocs() {
      try {
        const { documents: fetchedDocs } = await fetchDocumentsFromAPI()
        if (fetchedDocs && fetchedDocs.length > 0) {
          setRepoDocs(fetchedDocs)
        }
      } catch (err) {
        console.error("Error fetching docs:", err)
      } finally {
        setLoadingDocs(false)
      }
    }
    loadDocs()
  }, [])
  
  const { scrollYProgress } = useScroll()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0])
  const heroY = useTransform(heroScroll, [0, 1], [0, 200])
  
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-30% 0px -60% 0px'
    }
    
    const observers = sections.map((section) => {
      const el = document.getElementById(section.id)
      if (!el) return null
      
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(section.id)
        }
      }, observerOptions)
      
      obs.observe(el)
      return obs
    })
    
    return () => observers.forEach((o) => o?.disconnect())
  }, [])

  return (
    <section className="relative w-full min-h-screen bg-background">
      <ProgressBar progress={scrollYProgress} />
      
      {/* Hero Section with Parallax */}
      <div ref={heroRef} className="relative h-[85vh] min-h-[520px] overflow-hidden touch-none">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/80"
        />
        
        <ParallaxLayer speed={-0.1} className="absolute inset-0 pointer-events-none">
          <svg className="absolute top-[10%] right-[5%] w-72 h-72 opacity-[0.08]" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="120" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            <circle cx="150" cy="150" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
            <circle cx="150" cy="150" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary" />
          </svg>
        </ParallaxLayer>
        
        <ParallaxLayer speed={-0.05} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[-5%] w-[60%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent -rotate-15" />
        </ParallaxLayer>
        
        <div className="relative z-10 h-full flex flex-col justify-end p-8 sm:p-12 lg:p-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 text-[10px] text-primary uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-primary" />
              Research & Analysis · April 2026
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight mb-6 text-primary-foreground">
              Kenya's Budget<br />
              Policy Statement<br />
              <span className="text-primary/80">2026</span>
            </h1>
            
            <p className="text-lg text-primary-foreground/70 max-w-xl mb-8 leading-relaxed">
              An examination of Kenya's fiscal roadmap — the BETA Agenda, revenue pressures, 
              debt sustainability, and the structural risks ahead.
            </p>
            
            <div className="flex items-center gap-4 text-sm text-primary-foreground/50">
              <span>By Millicent Makini</span>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span>14 min read</span>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span>{sections.length} sections</span>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* TOC */}
      <TOC sections={sections} activeSection={activeSection} />

      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none touch-none">
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
            {loadingDocs ? (
              [1,2,3].map(i => (
                <div key={i} className="h-12 w-full bg-white/5 animate-pulse rounded-lg" />
              ))
            ) : repoDocs.length > 0 ? (
              repoDocs.flatMap(cat => cat.files).slice(0, 10).map((doc, idx) => (
                <a
                  key={idx}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <FileText className="size-4 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate">{doc.name}</div>
                    <div className="text-xs text-foreground/50">PDF • {(doc.size / 1024 / 1024).toFixed(1)} MB</div>
                  </div>
                  <Download className="size-4 text-foreground/30" />
                </a>
              ))
            ) : (
              fallbackDocuments.map((doc, idx) => (
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
              ))
            )}
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
                <Reveal direction="up">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <DataCard label="Total Revenue" value="KES 3.59T" change="+6.5%" changeType="up" prefix="KES " suffix="T" />
                    <DataCard label="Total Expenditure" value="KES 4.74T" change="+10.1%" changeType="up" prefix="KES " suffix="T" />
                    <DataCard label="Fiscal Deficit" value="KES 1.15T" change="+23.7%" changeType="down" prefix="KES " suffix="T" />
                    <DataCard label="Debt Interest" value="KES 1.2T" change="+8.2%" changeType="down" prefix="KES " suffix="T" />
                  </div>
                </Reveal>

                {/* Budget Trend Graph */}
                <Reveal delay={0.1}>
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="text-lg font-semibold mb-4">Budget Trend (KES Trillion)</h3>
                    <LineChart 
                      data={budgetData.map(d => ({ label: d.year, value: d.expenditure }))}
                      maxValue={5}
                    />
                  </div>
                </Reveal>

                {/* Executive Summary */}
                <div className="typography">
                  <SectionHeading id="executive-summary" label="01 — Overview" title="Executive Summary" />
                  
                  <Reveal>
                    <p>
                      The Budget Policy Statement (BPS) 2026 represents a pivotal moment in Kenya's fiscal 
                      trajectory. With a total budget of KES 4.74 trillion, the government continues its 
                      commitment to the Bottom-Up Economic Transformation Agenda (BETA) while addressing 
                      emerging fiscal challenges.
                    </p>
                  </Reveal>
                  
                  <Reveal delay={0.1}>
                    <h3>Key Highlights</h3>
                    <ul>
                      <li>Revenue target of KES 3.59 trillion represents a 6.5% increase from FY 2025/26</li>
                      <li>Fiscal deficit of KES 1.15 trillion (3.0% of GDP) - financed through borrowing</li>
                      <li>County allocation increased to KES 420 billion (+KES 5 billion)</li>
                      <li>Interest payments on public debt consume KES 1.2 trillion - 25% of revenue</li>
                    </ul>
                  </Reveal>

                  <PullQuote 
                    text="Interest payments consume one in every four shillings of revenue — a structural constraint that will define Kenya's fiscal room for years."
                    attribution="BPS 2026 Analysis"
                  />

                  <SectionHeading id="beta-agenda" label="02 — Policy Framework" title="The BETA Agenda" />
                  
                  <Reveal>
                    <p>
                      The Bottom-Up Economic Transformation Agenda remains the cornerstone of government policy, 
                      focusing on five key pillars:
                    </p>
                  </Reveal>
                  
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

                  <SectionHeading id="debt-sustainability" label="04 — Debt Analysis" title="Debt Sustainability" />
                  
                  <Reveal>
                    <p>
                      Interest payments on public debt now consume a significant share of government revenue. 
                      The graphic below shows how the deficit is financed:
                    </p>
                  </Reveal>
                  
                  <div className="not-prose my-6">
                    <DonutChart data={debtBreakdown} />
                  </div>

                  <PullQuote 
                    text="When a quarter of all revenue goes to debt service, the budget becomes less a plan for development and more an instrument of financial survival."
                  />

                  <SectionHeading id="fiscal-risks" label="05 — Risk Register" title="Fiscal Risks" />
                  
                  <Reveal>
                    <p>The BPS identifies five key fiscal risks that could impact Kenya's fiscal sustainability:</p>
                  </Reveal>
                  
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

                  <SectionHeading id="conclusion" label="07 — Closing Analysis" title="Conclusion" />
                  
                  <Reveal>
                    <p>
                      The BPS 2026 is a document of genuine ambition constrained by inherited reality. 
                      The BETA agenda's supply-side logic is sound, and the revenue trajectory gives 
                      reason for measured optimism. But the structural burden of debt service, the 
                      widening deficit, and the clustering of fiscal risks demand more than good intentions.
                    </p>
                  </Reveal>

                  <PullQuote 
                    text="The budget is ultimately a moral document. It reveals what a society truly values, not what it aspires to value."
                    attribution="Millicent Makini, April 2026"
                  />
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
                    className="absolute inset-0 w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Document Repository</h2>
                  <a 
                    href="https://api.budgetndiostory.org/docrepository/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    Browse API Root <ExternalLink className="size-3" />
                  </a>
                </div>

                {loadingDocs ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="h-24 bg-white/5 animate-pulse rounded-2xl" />
                    ))}
                  </div>
                ) : repoDocs.length > 0 ? (
                  <div className="space-y-8">
                    {repoDocs.map((category) => (
                      <div key={category.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Folder className="size-5 text-primary" />
                          <h3 className="font-semibold text-lg">{category.fullName}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {category.files.map((doc, idx) => (
                            <a
                              key={idx}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/30 transition-all"
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/20 text-primary">
                                  <FileText className="size-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                    {doc.name}
                                  </div>
                                  <div className="text-xs text-foreground/40 mt-1">
                                    PDF • {(doc.size / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </div>
                                <Download className="size-4 text-foreground/20 group-hover:text-primary transition-colors mt-1" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-12 rounded-2xl border border-dashed border-white/10">
                    <Folder className="size-12 text-foreground/10 mx-auto mb-4" />
                    <p className="text-foreground/40">No documents found in the live repository.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => window.open("https://drive.google.com/drive/folders/1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1", "_blank")}
                    >
                      Visit Google Drive Backup
                    </Button>
                  </div>
                )}
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