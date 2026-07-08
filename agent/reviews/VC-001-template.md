# VC-001 — Visual Critic Report

```yaml
id: VC-001
capability: CAP-XXX
date: 2026-07-08
status: PASS | FAIL
threshold: 90
platform_changes: 0
```

## Visual Capture

- [ ] desktop (1440)
- [ ] tablet (1024)
- [ ] mobile (390)
- [ ] before/after for each changed shared component

Artifacts:

```yaml
screenshots:
  - design-baseline/JourneyHero/desktop.png
  - design-baseline/JourneyHero/tablet.png
  - design-baseline/JourneyHero/mobile.png
before_after:
  - design-baseline/JourneyHero/before.png
  - design-baseline/JourneyHero/after.png
```

## Score Matrix

| Category | Weight | Score |
|----------|-------:|------:|
| Editorial Rhythm | 20 | 0 |
| Hierarchy | 20 | 0 |
| Typography | 15 | 0 |
| Card Family | 15 | 0 |
| Civic Warmth | 10 | 0 |
| RX-001 Similarity | 10 | 0 |
| Family Test | 10 | 0 |
| **Total** | **100** | **0** |

Pass criteria:

- total >= 90
- FT1–FT5 all pass
- Visual Drift <= 5%

## Visual Drift

```yaml
visual_drift:
  spacing: 0
  typography: 0
  hierarchy: 0
  imagery: 0
  tokens: 0
  rhythm: 0
  threshold: 5
  result: PASS | FAIL
```

## CQI Updates

```yaml
cqi:
  JourneyHero: 0
  ContinueCard: 0
  JourneyCard: 0
  AchievementCard: 0
  SectionHeader: 0
```

## Decision

```yaml
critic_signoff: PASS | FAIL
merge_allowed: true | false
```

