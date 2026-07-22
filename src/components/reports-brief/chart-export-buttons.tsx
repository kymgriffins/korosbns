"use client";

import { useCallback, useRef, useState } from "react";
import { Download, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  /** Accessible label prefix, e.g. "Top sectors" */
  label: string;
  fileBase: string;
  className?: string;
};

function svgToDataUrl(svg: SVGSVGElement): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }
  const xml = new XMLSerializer().serializeToString(clone);
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/**
 * Client-side chart export: finds the first SVG under a chart container and
 * downloads SVG or rasterized PNG (canvas). Pragmatic for video / social cuts.
 */
export function ChartExportButtons({ label, fileBase, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<"svg" | "png" | null>(null);

  const findSvg = useCallback((): SVGSVGElement | null => {
    const root = wrapRef.current?.parentElement;
    if (!root) return null;
    return root.querySelector("svg");
  }, []);

  const downloadSvg = useCallback(() => {
    const svg = findSvg();
    if (!svg) return;
    setBusy("svg");
    try {
      triggerDownload(svgToDataUrl(svg), `${fileBase}.svg`);
    } finally {
      setBusy(null);
    }
  }, [fileBase, findSvg]);

  const downloadPng = useCallback(async () => {
    const svg = findSvg();
    if (!svg) return;
    setBusy("png");
    try {
      const dataUrl = svgToDataUrl(svg);
      const img = new Image();
      const loaded = new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("SVG rasterize failed"));
      });
      img.src = dataUrl;
      await loaded;
      const bbox = svg.getBoundingClientRect();
      const w = Math.max(1, Math.round(bbox.width) || svg.viewBox.baseVal.width || 640);
      const h = Math.max(1, Math.round(bbox.height) || svg.viewBox.baseVal.height || 360);
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = getComputedStyle(document.body).backgroundColor || "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, w, h);
      const png = canvas.toDataURL("image/png");
      triggerDownload(png, `${fileBase}.png`);
    } catch {
      // Keep silent — chart still usable without export
    } finally {
      setBusy(null);
    }
  }, [fileBase, findSvg]);

  return (
    <div ref={wrapRef} className={className ?? "flex flex-wrap items-center gap-1.5"}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-2 text-[10px] font-bold"
        onClick={downloadSvg}
        disabled={busy !== null}
        aria-label={`Download ${label} as SVG`}
      >
        {busy === "svg" ? <Loader2 className="size-3 animate-spin" /> : <Download className="size-3" />}
        SVG
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1 px-2 text-[10px] font-bold"
        onClick={() => void downloadPng()}
        disabled={busy !== null}
        aria-label={`Download ${label} as PNG`}
      >
        {busy === "png" ? <Loader2 className="size-3 animate-spin" /> : <ImageIcon className="size-3" />}
        PNG
      </Button>
    </div>
  );
}
