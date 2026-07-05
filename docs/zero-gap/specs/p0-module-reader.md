# Page Spec: Module Reader (`/learn/[slug]`)

Parent PRD: [learn-hub](../prd/learn-hub.md) · Status: `QA'd`

## Purpose
Read a single budget-literacy article, story, or trivia quiz in a focused reader view.

## Users & Entry Points
- Who arrives here: All site visitors (citizens, students, researchers)
- Entry points: Learn Hub module list, curriculum path, document links, direct URL, search results, forum discussion links, article-to-article navigation

## Primary Action
Read/understand the budget content and optionally discuss it or proceed to the next section.

## States

| State | What's shown | What's interactive | What's disabled/hidden |
|-------|-------------|-------------------|----------------------|
| Loading | `Loader2` spinner centered on screen + "Loading content..." caption | None | All content |
| Empty | N/A — reader always has content by slug resolution | N/A | N/A |
| Populated — article | Hero image, breadcrumbs, title, author, body (HTML or text), article actions, discussion section, prev/next navigation | Scroll reading, article actions (share/bookmark), discussion expand, prev/next links | N/A |
| Populated — story | Fullscreen card deck with progress bar, emoji/title/content per card, prev/next buttons, close button | Card swipe/navigation, Finish Story on last card | Prev button on first card |
| Populated — trivia | Title, quiz questions + options, score tracking | Answer selection, submit | N/A |
| Error — not found | `HelpCircle` icon, "Unavailable" heading, error message, "Back to Learn Hub" CTA | Back to Learn Hub button | All content |
| Error — network | Retry prompt via `useContentForSlug` fallback | Retry | Content sections |
| Permission-denied | N/A — all content is public | N/A | N/A |

## Data Contract

| Field shown | Source | Type | Behavior if null/missing |
|------------|--------|------|-------------------------|
| Article title | API `/content/articles/:slug/` | string | Show slug as fallback |
| Article body | API `/content/articles/:slug/` | string (HTML or markdown) | Show snippet/placeholder |
| Hero image | API `metadata.hero_image` | URL string | Show gradient placeholder from `articlePlaceholderForSlug` |
| Author name/avatar | API `article.author` | object | Hide author block |
| Published date | API `article.published_at` | ISO date string | Hide date |
| Story cards | API `story.body` | JSON string → array | Show empty state |
| Trivia questions | API trivia set | `TriviaSetApi` | Show "No quiz data" |
| Learning context | API `article.learning_context` | object | Show standalone reader, no prev/next nav |
| Breadcrumbs | Derived from learning context | array | Single "Home → Learn" fallback |

## Component Map

| UI element | Component used | Decision tree step | Notes |
|-----------|---------------|-------------------|-------|
| Page shell | `Wrapper` | 1 (primitive) | Global wrapper |
| Loading state | `Loader2` + motion | 1 (primitive) | Uses `scaleIn` variant |
| Error state | Custom card | 2 (composition) | Button + HelpCircle + card |
| Breadcrumbs | `PageBreadcrumbs` | 1 (primitive) | From shadcn patterns |
| Hero image | `HarmonizedImage` | 4 (custom) | Existing component with fallback |
| Article body | `renderArticleBody` | 4 (custom) | Render HTML/markdown safely |
| Story card deck | Custom composition | 2 (composition) | AnimatePresence + card + progress |
| Trivia quiz | `TriviaQuiz` | 2 (composition) | From citizen components |
| Article actions | `ArticleReaderActions` | 4 (custom) | Share/bookmark actions |
| Discussion | `ModuleForum` | 2 (composition) | Collapsible `<details>` |
| Prev/next nav | Link + Card | 2 (composition) | From learning context |

## Motion Spec

| Interaction | Motion token (Section 5) | Notes |
|------------|-------------------------|-------|
| Loading spinner | `motion.micro` | Scale in |
| Error fade in | `motion.enter` | `fadeInUp` variant |
| Story card transition | `motion.enter` | Scale + opacity with AnimatePresence |
| Story progress bar | `motion.layout` | Spring animation |
| Article hero scale | `motion.enter` | `scaleIn` variant |
| Page load | `motion.route` | Route transition |

Reduced-motion fallback confirmed: ☐

## Responsive Behavior

| Breakpoint | Layout change | Notes |
|-----------|---------------|-------|
| sm (mobile) | Single column, 4px padding, stacked author info | Fullscreen story covers viewport |
| md (tablet) | 6px padding, wider hero, two-col prev/next | Story progress bar remains |
| lg (desktop) | max-w-3xl centered reader, full author layout | Breadcrumbs visible |
| xl (wide) | Same as lg | Content width capped at 3xl |

## Accessibility

- Focus order: Skip to content → breadcrumbs → hero → title → body → discussion → prev/next
- ARIA roles needed beyond native semantics: `role="progressbar"` on story progress, `aria-label` on close button
- Keyboard-only path verified: ☐
- Contrast check (text/background) verified: ☐
- Icon-only controls have accessible labels: ☐

## Edge Cases

| Edge case | Expected behavior |
|-----------|------------------|
| Extremely long article body | Scroll normally; line-height 1.6 for readability |
| Zero results (slug not found) | Error state with "Back to Learn Hub" CTA |
| Max results / pagination boundary | Prev/next nav hides when no context sections |
| Slow/failed network mid-interaction | Loading spinner first; `useContentForSlug` retries; server-side ISR fallback |
| Permission changes mid-session | N/A — public content |
| Story with 1 card | Show as single card, progress bar at 100%, "Finish Story" button |

## Exit Points

| From | To | Trigger |
|------|-----|---------|
| Error state | `/learn` | "Back to Learn Hub" button click |
| Reader header | `/learn` | Browser back, breadcrumb link |
| Article body | Next article `/learn/[next_slug]` | "Next section" link |
| Article body | Previous article `/learn/[prev_slug]` | "Previous section" link |
| Story last card | `/learn` | "Finish Story" button click |
| Trivia complete | `/learn` | "Back to Learn Hub" link |
| Discussion section | Forum thread | Reply link |

## Sign-off

- [x] Matches parent PRD scope
- [x] All states filled (no blanks)
- [x] Component Decision Tree followed for every element
- [ ] Motion tokens used, no invented values
- [ ] Ready for Gate 4 (Build)
