# Layer conventions — UI / data / logic separation

Korosbns scales when **routes stay thin**, **data has one front door**, and **UI is dumb + reusable**. Every feature follows this layout.

---

## Directory map

```
src/
├── app/                    # Routes ONLY — compose features, no business logic
├── features/               # Domain UI (NEW) — e.g. features/tasks/, features/learn/
├── components/
│   ├── ui/                 # shadcn primitives — never import features
│   └── patterns/           # Composed patterns (GOLDRULES §4 step 2)
├── hooks/                  # Stateful logic, side effects, form wiring
├── lib/                    # API clients, pure transforms, schemas (zod)
├── data/                   # Static fixtures, mock loaders, registry maps
├── types/                  # Shared TypeScript contracts
└── motion/                 # Variants + motion-tokens only
```

---

## Rules

### 1. `page.tsx` (route shell)

**Allowed:** layout, metadata, suspense boundaries, pass `params` to a feature view.

**Forbidden:** `fetch` with transform logic, `useState` for form fields, inline API error handling beyond error boundary.

```tsx
// Good
export default function TaskDetailPage({ params }) {
  const { id } = use(params);
  return <TaskDetailFeature taskId={id} />;
}
```

**Target:** &lt; 80 lines per page file.

---

### 2. `features/<domain>/` (feature UI)

One folder per product area:

```
features/tasks/
├── task-detail-feature.tsx    # orchestrates hooks + patterns
├── task-board-feature.tsx
├── components/                # domain-only subcomponents
└── index.ts                   # public exports
```

- Imports: `components/patterns`, `components/ui`, `hooks`, `types`.
- Does **not** import another feature’s internals.

---

### 3. `lib/` (data access + pure logic)

| File type | Example | Responsibility |
|-----------|---------|----------------|
| API client | `lib/task-api.ts` | HTTP, auth headers, error mapping |
| Schema | `lib/task-schema.ts` | zod parse/validate |
| Transform | `lib/task-export.ts` | PDF/MD generation, no React |
| Policy | `lib/auth-policy.ts` | Pure permission checks |

**No React imports in `lib/`.**

---

### 4. `hooks/` (logic + React state)

| Hook | Example |
|------|---------|
| Data | `useTaskDetail(id)` — wraps taskApi, returns `{ data, error, isLoading, mutate }` |
| Form | `useTaskForm(task?)` — rhf + zod + submit handler |
| UI state | `useTaskBoardView()` — view mode, filters (no fetch) |

Hooks may call `lib/` and other hooks. They do **not** render JSX.

---

### 5. `components/patterns/` (shared UI compositions)

Document each pattern: props, states (loading/empty/error), a11y notes.

Promote here when used on **2+ features** (GOLDRULES §9).

---

### 6. `data/` (static / seed)

- Registry maps, transcript blobs, stage fallbacks (until API-only).
- Mark deprecated files with `@deprecated` and removal milestone in TASKPLAN.

---

## Data flow (one direction)

```
API / static JSON
      ↓
   lib/*-api.ts  (fetch + map to types)
      ↓
   hooks/*       (cache, loading, error, mutations)
      ↓
features/*       (compose patterns)
      ↓
   app/page.tsx  (shell)
```

---

## Forms (mandatory stack)

```
zod schema (lib/) → react-hook-form → shadcn Form → presentational fields
```

Migrate away from `useState` form blobs (e.g. `TaskForm`) per TASKPLAN Phase 2A.2.

---

## Testing placement

| Layer | Test location |
|-------|----------------|
| `lib/` | `src/lib/__tests__/` |
| `hooks/` | `src/hooks/__tests__/` |
| Features | colocated `*.test.tsx` or `features/*/__tests__/` |
| E2E | `e2e/` per P0 journey |

---

## PR checklist (copy into description)

- [ ] Page is thin shell; logic in hook or lib
- [ ] No new inline `style={{}}`
- [ ] No new arbitrary Tailwind without TOKEN-EXCEPTIONS entry
- [ ] Async UI uses loading + empty + error
- [ ] Page spec linked (P0/P1) or PRD exception noted
