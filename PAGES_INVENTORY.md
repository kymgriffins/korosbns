# Site Pages Inventory: Marketing, Learn & Reports

**Git Branch:** `mobile-app-ui-design`  
**Base Branch:** `main`  
**Repository:** `korosbns` (`src/app/(marketing)`)

This document lists all the `/learn`, Marketing, and Reports pages in the `BudgetNdioStory` codebase (`korosbns`), structured for mobile UI/UX design optimization following the `mobile-app-ui-design` specification.

---

## 1. Learning Portal Pages (`/learn`)

The `/learn` section contains 25 distinct page routes handling course discovery, interactive lessons, gamification, and learner profiles.

| # | Route | File Location | Description & Mobile UI Context |
|---|-------|---------------|----------------------------------|
| 1 | `/learn` | `src/app/(marketing)/learn/page.tsx` | Main Learning Portal Dashboard (Course discovery, featured paths, active progress) |
| 2 | `/learn/[slug]` | `src/app/(marketing)/learn/[slug]/page.tsx` | Dynamic Course/Topic Overview Page |
| 3 | `/learn/account` | `src/app/(marketing)/learn/account/page.tsx` | Learner Account Settings & Preferences |
| 4 | `/learn/account/notifications` | `src/app/(marketing)/learn/account/notifications/page.tsx` | Push & Email Notification Preferences |
| 5 | `/learn/account/password` | `src/app/(marketing)/learn/account/password/page.tsx` | Account Security & Password Management |
| 6 | `/learn/account/sign-out` | `src/app/(marketing)/learn/account/sign-out/page.tsx` | Sign-out Confirmation Screen |
| 7 | `/learn/alerts` | `src/app/(marketing)/learn/alerts/page.tsx` | Learning Alerts & Activity Center |
| 8 | `/learn/analytics` | `src/app/(marketing)/learn/analytics/page.tsx` | Learner Progress & Completion Metrics Dashboard |
| 9 | `/learn/articles` | `src/app/(marketing)/learn/articles/page.tsx` | Educational Articles & Reading Catalog |
| 10 | `/learn/authors/[slug]` | `src/app/(marketing)/learn/authors/[slug]/page.tsx` | Educator / Author Bio & Content Portfolio |
| 11 | `/learn/documents` | `src/app/(marketing)/learn/documents/page.tsx` | Civic Documents & Resource Downloads Library |
| 12 | `/learn/forum` | `src/app/(marketing)/learn/forum/page.tsx` | Civic Learning Discussion Forum |
| 13 | `/learn/modules` | `src/app/(marketing)/learn/modules/page.tsx` | Learning Modules Directory |
| 14 | `/learn/modules/[slug]` | `src/app/(marketing)/learn/modules/[slug]/page.tsx` | Module Detail & Syllabus Overview |
| 15 | `/learn/modules/[slug]/complete` | `src/app/(marketing)/learn/modules/[slug]/(immersive)/complete/page.tsx` | **Peak Moment:** Immersive Module Completion & Celebration Screen |
| 16 | `/learn/modules/[slug]/quiz/[step]/[q]` | `src/app/(marketing)/learn/modules/[slug]/(immersive)/quiz/[step]/[q]/page.tsx` | Immersive Step-by-Step Quiz Screen (Interactive cards, instant feedback) |
| 17 | `/learn/modules/[slug]/read/[step]` | `src/app/(marketing)/learn/modules/[slug]/(immersive)/read/[step]/page.tsx` | Immersive Reading View (Clean typography, progress bar) |
| 18 | `/learn/modules/[slug]/watch/[step]` | `src/app/(marketing)/learn/modules/[slug]/(immersive)/watch/[step]/page.tsx` | Immersive Video Player Screen |
| 19 | `/learn/paths/[slug]` | `src/app/(marketing)/learn/paths/[slug]/page.tsx` | Structured Learning Pathway / Career Track |
| 20 | `/learn/profile` | `src/app/(marketing)/learn/profile/page.tsx` | Learner Profile, Earned Badges & Streak Stats |
| 21 | `/learn/quests` | `src/app/(marketing)/learn/quests/page.tsx` | Gamified Civic Challenges & Daily Quests |
| 22 | `/learn/stories` | `src/app/(marketing)/learn/stories/page.tsx` | Community Impact Stories & Case Studies |
| 23 | `/learn/units/[unitSlug]/[year]` | `src/app/(marketing)/learn/units/[unitSlug]/[year]/page.tsx` | Fiscal Budget Unit Deep Dive by Financial Year |
| 24 | `/learn/users/[id]` | `src/app/(marketing)/learn/users/[id]/page.tsx` | Public User Profile View |
| 25 | `/learn/videos` | `src/app/(marketing)/learn/videos/page.tsx` | Video Lessons Library |

---

## 2. Marketing Pages

The marketing section contains 27 public-facing routes built to engage citizens and showcase platform capabilities.

| # | Route | File Location | Description |
|---|-------|---------------|-------------|
| 1 | `/` | `src/app/(marketing)/page.tsx` | Homepage / Primary Mobile Landing Experience |
| 2 | `/about` | `src/app/(marketing)/about/page.tsx` | About BudgetNdioStory Mission & Vision |
| 3 | `/analytics` | `src/app/(marketing)/analytics/page.tsx` | Public National Budget Data Analytics |
| 4 | `/bns-project` | `src/app/(marketing)/bns-project/page.tsx` | Civic & Open Data Projects Overview |
| 5 | `/bns-project/[id]` | `src/app/(marketing)/bns-project/[id]/page.tsx` | Specific Civic Project Case Study & Data |
| 6 | `/bns-studio` | `src/app/(marketing)/bns-studio/page.tsx` | BNS Studio Media & Content Hub |
| 7 | `/budgetnews` | `src/app/(marketing)/budgetnews/page.tsx` | Budget News & Fiscal Updates Feed |
| 8 | `/budgetnews/[slug]` | `src/app/(marketing)/budgetnews/[slug]/page.tsx` | News Article Detail Screen |
| 9 | `/budgetnews/[slug]/[chapterSlug]` | `src/app/(marketing)/budgetnews/[slug]/[chapterSlug]/page.tsx` | News Article Chapter View |
| 10 | `/contact` | `src/app/(marketing)/contact/page.tsx` | Contact Us & Feedback Form |
| 11 | `/events` | `src/app/(marketing)/events/page.tsx` | Upcoming Civic Events & Town Halls |
| 12 | `/events/[id]` | `src/app/(marketing)/events/[id]/page.tsx` | Event Detail & RSVP Screen |
| 13 | `/faq` | `src/app/(marketing)/faq/page.tsx` | Frequently Asked Questions |
| 14 | `/learnhub` | `src/app/(marketing)/learnhub/page.tsx` | Learn Hub Marketing Portal Landing |
| 15 | `/privacy` | `src/app/(marketing)/privacy/page.tsx` | Privacy Policy & Data Protection |
| 16 | `/programmes` | `src/app/(marketing)/programmes/page.tsx` | Civic Action Programmes Directory |
| 17 | `/programmes/[slug]` | `src/app/(marketing)/programmes/[slug]/page.tsx` | Specific Programme Detail & Goals |
| 18 | `/security` | `src/app/(marketing)/security/page.tsx` | Platform Security & Audit Practices |
| 19 | `/surveys` | `src/app/(marketing)/surveys/page.tsx` | Active Citizen Surveys Index |
| 20 | `/surveys/[id]` | `src/app/(marketing)/surveys/[id]/page.tsx` | Survey Question & Response Interface |
| 21 | `/team` | `src/app/(marketing)/team/page.tsx` | Leadership & Team Directory |
| 22 | `/team/[username]` | `src/app/(marketing)/team/[username]/page.tsx` | Team Member Profile |
| 23 | `/terms` | `src/app/(marketing)/terms/page.tsx` | Terms & Conditions |
| 24 | `/tiktok/[uuid]` | `src/app/(marketing)/tiktok/[uuid]/page.tsx` | Short-form Civic Video Showcase |
| 25 | `/weekly-notes` | `src/app/(marketing)/weekly-notes/page.tsx` | Weekly Fiscal & Civic Notes |
| 26 | `/weekly-notes/audit` | `src/app/(marketing)/weekly-notes/audit/page.tsx` | Weekly Notes Audit Trail |
| 27 | `/weekly-notes/manage` | `src/app/(marketing)/weekly-notes/manage/page.tsx` | Weekly Notes Administration |

---

## 3. Reports Pages

The reports section covers public budget publication tools and reporting dashboards.

| # | Route | File Location | Description |
|---|-------|---------------|-------------|
| 1 | `/reports` | `src/app/(marketing)/reports/page.tsx` | Public Budget Publications, Audit Reports & PDF Library |
| 2 | `/admin/dashboard/task/report` | `src/app/admin/dashboard/task/report/page.tsx` | Administrative Task Execution & System Report Dashboard |

---

## 4. Mobile UI/UX Design Standards Applied

When building or refining screens for these routes, the `mobile-app-ui-design` skill mandates:

1. **Thumb Zone Optimization:** Primary actions (Enroll, Take Quiz, Filter, Next Lesson, Download Report) placed in the bottom third of the 375px mobile container.
2. **Typography Hierarchy:** Max 1 font family, max 4 font sizes, max 2 weights, monospace font for numbers/figures.
3. **Color System (60/30/10):**
   - 60% Neutral Base (clean background)
   - 30% Dark Text/Structure
   - 10% Vibrant Accent (CTAs, key badges)
4. **8-Point Grid Spacing:** All gaps and paddings mapped strictly to multiples of 4 or 8 (8, 12, 16, 24, 32, 48px).
5. **Peak-End Rule:** Module completion (`/learn/modules/[slug]/complete`), quiz finish screens, and report exports feature rewarding visual feedback (confetti/sparkles/badges).
