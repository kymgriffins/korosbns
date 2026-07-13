import { Metadata } from "next";
import { team } from "@/data/org";
import {
  findMemberByParam,
  slugifyName,
  type TeamMember,
} from "@/lib/team";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { notFound, redirect } from "next/navigation";
import { metaDescription } from "@/utils/metadata";

type TeamMemberParams = { username: string };

export function generateStaticParams() {
  return team.map((member) => ({
    username: slugifyName(member.name),
  }));
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

  const blurb = member.bio || member.description;
  const description = metaDescription(
    `${member.name} — ${member.role} at Budget Ndio Story. ${blurb}`,
  );
  return {
    title: `${member.name} | Budget Ndio Story`,
    description,
    openGraph: {
      title: `${member.name} | Budget Ndio Story`,
      description,
      images: [member.image],
    },
  };
}

function TeamMemberProfile({ member }: { member: TeamMember }) {
  const firstName = member.name.split(" ")[0] ?? member.name;
  const aboutText = member.bio?.trim() || member.description;

  return (
    <div className="min-h-screen bg-background">
      <div className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
        <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-teal-500/10 blur-[100px]" />

        <div className="relative z-10 px-6 py-16 text-center">
          <Link
            href="/about"
            className="mb-8 inline-flex items-center gap-2 text-sm text-foreground/60 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Team
          </Link>

          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            <Image
              src={member.image}
              alt={member.name}
              width={160}
              height={160}
              className="relative mx-auto size-40 rounded-full border-4 border-background object-cover shadow-2xl"
              priority
            />
          </div>

          <div>
            <h1 className="mb-2 mt-6 text-3xl font-bold sm:text-4xl">{member.name}</h1>
            <p className="text-lg font-medium text-primary">{member.role}</p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            {member.socials?.linkedin ? (
              <Link
                href={member.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                aria-label={`${member.name} on LinkedIn`}
              >
                <IconBrandLinkedin className="size-5" />
              </Link>
            ) : null}
            {member.socials?.x ? (
              <Link
                href={member.socials.x}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                aria-label={`${member.name} on X`}
              >
                <IconBrandX className="size-5" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-16">
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">About {firstName}</h2>
          <p className="mb-6 leading-relaxed text-muted-foreground whitespace-pre-line">{aboutText}</p>

          <div className="flex items-center gap-3 border-t border-border/60 pt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
            >
              Meet the full team
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {team
            .filter((m) => m.name !== member.name)
            .slice(0, 3)
            .map((m) => {
              const mUsername = slugifyName(m.name);
              return (
                <Link
                  key={m.name}
                  href={`/team/${mUsername}`}
                  className="group rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/30"
                >
                  <Image
                    src={m.image}
                    alt={m.name}
                    width={60}
                    height={60}
                    className="mx-auto mb-3 size-12 rounded-full object-cover"
                  />
                  <p className="text-center text-sm font-medium">{m.name.split(" ")[0]}</p>
                  <p className="text-center text-xs text-muted-foreground">{m.role}</p>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}

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

  const canonicalUsername = slugifyName(member.name);
  if (username !== canonicalUsername) {
    redirect(`/team/${canonicalUsername}`);
  }

  return <TeamMemberProfile member={member} />;
}
