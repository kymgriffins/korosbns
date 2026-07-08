"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowLeft, ChevronLeft, ArrowRight } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { TriviaQuiz } from "@/components/citizen/trivia-quiz";
import type { TriviaSetApi } from "@/lib/api-client";
import { useContentForSlug } from "@/hooks/use-content";
import { Routes } from "@/constants/routes";
import { articlePlaceholderForSlug } from "@/lib/article-placeholders";
import { scaleIn, fadeInUp, fadeInUpDelay1, fadeInUpDelay2, fadeInUpDelay3 } from "@/motion/variants";
import { BudgetHubArticlePage } from "@/components/budget-hub/pages/budget-hub-article-page";
import { HubNotFound } from "@/components/budget-hub/states/not-found";
import { usePageView } from "@/hooks/use-page-view";

type ReaderMode = "loading" | "error" | "article" | "story" | "trivia";

interface ArticleAuthor {
  name?: string;
  image?: string;
  role?: string;
  slug?: string;
}

interface ArticleData {
  id: string;
  title: string;
  snippet: string;
  body?: string;
  body_html?: string;
  heroImage?: string;
  category?: string;
  sourceLabel?: string;
  readTime?: string;
  updatedAt?: string;
  publishedAt?: string;
  author?: ArticleAuthor | null;
  learningContext?: {
    unit_slug?: string;
    fiscal_year?: number;
    edition_title?: string;
    unit_abbreviation?: string;
    unit_title?: string;
    section_label?: string;
    lesson_title?: string;
    section_index?: number;
    section_total?: number;
    prev_article_slug?: string;
    prev_section_title?: string;
    next_article_slug?: string;
    next_section_title?: string;
  };
}

interface StoryCard {
  emoji?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  hook?: string;
  bg?: string;
  tinyLogo?: boolean;
  stat?: { value: string; label: string };
  note?: string;
  facts?: string[];
  pillars?: { emoji: string; title: string }[];
  risks?: { title: string; desc: string }[];
  services?: string[];
}

interface StoryData {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  cards: StoryCard[];
}

// The API returns raw article records (summary, body_html, metadata.hero_image,
// published_at, learning_context). Map them into the shape the reader consumes so
// each article surfaces its own hero image and metadata.
function normalizeArticle(raw: unknown): ArticleData {
  const r = (raw ?? {}) as Record<string, any>;
  const meta = (r.metadata ?? {}) as Record<string, any>;
  const readMinutes = meta.read_minutes ?? r.read_minutes;
  return {
    id: r.id ?? "",
    title: r.title ?? "",
    snippet: r.snippet ?? r.summary ?? "",
    body: r.body,
    body_html: r.body_html,
    heroImage: r.heroImage ?? meta.hero_image ?? r.cover_image_url ?? r.image_url ?? undefined,
    category: r.category ?? meta.category ?? (typeof r.format === "string" ? r.format : undefined),
    sourceLabel: r.sourceLabel ?? meta.source_label ?? undefined,
    readTime: r.readTime ?? (readMinutes ? `${readMinutes} min read` : undefined),
    publishedAt: r.publishedAt ?? r.published_at ?? undefined,
    updatedAt: r.updatedAt ?? r.updated_at ?? meta.updated_at ?? undefined,
    author: (r.author ?? null) as ArticleAuthor | null,
    learningContext: r.learningContext ?? r.learning_context ?? undefined,
  };
}

export default function UnifiedReaderClientPage({
  initialMode = "loading",
  initialArticle = null,
  initialTrivia = null,
  initialStory = null,
}: {
  initialMode?: ReaderMode;
  initialArticle?: ArticleData | Record<string, unknown> | null;
  initialTrivia?: TriviaSetApi | null;
  initialStory?: StoryData | null;
}) {
  usePageView();
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [slug]);

  const [mode, setMode] = useState<ReaderMode>(initialMode);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Data states
  const [article, setArticle] = useState<ArticleData | null>(initialArticle ? normalizeArticle(initialArticle) : null);
  const [trivia, setTrivia] = useState<TriviaSetApi | null>(initialTrivia);
  const [story, setStory] = useState<StoryData | null>(initialStory);
  
  // Story slide state
  const [slideIndex, setSlideIndex] = useState(0);

  const hasInitialData = initialMode !== "loading" && (!!initialArticle || !!initialTrivia || !!initialStory);
  const { data, isLoading } = useContentForSlug(slug as string, !hasInitialData);

  useEffect(() => {
    if (hasInitialData || isLoading) return;

    if (!data) {
      setMode("error");
      setErrorMsg("Content not found. Return to the Learn Hub to try another module.");
      return;
    }

    if (data.type === "article") {
      setArticle(normalizeArticle(data.data));
      setMode("article");
    } else if (data.type === "trivia") {
      setTrivia(data.data as TriviaSetApi);
      setMode("trivia");
    } else if (data.type === "story") {
      const foundStory = data.data as any;
      let parsedCards: StoryCard[] = [];
      try {
        parsedCards = typeof foundStory.body === "string" 
          ? JSON.parse(foundStory.body) 
          : (foundStory.body as StoryCard[] || []);
      } catch {
        parsedCards = [];
      }

      const metadata = (foundStory.metadata as Record<string, string>) || {};
      
      setStory({
        id: foundStory.id as string,
        title: foundStory.title as string,
        subtitle: foundStory.summary as string,
        icon: metadata.icon || "📖",
        duration: metadata.duration || "2 min",
        cards: parsedCards
      });
      setMode("story");
    }
  }, [data, isLoading, hasInitialData]);

  if (mode === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="size-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading content...</p>
        </motion.div>
      </div>
    );
  }

  if (mode === "error") {
    return <HubNotFound message={errorMsg} />;
  }

  if (mode === "trivia" && trivia) {
    return (
      <Wrapper className="py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href={Routes.Learn}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 group"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
            Learn Hub
          </Link>
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary mb-3">
              Quiz Module
            </span>
            <h1 className="text-3xl font-bold mb-8">{trivia.title}</h1>
            <TriviaQuiz trivia={trivia} />
          </motion.div>
        </div>
      </Wrapper>
    );
  }

  if (mode === "story" && story) {
    const currentCard = story.cards[slideIndex];
    const progress = ((slideIndex + 1) / story.cards.length) * 100;
    const isLastCard = slideIndex === story.cards.length - 1;

    return (
      <section className="fixed inset-0 z-50 bg-background flex flex-col overflow-hidden">
        {/* Progress bar */}
        <div className="relative z-10 flex items-center px-4 py-3 border-b border-border/30 bg-background/50 backdrop-blur-md">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: [0.25, 0.4, 0, 1] }}
            />
          </div>
          <div className="ml-3 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
            {slideIndex + 1}/{story.cards.length}
          </div>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => router.push(Routes.Learn)}
            className="ml-2 h-8 w-8 rounded-full"
          >
            <span className="sr-only">Close</span>
            ×
          </Button>
        </div>

        {/* Swipeable card area */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${story.id}-${slideIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="relative p-6 sm:p-8 rounded-3xl border border-border bg-card shadow-xl overflow-hidden min-h-[400px] flex flex-col justify-between">
                <div>
                  <motion.div
                    variants={scaleIn}
                    initial="hidden"
                    animate="visible"
                    className="mb-3 text-5xl sm:text-6xl"
                  >
                    {currentCard?.emoji || story.icon}
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    variants={fadeInUpDelay1}
                    initial="hidden"
                    animate="visible"
                    className="text-2xl sm:text-3xl font-bold text-foreground mb-1"
                  >
                    {currentCard?.title}
                  </motion.h2>

                  {/* Subtitle */}
                  {currentCard?.subtitle && (
                    <motion.p
                      variants={fadeInUpDelay2}
                      initial="hidden"
                      animate="visible"
                      className="text-muted-foreground text-sm mb-4"
                    >
                      {currentCard.subtitle}
                    </motion.p>
                  )}

                  {currentCard?.hook && (
                    <div className="inline-flex mb-4 rounded-full border border-border bg-muted/40 px-3 py-1 text-[10px] font-semibold text-foreground/80">
                      {currentCard.hook}
                    </div>
                  )}

                  {/* Content */}
                  <motion.p
                    variants={fadeInUpDelay3}
                    initial="hidden"
                    animate="visible"
                    className="text-foreground/90 text-base sm:text-lg leading-relaxed mb-6"
                  >
                    {currentCard?.content}
                  </motion.p>

                  {/* Stats */}
                  {currentCard?.stat && (
                    <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 text-center mb-4">
                      <div className="text-3xl font-bold text-primary">
                        {currentCard.stat.value}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {currentCard.stat.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Navigation controls */}
                <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t border-border/40">
                  <Button
                    variant="outline"
                    onClick={() => setSlideIndex((i) => Math.max(0, i - 1))}
                    disabled={slideIndex === 0}
                    className="rounded-xl flex-1 gap-1"
                  >
                    <ChevronLeft className="size-4" /> Prev
                  </Button>
                  
                  {isLastCard ? (
                    <Button
                      onClick={() => router.push(Routes.Learn)}
                      className="rounded-xl flex-1 gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      Finish Story <ArrowRight className="size-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSlideIndex((i) => Math.min(story.cards.length - 1, i + 1))}
                      className="rounded-xl flex-1 gap-1"
                    >
                      Next <ArrowRight className="size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  if (mode === "article" && article) {
    const placeholder = articlePlaceholderForSlug(slug);
    return (
      <BudgetHubArticlePage
        article={{
          id: article.id,
          title: article.title,
          snippet: article.snippet,
          body: article.body,
          body_html: article.body_html,
          heroImage: article.heroImage || placeholder.src,
          category: article.category,
          readTime: article.readTime,
          publishedAt: article.publishedAt,
          author: article.author,
        }}
      />
    );
  }

  return null;
}
