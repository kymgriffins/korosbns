# Page Spec: Learn Forum (`/learn/forum`)

Parent PRD: [learn-hub](../prd/learn-hub.md) · Status: `QA'd`

## Purpose
Community discussion space where citizens ask questions, share insights, and discuss Kenya's budget.

## Users & Entry Points
- Who arrives here: All visitors (read-only) and logged-in users (post)
- Entry points: Learn Studio sidebar "Forum" tab, `/learn/forum` direct URL, discussion links from article reader

## Primary Action
Browse and search discussions; logged-in users create threads and reply.

## States

| State | What's shown | What's interactive | What's disabled/hidden |
|-------|-------------|-------------------|----------------------|
| Loading | `Loader2` spinner centered | Nothing | All |
| Empty (no threads) | "No conversations yet" empty state with CTA | Create thread (if logged in) | Thread list |
| Empty (search no results) | "No matches" empty state with tip | Search input | All threads |
| Populated (thread list) | Search bar, thread cards (title, author, post count, date) | Search, thread card click, create thread, refresh | N/A |
| Error — network | Empty state with error message + icon | Retry via refresh | Thread list |
| Populated (thread detail) | Thread title, posts, reply form | Reply submit, back to list | N/A |

## Data Contract

| Field shown | Source | Type | Behavior if null/missing |
|------------|--------|------|-------------------------|
| Thread list | `useForumThreads()` | `ForumThread[]` | Show empty state |
| Thread title | API `thread.title` | string | "Untitled" |
| Author name | API `thread.author_name` | string | "Anonymous" |
| Post count | API `thread.posts_count` | number | 0 |
| Thread detail | API `GET /forum-threads/:id/` | `ForumThreadDetail` | Show error state |
| Post content | API `post.content` | string | "—" |
| Search query | Local state | string | Show all threads when empty |

## Component Map

| UI element | Component used | Decision tree step | Notes |
|-----------|---------------|-------------------|-------|
| Page shell | `StudioPage` | 1 (primitive) | StudioPage width="default" |
| Header | `StudioPageHeader` | 2 (composition) | With ForumWave illustration |
| Search | shadcn `Input` | 1 (primitive) | With Search icon |
| Thread card | `ForumThreadCard` | 4 (custom) | Existing component |
| Thread detail | `ForumThreadDetail` | 4 (custom) | Existing component |
| Create dialog | `CreateThreadDialog` | 2 (composition) | Dialog + form |
| Loading | `Loader2` | 1 (primitive) | Centered spinner |
| Empty state | `Empty` pattern | 2 (composition) | Empty + EmptyHeader + EmptyTitle |

## Motion Spec

N/A — forum is list-based, no critical animations.

## Responsive Behavior

| Breakpoint | Layout change |
|-----------|---------------|
| sm (mobile) | Full-width cards, bottom sheet on create |
| md (tablet) | Same layout, wider cards |
| lg (desktop) | Same as md |

## Edge Cases

| Edge case | Expected behavior |
|-----------|------------------|
| No threads exist | Empty state with "Be the first" CTA |
| Search returns nothing | "No matches" message, clear search prompt |
| Guest tries to post | Show "Sign in to post" button link |
| Network fails on post | Toast error, post not lost from form |

## Exit Points

| From | To | Trigger |
|------|-----|---------|
| Forum | Learn Home `/learn` | Sidebar nav |
| Thread detail | Forum list | Back button |
| Create thread dialog | Forum list | Cancel or successful creation |
| Sign in button | `/auth/login` | Button click |

## Sign-off

- [x] Matches parent PRD scope
- [x] All states filled (no blanks)
- [x] Component Decision Tree followed for every element
- [ ] Motion tokens used, no invented values
- [ ] Ready for Gate 4 (Build)
