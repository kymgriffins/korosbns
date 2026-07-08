# Budget Hub Component Architecture

```
src/components/budget-hub/
├── tokens/
│   └── types.ts                 # Shared prop types
├── layout/
│   ├── budget-hub-shell.tsx     # Top nav + main + mobile nav slot
│   └── budget-hub-page.tsx      # Max-width editorial canvas
├── navigation/
│   └── budget-hub-top-nav.tsx
├── hero/
│   └── budget-hub-hero.tsx
├── search/
│   └── budget-hub-search.tsx
├── filters/
│   └── category-pills.tsx
├── cards/
│   ├── featured-card.tsx
│   ├── article-card.tsx
│   └── journey-card.tsx
├── article/
│   ├── article-reader.tsx
│   ├── article-hero.tsx
│   ├── article-body.tsx
│   ├── metadata-row.tsx
│   └── reading-progress.tsx
├── sections/
│   ├── section-header.tsx
│   ├── newsletter-section.tsx
│   └── budget-hub-footer.tsx
├── states/
│   ├── hub-skeleton.tsx
│   ├── empty-state.tsx
│   └── not-found.tsx
└── pages/
    ├── budget-hub-landing.tsx
    └── budget-hub-article-page.tsx

src/components/learn/legacy/       # DEPRECATED presentation
└── README.md + moved view components
```

## Data Boundaries

| Layer | Owns |
|-------|------|
| **Budget Hub UI** | Layout, typography, motion, composition |
| **Existing data** | `contentData`, `learningData`, `useLearn`, `useAuth` |
| **Routes** | Unchanged `/learn/*` |
| **Runtime** | Unchanged contexts and progress libs |

## Import Rule

Pages import from `@/components/budget-hub/pages/*` only.  
Legacy learn views import only from `@/components/learn/legacy/*` for non-migrated tabs.
