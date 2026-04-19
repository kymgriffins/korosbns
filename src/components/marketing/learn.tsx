"use client"

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import Wrapper from '../global/wrapper'
import Container from '../global/container'
import { Button } from '../ui/button'
import {
    BookOpen,
    FileText,
    Video,
    ChevronRight,
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Globe,
    Award,
    ExternalLink,
    Folder
} from 'lucide-react'
import { cn } from '@/utils'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'

const budgetDocuments = [
    {
        title: "ADP",
        description: "Annual Development Plan documents from 2010-2026",
        year: "2010-2026",
        href: "/learn/adp"
    },
    {
        title: "AGRI",
        description: "Agriculture budget reports and allocations",
        year: "2010-2026",
        href: "/learn/agr"
    },
    {
        title: "APP ACT",
        description: "Appropriation Act budget documents",
        year: "2010-2026",
        href: "/learn/app-act"
    },
    {
        title: "BPS",
        description: "Budget Policy Statement framework",
        year: "2010-2026",
        href: "/learn/bps"
    },
    {
        title: "BROP",
        description: "Budget Review and Outlook Papers",
        year: "2010-2026",
        href: "/learn/brop"
    },
    {
        title: "CBR",
        description: "County Budget Reviews",
        year: "2010-2026",
        href: "/learn/cbr"
    },
    {
        title: "CFA",
        description: "Controller and Auditor General Reports",
        year: "2010-2026",
        href: "/learn/cfa"
    },
    {
        title: "CFSP",
        description: "County Fiscal Strategy Papers",
        year: "2010-2026",
        href: "/learn/cfsp"
    },
    {
        title: "CIDP",
        description: "County Integrated Development Plans",
        year: "2010-2026",
        href: "/learn/cidp"
    },
    {
        title: "ERE",
        description: "Economic Recovery Expenditure reports",
        year: "2010-2026",
        href: "/learn/ere"
    },
    {
        title: "FB",
        description: "Fiscal Budget documents and analyses",
        year: "2010-2026",
        href: "/learn/fb"
    },
    {
        title: "PBB",
        description: "Programme-Based Budgeting reports",
        year: "2010-2026",
        href: "/learn/pbb"
    }
]

const categories = [
    {
        title: "Getting Started",
        description: "Learn the fundamentals of budget storytelling",
        icon: BookOpen,
        articles: 8,
        color: "from-blue-500 to-cyan-500"
    },
    {
        title: "Data Visualization",
        description: "Master charts, graphs, and interactive graphics",
        icon: PieChart,
        articles: 12,
        color: "from-purple-500 to-pink-500"
    },
    {
        title: "Investigative Skills",
        description: "Deep dive into budget analysis techniques",
        icon: FileText,
        articles: 15,
        color: "from-orange-500 to-amber-500"
    },
    {
        title: "Impact Stories",
        description: "Case studies of successful budget narratives",
        icon: TrendingUp,
        articles: 6,
        color: "from-green-500 to-emerald-500"
    }
]

const guideDescriptions: Record<string, string> = {
    ADP: "Annual Development Plan documents from 2010-2026",
    AGR: "Agriculture budget reports and allocations",
    APPACT: "Appropriation Act budget documents",
    BPS: "Budget Policy Statement framework",
    BROP: "Budget Review and Outlook Papers",
    CBR: "County Budget Reviews",
    CFA: "Controller and Auditor General Reports",
    CFSP: "County Fiscal Strategy Papers",
    CIDP: "County Integrated Development Plans",
    ERE: "Economic Recovery Expenditure reports",
    FB: "Fiscal Budget documents and analyses",
    PBB: "Programme-Based Budgeting reports"
}

const resources = [
    {
        title: "Budget Data Templates",
        description: "Pre-built spreadsheets for analyzing budget data",
        type: "Template",
        icon: BarChart3
    },
    {
        title: "Video Tutorials",
        description: "Step-by-step video guides for beginners",
        type: "Video",
        icon: Video
    },
    {
        title: "Glossary",
        description: "Key terms and definitions for budget journalism",
        type: "Reference",
        icon: BookOpen
    },
    {
        title: "Community Forum",
        description: "Connect with other budget storytellers",
        type: "Community",
        icon: Users
    }
]

export default function Learn() {
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
    const blobOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.5, 0.3, 0.1])

    return (
        <section ref={containerRef} className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20">
            {/* Ambient background motion */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
                    style={{
                        backgroundPosition: bgShift,
                        opacity: blobOpacity
                    }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"
                    style={{
                        backgroundPosition: bgShift,
                        opacity: blobOpacity
                    }}
                />
                {/* Subtle particle drift */}
                <motion.div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.03)_1px,transparent_0)] bg-[size:40px_40px]"
                    animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <Wrapper className="relative z-10 w-full flex-1 flex flex-col justify-between py-6">
                <div className="flex-1 flex flex-col py-4">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12 w-full">

                        {/* HERO SECTION */}
                        <Container animation="fadeUp" className="text-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
                                    <BookOpen className="size-3.5" />
                                    <span>Free Learning Resources</span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight">
                                    Learn to Tell {" "}
                                    <span className="bg-linear-to-r from-primary via-purple-400 to-primary bg-size-[200%_100%] animate-[shimmer_3s_ease-in-out_infinite] text-transparent bg-clip-text">
                                        Budget Stories
                                    </span>
                                </h1>
                                <p className="text-sm sm:text-base text-foreground/60 mt-4 max-w-2xl mx-auto">
                                    <Balancer>
                                        Practical guides, tutorials, and resources to help you uncover powerful narratives from public budget data.
                                    </Balancer>
                                </p>
                            </motion.div>
                        </Container>


                        {/* CATEGORIES GRID */}
                        {/* <Container animation="fadeUp" delay={0.1} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {categories.map((category, index) => (
                                    <motion.div
                                        key={category.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ y: -4 }}
                                        className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                                    >
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                                            category.color
                                        )}>
                                            <category.icon className="size-5 text-white" />
                                        </div>
                                        <h3 className="text-base font-semibold mb-1">{category.title}</h3>
                                        <p className="text-xs text-foreground/60 mb-3 line-clamp-2">{category.description}</p>
                                        <p className="text-xs text-foreground/40 font-medium">{category.articles} articles</p>
                                    </motion.div>
                                ))}
                            </div>
                        </Container> */}


                        {/* FEATURED GUIDES - BUDGET DOCUMENTS */}
                        <Container animation="fadeUp" delay={0.2} className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Budget Documents</h2>
                                <a 
                                    href="https://drive.google.com/drive/folders/1Lzpc7T5z-VpNVkBOAx5inciHAWQNQKJ1" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    View all on Drive <ExternalLink className="size-3" />
                                </a>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {budgetDocuments.map((doc, index) => (
                                    <Link
                                        key={doc.title}
                                        href={doc.href}
                                        legacyBehavior
                                    >
                                        <motion.a
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3, delay: index * 0.03 }}
                                            whileHover={{ y: -2 }}
                                            className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="shrink-0 w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <Folder className="size-4 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                                                        {doc.title}
                                                    </h3>
                                                    <p className="text-[10px] text-foreground/60 line-clamp-2">
                                                        {doc.description}
                                                    </p>
                                                    <span className="text-[9px] text-primary/60 mt-1 inline-block">
                                                        {doc.year}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.a>
                                    </Link>
                                ))}
                            </div>
                        </Container>


                        {/* RESOURCES SECTION */}
                        <Container animation="fadeUp" delay={0.3} className="space-y-6">
                            <h2 className="text-xl font-bold">Resources</h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {resources.map((resource, index) => (
                                    <motion.div
                                        key={resource.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.4, delay: index * 0.05 }}
                                        whileHover={{ y: -2 }}
                                        className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                                    >
                                        <resource.icon className="size-6 text-primary/70 mb-3" />
                                        <h3 className="text-sm font-semibold mb-1">{resource.title}</h3>
                                        <p className="text-xs text-foreground/60">{resource.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </Container>


                        {/* CTA SECTION */}
                        <Container animation="fadeUp" delay={0.4} className="py-8">
                            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-purple-500/20 border border-primary/20 overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px]" />
                                <div className="relative z-10 text-center space-y-4">
                                    <h2 className="text-2xl sm:text-3xl font-bold">Ready to start learning?</h2>
                                    <p className="text-sm text-foreground/60 max-w-md mx-auto">
                                        Join our community of budget storytellers and get access to exclusive resources and updates.
                                    </p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                                        <Button size="lg" className="h-11 px-6 rounded-xl text-sm font-medium">
                                            Get Started Free
                                            <ChevronRight className="size-4 ml-2" />
                                        </Button>
                                        <Link href="/contact">
                                            <Button size="lg" variant="white" className="h-11 px-6 rounded-xl text-sm font-medium">
                                                Contact Us
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Container>


                        {/* FOOTER */}
                        <Container animation="fadeUp" delay={0.5} className="max-w-3xl mx-auto w-full pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4 sm:px-6">
                            <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
                            <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                                <a href="mailto:hello@budgetndiostory.com" className="hover:text-foreground transition-colors">Email</a>
                                <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                                <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                            </div>
                        </Container>
                    </div>
                </div>
            </Wrapper>
        </section>
    )
}