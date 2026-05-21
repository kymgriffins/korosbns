"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { mapApiArticle, type HubArticle } from "@/lib/learn-content";
import { citizenApi } from "@/lib/api-client";
import { Routes } from "@/constants/routes";
import { useAuth } from "@/contexts/auth-context";
import { Bookmark } from "lucide-react";

export default function ArticleReaderPage() {
  const { isLoggedIn } = useAuth();
  const params = useParams();
  const slug = String(params.slug || "");
  const [article, setArticle] = useState<HubArticle | null>(null);
  const [contentId, setContentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    void citizenApi
      .getArticle(slug)
      .then((raw) => {
        setArticle(mapApiArticle(raw));
        setContentId(String(raw.id || ""));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Article not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleBookmark = async () => {
    if (!contentId || !isLoggedIn) {
      toast.error("Sign in with membership to bookmark.");
      return;
    }
    try {
      await citizenApi.toggleBookmark("article", contentId);
      toast.success("Bookmark updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bookmark failed");
    }
  };

  const share = async () => {
    if (!contentId) return;
    try {
      await citizenApi.recordShare({
        content_type: "article",
        content_id: contentId,
        channel: "copy_link",
        target_url: typeof window !== "undefined" ? window.location.href : "",
      });
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      toast.success("Link copied");
    } catch {
      toast.error("Could not record share");
    }
  };

  return (
    <Wrapper className="py-16">
      <article className="max-w-3xl mx-auto">
        <Link
          href={Routes.Articles}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          All articles
        </Link>
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {article && (
          <>
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold">{article.title}</h1>
                <p className="text-muted-foreground mt-2">{article.readTime}</p>
              </div>
              <div className="flex gap-2">
                {isLoggedIn && (
                  <Button type="button" variant="outline" size="icon" onClick={() => void toggleBookmark()}>
                    <Bookmark className="size-4" />
                  </Button>
                )}
                <Button type="button" variant="outline" size="icon" onClick={() => void share()}>
                  <Share2 className="size-4" />
                </Button>
              </div>
            </div>
            {article.body_html ? (
              <div
                className="notion-content-wrapper"
                dangerouslySetInnerHTML={{ __html: article.body_html }}
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                {article.body || article.snippet}
              </div>
            )}
          </>
        )}
      </article>
    </Wrapper>
  );
}
