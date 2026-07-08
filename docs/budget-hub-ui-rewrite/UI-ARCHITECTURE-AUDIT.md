# Budget Hub — UI Architecture Audit

```yaml
program: Budget Hub UI Rewrite v1.0
branch: feature/budget-hub-ui-rewrite
status: pre-implementation
platform_changes: 0
reference: RX-001 (ADR-015) + product owner editorial brief
product_name: Budget Hub
scope: presentation_layer_only
```

> **Gate:** No component code until this audit is complete.  
> **Note:** The product-owner reference image is not stored in-repo; this audit reverse-engineers the *experience qualities* described in RX-001 and the execution brief (calm hierarchy, editorial rhythm, premium cards, invisible navigation).

---

## Experience Qualities (Why the reference feels right)

| Quality | Mechanism |
|---------|-----------|
| **Calm** | Low chrome density; one focal column; muted secondary text; no competing CTAs |
| **Effortless hierarchy** | Eyebrow → display headline → supporting copy → metadata; size + weight, not color noise |
| **Breathing room** | Section rhythm 64–96px desktop; 40–56px mobile; content max-width 1120px |
| **Premium cards** | Image-first, 12px radius, soft shadow on hover only, 4:3 / 16:9 crops, no heavy borders |
| **Scannable typography** | Geist; display 40–56px; body 17px / 1.7; metadata 13px muted |
| **Navigation disappears** | Sticky translucent top bar; bottom nav on mobile only; no desktop sidebar |
| **Whitespace works** | Asymmetric hero (copy left, image right); grid gutters 24px; featured span-2 |

---

## Component Inventory

### Navigation Bar

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Minimal, editorial — Stripe docs header |
| **Purpose** | Global wayfinding inside Learn; brand anchor |
| **Hierarchy** | Logo → primary links → search → avatar |
| **Interaction** | Sticky; blur backdrop; active link pill |
| **Motion** | 150ms opacity on scroll shadow; pill slide 200ms |
| **Spacing** | h-14; px-4 md:px-8; gap-6 |
| **Typography** | 14px medium links; logo wordmark semibold |
| **Radius** | Active pill `rounded-full` |
| **Shadow** | `shadow-sm` only after scroll |
| **Data** | Logo, Learn sections, search affordance, user avatar |
| **Responsive** | Links collapse to bottom nav on mobile; search icon |
| **A11y** | `nav` landmark; skip link; focus rings |
| **API** | `BudgetHubTopNav({ activeHref?, user? })` |

### Hero

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Cinematic magazine cover |
| **Purpose** | Establish editorial identity; surface featured story |
| **Hierarchy** | Eyebrow → H1 → summary → metadata row → CTA |
| **Interaction** | Primary CTA; optional secondary text link |
| **Motion** | Stagger fade-up 40px, 500ms ease-out |
| **Spacing** | py-16 md:py-24; gap-6; two-column lg |
| **Typography** | Eyebrow 12px uppercase tracking; H1 clamp(2.5rem,5vw,3.5rem) |
| **Radius** | Hero image `rounded-2xl` |
| **Shadow** | Image `shadow-lg` subtle |
| **Data** | Title, summary, category, read time, hero image, CTA href |
| **Responsive** | Stack image below copy on mobile |
| **A11y** | H1 single per page; CTA descriptive |
| **API** | `BudgetHubHero(props)` |

### Search Bar

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Calm utility — Notion filter |
| **Purpose** | Filter hub content instantly |
| **Hierarchy** | Icon + input; no heavy border |
| **Interaction** | Debounced filter; clear button |
| **Motion** | Focus ring expand 150ms |
| **Spacing** | h-11; px-4; max-w-md |
| **Typography** | 15px placeholder muted |
| **Radius** | `rounded-full` or `rounded-xl` |
| **Shadow** | None; border `border-border/60` |
| **Data** | Query string |
| **Responsive** | Full width mobile |
| **A11y** | `role="search"`; label sr-only |
| **API** | `BudgetHubSearch({ value, onChange, placeholder })` |

### Category Pills

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Lightweight filters |
| **Purpose** | Narrow articles/modules by topic |
| **Hierarchy** | Horizontal scroll row; active filled |
| **Interaction** | Single-select; keyboard arrows |
| **Motion** | Background color 200ms |
| **Spacing** | gap-2; py-1.5 px-3.5 |
| **Typography** | 13px medium |
| **Radius** | `rounded-full` |
| **Shadow** | None |
| **Data** | Category labels + counts optional |
| **Responsive** | Horizontal scroll with fade edges |
| **A11y** | `role="tablist"` / `tab` |
| **API** | `CategoryPills({ items, value, onChange })` |

### Featured Card

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Magazine cover — large, confident |
| **Purpose** | Highlight flagship story |
| **Hierarchy** | Image 60% → category badge → title → excerpt → metadata |
| **Interaction** | Entire card link; hover image scale 1.03 |
| **Motion** | Hover lift -2px; image zoom 500ms |
| **Spacing** | gap-5; p-0 (borderless) |
| **Typography** | Title 28–32px semibold |
| **Radius** | Image `rounded-xl` |
| **Shadow** | Hover `shadow-md` |
| **Data** | Image, title, excerpt, category, date, read time |
| **Responsive** | Full width; spans 2 cols in grid |
| **A11y** | Link wraps card; alt on image |
| **API** | `FeaturedCard({ item, href, size?: 'lg' })` |

### Article Card

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Editorial preview |
| **Purpose** | Browse articles in grid |
| **Hierarchy** | Image → title → excerpt → author row |
| **Interaction** | Hover lift + image zoom |
| **Motion** | Same as featured, subtler |
| **Spacing** | gap-4 |
| **Typography** | Title 20px; excerpt 15px muted |
| **Radius** | `rounded-lg` image |
| **Shadow** | None default |
| **Data** | Image, title, excerpt, author, read time, date |
| **Responsive** | 1 col mobile; 2–3 col desktop |
| **A11y** | Semantic article preview |
| **API** | `ArticleCard({ item, href })` |

### Journey Card

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Guided path invitation |
| **Purpose** | Surface learning modules as editorial journeys |
| **Hierarchy** | Difficulty pill → title → progress → CTA |
| **Interaction** | Card link to module |
| **Motion** | Progress bar animate on view |
| **Spacing** | p-6 |
| **Typography** | Title 18px semibold |
| **Radius** | `rounded-xl` |
| **Shadow** | `shadow-sm` |
| **Data** | Module title, steps, difficulty, progress % |
| **Responsive** | Stack in carousel mobile |
| **A11y** | Progress `aria-valuenow` |
| **API** | `JourneyCard({ module, progress? })` |

### Metadata Row

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Quiet supporting information |
| **Purpose** | Context without competing with headline |
| **Hierarchy** | Icon + label pairs in row |
| **Interaction** | Static; author link optional |
| **Motion** | None |
| **Spacing** | gap-4; text-sm |
| **Typography** | 13px muted |
| **Radius** | N/A |
| **Shadow** | N/A |
| **Data** | Read time, category, author, date |
| **Responsive** | Wrap on narrow screens |
| **A11y** | `time` element for dates |
| **API** | `MetadataRow({ items: MetadataItem[] })` |

### CTA (Primary)

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Confident but restrained |
| **Purpose** | Single primary action per viewport |
| **Hierarchy** | Filled button; black foreground per Learn law |
| **Interaction** | Hover elevation +1px |
| **Motion** | 150ms transform |
| **Spacing** | h-11 px-6 |
| **Typography** | 14px semibold |
| **Radius** | `rounded-full` |
| **Shadow** | Hover subtle |
| **Data** | Label, href |
| **Responsive** | Full width optional mobile |
| **A11y** | Focus ring; min 44px touch |
| **API** | `BudgetHubCta({ href, children, variant })` |

### Newsletter

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Low-pressure conversion |
| **Purpose** | Subscribe to budget updates |
| **Hierarchy** | Heading → copy → inline email + button |
| **Interaction** | Inline validation |
| **Motion** | Error shake 300ms |
| **Spacing** | py-16; max-w-xl centered |
| **Typography** | H2 24px; body muted |
| **Radius** | Input `rounded-full` |
| **Shadow** | Section subtle border-top |
| **Data** | Email field |
| **Responsive** | Stack input/button mobile |
| **A11y** | Label associated; error announced |
| **API** | `NewsletterSection()` — reuses existing signup hook |

### Footer

| Dimension | Specification |
|-----------|---------------|
| **Feels like** | Calm closure |
| **Purpose** | Secondary links + org info |
| **Hierarchy** | Logo → link groups → legal |
| **Interaction** | Minimal |
| **Motion** | None |
| **Spacing** | py-12; gap-8 |
| **Typography** | 13px muted links |
| **Radius** | N/A |
| **Shadow** | Border-top only |
| **Data** | Org links from site constants |
| **Responsive** | 2-col → 1-col |
| **A11y** | `footer` landmark |
| **API** | `BudgetHubFooter()` |

### Loading / Empty / 404

| Component | Behavior |
|-----------|----------|
| **Loading Skeleton** | Pulse blocks matching card geometry; no layout shift |
| **Empty State** | Illustration-free; dashed border; single CTA |
| **404 / No Results** | Calm message; return to Budget Hub |

---

## Summary Table (Brief Format)

| Component | Feels like | Purpose | Data shown | Interaction |
|-----------|------------|---------|------------|-------------|
| Navigation | Minimal, editorial | Global navigation | Logo, sections, search, profile | Sticky, subtle hover, active pill |
| Hero | Cinematic, premium | Highlight primary content | Title, summary, metadata, CTA, image | Primary focus, gentle motion |
| Search | Calm utility | Find content quickly | Query input | Instant filtering |
| Category Pills | Lightweight filters | Narrow content | Categories | Single-select active state |
| Featured Card | Magazine cover | Highlight important stories | Image, title, excerpt, metadata | Entire card clickable |
| Article Card | Editorial preview | Browse articles | Image, title, excerpt, author, time, date | Hover lift + image zoom |
| Metadata Row | Quiet information | Support the article | Read time, category, author, date | Static, accessible semantics |
| CTA | Confident, restrained | Primary action | Action label | Subtle elevation on hover |
| Newsletter | Low-pressure conversion | Subscribe | Email + CTA | Inline validation |
| Footer | Calm closure | Secondary navigation | Links, org info | Minimal interaction |

---

## Layout Architecture

```
BudgetHubShell
├── BudgetHubTopNav (sticky)
├── main (flex-1, editorial canvas)
│   └── BudgetHubPage (max-width + rhythm)
│       ├── sections...
└── LearnMobileNav (existing — navigation law preserved)
```

**Deprecated (legacy):** `AppSidebar`, `LearnDashboardView`, dashboard card grids, `learn-sidebar` on list pages.

---

## Acceptance

- [x] Every visible component documented before implementation
- [x] RX-001 qualities mapped to mechanisms
- [x] Reusable API named per component
- [ ] VC-001 score ≥ 95 (post-implementation)
- [ ] Screenshot evidence (post-implementation)
