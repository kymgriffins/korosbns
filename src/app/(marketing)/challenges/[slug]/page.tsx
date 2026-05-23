"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/ui/button";
import { 
    ArrowLeft, 
    Calendar, 
    Hash, 
    CheckCircle2, 
    AlertCircle,
    Trophy,
    Video,
    Share2,
    ExternalLink
} from "lucide-react";
import { Campaign } from "@/lib/campaign/types";
import { cn } from "@/utils";
import SectionBadge from "@/ui/section-badge";

const ChallengeDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await fetch(`/api/campaigns/${params.slug}`);
                const json = await res.json();
                if (json.success) {
                    setCampaign(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch campaign:", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchCampaign();
        }
    }, [params.slug]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center space-y-6">
                <AlertCircle className="size-16 text-muted-foreground opacity-20" />
                <h1 className="text-2xl font-bold">Challenge not found</h1>
                <Button onClick={() => router.push("/challenges")}>Back to Challenges</Button>
            </div>
        );
    }

    return (
        <section className="relative w-full min-h-screen bg-background pb-20 overflow-hidden pt-12 lg:pt-20">
             {/* Ambient Background Elements */}
             <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <Wrapper>
                <button 
                    onClick={() => router.push("/challenges")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors mb-12"
                >
                    <ArrowLeft className="size-4" />
                    Back to all challenges
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                    <div className="space-y-12">
                        {/* Main Info */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <SectionBadge title={campaign.type.replace("-", " ")} />
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                    campaign.status === "active" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" :
                                    campaign.status === "upcoming" ? "bg-amber-500/10 border-amber-500/30 text-amber-500" :
                                    "bg-white/10 border-white/20 text-white"
                                )}>
                                    {campaign.status}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                                {campaign.title}
                            </h1>
                            <p className="text-lg md:text-xl text-muted-foreground mt-6 leading-relaxed max-w-3xl">
                                {campaign.description}
                            </p>
                        </div>

                        {/* Rules Section */}
                        <div className="p-8 lg:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold flex items-center gap-3">
                                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                            <CheckCircle2 className="size-5 text-primary" />
                                        </div>
                                        Participation Rules
                                    </h3>
                                    <ul className="space-y-4">
                                        {campaign.rules.participationSteps.map((step, i) => (
                                            <li key={i} className="flex gap-4 text-muted-foreground">
                                                <span className="font-bold text-primary">{i+1}.</span>
                                                <span className="text-sm">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold flex items-center gap-3 text-rose-500">
                                        <div className="size-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                                            <AlertCircle className="size-5" />
                                        </div>
                                        Disallowed Content
                                    </h3>
                                    <ul className="space-y-4">
                                        {campaign.rules.disallowedContent.map((rule, i) => (
                                            <li key={i} className="flex gap-4 text-muted-foreground">
                                                <span className="font-bold text-rose-500 opacity-50">•</span>
                                                <span className="text-sm">{rule}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Winners / Metrics section */}
                        {campaign.status === "completed" ? (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold">Announced Winners</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {campaign.rewards.map((reward) => (
                                        <div key={reward.id} className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 flex items-center gap-6">
                                            <div className="size-14 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                                                <Trophy className="size-8 text-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase tracking-widest text-amber-500">{reward.tier} Winner</p>
                                                <h4 className="text-lg font-bold mt-1">{reward.label}</h4>
                                                <p className="text-xs text-muted-foreground mt-1">{reward.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">Total Views</p>
                                    <p className="text-3xl font-bold text-primary">{campaign.metrics.views.toLocaleString()}</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">Submissions</p>
                                    <p className="text-3xl font-bold text-purple-400">{campaign.metrics.submissions}</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-2">Social Shares</p>
                                    <p className="text-3xl font-bold text-emerald-400">{campaign.metrics.shares}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Actions */}
                    <aside className="space-y-6 lg:sticky lg:top-24">
                        <div className="p-8 rounded-[2rem] bg-primary border border-white/10 text-white shadow-2xl shadow-primary/20">
                            <h3 className="text-xl font-bold mb-4">Take Part Now</h3>
                            <p className="text-sm text-white/80 mb-8 leading-relaxed">
                                Ready to show the world your budget story? Record, post, and share your link below.
                            </p>
                            
                            <div className="space-y-4 mb-8">
                                <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Hash className="size-4 text-white/70" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Campaign Hashtag</span>
                                    </div>
                                    <p className="font-mono font-bold text-lg">{campaign.hashtag}</p>
                                </div>
                                {campaign.buzzword && (
                                    <div className="p-4 rounded-xl bg-black/20 border border-white/10">
                                        <div className="flex items-center gap-3 mb-1">
                                            <Video className="size-4 text-white/70" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Weekly Buzzword</span>
                                        </div>
                                        <p className="font-mono font-bold text-lg italic">&quot;{campaign.buzzword}&quot;</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Button size="lg" variant="white" className="w-full rounded-xl font-bold">
                                    Submit Your Link
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1 rounded-xl bg-black/10 border-white/20 hover:bg-black/20">
                                        TikTok
                                    </Button>
                                    <Button variant="outline" className="flex-1 rounded-xl bg-black/10 border-white/20 hover:bg-black/20">
                                        YouTube
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
                            <h3 className="font-bold mb-6 flex items-center gap-2">
                                <Calendar className="size-5 text-primary" />
                                Timeline
                            </h3>
                            <div className="space-y-6">
                                <div className="relative pl-8 border-l border-white/10 pb-6">
                                    <div className="absolute left-[-5px] top-0 size-2 rounded-full bg-primary" />
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Started At</p>
                                    <p className="text-sm font-semibold mt-1">{new Date(campaign.startsAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                                <div className="relative pl-8 border-l border-white/10">
                                    <div className="absolute left-[-5px] top-0 size-2 rounded-full bg-foreground/20" />
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Ends At</p>
                                    <p className="text-sm font-semibold mt-1">{new Date(campaign.endsAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full mt-8 text-xs font-bold text-primary hover:bg-primary/5">
                                <Share2 className="size-3 mr-2" />
                                Invite Friends
                            </Button>
                        </div>
                    </aside>
                </div>
            </Wrapper>
        </section>
    );
};

export default ChallengeDetailPage;
