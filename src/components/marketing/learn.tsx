"use client";

import { useEffect, useState, useRef } from 'react'
import { cn } from "@/utils";
import {
    BookOpen, ChevronRight, ChevronLeft, ExternalLink, Folder, Zap, X, Play,
    CheckCircle, XCircle, Award, Target, Lightbulb, Crown, Sparkles, ArrowRight, RefreshCcw,
    Mail, Send,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";

const articleSections = [
  {
    id: 'intro',
    title: 'The Budget Policy Statement 2026',
    subtitle: 'Decode Kenya\'s Budget Roadmap',
    emoji: '📊',
    content: 'Every year, the Kenyan government publishes a document that sets the roadmap for how public money will be collected and spent. This is the Budget Policy Statement (BPS).',
    keyPoints: ['Strategic priorities for budget preparation', 'Guides national AND county governments', 'Submitted to Parliament by February 15th', 'Forms basis for the April 30th national budget']
  },
  {
    id: 'what-is-bps',
    title: 'What Exactly is a BPS?',
    emoji: '💡',
    content: 'The BPS is a government policy document that sets out strategic priorities guiding how national and county governments prepare their annual budgets. It\'s NOT the final budget - it\'s the blueprint.',
    stat: { value: 'Feb 15', label: 'Annual Deadline (PFM Act)' },
    highlight: 'Section 25, Public Finance Management Act'
  },
  {
    id: 'beta-intro',
    title: 'The 5 BETA Pillars',
    subtitle: 'Bottom-Up Economic Transformation Agenda',
    emoji: '🏗️',
    content: 'The 2026 BPS is themed around the BETA Agenda - the government\'s plan to transform Kenya\'s economy from the ground up through 5 key pillars.',
    pillars: [
      { emoji: '🌽', title: 'Agriculture', desc: 'Food security, fertilizer, irrigation' },
      { emoji: '🏪', title: 'MSMEs', desc: 'Hustler Fund, credit access' },
      { emoji: '🏥', title: 'Healthcare', desc: 'Universal Health Coverage' },
      { emoji: '🏘', title: 'Housing', desc: 'Affordable housing via KMRC' },
      { emoji: '💻', title: 'Digital', desc: 'Fibre internet, e-government' }
    ]
  },
  {
    id: 'agri',
    title: '🌽 Agricultural Transformation',
    emoji: '🌽',
    content: 'Focus on food security through crop diversification, modernizing agricultural value chains, improving livestock productivity, and expanding agricultural insurance.',
    highlights: ['Fertilizer subsidies', 'Large-scale irrigation', 'Livestock vaccination', 'Meat/dairy processing']
  },
  {
    id: 'msme',
    title: '🏪 MSME Transformation',
    emoji: '🏪',
    content: 'Supporting small businesses - the backbone of Kenya\'s economy. Structural constraints like limited credit access and high interest rates averaging 18% need solving.',
    highlights: ['Expand Hustler Fund', 'Credit guarantee scheme', 'NYOTA linkages', 'MSME hubs in 47 counties']
  },
  {
    id: 'health',
    title: '🏥 Healthcare',
    emoji: '🏥',
    content: 'Targeting Universal Health Coverage with the Social Health Authority, targeting 35 million enrolled Kenyans.',
    highlights: ['SHA enrollment push', 'Community health services', 'Build & equip facilities', 'Digital health systems']
  },
  {
    id: 'numbers-intro',
    title: 'The Big Numbers FY 2026/27',
    emoji: '💰',
    content: 'Here\'s what the national budget looks like in shillings for the coming fiscal year.',
    stat: { value: 'KES 3.59T', label: 'Total Revenue' }
  },
  {
    id: 'revenue',
    title: '📥 Total Revenue',
    emoji: '📥',
    content: 'Forecasted revenue including Appropriations-in-Aid is KES 3.59 trillion, up from KES 3.37 trillion in 2025/26.',
    stat: { value: 'KES 3.59T', label: '+6.5% growth' }
  },
  {
    id: 'expenditure',
    title: '💸 Total Expenditure',
    emoji: '💸',
    content: 'Total planned spending for the year. This creates a gap (deficit) that must be financed through borrowing.',
    stat: { value: 'KES 4.74T', label: 'Planned spending' }
  },
  {
    id: 'deficit',
    title: '📉 Fiscal Deficit',
    emoji: '📉',
    content: 'When spending exceeds revenue, we have a deficit. This KES 1.15 trillion gap is financed by borrowing.',
    stat: { value: 'KES 1.15T', label: 'Spending gap' },
    note: 'Financed: KES 225.5B foreign + KES 924B domestic'
  },
  {
    id: 'debt',
    title: '⚠️ Debt Interest',
    emoji: '⚠️',
    content: 'Pre-committed payments on existing debt. This is money that CANNOT go to roads, healthcare, or education.',
    stat: { value: 'KES 1.2T', label: 'Already committed' }
  },
  {
    id: 'counties',
    title: '🏛️ County Allocations',
    emoji: '🏛️',
    content: 'KES 420 billion goes to county governments through the equitable share to fund devolved services.',
    stat: { value: '47', label: 'Counties funded' },
    services: ['Roads', 'Health', 'Water', 'Markets', 'Local development']
  },
  {
    id: 'risks',
    title: '⚡ 5 Fiscal Risks',
    emoji: '⚡',
    content: 'The BPS identifies these key risks that could derail the budget:',
    risks: [
      { title: 'Rising public debt', desc: 'Interest payments consuming more budget' },
      { title: 'Contingent liabilities', desc: 'State corporation guarantees' },
      { title: 'Macroeconomic risks', desc: 'Exchange rate, inflation shocks' },
      { title: 'Climate change', desc: 'Droughts, floods affecting revenue' },
      { title: 'Devolution pressures', desc: 'More counties seeking funds' }
    ]
  },
  {
    id: 'quiz-prompt',
    title: '🧠 Knowledge Check!',
    emoji: '🧠',
    content: 'You\'ve covered the basics! Ready to test your understanding?',
    prompt: true
  }
]

const quizQuestions = [
  {
    question: 'By when must the Budget Policy Statement be submitted to Parliament?',
    options: ['January 1st', 'February 15th', 'March 30th', 'April 30th'],
    correct: 1,
    explanation: 'Section 25 of the Public Finance Management Act sets February 15th as the deadline.'
  },
  {
    question: 'Which pillar focuses on affordable housing through KMRC?',
    options: ['Agriculture', 'MSMEs', 'Housing & Settlement', 'Digital'],
    correct: 2,
    explanation: 'Housing & Settlement focuses on affordable housing through the Kenya Mortgage Refinance Company (KMRC).'
  },
  {
    question: 'What is Kenya\'s projected fiscal deficit for FY 2026/27?',
    options: ['KES 500B', 'KES 1.15T', 'KES 2T', 'KES 3T'],
    correct: 1,
    explanation: 'The projected fiscal deficit is KES 1.15 trillion, financed through KES 225.5B foreign and KES 924B domestic borrowing.'
  },
  {
    question: 'What is the main fiscal risk from rising debt?',
    options: ['Less tax collection', 'Less for services', 'Faster growth', 'Lower inflation'],
    correct: 1,
    explanation: 'When debt interest payments rise, less money is available for actual services like roads, healthcare, and education.'
  },
  {
    question: 'How much goes to county governments via equitable share?',
    options: ['KES 200B', 'KES 320B', 'KES 420B', 'KES 500B'],
    correct: 2,
    explanation: 'KES 420 billion is allocated to county governments for devolved services like roads, health, water, and markets.'
  }
]

function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]')
    if (!subscribers.includes(email)) {
      subscribers.push({ email, joinedAt: new Date().toISOString() })
      localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers))
    }
    setTimeout(() => { setSubscribed(true); setLoading(false) }, 500)
  }
  
  if (subscribed) {
     return (
       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-teal-500/20 border border-primary/30">
         <CheckCircle className="size-12 text-primary mx-auto mb-4" />
         <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
         <p className="text-foreground/60">You'll receive budget updates.</p>
       </motion.div>
     )
   }
  
   return (
     <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl bg-white/5 border border-white/10">
       <div className="text-center mb-6">
         <Mail className="size-10 text-primary mx-auto mb-3" />
         <h3 className="text-xl font-bold">Stay Updated</h3>
         <p className="text-sm text-foreground/60">Get budget insights delivered.</p>
       </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-sm" required />
        <Button type="submit" disabled={loading} size="lg" className="px-4 rounded-xl">
          {loading ? <RefreshCcw className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </motion.div>
  )
}

type AppState = 'hub' | 'article' | 'quiz' | 'complete'

export default function Learn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [appState, setAppState] = useState<AppState>('hub');
  const [articleIndex, setArticleIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [readyForQuiz, setReadyForQuiz] = useState(false);
  
  const currentSection = articleSections[articleIndex];
  const isQuizPrompt = currentSection?.id === 'quiz-prompt';
  const totalSections = articleSections.filter(s => s.id !== 'quiz-prompt').length;
  const readingProgress = Math.round(((articleIndex) / totalSections) * 100);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const blobOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.5, 0.3, 0.1]);

  const handleNext = () => {
    if (articleIndex < articleSections.length - 1) {
      setArticleIndex(i => i + 1)
    }
  }
  
  const handlePrev = () => {
    if (articleIndex > 0) {
      setArticleIndex(i => i - 1)
    }
  }
  
  const startQuiz = () => {
    setAppState('quiz')
    setQuizIndex(0)
    setQuizScore(0)
    setQuizAnswer(null)
    setShowFeedback(false)
  }
  
  const handleQuizAnswer = (idx: number) => {
    setQuizAnswer(idx)
    setShowFeedback(true)
    if (idx === quizQuestions[quizIndex].correct) {
      setQuizScore(s => s + 1)
    }
  }
  
  const handleNextQuestion = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex(i => i + 1)
      setQuizAnswer(null)
      setShowFeedback(false)
    } else {
      setAppState('complete')
    }
  }
  
  const getTitle = (score: number, total: number) => {
    const pct = (score / total) * 100
    if (pct === 100) return { title: 'Budget Master 🏆', subtitle: 'Perfect Score! You\'ve mastered the BPS.' }
    if (pct >= 80) return { title: 'Budget Chief 👑', subtitle: 'Excellent! You lead with knowledge.' }
    if (pct >= 60) return { title: 'Budget Analyst 📊', subtitle: 'Good! You understand the budget.' }
    return { title: 'Budget Apprentice 📚', subtitle: 'Keep learning! The budget awaits.' }
  }
  
  const resultTitle = getTitle(quizScore, quizQuestions.length)
  const finalPct = Math.round((quizScore / quizQuestions.length) * 100)

  if (appState === 'complete') {
    return (
      <section className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md w-full">
          <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="text-8xl mb-6">{finalPct === 100 ? '🏆' : finalPct >= 80 ? '👑' : finalPct >= 60 ? '📊' : '📚'}</motion.div>
          <h1 className="text-4xl font-bold font-serif mb-2">{resultTitle.title}</h1>
          <p className="text-lg text-foreground/60 mb-6">{resultTitle.subtitle}</p>
          
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <div className="text-4xl font-bold bg-linear-to-b from-primary/40 to-primary/0 bg-clip-text text-transparent mb-2">{quizScore}/{quizQuestions.length}</div>
            <p className="text-sm text-foreground/60">questions correct</p>
            <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${finalPct}%` }} className="h-full bg-amber-500" />
            </div>
            <p className="text-xs text-foreground/50 mt-2">{finalPct}% score</p>
          </div>
          
          <Button size="lg" className="w-full h-12 rounded-xl" onClick={() => { setAppState('hub'); setArticleIndex(0); }}>Back to Hub <ArrowRight className="ml-2" /></Button>
        </motion.div>
      </section>
    )
  }

  if (appState === 'quiz') {
    const q = quizQuestions[quizIndex]
    return (
      <section className="fixed inset-0 z-[100] bg-background flex flex-col">
        <div className="flex items-center px-4 py-2">
          <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 text-xs">
            <Target className="size-3" />
            <span className="text-foreground/70">{quizIndex + 1}/{quizQuestions.length}</span>
          </div>
           <div className="flex-1 h-1 mx-3 bg-white/10 rounded-full overflow-hidden">
             <motion.div className="h-full bg-gradient-to-r from-primary via-primary/60 to-teal-500" style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} />
           </div>
          <button onClick={() => setAppState('hub')} className="p-1.5 rounded-full bg-white/10">
            <X className="size-4" />
          </button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div key={quizIndex} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="w-full max-w-md">
            <div className="text-sm text-foreground/50 mb-4">Question {quizIndex + 1} of {quizQuestions.length}</div>
            <h2 className="text-2xl font-bold mb-8">{q.question}</h2>
            
            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={showFeedback}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                    showFeedback && idx === q.correct && "border-teal-500 bg-teal-500/10 text-teal-400",
                    showFeedback && quizAnswer === idx && idx !== q.correct && "border-red-500 bg-red-500/10 text-red-400",
                    !showFeedback && "border-white/20 bg-white/5 hover:border-amber-500/50"
                  )}
                >
                  <span className={cn("w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold", showFeedback && idx === q.correct ? "bg-teal-500 border-teal-500 text-black" : showFeedback && quizAnswer === idx && idx !== q.correct ? "bg-red-500 border-red-500 text-white" : "border-white/30")}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>
            
            {showFeedback && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("mt-6 p-4 rounded-xl", quizAnswer === q.correct ? "bg-teal-500/10 border border-teal-500/30 text-teal-400" : "bg-red-500/10 border border-red-500/30 text-red-400")}>
                <div className="flex items-center gap-2 mb-2">{quizAnswer === q.correct ? <CheckCircle className="size-5" /> : <XCircle className="size-5" />}<span className="font-bold">{quizAnswer === q.correct ? 'Correct!' : 'Not quite'}</span></div>
                <p className="text-sm">{q.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {showFeedback && (
          <div className="p-4 border-t border-white/10">
            <Button className="w-full h-12 rounded-xl" onClick={handleNextQuestion}>
              {quizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="ml-2" />
            </Button>
          </div>
        )}
      </section>
    )
  }

  if (appState === 'article') {
    const isCover = articleIndex === 0
    const hasStat = currentSection?.stat
    const hasPillars = currentSection?.pillars
    const hasRisks = currentSection?.risks
    const hasHighlights = currentSection?.highlights
    const hasServices = currentSection?.services
    
    return (
      <section className="fixed inset-0 z-[100] bg-background flex flex-col">
        {/* Status bar - top */}
         <div className="flex items-center px-4 py-2">
           <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
             <motion.div className="h-full bg-gradient-to-r from-primary via-primary/60 to-teal-500 rounded-full" style={{ width: `${readingProgress}%` }} />
           </div>
          <button onClick={() => { setAppState('hub'); setArticleIndex(0); }} className="ml-3 p-1.5 rounded-full bg-white/10">
            <X className="size-4" />
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={articleIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="flex-1 flex flex-col items-center justify-center p-6 relative"
          >
            {/* Left tap zone - Previous */}
            <div 
              className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer z-10"
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            >
              <ChevronLeft className="size-10 hidden md:block text-white/30 hover:text-white/60 transition-colors pl-2" />
            </div>
            
            {/* Right tap zone - Next */}
            <div 
              className="absolute right-0 top-0 bottom-0 w-2/3 cursor-pointer z-10"
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
            >
              <ChevronRight className="size-10 hidden md:block text-white/30 hover:text-white/60 transition-colors pr-2" />
            </div>
            
            {/* Content area - clickable for next on empty space */}
            <div className="flex-1 flex flex-col items-center justify-center" onClick={handleNext}>
            {isCover && (
              <div className="text-center">
                <div className="text-7xl mb-6">{currentSection?.emoji}</div>
                <h1 className="text-4xl font-bold font-serif">{currentSection?.title}</h1>
                <p className="text-xl text-foreground/60 mt-3">{currentSection?.subtitle}</p>
                <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-foreground/70">
                  {currentSection?.content}
                </div>
              </div>
            )}
            
            {hasStat && !hasPillars && !hasRisks && !hasHighlights && !hasServices && (
              <div className="text-center">
                <div className="text-6xl mb-4">{currentSection?.emoji}</div>
                <h2 className="text-3xl font-bold font-serif mb-2">{currentSection?.title}</h2>
                <p className="text-lg text-foreground/70 mb-6">{currentSection?.content}</p>
                <div className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-teal-500/20 to-amber-500/20 border border-teal-500/30">
                  <div className="text-4xl font-bold bg-linear-to-b from-primary/40 to-primary/0 bg-clip-text text-transparent">{currentSection?.stat?.value}</div>
                  <div className="text-sm text-foreground/60">{currentSection?.stat?.label}</div>
                </div>
              </div>
            )}
            
            {hasPillars && !hasStat && (
              <div className="w-full">
                <div className="text-center mb-6"><div className="text-5xl mb-3">{currentSection?.emoji}</div><h2 className="text-2xl font-bold">{currentSection?.title}</h2><p className="text-foreground/60">{currentSection?.subtitle}</p></div>
                <div className="space-y-2">
                  {currentSection?.pillars?.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="text-2xl">{p.emoji}</span>
                      <div><div className="font-medium">{p.title}</div><div className="text-xs text-foreground/50">{p.desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {hasHighlights && (
              <div className="w-full text-center">
                <div className="text-6xl mb-4">{currentSection?.emoji}</div>
                <h2 className="text-3xl font-bold font-serif mb-4">{currentSection?.title}</h2>
                <p className="text-lg text-foreground/70 mb-6">{currentSection?.content}</p>
                <div className="grid grid-cols-2 gap-2">
                  {currentSection?.highlights?.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-sm">{h}</div>
                  ))}
                </div>
              </div>
            )}
            
            {hasRisks && (
              <div className="w-full">
                <div className="text-center mb-6"><div className="text-5xl mb-3">{currentSection?.emoji}</div><h2 className="text-2xl font-bold">{currentSection?.title}</h2><p className="text-foreground/60">{currentSection?.content}</p></div>
                <div className="space-y-2">
                  {currentSection?.risks?.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <span className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <div><div className="font-medium text-sm">{r.title}</div><div className="text-xs text-foreground/50">{r.desc}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {hasServices && (
              <div className="w-full text-center">
                <div className="text-6xl mb-4">{currentSection?.emoji}</div>
                <h2 className="text-3xl font-bold font-serif mb-4">{currentSection?.title}</h2>
                <div className="inline-block px-6 py-4 rounded-2xl bg-gradient-to-r from-primary/20 to-teal-500/20 border border-primary/30 mb-6">
                  <div className="text-4xl font-bold bg-linear-to-b from-primary/40 to-primary/0 bg-clip-text text-transparent">{currentSection?.stat?.value}</div>
                  <div className="text-sm text-foreground/60">{currentSection?.stat?.label}</div>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentSection?.services?.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-sm">{s}</span>
                  ))}
                </div>
              </div>
            )}
            
            {isQuizPrompt && (
              <div className="text-center" onClick={(e) => e.stopPropagation()}>
                <div className="text-7xl mb-6">{currentSection?.emoji}</div>
                <h2 className="text-3xl font-bold font-serif mb-4">{currentSection?.title}</h2>
                <p className="text-lg text-foreground/70 mb-8">{currentSection?.content}</p>
                <Button className="w-full h-14 rounded-xl text-lg font-medium z-20 relative" onClick={() => startQuiz()}>Start Quiz <Target className="ml-2" /></Button>
              </div>
            )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {isQuizPrompt && (
          <div className="p-4 border-t border-white/10">
            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={(e) => { e.stopPropagation(); handleNext(); }}>Continue Reading <ArrowRight className="ml-2" /></Button>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-1 p-3 border-t border-white/10">
          {articleSections.slice(0, 10).map((_, idx) => (
            <button key={idx} onClick={() => setArticleIndex(idx)} className={cn("h-1.5 rounded-full transition-all", articleIndex === idx ? "w-6 bg-amber-500" : "w-1.5 bg-white/20")} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section ref={containerRef} className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" style={{ opacity: blobOpacity }} />
        <motion.div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" style={{ opacity: blobOpacity }} />
      </div>

      <Wrapper className="relative z-10 w-full flex-1 flex flex-col justify-between py-6">
        <div className="flex-1 flex flex-col py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 w-full">
            <Container animation="fadeUp" className="text-center space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
                  <BookOpen className="size-3.5" /><span>Interactive Learning</span>
                </div>
                 <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight">Master Kenya's <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-size-[200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-transparent bg-clip-text">Budget</span></h1>
                <p className="text-sm sm:text-base text-foreground/60 mt-4 max-w-2xl mx-auto"><Balancer>Swipe through interactive lessons on the Budget Policy Statement, test your knowledge, and earn your title.</Balancer></p>
              </motion.div>
            </Container>

            <Container animation="fadeUp" delay={0.1} className="space-y-6">
              <h2 className="text-xl font-bold">Interactive Module</h2>
              <div className="grid grid-cols-1 gap-4">
                 <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   whileHover={{ y: -4 }}
                   onClick={() => { setAppState('article'); setArticleIndex(0); }}
                   className="cursor-pointer"
                 >
                   <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all">
                     <div className="h-1.5 bg-gradient-to-r from-primary via-primary/60 to-teal-500" />
                     <div className="p-6">
                       <div className="flex items-center justify-between mb-3">
                         <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-primary/20 text-primary">📱 Interactive Course</span>
                         <span className="text-xs text-foreground/50">13 sections + 5 quiz questions</span>
                       </div>
                       <h3 className="text-2xl font-bold font-serif mb-2">The Budget Policy Statement 2026</h3>
                       <p className="text-foreground/70 mb-4">Swipe through 14 pages covering BPS basics, BETA pillars, budget numbers, fiscal risks, and a knowledge quiz.</p>
                       <div className="flex items-center gap-4 text-sm text-foreground/50">
                         <span className="flex items-center gap-1"><Sparkles className="size-4 text-amber-400" /> Progress tracked</span>
                         <span className="flex items-center gap-1"><Target className="size-4 text-teal-400" /> 5 question quiz</span>
                         <span className="flex items-center gap-1"><Award className="size-4 text-primary" /> Get titled</span>
                       </div>
                     </div>
                   </div>
                 </motion.div>
              </div>
            </Container>

            <Container animation="fadeUp" delay={0.2} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Budget Documents</h2>
                <a href="https://drive.google.com/drive/folders/1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">View on Drive <ExternalLink className="size-3" /></a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {['ADP', 'AGRI', 'APP ACT', 'BPS', 'BROP', 'CBR', 'CFA', 'CFSP', 'CIDP', 'ERE', 'FB', 'PBB'].map(doc => (
                  <Link key={doc} href={`/learn/${doc.toLowerCase()}`} legacyBehavior>
                    <motion.a whileHover={{ y: -2 }} className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Folder className="size-4 text-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold group-hover:text-primary">{doc}</h3>
                          <p className="text-[10px] text-foreground/60">Budget Document</p>
                        </div>
                      </div>
                    </motion.a>
                  </Link>
                ))}
              </div>
            </Container>

            <Container animation="fadeUp" delay={0.4} className="py-8">
              <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-teal-500/20 border border-primary/20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px]" />
                <div className="relative z-10 text-center space-y-4">
                  <h2 className="text-2xl sm:text-3xl font-bold">Ready to start learning?</h2>
                  <p className="text-sm text-foreground/60 max-w-md mx-auto">Swipe through the interactive module to understand Kenya's budget and earn your title.</p>
                  <Button size="lg" className="h-11 px-6 rounded-xl text-sm font-medium" onClick={() => { setAppState('article'); setArticleIndex(0); }}>Start Learning <ChevronRight className="size-4 ml-2" /></Button>
                </div>
              </div>
            </Container>

            <Container animation="fadeUp" delay={0.35} className="space-y-6">
              <NewsletterSignup />
            </Container>

            <Container animation="fadeUp" delay={0.5} className="max-w-3xl mx-auto w-full pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4">
              <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
              <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                <a href="mailto:hello@budgetndiostory.com" className="hover:text-foreground">Email</a>
                <a href="#" className="hover:text-foreground">Privacy</a>
                <a href="#" className="hover:text-foreground">Terms</a>
              </div>
            </Container>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}