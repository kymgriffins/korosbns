"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function XTimelineMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const scriptId = "twitter-wjs";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const loadTimeline = () => {
      if (isMounted && (window as any).twttr && (window as any).twttr.widgets) {
        (window as any).twttr.widgets.load(containerRef.current);
      }
    };

    script.addEventListener("load", loadTimeline);
    
    // In case the script is already loaded/cached by the browser
    loadTimeline();

    // Polling check to handle fast page transitions or caching
    const interval = setInterval(() => {
      if ((window as any).twttr && (window as any).twttr.widgets) {
        loadTimeline();
        clearInterval(interval);
      }
    }, 500);

    return () => {
      isMounted = false;
      clearInterval(interval);
      script.removeEventListener("load", loadTimeline);
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
