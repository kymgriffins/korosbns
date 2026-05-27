import { team } from "@/constants/team";
import { citizenApi } from "./api-client";

export interface TeamMember {
    name: string;
    role: string;
    image: string;
    description: string;
    bio?: string;
    socials?: {
        linkedin?: string;
        x?: string;
        instagram?: string;
        email?: string;
    };
}

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

export const findMemberByParam = (rawParam: string, customTeam?: TeamMember[]) => {
    const param = normalizeHandle(rawParam);
    const list = customTeam || team;
    return list.find((member) => getMemberAliases(member).includes(param));
};

export async function fetchTeamMembers(): Promise<TeamMember[]> {
    try {
        const apiTeam = await citizenApi.getTeamMembers();
        if (apiTeam && apiTeam.length > 0) {
            return apiTeam.map((m) => ({
                name: m.name,
                role: m.role,
                image: m.image || "https://res.cloudinary.com/dn8lut2fc/image/upload/v1778676957/Movine_Omondi_HeadShot_ulwyu8.jpg",
                description: m.description || "",
                bio: m.bio || m.description || "",
                socials: {
                    linkedin: m.socials?.linkedin || "",
                    x: m.socials?.x || "",
                    instagram: m.socials?.instagram || "",
                    email: m.socials?.email || "",
                },
            }));
        }
        return team;
    } catch (error) {
        console.error("Failed to fetch team members, falling back to local constants:", error);
        return team;
    }
}
