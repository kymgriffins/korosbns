#!/usr/bin/env python3
"""
CTA Analyzer
Analyzes CTA placement, copy strength, friction level, and consistency across the landing page.
"""

import argparse
import json
import os
import re
import sys
from html.parser import HTMLParser

STRONG_VERBS = {
    "get", "start", "claim", "build", "join", "try", "create", "unlock",
    "launch", "explore", "discover", "boost", "grow", "save", "book", "download"
}

WEAK_VERBS = {"submit", "click here", "send", "continue", "proceed", "go", "more info", "read more"}

RISK_REVERSAL_KEYWORDS = [
    "no credit card", "free trial", "cancel anytime", "guarantee", "money-back",
    "100% free", "no commitment", "instant access", "secure", "privacy guaranteed"
]

class CTAParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ctas = []
        self.current_tag = None
        self.current_attrs = {}
        self.current_text = []
        self.tag_depth = 0
        self.form_inputs_count = 0
        self.in_form = False
        self.full_text = []
        self.in_header_nav = False
        self.nav_links_count = 0

    def handle_starttag(self, tag, attrs):
        self.tag_depth += 1
        attr_dict = {k.lower(): (v or "") for k, v in attrs}

        if tag in ["nav", "header"]:
            self.in_header_nav = True

        if tag == "a" and self.in_header_nav:
            self.nav_links_count += 1

        if tag == "form":
            self.in_form = True
            self.form_inputs_count = 0

        if self.in_form and tag in ["input", "select", "textarea"]:
            itype = attr_dict.get("type", "text").lower()
            if itype not in ["hidden", "submit", "button"]:
                self.form_inputs_count += 1

        is_btn = tag == "button"
        is_link_cta = tag == "a" and any(c in attr_dict.get("class", "").lower() for c in ["btn", "button", "cta"])
        is_input_btn = tag == "input" and attr_dict.get("type", "").lower() in ["submit", "button"]

        if is_btn or is_link_cta or is_input_btn:
            self.current_tag = tag
            self.current_attrs = attr_dict
            self.current_text = []
            if is_input_btn:
                self.current_text.append(attr_dict.get("value", ""))

    def handle_data(self, data):
        clean = data.strip()
        if clean:
            self.full_text.append(clean)
            if self.current_tag:
                self.current_text.append(clean)

    def handle_endtag(self, tag):
        self.tag_depth -= 1
        if tag in ["nav", "header"]:
            self.in_header_nav = False

        if tag == "form":
            self.in_form = False

        if tag == self.current_tag:
            text = " ".join(self.current_text).strip()
            if text:
                self.ctas.append({
                    "tag": self.current_tag,
                    "text": text,
                    "href": self.current_attrs.get("href", ""),
                    "class": self.current_attrs.get("class", "")
                })
            self.current_tag = None
            self.current_attrs = {}
            self.current_text = []


def analyze_ctas(html_content):
    parser = CTAParser()
    parser.feed(html_content)

    all_page_text = " ".join(parser.full_text).lower()
    found_risk_reversals = [rr for rr in RISK_REVERSAL_KEYWORDS if rr in all_page_text]

    ctas_analyzed = []
    has_above_fold_cta = False

    for idx, cta in enumerate(parser.ctas):
        text = cta["text"]
        lower_text = text.lower()
        words = re.findall(r"\b[a-z]+\b", lower_text)
        first_word = words[0] if words else ""

        is_strong = first_word in STRONG_VERBS or any(v in lower_text for v in STRONG_VERBS)
        is_weak = any(w in lower_text for w in WEAK_VERBS)
        has_first_person = any(fp in lower_text for fp in ["my", "me", "i"])
        has_value = any(v in lower_text for v in ["free", "audit", "trial", "guide", "blueprint", "access", "instant"])

        strength_score = 50
        if is_strong: strength_score += 25
        if has_first_person: strength_score += 15
        if has_value: strength_score += 15
        if is_weak: strength_score -= 30
        strength_score = max(10, min(100, strength_score))

        placement = "Hero / Above-the-fold" if idx == 0 else ("Middle section" if idx < len(parser.ctas) - 1 else "Bottom / Closing")
        if idx == 0:
            has_above_fold_cta = True

        ctas_analyzed.append({
            "text": text,
            "placement": placement,
            "strength_score": strength_score,
            "is_benefit_driven": has_value or is_strong,
            "has_first_person": has_first_person,
            "is_weak_copy": is_weak
        })

    friction_factors = []
    if parser.form_inputs_count > 4:
        friction_factors.append(f"Form has {parser.form_inputs_count} fields (best practice is <= 4 fields)")
    if not found_risk_reversals:
        friction_factors.append("No risk-reversal cues found near CTAs (e.g. 'No credit card required', 'Cancel anytime')")
    if parser.nav_links_count > 3:
        friction_factors.append(f"{parser.nav_links_count} header navigation links detected (landing pages should remove navigation to minimize exit paths)")

    friction_level = "LOW" if len(friction_factors) == 0 else ("MEDIUM" if len(friction_factors) <= 2 else "HIGH")

    recommendations = []
    if not has_above_fold_cta:
        recommendations.append("Add a high-contrast primary CTA above the fold in the hero section.")
    if any(c["is_weak_copy"] for c in ctas_analyzed):
        recommendations.append("Replace generic CTA verbs (like 'Submit' or 'Click here') with benefit-driven action verbs (e.g. 'Start My Free Trial', 'Claim Your Audit').")
    if not found_risk_reversals:
        recommendations.append("Add risk reversal microcopy directly below the primary CTA button (e.g., '✓ No credit card required  ✓ 14-day free trial').")
    if parser.nav_links_count > 0:
        recommendations.append("Consider removing top navigation menu links to keep visitor focus strictly on the conversion goal.")

    return {
        "summary": {
            "total_ctas": len(ctas_analyzed),
            "has_above_the_fold_cta": has_above_fold_cta,
            "friction_level": friction_level,
            "risk_reversals_detected": found_risk_reversals,
            "header_exit_links": parser.nav_links_count,
            "form_fields": parser.form_inputs_count
        },
        "ctas": ctas_analyzed,
        "friction_factors": friction_factors,
        "recommendations": recommendations
    }


def main():
    arg_parser = argparse.ArgumentParser(description="Analyze CTA placement, copy strength, and friction on a landing page.")
    arg_parser.add_argument("file", help="Path to HTML file to evaluate")
    arg_parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = arg_parser.parse_args()

    if not os.path.exists(args.file):
        print(f"Error: File {args.file} not found.", file=sys.stderr)
        sys.exit(1)

    with open(args.file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    results = analyze_ctas(content)

    if args.json:
        print(json.dumps(results, indent=2))
    else:
        s = results["summary"]
        print("\n" + "=" * 60)
        print("  LANDING PAGE CTA & FRICTION ANALYZER")
        print("=" * 60)
        print(f"  Target File:            {args.file}")
        print(f"  Total CTAs Detected:    {s['total_ctas']}")
        print(f"  Hero / Above Fold CTA:  {'YES (Passing)' if s['has_above_the_fold_cta'] else 'NO (Critical Fix Required)'}")
        print(f"  Friction Level:         {s['friction_level']}")
        print(f"  Risk Reversals Found:   {', '.join(s['risk_reversals_detected']) if s['risk_reversals_detected'] else 'None detected'}")
        print(f"  Header Exit Links:      {s['header_exit_links']} links")
        print("-" * 60)
        print("  CTA BREAKDOWN:")
        for i, c in enumerate(results["ctas"], 1):
            print(f"  {i}. \"{c['text']}\"")
            print(f"     Placement: {c['placement']} | Strength: {c['strength_score']}/100")
        print("-" * 60)
        if results["recommendations"]:
            print("  ACTIONABLE RECOMMENDATIONS:")
            for i, rec in enumerate(results["recommendations"], 1):
                print(f"  {i}. {rec}")
        else:
            print("  All CTA best practices met!")
        print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
