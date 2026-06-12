"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ExternalLink, Loader2, ArrowLeft } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { SurveyForm } from "@/components/citizen/survey-form";
import { useSurvey } from "@/hooks/use-surveys";
import { Routes } from "@/constants/routes";
import { Button } from "@/ui/button";

export default function SurveyDetailPage() {
  const params = useParams();
  const id = String(params.id || "");
  const { data: survey, isLoading, error } = useSurvey(id);

  useEffect(() => {
    if (survey?.is_external && survey?.external_url) {
      window.location.assign(survey.external_url);
    }
  }, [survey]);

  if (survey?.is_external && survey.external_url) {
    return (
      <Wrapper className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <p className="mb-4 text-muted-foreground">Opening external survey…</p>
          <Button asChild>
            <a href={survey.external_url} target="_blank" rel="noopener noreferrer">
              Continue to survey
              <ExternalLink className="ml-2 size-4" aria-hidden />
            </a>
          </Button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper className="py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href={Routes.Surveys}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          All surveys
        </Link>
        {isLoading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin" aria-hidden />
          </div>
        )}
        {error && <p className="text-destructive">{error?.message ?? "Survey not found."}</p>}
        {survey && (
          <>
            {(survey.image_url || survey.image) && (
              <div className="relative w-full h-56 sm:h-72 overflow-hidden rounded-2xl bg-muted border border-border/40 shadow-xs mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={survey.image_url || survey.image}
                  alt={survey.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h1 className="mb-2 text-3xl font-bold">{survey.title}</h1>
            {survey.description ? (
              <p className="mb-8 text-muted-foreground">{survey.description}</p>
            ) : null}
            <SurveyForm survey={survey} />
          </>
        )}
      </div>
    </Wrapper>
  );
}
