"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Laptop,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Eye,
  ZoomIn,
  ZoomOut,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type DeviceMode = "desktop" | "tablet" | "mobile";

interface LivePagePreviewProps {
  url: string;
  pageTitle: string;
  refreshKey?: number;
  onRefresh?: () => void;
  device?: DeviceMode;
  onDeviceChange?: (device: DeviceMode) => void;
  fullHeight?: boolean;
}

export function LivePagePreview({
  url,
  pageTitle,
  refreshKey = 0,
  onRefresh,
  device = "desktop",
  onDeviceChange,
  fullHeight = false,
}: LivePagePreviewProps) {
  const [internalDevice, setInternalDevice] = useState<DeviceMode>(device);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentDevice = onDeviceChange ? device : internalDevice;
  const setDevice = (d: DeviceMode) => {
    if (onDeviceChange) {
      onDeviceChange(d);
    } else {
      setInternalDevice(d);
    }
  };

  const handleManualReload = () => {
    setIsIframeLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
    onRefresh?.();
  };

  const [currentOrigin, setCurrentOrigin] = useState<string>("https://budgetndiostory.org");
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location?.origin) {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    setIsIframeLoading(true);
    setHasTimedOut(false);
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, [url, refreshKey]);

  const displayUrl = currentOrigin + (url.startsWith("/") ? url : "/" + url);

  const getDeviceStyles = () => {
    switch (currentDevice) {
      case "mobile":
        return {
          containerClass: "max-w-[390px] mx-auto rounded-[36px] border-4 border-foreground/20 shadow-2xl p-2 bg-neutral-900",
          iframeHeight: fullHeight ? "calc(100vh - 180px)" : "720px",
          badge: "Mobile (390px)",
        };
      case "tablet":
        return {
          containerClass: "max-w-[768px] mx-auto rounded-2xl border-2 border-border shadow-xl p-1 bg-card",
          iframeHeight: fullHeight ? "calc(100vh - 180px)" : "750px",
          badge: "Tablet (768px)",
        };
      case "desktop":
      default:
        return {
          containerClass: "w-full rounded-2xl border border-border shadow-lg bg-card",
          iframeHeight: fullHeight ? "calc(100vh - 180px)" : "760px",
          badge: "Desktop (100%)",
        };
    }
  };

  const deviceConfig = getDeviceStyles();

  return (
    <div
      className={"flex flex-col transition-all duration-200 " + (
        isFullscreen
          ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-4 sm:p-6"
          : "w-full"
      )}
    >
      {/* Top Browser Bar & Device Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-t-2xl border border-b-0 border-border bg-muted/70 px-4 py-2.5 backdrop-blur-xs">
        {/* Left: Window Dots & Page Info */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border/60">
            <Eye className="size-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground truncate max-w-[140px]">
              {pageTitle}
            </span>
            {url.includes("preview=true") ? (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20">
                Draft Preview
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                Live Preview
              </Badge>
            )}
          </div>
        </div>

        {/* Center: Device Viewport Controls */}
        <div className="flex items-center rounded-xl bg-background/80 p-0.5 border border-border/80 shadow-xs">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={"flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all " + (
              currentDevice === "desktop"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Desktop View (100%)"
          >
            <Laptop className="size-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={"flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all " + (
              currentDevice === "tablet"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Tablet View (768px)"
          >
            <Tablet className="size-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={"flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all " + (
              currentDevice === "mobile"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Mobile View (390px)"
          >
            <Smartphone className="size-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions (Reload, Zoom, External Open, Fullscreen) */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleManualReload}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title="Reload Preview"
          >
            <RotateCw className={"size-3.5 " + (isIframeLoading ? "animate-spin text-primary" : "")} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.max(70, z - 10))}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            title="Zoom Out"
            disabled={zoom <= 70}
          >
            <ZoomOut className="size-3.5" />
          </Button>
          <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline-block w-8 text-center">
            {zoom}%
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.min(110, z + 10))}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
            title="Zoom In"
            disabled={zoom >= 110}
          >
            <ZoomIn className="size-3.5" />
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
            title="Open Live URL in New Tab"
          >
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5" />
            </a>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </Button>
        </div>
      </div>

      {/* URL Address Bar */}
      <div className="flex items-center gap-2 border-x border-border bg-background/90 px-4 py-1.5 text-[11px] text-muted-foreground border-b border-border/60">
        <span className="flex size-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-mono truncate select-all">{displayUrl}</span>
        <span className="ml-auto text-[10px] font-medium text-muted-foreground">
          {deviceConfig.badge}
        </span>
      </div>

      {/* Iframe Viewport Container */}
      <div className="relative border border-t-0 border-border rounded-b-2xl bg-neutral-950/5 dark:bg-neutral-950/40 p-2 sm:p-4 overflow-auto flex items-start justify-center min-h-[500px]">
        {isIframeLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/85 backdrop-blur-xs rounded-b-2xl p-6 text-center">
            {!hasTimedOut ? (
              <>
                <RotateCw className="size-6 animate-spin text-primary" />
                <p className="text-xs font-semibold text-foreground">Rendering live preview...</p>
              </>
            ) : (
              <div className="max-w-xs space-y-3">
                <div className="p-3 rounded-full bg-primary/10 text-primary w-fit mx-auto">
                  <ExternalLink className="size-5" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  Preview taking longer than usual or blocked by browser settings?
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="text-xs gap-1.5"
                    asChild
                  >
                    <a href={url} target="_blank" rel="noreferrer">
                      <span>Open Page in Tab</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={handleManualReload}
                  >
                    <RotateCw className="size-3.5" />
                    <span>Retry</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          className={deviceConfig.containerClass + " transition-all duration-300 w-full overflow-hidden"}
          style={{
            transform: zoom !== 100 ? ("scale(" + (zoom / 100) + ")") : undefined,
            transformOrigin: "top center",
          }}
        >
          {currentDevice === "mobile" && (
            <div className="w-full flex justify-center py-1">
              <div className="w-24 h-3 bg-neutral-800 rounded-full" />
            </div>
          )}

          <iframe
            key={url + "-" + refreshKey}
            ref={iframeRef}
            src={url}
            title={"Preview of " + pageTitle}
            onLoad={() => setIsIframeLoading(false)}
            className="w-full rounded-xl border-0 bg-background transition-opacity duration-200"
            style={{
              height: deviceConfig.iframeHeight,
            }}
          />
        </div>
      </div>

      {/* Helpful preview notice footer */}
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground px-1">
        <div className="flex items-center gap-1.5">
          <Sparkles className="size-3 text-amber-500" />
          <span>Interactive preview: click links, test buttons, and verify responsiveness live.</span>
        </div>
        <span className="text-[10px]">Autorefreshes when you click &ldquo;Save &amp; Publish&rdquo;</span>
      </div>
    </div>
  );
}
