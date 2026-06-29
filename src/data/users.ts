import type { UserProfileApi } from "@/lib/api-client";
import { citizenApi } from "@/lib/api-client";
import { withFallback } from "@/data/adapter";
import bnsConfig from "@/constants/bnsConfig.json";

export type { UserProfileApi };

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  description?: string;
  bio?: string;
  socials?: { linkedin?: string; x?: string; website?: string };
};

const config = bnsConfig as {
  leadership?: {
    advisor?: TeamMember[];
    executive?: TeamMember[];
    directors?: TeamMember[];
    operations?: TeamMember[];
  };
};

const DEFAULT_TEAM: TeamMember[] = [];
const leaderData = config.leadership ?? {};
for (const group of Object.values(leaderData)) {
  if (Array.isArray(group)) DEFAULT_TEAM.push(...group);
}

let _team: TeamMember[] = [...DEFAULT_TEAM];

export const userData = {
  team: {
    get: () => _team,
    set: (members: TeamMember[]) => { _team = members; },
    fetch: () =>
      withFallback(
        "users",
        () => citizenApi.getTeamMembers(),
        () => _team,
      ),
  },
  profile: {
    fetch: () =>
      withFallback(
        "users",
        () => citizenApi.getMe(),
        () => null as unknown as UserProfileApi,
      ),
    fetchPublic: (id: string) =>
      withFallback(
        "users",
        () => citizenApi.getPublicUser(id),
        () => null,
      ),
  },
};
