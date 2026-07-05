# Page Spec: Learn Profile (`/learn/profile`)

Parent PRD: [learn-hub](../prd/learn-hub.md) · Status: `QA'd`

## Purpose
View personal learning progress, achievements, and manage account preferences.

## Users & Entry Points
- Who arrives here: All users (logged-in and guest)
- Entry points: Learn Studio sidebar "You" tab, account settings link after login, `/learn/profile` direct URL

## Primary Action
View XP, streak, badges, and optionally sign in or edit profile details.

## States

| State | What's shown | What's interactive | What's disabled/hidden |
|-------|-------------|-------------------|----------------------|
| Loading | Avatar skeleton, stat stat cards skeleton, badge grid skeleton | Nothing | All |
| Empty (guest — no profile data) | Avatar (guest), sign-in prompt, county/ward "Kenya" default, empty badges, 0 XP | Sign in / Create account buttons | Edit profile, save |
| Populated (signed-in with data) | Avatar, display name, county/ward, XP bar, stat grid (XP/Streak/Badges/Level), badges (earned/in-progress/locked), certificates, account details form, notification toggles, password change | Edit profile, save changes, notification toggles, password change, sign out, reset local progress | Save buttons while saving |
| Error — network | Toast error on save failure | Retry via UI | Edit profile while saving |
| Permission-denied | N/A — profile is public, editing requires auth | N/A | N/A |
| Error — gamification fetch failure | Stats show 0, badges show fallback module list | Retry via refresh | Gamification sync |

## Data Contract

| Field shown | Source | Type | Behavior if null/missing |
|------------|--------|------|-------------------------|
| Avatar | `user.avatar_url` → `profile.avatar_url` | URL string | Show `BitmojiAvatar` fallback |
| Display name | `user.display_name` / `profile.breakName` | string | Show "Citizen" |
| County | `user.county` / `profile.county` | string | Show "Kenya" |
| XP | `gamification.points` / `profile.sovereigns` | number | Show 0 |
| Level | `gamification.level` | number | Derive from points: `Math.floor(points / 100) + 1` |
| Streak | `gamification.streak_days` / `profile.streakDays` | number | Show 0 |
| Badges (server) | `badgeCatalog.results` | array | Fallback to `gamification.badges` |
| Badges (client) | Derived from `stages + profile.badges` | array | Show as locked |
| Certificates | `certificates.results` / `gamification.certificates` | array | Show empty |
| Recent progress | `gamification.recent_progress` | array | Show empty |

## Component Map

| UI element | Component used | Decision tree step | Notes |
|-----------|---------------|-------------------|-------|
| Avatar | `ProfileAvatarEditor` / `BitmojiAvatar` | 2 (composition) | Avatar + gender picker |
| Stat grid | 4 stat cards | 2 (composition) | Card + icon + number |
| Badge catalog | `CatalogBadgeCard` | 3 (variant) | Earned/in-progress/locked variants |
| Module badges | Grid of badge emoji cards | 2 (composition) | Client-side derivation |
| Certificates list | Card list with download | 2 (composition) | Card + icon + action |
| Edit profile form | shadcn Form (Input) | 1 (primitive) | react-hook-form + Input |
| Notification switches | shadcn Switch | 1 (primitive) | Label + Switch |
| Password form | `PasswordInput` + shadcn Form | 1 (primitive) | Two fields + validation |
| Language selector | Grid of 3 buttons | 2 (composition) | Toggle group style |
| Sign-in prompt | Card with CTA | 2 (composition) | LogIn icon + two buttons |

## Motion Spec

| Interaction | Motion token (Section 5) | Notes |
|------------|-------------------------|-------|
| XP progress bar | `motion.layout` | Spring transition on width change |
| Badge reveal | `motion.enter` | Fade in on load |
| Avatar hover | `motion.micro` | Subtle scale |
| Password form expand | `motion.layout` | Accordion expand/collapse |

Reduced-motion fallback confirmed: ☐

## Responsive Behavior

| Breakpoint | Layout change | Notes |
|-----------|---------------|-------|
| sm (mobile) | Single column, centered avatar, stacked stats | Full-width cards |
| md (tablet) | Side-by-side stat grid (2x2), avatar left-aligned | Two-column badge grid |
| lg (desktop) | Avatar left, details right, wider layout | Three-column badge grid |
| xl (wide) | Same as lg | max-w-3xl content |

## Accessibility

- Focus order: Avatar → name → stats → badges → account details → notifications → password → actions
- ARIA roles needed beyond native: `role="progressbar"` on XP bar, `aria-label` on avatar editor
- Keyboard-only path verified: ☐
- Contrast check (text/background) verified: ☐
- Icon-only controls have accessible labels: ☐

## Edge Cases

| Edge case | Expected behavior |
|-----------|------------------|
| User has 0 XP | XP bar at 0%, level 1, "0 XP" shown |
| User has max XP (999+) | Bar shows 99% toward next level, comma-formatted |
| No badges earned | Badge section shows empty state or all-locked badges |
| Network failure during save | Toast error, form data preserved |
| Guest user clicks sign-in | Redirect to /login with return URL |
| Badge catalog API fails | Fallback to client-derived module badges + gamification badges |

## Exit Points

| From | To | Trigger |
|------|-----|---------|
| Profile tab | Learn Home `/learn` | Sidebar nav click |
| Sign in prompt | `/auth/login` | "Sign in" button click |
| Sign in prompt | `/auth/register` | "Create account" button click |
| Sign out button | Login page | Logout complete |
| Avatar editor | Profile | Save/cancel |

## Sign-off

- [x] Matches parent PRD scope
- [x] All states filled (no blanks)
- [x] Component Decision Tree followed for every element
- [ ] Motion tokens used, no invented values
- [ ] Ready for Gate 4 (Build)
