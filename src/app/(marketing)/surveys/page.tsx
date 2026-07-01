"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ExternalLink, Loader2 } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import type { SurveyListItemApi } from "@/lib/api-client";
import { useSurveys } from "@/hooks/use-surveys";
import { fadeInUp, staggerContainer } from "@/motion/variants";

function SurveyCard({ survey }: { survey: SurveyListItemApi }) {
  const isExternal = survey.is_external && survey.external_url;
  const imageUrl = survey.image_url || survey.image;

  const cta = isExternal ? (
    <Button asChild className="w-full">
      <a
        href={survey.external_url!}
        target="_blank"
        rel="noopener noreferrer"
      >
        Take survey
        <ExternalLink className="ml-2 size-3.5" aria-hidden />
      </a>
    </Button>
  ) : (
    <Button asChild size="sm" className="w-full">
      <Link href={Routes.Survey(survey.id)}>Take survey</Link>
    </Button>
  );

  return (
    <motion.article
      variants={fadeInUp}
      className="flex flex-col justify-between rounded-xl border border-border bg-card transition-colors hover:border-primary/40 overflow-hidden group"
    >
      {imageUrl && (
        <div className="relative w-full h-40 overflow-hidden bg-muted border-b border-border/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={survey.title}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <h3 className="mb-2 text-lg font-semibold">{survey.title}</h3>
          {survey.description ? (
            <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
              {survey.description}
            </p>
          ) : null}
          <p className="mb-4 text-xs text-muted-foreground">
            {isExternal
              ? "Hosted externally — opens in a new tab"
              : survey.allow_anonymous === false
                ? "Sign-in required to submit"
                : "Anonymous submissions allowed"}
          </p>
        </div>
        {cta}
      </div>
    </motion.article>
  );
}

export default function SurveysPage() {
  const { data: surveys = [], isLoading, error } = useSurveys();

  return (
    <Wrapper className="py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12 text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="mb-6 text-4xl font-bold lg:text-5xl">Budget Surveys</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Share your views on the national budget. Active surveys from Budget Ndio Story.
          </p>
        </motion.div>

        {isLoading && surveys.length === 0 && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading surveys" />
          </div>
        )}

        {error && (
          <p className="py-8 text-center text-destructive">{error?.message ?? "An error occurred"}</p>
        )}

        {!error && surveys.length > 0 && (
          <motion.div
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {surveys.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} />
            ))}
          </motion.div>
        )}

        {!isLoading && !error && surveys.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No active surveys right now. Check back soon.
          </p>
        )}
      </div>
    </Wrapper>
  );
}
