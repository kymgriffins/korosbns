"use client";

import { ImmersiveChrome } from "./immersive-chrome";
import { ImmersiveBottomBar } from "./immersive-bottom-bar";
import { Routes } from "@/constants/routes";

export type StoryCardData = {
  emoji?: string;
  title?: string;
  subtitle?: string;
  content?: string;
  hook?: string;
  stat?: { value: string; label: string };
};

export function ImmersiveStorySlide({
  slug,
  storyTitle,
  storyIcon,
  cards,
  slideNumber,
}: {
  slug: string;
  storyTitle: string;
  storyIcon: string;
  cards: StoryCardData[];
  slideNumber: number;
}) {
  const index = slideNumber - 1;
  const card = cards[index];
  const total = cards.length;

  if (!card) return null;

  return (
    <div className="learn-immersive fixed inset-0 z-50 flex flex-col bg-background">
      <ImmersiveChrome
        backHref={Routes.LearnStories}
        title={storyTitle}
        subtitle={`Slide ${slideNumber} of ${total}`}
        progress={{ current: slideNumber, total }}
      />
      <div className="flex flex-1 flex-col items-center justify-center px-5 py-6">
        <div className="w-full max-w-md rounded-[1.5rem] border border-border/50 bg-card p-8 shadow-sm">
          <div className="mb-4 text-5xl">{card.emoji || storyIcon}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{card.title}</h1>
          {card.subtitle ? (
            <p className="mt-1 text-[15px] text-muted-foreground">{card.subtitle}</p>
          ) : null}
          {card.hook ? (
            <span className="mt-3 inline-block rounded-full bg-muted px-3 py-1 text-[12px] font-medium">
              {card.hook}
            </span>
          ) : null}
          <p className="mt-5 text-[17px] leading-relaxed text-foreground/90">{card.content}</p>
          {card.stat ? (
            <div className="mt-6 rounded-[var(--immersive-radius)] bg-primary/5 p-4 text-center">
              <p className="text-3xl font-semibold text-primary">{card.stat.value}</p>
              <p className="text-[13px] text-muted-foreground">{card.stat.label}</p>
            </div>
          ) : null}
        </div>
      </div>
      <ImmersiveBottomBar
        prevHref={slideNumber > 1 ? `/learn/${slug}/story/${slideNumber - 1}` : undefined}
        prevDisabled={slideNumber <= 1}
        nextHref={
          slideNumber < total ? `/learn/${slug}/story/${slideNumber + 1}` : Routes.LearnStories
        }
        nextLabel={slideNumber < total ? "Next" : "Finish story"}
      />
    </div>
  );
}
