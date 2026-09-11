"use client"

import React, { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import Wrapper from '../global/wrapper'
import Container from '../global/container'
import { Button } from '@/components/ui/button'
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
    Search,
    File
} from 'lucide-react'
import { cn } from '@/utils'
import Balancer from 'react-wrap-balancer'
import { DocumentType } from '@/constants/documents'

interface DocumentViewerProps {
    document: DocumentType;
}

// Extract year from filename
function extractYearFromFilename(filename: string): string | null {
    // Match patterns like "FY2015-16", "FY2019-20", "2015-2016", etc.
    const match = filename.match(/(?:FY)?\s*(\d{4})[-/](\d{2,4})/i);
    if (match) {
        return match[1]; // Return the starting year
    }
    // Also match standalone years
    const yearMatch = filename.match(/\b(20\d{2})\b/);
    if (yearMatch) {
        return yearMatch[1];
    }
    return null;
}

// Format file size for display
function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
    const [selectedYear, setSelectedYear] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Extract unique years from filenames
    const availableYears = useMemo(() => {
        const years = new Set<string>();
        document.files.forEach(file => {
            const year = extractYearFromFilename(file.name);
            if (year) {
                years.add(year);
            }
        });
        return Array.from(years).sort();
    }, [document.files]);

    // Filter files based on selected year and search query
    const filteredFiles = useMemo(() => {
        return document.files.filter(file => {
            const year = extractYearFromFilename(file.name);
            const yearMatch = !selectedYear || year === selectedYear;
            
            const searchMatch = !searchQuery || 
                file.name.toLowerCase().includes(searchQuery.toLowerCase());
            
            return yearMatch && searchMatch;
        });
    }, [document.files, selectedYear, searchQuery]);

    return (
        <section className="relative w-full min-h-screen bg-background overflow-hidden flex flex-col pt-20">
            {/* Ambient background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full opacity-30" />
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
                                    <span>{document.folderName}</span>
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-bold font-heading tracking-tight">
                                    {document.fullName}
                                </h1>
                                <p className="text-sm sm:text-base text-foreground/60 mt-2 max-w-xl">
                                    <Balancer>
                                        {document.description}. Browse and download {document.files.length} documents.
                                    </Balancer>
                                </p>
                            </div>
                        </div>
                    </Container>

                    {/* FILTERS */}
                    <Container animation="fadeUp" delay={0.2} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-foreground/40" />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            
                            {/* Year Filter */}
                            <select 
                                value={selectedYear || ''}
                                onChange={(e) => setSelectedYear(e.target.value || null)}
                                className="px-4 py-2 rounded-lg bg-muted/30 border border-border text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
                            >
                                <option value="">All Years</option>
                                {availableYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </Container>

                    {/* FILE LIST */}
                    <Container animation="fadeUp" delay={0.3}>
                        {filteredFiles.length === 0 ? (
                            <div className="text-center py-12 text-foreground/60">
                                <FileText className="size-12 mx-auto mb-4 opacity-50" />
                                <p>No documents found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filteredFiles.map((file, index) => {
                                    const year = extractYearFromFilename(file.name);
                                    return (
                                        <motion.div
                                            key={file.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.02 }}
                                            className="group p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-all"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <File className="size-5 text-primary" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors line-clamp-2" title={file.name}>
                                                        {file.name}
                                                    </h3>
                                                    <div className="flex items-center gap-3 text-xs text-foreground/40 mb-3">
                                                        {year && (
                                                            <span className="inline-flex items-center gap-1">
                                                                <Calendar className="size-3" />
                                                                {year}
                                                            </span>
                                                        )}
                                                        <span>{formatFileSize(file.size)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button 
                                                            size="sm" 
                                                            variant="ghost" 
                                                            className="h-7 text-xs"
                                                            asChild
                                                        >
                                                            <a 
                                                                href={file.url}
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
                                                                href={file.downloadUrl || `${file.url}${file.url.includes("?") ? "&" : "?"}download=1`}
                                                                download
                                                                rel="noopener noreferrer"
                                                            >
                                                                <Download className="size-3 mr-1" />
                                                                Download
                                                            </a>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </Container>

                    {/* FOOTER */}
                    <Container animation="fadeUp" delay={0.5} className="max-w-3xl mx-auto w-full pt-12 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4 sm:px-6">
                        <p className="text-[10px] font-medium">© 2026 Budget Ndio Story.</p>
                        <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                            <a href="mailto:info@budgetndiostory.org" className="hover:text-foreground transition-colors">Email</a>
                            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
                            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
                        </div>
                    </Container>
                </div>
            </Wrapper>
        </section>
    )
}
