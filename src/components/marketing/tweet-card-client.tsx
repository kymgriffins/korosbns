"use client";

import React from "react";
import { useTweet } from "react-tweet";
import { motion } from "motion/react";
import { MagicTweet, TweetSkeleton, TweetNotFound } from "@/components/ui/tweet-card";

const TWEET_IDS = ["1902374567890123456"];

function TweetCardInner({ id }: { id: string }) {
  const { data, error, isLoading } = useTweet(id);

  if (isLoading) return <TweetSkeleton className="w-full max-w-lg mx-auto" />;
  if (error || !data) return <TweetNotFound className="w-full max-w-lg mx-auto" />;

  return <MagicTweet tweet={data} className="w-full max-w-lg mx-auto" />;
}

export function TweetCardSection() {
  return (
    <section className="border-t border-border/40 bg-background py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold text-primary">
            Social Buzz
          </span>
          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-4xl">
            What They&apos;re Saying
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The latest conversations about Kenya&apos;s budget from the National Treasury and beyond.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {TWEET_IDS.map((id) => (
            <TweetCardInner key={id} id={id} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
