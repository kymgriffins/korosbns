"use client"

import React, { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import Wrapper from '../global/wrapper'
import Container from '../global/container'
import { Button } from '../ui/button'
import Link from 'next/link'
import { 
    ArrowLeft, 
    FileText, 
    Download, 
    ChevronRight,
    Calendar,
    FolderOpen,
    Eye,
    ExternalLink,
    Search
} from 'lucide-react'
import { cn } from '@/utils'
import Balancer from 'react-wrap-balancer'
import { DocumentType } from '@/constants/documents'

interface DocumentViewerProps {
    document: DocumentType
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
    const [selectedYear, setSelectedYear] = useState<string | null>(null)
    const [viewMode, setViewMode] = useState<'list' | 'embed'>('list')
    const containerRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
    const blobOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 0.5, 0.3, 0.1])

    const reversedYears = [...document.years].reverse()

    return (
        <section ref={containerRef} className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20">
            {/* Ambient background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
                    style={{ opacity: blobOpacity }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full"
                    style={{ opacity: blobOpacity }}
                />
            </div>

            <Wrapper className="relative z-10 w-full flex-1 flex flex-col py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                    {/* BREADCRUMB */}
                    <Container animation="fadeUp" className="mb-6">
                        <Link 
                            href="/learn"
                            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Learn
                        </Link>
                    </Container>

                    {/* HEADER */}
                    <Container animation="fadeUp" delay={0.1} className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
                                    <FolderOpen className="size-3.5" />
                                    <span>Budget Document</span>
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-bold font-heading tracking-tight">
                                    {document.fullName}
                                </h1>
                                <p className="text-sm sm:text-base text-foreground/60 mt-2 max-w-xl">
                                    <Balancer>
                                        {document.description}. Browse and download documents from {document.years[0]} to {document.years[document.years.length - 1]}.
                                    </Balancer>
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button 
                                    size="sm"
                                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                                    onClick={() => setViewMode('list')}
                                    className="h-9"
                                >
                                    <FileText className="size-4 mr-2" />
                                    List View
                                </Button>
                                <Button 
                                    size="sm"
                                    variant={viewMode === 'embed' ? 'default' : 'ghost'}
                                    onClick={() => setViewMode('embed')}
                                    className="h-9"
                                >
                                    <Eye className="size-4 mr-2" />
                                    Drive Preview
                                </Button>
                            </div>
                        </div>
                    </Container>

                    {/* MAIN CONTENT AREA */}
                    <div className="flex gap-6">
                        {/* YEAR SIDEBAR */}
                        <aside className="w-48 shrink-0 hidden lg:block">
                            <div className="sticky top-24">
                                <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Calendar className="size-3" />
                                    Select Year
                                </h3>
                                <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-2">
                                    <button
                                        onClick={() => setSelectedYear(null)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                                            selectedYear === null 
                                                ? "bg-primary text-white font-medium" 
                                                : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                                        )}
                                    >
                                        All Years
                                    </button>
                                    {reversedYears.map((year, index) => (
                                        <button
                                            key={year}
                                            onClick={() => setSelectedYear(year)}
                                            className={cn(
                                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                                                selectedYear === year 
                                                    ? "bg-primary text-white font-medium" 
                                                    : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </aside>

                        {/* CONTENT */}
                        <main className="flex-1 min-w-0">
                            {viewMode === 'list' ? (
                                <div className="space-y-4">
                                    {/* Mobile Year Selector */}
                                    <div className="lg:hidden mb-4">
                                        <select 
                                            value={selectedYear || ''}
                                            onChange={(e) => setSelectedYear(e.target.value || null)}
                                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground text-sm"
                                        >
                                            <option value="">All Years</option>
                                            {reversedYears.map(year => (
                                                <option key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {(selectedYear ? document.years.filter(y => y === selectedYear) : document.years).map((year, index) => (
                                            <motion.div
                                                key={year}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.02 }}
                                                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <FileText className="size-5 text-primary" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                                                            {document.title} {year}
                                                        </h3>
                                                        <p className="text-xs text-foreground/60 mb-3 line-clamp-2">
                                                            {document.description} for fiscal year {year}.
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                className="h-7 text-xs"
                                                                asChild
                                                            >
                                                                <a 
                                                                    href={`https://drive.google.com/drive/folders/${document.folderId}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Eye className="size-3 mr-1" />
                                                                    View
                                                                </a>
                                                            </Button>
                                                            <Button 
                                                                size="sm" 
                                                                variant="ghost" 
                                                                className="h-7 text-xs"
                                                                asChild
                                                            >
                                                                <a 
                                                                    href={`https://drive.google.com/drive/folders/${document.folderId}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                >
                                                                    <Download className="size-3 mr-1" />
                                                                    PDF
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[70vh] rounded-2xl overflow-hidden border border-white/10">
                                    <iframe
                                        src={`https://drive.google.com/embeddedfolderview?id=${document.folderId}#list`}
                                        className="w-full h-full"
                                        title={document.title}
                                    />
                                </div>
                            )}
                        </main>
                    </div>

                    {/* FOOTER */}
                    <Container animation="fadeUp" delay={0.5} className="max-w-3xl mx-auto w-full pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4 sm:px-6">
                        <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
                        <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                            <a href="mailto:hello@budgetndiostory.com" className="hover:text-foreground transition-colors">Email</a>
                            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                        </div>
                    </Container>
                </div>
            </Wrapper>
        </section>
    )
}