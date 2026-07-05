# Zero-Gap QA Checklist

Page: [name]  ·  Page Spec: [link]  ·  Reviewer: [name]  ·  Date: [date]

A page cannot move to "Shipped" until every box is checked against its own Page Spec — not against general judgment.

## States
- [ ] Loading state implemented and matches spec
- [ ] Empty state implemented and matches spec
- [ ] Populated/happy-path state implemented and matches spec
- [ ] Error (network) state implemented and matches spec
- [ ] Error (validation) state implemented and matches spec
- [ ] Permission-denied state implemented and matches spec (if applicable)
- [ ] All domain-specific states from the spec implemented

## Components
- [ ] Every component traces to a Component Decision Tree step (no unexplained custom components)
- [ ] No raw hex colors in feature code (semantic tokens only)
- [ ] No arbitrary Tailwind values outside the logged exception list
- [ ] Forms use react-hook-form + zod + shadcn Form primitives
- [ ] Async lists implement loading/empty/error, not just populated
- [ ] Any new composition documented in `/components/patterns/`

## Motion
- [ ] Every animated interaction maps to a Section 5 motion token
- [ ] No hardcoded ms/easing values in component code
- [ ] `prefers-reduced-motion` fallback present and tested

## Responsive
- [ ] Verified at sm breakpoint
- [ ] Verified at md breakpoint
- [ ] Verified at lg breakpoint
- [ ] Verified at xl breakpoint

## Accessibility
- [ ] Full keyboard-only pass completed
- [ ] Screen reader labels present on all icon-only controls
- [ ] Contrast ratios verified (text/background)
- [ ] Focus order matches spec
- [ ] Automated a11y scan (axe-core/Lighthouse) passes with no critical issues

## Data & Edge Cases
- [ ] Null/missing field behavior verified against spec, not assumed
- [ ] Zero-results case tested
- [ ] Max/pagination boundary tested
- [ ] Slow/failed network mid-interaction tested

## Exit Points
- [ ] Every exit point in the spec is wired
- [ ] Every exit point tested end-to-end

## Final Gate
- [ ] Page Spec's own Section 12 sign-off is complete
- [ ] No open questions remain unresolved
- [ ] Reviewer confirms: this page has zero unanswered "what happens here?" questions

Signed off by: ______________________
