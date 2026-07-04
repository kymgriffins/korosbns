import type { AssignableTeam, ChecklistItem } from "@/types/tasks";

/** Standing roster slots — titles only; assignee filled per week. */
export const ROSTER_SUBTASK_TITLES = [
  "Facilitator",
  "Recorder",
  "Reviewer",
  "Communications lead",
  "Evidence / data lead",
] as const;

function templateId(prefix: string, index: number) {
  return `template-${prefix}-${index}-${Math.random().toString(36).slice(2, 7)}`;
}

export function buildRosterChecklist(): ChecklistItem[] {
  return ROSTER_SUBTASK_TITLES.map((title, index) => ({
    id: templateId("roster", index),
    title,
    text: title,
    checked: false,
    status: "todo",
    assignee: null,
    assignee_name: null,
  }));
}

/** Match Team A by name or slug (API-driven). */
export function findTeamA(teams: AssignableTeam[]): AssignableTeam | undefined {
  return teams.find(
    (t) =>
      /^team\s*a$/i.test(t.name.trim()) ||
      t.slug?.toLowerCase() === "team-a" ||
      t.slug?.toLowerCase() === "a",
  );
}

export const WEEKLY_TEAM_A_DELIVERABLE_SUBTASK =
  "Team A — weekly response & deliverable";

/**
 * Prefill pack for a recurring weekly note owned by Team A.
 *
 * Backend automation (planned): cron/Celery job each Monday creates a draft
 * WeeklyNote with this title, assigned_team=Team A, and this checklist via
 * `POST /api/v1/notes/` + checklist items — mirror this shape in Django.
 */
export function buildWeeklyTeamDeliverablePack(team: AssignableTeam, weekLabel: string) {
  return {
    title: `Weekly deliverable — ${team.name}`,
    week_label: weekLabel,
    assigned_team: team.id,
    status: "draft" as const,
    checklist: [
      {
        id: templateId("deliverable", 0),
        title: WEEKLY_TEAM_A_DELIVERABLE_SUBTASK,
        text: WEEKLY_TEAM_A_DELIVERABLE_SUBTASK,
        checked: false,
        status: "todo" as const,
        assignee: null,
        assignee_name: null,
      },
      ...buildRosterChecklist(),
    ],
  };
}
