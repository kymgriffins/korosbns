# Component patterns (GOLDRULES §4 step 2)

Reusable compositions built from shadcn primitives. **Search here before building new UI.**

## Patterns (bootstrap — implement in Phase 0.5)

| Pattern | Purpose | States |
|---------|---------|--------|
| `AsyncListShell` | Lists with fetch | loading, empty, error, populated |
| `PageChrome` | Sticky header + back + title + actions | default |
| `EmptyStateShell` | Zero-data CTA block | empty |

## Adding a pattern

1. Compose from `components/ui/*` only.
2. Document props + a11y in file header comment.
3. Export from `index.ts`.
4. Reference in page spec component map (decision tree step 2).

## Promotion rule

Used on 2+ features → keep here. Used once → stay in `features/<domain>/components/` until promoted.
