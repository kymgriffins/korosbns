/**
 * Org JSON database (marketing / mundane reads)
 *
 * ## Your logic (UI → JSON → DB)
 *
 * Good plan **for org marketing data** that rarely changes:
 *
 * 1. **JSON** (`src/data/org/org.json`) is the fast source for landing, About, team pages, sitemap.
 * 2. Later: **Admin UI** edits the roster → writes JSON (and optionally syncs Django).
 * 3. **DB** stays the source of truth for citizens, auth, learning progress, forums — never replace those with static JSON.
 *
 * ## Use JSON for
 * - Org name, tagline, contact
 * - Staff / leadership roster (photos, roles, bios, socials)
 * - Other “brochure” facts that would be wasteful as live API calls
 *
 * ## Keep hitting the API/DB for
 * - Logged-in user profiles (`/users/me/`)
 * - Public learner profiles (`/learn/users/[id]`)
 * - Modules, quizzes, progress, forum, documents
 *
 * ## Sync directions (pick one primary)
 * - **JSON-canonical (simple):** edit JSON in git or a small admin export; deploy ships it.
 * - **DB-canonical (CMS):** admin edits DB → build/export job regenerates `org.json` for the frontend.
 *
 * Avoid three competing sources (`team.ts`, `bnsConfig.leadership`, `/org/team/public/`) — this folder is the marketing roster.
 */
export {};
