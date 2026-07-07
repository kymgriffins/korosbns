# Screen Inventory
## LMS — All routes and their contracts

Every row must have a **Screen Contract** before implementation is accepted.

---

## Hub tier (Blueprint A)

| ID | Route | Screen name | Contract | Status |
|----|-------|-------------|----------|--------|
| H1 | `/learn` | Home | `screen-contracts/home.md` | Specified |
| H2 | `/learn/catalogue` | Course Catalogue | `screen-contracts/catalogue.md` | Specified |
| H3 | `/learn/progress` | Progress | `screen-contracts/progress.md` | Specified |
| H4 | `/learn/achievements` | Achievements | `screen-contracts/achievements.md` | Specified |
| H5 | `/learn/profile` | Profile | `screen-contracts/profile.md` | Specified |

---

## Flow tier

| ID | Route | Screen name | Contract | Blueprint | Status |
|----|-------|-------------|----------|-----------|--------|
| F1 | `/learn/courses/[slug]` | Course Detail | `screen-contracts/course-detail.md` | B | Specified |
| F2 | `/learn/courses/.../modules/[slug]` | Module Overview | `screen-contracts/module-overview.md` | C | Specified |
| F3 | `/learn/courses/.../lessons/[slug]` | Lesson | `screen-contracts/lesson.md` | D | Specified |

---

## Utility tier (Blueprint E)

| ID | Route | Screen name | Contract | Status |
|----|-------|-------------|----------|--------|
| U1 | `/learn/search` | Search | `screen-contracts/search.md` | Specified |

---

## Adjacent tier (Blueprint F)

| ID | Route | Screen name | Contract | Status |
|----|-------|-------------|----------|--------|
| A1 | `/learn/account` | Account Settings | Out of LMS spec — `frontend-auth.md` | Adjacent |
| A2 | `/learn/account/password` | Password | Adjacent | Adjacent |
| A3 | `/learn/account/notifications` | Notifications | Adjacent | Adjacent |
| A4 | `/learn/account/sign-out` | Sign Out | Adjacent | Adjacent |

---

## Forbidden screens (do not implement)

| Route pattern | Reason |
|---------------|--------|
| `/learn/videos` | Law 7 — video lives in lesson |
| `/learn/forum` | Out of product scope |
| `/learn?tab=*` | IA anti-pattern — use real routes |
| `/learn/quiz/*` | Law 8 — trivia overlays lesson |
| `/learn/paths/*` | Replaced by `/learn/courses/*` |

---

## Screen count summary

| Tier | Count |
|------|-------|
| Hub | 5 |
| Flow | 3 |
| Utility | 1 |
| **LMS total** | **9** |

---

## Future screens (v2 — contract required before build)

| Screen | Route (proposed) | Notes |
|--------|------------------|-------|
| Certificate | `/learn/courses/[slug]/certificate` | Post-completion |
| Notes | `/learn/profile/notes` | Time-linked notes |
| Course reviews | Section on Course Detail | Collapsed by default |
