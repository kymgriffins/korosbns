import { NextResponse } from "next/server";
import { team } from "@/constants/team";

export async function GET() {
  const seeded = team.map((member, index) => ({
    id: `team-${index + 1}`,
    name: member.name,
    role: member.role,
    image: member.image,
    socials: member.socials ?? {},
  }));

  return NextResponse.json({ source: "seed", members: seeded }, { status: 200 });
}
