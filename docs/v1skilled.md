# `/learn` design spec — the Chamber system

**Purpose of this doc:** turn the audit's P0–P3 findings into one coherent design logic, so every screen is a variation of the same idea instead of a separate decision. No code — this is the system the code should express.

---

## 1. The one idea everything else derives from

Your subject is not "courses." It's **a citizen working through an official process** — the Finance Bill, BPS/BROP, public participation — one document, one step, one hearing at a time. The audit's own tokens already know this (`--learn-chamber-ink`, `--learn-seal-gold`, `--learn-vote-green`) but the surrounding UI (sidebar menus, XP bars, leaderboard grids) is borrowed from a generic ed-tech dashboard and doesn't share that idea.

**Design thesis:** `/learn` is not a course catalog with a gamification layer bolted on. It's **a citizen's dossier moving through a civic process**, and gamification is the paper trail that process leaves behind — stamps, seals, a case file — not XP bars.

Every decision below is a test against that thesis: does this read as "progressing through a real civic process," or does it read as "generic ed-tech dashboard"? Where the audit already has the right instinct (Chamber hero, dossier profile, seal/stamp language), this doc extends it into a full system. Where it's still borrowing ed-tech defaults (leaderboard grid, quest cards, streak/XP hero), this doc replaces the pattern, not just the copy.

---

## 2. Information architecture: one spine, lanes hang off it

Collapse the three parallel systems (`LearnHubLayout` sidebar menu, `LearnTabPage` marketing lists, `ModuleDetailView`/`StageDetailDrawer` reader) into **one spine with one reader**.

```
/learn                    → Chamber (resume-first home)
/learn/modules/[slug]     → THE reader (route only — drawer deprecated)
/learn/[slug]             → THE reader, for article/trivia/story content
/learn/forum              → a lane, same width, same chrome
/learn/documents          → a lane, same width, same chrome
/learn/profile            → the dossier
```

**Rule:** there is exactly one reader component and exactly one lane-list pattern. Every content type (module, article, video, trivia, story) renders inside the same `LearnStage` shell with a content-type-specific body. This is the single highest-leverage fix in the whole audit — it's what makes seven components feel like one product instead of three.

**Navigation is progress-first, not menu-first.** Replace the admin-style collapsible sidebar with a **path rail**: a vertical or horizontal spine showing where the citizen is in the current fiscal-year journey (BPS → BROP → Finance Bill → Public Participation), with lanes (Forum, Documents, Profile) as a secondary, visually quieter row — not equal-weight nav items. Right now the sidebar treats "Modules" and "Forums" as siblings; they aren't. One is the spine, the rest are rooms off the corridor.

---

## 3. The Chamber hero (dashboard, P1)

Single-thesis hero, not a widget grid. One primary object on the page:

> **"Continue Step 4 of Finance Bill 2026"** — with a document-page visual (not a progress bar), showing the step title, a one-line "what you'll do," and a single Continue action.

Everything else on today's dashboard (leaderboard, daily quests, published tasks, stats grid) drops to a **secondary rank**, visually smaller and below the fold or in a slim horizontal strip — never competing with the hero for weight. Streak and rank get a small chip near the hero (not a full XP bar card), because a bar is a game-UI convention; a citizen dossier doesn't need one.

**Kill:** the Duolingo-style filled hero card with an XP bar. That pattern says "app to build a habit," and this product's job is "advance one civic step," which is a different promise.

---

## 4. The reader (P0, P1) — document, not app chrome

This is your strongest existing UX (per the audit) — the fix is to stop surrounding it with Card/Separator dashboard chrome and let it be what it already almost is: a document.

- **Chrome reduces to two things:** a breadcrumb-style progress indicator (e.g. "Step 4 of 9 — Finance Bill 2026") and an XP/Sovereigns chip. No sidebar, no nav, full-viewport centered column at `--learn-stage-width: 42rem`.
- **Background shifts by content mode:** `--learn-chamber-ink` (dark) for the immersive read/watch view, `--learn-chamber-paper` (warm paper) for text-heavy chapters. This is the one place a background color change is meaningful rather than decorative — it marks "you've entered the reading room."
- **Step transitions get the one animation budget you should spend:** a document page-turn, not a fade or slide. This is the audit's own P3 idea ("step-complete stamp animation") — extend it to *every* step change, not just completion, so the whole reader feels like turning pages in a document rather than swiping app screens.
- **Quiz/trivia completion:** one celebration beat, not a stack of toasts. A stamp or seal graphic (using `--learn-seal-gold`) that appears once per completion — this is your gamified moment, and it should feel like an official mark being applied to the case file, not a confetti burst.

**Deprecate `StageDetailDrawer` entirely.** Every module open routes to `/learn/modules/[slug]?step=n`. Two implementations of the same reader is the single largest source of the "three products" feeling — collapsing this pays for itself before any visual polish work does.

---

## 5. Content lanes (articles, videos, stories, quests, documents, forum)

Right now these are a third layout family (`LearnTabPage`: grid + duplicate right sidebar). Fold them into **one lane pattern**, reused everywhere:

- Same `LearnStage` width as the reader — no separate `max-w-6xl` grid with its own sidebar.
- **Drop the right sidebar entirely** (trending/daily-quest widgets). It duplicates hub nav and is the clearest "bolted-on" tell in the current build. If trending content matters, it becomes a slim horizontal strip *inside* the lane, not a persistent second column.
- Each lane gets exactly one piece of contextual framing tying it back to the spine: documents show "prerequisite for Step 4," quests show "unlocks after BROP module," forum threads show which chapter they're attached to. This is what turns "here's a list of stuff" into "here's how this fits your civic process" — directly answering the audit's finding that documents and quests "feel disconnected from the learning path."

**Quests specifically:** cards must show the prerequisite module and the Sovereigns reward up front — not buried. A quest with no visible stake is just another card in a grid.

---

## 6. Gamification vocabulary — one system, used consistently

The audit already caught the drift (XP/points/sovereigns/level used interchangeably) and named the fix (`SOVEREIGN_LABEL = "Sovereigns"`, `SVG`). Extend that discipline to the *visual* vocabulary, not just copy:

| Concept | Visual language | Not this |
|---|---|---|
| Currency earned | Coin/seal glyph, `--learn-seal-gold`, labeled "Sovereigns (SVG)" everywhere, no silent aliasing to "points" | XP bars, level-up modals |
| Step/chapter complete | Wax-seal stamp animation | Toast notification |
| Badge | An actual seal on a document (profile = dossier), tied to *which step earned it* | Generic icon grid |
| Streak | Small chip near hero: "6-day streak" | Duolingo flame + big card |
| Leaderboard | Present, but secondary — a lane, not dashboard-primary | Widget competing with hero |

**Certificates and badges must always answer "which step of which fiscal year earned this,"** not just display as a trophy case. That's the difference between a dossier and a generic profile — it's also the thing your third conversation turn identified as the differentiator for this whole product category (proving comprehension, not just collecting badges).

---

## 7. Profile → citizen dossier (P2)

Reframe entirely away from "settings-app profile":

- Lead with a **timeline of the fiscal-year journey**, seals placed at the step where each badge was earned — not a stats grid up top.
- Certificates render as **issued documents** (title, fiscal year, date, a seal), not cards in a trophy shelf.
- Account settings (`/learn/account/*`) stay functionally separate but should visually inherit the Chamber palette — right now they read as a generic settings app with no relationship to the rest of `/learn`, which is its own small fragmentation the audit didn't flag but is worth fixing in the same pass.

---

## 8. Motion system (P1)

One rule: **motion should mean something civic, or it shouldn't run.**

- Page-turn on reader step change — meaningful (advancing through a document).
- Stamp/seal appear on completion — meaningful (official mark applied).
- Dashboard widget stagger-on-enter — **cut.** It's decorative and it's exactly the kind of scattered ambient motion that reads as templated rather than intentional.
- `prefers-reduced-motion` respected globally, once, at the shell level — not per-component as today. This is a one-line fix with outsized trust impact for a civic-literacy product where some users will have accessibility needs the app should visibly respect.

---

## 9. Typography (P2)

Three roles, mapped to the Chamber metaphor rather than generic UI hierarchy:

- **Display** (step titles, hero headline) — should read like a document masthead, restrained, used only at the top of a stage.
- **Body** (chapter text, article reader) — real reading measure inside `--learn-stage-width`, comfortable line-height; this is a literacy product, reading comfort is not optional polish.
- **Utility/numeric** (step counters, XP chip, dates, leaderboard ranks) — a tabular/mono-leaning face so numbers in the dossier feel like case-file data, not app stats.

---

## 10. Empty & error states (P2) — budget-themed, not generic

The audit flags generic error copy ("Failed to load modules") for civic-specific replacement. Extend that logic to empty states as a category:

- No forum threads yet → "No questions filed yet on this chapter." (case-file language, not "nothing here!")
- No documents → tie to *why*: "Documents for FY2026 haven't been published yet" rather than a blank folder icon.
- Failed fetch → always actionable ("Check connection and try again"), never just a sad-state illustration with no next step.

This matters more here than in a typical app because the underlying subject (government process, document availability) has real reasons content might be missing — the copy should reflect the domain, not paper over it with generic SaaS empty-state language.

---

## 11. Rollout, mapped to your existing priorities

This doesn't change your P0–P3 order — it just makes each priority internally consistent with the Chamber thesis so nothing gets built twice:

- **P0** — Single `LearnStage`, one reader (kill the drawer), one nav model (path rail, not menu sidebar), canonical Sovereigns/SVG copy *and* iconography.
- **P1** — Chamber hero (single-thesis, resume-first), drop the second sidebar everywhere it appears (dashboard right rail + lane right rail are two separate instances of the same mistake), global `prefers-reduced-motion`.
- **P2** — Typography roles as above, dossier profile, budget-themed empty/error states throughout, quest cards showing prerequisite + reward.
- **P3** — Stamp/seal animation extended from "completion only" to the full step-turn interaction; this is genuinely last because it's the finishing layer on a structure that needs to exist first.

The through-line: **P0 and P1 are entirely about collapsing three products into one system.** Everything in P2/P3 is about making that one system feel like it belongs to this specific civic subject rather than a generic ed-tech template. Do them in that order — polish on top of a fragmented structure will still feel fragmented.
