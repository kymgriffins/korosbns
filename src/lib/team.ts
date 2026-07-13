import { team } from "@/data/org";

export type TeamMember = (typeof team)[number];

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
  const x = member.socials?.x?.trim();
  if (!x) return slugifyName(member.name);

  const handle = x
    .replace(/^https?:\/\/(www\.)?x\.com\//i, "")
    .replace(/^https?:\/\/(www\.)?twitter\.com\//i, "")
    .split(/[/?#]/)[0];

  return normalizeHandle(handle || slugifyName(member.name));
};

export const getMemberAliases = (member: TeamMember) => {
  const aliases = new Set<string>([getMemberUsername(member), slugifyName(member.name)]);
  return [...aliases];
};

export const findMemberByParam = (rawParam: string) => {
  const param = normalizeHandle(rawParam);
  return team.find((member) => getMemberAliases(member).includes(param));
};
