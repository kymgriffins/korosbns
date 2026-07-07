# State Management Contract
## Learning Journey Platform — Where state lives

Agents must not debate store choice per PR. Use this table.

---

## 1. State taxonomy

| State type | Owner | Technology | Example |
|------------|-------|------------|---------|
| **Server / catalog data** | Server | RSC `getCourse()` props | Course, modules, lessons |
| **Server data (API phase)** | Server + client cache | TanStack Query | Enrollment, progress sync |
| **URL state** | URL | Next.js `params`, `searchParams` | `courseSlug`, filter query |
| **Form state** | Local | React Hook Form + Zod | Reflection text, search input |
| **Ephemeral UI** | Local | `useState` | Accordion open, active video part |
| **Lesson session** | Client persist | `sessionStorage` (v1) → server (v2) | Watched parts, trivia answers |
| **Global preferences** | Client persist | `localStorage` | Theme (existing app context) |
| **Auth session** | Server | Existing `auth-context` | Login state |
| **Animation** | Local | Motion `animate` / variants | Sheet open, accordion |
| **Toast feedback** | Global | Sonner | Save confirmation |

---

## 2. Decisions (immutable)

### Do use

| Need | Use |
|------|-----|
| Course catalog (current) | `src/data/lms/catalog.ts` + RSC props |
| Progress (future API) | TanStack Query + `queryKey: ['learn', 'progress']` |
| Trivia answer (session) | `useState` in `TriviaPopup` until submit |
| Which module is open | Accordion group context or controlled state in course page client wrapper |
| Continue enabled | Derived state: `partsWatched + triviaComplete` |

### Do not use

| Need | Avoid | Why |
|------|-------|-----|
| Catalog data | Zustand | Static/RSC phase |
| Form fields | useState spaghetti | Use RHF when > 2 fields |
| Server data | useEffect + fetch | Use RSC or TanStack Query |
| UI theme | New store | Use existing theme toggle |
| "Learn hub tab" | Context | Real routes per IA |

---

## 3. Lesson state machine (canonical)

```
idle
  → playing (video)
  → partEnded
  → triviaOpen (if configured)
  → triviaAnswered
  → reflectionOptional
  → continueEnabled
  → navigating (next part | next lesson)
```

Implement in `LessonExperience` (client). Page passes initial data only.

**Law 11:** Persist `partsWatched` and `triviaResults` to `sessionStorage` on change.

---

## 4. TanStack Query (API phase)

When backend exists:

```ts
// Query keys — centralized
export const learnKeys = {
  all: ['learn'] as const,
  progress: () => [...learnKeys.all, 'progress'] as const,
  course: (slug: string) => [...learnKeys.all, 'course', slug] as const,
  enrollment: (slug: string) => [...learnKeys.all, 'enrollment', slug] as const,
};
```

- `staleTime`: progress 30s, catalog 5m
- Mutations: optimistic for mark-complete
- Never fetch in `useEffect`

---

## 5. React Hook Form + Zod

Use when:

- Reflection with validation (v2)
- Account forms (existing)
- Search with debounce + schema (optional)

```ts
// schemas/learn/reflection.ts (future)
z.object({ text: z.string().min(1).max(280) })
```

---

## 6. Client component boundary

```
Server Page
  └── LessonExperience (client) ← all lesson state machine here
        ├── VideoPlayer
        ├── TriviaPopup
        ├── ReflectionCard
        └── ContinueButton
```

No `useState` in `VideoPlayer` for trivia — parent orchestrates via callbacks.

---

## 7. Escalation

New global store required?

1. Document in `decision-log.md`
2. Update this contract
3. Architecture review approval

**Default: no new store.**
