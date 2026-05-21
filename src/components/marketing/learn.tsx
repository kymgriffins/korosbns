"use client";

import { cn } from "@/utils";
import Image from "next/image";
import {
    ArrowRight,
    BarChart3,
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    Folder,
    HelpCircle,
    Mail,
    RefreshCcw,
    Send,
    Target,
  Trophy,
    X,
    XCircle,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Balancer from "react-wrap-balancer";
import { toast } from "sonner";
import Container from "../global/container";
import Wrapper from "../global/wrapper";
import { Button } from "../ui/button";

import { resolveAppUrl } from "@/lib/api-url";
import { API_BASE_URL } from "@/lib/api-config";
import {
  citizenApi,
  getAccessToken,
  type SurveyDetailApi,
  type SurveyQuestionApi,
} from "@/lib/api-client";
import {
  mapApiArticle,
  mapApiStory,
  mapStoriesJsonFallback,
  triviaToBrowseCards,
  triviaToQuizQuestions,
  type HubArticle,
  type HubStory,
} from "@/lib/learn-content";
import { fetchPublicOrgConfig } from "@/lib/org-config";


const faqItems = [
  {
    q: "What is the Budget Policy Statement (BPS)?",
    a: "The BPS is a yearly government document that sets out Kenya's spending priorities. It's like a preview of the national budget - showing where money will come from and where it'll go.",
  },
  {
    q: "When is the BPS released?",
    a: "By law (PFM Act), the BPS must be submitted to Parliament by February 15th every year. The final budget comes later on April 30th.",
  },
  {
    q: "What's the difference between BPS and the national budget?",
    a: "Think of BPS as the blueprint or trailer, and the national budget as the full movie. BPS sets the priorities and direction, while the budget is the actual detailed spending plan.",
  },
  {
    q: "What is BETA?",
    a: "BETA = Bottom-Up Economic Transformation Agenda. It's Kenya's plan to grow the economy by focusing on agriculture, small businesses, healthcare, housing, and digital transformation.",
  },
  {
    q: "Why does Kenya borrow so much?",
    a: "Kenya spends more than it collects in taxes (fiscal deficit). The gap is filled through borrowing - both from foreign sources and domestic (like treasury bonds). This helps fund development but also increases debt costs.",
  },
  {
    q: "How much goes to county governments?",
    a: "In 2026/27, counties get KES 420 billion through the equitable share. This funds local services like roads, health, water, and markets in all 47 counties.",
  },
  {
    q: "What are the main fiscal risks?",
    a: "The BPS warns about: rising debt payments, state corporations needing bailouts, economic slowdowns, climate change (droughts/floods), and increased county demands.",
  },
];

const moduleInfo = {
  module: "Module 002",
  title: "Reflecting on Kenya's 2026 Budget Policy Statement (BPS)",
  credits: "Millicent Makini",
};

// Sourced dynamically from BNSKE API

const quizQuestions = [
  {
    question:
      "By when must the Budget Policy Statement be submitted to Parliament?",
    options: ["January 1st", "February 15th", "March 30th", "April 30th"],
    correct: 1,
    explanation:
      "Section 25 of the Public Finance Management Act sets February 15th as the deadline.",
  },
  {
    question: "Which pillar focuses on affordable housing through KMRC?",
    options: ["Agriculture", "MSMEs", "Housing & Settlement", "Digital"],
    correct: 2,
    explanation:
      "Housing & Settlement focuses on affordable housing through the Kenya Mortgage Refinance Company (KMRC).",
  },
  {
    question: "What is Kenya's projected fiscal deficit for FY 2026/27?",
    options: ["KES 500B", "KES 1.15T", "KES 2T", "KES 3T"],
    correct: 1,
    explanation:
      "The projected fiscal deficit is KES 1.15 trillion, financed through KES 225.5B foreign and KES 924B domestic borrowing.",
  },
  {
    question: "What is the main fiscal risk from rising debt?",
    options: [
      "Less tax collection",
      "Less for services",
      "Faster growth",
      "Lower inflation",
    ],
    correct: 1,
    explanation:
      "When debt interest payments rise, less money is available for actual services like roads, healthcare, and education.",
  },
  {
    question: "How much goes to county governments via equitable share?",
    options: ["KES 200B", "KES 320B", "KES 420B", "KES 500B"],
    correct: 2,
    explanation:
      "KES 420 billion is allocated to county governments for devolved services like roads, health, water, and markets.",
  },
];

function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
                height: openFaq === idx ? "auto" : 0,
                opacity: openFaq === idx ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="px-4 pb-4 text-sm text-foreground/70 pl-8">
                {item.a}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const payload = {
      email,
      first_name: email.split("@")[0],
      source: "learn_page",
    };

    console.log("Newsletter subscribe (learn_page) payload:", payload);

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/newsletter/subscribe/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      console.log(
        "Newsletter subscribe (learn_page) response:",
        res.status,
        data,
      );
      if (
        res.ok &&
        (data.status === "success" || data.status === "already_subscribed")
      ) {
        setSubscribed(true);
      } else {
        toast.error(data.message || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Newsletter subscribe (learn_page) error:", error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 rounded-2xl bg-gradient-to-r from-primary/20 to-teal-500/20 border border-primary/30"
      >
        <CheckCircle className="size-12 text-primary mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">You're Subscribed!</h3>
        <p className="text-foreground/60">You'll receive budget updates.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/10"
    >
      <div className="text-center mb-6">
        <Mail className="size-10 text-primary mx-auto mb-3" />
        <h3 className="text-xl font-bold">Stay Updated</h3>
        <p className="text-sm text-foreground/60">
          Get budget insights delivered.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-sm"
          required
        />
        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="px-4 rounded-xl"
        >
          {loading ? (
            <RefreshCcw className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </form>
    </motion.div>
  );
}

type AppState = "hub" | "article" | "quiz" | "complete" | "survey" | "survey-complete";
const STORY_WATCHED_STORAGE_KEY = "bns_story_watched";
const GAMIFICATION_ID_STORAGE_KEY = "bns_gamification_id";

type GamificationState = {
  points: number;
  level: number;
  streak_days: number;
};

export default function Learn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appState, setAppState] = useState<AppState>("hub");
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [articleIndex, setArticleIndex] = useState(0);
  const [stories, setStories] = useState<HubStory[]>([]);
  const [storyFlowsState, setStoryFlowsState] = useState<Record<string, any[]>>({
    "budget-trivia": []
  });
  const [articles, setArticles] = useState<HubArticle[]>([]);
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [contentError, setContentError] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<HubArticle | null>(null);
  const [activeSurvey, setActiveSurvey] = useState<SurveyDetailApi | null>(null);
  const [surveyLoading, setSurveyLoading] = useState(false);
  const [surveySubmitting, setSurveySubmitting] = useState(false);
  const [orgTagline, setOrgTagline] = useState<string | null>(null);
  const [activeTriviaId, setActiveTriviaId] = useState<string | null>(null);
  const [apiQuizQuestions, setApiQuizQuestions] = useState<
    Array<{ id: string; question: string; options: string[]; correct: number; explanation: string }>
  >([]);
  const [quizAnswersByQuestion, setQuizAnswersByQuestion] = useState<Record<string, number>>({});
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [readyForQuiz, setReadyForQuiz] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [triviaCards, setTriviaCards] = useState<any[]>([]);
  const [surveyIndex, setSurveyIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, unknown>>({});
  const [watchedStories, setWatchedStories] = useState<Record<string, boolean>>({});
  const [currentFlowCards, setCurrentFlowCards] = useState<any[]>([]);
  const [gamification, setGamification] = useState<GamificationState | null>(null);
  const [youtubeVideos, setYoutubeVideos] = useState<any[]>([]);

  useEffect(() => {
    fetch(resolveAppUrl("/api/youtube"))
      .then((res) => res.json())
      .then((data) => {
        if (data.videos) setYoutubeVideos(data.videos);
      })
      .catch((err) => console.error("Failed to load YouTube videos:", err));
  }, []);

  useEffect(() => {
    void fetchPublicOrgConfig().then((cfg) => {
      if (cfg.tagline) setOrgTagline(cfg.tagline);
    });
  }, []);

  // Fetch stories and articles from BNSKE API
  useEffect(() => {
    const fetchContent = async () => {
      setLoadingContent(true);
      try {
        const storiesData = await citizenApi.getStories();
        const results = storiesData.results || [];
        if (results.length > 0) {
          const parsedStories: HubStory[] = [];
          const parsedFlows: Record<string, any[]> = {};
          results.forEach((item) => {
            const { story, flow } = mapApiStory(item);
            parsedStories.push(story);
            parsedFlows[story.id] = flow;
          });
          setStories(parsedStories);
          setStoryFlowsState({ ...parsedFlows, "budget-trivia": [] });
        } else if (process.env.NODE_ENV === "development") {
          // Dev-only: static stories.json when API returns zero stories (not on network failure).
          const fallback = await import("@/constants/stories.json").then((m) => m.default);
          const { stories: fbStories, flows } = mapStoriesJsonFallback(fallback);
          setStories(fbStories);
          setStoryFlowsState(flows);
        }
      } catch (err) {
        console.error("Failed to fetch stories from API:", err);
        const message =
          err instanceof Error ? err.message : "Could not load stories from the API.";
        setContentError(message);
      }

      try {
        const articlesData = await citizenApi.getArticles();
        if (articlesData.results?.length) {
          setArticles(articlesData.results.map((item) => mapApiArticle(item)));
        }
      } catch (err) {
        console.error("Failed to fetch articles from API:", err);
      } finally {
        setLoadingContent(false);
      }
    };

    void fetchContent();
  }, []);

  useEffect(() => {
    const fetchTrivia = async () => {
      try {
        const data = await citizenApi.getTriviaList();
        const sets = data.results || [];
        if (sets.length) {
          setActiveTriviaId(sets[0].id);
          setApiQuizQuestions(triviaToQuizQuestions(sets[0]));
          setTriviaCards(triviaToBrowseCards(sets));
        }
      } catch (err) {
        console.error("Error fetching trivia:", err);
      }
    };
    void fetchTrivia();
  }, []);

  const getGamificationId = () => {
    if (typeof window === "undefined") return "guest";
    const existing = window.localStorage.getItem(GAMIFICATION_ID_STORAGE_KEY);
    if (existing) return existing;
    const generated = `device-${crypto.randomUUID()}`;
    window.localStorage.setItem(GAMIFICATION_ID_STORAGE_KEY, generated);
    return generated;
  };

  const gamificationFetch = async (path: string, init?: RequestInit) => {
    const identifier = getGamificationId();
    return fetch(resolveAppUrl(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-Gamification-Id": identifier,
        ...(init?.headers || {}),
      },
    });
  };

  const refreshGamification = async () => {
    try {
      const response = await gamificationFetch("/api/gamification/me/");
      if (!response.ok) return;
      const data = await response.json();
      setGamification({
        points: data.points ?? 0,
        level: data.level ?? 1,
        streak_days: data.streak_days ?? 0,
      });
    } catch (error) {
      console.error("Failed to fetch gamification state:", error);
    }
  };

  const awardPoints = async (payload: {
    eventType: "story_complete" | "quiz_complete" | "challenge_submit" | "streak_bonus";
    points: number;
    objectId?: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }) => {
    try {
      const response = await gamificationFetch("/api/gamification/events/", {
        method: "POST",
        body: JSON.stringify({
          event_type: payload.eventType,
          points: payload.points,
          object_id: payload.objectId || "",
          idempotency_key: payload.idempotencyKey,
          metadata: payload.metadata || {},
        }),
      });
      if (!response.ok) return;
      const data = await response.json();
      if (typeof data.points === "number") {
        setGamification({
          points: data.points,
          level: data.level ?? 1,
          streak_days: data.streak_days ?? 0,
        });
      }
    } catch (error) {
      console.error("Failed to award points:", error);
    }
  };

  const handleStoryStart = (id: string) => {
    setSelectedStoryId(id);
    if (id === "budget-trivia" && triviaCards.length > 0) {
      setCurrentFlowCards(triviaCards);
    } else {
      const cards = storyFlowsState[id];
      setCurrentFlowCards(cards || []);
    }
    markStoryWatched(id);
    setAppState("article");
    setArticleIndex(0);
  };

  const currentStoryCards = currentFlowCards.length > 0 ? currentFlowCards : storyFlowsState[selectedStoryId] || [];
  const currentCard = currentStoryCards[articleIndex];
  const isQuizPrompt = Boolean(currentCard && "prompt" in currentCard && currentCard.prompt);
  const isLastCard = articleIndex === currentStoryCards.length - 1;
  const totalCards = currentStoryCards.filter(
    (c) => !("prompt" in c && c.prompt),
  ).length;
  const readingProgress = Math.round((articleIndex / totalCards) * 100);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const bgShift = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const blobOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.3, 0.5, 0.3, 0.1],
  );

  const handleNext = () => {
    if (articleIndex < currentStoryCards.length - 1) {
      setArticleIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (articleIndex > 0) {
      setArticleIndex((i) => i - 1);
    }
  };

  const markStoryWatched = (storyId: string) => {
    setWatchedStories((prev) => {
      if (prev[storyId]) return prev;
      const next = { ...prev, [storyId]: true };
      try {
        window.localStorage.setItem(STORY_WATCHED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage failures in private mode or restricted environments.
      }
      void awardPoints({
        eventType: "story_complete",
        points: 10,
        objectId: storyId,
        idempotencyKey: `story_complete:${storyId}`,
        metadata: { source: "learn_story" },
      });
      return next;
    });
  };

  const sortedHubStories = useMemo(() => {
    return [...stories].sort((a, b) => {
      const aWatched = watchedStories[a.id] ? 1 : 0;
      const bWatched = watchedStories[b.id] ? 1 : 0;
      return aWatched - bWatched;
    });
  }, [stories, watchedStories]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORY_WATCHED_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      setWatchedStories(parsed);
    } catch {
      // Ignore invalid/missing local storage data.
    }
  }, []);

  useEffect(() => {
    void refreshGamification();
  }, []);

  useEffect(() => {
    const storyParam = searchParams.get("story");
    if (!storyParam) return;

    if (storyParam === "budget-trivia" || storyParam in storyFlowsState || stories.some(s => s.id === storyParam)) {
      handleStoryStart(storyParam);
    }
  }, [searchParams, triviaCards, storyFlowsState, stories]);

  useEffect(() => {
    if (appState !== "article") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setAppState("hub");
        setArticleIndex(0);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [appState]);

  const effectiveQuizQuestions =
    apiQuizQuestions.length > 0
      ? apiQuizQuestions
      : quizQuestions.map((q, i) => ({
          id: `local-${i}`,
          question: q.question,
          options: q.options,
          correct: q.correct,
          explanation: q.explanation,
        }));

  const loadActiveSurvey = async () => {
    setSurveyLoading(true);
    try {
      const list = await citizenApi.getSurveys();
      const first = list.results?.[0];
      if (!first) {
        toast.error("No active survey is available right now.");
        return;
      }
      const detail = await citizenApi.getSurvey(first.id);
      if (!detail.questions?.length) {
        toast.error("This survey has no questions yet.");
        return;
      }
      setActiveSurvey(detail);
      setSurveyIndex(0);
      setSurveyAnswers({});
      setAppState("survey");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load survey");
    } finally {
      setSurveyLoading(false);
    }
  };

  const submitSurveyResponses = async () => {
    if (!activeSurvey) return;
    setSurveySubmitting(true);
    try {
      await citizenApi.submitSurvey(activeSurvey.id, surveyAnswers);
      setAppState("survey-complete");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Survey submission failed");
    } finally {
      setSurveySubmitting(false);
    }
  };

  const startQuiz = () => {
    setAppState("quiz");
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setShowFeedback(false);
    setQuizAnswersByQuestion({});
  };

  const handleQuizAnswer = (idx: number) => {
    const q = effectiveQuizQuestions[quizIndex];
    if (!q) return;
    setQuizAnswer(idx);
    setShowFeedback(true);
    setQuizAnswersByQuestion((prev) => ({ ...prev, [q.id]: idx }));
    if (idx === q.correct) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizIndex < effectiveQuizQuestions.length - 1) {
      setQuizIndex((i) => i + 1);
      setQuizAnswer(null);
      setShowFeedback(false);
    } else {
      if (activeTriviaId && getAccessToken()) {
        void citizenApi
          .submitTriviaAttempt(activeTriviaId, quizAnswersByQuestion)
          .catch((err) => console.error("Trivia attempt failed:", err));
      }
      void awardPoints({
        eventType: "quiz_complete",
        points: 20,
        objectId: selectedStoryId,
        idempotencyKey: `quiz_complete:${selectedStoryId}:${new Date().toISOString().slice(0, 10)}`,
        metadata: { score: quizScore, total: effectiveQuizQuestions.length },
      });
      setAppState("complete");
    }
  };

  const handlePrevQuestion = () => {
    if (quizIndex > 0) {
      setQuizIndex((i) => i - 1);
      setQuizAnswer(null);
      setShowFeedback(false);
    }
  };

  const getTitle = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct === 100)
      return {
        title: "Budget Master 🏆",
        subtitle: "Perfect Score! You've mastered the BPS.",
      };
    if (pct >= 80)
      return {
        title: "Budget Chief 👑",
        subtitle: "Excellent! You lead with knowledge.",
      };
    if (pct >= 60)
      return {
        title: "Budget Analyst 📊",
        subtitle: "Good! You understand the budget.",
      };
    return {
      title: "Budget Apprentice 📚",
      subtitle: "Keep learning! The budget awaits.",
    };
  };

  const resultTitle = getTitle(quizScore, effectiveQuizQuestions.length);
  const finalPct = Math.round((quizScore / effectiveQuizQuestions.length) * 100);
  const surveyQuestionList = activeSurvey?.questions ?? [];
  const surveyCompletedCount = Object.keys(surveyAnswers).length;

  if (appState === "complete") {
    const emoji =
      finalPct === 100
        ? "🏆"
        : finalPct >= 80
          ? "👑"
          : finalPct >= 60
            ? "🎯"
            : "🌱";
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
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              className="absolute text-2xl"
            >
              {["🎉", "⭐", "💫", "✨", "🎊"][i % 5]}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md w-full relative z-10"
        >
          <motion.div
            initial={{ y: 20, rotate: 0 }}
            animate={{ y: 0, rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5, repeat: 2 }}
            className="text-8xl mb-6"
          >
            {emoji}
          </motion.div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {resultTitle.title}
          </h1>
          <p className="text-lg text-foreground/60 mb-6">{resultTitle.subtitle}</p>

          <div className="p-6 rounded-2xl bg-muted/30 border border-border backdrop-blur-sm mb-6">
            <div className="text-5xl font-bold text-foreground mb-2">
              {quizScore}/{effectiveQuizQuestions.length}
            </div>
            <p className="text-sm text-foreground/50">questions correct</p>
            <div className="mt-4 h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${finalPct}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="h-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400"
              />
            </div>
            <p className="text-xs text-white/50 mt-2">{finalPct}% score</p>
          </div>

          <Button
            size="lg"
            className="hidden md:inline-flex w-full h-12 rounded-xl bg-white text-gray-900 hover:bg-white/90"
            onClick={() => {
              setAppState("hub");
              setArticleIndex(0);
            }}
          >
            Back to Hub <ArrowRight className="ml-2" />
          </Button>
        </motion.div>
      </section>
    );
  }

  if (appState === "quiz") {
    const q = effectiveQuizQuestions[quizIndex];
    const progress = ((quizIndex + 1) / effectiveQuizQuestions.length) * 100;

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
              {quizIndex + 1}/{effectiveQuizQuestions.length}
            </div>
          </div>
          <button
            type="button"
            aria-label="Cancel quiz and return to hub"
            onClick={() => setAppState("hub")}
            className="ml-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="size-4 text-foreground" />
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
            <div className="text-sm text-white/50 mb-2">
              Question {quizIndex + 1}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-8">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleQuizAnswer(idx)}
                  disabled={showFeedback}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                    showFeedback &&
                      idx === q.correct &&
                      "border-green-500 bg-green-500/20 text-green-400",
                    showFeedback &&
                      quizAnswer === idx &&
                      idx !== q.correct &&
                      "border-red-500 bg-red-500/20 text-red-400",
                    !showFeedback &&
                      "border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10",
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold shrink-0",
                      showFeedback && idx === q.correct
                        ? "bg-green-500 border-green-500 text-black"
                        : showFeedback &&
                            quizAnswer === idx &&
                            idx !== q.correct
                          ? "bg-red-500 border-red-500 text-white"
                          : "border-white/30 text-white/70",
                    )}
                  >
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
                  quizAnswer === q.correct
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : "bg-red-500/20 border border-red-500/30 text-red-400",
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {quizAnswer === q.correct ? (
                    <CheckCircle className="size-5" />
                  ) : (
                    <XCircle className="size-5" />
                  )}
                  <span className="font-bold">
                    {quizAnswer === q.correct ? "Correct! 🎉" : "Not quite 😅"}
                  </span>
                </div>
                <p className="text-sm text-white/70">{q.explanation}</p>
              </motion.div>
            )}
          </motion.div>
          <div className="pointer-events-none absolute inset-0 z-20 flex">
            <button
              type="button"
              aria-label="Previous quiz question"
              data-testid="quiz-tap-left"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={handlePrevQuestion}
            />
            <button
              type="button"
              aria-label="Next quiz question"
              data-testid="quiz-tap-right"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={() => {
                if (showFeedback) handleNextQuestion();
              }}
            />
          </div>
        </div>

        <div className="relative z-10 p-4 text-center text-xs text-white/70">
          Tap left/right to navigate
        </div>
      </section>
    );
  }

  if (appState === "survey-complete") {
    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-indigo-900 via-violet-900 to-black flex items-center justify-center p-6 overflow-hidden">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-8 text-center"
        >
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-3xl font-bold text-white mb-2">Survey complete</h2>
          <p className="text-white/70 mb-6">
            Thanks for the feedback. This helps us improve future stories.
          </p>
          <div className="text-sm text-white/80 mb-6">
            Responses submitted: {surveyCompletedCount}/{surveyQuestionList.length}
          </div>
          <Button
            className="hidden md:inline-flex w-full h-11 bg-white text-gray-900 hover:bg-white/90"
            onClick={() => {
              setAppState("hub");
              setSurveyIndex(0);
              setSurveyAnswers({});
            }}
          >
            Back to Learn Hub
          </Button>
        </motion.div>
      </section>
    );
  }

  if (appState === "survey" && activeSurvey) {
    const surveyQuestionList = [...activeSurvey.questions].sort((a, b) => a.order - b.order);
    const currentSurvey = surveyQuestionList[surveyIndex];
    const progress = ((surveyIndex + 1) / surveyQuestionList.length) * 100;
    const selected = currentSurvey ? surveyAnswers[currentSurvey.id] : undefined;

    const setAnswer = (value: unknown) => {
      if (!currentSurvey) return;
      setSurveyAnswers((prev) => ({ ...prev, [currentSurvey.id]: value }));
    };

    const renderSurveyInput = (question: SurveyQuestionApi) => {
      if (question.type === "text") {
        return (
          <textarea
            value={typeof selected === "string" ? selected : ""}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full min-h-[100px] rounded-xl border border-white/20 bg-white/5 p-3 text-sm text-white"
            placeholder="Your answer..."
          />
        );
      }
      if (question.type === "boolean") {
        return (
          <div className="grid grid-cols-2 gap-3">
            {[true, false].map((val) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => setAnswer(val)}
                className={cn(
                  "p-3 rounded-xl text-left border transition-colors",
                  selected === val
                    ? "border-cyan-300 bg-cyan-400/20 text-white"
                    : "border-white/20 bg-white/5 text-white/90 hover:bg-white/10",
                )}
              >
                {val ? "Yes" : "No"}
              </button>
            ))}
          </div>
        );
      }
      if (question.type === "rating") {
        return (
          <div className="flex flex-wrap gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setAnswer(rating)}
                className={cn(
                  "size-11 rounded-full border font-semibold transition-colors",
                  selected === rating
                    ? "border-cyan-300 bg-cyan-400/20 text-white"
                    : "border-white/20 bg-white/5 text-white/90",
                )}
              >
                {rating}
              </button>
            ))}
          </div>
        );
      }
      if (question.type === "multiple") {
        const picked = Array.isArray(selected) ? (selected as string[]) : [];
        return (
          <div className="space-y-3">
            {(question.choices || []).map((option) => {
              const isOn = picked.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    const next = isOn
                      ? picked.filter((v) => v !== option)
                      : [...picked, option];
                    setAnswer(next);
                  }}
                  className={cn(
                    "w-full p-3 rounded-xl text-left border transition-colors",
                    isOn
                      ? "border-cyan-300 bg-cyan-400/20 text-white"
                      : "border-white/20 bg-white/5 text-white/90 hover:bg-white/10",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {(question.choices || []).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAnswer(option)}
              className={cn(
                "w-full p-3 rounded-xl text-left border transition-colors",
                selected === option
                  ? "border-cyan-300 bg-cyan-400/20 text-white"
                  : "border-white/20 bg-white/5 text-white/90 hover:bg-white/10",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      );
    };

    return (
      <section className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-900 via-indigo-900 to-black flex flex-col overflow-hidden">
        <div className="relative z-10 flex items-center px-4 py-3">
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", damping: 22 }}
            />
          </div>
          <div className="ml-3 px-2 py-1 rounded-full bg-white/20 text-xs font-medium text-white">
            {surveyIndex + 1}/{surveyQuestionList.length}
          </div>
          <button
            onClick={() => setAppState("hub")}
            className="ml-2 p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="size-4 text-white" />
          </button>
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
          <motion.div
            key={surveyIndex}
            initial={{ x: 90, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -90, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 18, stiffness: 180 }}
            className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur p-6"
          >
            <div className="text-xs uppercase tracking-wider text-cyan-300 font-semibold mb-2">
              Story Survey
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{currentSurvey?.text}</h3>
            <div className="mb-6 flex justify-center">
              <Image
                src="/images/survey/bnssurvey1.jpeg"
                alt="Survey"
                width={200}
                height={300}
                className="rounded-lg object-contain max-h-32"
              />
            </div>
            {currentSurvey && renderSurveyInput(currentSurvey)}
          </motion.div>
        </div>

        <div className="relative z-10 p-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="hidden md:inline-flex h-11 border-border bg-muted/30 text-foreground hover:bg-muted/50"
            disabled={surveyIndex === 0}
            onClick={() => setSurveyIndex((v) => Math.max(0, v - 1))}
          >
            <ChevronLeft className="size-4 mr-1" />
            Previous
          </Button>
          <Button
            className="h-11 bg-white text-gray-900 hover:bg-white/90 disabled:opacity-40"
            disabled={
              selected === undefined ||
              (Array.isArray(selected) && selected.length === 0 && currentSurvey?.is_required) ||
              surveySubmitting
            }
            onClick={() => {
              if (surveyIndex < surveyQuestionList.length - 1) {
                setSurveyIndex((v) => v + 1);
              } else {
                void submitSurveyResponses();
              }
            }}
          >
            {surveyIndex < surveyQuestionList.length - 1 ? "Next" : surveySubmitting ? "Submitting…" : "Finish Survey"}
            <ArrowRight className="size-4 ml-1" />
          </Button>
        </div>
      </section>
    );
  }

  if (appState === "article") {
    if (!currentStoryCards || currentStoryCards.length === 0) {
      return (
        <section className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold mb-4 text-foreground">No slides available for this story.</h2>
          <Button onClick={() => setAppState("hub")} className="rounded-xl">Back to Hub</Button>
        </section>
      );
    }
    const stat = currentCard && "stat" in currentCard ? currentCard.stat : undefined;
    const note = currentCard && "note" in currentCard ? currentCard.note : undefined;
    const pillars = currentCard && "pillars" in currentCard ? currentCard.pillars : undefined;
    const risks = currentCard && "risks" in currentCard ? currentCard.risks : undefined;
    const facts = currentCard && "facts" in currentCard ? currentCard.facts : undefined;
    const services = currentCard && "services" in currentCard ? currentCard.services : undefined;
    const tinyLogo = currentCard && "tinyLogo" in currentCard ? currentCard.tinyLogo : undefined;
    const hasStat = Boolean(stat);
    const hasPillars = Boolean(pillars?.length);
    const hasRisks = Boolean(risks?.length);
    const hasFacts = Boolean(facts?.length);
    const hasServices = Boolean(services?.length);
    const bgGradient = currentCard?.bg || "from-primary to-teal-500";
    const cardBgClass = `bg-gradient-to-br ${bgGradient}`;

    return (
      <section className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden">
        {/* Static background - Simplified */}
        <div className="absolute inset-0 bg-background pointer-events-none" />

        {/* Progress bar */}
        <div className="relative z-10 flex items-center px-4 py-3">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${readingProgress}%` }}
              transition={{ type: "spring", damping: 20 }}
            />
          </div>
          <div className="ml-3 px-2 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
            {articleIndex + 1}/{currentStoryCards.length}
          </div>
          <button
            onClick={() => {
              setAppState("hub");
              setArticleIndex(0);
            }}
            className="ml-2 p-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <X className="size-4 text-foreground" />
          </button>
        </div>
        {/* Swipeable card area */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedStoryId}-${articleIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md"
            >
              {/* Flashcard */}
              <div
                className={cn(
                  "relative p-6 sm:p-8 rounded-3xl border border-border bg-card overflow-hidden",
                )}
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mb-3 text-6xl sm:text-7xl"
                >
                  {currentCard?.emoji}
                </motion.div>
                {tinyLogo && (
                  <div className="absolute top-4 right-4 rounded-full border border-border bg-muted/50 p-1 backdrop-blur-sm">
                    <Image src="/logo.svg" alt="Budget Ndio Story logo" width={12} height={12} />
                  </div>
                )}

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl sm:text-3xl font-bold text-foreground mb-1"
                >
                  {currentCard?.title}
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-foreground/70 text-sm mb-4"
                >
                  {currentCard?.subtitle}
                </motion.p>

                {currentCard?.hook && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.18 }}
                    className="inline-flex mb-4 rounded-full border border-border bg-muted/30 px-3 py-1 text-[11px] font-semibold text-foreground/90"
                  >
                    {currentCard.hook}
                  </motion.div>
                )}

                {/* Content */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-foreground/90 text-base sm:text-lg mb-6 leading-relaxed"
                >
                  {currentCard?.content}
                </motion.p>

                {/* Stat display */}
                {hasStat && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="bg-muted/50 border border-border rounded-2xl p-4 text-center mb-4"
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-foreground">
                      {stat?.value}
                    </div>
                    <div className="text-foreground/70 text-sm">
                      {stat?.label}
                    </div>
                    {note && (
                      <div className="text-foreground/50 text-xs mt-2">
                        {note}
                      </div>
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
                    {facts?.map((fact: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="bg-muted/50 border border-border rounded-xl px-3 py-2 text-xs text-foreground/90"
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
                    {pillars?.map((p: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-3 py-2"
                      >
                        <span className="text-xl">{p.emoji}</span>
                        <div className="flex-1">
                          <div className="text-foreground font-medium text-sm">
                            {p.title}
                          </div>
                        </div>
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
                    {risks?.map((r: any, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-3 py-2"
                      >
                        <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="text-foreground text-sm">{r.title}</div>
                          <div className="text-foreground/50 text-xs">{r.desc}</div>
                        </div>
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
                    {services?.map((s: string, i: number) => (
                      <motion.span
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="bg-muted/50 border border-border rounded-full px-3 py-1 text-sm text-foreground"
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
                      className="w-full h-14 rounded-xl text-lg font-medium bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => startQuiz()}
                    >
                      <Target className="mr-2" /> Start Quiz
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-xl mt-3 border-border text-foreground hover:bg-muted/50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                    >
                      Keep Reading <ArrowRight className="ml-2" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 z-20 flex">
            <button
              type="button"
              aria-label="Previous story card"
              data-testid="story-tap-left"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={handlePrev}
            />
            <button
              type="button"
              aria-label="Next story card"
              data-testid="story-tap-right"
              className="pointer-events-auto h-full w-1/2 bg-transparent"
              onClick={handleNext}
            />
          </div>

        </div>

        <div className="relative z-10 p-4 text-center text-xs text-foreground/70">
          Tap left/right to navigate
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-background overflow-x-hidden overflow-y-visible flex flex-col"
    >
      <div className="fixed inset-0 -z-10 bg-background" />

      <Wrapper className="relative z-10 w-full flex-1 flex flex-col justify-between py-4 sm:py-6">
        <div className="flex-1 flex flex-col py-2 sm:py-4">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 sm:space-y-12 w-full min-w-0">
            <Container animation="fadeUp" delay={0.02} className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
                    <BookOpen className="size-3.5" />
                    Learn Hub
                  </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80">
                    <Trophy className="size-3.5" />
                    {gamification?.points ?? 0} points
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80">
                    Lv {gamification?.level ?? 1}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80">
                    {gamification?.streak_days ?? 0} day streak
                  </span>
                </div>
                  <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                    Learn budget stories faster, with visual explainers
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-foreground/75 sm:text-base">
                    {orgTagline ||
                      "Swipe story cards, open deep dives, and use practical citizen checklists to understand how public money decisions affect real services."}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/85">
                      4 story formats
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                      3 deep dives
                    </span>
                    <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/85">
                      Quiz + survey
                    </span>
                  </div>
                </div>
              </div>
            </Container>

            <Container animation="fadeUp" delay={0.04} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Stories</h2>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/55">
                  Swipe horizontally
                </span>
              </div>
              <div className="overflow-x-auto pb-2 [scrollbar-width:thin]">
                <div className="flex gap-4 w-max pr-2">
                  {loadingContent ? (
                    <div className="flex gap-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-[290px] sm:w-[340px] h-[190px] rounded-[26px] border border-border p-5 bg-card/50 animate-pulse flex flex-col justify-between"
                        >
                          <div className="flex justify-between">
                            <div className="w-10 h-10 rounded-xl bg-muted" />
                            <div className="w-16 h-6 rounded-full bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <div className="h-6 w-3/4 bg-muted/40 rounded" />
                            <div className="h-4 w-5/6 bg-muted/30 rounded" />
                          </div>
                          <div className="h-8 w-24 bg-muted/40 rounded-full" />
                        </div>
                      ))}
                    </div>
                  ) : contentError && sortedHubStories.length === 0 ? (
                    <p className="text-sm text-destructive px-2">{contentError}</p>
                  ) : (
                    sortedHubStories.map((story) => (
                      <motion.button
                        key={story.id}
                        whileHover={{ y: -3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleStoryStart(story.id);
                          router.push(`/learn?story=${story.id}`, { scroll: false });
                        }}
                        className={cn(
                          "w-[290px] sm:w-[340px] text-left rounded-[26px] border border-border p-5 text-foreground bg-card",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-3xl">{story.icon}</span>
                          <div className="flex flex-col items-end gap-1.5">
                            <span
                              className={cn(
                                "text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-1",
                                watchedStories[story.id]
                                  ? "bg-emerald-500/25 text-emerald-100"
                                  : "bg-amber-500/25 text-amber-100",
                              )}
                            >
                              {watchedStories[story.id] ? "Watched" : "New"}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-muted px-2 py-1">
                              {story.duration}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold mt-5 leading-tight">
                          {story.title}
                        </h3>
                        <p className="text-sm text-white/80 mt-2">
                          {story.subtitle}
                        </p>
                        <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold rounded-full bg-muted px-3 py-1.5">
                          {story.action} <ArrowRight className="size-3.5" />
                        </div>
                      </motion.button>
                    ))
                  )}
                </div>
              </div>
            </Container>

            {/* Articles Section */}
            <Container animation="fadeUp" delay={0.07} className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <BookOpen className="size-5 text-primary" />
                  Articles & Insights
                </h2>
                {loadingContent && (
                  <span className="text-xs text-foreground/50 animate-pulse">
                    Refreshing...
                  </span>
                )}
              </div>

              {loadingContent ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border border-border bg-card/50 rounded-2xl p-5 space-y-4 animate-pulse"
                    >
                      <div className="h-4 w-1/4 bg-muted rounded" />
                      <div className="h-6 w-3/4 bg-muted rounded" />
                      <div className="h-12 w-full bg-muted rounded" />
                      <div className="h-8 w-20 bg-muted rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.map((article) => (
                    <motion.div
                      key={article.id}
                      whileHover={{ y: -3 }}
                      onClick={() => setActiveArticle(article)}
                      className="group cursor-pointer border border-border bg-card hover:bg-card/85 rounded-2xl p-5 flex flex-col justify-between h-full transition-all relative overflow-hidden"
                    >
                      <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all" />
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-muted px-2 py-0.5 text-foreground/70">
                            {article.readTime || "5 min read"}
                          </span>
                        </div>
                        <h3 className="text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-xs text-foreground/60 leading-relaxed line-clamp-3">
                          {article.snippet}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary">
                        Read Article <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Container>

            {youtubeVideos.length > 0 && (
              <Container animation="fadeUp" delay={0.1} className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <span className="text-red-500">▶</span> Budget Videos
                  </h2>
                  <Link 
                    href="https://youtube.com/@budgetndiostory" 
                    target="_blank" 
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View Channel
                  </Link>
                </div>
                <div className="overflow-x-auto pb-4 [scrollbar-width:thin]">
                  <div className="flex gap-4 w-max pr-2">
                    {youtubeVideos.map((video) => (
                      <Link
                        key={video.id}
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        className="group relative block w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-primary/50 transition-all"
                      >
                        <div className="relative aspect-video w-full overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-muted/20 group-hover:bg-muted/10 transition-colors" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-600/90 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                            <span className="text-white ml-1">▶</span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-xs text-foreground/50 mt-2">
                            {new Date(video.published).toLocaleDateString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Container>
            )}

            <Container animation="fadeUp" delay={0.15} className="space-y-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground/80">
                  <BarChart3 className="size-3.5" />
                  Articles
                </div>
                <h2 className="text-xl font-bold">Budget explainers from the API</h2>
                <p className="text-sm text-foreground/65">
                  Long-form articles with the same rich reading layout as our guided deep dives — updated from the live content API.
                </p>
              </div>
              <Link
                href="/articles"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-4 py-2 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:bg-muted/50"
              >
                Browse all articles
                <ArrowRight className="size-4" />
              </Link>
            </Container>

            <Container animation="fadeUp" delay={0.2} className="space-y-4">
              <h2 className="text-xl font-bold">Document Repository</h2>
              <Link
                href="/learn/repository"
                className="group block rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 hover:border-primary/30 transition-all overflow-hidden"
              >
                <motion.div whileHover={{ y: -2 }} className="relative">
                  <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-primary/20 blur-3xl" />
                  <div className="flex items-start justify-between gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Folder className="size-5 text-primary" />
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Featured Access
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg sm:text-xl font-bold group-hover:text-primary transition-colors">
                    Explore the full Budget Document Repository
                  </h3>
                  <p className="mt-2 text-sm text-foreground/65 max-w-2xl">
                    We keep Learn focused on stories and deep dives. Browse all budget folders and files in one
                    dedicated repository view.
                  </p>
                  <div className="mt-4 hidden md:block">
                    <div className="relative h-48">
                      <div className="absolute top-0 left-0 rounded-full bg-muted/80 border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground/80">
                        Repository preview
                      </div>
                      <div className="lr-folder lr-folder-a">
                        <div className="lr-shell">
                          <div className="lr-layer lr-l4" />
                          <div className="lr-layer lr-l3" />
                          <div className="lr-layer lr-l2" />
                          <div className="lr-layer lr-l1" />
                        </div>
                      </div>
                      <div className="lr-folder lr-folder-b">
                        <div className="lr-shell">
                          <div className="lr-layer lr-l4" />
                          <div className="lr-layer lr-l3" />
                          <div className="lr-layer lr-l2" />
                          <div className="lr-layer lr-l1" />
                        </div>
                      </div>
                      <div className="lr-folder lr-folder-c">
                        <div className="lr-shell">
                          <div className="lr-layer lr-l4" />
                          <div className="lr-layer lr-l3" />
                          <div className="lr-layer lr-l2" />
                          <div className="lr-layer lr-l1" />
                        </div>
                      </div>
                      <div className="absolute bottom-1 right-0 inline-flex items-center gap-1.5 rounded-full bg-muted/80 border border-border px-2.5 py-1 text-[10px] text-foreground/80">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="size-1.5 rounded-full bg-amber-300 animate-pulse [animation-delay:180ms]" />
                        <span className="size-1.5 rounded-full bg-cyan-300 animate-pulse [animation-delay:320ms]" />
                        open the hub to browse files
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open Repository <ArrowRight className="size-4" />
                  </div>
                </motion.div>
              </Link>
            </Container>

            <Container animation="fadeUp" delay={0.25} className="space-y-4">
              <h2 className="text-xl font-bold">Quick Answers</h2>
              <Link
                href="/faq"
                className="group block p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <motion.div whileHover={{ y: -2 }}>
                  <div className="flex items-center gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                      <HelpCircle className="size-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-primary">
                        FAQ: Budget Questions
                      </h3>
                      <p className="text-xs text-foreground/60">
                        Common questions about the BPS explained
                      </p>
                    </div>
                    <ArrowRight className="size-4 text-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              </Link>
            </Container>

            <Container animation="fadeUp" delay={0.4} className="py-8">
              <div className="relative p-8 sm:p-12 rounded-3xl bg-card border border-border overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:24px_24px]" />
                <div className="relative z-10 text-center space-y-4">
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                    Story Feedback
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold">
                    Take the Story Survey
                  </h2>
                  <p className="text-sm text-foreground/60 max-w-md mx-auto">
                    3 quick questions in the same story vibe to shape what we build next.
                  </p>
                  <Button
                    size="lg"
                    className="h-11 px-6 rounded-xl text-sm font-medium"
                    disabled={surveyLoading}
                    onClick={() => void loadActiveSurvey()}
                  >
                    {surveyLoading ? "Loading…" : "Start Survey"} <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>
            </Container>

            <Container
              animation="fadeUp"
              delay={0.5}
              className="max-w-3xl mx-auto w-full pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground/30 px-4"
            >
              <p className="text-[10px] font-medium">
                © 2026 Budget Ndio Story.
              </p>
              <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-wider">
                <a
                  href="mailto:info@budgetndiostory.com"
                  className="hover:text-foreground"
                >
                  Email
                </a>
                <a href="#" className="hover:text-foreground">
                  Privacy
                </a>
                <a href="#" className="hover:text-foreground">
                  Terms
                </a>
              </div>
            </Container>
          </div>
        </div>
      </Wrapper>
      <style jsx>{`
        .lr-folder {
          position: absolute;
          width: 190px;
          height: 132px;
          perspective: 1300px;
        }
        .lr-shell {
          position: relative;
          width: 100%;
          height: 100%;
          animation: lrFloat 5.1s ease-in-out infinite;
        }
        .lr-folder-a {
          right: 5%;
          top: 0;
        }
        .lr-folder-b {
          right: 22%;
          top: 36px;
        }
        .lr-folder-c {
          right: -1%;
          top: 72px;
        }
        .lr-folder-b .lr-shell {
          animation-delay: 0.4s;
        }
        .lr-folder-c .lr-shell {
          animation-delay: 0.8s;
        }
        .lr-layer {
          position: absolute;
          inset: 0;
          border-radius: 16px;
          transform-origin: bottom center;
          transition: transform 450ms ease;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .lr-l4 {
          background: linear-gradient(to bottom, #2a2d37, #16171d);
          transform: rotateX(-7deg);
        }
        .lr-l3 {
          inset: 5px;
          background: linear-gradient(to bottom, rgba(56, 189, 248, 0.22), rgba(14, 116, 144, 0.12));
          transform: rotateX(-13deg);
        }
        .lr-l2 {
          inset: 9px;
          background: linear-gradient(to bottom, rgba(251, 191, 36, 0.36), rgba(217, 119, 6, 0.3));
          transform: rotateX(-20deg);
        }
        .lr-l1 {
          inset: 13px;
          background: linear-gradient(to bottom, #fbbf24, #d97706);
          box-shadow: inset 0 18px 34px rgba(251, 191, 36, 0.24), 0 14px 24px rgba(0, 0, 0, 0.3);
          transform: rotateX(-29deg);
        }
        .group:hover .lr-l3 {
          transform: rotateX(-20deg);
        }
        .group:hover .lr-l2 {
          transform: rotateX(-30deg);
        }
        .group:hover .lr-l1 {
          transform: rotateX(-39deg) translateY(1px);
        }
        @keyframes lrFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-7px);
          }
        }
      `}</style>
      
      {/* Inline Article Reader Modal */}
      <AnimatePresence>
        {activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            onClick={() => setActiveArticle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary px-2.5 py-0.5">
                    {activeArticle.readTime || "5 min read"}
                  </span>
                  <h2 className="text-lg font-bold text-foreground line-clamp-1">
                    {activeArticle.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-1.5 rounded-full bg-muted hover:bg-muted/80 text-foreground transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 [scrollbar-width:thin]">
                {activeArticle.body_html ? (
                  <div
                    className="notion-content prose dark:prose-invert max-w-none text-foreground/85"
                    dangerouslySetInnerHTML={{ __html: activeArticle.body_html }}
                  />
                ) : (
                  <div className="text-foreground/85 leading-relaxed whitespace-pre-wrap space-y-4 text-sm sm:text-base">
                    {activeArticle.body || activeArticle.snippet}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/15">
                <span className="text-[10px] text-foreground/50 font-medium">
                  Budget Ndio Story • Learn Hub
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: activeArticle.title,
                        text: activeArticle.snippet,
                        url: window.location.href,
                      }).catch(console.error);
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }
                  }}
                  className="rounded-full text-xs gap-1.5 h-8"
                >
                  <Send className="size-3" /> Share
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
