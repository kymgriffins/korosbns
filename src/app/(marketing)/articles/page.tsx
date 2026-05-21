"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import type { HubArticle } from "@/lib/learn-content";
import { contentLoadErrorMessage, loadArticleList } from "@/lib/marketing-content";
import { Routes } from "@/constants/routes";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<HubArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadArticleList()
      .then(setArticles)
      .catch((err) => setError(contentLoadErrorMessage(err, "articles")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Wrapper className="py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Articles</h1>
        <p className="text-muted-foreground mb-10">
          Budget explainers and analysis from the BNSKE content API.
        </p>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}

        <div className="grid gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={Routes.Article(article.id)}
              className="block rounded-xl border border-border p-6 hover:border-primary/40 transition-colors"
            >
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{article.readTime}</p>
              <p className="mt-3 text-muted-foreground line-clamp-2">{article.snippet}</p>
            </Link>
          ))}
        </div>

        {!loading && !error && articles.length === 0 && (
          <p className="text-muted-foreground">No published articles yet.</p>
        )}
      </div>
    </Wrapper>
  );
}
