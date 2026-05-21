"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { SurveyForm } from "@/components/citizen/survey-form";
import { citizenApi, type SurveyDetailApi } from "@/lib/api-client";
import { Routes } from "@/constants/routes";

export default function SurveyDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const [survey, setSurvey] = useState<SurveyDetailApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    void citizenApi
      .getSurvey(id)
      .then(setSurvey)
      .catch((err) => setError(err instanceof Error ? err.message : "Survey not found."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Wrapper className="py-16">
      <div className="max-w-2xl mx-auto">
        <Link
          href={Routes.Surveys}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="size-4" />
          All surveys
        </Link>
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {survey && (
          <>
            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
            {survey.description ? (
              <p className="text-muted-foreground mb-8">{survey.description}</p>
            ) : null}
            <SurveyForm survey={survey} />
          </>
        )}
      </div>
    </Wrapper>
  );
}
