"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TWITTER_USERNAME = "ketreasury";
const TIMELEMBED_URL = `https://x.com/${TWITTER_USERNAME}`;

export function TreasuryFeed() {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="treasury-feed" className="scroll-mt-24">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <svg className="size-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Updates from Treasury
            </CardTitle>
            <p className="text-xs text-muted-foreground">Latest announcements and insights</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={TIMELEMBED_URL} target="_blank" rel="noopener noreferrer" className="gap-1.5">
              <ExternalLink className="size-3.5" />
              View on X
            </a>
          </Button>
        </CardHeader>
        <CardContent>
          <div ref={ref} className="relative min-h-[400px] rounded-lg border bg-muted/10 overflow-hidden">
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/5">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}
            <iframe
              src={`https://x.com/${TWITTER_USERNAME}`}
              title="Treasury X Profile"
              className="w-full h-[500px]"
              sandbox="allow-scripts allow-same-origin"
              ref={(el) => {
                if (el && loaded) {
                  el.style.opacity = "1";
                }
              }}
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Updates from the National Treasury and Economic Planning (@{TWITTER_USERNAME})
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
