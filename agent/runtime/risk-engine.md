# Risk Engine
## Score every change before Builder runs

---

## Risk levels

| Level | Criteria | Scheduler action |
|-------|----------|------------------|
| `low` | Single file, leaf component, no shared deps | Auto proceed if confidence ≥ 85 |
| `medium` | 2–5 files, feature-local | Proceed + note in review |
| `high` | Shared component, 6+ files | Human approval recommended |
| `critical` | Shell, nav, theme, motion system, layout root | **Human approval required** |

---

## Scoring matrix

```yaml
factors:
  touches_learning_shell: +40
  touches_navigation: +30
  touches_layout_root: +25
  touches_shared_ui_primitive: +15
  touches_motion_system: +20
  touches_theme_tokens: +15
  touches_multiple_routes: +20
  new_component_no_contract: +50  # auto critical
  violates_navigation_law: +100   # block

thresholds:
  low: 0-19
  medium: 20-39
  high: 40-59
  critical: 60+
```

---

## LJP-001 pre-score

```yaml
item: LJP-001
changes:
  - file: src/app/(marketing)/learn/layout.tsx
    factor: layout_root (+25)
  - file: src/components/lms/lms-shell.tsx
    factor: learning_shell (+40)
  - file: src/components/lms/lms-nav.tsx
    factor: navigation (+30)
  - file: src/components/lms/shell/*
    factor: learning_shell (+40)
  - file: src/styles/lms.css
    factor: theme_tokens (+15)
  - file: src/components/ui/mobile-bottom-nav.tsx
    factor: shared_primitive (+15)  # read-only expected

raw_score: 165  # capped
normalized: critical
needs_approval: true
mitigation:
  - Refactor in place — no parallel shell
  - Shell-only tests before feature work
  - No lesson/course content in this item
```

---

## Output template

```yaml
risk_assessment:
  item: LJP-XXX
  level: low | medium | high | critical
  score: number
  touches: [files]
  shared_components: [names]
  needs_approval: boolean
  mitigation: [strings]
```

Builder **must not start** on `critical` until `user_approval: approved`.
