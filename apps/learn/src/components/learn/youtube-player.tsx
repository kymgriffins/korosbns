"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/utils";

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}`;
}

export function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const postMessage = useCallback((command: string, args: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args }),
      "*",
    );
  }, []);

  const changeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
    setShowSpeedMenu(false);
    postMessage("setPlaybackRate", [newSpeed]);
  }, [postMessage]);

  useEffect(() => {
    if (!showSpeedMenu) return;
    const handler = () => setShowSpeedMenu(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [showSpeedMenu]);

  return (
    <div className="space-y-1.5">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-xs group">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          src={embedUrl(videoId)}
          title={title ?? "Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowSpeedMenu((p) => !p); }}
            className="px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold backdrop-blur-sm hover:bg-black/80 transition-colors"
          >
            {speed}x
          </button>
          {showSpeedMenu && (
            <div className="absolute bottom-full right-0 mb-1 bg-black/85 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); changeSpeed(s); }}
                  className={cn(
                    "block w-full px-3 py-1.5 text-[10px] font-bold text-left hover:bg-white/10 transition-colors",
                    s === speed ? "text-primary" : "text-white/70",
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}