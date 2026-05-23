"use client";

import { useEffect, useState } from "react";
import { useLearn, type LearnTab } from "@/contexts/learn-context";
import { useAuth } from "@/contexts/auth-context";
import { UnitFolderGrid } from "@/components/learn/unit-folder-grid";
import { StandaloneArticlesStrip } from "@/components/learn/standalone-articles-strip";
import type { LearningUnitSummary } from "@/lib/learning-units";
import { learnHubApi, type LearnHubSummary, type LearnHubItem } from "@/lib/learn-hub";
import { Routes } from "@/constants/routes";
import { Button } from "@/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { 
  Play, Flame, Search, Trophy, User, Sparkles, BookOpen, 
  ArrowRight, ShieldCheck, Award, MapPin, Calendar, CheckCircle2,
  Bell, Volume2, Shield
} from "lucide-react";
import { fadeInUp, scaleIn, fadeIn } from "@/motion/variants";

export function LearnPathsHome() {
  const { isLoggedIn, user } = useAuth();
  const { activeTab, setActiveTab, gamification, activeModule } = useLearn();
  
  const [units, setUnits] = useState<LearningUnitSummary[]>([]);
  const [summary, setSummary] = useState<LearnHubSummary | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Settings states
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState("system");

  useEffect(() => {
    void learnHubApi
      .units()
      .then((data) => setUnits(data.results ?? []))
      .catch(() => setUnits([]));
    void learnHubApi.summary().then(setSummary).catch(() => setSummary(null));
  }, []);

  // Filter paths and articles based on search query
  const filteredUnits = units.filter(unit => 
    unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (unit.description && unit.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Gamification stats
  const points = gamification?.points ?? 0;
  const level = gamification?.level ?? 1;
  const streak = gamification?.streak_days ?? 0;

  // Render subviews based on activeTab
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 space-y-8 flex-1 flex flex-col justify-start">
      {activeTab === "hub" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-8 w-full"
        >
          {/* 🌟 Resume Hero Card */}
          {activeModule && (
            <motion.div 
              variants={fadeInUp}
              className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8 shadow-xl"
            >
              <div className="absolute top-[-40%] right-[-10%] w-[350px] h-[350px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-2 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                    <Sparkles className="size-3.5 fill-primary" /> Active Path
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{activeModule.title}</h2>
                  <p className="text-sm text-muted-foreground">Pick up right where you left off. Explore statutory documents with guided questions.</p>
                  
                  {/* Progress bar */}
                  <div className="pt-2 max-w-md">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1">
                      <span className="text-primary">{activeModule.progress}% Completed</span>
                      <span className="text-muted-foreground">Chapter 2 of 5</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${activeModule.progress}%` }} />
                    </div>
                  </div>
                </div>

                <Link href={`/learn/national-estimates/`}>
                  <Button size="lg" className="rounded-xl gap-2 font-bold px-6 shadow-md shadow-primary/25 group">
                    <Play className="size-4 fill-current group-hover:scale-110 transition-transform" /> Resume Module
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* 🎮 Daily Quest Card */}
          <motion.div 
            variants={fadeInUp}
            className="rounded-3xl border border-border bg-card p-6 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <Flame className="size-6 fill-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Daily Quest: Read 2 Articles</h3>
                <p className="text-sm text-muted-foreground">Boost your streak and level up your civic profile.</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-medium text-foreground/80">
                  <span className="px-2 py-0.5 rounded bg-muted">Progress: 1 / 2</span>
                  <span className="text-orange-500">🔥 +3 Day Streak</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="rounded-xl font-bold px-5 border-border/80 hover:bg-muted" onClick={() => setActiveTab("paths")}>
              Go to Paths
            </Button>
          </motion.div>

          {/* 🛤️ Horizontal Scroll Paths */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight">Start a New Path</h2>
                <p className="text-sm text-muted-foreground">Select a statutory family to begin guided learning.</p>
              </div>
            </div>
            <UnitFolderGrid units={units} />
          </section>

          {/* 📰 Standalone Explainers */}
          <StandaloneArticlesStrip />
        </motion.div>
      )}

      {activeTab === "search" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-6 w-full flex-1"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Search Learning Hub</h2>
            <p className="text-sm text-muted-foreground">Look up articles, summaries, video paths, or statutory categories.</p>
          </div>

          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description or tag..."
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-card text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-sm"
            />
          </div>

          {filteredUnits.length > 0 ? (
            <div className="pt-4 space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Paths Found</h3>
              <UnitFolderGrid units={filteredUnits} />
            </div>
          ) : (
            <div className="py-16 text-center space-y-2">
              <BookOpen className="size-12 text-muted-foreground/40 mx-auto" />
              <h3 className="font-bold text-lg">No matches found</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">Try searching for other terms like &quot;Estimates&quot;, &quot;Policy&quot;, or &quot;Allocation&quot;.</p>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "leaderboard" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-6 w-full"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">See how you rank against other civic champions this week.</p>
          </div>

          {/* Leaderboard entries */}
          <div className="border border-border rounded-3xl overflow-hidden bg-card shadow-md">
            <div className="divide-y divide-border">
              {/* Row 1 */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-yellow-500/5">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full bg-yellow-500/10 text-yellow-600 font-black text-sm flex items-center justify-center border border-yellow-500/20">1</div>
                  <div className="size-10 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center font-bold text-sm">PK</div>
                  <div>
                    <h4 className="font-bold text-sm">Peculiar Koros</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Civic Expert</p>
                  </div>
                </div>
                <span className="font-black text-sm text-yellow-600">820 XP</span>
              </div>

              {/* Row 2 */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-500/5">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full bg-slate-500/10 text-slate-600 font-black text-sm flex items-center justify-center border border-slate-500/20">2</div>
                  <div className="size-10 rounded-full bg-slate-500/20 text-slate-600 flex items-center justify-center font-bold text-sm">SO</div>
                  <div>
                    <h4 className="font-bold text-sm">Shem Odhiambo</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Policy Analyst</p>
                  </div>
                </div>
                <span className="font-black text-sm text-slate-600">750 XP</span>
              </div>

              {/* Row 3 */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-amber-700/5">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full bg-amber-700/10 text-amber-800 font-black text-sm flex items-center justify-center border border-amber-700/20">3</div>
                  <div className="size-10 rounded-full bg-amber-700/20 text-amber-800 flex items-center justify-center font-bold text-sm">MO</div>
                  <div>
                    <h4 className="font-bold text-sm">Movine Omondi</h4>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Storyteller</p>
                  </div>
                </div>
                <span className="font-black text-sm text-amber-800">680 XP</span>
              </div>

              {/* Current User Row */}
              <div className="flex items-center justify-between p-4 sm:p-5 bg-primary/10 border-y-2 border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="size-8 rounded-full bg-primary/20 text-primary font-black text-sm flex items-center justify-center">4</div>
                  <div className="size-10 rounded-full bg-primary/25 text-primary flex items-center justify-center font-bold text-sm">
                    {user?.display_name?.slice(0, 2).toUpperCase() || "ME"}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{user?.display_name || "You"} (Me)</h4>
                    <p className="text-[10px] text-primary uppercase font-bold">Level {level}</p>
                  </div>
                </div>
                <span className="font-black text-sm text-primary">{points} XP</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "profile" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-6 w-full"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-3xl border border-border bg-card shadow-md">
            <div className="size-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary text-3xl font-black">
              {user?.email?.charAt(0).toUpperCase() || "B"}
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1">
              <h2 className="text-2xl font-extrabold tracking-tight">{user?.display_name || user?.email?.split("@")[0]}</h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-1"><MapPin className="size-3.5" /> Nairobi, KE</span>
                <span className="flex items-center gap-1"><Calendar className="size-3.5" /> Joined May 2026</span>
              </div>
            </div>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 text-center space-y-1 shadow-sm">
              <span className="text-xs text-muted-foreground font-bold">XP</span>
              <p className="text-xl sm:text-2xl font-black text-primary">{points}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center space-y-1 shadow-sm">
              <span className="text-xs text-muted-foreground font-bold">LEVEL</span>
              <p className="text-xl sm:text-2xl font-black text-primary">{level}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 text-center space-y-1 shadow-sm">
              <span className="text-xs text-muted-foreground font-bold">STREAK</span>
              <p className="text-xl sm:text-2xl font-black text-orange-500">{streak} 🔥</p>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-widest">Unlocked Badges</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div className="size-10 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center border border-yellow-500/20 shrink-0">
                  <Award className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Pioneer</h4>
                  <p className="text-[10px] text-muted-foreground">Joined early access</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 shadow-sm opacity-60">
                <div className="size-10 rounded-xl bg-slate-500/10 text-slate-500 flex items-center justify-center border border-slate-500/20 shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Expert</h4>
                  <p className="text-[10px] text-muted-foreground">Answer 10 quizzes</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "paths" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-6 w-full"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Learning Paths</h2>
            <p className="text-sm text-muted-foreground">Browse all statutory budget document families.</p>
          </div>
          <UnitFolderGrid units={units} />
        </motion.div>
      )}

      {activeTab === "documents" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-6 w-full"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Official Documents</h2>
            <p className="text-sm text-muted-foreground">Access official government budget PDFs and releases.</p>
          </div>
          {summary?.trending && (
            <div className="grid gap-4">
              {summary.trending.filter(t => t.content_type === "document").map(doc => (
                <a 
                  key={doc.id}
                  href={doc.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between hover:border-primary/40 transition-colors shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-sm">{doc.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">Official budget PDF release</p>
                  </div>
                  <ArrowRight className="size-4 text-primary" />
                </a>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {activeTab === "quests" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-6 w-full"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Active Quests</h2>
            <p className="text-sm text-muted-foreground">Complete daily challenges to earn bonus XP points.</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-md flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <Flame className="size-6 fill-orange-500" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Daily Quest: Read 2 Articles</h3>
                <p className="text-sm text-muted-foreground">Complete today before midnight.</p>
                <div className="h-1.5 w-32 bg-muted rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-primary" style={{ width: "50%" }} />
                </div>
              </div>
            </div>
            <span className="font-black text-sm text-primary">+50 XP</span>
          </div>
        </motion.div>
      )}

      {activeTab === "settings" && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn} 
          className="space-y-6 w-full max-w-xl"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight">Settings</h2>
            <p className="text-sm text-muted-foreground">Manage your guided learning and interface settings.</p>
          </div>

          <div className="border border-border rounded-3xl overflow-hidden bg-card divide-y divide-border shadow-sm">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-muted-foreground" />
                <div>
                  <h4 className="font-bold text-sm">Push Notifications</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Alert me of new paths and daily quest reminders.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={pushEnabled} 
                onChange={(e) => setPushEnabled(e.target.checked)}
                className="size-5 text-primary focus:ring-primary border-border rounded"
              />
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <Volume2 className="size-5 text-muted-foreground" />
                <div>
                  <h4 className="font-bold text-sm">Sound Effects</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Play reward particles and confetti sound effects.</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={soundEnabled} 
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="size-5 text-primary focus:ring-primary border-border rounded"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
