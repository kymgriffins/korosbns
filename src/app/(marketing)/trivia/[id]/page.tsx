"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { TriviaQuiz } from "@/components/citizen/trivia-quiz";
import { citizenApi, type TriviaSetApi } from "@/lib/api-client";
import { Routes } from "@/constants/routes";

export default function TriviaDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [trivia, setTrivia] = useState<TriviaSetApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    void citizenApi
      .getTrivia(id)
      .then(setTrivia)
      .catch((err) => setError(err instanceof Error ? err.message : "Trivia not found."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Wrapper className="py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href={Routes.Trivia}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          All trivia
        </Link>
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {trivia && (
          <>
            <h1 className="text-3xl font-bold mb-8">{trivia.title}</h1>
            <TriviaQuiz trivia={trivia} />
          </>
        )}
      </div>
    </Wrapper>
  );
}
