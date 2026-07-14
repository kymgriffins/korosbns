import type { PublicTeamMember } from "@/lib/org-team";

export type TeamMember = PublicTeamMember;

export const slugifyName = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export const normalizeHandle = (value: string) =>
  decodeURIComponent(value)
    .trim()
    .toLowerCase()
    .replace(/^@/, "")
    .replace(/\/+$/, "");

export const getMemberUsername = (member: TeamMember) => {
  const explicit = member.username?.trim();
  if (explicit) return normalizeHandle(explicit);

  const x = member.socials?.x?.trim();
  if (x) {
    const handle = x
      .replace(/^https?:\/\/(www\.)?x\.com\//i, "")
      .replace(/^https?:\/\/(www\.)?twitter\.com\//i, "")
      .split(/[/?#]/)[0];
    if (handle) return normalizeHandle(handle);
  }

  return slugifyName(member.name);
};

export const getMemberAliases = (member: TeamMember) => {
  const aliases = new Set<string>([getMemberUsername(member), slugifyName(member.name)]);
  if (member.id) aliases.add(normalizeHandle(member.id));
  return [...aliases];
};

export const findMemberByParam = (members: TeamMember[], rawParam: string) => {
  const param = normalizeHandle(rawParam);
  return members.find((member) => getMemberAliases(member).includes(param));
};
