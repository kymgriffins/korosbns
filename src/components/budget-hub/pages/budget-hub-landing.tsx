"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BudgetHubPage } from "@/components/budget-hub/layout/budget-hub-page";
import { BudgetHubHero } from "@/components/budget-hub/hero/budget-hub-hero";
import { BudgetHubSearch } from "@/components/budget-hub/search/budget-hub-search";
import { CategoryPills } from "@/components/budget-hub/filters/category-pills";
import { SectionHeader } from "@/components/budget-hub/sections/section-header";
import { FeaturedCard } from "@/components/budget-hub/cards/featured-card";
import { ArticleCard } from "@/components/budget-hub/cards/article-card";
import { JourneyCard } from "@/components/budget-hub/cards/journey-card";
import { NewsletterSection } from "@/components/budget-hub/sections/newsletter-section";
import { BudgetHubFooter } from "@/components/budget-hub/sections/budget-hub-footer";
import { HubSkeleton } from "@/components/budget-hub/states/hub-skeleton";
import { EmptyState } from "@/components/budget-hub/states/empty-state";
import {
  learnHubItemToCard,
  moduleToJourneyCard,
} from "@/components/budget-hub/tokens/types";
import { BUDGET_HUB_CATEGORIES } from "@/constants/budget-hub-tokens";
import { contentData } from "@/data/content";
import { learningData } from "@/data/learning";
import { Routes } from "@/constants/routes";
import { usePageView } from "@/hooks/use-page-view";
import type { CivicModule } from "@/types/learn";

function filterByCategory<T extends { category?: string | null }>(
  items: T[],
  category: string,
): T[] {
  if (category === "all") return items;
  return items.filter((item) =>
    (item.category ?? "").toLowerCase().includes(category.replace("-", " ")),
  );
}

export function BudgetHubLanding() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [articles, setArticles] = useState(
    [] as ReturnType<typeof learnHubItemToCard>[],
  );
  const [modules, setModules] = useState<CivicModule[]>([]);
  const [loading, setLoading] = useState(true);

  usePageView();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [articleItems, moduleItems] = await Promise.all([
        contentData.articles
          .fetchFromApi({ search: search || undefined })
          .then((r) => r.results ?? [])
          .catch(() => contentData.articles.fetch({ search: search || undefined })),
        learningData.modules.fetch(),
      ]);
      setArticles(articleItems.map(learnHubItemToCard));
      setModules(
        moduleItems.filter(
          (m) => m.status !== "draft" && m.status !== "archived",
        ),
      );
    } catch {
      setArticles([]);
      setModules([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = window.setTimeout(() => void load(), search ? 300 : 0);
    return () => window.clearTimeout(t);
  }, [load, search]);

  const journeys = useMemo(
    () => modules.map(moduleToJourneyCard),
    [modules],
  );

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = articles;
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q),
      );
    }
    return filterByCategory(list, category);
  }, [articles, category, search]);

  const featured = filteredArticles[0] ?? journeys[0];
  const gridArticles = filteredArticles.slice(featured ? 1 : 0, 7);
  const secondaryFeatured = filteredArticles[1];

  return (
    <div className="budget-hub">
      <BudgetHubPage>
        {loading ? (
          <HubSkeleton />
        ) : !featured ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-[var(--bh-section-y)] pb-[var(--bh-section-y)]">
            <BudgetHubHero featured={featured} />

            <section className="space-y-6">
              <BudgetHubSearch value={search} onChange={setSearch} />
              <CategoryPills
                items={BUDGET_HUB_CATEGORIES}
                value={category}
                onChange={setCategory}
              />
            </section>

            {secondaryFeatured ? (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
              >
                <SectionHeader
                  eyebrow="Editorial"
                  title="Featured stories"
                  description="In-depth explainers on Kenya's budget, Finance Bill, and fiscal policy."
                />
                <div className="mt-8">
                  <FeaturedCard item={secondaryFeatured} />
                </div>
              </motion.section>
            ) : null}

            {gridArticles.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
              >
                <SectionHeader
                  title="Latest articles"
                  action={
                    <Link
                      href={Routes.LearnArticles}
                      className="text-sm font-semibold text-foreground hover:text-[var(--bh-accent-warm)]"
                    >
                      View all →
                    </Link>
                  }
                />
                <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {gridArticles.map((item) => (
                    <ArticleCard key={item.id} item={item} />
                  ))}
                </div>
              </motion.section>
            ) : null}

            {journeys.length > 0 ? (
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <SectionHeader
                  eyebrow="Journeys"
                  title="Learn by doing"
                  description="Structured civic finance paths — step by step, at your pace."
                />
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {journeys.slice(0, 4).map((item, i) => (
                    <JourneyCard
                      key={item.id}
                      item={item}
                      difficulty={modules[i]?.badgeName ?? "Beginner"}
                    />
                  ))}
                </div>
              </motion.section>
            ) : null}
          </div>
        )}
      </BudgetHubPage>
      <NewsletterSection />
      <BudgetHubFooter />
    </div>
  );
}
