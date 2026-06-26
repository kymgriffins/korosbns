"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { BookOpen, X } from "lucide-react";
import { Marquee } from "@/ui/marquee";
import { Routes } from "@/constants/routes";
import { mapApiArticle } from "@/lib/learn-content";
import { cn } from "@/utils";
import { useArticlesMarquee, useForexRate, useOpenExchangeRate } from "@/hooks/use-marketing";

const STORAGE_KEY = "bns_home_promo_marquee_closed";

export default function ArticlesPromoMarquee() {
  const [closed, setClosed] = useState(false);

  const { data: articlesData, isLoading: articlesLoading } = useArticlesMarquee();
  const { data: forexData, isLoading: forexLoading, isError: forexIsError } = useForexRate();
  const { data: openExchangeData, isLoading: openExchangeLoading } = useOpenExchangeRate();

  const loading = articlesLoading || forexLoading || openExchangeLoading;

  const articles = useMemo(() => {
    const list = articlesData?.results ?? [];
    return list.length > 0 ? list.map((item: Record<string, unknown>) => mapApiArticle(item)) : [];
  }, [articlesData]);

  const usdKes = useMemo(() => {
    const fromForex = Number(forexData?.usd_kes);
    if (Number.isFinite(fromForex) && fromForex > 0) return fromForex;
    const fromOpen = Number(openExchangeData?.rates?.KES);
    if (Number.isFinite(fromOpen) && fromOpen > 0) return fromOpen;
    return null;
  }, [forexData, openExchangeData]);

  const fxError = !usdKes && !forexLoading && !openExchangeLoading && !forexIsError;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const legacy = window.localStorage.getItem("bns_story_promo_closed");
    if (saved === "1" || legacy === "1") setClosed(true);
  }, []);

  const handleClose = () => {
    setClosed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
  };

  if (closed || loading || articles.length === 0) return null;

  return (
    <div className="relative z-30 mx-auto mt-1 lg:mt-2 w-[min(1200px,96%)] rounded-2xl bg-background/70 overflow-hidden">
      <button
        onClick={handleClose}
        aria-label="Close articles promo"
        className="absolute right-2 top-2 z-20 rounded-full border border-foreground/15 bg-background/90 p-1.5 text-foreground/70 hover:text-foreground"
      >
        <X className="size-4" />
      </button>

      <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs font-semibold text-primary shrink-0">
            Latest articles
          </span>
          <span className="hidden sm:inline-block text-xs text-foreground/60 truncate">
            Budget explainers from the Learn hub
          </span>
        </div>

        <div className="flex items-center gap-2 mr-8">
          <div className="flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-2 py-1 text-[10px] sm:text-[11px] font-medium text-foreground/70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            {fxError ? (
              "USD/KES unavailable"
            ) : usdKes ? (
              <>
                USD/KES <span className="text-primary font-bold">{usdKes.toFixed(2)}</span>
              </>
            ) : (
              "USD/KES ..."
            )}
          </div>
        </div>
      </div>

      <Marquee pauseOnHover className="py-2 [--duration:30s]">
        {articles.map((article: Record<string, any>) => (
          <Link
            key={article.id}
            href={Routes.Article(article.id)}
            className={cn(
              "mx-2 inline-flex items-center gap-2 rounded-full border border-foreground/15",
              "bg-white/5 px-4 py-2 text-sm text-foreground/90 hover:bg-white/10 transition-colors",
            )}
          >
            <BookOpen className="size-3.5 shrink-0 text-primary" />
            <span className="font-medium">{article.title}</span>
            <span className="text-foreground/50 hidden sm:inline">
              • {article.readTime}
            </span>
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
