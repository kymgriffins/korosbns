# Surface contracts — Moodle logic, Netflix play

**Problem we solve:** redesigning pages by vibe each time → shoddy hierarchy, duplicate CTAs, no way to A/B test.

**Method:** every screen is a **Surface**. A surface locks **what data** and **why it exists**. Only the **how** (presentation variant) is free to change for tests.

```
DATA (what)     → fixed fields + source (Next seed | Django | local events)
INTENT (why)    → one learning / civic job + success signal
PRESENT (how)   → named variants (tile-row | story-scroll | checklist | table-reveal | …)
```

Motion is allowed only if it changes knowledge or next action (true motion). Otherwise false.

---

## One-line product

**Moodle** for Kenya budget literacy (modules, checklist, mastery) + **fun motion** + **live budget numbers** that reveal emotionally on scroll — never a static PDF in a card.

---

## Design loop (gather → improve)

1. Ship Surface with variant `A` (default).
2. Collect: visit events, complete events, CTA clicks, “you now know” chips unlocked (local → sync).
3. Swap only `how.variant` to `B` / `C` — **same data contract**.
4. Keep the variant that raises the success signal; retire the rest.

No new “page invent” without a surface id.

---

## Surface card (fill before UI)

| Field | Rule |
|-------|------|
| `id` | stable slug, e.g. `learn.hub.continue` |
| `job` | one sentence: what the learner must do |
| `data[]` | each field: `key`, `source`, `required`, `fallback` |
| `why` | civic/learning outcome (not “looks nice”) |
| `success` | measurable (e.g. `started_module`, `answered_q`, `revealed_kpi`) |
| `how.variants[]` | ≥2 alternatives for testing |
| `how.default` | shipping variant |
| `emotion` | Discovery \| Focus \| Mastery \| Utility |
| `cognitive_load` | browse \| lesson \| assess |
| `anti` | forbidden chrome (duplicate Reports, fake 0% bars, …) |

---

## Content formats (how toolkit)

| Format | When to use | Kenya budget example |
|--------|-------------|----------------------|
| `tile-row` | Browse many items | Continue / Watch rails |
| `board` | Compare 3–6 items | Sector allocations board |
| `story-scroll` | Narrative beats | “How the BPS is born” |
| `short-slide` | One idea per screen | Cast quote / myth bust |
| `checklist` | Duolingo/Udemy progress | “I can name 4 BPS dates” |
| `table-reveal` | Stats with emotion | Scroll → row lights + meaning |
| `long-article` | Authored depth | Chapter with scroll sections |
| `podcast-chapter` | Long audio | 2h panel → chapter markers |
| `quiz-beat` | One question | Per-page trivia |

---

## Ownership (easy backend story)

| Data class | Owner | Why |
|------------|-------|-----|
| Catalogue, copy, KPIs for display, cast, video meta | **Next.js** (ISR + JSON fallback) | cPanel Django slow; hub never blanks |
| Auth, admin writes, profile identity | **Django** | Security / truth |
| Progress + XP preview | **Local events** → queue sync | Instant fun; Django later |

---

## Files

- Schema: [`schema.yaml`](./schema.yaml)
- Learn hub surfaces (v0): [`learn-hub.yaml`](./learn-hub.yaml)
- Progressive waves: `audit/PROGRESSIVE-UPGRADE.md`

Implementations bind to `surface.id` + `how.default`. Tests assert **data + success**, not pixel layout.
