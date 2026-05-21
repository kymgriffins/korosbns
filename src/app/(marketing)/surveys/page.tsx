"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import type { SurveyListItemApi } from "@/lib/api-client";
import { contentLoadErrorMessage, loadSurveyList } from "@/lib/marketing-content";
import { Loader2 } from "lucide-react";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void loadSurveyList()
      .then(setSurveys)
      .catch((err) => setError(contentLoadErrorMessage(err, "surveys")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Wrapper className="py-16">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">Budget Surveys</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your views on the national budget. Active surveys from Budget Ndio Story.
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <p className="text-center text-destructive py-8">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <h3 className="text-lg font-semibold mb-2">{survey.title}</h3>
                {survey.description ? (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {survey.description}
                  </p>
                ) : null}
                <p className="text-xs text-muted-foreground mb-4">
                  {survey.allow_anonymous === false
                    ? "Sign-in required to submit"
                    : "Anonymous submissions allowed"}
                </p>
                <Button asChild size="sm" className="w-full">
                  <Link href={Routes.Survey(survey.id)}>Take survey</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && surveys.length === 0 && (
          <p className="text-center text-muted-foreground mt-8">
            No active surveys right now. Check back soon.
          </p>
        )}
      </div>
    </Wrapper>
  );
}
