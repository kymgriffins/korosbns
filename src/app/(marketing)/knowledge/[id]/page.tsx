"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Routes } from "@/constants/routes";
import {
  contentLoadErrorMessage,
  loadKnowledgeDetail,
  type HubKnowledge,
} from "@/lib/citizen-content";

export default function KnowledgeDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [entry, setEntry] = useState<HubKnowledge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    void loadKnowledgeDetail(id)
      .then(setEntry)
      .catch((err) => setError(contentLoadErrorMessage(err, "entry")))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Wrapper className="py-16">
      <article className="max-w-3xl mx-auto">
        <Link
          href={Routes.Knowledge}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          Knowledge hub
        </Link>
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {entry && (
          <>
            <h1 className="text-3xl lg:text-4xl font-bold">{entry.title}</h1>
            {entry.body_html ? (
              <div
                className="notion-content-wrapper mt-8"
                dangerouslySetInnerHTML={{ __html: entry.body_html }}
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none mt-8 whitespace-pre-wrap">
                {entry.body || entry.snippet}
              </div>
            )}
          </>
        )}
      </article>
    </Wrapper>
  );
}
