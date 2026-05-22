"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import Wrapper from "@/components/global/wrapper";
import { Button } from "@/components/ui/button";
import { Routes } from "@/constants/routes";
import type { SurveyListItemApi } from "@/lib/api-client";
import { contentLoadErrorMessage, loadSurveyList } from "@/lib/marketing-content";
import { Loader2, X, ExternalLink } from "lucide-react";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyListItemApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIframeUrl, setActiveIframeUrl] = useState<string | null>(null);

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
            {/* Featured External Survey Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                  <Image
                    src="/images/survey/bnssurvey1.jpeg"
                    alt="National Youth Budget Perception Pilot Survey"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    Featured
                  </div>
                </div>
                <div className="p-6 pb-0">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    National Youth Budget Perception Pilot Survey
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    Share your views on the national budget! Help us understand youth budget priorities and civic literacy in Kenya.
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span className="inline-block size-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Open for submissions (External)</span>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-2">
                <Button
                  onClick={() => setActiveIframeUrl("https://budgetndiostory.surveycto.com/collect/bns_nyouth_budget_v1")}
                  className="w-full font-medium cursor-pointer"
                >
                  Take survey
                </Button>
              </div>
            </motion.div>

            {surveys.map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 1) * 0.05 }}
                className="rounded-xl border border-border bg-card p-6 hover:border-primary/40 transition-colors flex flex-col justify-between"
              >
                <div>
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
                </div>
                <Button asChild size="sm" className="w-full">
                  <Link href={Routes.Survey(survey.id)}>Take survey</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal Iframe Embed */}
        {activeIframeUrl && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 transition-all animate-in fade-in duration-300">
            <div className="relative w-full max-w-5xl h-[85vh] bg-background border border-border rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                <div>
                  <h3 className="font-semibold text-base sm:text-lg">
                    National Youth Budget Perception Pilot Survey
                  </h3>
                  <p className="text-xs text-muted-foreground">SurveyCTO secure external form</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a href={activeIframeUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4" />
                      <span className="hidden sm:inline">Open in new tab</span>
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setActiveIframeUrl(null)}
                    className="rounded-full"
                  >
                    <X className="size-5" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 w-full bg-white relative">
                <iframe
                  src={activeIframeUrl}
                  className="w-full h-full border-none"
                  title="SurveyCTO Form"
                  allow="geolocation"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
