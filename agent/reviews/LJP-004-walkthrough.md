# LJP-004 Walkthrough — sticky CTA / safe area

```yaml
capability: CAP-course-detail
date: 2026-07-08
kind: device_browser_checklist
status: pending_human
platform_changes: 0
```

## Checklist (human / agent browser)

Route: `/learn/courses/kenya-budget-fundamentals`

### Desktop (≥1024)

- [ ] 60/40 hero; CTA in hero only
- [ ] No sticky bar (`lg:hidden`)
- [ ] One black primary CTA

### Mobile / narrow (&lt;1024)

- [ ] Stacked hero
- [ ] Scroll until hero CTA leaves viewport → sticky Continue appears
- [ ] Sticky sits above bottom nav (`--mobile-nav-height`) + `safe-area-inset-bottom`
- [ ] Sticky does not cover bottom nav labels
- [ ] Opening… state on tap
- [ ] Reduced motion: no jarring sticky animation

### ProgressBar

- [ ] Fill is success green (`LMS_COLORS.reference.success`), not theme primary purple/black

### Gate 1 (parallel — lesson, not this screen)

- [ ] Lesson walkthrough separate (`runtime_stage: validated` still waits Gate 1)

## Agent note

Automated browser pass attempted when local dev server available; otherwise leave boxes for human sign-off before CAP-005 merge discipline.

Dirty tree: isolate unrelated marketing/sample edits before CAP-005 implementation commits.
