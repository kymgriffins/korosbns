"use client";

import { useEffect, useState, useRef } from 'react'
import { cn } from "@/utils";
import {
    BookOpen, ChevronRight, ChevronLeft, ExternalLink, Folder, Zap, X, Play,
    CheckCircle, XCircle, Award, Target, Lightbulb, Crown, Sparkles, ArrowRight, RefreshCcw,
    Mail, Send, Eye, MonitorPlay, Volume2, VolumeX, Maximize2, Minimize2,
    HelpCircle, ChevronDown,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";

const bpsVideos = [
  { id: 'intro', title: 'Introduction to BPS', url: 'https://youtu.be/A_EXLueEMlk?si=UhJ5b_gjGiFJJvtD' },
  { id: 'pillars', title: 'BETA Agenda Pillars', url: 'https://youtu.be/jLZe3iPSMfc?si=AwNy30i_P4u3t3lT' },
  { id: 'numbers', title: 'Budget Numbers Explained', url: 'https://youtu.be/KeNCrx6krl0?si=ChH0YYGTCAzf9Lgn' },
  { id: 'risks', title: 'Fiscal Risks', url: 'https://youtu.be/SfPwtqUFyj4?si=5nS0WQjXIy1uavN1' },
]

const faqItems = [
  {
    q: "What is the Budget Policy Statement (BPS)?",
    a: "The BPS is a yearly government document that sets out Kenya's spending priorities. It's like a preview of the national budget - showing where money will come from and where it'll go."
  },
  {
    q: "When is the BPS released?",
    a: "By law (PFM Act), the BPS must be submitted to Parliament by February 15th every year. The final budget comes later on April 30th."
  },
  {
    q: "What's the difference between BPS and the national budget?",
    a: "Think of BPS as the blueprint or trailer, and the national budget as the full movie. BPS sets the priorities and direction, while the budget is the actual detailed spending plan."
  },
  {
    q: "What is BETA?",
    a: "BETA = Bottom-Up Economic Transformation Agenda. It's Kenya's plan to grow the economy by focusing on agriculture, small businesses, healthcare, housing, and digital transformation."
  },
  {
    q: "Why does Kenya borrow so much?",
    a: "Kenya spends more than it collects in taxes (fiscal deficit). The gap is filled through borrowing - both from foreign sources and domestic (like treasury bonds). This helps fund development but also increases debt costs."
  },
  {
    q: "How much goes to county governments?",
    a: "In 2026/27, counties get KES 420 billion through the equitable share. This funds local services like roads, health, water, and markets in all 47 counties."
  },
  {
    q: "What are the main fiscal risks?",
    a: "The BPS warns about: rising debt payments, state corporations needing bailouts, economic slowdowns, climate change (droughts/floods), and increased county demands."
  }
]

const moduleInfo = {
  module: 'Module 002',
  title: 'Reflecting on Kenya\'s 2026 Budget Policy Statement (BPS)',
  credits: 'Millicent Makini',
}

const storyCards = [
  {
    id: 'intro',
    title: "Let's Decode the Budget! 🔓",
    subtitle: 'Kenya\'s Money Blueprint',
    emoji: '🚪',
    bg: 'from-indigo-500 via-purple-500 to-pink-500',
    content: "Ever wonder how the government plans to spend YOUR money? Every year, Kenya releases a secret blueprint called the Budget Policy Statement (BPS)! 🗺️",
    facts: ['📋 Sets spending priorities for the year', '🏦 Guides both national & county budgets', '📅 Due by February 15th', '💵 Forms the April national budget']
  },
  {
    id: 'what-is-bps',
    title: 'What is a BPS Actually? 🤔',
    subtitle: 'Think of it like...',
    emoji: '💡',
    bg: 'from-amber-500 to-orange-500',
    content: "It's NOT the actual budget - it's the PREVIEW! Like a movie trailer before the full film. 🎬",
    stat: { value: 'Feb 15', label: '📅Deadline (PFM Act)' }
  },
  {
    id: 'beta-intro',
    title: 'Meet BETA! 🌟',
    subtitle: 'The Big Plan for Kenya',
    emoji: '🚀',
    bg: 'from-cyan-500 to-blue-500',
    content: "BETA = Bottom-Up Economic Transformation Agenda. That's government speak for 'let's grow Kenya from the ground up!' 🌱",
    pillars: [
      { emoji: '🌽', title: 'Agriculture', desc: 'Food for everyone!' },
      { emoji: '🔥', title: 'Hustlers', desc: 'Small business boost' },
      { emoji: '🩺', title: 'Healthcare', desc: 'Health for all' },
      { emoji: '🏠', title: 'Housing', desc: 'Roof over heads' },
      { emoji: '📱', title: 'Digital', desc: 'Internet for Kenya' }
    ]
  },
  {
    id: 'agri',
    title: 'Farm Life! 🌾',
    subtitle: 'From Farm to Table',
    emoji: '🧑‍🌾',
    bg: 'from-green-500 to-emerald-500',
    content: "Kenya wants to grow MORE food! Think better seeds, Irrigation everywhere, and livestock that won't get sick. 🥩",
    facts: ['💊 Cheaper fertilizer', '💧 Big irrigation projects', '💉 Livestock vaccines', '🏭 Better storage']
  },
  {
    id: 'msme',
    title: 'Hustler Energy! ⚡',
    subtitle: 'Small Biz Big Dreams',
    emoji: '💪',
    bg: 'from-pink-500 to-rose-500',
    content: "MSMEs = Micro, Small & Medium Enterprises. That's YOUR aunt's duka, the matatu guy, the tailor on the corner! They need cheaper loans! 💰",
    facts: ['💵 Bigger Hustler Fund', '🏦 Credit guarantees', '📍 Hubs in all 47 counties', '📈 Business growth']
  },
  {
    id: 'health',
    title: 'Health for All! 🏥',
    subtitle: 'No One Left Behind',
    emoji: '❤️',
    bg: 'from-red-500 to-pink-500',
    content: "SHA = Social Health Authority. The goal? 35 MILLION Kenyans with health cover! That's almost everyone! 🙌",
    facts: ['👩‍⚕️ Community health workers', '🏗️ New clinics', '💻 Digital health records', '💊 Free medicine']
  },
  {
    id: 'numbers-intro',
    title: 'The Big Numbers! 💰',
    subtitle: "Let's Talk Billions",
    emoji: '😱',
    bg: 'from-violet-600 to-purple-600',
    content: "Buckle up! Here's what the 2026/27 budget looks like in KENYAN SHILLINGS...",
  },
  {
    id: 'revenue',
    title: 'Money In! 📈',
    subtitle: 'Where It Comes From',
    emoji: '💵',
    bg: 'from-emerald-500 to-teal-500',
    content: "Total revenue the government expects to collect. Taxes, duties, everything!",
    stat: { value: 'KES 3.59T', label: '💰Total Revenue' }
  },
  {
    id: 'expenditure',
    title: 'Money Out! 🛒',
    subtitle: 'Where It Goes',
    emoji: '🛍️',
    bg: 'from-orange-500 to-amber-500',
    content: "Total planned spending. Roads, salaries, projects - everything!",
    stat: { value: 'KES 4.74T', label: '💸Total Spending' }
  },
  {
    id: 'deficit',
    title: 'The Gap! 😬',
    subtitle: 'Spending More Than You Have',
    emoji: '📉',
    bg: 'from-red-600 to-rose-600',
    content: "When you spend more than you earn = deficit. Kenya borrows to fill the gap!",
    stat: { value: 'KES 1.15T', label: '🚨The Gap!' },
    note: '🤝 KES 225B foreign + KES 924B domestic'
  },
  {
    id: 'debt',
    title: 'Debt Alarm! 🚨',
    subtitle: 'Already Committed?',
    emoji: '😰',
    bg: 'from-yellow-500 to-orange-500',
    content: "-interest on old loans. This money is GONE before anything else! Can't use it for roads or schools.",
    stat: { value: 'KES 1.2T', label: '⚠️Already Committed' }
  },
  {
    id: 'counties',
    title: 'Going Local! 🗺️',
    subtitle: 'Counties Get Cash',
    emoji: '🏛️',
    bg: 'from-blue-500 to-indigo-500',
    content: "47 counties get a slice for local roads, health centers, markets!",
    stat: { value: 'KES 420B', label: '💵To Counties' },
    services: ['🛣️Roads', '🏥Health', '💧Water', '🏪Markets', '🎪Events']
  },
  {
    id: 'risks',
    title: 'Watch Out! ⚠️',
    subtitle: 'Budget Danger Zones',
    emoji: '⚡',
    bg: 'from-gray-700 to-gray-900',
    content: "Things that could mess up the budget:",
    risks: [
      { title: '📈 Debt spiral', desc: 'More borrowing = more interest' },
      { title: '🏦 SOE bailouts', desc: 'State company losses' },
      { title: '📉 Economy slow', desc: 'Less tax collected' },
      { title: '🌧️ Climate', desc: 'Droughts + floods' },
      { title: '📢 Counties', desc: 'More demands' }
    ]
  },
  {
    id: 'quiz-prompt',
    title: 'Ready to Quiz? 🎯',
    subtitle: "Test Your Knowledge",
    emoji: '🏆',
    bg: 'from-amber-500 via-orange-500 to-red-500',
    content: "You made it! Let's see how much you remember. 🎮",
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

function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  
  return (
    <Container animation="fadeUp" delay={0.3} className="space-y-4">
      <h2 className="text-xl font-bold">FAQ: Budget Basics</h2>
      <div className="space-y-2">
        {faqItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <button
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              className="w-full p-4 flex items-center justify-between gap-3 text-left"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="size-4 text-primary shrink-0" />
                <span className="text-sm font-medium">{item.q}</span>
              </div>
              <motion.div
                animate={{ rotate: openFaq === idx ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="size-4 text-foreground/50" />
              </motion.div>
            </button>
            <motion.div
              initial={false}
              animate={{ 
                height: openFaq === idx ? 'auto' : 0,
                opacity: openFaq === idx ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="px-4 pb-4 text-sm text-foreground/70 pl-8">{item.a}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Container>
  )
}

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

type LearnMode = 'read' | 'watch'
type AppState = 'hub' | 'article' | 'quiz' | 'complete' | 'watching'

export default function Learn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [appState, setAppState] = useState<AppState>('hub');
  const [learnMode, setLearnMode] = useState<LearnMode>('read');
  const [videoIndex, setVideoIndex] = useState(0);
  const [articleIndex, setArticleIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [readyForQuiz, setReadyForQuiz] = useState(false);
  
  const currentCard = storyCards[articleIndex];
  const isQuizPrompt = currentCard?.prompt;
  const totalCards = storyCards.filter(c => !c.prompt).length;
  const readingProgress = Math.round(((articleIndex) / totalCards) * 100);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const blobOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.5, 0.3, 0.1]);

  const handleNext = () => {
    if (articleIndex < storyCards.length - 1) {
      setArticleIndex(i => i + 1)
    }
  }
  
  const handlePrev = () => {
    if (articleIndex > 0) {
      setArticleIndex(i => i - 1)
    }
  }
  
  const handleCardTap = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && articleIndex > 0) {
      setArticleIndex(i => i - 1)
    } else if (direction === 'next' && articleIndex < storyCards.length - 1) {
      setArticleIndex(i => i + 1)
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
    const emoji = finalPct === 100 ? '🏆' : finalPct >= 80 ? '👑' : finalPct >= 60 ? '🎯' : '🌱'
    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: "50%", y: "50%", scale: 0 }}
              animate={{ 
                x: `${Math.random() * 100}%`, 
                y: `${Math.random() * 100}%`, 
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute text-2xl"
            >
              {['🎉', '⭐', '💫', '✨', '🎊'][i % 5]}
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md w-full relative z-10">
          <motion.div initial={{ y: 20, rotate: 0 }} animate={{ y: 0, rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5, repeat: 2 }} className="text-8xl mb-6">{emoji}</motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">{resultTitle.title}</h1>
          <p className="text-lg text-white/60 mb-6">{resultTitle.subtitle}</p>
          
          <div className="p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <div className="text-5xl font-bold text-white mb-2">{quizScore}/{quizQuestions.length}</div>
            <p className="text-sm text-white/50">questions correct</p>
            <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${finalPct}%` }} transition={{ delay: 0.3, duration: 0.5 }} className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400" />
            </div>
            <p className="text-xs text-white/50 mt-2">{finalPct}% score</p>
          </div>
          
          <Button size="lg" className="w-full h-12 rounded-xl bg-white text-gray-900 hover:bg-white/90" onClick={() => { setAppState('hub'); setArticleIndex(0); }}>Back to Hub <ArrowRight className="ml-2" /></Button>
        </motion.div>
      </section>
    )
  }

  if (appState === 'quiz') {
    const q = quizQuestions[quizIndex]
    const progress = ((quizIndex + 1) / quizQuestions.length) * 100
    
    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex flex-col overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 180] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-purple-600/20 blur-3xl" 
          />
        </div>

        <div className="relative z-10 flex items-center px-4 py-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", damping: 20 }}
              />
            </div>
            <div className="ml-2 px-2 py-1 rounded-full bg-white/20 text-xs font-medium text-white">
              {quizIndex + 1}/{quizQuestions.length}
            </div>
          </div>
          <button onClick={() => setAppState('hub')} className="ml-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="size-4 text-white" />
          </button>
        </div>
        
        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
          <motion.div 
            key={quizIndex} 
            initial={{ x: 100, opacity: 0, scale: 0.9 }} 
            animate={{ x: 0, opacity: 1, scale: 1 }} 
            exit={{ x: -100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="w-full max-w-md"
          >
            <div className="text-sm text-white/50 mb-2">Question {quizIndex + 1}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-8">{q.question}</h2>
            
            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={showFeedback}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                    showFeedback && idx === q.correct && "border-green-500 bg-green-500/20 text-green-400",
                    showFeedback && quizAnswer === idx && idx !== q.correct && "border-red-500 bg-red-500/20 text-red-400",
                    !showFeedback && "border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10"
                  )}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0",
                    showFeedback && idx === q.correct ? "bg-green-500 border-green-500 text-black" : 
                    showFeedback && quizAnswer === idx && idx !== q.correct ? "bg-red-500 border-red-500 text-white" : 
                    "border-white/30 text-white/70"
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm">{opt}</span>
                </motion.button>
              ))}
            </div>
            
            {showFeedback && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.9 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                className={cn(
                  "mt-6 p-4 rounded-xl",
                  quizAnswer === q.correct ? "bg-green-500/20 border border-green-500/30 text-green-400" : "bg-red-500/20 border border-red-500/30 text-red-400"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {quizAnswer === q.correct ? <CheckCircle className="size-5" /> : <XCircle className="size-5" />}
                  <span className="font-bold">{quizAnswer === q.correct ? 'Correct! 🎉' : 'Not quite 😅'}</span>
                </div>
                <p className="text-sm text-white/70">{q.explanation}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        {showFeedback && (
          <div className="relative z-10 p-4">
            <Button className="w-full h-12 rounded-xl bg-white text-gray-900 hover:bg-white/90 font-medium" onClick={handleNextQuestion}>
              {quizIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results!'} <ArrowRight className="ml-2" />
            </Button>
          </div>
        )}
      </section>
    )
  }

  if (appState === 'article') {
    const hasStat = currentCard?.stat
    const hasPillars = currentCard?.pillars
    const hasRisks = currentCard?.risks
    const hasFacts = currentCard?.facts
    const hasServices = currentCard?.services
    const bgGradient = currentCard?.bg || 'from-primary to-teal-500'
    const cardBgClass = `bg-gradient-to-br ${bgGradient}`
    
    return (
      <section className="fixed inset-0 z-[100] bg-black flex flex-col overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`absolute -top-1/2 -left-1/2 w-[100%] h-[100%] rounded-full opacity-30 ${cardBgClass}`} 
          />
          <motion.div 
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className={`absolute -bottom-1/2 -right-1/2 w-[80%] h-[80%] rounded-full opacity-20 ${cardBgClass}`} 
          />
        </div>

        {/* Progress bar */}
        <div className="relative z-10 flex items-center px-4 py-3">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${readingProgress}%` }}
              transition={{ type: "spring", damping: 20 }}
            />
          </div>
          <div className="ml-3 px-2 py-1 rounded-full bg-white/20 text-xs font-medium">
            {articleIndex + 1}/{storyCards.length}
          </div>
          <button onClick={() => { setAppState('hub'); setArticleIndex(0); }} className="ml-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <X className="size-4 text-white" />
          </button>
        </div>

        {/* Swipeable card area */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={articleIndex}
              initial={{ x: 300, opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
              exit={{ x: -300, opacity: 0, scale: 0.8, rotate: -5 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              onClick={handleNext}
              className="w-full max-w-md cursor-grab active:cursor-grabbing"
            >
              {/* Flashcard */}
              <div className={cn("relative p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl overflow-hidden", cardBgClass)}>
                {/* Card shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                
                {/* Emoji badge */}
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 10, delay: 0.1 }}
                  className="text-6xl sm:text-7xl mb-4"
                >
                  {currentCard?.emoji}
                </motion.div>
                
                {/* Title */}
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-white mb-1"
                >
                  {currentCard?.title}
                </motion.h2>
                
                {/* Subtitle */}
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-white/70 text-sm mb-4"
                >
                  {currentCard?.subtitle}
                </motion.p>
                
                {/* Content */}
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/90 text-base sm:text-lg mb-6 leading-relaxed"
                >
                  {currentCard?.content}
                </motion.p>

                {/* Stat display */}
                {hasStat && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center mb-4"
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-white">{currentCard?.stat?.value}</div>
                    <div className="text-white/70 text-sm">{currentCard?.stat?.label}</div>
                    {currentCard?.note && (
                      <div className="text-white/50 text-xs mt-2">{currentCard.note}</div>
                    )}
                  </motion.div>
                )}

                {/* Facts grid */}
                {hasFacts && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="grid grid-cols-2 gap-2"
                  >
                    {currentCard?.facts?.map((fact, i) => (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="bg-white/15 rounded-xl px-3 py-2 text-xs text-white/90"
                      >
                        {fact}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Pillars grid */}
                {hasPillars && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    {currentCard?.pillars?.map((p, i) => (
                      <motion.div 
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 bg-white/15 rounded-xl px-3 py-2"
                      >
                        <span className="text-xl">{p.emoji}</span>
                        <div className="flex-1"><div className="text-white font-medium text-sm">{p.title}</div></div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Risks list */}
                {hasRisks && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-2"
                  >
                    {currentCard?.risks?.map((r, i) => (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 bg-red-500/30 rounded-xl px-3 py-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-red-500/50 flex items-center justify-center text-xs font-bold text-white">{i + 1}</span>
                        <div className="flex-1"><div className="text-white text-sm">{r.title}</div><div className="text-white/50 text-xs">{r.desc}</div></div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Services tags */}
                {hasServices && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="flex flex-wrap gap-2"
                  >
                    {currentCard?.services?.map((s, i) => (
                      <motion.span 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="bg-white/20 rounded-full px-3 py-1 text-sm text-white"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Quiz prompt */}
                {isQuizPrompt && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4"
                  >
                    <Button 
                      className="w-full h-14 rounded-xl text-lg font-medium bg-white text-gray-900 hover:bg-white/90" 
                      onClick={() => startQuiz()}
                    >
                      <Target className="mr-2" /> Start Quiz
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-xl mt-3 border-white/30 text-white hover:bg-white/10" 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    >
                      Keep Reading <ArrowRight className="ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Swipe hints */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-50">
              <ChevronLeft className="size-6 text-white/50" />
            </div>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center opacity-50">
              <ChevronRight className="size-6 text-white/50" />
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="relative z-10 flex items-center justify-center gap-1.5 p-4">
          {storyCards.slice(0, 8).map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => setArticleIndex(idx)}
              className={cn("h-2 rounded-full transition-all", articleIndex === idx ? "w-6 bg-white" : "w-2 bg-white/30")}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </section>
    )
  }

  if (appState === 'watching') {
    const currentVideo = bpsVideos[videoIndex]
    const videoProgress = Math.round(((videoIndex + 1) / bpsVideos.length) * 100)
    
    return (
      <section className="fixed inset-0 z-[100] bg-background flex flex-col">
        <div className="flex items-center px-4 py-2">
          <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-primary via-primary/60 to-teal-500 rounded-full" style={{ width: `${videoProgress}%` }} />
          </div>
          <button onClick={() => setAppState('hub')} className="ml-3 p-1.5 rounded-full bg-white/10">
            <X className="size-4" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <motion.div
            key={videoIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-3xl"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.url.split('?')[1].replace('embed=', '').replace('si=', '').split('&')[0]}?enablejsapi=1`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-center">
              <div className="text-xs text-foreground/50 mb-2">{videoIndex + 1} of {bpsVideos.length}</div>
              <h3 className="text-xl font-bold">{currentVideo.title}</h3>
            </div>
          </motion.div>
        </div>
        
        <div className="p-4 border-t border-white/10 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl"
            onClick={() => setVideoIndex(i => Math.max(0, i - 1))}
            disabled={videoIndex === 0}
          >
            <ChevronLeft className="size-4 mr-2" /> Previous
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl"
            onClick={() => {
              if (videoIndex < bpsVideos.length - 1) {
                setVideoIndex(i => i + 1)
              } else {
                setAppState('hub')
              }
            }}
          >
            {videoIndex < bpsVideos.length - 1 ? 'Next Video' : 'Finish'} <ChevronRight className="size-4 ml-2" />
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-1 p-3 border-t border-white/10">
          {bpsVideos.map((_, idx) => (
            <button key={idx} onClick={() => setVideoIndex(idx)} className={cn("h-1.5 rounded-full transition-all", videoIndex === idx ? "w-6 bg-teal-500" : "w-1.5 bg-white/20")} />
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
                  <BookOpen className="size-3.5" /><span>{moduleInfo.module}: {moduleInfo.title}</span>
                </div>
                 <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight">Master Kenya's <span className="bg-linear-to-r from-primary via-primary/80 to-primary bg-size-[200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-transparent bg-clip-text">Budget</span></h1>
                <p className="text-sm sm:text-base text-foreground/60 mt-4 max-w-2xl mx-auto"><Balancer>Swipe through interactive lessons on the Budget Policy Statement, test your knowledge, and earn your title.</Balancer></p>
                 <p className="text-xs text-foreground/40 mt-2">Credits: {moduleInfo.credits}</p>
              </motion.div>
            </Container>

            <Container animation="fadeUp" delay={0.05} className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setLearnMode('read')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    learnMode === 'read' ? "bg-primary text-white" : "bg-white/10 text-foreground/60 hover:bg-white/20"
                  )}
                >
                  <Eye className="size-4" /> Read
                </button>
                <button
                  onClick={() => setLearnMode('watch')}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    learnMode === 'watch' ? "bg-primary text-white" : "bg-white/10 text-foreground/60 hover:bg-white/20"
                  )}
                >
                  <MonitorPlay className="size-4" /> Watch
                </button>
              </div>
            </Container>

            <Container animation="fadeUp" delay={0.1} className="space-y-6">
              <h2 className="text-xl font-bold">{learnMode === 'read' ? 'Read Mode' : 'Watch Mode'}</h2>
              <div className="grid grid-cols-1 gap-4">
                 {learnMode === 'read' ? (
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
                 ) : (
                   <motion.div
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     whileHover={{ y: -4 }}
                     onClick={() => { setAppState('watching'); setVideoIndex(0); }}
                     className="cursor-pointer"
                   >
                     <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-all">
                       <div className="h-1.5 bg-gradient-to-r from-teal-500 via-primary/60 to-primary" />
                       <div className="p-6">
                         <div className="flex items-center justify-between mb-3">
                           <span className="px-2 py-1 rounded-full text-[10px] font-bold uppercase bg-teal-500/20 text-teal-400">🎬 Video Course</span>
                           <span className="text-xs text-foreground/50">{bpsVideos.length} videos</span>
                         </div>
                         <h3 className="text-2xl font-bold font-serif mb-2">BPS 2026 Video Series</h3>
                         <p className="text-foreground/70 mb-4">Watch video explanations of the Budget Policy Statement - from BPS basics to fiscal risks.</p>
                         <div className="flex items-center gap-4 text-sm text-foreground/50">
                           <span className="flex items-center gap-1"><Play className="size-4 text-teal-400" /> Video playlist</span>
                           <span className="flex items-center gap-1"><Target className="size-4 text-primary" /> Interactive quiz</span>
                           <span className="flex items-center gap-1"><Award className="size-4 text-amber-400" /> Get titled</span>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 )}
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

            <Container animation="fadeUp" delay={0.25} className="space-y-4">
              <h2 className="text-xl font-bold">Quick Answers</h2>
              <Link href="/faq" legacyBehavior>
                <motion.a 
                  whileHover={{ y: -2 }} 
                  className="group block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary">FAQ: Budget Questions</h3>
                      <p className="text-xs text-foreground/60">Common questions about the BPS explained</p>
                    </div>
                    <ArrowRight className="size-4 text-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </motion.a>
              </Link>
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