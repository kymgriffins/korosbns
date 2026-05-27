"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function XTimelineMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://platform.twitter.com/widgets.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      const existing = document.querySelector('script[src="https://platform.twitter.com/widgets.js"]');
      if (existing) existing.remove();
    };
  }, []);

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-16 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.svg"
          alt="Budget Ndio Story"
          width={120}
          height={30}
          className="h-6 w-auto"
        />
        <span className="text-sm text-muted-foreground font-medium">on X</span>
      </div>
      <Card className="w-full max-w-xl mx-auto p-4 border-border bg-card shadow-sm">
        <div ref={containerRef} className="w-full">
          <a
            className="twitter-timeline"
            data-height="500"
            data-dnt="true"
            data-chrome="noheader nofooter noborders transparent"
            href="https://twitter.com/budgetndiostory?ref_src=twsrc%5Etfw"
          >
            Loading tweets from @budgetndiostory...
          </a>
        </div>
      </Card>
      <a
        href="https://x.com/budgetndiostory"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-xs text-muted-foreground hover:text-primary underline underline-offset-4 transition-colors"
      >
        View all tweets on X.com &rarr;
      </a>
    </div>
  );
}
