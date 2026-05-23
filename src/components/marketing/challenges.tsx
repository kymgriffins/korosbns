"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Wrapper from "@/components/global/wrapper";
import SectionBadge from "@/ui/section-badge";
import { Button } from "@/ui/button";
import { 
    Trophy, 
    Calendar, 
    Hash, 
    Play, 
    CheckCircle2, 
    ArrowRight, 
    Video, 
    Users,
    Gift,
    Timer,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Campaign } from "@/lib/campaign/types";
import { cn } from "@/utils";

const Challenges = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"active" | "upcoming" | "completed">("active");

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await fetch("/api/campaigns");
                const json = await res.json();
                if (json.success) {
                    setCampaigns(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    const filteredCampaigns = campaigns.filter(c => c.status === activeTab);
    const featuredCampaign = campaigns.find(c => c.status === "active");

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    return (
        <section className="relative w-full min-h-screen bg-background pb-20 overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[140px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/10 blur-[140px] rounded-full"
                />
            </div>

            <Wrapper className="relative z-10 pt-16 lg:pt-24">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <SectionBadge title="Weekly Challenges" />
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold font-heading tracking-tight mt-6"
                    >
                        Amplify your voice, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">win for the community</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-base md:text-lg text-muted-foreground mt-6 leading-relaxed"
                    >
                        Join our weekly TikTok and YouTube Shorts challenges. Decode budget mysteries, share local stories, and get rewarded for civic action.
                    </motion.p>
                </div>

                {/* Featured Active Challenge */}
                {featuredCampaign && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative mb-20 overflow-hidden rounded-[2.5rem] border border-primary/20 bg-black/40 backdrop-blur-xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/5" />
                        
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 p-8 lg:p-12">
                            <div className="space-y-8">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                        <Timer className="size-3.5 animate-pulse" />
                                        Active Challenge
                                    </div>
                                    <h2 className="text-3xl lg:text-4xl font-bold">{featuredCampaign.title}</h2>
                                    <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                                        {featuredCampaign.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Hash className="size-5 text-primary" />
                                            <span className="text-sm font-semibold uppercase text-foreground/70">Required Hashtag</span>
                                        </div>
                                        <div className="text-xl font-mono font-bold text-white tracking-tight">
                                            {featuredCampaign.hashtag}
                                        </div>
                                    </div>
                                    {featuredCampaign.buzzword && (
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Video className="size-5 text-purple-400" />
                                                <span className="text-sm font-semibold uppercase text-foreground/70">Weekly Buzzword</span>
                                            </div>
                                            <div className="text-xl font-mono font-bold text-white tracking-tight italic">
                                                &quot;{featuredCampaign.buzzword}&quot;
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="size-5 text-emerald-500" />
                                        How to participate
                                    </h3>
                                    <ul className="space-y-3">
                                        {featuredCampaign.rules.participationSteps.map((step, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-muted-foreground items-start">
                                                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary mt-0.5">
                                                    {i + 1}
                                                </span>
                                                {step}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 group">
                                        Submit Your Link
                                        <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <Link href="https://tiktok.com" target="_blank">
                                        <Button variant="outline" size="lg" className="rounded-full border-white/10 hover:bg-white/5">
                                            Open TikTok
                                            <ExternalLink className="ml-2 size-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="relative lg:block hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                                <div className="h-full w-full rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                                    {/* Mock Video Placeholder */}
                                    <div className="text-center space-y-4 p-8">
                                        <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                                            <Play className="size-10 text-primary fill-primary" />
                                        </div>
                                        <h4 className="text-xl font-bold uppercase tracking-widest opacity-40">Sample Challenge Reel</h4>
                                        <p className="text-xs text-muted-foreground">Example content showing how to use the buzzword</p>
                                    </div>
                                </div>

                                {/* Reward Floating Cards */}
                                <div className="absolute -bottom-6 -left-6 z-20 space-y-3">
                                    {featuredCampaign.rewards.slice(0, 2).map((reward, i) => (
                                        <motion.div
                                            key={reward.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.5 + i * 0.1 }}
                                            className="p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center gap-4 min-w-[240px]"
                                        >
                                            <div className="size-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                                <Trophy className="size-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-amber-500">{reward.tier} Reward</p>
                                                <p className="text-sm font-semibold text-white">{reward.label}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Tabs for other campaigns */}
                <div className="flex flex-col items-center mb-12">
                    <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        {(["active", "upcoming", "completed"] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-300",
                                    activeTab === tab 
                                        ? "bg-primary text-white shadow-lg shadow-primary/25" 
                                        : "text-muted-foreground hover:text-white"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Campaigns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <AnimatePresence mode="wait">
                        {filteredCampaigns.length > 0 ? (
                            filteredCampaigns.map((campaign, idx) => (
                                <motion.article
                                    key={campaign.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                    className="group relative flex flex-col h-full rounded-3xl border border-white/10 bg-white/2 hover:bg-white/5 hover:border-primary/30 transition-all p-6 overflow-hidden"
                                >
                                    {activeTab === "completed" && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                                                <CheckCircle2 className="size-5 text-emerald-500" />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={cn(
                                            "size-12 rounded-2xl flex items-center justify-center transition-colors",
                                            campaign.type === "weekly-buzzword" ? "bg-primary/10 text-primary" : "bg-purple-500/10 text-purple-400"
                                        )}>
                                            {campaign.type === "weekly-buzzword" ? <Video className="size-6" /> : <Trophy className="size-6" />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                                                {campaign.title}
                                            </h3>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-1">
                                                {campaign.type.replace("-", " ")}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-8 leading-relaxed">
                                        {campaign.description}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-2">
                                                <Hash className="size-4 text-primary" />
                                                <span className="text-xs font-mono font-bold">{campaign.hashtag}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold">
                                                <Timer className="size-3" />
                                                {activeTab === "upcoming" ? "Starting Soon" : activeTab === "active" ? "Ending Soon" : "Winner Announced"}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map((i) => (
                                                    <div key={i} className="size-7 rounded-full border-2 border-background bg-foreground/10 flex items-center justify-center text-[10px] font-bold">
                                                        {i === 3 ? "..." : <Users className="size-3" />}
                                                    </div>
                                                ))}
                                                <span className="ml-4 text-[10px] font-bold text-muted-foreground self-center">
                                                    {campaign.metrics.submissions} Submissions
                                                </span>
                                            </div>
                                            <Link href={`/challenges/${campaign.slug}`} className="text-xs font-bold text-primary flex items-center gap-1 group/link">
                                                {activeTab === "completed" ? "View Winners" : "View Details"}
                                                <ArrowRight className="size-3 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.article>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <div className="size-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                                    <Calendar className="size-10 text-muted-foreground opacity-20" />
                                </div>
                                <h3 className="text-xl font-bold opacity-40">No {activeTab} challenges found</h3>
                                <p className="text-muted-foreground mt-2">Check back soon for new opportunities!</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Rewards Showcase */}
                <div className="mt-32 relative rounded-[3rem] border border-white/10 bg-foreground/2 p-8 lg:p-16 overflow-hidden">
                    <div className="absolute top-0 right-0 size-64 bg-primary/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-0 left-0 size-64 bg-purple-500/10 blur-[100px] rounded-full" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <SectionBadge title="Rewards & Prizes" />
                            <h2 className="text-3xl lg:text-5xl font-bold mt-6 tracking-tight">Your impact is <br />rewarded.</h2>
                            <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
                                We believe in celebrating youth voices. Every challenge entry is reviewed by our team, and the best stories win more than just views.
                            </p>
                            
                            <div className="mt-10 space-y-6">
                                {[
                                    { icon: Trophy, title: "Grand Prizes", desc: "Cash rewards and branded creator kits for top-tier storytellers.", color: "text-amber-500" },
                                    { icon: Users, title: "Media Spotlight", desc: "Get your content featured on our platforms reaching millions.", color: "text-blue-400" },
                                    { icon: Gift, title: "Exclusive Access", desc: "VIP invitations to budget workshops and partner events.", color: "text-purple-400" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className={cn("size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0", item.color)}>
                                            <item.icon className="size-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="aspect-square rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center p-6 text-center"
                                >
                                    <div>
                                        <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="size-6 text-primary" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-40">Winner #{i}</p>
                                        <p className="text-sm font-semibold mt-2">Coming Soon</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-32 text-center pb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-12 rounded-[3rem] bg-gradient-to-br from-primary/20 to-purple-500/20 border border-primary/30"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold">Ready to start your story?</h2>
                        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                            Join thousands of young Kenyans making public finance accessible and fun.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Button size="lg" className="rounded-full px-10">Start Challenge</Button>
                            <Button variant="outline" size="lg" className="rounded-full border-white/20 hover:bg-white/10">View Rulebook</Button>
                        </div>
                    </motion.div>
                </div>
            </Wrapper>
        </section>
    );
};

export default Challenges;
