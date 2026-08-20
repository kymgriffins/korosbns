import { Metadata } from "next";
import { team, OrgTeamMember } from "@/data/org";
import { findMemberByParam, slugifyName } from "@/lib/team";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Quote,
  Sparkles,
  Target,
  ExternalLink,
  Mail,
  Share2,
  BookOpen,
  Briefcase,
  Compass,
  Layers,
  Flame,
  Globe,
  Radio,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { IconBrandLinkedin } from "@tabler/icons-react";
import { notFound, redirect } from "next/navigation";
import { metaDescription } from "@/utils/metadata";
import { TeamAvatar } from "@/components/marketing/team-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    title: `${member.name} — ${member.role} | Budget Ndio Story`,
    description,
    openGraph: {
      title: `${member.name} — ${member.role} | Budget Ndio Story`,
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

/**
 * Domain-specific contextual links & initiatives tailored for each leader
 */
function getMemberInitiatives(name: string) {
  switch (name) {
    case "Movine Omondi":
      return [
        { title: "National Youth Budget Literacy Campaign", link: "/reports", type: "Civic Policy Initiative", badge: "1.2M+ Reach" },
        { title: "County Budget Tracking Network (47 Counties)", link: "/learn", type: "Grassroots Governance", badge: "Nationwide" },
        { title: "Parliamentary Finance Bill Submissions", link: "/reports", type: "Legislative Oversight", badge: "Policy" },
      ];
    case "Shem Odhiambo Ojunga":
      return [
        { title: "BNS High-Capacity Multimedia Studio", link: "/bns-studio", type: "Media Production", badge: "Production Studio" },
        { title: "Finance Bill Viral Explainer Series", link: "/learn/videos", type: "Short-Form Video", badge: "1.2M+ Organic Views" },
        { title: "Youth Visual Storytelling Lab", link: "/careers", type: "Creative Direction", badge: "Open Network" },
      ];
    case "Peculiar Koros":
      return [
        { title: "Interactive Fiscal Explorer & Data Engine", link: "/budgethub", type: "Platform Architecture", badge: "Civic-Tech" },
        { title: "Headless CMS & Verification Pipeline", link: "/admin/dashboard/cms", type: "Open Data Systems", badge: "100% Audit Score" },
        { title: "National Treasury & Appropriation API Sync", link: "/reports", type: "Backend Engineering", badge: "Live Ingestion" },
      ];
    case "Nelly Maina":
      return [
        { title: "'Budget Mtaani' Audio Broadcast", link: "/bns-studio", type: "Podcast Series", badge: "Top 5 Civic Podcast" },
        { title: "Sheng & Grassroots Civic Translation", link: "/learn/stories", type: "Community Dialogue", badge: "50+ Episodes" },
        { title: "Townhall & Youth Voice Open Mic", link: "/events", type: "Live Engagement", badge: "Citizen Forum" },
      ];
    case "Calvina Praise":
      return [
        { title: "TikTok & Reels Fiscal Explainers", link: "/bns-studio", type: "Digital Content", badge: "Viral Series" },
        { title: "Public Finance Educational Carousels", link: "/careers", type: "Interactive Design", badge: "Youth-Centric" },
        { title: "Youth Civic Engagement Polls & Campaigns", link: "/surveys", type: "Audience Growth", badge: "Community" },
      ];
    case "James Maingi Mutinda":
      return [
        { title: "Founding Consortium Alliances", link: "/about#consortium-founders", type: "Coalition Building", badge: "Founding Lead" },
        { title: "Campus Fiscal Literacy Roadshows", link: "/programmes", type: "Institutional Growth", badge: "25+ Universities" },
        { title: "Strategic Terms of Reference (ToR) Dialogues", link: "/contact?intent=partner", type: "Partner Diplomacy", badge: "National" },
      ];
    case "Millicent Makina":
      return [
        { title: "5-Year Strategic Governance Framework", link: "/about", type: "Board Stewardship", badge: "Governance" },
        { title: "Civic-Tech Consortium Transition", link: "/about#consortium-founders", type: "Institutional Oversight", badge: "Multi-Entity" },
        { title: "Public Interest Reporting Ethics Standards", link: "/reports", type: "Compliance & Ethics", badge: "Standard Setting" },
      ];
    default:
      return [
        { title: "Youth Civic Education Series", link: "/learn", type: "Public Literacy", badge: "Core" },
        { title: "BNS National Engagement Hub", link: "/about", type: "Strategy", badge: "Initiative" },
      ];
  }
}

function TeamMemberProfile({ member }: { member: OrgTeamMember }) {
  const firstName = member.name.split(" ")[0] ?? member.name;
  const initials = getInitials(member.name);
  const narrative = member.profileText || member.bio || member.description;
  const initiatives = getMemberInitiatives(member.name);
  const otherMembers = team.filter((m) => m.name !== member.name);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 pb-20">
      {/* Top Breadcrumb Navigation */}
      <div className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <Link href="/about#team" className="hover:text-foreground transition-colors">
              Leadership Team
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className="text-foreground font-semibold truncate max-w-[200px]">{member.name}</span>
          </nav>

          <Link
            href="/about#team"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>All 7 Leaders</span>
          </Link>
        </div>
      </div>

      {/* Header Spotlight Banner */}
      <div className="relative overflow-hidden border-b border-border/50 bg-gradient-to-b from-card via-background to-background py-12 lg:py-16">
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Avatar Column */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-primary/50 to-purple-500/50 opacity-70 blur-md group-hover:opacity-100 transition duration-500" />
                <div className="relative">
                  <TeamAvatar
                    src={member.image}
                    alt={member.name}
                    initials={initials}
                    size="lg"
                  />
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold text-xs">
                  Executive Roster
                </Badge>
                <Badge variant="secondary" className="text-xs font-medium">
                  Verified Leadership
                </Badge>
              </div>
            </div>

            {/* Right Profile Info Column */}
            <div className="lg:col-span-8 text-center lg:text-left space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="size-3.5" />
                <span>Budget Ndio Story Key Contributor</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-heading tracking-tight text-foreground">
                {member.name}
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {member.role}
                </span>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Budget Ndio Story Consortium
                </span>
              </div>

              {member.tagline && (
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-2xl">
                  {member.tagline}
                </p>
              )}

              {/* Social Action Links */}
              <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {member.socials?.linkedin && member.socials.linkedin.trim() && member.socials.linkedin !== "#" && (
                  <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
                    <a
                      href={member.socials.linkedin.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <IconBrandLinkedin className="size-4" />
                      <span>Connect on LinkedIn</span>
                      <ExternalLink className="size-3 text-primary-foreground/70" />
                    </a>
                  </Button>
                )}

                <Button asChild variant="secondary" size="sm" className="gap-1.5 font-semibold text-xs">
                  <Link href={`/contact?intent=team-inquiry&member=${encodeURIComponent(member.name)}`}>
                    <Mail className="size-3.5" />
                    <span>Send Message</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Content Layout */}
      <div className="mx-auto max-w-6xl px-6 pt-12 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Left Content Area */}
          <div className="lg:col-span-8 space-y-10">
            {/* Mission & Vision Impact Showcase Card */}
            {(member.missionImpact || member.visionContribution) && (
              <section className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-background p-8 shadow-sm sm:p-10 space-y-6">
                <div className="flex items-center gap-2.5 text-primary font-heading pb-4 border-b border-primary/20">
                  <Sparkles className="size-5" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Mission Impact &amp; Civic Vision
                  </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-1">
                  {member.missionImpact && (
                    <div className="space-y-2.5 rounded-2xl border border-primary/20 bg-background/80 p-5 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                        <Target className="size-4" />
                        <span>Driving The BNS Mission</span>
                      </div>
                      <p className="text-base sm:text-lg text-foreground/90 leading-relaxed font-serif italic">
                        {member.missionImpact}
                      </p>
                    </div>
                  )}

                  {member.visionContribution && (
                    <div className="space-y-2.5 rounded-2xl border border-border/60 bg-muted/30 p-5 shadow-xs">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        <Compass className="size-4" />
                        <span>Shaping Kenya&apos;s Civic Vision</span>
                      </div>
                      <p className="text-sm sm:text-base text-foreground/80 leading-relaxed">
                        {member.visionContribution}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Biography Section */}
            <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm sm:p-10 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border/40">
                <div className="flex items-center gap-2.5 text-foreground font-heading">
                  <Compass className="size-5 text-primary" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Biography &amp; Leadership Profile
                  </h2>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  BNS Profile
                </Badge>
              </div>

              <div className="prose prose-neutral dark:prose-invert max-w-none text-base leading-relaxed text-muted-foreground whitespace-pre-line sm:text-lg">
                {narrative}
              </div>
            </section>

            {/* Core Focus & Domain Expertise */}
            {member.focusAreas && member.focusAreas.length > 0 && (
              <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm sm:p-10 space-y-6">
                <div className="flex items-center gap-2.5 text-primary font-heading pb-4 border-b border-border/40">
                  <Target className="size-5" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Core Focus &amp; Domain Expertise
                  </h2>
                </div>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {member.focusAreas.map((focus) => (
                    <div
                      key={focus}
                      className="flex items-start gap-3.5 rounded-2xl border border-border/50 bg-background/60 p-4 transition-all duration-200 hover:border-primary/40 hover:bg-card shadow-xs"
                    >
                      <div className="mt-1 flex size-3 rounded-full bg-primary shrink-0 ring-4 ring-primary/20" />
                      <span className="text-sm font-semibold text-foreground leading-snug">
                        {focus}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Leadership Initiatives & Achievements */}
            {member.achievements && member.achievements.length > 0 && (
              <section className="rounded-3xl border border-border/70 bg-card p-8 shadow-sm sm:p-10 space-y-6">
                <div className="flex items-center gap-2.5 text-primary font-heading pb-4 border-b border-border/40">
                  <Award className="size-5" />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Key Achievements &amp; Milestones
                  </h2>
                </div>

                <ul className="grid gap-4">
                  {member.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 rounded-2xl border border-border/40 bg-background/40 p-4 sm:p-5 transition-all hover:border-primary/30"
                    >
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="size-5" />
                      </div>
                      <span className="text-sm sm:text-base font-medium text-foreground/90 leading-relaxed pt-1">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Member Quote */}
            {member.quote && (
              <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-card to-background p-8 sm:p-10 shadow-sm">
                <Quote className="absolute right-6 top-6 size-20 text-primary/10" aria-hidden />
                <blockquote className="relative z-10 space-y-4">
                  <p className="text-lg sm:text-xl md:text-2xl font-bold italic text-foreground leading-relaxed">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                  <cite className="block text-sm font-bold not-italic text-primary">
                    — {member.name}, {member.role}
                  </cite>
                </blockquote>
              </section>
            )}
          </div>

          {/* Sticky Sidebar Right Column */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Quick Executive Snapshot Card */}
            <div className="p-6 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4">
              <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <span>Executive Summary</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between">
                  <span className="text-muted-foreground">Organization</span>
                  <span className="font-bold text-foreground">Budget Ndio Story</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between">
                  <span className="text-muted-foreground">Role Scope</span>
                  <span className="font-bold text-primary">{member.role}</span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-bold text-foreground">Nairobi, Kenya</span>
                </div>
              </div>

              <div className="pt-2">
                <Button asChild size="sm" variant="outline" className="w-full text-xs font-semibold gap-1.5">
                  <Link href="/about#consortium-founders">
                    <Layers className="size-3.5" />
                    <span>View Consortium Partners</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Associated Programmes & Hubs */}
            <div className="p-6 rounded-3xl border border-border/70 bg-card shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                  <Flame className="size-4 text-amber-500" />
                  <span>Associated Initiatives</span>
                </h3>
              </div>

              <div className="space-y-2.5">
                {initiatives.map((init, i) => (
                  <Link
                    key={i}
                    href={init.link}
                    className="group block p-3.5 rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/60 hover:border-primary/40 transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-primary">
                        {init.type}
                      </span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {init.badge}
                      </Badge>
                    </div>
                    <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-1">
                      <span className="truncate">{init.title}</span>
                      <ArrowRight className="size-3 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Direct Connect Card */}
            <div className="p-6 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-card shadow-sm space-y-3 text-center">
              <h4 className="text-sm font-bold text-foreground">Interested in Collaborating?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect directly with {firstName} for speaking engagements, policy roundtables, or media interviews.
              </p>
              <Button asChild size="sm" className="w-full font-bold text-xs gap-1.5">
                <Link href={`/contact?intent=collaboration&member=${encodeURIComponent(member.name)}`}>
                  <Mail className="size-3.5" />
                  <span>Get In Touch</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Explore Other Leadership Members Section */}
        <section className="pt-16 mt-16 border-t border-border/40 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Executive Collective
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mt-0.5">
                Meet the Rest of the Team
              </h2>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-bold w-fit">
              <Link href="/about#team">
                <span>View Full Team Roster</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherMembers.map((m) => {
              const mUsername = slugifyName(m.name);
              const mInitials = getInitials(m.name);
              return (
                <Link
                  key={m.name}
                  href={`/team/${mUsername}`}
                  className="group flex flex-col justify-between rounded-3xl border border-border/70 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <TeamAvatar
                        src={m.image}
                        alt={m.name}
                        initials={mInitials}
                        size="md"
                      />
                      <div>
                        <h3 className="font-bold text-base text-foreground transition-colors group-hover:text-primary">
                          {m.name}
                        </h3>
                        <p className="text-xs font-semibold text-primary">
                          {m.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>View Profile</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
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

