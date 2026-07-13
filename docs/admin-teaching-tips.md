# Teaching tips (Admin + Learn)

Muteable guides for `/admin` and `/learn`.

## For learners (`/learn`)

- **Book icon** in the Learning Hub header (desktop) or next to the tip banner (mobile)
- **Mute all** / **Dismiss for this page** / **Restore dismissed**
- Stored separately as `bns_learn_teaching_v1` (does not affect admin tips)

## For operators (`/admin`)

- Same controls in the admin header
- Stored as `bns_admin_teaching_v1`

## Developers

| Piece | Path |
|-------|------|
| Admin catalog | `src/components/admin/teaching/teaching-catalog.ts` |
| Learn catalog | `src/components/admin/teaching/learn-teaching-catalog.ts` |
| Provider | `TeachingProvider` / `LearnTeachingProvider` / `AdminTeachingProvider` |
| Banner | `<PageTeachingBanner surface="learn" />` or default admin |
| Coachmarks | `<Teachable tipId title body>` |

Wire learn layout with `LearnTeachingProviderShell`. Keep `tipId` aligned with catalog `actions[].id` when possible.
