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
  Columns,
  CheckCircle2,
  CloudUpload,
  AlertCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type DeviceMode = "desktop" | "tablet" | "mobile";
export type PreviewEnvironment = "production" | "edited" | "split";

interface LivePagePreviewProps {
  url: string;
  pageTitle: string;
  refreshKey?: number;
  onRefresh?: () => void;
  device?: DeviceMode;
  onDeviceChange?: (device: DeviceMode) => void;
  fullHeight?: boolean;
  draftData?: Record<string, unknown>;
  onPushToCloudflare?: () => void;
  hasUnsavedChanges?: boolean;
}

export function LivePagePreview({
  url,
  pageTitle,
  refreshKey = 0,
  onRefresh,
  device = "desktop",
  onDeviceChange,
  fullHeight = false,
  draftData,
  onPushToCloudflare,
  hasUnsavedChanges = false,
}: LivePagePreviewProps) {
  const [internalDevice, setInternalDevice] = useState<DeviceMode>(device);
  const [previewEnv, setPreviewEnv] = useState<PreviewEnvironment>("edited");
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [zoom, setZoom] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prodIframeRef = useRef<HTMLIFrameElement>(null);

  const currentDevice = onDeviceChange ? device : internalDevice;
  const setDevice = (d: DeviceMode) => {
    if (onDeviceChange) {
      onDeviceChange(d);
    } else {
      setInternalDevice(d);
    }
  };

  const [currentOrigin, setCurrentOrigin] = useState<string>("https://budgetndiostory.org");
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location?.origin) {
      setCurrentOrigin(window.location.origin);
    }
  }, []);

  // Save active draft to local storage so client components can hydrate live edits
  useEffect(() => {
    if (draftData && typeof window !== "undefined") {
      try {
        localStorage.setItem("bns_live_draft_data", JSON.stringify(draftData));
        window.postMessage({ type: "BNS_CMS_DRAFT_UPDATE", payload: draftData }, "*");
      } catch {
        // storage quota safety
      }
    }
  }, [draftData]);

  useEffect(() => {
    setIsIframeLoading(true);
    setHasTimedOut(false);
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, 7000);
    return () => clearTimeout(timer);
  }, [url, refreshKey, previewEnv]);

  const cleanUrl = url.replace(/([?&])preview=(true|draft)/g, "").replace(/\?$/, "");
  const productionUrl = cleanUrl;
  const editedUrl = cleanUrl.includes("?")
    ? `${cleanUrl}&preview=draft&t=${refreshKey}`
    : `${cleanUrl}?preview=draft&t=${refreshKey}`;

  const activeUrl = previewEnv === "production" ? productionUrl : editedUrl;
  const displayUrl = currentOrigin + (activeUrl.startsWith("/") ? activeUrl : "/" + activeUrl);

  const handleManualReload = () => {
    setIsIframeLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = activeUrl;
    }
    if (prodIframeRef.current) {
      prodIframeRef.current.src = productionUrl;
    }
    onRefresh?.();
  };

  const getDeviceStyles = (isSplit = false) => {
    switch (currentDevice) {
      case "mobile":
        return {
          containerClass: isSplit
            ? "w-full max-w-[340px] mx-auto rounded-[30px] border-4 border-foreground/20 shadow-xl p-1.5 bg-neutral-950"
            : "max-w-[390px] mx-auto rounded-[36px] border-4 border-foreground/20 shadow-2xl p-2 bg-neutral-900",
          iframeHeight: fullHeight ? "calc(100vh - 220px)" : isSplit ? "620px" : "720px",
          badge: "Mobile (390px)",
        };
      case "tablet":
        return {
          containerClass: isSplit
            ? "w-full max-w-[540px] mx-auto rounded-xl border border-border shadow-md p-1 bg-card"
            : "max-w-[768px] mx-auto rounded-2xl border-2 border-border shadow-xl p-1 bg-card",
          iframeHeight: fullHeight ? "calc(100vh - 220px)" : isSplit ? "640px" : "750px",
          badge: "Tablet (768px)",
        };
      case "desktop":
      default:
        return {
          containerClass: "w-full rounded-2xl border border-border shadow-lg bg-card",
          iframeHeight: fullHeight ? "calc(100vh - 220px)" : isSplit ? "640px" : "760px",
          badge: "Desktop (100%)",
        };
    }
  };

  const deviceConfig = getDeviceStyles(previewEnv === "split");

  return (
    <div
      className={"flex flex-col transition-all duration-200 " + (
        isFullscreen
          ? "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-4 sm:p-6 overflow-y-auto"
          : "w-full"
      )}
    >
      {/* 1. Top Browser Bar: Dual Previews & Device Modes */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-t-2xl border border-b-0 border-border bg-muted/80 px-4 py-2.5 backdrop-blur-xs">
        {/* Left: Window Dots & Page Identity */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border/60">
            <Eye className="size-3.5 text-primary" />
            <span className="text-xs font-bold text-foreground truncate max-w-[130px]">
              {pageTitle}
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-medium text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
              Live Preview
            </Badge>
          </div>
        </div>

        {/* Center: Dual Preview Switcher (Production vs Edited vs Split) */}
        <div className="flex items-center rounded-xl bg-background p-0.5 border border-border shadow-xs">
          <button
            type="button"
            onClick={() => setPreviewEnv("production")}
            className={"flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all " + (
              previewEnv === "production"
                ? "bg-emerald-600 text-white font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="View Live Production Version"
          >
            <span className={"size-2 rounded-full " + (previewEnv === "production" ? "bg-white" : "bg-emerald-500")} />
            <span>Production</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewEnv("edited")}
            className={"flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all " + (
              previewEnv === "edited"
                ? "bg-amber-600 text-white font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="View Live Edited Staging Version (Unsaved Edits)"
          >
            <span className={"size-2 rounded-full " + (previewEnv === "edited" ? "bg-white" : "bg-amber-500 animate-pulse")} />
            <span>Live Edited</span>
          </button>

          <button
            type="button"
            onClick={() => setPreviewEnv("split")}
            className={"hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all " + (
              previewEnv === "split"
                ? "bg-primary text-primary-foreground font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
            title="Compare Production and Live Edited Side-by-Side"
          >
            <Columns className="size-3" />
            <span>Split Compare</span>
          </button>
        </div>

        {/* Right: Device Viewport Controls & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl bg-background/90 p-0.5 border border-border/80 shadow-xs">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={"flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all " + (
                currentDevice === "desktop"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Desktop View (100%)"
            >
              <Laptop className="size-3.5" />
              <span className="hidden lg:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice("tablet")}
              className={"flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all " + (
                currentDevice === "tablet"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Tablet View (768px)"
            >
              <Tablet className="size-3.5" />
              <span className="hidden lg:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={"flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all " + (
                currentDevice === "mobile"
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Mobile View (390px)"
            >
              <Smartphone className="size-3.5" />
              <span className="hidden lg:inline">Mobile</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
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
              asChild
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
              title="Open Live URL in New Tab"
            >
              <a href={activeUrl} target="_blank" rel="noreferrer">
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
      </div>

      {/* 2. Mode Notification Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-x border-b border-border bg-background px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          {previewEnv === "production" ? (
            <>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 font-mono text-[10px]">
                ● Live Production Deployed
              </Badge>
              <span className="text-muted-foreground text-[11px] truncate max-w-[280px] sm:max-w-md">
                Viewing public live deployment from Cloudflare Edge CDN.
              </span>
            </>
          ) : previewEnv === "edited" ? (
            <>
              <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 font-mono text-[10px] animate-pulse">
                ● Live Edited (Staging Canvas)
              </Badge>
              <span className="text-muted-foreground text-[11px] truncate max-w-[280px] sm:max-w-md">
                Real-time canvas reflecting inputs. Ready to save &amp; push.
              </span>
            </>
          ) : (
            <>
              <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary font-mono text-[10px]">
                ◫ Split Screen Compare
              </Badge>
              <span className="text-muted-foreground text-[11px]">
                Comparing <strong>Production Live (Left)</strong> vs <strong>Live Edited Draft (Right)</strong>.
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[200px]">
            {activeUrl}
          </span>
          {onPushToCloudflare && (
            <Button
              type="button"
              onClick={onPushToCloudflare}
              size="sm"
              className="h-6 gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 shadow-xs"
            >
              <CloudUpload className="size-3" />
              <span>Push to Cloudflare</span>
            </Button>
          )}
        </div>
      </div>

      {/* 3. Previews Canvas */}
      <div className="rounded-b-2xl border border-border bg-muted/30 p-4 sm:p-6 overflow-hidden">
        {previewEnv === "split" ? (
          /* Split View Mode: Side-by-Side Production vs Live Edited */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Left: Production */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Production Live Site</span>
                </span>
                <Badge variant="outline" className="text-[9px] font-mono">
                  Current Deployed
                </Badge>
              </div>
              <div className={deviceConfig.containerClass}>
                <iframe
                  ref={prodIframeRef}
                  src={productionUrl}
                  title={`Production Preview of ${pageTitle}`}
                  className="w-full border-0 rounded-xl bg-background"
                  style={{ height: deviceConfig.iframeHeight }}
                />
              </div>
            </div>

            {/* Right: Live Edited */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                  <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Live Edited (Draft Preview)</span>
                </span>
                <Badge variant="outline" className="text-[9px] font-mono border-amber-500/30 text-amber-600 bg-amber-500/10">
                  Real-Time Edits
                </Badge>
              </div>
              <div className={deviceConfig.containerClass}>
                <iframe
                  ref={iframeRef}
                  src={editedUrl}
                  title={`Preview of ${pageTitle}`}
                  onLoad={() => setIsIframeLoading(false)}
                  className="w-full border-0 rounded-xl bg-background"
                  style={{ height: deviceConfig.iframeHeight }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Single View Mode: Either Production or Live Edited */
          <div className={deviceConfig.containerClass}>
            <iframe
              ref={iframeRef}
              key={`${refreshKey}-${previewEnv}`}
              src={activeUrl}
              title={`Preview of ${pageTitle}`}
              onLoad={() => setIsIframeLoading(false)}
              className="w-full border-0 rounded-xl bg-background transition-all"
              style={{
                height: deviceConfig.iframeHeight,
                transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                transformOrigin: "top center",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
