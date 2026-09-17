#!/usr/bin/env python3
"""
Conversion Checklist
Runs a comprehensive 20+ point conversion optimization audit against 2025-2026 best practices and benchmarks.
"""

import argparse
import json
import os
import re
import sys
from html.parser import HTMLParser

class AuditParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.text_chunks = []
        self.title = ""
        self.meta_desc = ""
        self.og_tags = {}
        self.has_viewport = False
        self.h1_tags = []
        self.h2_tags = []
        self.ctas = []
        self.images = []
        self.testimonials = 0
        self.faq_count = 0
        self.forms = 0
        self.form_inputs = 0
        self.in_title = False
        self.in_h1 = False
        self.in_h2 = False
        self.in_cta = False
        self.current_cta_text = []

    def handle_starttag(self, tag, attrs):
        attr_dict = {k.lower(): (v or "") for k, v in attrs}
        self.tags.append(tag)

        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            if attr_dict.get("name", "").lower() == "viewport":
                self.has_viewport = True
            elif attr_dict.get("name", "").lower() == "description":
                self.meta_desc = attr_dict.get("content", "")
            elif attr_dict.get("property", "").startswith("og:"):
                self.og_tags[attr_dict.get("property")] = attr_dict.get("content", "")
        elif tag == "h1":
            self.in_h1 = True
        elif tag == "h2":
            self.in_h2 = True
        elif tag == "form":
            self.forms += 1
        elif tag in ["input", "select", "textarea"]:
            if attr_dict.get("type", "").lower() not in ["hidden", "submit", "button"]:
                self.form_inputs += 1
        elif tag == "img":
            self.images.append({
                "alt": attr_dict.get("alt", ""),
                "src": attr_dict.get("src", ""),
                "width": attr_dict.get("width", ""),
                "height": attr_dict.get("height", "")
            })

        is_cta = (tag == "button") or (tag == "a" and any(c in attr_dict.get("class", "").lower() for c in ["btn", "button", "cta"]))
        if is_cta:
            self.in_cta = True
            self.current_cta_text = []

    def handle_data(self, data):
        clean = data.strip()
        if clean:
            self.text_chunks.append(clean)
            if self.in_title:
                self.title += clean
            elif self.in_h1:
                self.h1_tags.append(clean)
            elif self.in_h2:
                self.h2_tags.append(clean)
            elif self.in_cta:
                self.current_cta_text.append(clean)

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "h1":
            self.in_h1 = False
        elif tag == "h2":
            self.in_h2 = False
        elif self.in_cta and (tag in ["button", "a"]):
            self.in_cta = False
            t = " ".join(self.current_cta_text).strip()
            if t:
                self.ctas.append(t)
            self.current_cta_text = []


def run_conversion_audit(html_content):
    parser = AuditParser()
    parser.feed(html_content)

    full_text = " ".join(parser.text_chunks).lower()
    checks = []

    def add_check(id_num, name, passed, weight, advice, category):
        checks.append({
            "id": id_num,
            "category": category,
            "name": name,
            "status": "PASS" if passed else "FAIL",
            "weight": weight,
            "score": weight if passed else 0,
            "advice": advice
        })

    # 1. Page Title
    has_title = len(parser.title.strip()) > 10
    add_check(1, "SEO Title Tag Present & Descriptive", has_title, 4, "Add an informative <title> tag between 40-60 characters.", "SEO & Meta")

    # 2. Meta Description
    has_meta_desc = len(parser.meta_desc.strip()) > 25
    add_check(2, "Meta Description Configured", has_meta_desc, 4, "Include a compelling meta description (120-155 characters) outlining the value offer.", "SEO & Meta")

    # 3. Viewport Mobile Meta
    add_check(3, "Mobile Viewport Configured", parser.has_viewport, 5, "Include <meta name='viewport' content='width=device-width, initial-scale=1'>.", "Mobile & UX")

    # 4. Single Clear H1 Headline
    has_single_h1 = len(parser.h1_tags) == 1
    add_check(4, "Single Primary H1 Headline", has_single_h1, 5, "Ensure exactly one H1 headline clearly stating what you offer and who it is for.", "Copywriting & Clarity")

    # 5. Above-the-fold CTA
    has_cta = len(parser.ctas) > 0
    add_check(5, "Primary CTA Button Present Above-the-Fold", has_cta, 6, "Place a high-contrast action CTA in the hero section before any scrolling.", "Conversion Strategy")

    # 6. Benefit-driven CTA copy
    cta_copy_good = any(any(v in c.lower() for v in ["get", "start", "claim", "free", "join", "try", "book"]) for c in parser.ctas)
    add_check(6, "Action & Value Oriented CTA Copy", cta_copy_good, 5, "Use first-person or action verbs (e.g. 'Start Free', 'Get My Blueprint') instead of generic words.", "Conversion Strategy")

    # 7. Social Proof
    has_social_proof = any(w in full_text for w in ["testimonial", "rating", "reviews", "trusted by", "case study", "results", "stars"])
    add_check(7, "Social Proof / Credibility Signals", has_social_proof, 6, "Incorporate customer reviews, ratings, client logos, or quantifiable success stats early on page.", "Trust & Credibility")

    # 8. Risk Reversal
    has_risk_reversal = any(w in full_text for w in ["no credit card", "free trial", "cancel anytime", "guarantee", "money-back", "100% free"])
    add_check(8, "Risk Reversal Microcopy", has_risk_reversal, 5, "Place 'No credit card required' or satisfaction guarantees directly near CTA buttons.", "Trust & Credibility")

    # 9. Problem / Agitate Framing
    has_problem = any(w in full_text for w in ["struggling", "tired of", "frustrated", "problem", "mistake", "stop wasting", "challenge"])
    add_check(9, "Problem / Pain Point Articulated", has_problem, 5, "Articulate the audience pain point before presenting your solution.", "Copywriting & Clarity")

    # 10. Solution / Benefits Mapping
    has_benefits = any(w in full_text for w in ["features", "benefits", "how it helps", "why choose", "solution", "advantage"])
    add_check(10, "Solution & Benefits Clearly Outlined", has_benefits, 5, "Present benefits focusing on visitor outcomes rather than just technical features.", "Copywriting & Clarity")

    # 11. How It Works
    has_how_it_works = any(w in full_text for w in ["how it works", "3 simple steps", "step 1", "easy steps", "get started in"])
    add_check(11, "How It Works (Process Steps)", has_how_it_works, 4, "Break onboarding or fulfillment down into 3 simple, low-friction steps.", "Copywriting & Clarity")

    # 12. FAQ Section
    has_faq = any(w in full_text for w in ["frequently asked", "faq", "questions", "answers"]) or "accordion" in full_text
    add_check(12, "FAQ Section to Handle Objections", has_faq, 4, "Include an FAQ section answering top 4-6 pre-purchase questions and doubts.", "Conversion Strategy")

    # 13. Closing / Secondary CTA
    has_closing_cta = len(parser.ctas) >= 2
    add_check(13, "Repeated Closing CTA at Bottom", has_closing_cta, 4, "Repeat your primary CTA at the bottom of the page for visitors who scrolled through.", "Conversion Strategy")

    # 14. Form Friction
    form_ok = (parser.forms == 0) or (parser.form_inputs <= 4)
    add_check(14, "Low Form Friction (<= 4 Fields)", form_ok, 5, "Keep lead capture forms short (name & email only). Every extra field cuts conversions ~10%.", "Mobile & UX")

    # 15. Trust Signals & Security
    has_trust = any(w in full_text for w in ["secure", "privacy", "ssl", "encrypted", "certified", "terms"])
    add_check(15, "Trust Signals & Security Badges", has_trust, 4, "Add security icons, privacy badges, or compliance seals near transaction points.", "Trust & Credibility")

    # 16. Open Graph Tags
    has_og = len(parser.og_tags) >= 2
    add_check(16, "Open Graph Social Meta Tags", has_og, 3, "Provide og:title, og:description, and og:image tags for rich preview sharing.", "SEO & Meta")

    # 17. Image Alt Attributes
    images_with_alt = [img for img in parser.images if img["alt"].strip()]
    alt_ratio_ok = (len(parser.images) == 0) or (len(images_with_alt) / max(1, len(parser.images)) >= 0.8)
    add_check(17, "Accessible Images (Alt Text)", alt_ratio_ok, 4, "Provide descriptive alt tags for key landing page imagery and icons.", "Accessibility")

    # 18. Image Dimensions
    images_with_dims = [img for img in parser.images if img["width"] and img["height"]]
    dims_ok = (len(parser.images) == 0) or (len(images_with_dims) / max(1, len(parser.images)) >= 0.7)
    add_check(18, "CLS Prevention (Image Dimensions)", dims_ok, 4, "Specify explicit width and height on image tags to prevent jarring layout shifts.", "Performance")

    # 19. Clear Value Proposition
    val_prop_ok = len(parser.h1_tags) > 0 and len(parser.h1_tags[0].split()) >= 4
    add_check(19, "Compelling Headline Length & Substance", val_prop_ok, 5, "Craft an H1 headline with a concrete promise or transformation (6-12 words ideal).", "Copywriting & Clarity")

    # 20. Urgent or Scarcity Element
    has_urgency = any(w in full_text for w in ["limited", "exclusive", "today only", "spots left", "bonus", "expires", "save %"])
    add_check(20, "Ethical Urgency / Value Incentive", has_urgency, 3, "Consider adding a subtle urgency cue (e.g. limited cohort spots, time-limited discount).", "Conversion Strategy")

    total_possible = sum(c["weight"] for c in checks)
    total_earned = sum(c["score"] for c in checks)
    percentage = round((total_earned / total_possible) * 100, 1)

    grade = "A (High-Converting)" if percentage >= 85 else ("B (Good / Launch-Ready)" if percentage >= 70 else ("C (Needs Polish)" if percentage >= 55 else "D (Sub-Optimal)"))

    return {
        "summary": {
            "overall_score": percentage,
            "grade": grade,
            "passed_checks": len([c for c in checks if c["status"] == "PASS"]),
            "total_checks": len(checks),
            "points_earned": total_earned,
            "total_points": total_possible
        },
        "checks": checks
    }


def main():
    arg_parser = argparse.ArgumentParser(description="Run a 20+ point conversion optimization audit on landing page HTML.")
    arg_parser.add_argument("file", help="Path to HTML file to evaluate")
    arg_parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = arg_parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: File {args.file} not found.", file=sys.stderr)
        sys.exit(1)

    with open(args.file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    results = run_conversion_audit(content)

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        s = results["summary"]
        print("\n" + "=" * 70)
        print("  LANDING PAGE CONVERSION AUDIT CHECKLIST (2025-2026 STANDARDS)")
        print("=" * 70)
        print(f"  Target File:     {args.file}")
        print(f"  Overall Score:   {s['overall_score']}% - {s['grade']}")
        print(f"  Checks Passed:   {s['passed_checks']} / {s['total_checks']} ({s['points_earned']}/{s['total_points']} pts)")
        print("-" * 70)

        categories = {}
        for c in results["checks"]:
            categories.setdefault(c["category"], []).append(c)

        for cat, items in categories.items():
            print(f"\n  [{cat.upper()}]")
            for item in items:
                status_icon = "✓ PASS" if item["status"] == "PASS" else "✗ FAIL"
                print(f"  {status_icon} | {item['name']}")
                if item["status"] == "FAIL":
                    print(f"          -> {item['advice']}")

        print("\n" + "=" * 70 + "\n")


if __name__ == "__main__":
    main()
