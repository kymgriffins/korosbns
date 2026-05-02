import { Metadata } from "next";
import { team } from "@/constants/team";
import {
  findMemberByParam,
  getMemberAliases,
  getMemberUsername,
  type TeamMember,
} from "@/lib/team";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { notFound } from "next/navigation";

type TeamMemberParams = { username: string };

export function generateStaticParams() {
  return team.flatMap((member) =>
    getMemberAliases(member).map((username) => ({ username })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TeamMemberParams>;
}): Promise<Metadata> {
  const { username } = await params;
  const member = findMemberByParam(username);

  if (!member) {
    return { title: "Team Member Not Found" };
  }

  return {
    title: `${member.name} | Budget Ndio Story`,
    description: `${member.name} - ${member.role} at Budget Ndio Story. Making Kenya's budget transparent and accessible.`,
    openGraph: {
      title: `${member.name} | Budget Ndio Story`,
      description: `${member.name} - ${member.role} at Budget Ndio Story`,
      images: [member.image],
    },
  };
}

const TeamMemberProfile = ({ member }: { member: typeof team[0] }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[100px] rounded-full" />

        <div className="relative z-10 text-center px-6 py-16">
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Team
          </Link>

          <div className="relative inline-block">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
            <Image
              src={member.image}
              alt={member.name}
              width={160}
              height={160}
              className="relative rounded-full object-cover border-4 border-background shadow-2xl size-40 mx-auto"
            />
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mt-6 mb-2">{member.name}</h1>
            <p className="text-lg text-primary font-medium">{member.role}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            {member.socials?.linkedin && (
              <Link
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <IconBrandLinkedin className="size-5" />
              </Link>
            )}
            {member.socials?.x && (
              <Link
                href={member.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 flex items-center justify-center rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
              >
                <IconBrandX className="size-5" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">About {member.name.split(" ")[0]}</h2>
          <p className="text-foreground/70 leading-relaxed mb-6">
            {member.name} is a dedicated member of the Budget Ndio Story team, serving as {member.role.toLowerCase()}. 
            With a passion for civic engagement and fiscal transparency, they contribute to making Kenya's budget 
            information accessible to all citizens.
          </p>
          
          <div className="flex items-center gap-3 pt-4 border-t border-white/10">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Meet the full team
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {team.filter((m) => m.name !== member.name).slice(0, 3).map((m) => {
            const mUsername = getMemberUsername(m);
            return (
              <Link
                key={m.name}
                href={`/team/${mUsername}`}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
              >
                <Image
                  src={m.image}
                  alt={m.name}
                  width={60}
                  height={60}
                  className="rounded-full object-cover mb-3 size-12 mx-auto"
                />
                <p className="text-sm font-medium text-center">{m.name.split(" ")[0]}</p>
                <p className="text-xs text-foreground/50 text-center">{m.role}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<TeamMemberParams>;
}) {
  const { username } = await params;
  const member = findMemberByParam(username);

  if (!member) {
    notFound();
  }

  return <TeamMemberProfile member={member} />;
}