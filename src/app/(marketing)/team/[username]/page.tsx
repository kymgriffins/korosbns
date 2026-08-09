import { Metadata } from "next";
import { team, OrgTeamMember } from "@/data/org";
import {
  findMemberByParam,
  slugifyName,
} from "@/lib/team";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, CheckCircle2, Quote, Sparkles, Target } from "lucide-react";
import { IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import { notFound, redirect } from "next/navigation";
import { metaDescription } from "@/utils/metadata";
import { TeamAvatar } from "@/components/marketing/team-avatar";

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .filter(Boolean)
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TeamMemberProfile({ member }: { member: OrgTeamMember }) {
  const firstName = member.name.split(" ")[0] ?? member.name;
  const initials = getInitials(member.name);
  const narrative = member.profileText || member.bio || member.description;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Hero Header Section - High Aesthetic Avatar Image & Title */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-card/80 via-background to-background py-16 lg:py-24">
        {/* Subtle Ambient Radial Lighting */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/about#team"
            className="group mb-10 inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-2 text-xs font-semibold text-muted-foreground backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-card hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to Leadership Team
          </Link>

          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
            {/* Team Member Avatar Image with Fallback */}
            <div className="mb-6 shrink-0 sm:mb-0">
              <TeamAvatar
                src={member.image}
                alt={member.name}
                initials={initials}
                size="lg"
              />
            </div>

            <div className="max-w-2xl flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary/90">
                <Sparkles className="size-3.5" />
                <span>Budget Ndio Story Leadership</span>
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                {member.name}
              </h1>
              <p className="mt-2 text-lg font-bold text-primary sm:text-xl">
                {member.role}
              </p>
              {member.tagline && (
                <p className="mt-2 text-base font-medium leading-relaxed text-muted-foreground sm:text-lg">
                  {member.tagline}
                </p>
              )}

              {/* Social Links */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                {member.socials?.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 text-xs font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/20"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <IconBrandLinkedin className="size-4" />
                    <span>LinkedIn Profile</span>
                  </a>
                )}
                {member.socials?.x && (
                  <a
                    href={member.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-5 py-2.5 text-xs font-semibold text-foreground/80 transition-all hover:border-foreground/30 hover:bg-accent"
                    aria-label={`${member.name} on X`}
                  >
                    <IconBrandX className="size-4" />
                    <span>X (Twitter)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16">
        <div className="grid gap-10">
          {/* Detailed Biography & Narrative */}
          <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-xs sm:p-10">
            <h2 className="mb-6 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              About {firstName}
            </h2>
            <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-muted-foreground whitespace-pre-line sm:text-lg">
              {narrative}
            </div>
          </section>

          {/* Core Focus Areas */}
          {member.focusAreas && member.focusAreas.length > 0 && (
            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-xs sm:p-10">
              <div className="mb-6 flex items-center gap-2 text-primary">
                <Target className="size-5" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Core Focus & Domain Expertise
                </h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {member.focusAreas.map((focus) => (
                  <div
                    key={focus}
                    className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/60 p-4 font-medium text-foreground transition-colors hover:border-primary/30"
                  >
                    <div className="flex size-2.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm sm:text-base">{focus}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Achievements & Initiatives */}
          {member.achievements && member.achievements.length > 0 && (
            <section className="rounded-3xl border border-border/60 bg-card p-8 shadow-xs sm:p-10">
              <div className="mb-6 flex items-center gap-2 text-primary">
                <Award className="size-5" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  Key Leadership Initiatives
                </h2>
              </div>
              <ul className="grid gap-4">
                {member.achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className="flex items-start gap-3.5 rounded-2xl border border-border/40 bg-background/40 p-4 transition-colors"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 text-primary shrink-0" />
                    <span className="text-sm font-medium leading-relaxed text-foreground/90 sm:text-base">
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Leadership Quote */}
          {member.quote && (
            <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 sm:p-10">
              <Quote className="absolute right-6 top-6 size-16 text-primary/10" aria-hidden />
              <blockquote className="relative z-10">
                <p className="text-lg font-semibold italic text-foreground sm:text-xl">
                  &ldquo;{member.quote}&rdquo;
                </p>
                <cite className="mt-4 block text-sm font-bold not-italic text-primary">
                  — {member.name}, {member.role}
                </cite>
              </blockquote>
            </section>
          )}

          {/* Other Leadership Team Navigation */}
          <section className="pt-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                Other Leadership Members
              </h3>
              <Link
                href="/about#team"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:underline"
              >
                Full Roster
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {team
                .filter((m) => m.name !== member.name)
                .slice(0, 3)
                .map((m) => {
                  const mUsername = slugifyName(m.name);
                  const mInitials = getInitials(m.name);
                  return (
                    <Link
                      key={m.name}
                      href={`/team/${mUsername}`}
                      className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                    >
                      <div>
                        <TeamAvatar
                          src={m.image}
                          alt={m.name}
                          initials={mInitials}
                          size="sm"
                        />
                        <h4 className="font-bold text-foreground transition-colors group-hover:text-primary">
                          {m.name}
                        </h4>
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {m.role}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        View profile
                        <ArrowRight className="size-3" />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
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
