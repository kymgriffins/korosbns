"use client";

import { Bookmark, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useToggleBookmark, useRecordShare } from "@/hooks/use-profile";

export function ArticleReaderActions({
  slug,
  contentId,
}: {
  slug: string;
  contentId: string;
}) {
  const { isLoggedIn } = useAuth();
  const { mutateAsync: toggleBookmarkApi } = useToggleBookmark();
  const { mutateAsync: recordShare } = useRecordShare();

  const toggleBookmark = async () => {
    if (!contentId || !isLoggedIn) {
      toast.error("Sign in with membership to bookmark.");
      return;
    }
    try {
      await toggleBookmarkApi({ contentType: "article", contentId });
      toast.success("Bookmark updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bookmark failed");
    }
  };

  const share = async () => {
    if (!contentId) return;
    const href =
      typeof window !== "undefined"
        ? window.location.href
        : `${process.env.NEXT_PUBLIC_SITE_URL || ""}/articles/${slug}`;
    try {
      await recordShare({
        content_type: "article",
        content_id: contentId,
        channel: "copy_link",
        target_url: href,
      });
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(href);
      }
      toast.success("Link copied");
    } catch {
      toast.error("Could not record share");
    }
  };

  return (
    <div className="flex gap-2">
      {isLoggedIn ? (
        <Button type="button" variant="outline" size="icon" onClick={() => void toggleBookmark()}>
          <Bookmark className="size-4" />
          <span className="sr-only">Bookmark</span>
        </Button>
      ) : null}
      <Button type="button" variant="outline" size="icon" onClick={() => void share()}>
        <Share2 className="size-4" />
        <span className="sr-only">Share</span>
      </Button>
    </div>
  );
}
