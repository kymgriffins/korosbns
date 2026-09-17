#!/usr/bin/env python3
"""
Page Speed Estimator
Estimates Core Web Vitals from HTML source: LCP, CLS risk, script/image analysis, and conversion impact.
"""

import argparse
import json
import os
import sys
from html.parser import HTMLParser

class PageSpeedParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_head = False
        self.in_body = False
        self.head_scripts = []
        self.body_scripts = []
        self.images = []
        self.links = []
        self.has_viewport = False
        self.has_preloads = False
        self.preloaded_resources = []
        self.total_elements = 0
        self.fonts = []

    def handle_starttag(self, tag, attrs):
        self.total_elements += 1
        attr_dict = {k.lower(): (v or "") for k, v in attrs}

        if tag == "head":
            self.in_head = True
        elif tag == "body":
            self.in_head = False
            self.in_body = True

        if tag == "meta" and attr_dict.get("name", "").lower() == "viewport":
            self.has_viewport = True

        if tag == "link":
            rel = attr_dict.get("rel", "").lower()
            href = attr_dict.get("href", "")
            self.links.append({"rel": rel, "href": href})
            if "preload" in rel:
                self.has_preloads = True
                self.preloaded_resources.append(href)
            if "stylesheet" in rel and ("fonts.googleapis.com" in href or "font" in href.lower()):
                self.fonts.append(href)

        if tag == "script":
            src = attr_dict.get("src", "")
            is_async = "async" in attr_dict
            is_defer = "defer" in attr_dict
            is_module = attr_dict.get("type", "").lower() == "module"
            is_blocking = bool(src and not (is_async or is_defer or is_module))
            script_data = {
                "src": src,
                "async": is_async,
                "defer": is_defer,
                "module": is_module,
                "blocking": is_blocking,
                "inline": not bool(src)
            }
            if self.in_head:
                self.head_scripts.append(script_data)
            else:
                self.body_scripts.append(script_data)

        if tag == "img":
            src = attr_dict.get("src", "") or attr_dict.get("data-src", "")
            has_width = "width" in attr_dict
            has_height = "height" in attr_dict
            loading = attr_dict.get("loading", "").lower()
            alt = attr_dict.get("alt", "")
            ext = os.path.splitext(src.split("?")[0])[1].lower() if src else ""
            is_modern = ext in [".webp", ".avif", ".svg"]
            self.images.append({
                "src": src,
                "has_dimensions": (has_width and has_height),
                "loading": loading,
                "alt": alt,
                "format": ext or "unknown",
                "is_modern": is_modern
            })

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False


def estimate_page_speed(html_content):
    parser = PageSpeedParser()
    parser.feed(html_content)

    total_images = len(parser.images)
    images_without_dims = [img for img in parser.images if not img["has_dimensions"]]
    non_modern_images = [img for img in parser.images if not img["is_modern"]]
    unlazy_images = [img for img in parser.images[1:] if img["loading"] != "lazy"]

    render_blocking_scripts = [s for s in parser.head_scripts if s["blocking"]]
    total_scripts = len(parser.head_scripts) + len(parser.body_scripts)

    base_lcp_seconds = 1.2
    blocking_script_penalty = len(render_blocking_scripts) * 0.35
    image_penalty = min(len(non_modern_images) * 0.15, 1.5)
    font_penalty = len(parser.fonts) * 0.2
    estimated_lcp = round(base_lcp_seconds + blocking_script_penalty + image_penalty + font_penalty, 2)

    cls_score = 0.01
    if images_without_dims:
        cls_score += min(len(images_without_dims) * 0.04, 0.25)
    if parser.fonts and not any("display=swap" in f for f in parser.fonts):
        cls_score += 0.05
    cls_risk = "GOOD (<0.1)" if cls_score <= 0.1 else ("NEEDS IMPROVEMENT (0.1 - 0.25)" if cls_score <= 0.25 else "POOR (>0.25)")

    estimated_fcp = round(max(0.8, estimated_lcp * 0.65), 2)
    load_time_delta = max(0.0, estimated_lcp - 2.0)
    conversion_loss_pct = round(load_time_delta * 7.0, 1)

    recommendations = []
    if render_blocking_scripts:
        recommendations.append(f"Add defer or async to {len(render_blocking_scripts)} render-blocking script(s) in <head>.")
    if images_without_dims:
        recommendations.append(f"Specify explicit width and height on {len(images_without_dims)} image(s) to eliminate layout shifts (CLS).")
    if non_modern_images:
        recommendations.append(f"Convert {len(non_modern_images)} legacy images (PNG/JPEG) to WebP or AVIF format.")
    if unlazy_images:
        recommendations.append(f"Add loading='lazy' to {len(unlazy_images)} below-the-fold image(s).")
    if not parser.has_viewport:
        recommendations.append("Missing <meta name='viewport'> tag. Essential for mobile Core Web Vitals.")

    return {
        "metrics": {
            "estimated_lcp_sec": estimated_lcp,
            "estimated_fcp_sec": estimated_fcp,
            "cls_risk_score": round(cls_score, 3),
            "cls_rating": cls_risk,
            "estimated_load_time_sec": estimated_lcp,
            "benchmark_target_sec": 2.0,
            "projected_conversion_loss_pct": conversion_loss_pct,
        },
        "breakdown": {
            "total_scripts": total_scripts,
            "render_blocking_scripts": len(render_blocking_scripts),
            "total_images": total_images,
            "images_missing_dimensions": len(images_without_dims),
            "images_non_modern_format": len(non_modern_images),
            "web_fonts_detected": len(parser.fonts),
            "dom_elements_count": parser.total_elements
        },
        "recommendations": recommendations
    }


def main():
    arg_parser = argparse.ArgumentParser(description="Estimate Core Web Vitals and conversion impact from HTML source.")
    arg_parser.add_argument("file", help="Path to HTML file to evaluate")
    arg_parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = arg_parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: File {args.file} not found.", file=sys.stderr)
        sys.exit(1)

    with open(args.file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    results = estimate_page_speed(content)

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        m = results["metrics"]
        b = results["breakdown"]
        print("\n" + "=" * 60)
        print("  LANDING PAGE CORE WEB VITALS & SPEED ESTIMATOR")
        print("=" * 60)
        print(f"  Target File:               {args.file}")
        print(f"  Estimated LCP:             {m['estimated_lcp_sec']}s (Goal: < 2.5s)")
        print(f"  Estimated FCP:             {m['estimated_fcp_sec']}s (Goal: < 1.8s)")
        print(f"  CLS Risk Rating:           {m['cls_rating']} (Score: {m['cls_risk_score']})")
        print(f"  Projected Conversion Loss: -{m['projected_conversion_loss_pct']}% (vs 2.0s baseline)")
        print("-" * 60)
        print("  RESOURCE BREAKDOWN:")
        print(f"  - Total Scripts:           {b['total_scripts']} ({b['render_blocking_scripts']} render-blocking)")
        print(f"  - Total Images:            {b['total_images']} ({b['images_missing_dimensions']} missing width/height, {b['images_non_modern_format']} non-WebP)")
        print(f"  - Web Fonts:               {b['web_fonts_detected']}")
        print(f"  - Total DOM Elements:      {b['dom_elements_count']}")
        print("-" * 60)
        if results["recommendations"]:
            print("  RECOMMENDATIONS:")
            for i, rec in enumerate(results["recommendations"], 1):
                print(f"  {i}. {rec}")
        else:
            print("  No critical speed bottlenecks detected. Great job!")
        print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
