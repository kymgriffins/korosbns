import { Metadata } from "next";
import { team, OrgTeamMember } from "@/data/org";
import { findMemberByParam, slugifyName } from "@/lib/team";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Quote,
  Target,
  ExternalLink,
  Mail,
  Compass,
  Layers,
  MapPin,
  Building2,
  Share2,
} from "lucide-react";
import { IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 pb-24">
      {/* Top Context & Navigation Bar */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link
            href="/about#team"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Leadership Collective</span>
          </Link>

          <span className="text-xs font-mono text-muted-foreground">
            Profile / {slugifyName(member.name)}
          </span>
        </div>
      </div>

      {/* Hero Editorial Header */}
      <header className="border-b border-border/50 bg-gradient-to-b from-muted/30 to-background py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            {/* Portrait Avatar */}
            <div className="shrink-0 flex flex-col items-start">
              <div className="relative p-1 rounded-3xl bg-gradient-to-b from-border/80 to-transparent">
                <TeamAvatar
                  src={member.image}
                  alt={member.name}
                  initials={initials}
                  size="lg"
                  className="size-28 sm:size-36 ring-4 ring-background shadow-lg"
                />
              </div>
            </div>

            {/* Profile Intro & Title */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="outline" className="text-[11px] font-semibold text-primary border-primary/30 bg-primary/5">
                  Leadership
                </Badge>
                <span className="text-xs font-medium text-muted-foreground">
                  Budget Ndio Story Collective
                </span>
              </div>

              <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-foreground">
                  {member.name}
                </h1>
                <p className="text-lg sm:text-xl font-bold text-primary">
                  {member.role}
                </p>
              </div>

              {member.tagline && (
                <p className="text-base sm:text-lg text-foreground/80 leading-relaxed max-w-2xl font-normal">
                  {member.tagline}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {member.socials?.linkedin && member.socials.linkedin.trim() && member.socials.linkedin !== "#" && (
                  <Button asChild size="sm" className="gap-2 font-bold shadow-xs">
                    <a
                      href={member.socials.linkedin.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <IconBrandLinkedin className="size-4" />
                      <span>LinkedIn</span>
                      <ExternalLink className="size-3 text-primary-foreground/70" />
                    </a>
                  </Button>
                )}

                {member.socials?.x && member.socials.x.trim() && (
                  <Button asChild variant="outline" size="sm" className="gap-2 font-semibold">
                    <a
                      href={member.socials.x.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on X`}
                    >
                      <IconBrandX className="size-3.5" />
                      <span>X / Twitter</span>
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
      </header>

      {/* Main Two-Column Layout */}
      <main className="mx-auto max-w-6xl px-6 pt-12 md:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Main Reading / Editorial Column (7-8 cols) */}
          <article className="lg:col-span-8 space-y-12">
            
            {/* Biography & Story */}
            <section className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Compass className="size-3.5" />
                <span>Biography &amp; Background</span>
              </h2>
              
              <div className="prose prose-neutral dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-line font-sans">
                {narrative}
              </div>
            </section>

            {/* Editorial Pull Quote */}
            {member.quote && (
              <figure className="relative my-8 border-l-2 border-primary pl-6 sm:pl-8 py-2">
                <blockquote className="text-xl sm:text-2xl font-serif italic text-foreground leading-snug">
                  &ldquo;{member.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground not-italic">
                  — {member.name}, <span className="text-primary font-medium">{member.role}</span>
                </figcaption>
              </figure>
            )}

            {/* Mission Impact & Civic Vision */}
            {(member.missionImpact || member.visionContribution) && (
              <section className="space-y-6 pt-6 border-t border-border/40">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Target className="size-3.5" />
                  <span>Mission &amp; Civic Vision</span>
                </h2>

                <div className="space-y-6">
                  {member.missionImpact && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-foreground">
                        Driving the BNS Mandate
                      </h3>
                      <p className="text-base text-foreground/80 leading-relaxed font-serif italic">
                        {member.missionImpact}
                      </p>
                    </div>
                  )}

                  {member.visionContribution && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-foreground">
                        Grassroots Civic Vision
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {member.visionContribution}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Core Focus & Domain Expertise */}
            {member.focusAreas && member.focusAreas.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-border/40">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Layers className="size-3.5" />
                  <span>Focus &amp; Domain Expertise</span>
                </h2>

                <div className="flex flex-wrap gap-2 pt-1">
                  {member.focusAreas.map((focus) => (
                    <span
                      key={focus}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-muted/60 text-foreground border border-border/50 hover:border-primary/40 transition-colors"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      {focus}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Key Achievements & Milestones */}
            {member.achievements && member.achievements.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-border/40">
                <h2 className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                  <Award className="size-3.5" />
                  <span>Key Milestones &amp; Contributions</span>
                </h2>

                <ul className="space-y-3 pt-1">
                  {member.achievements.map((achievement, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm sm:text-base text-foreground/90 leading-relaxed"
                    >
                      <CheckCircle2 className="size-4 text-primary shrink-0 mt-1" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          {/* Side Meta Rail (4-5 cols, Sticky) */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            
            {/* Executive Snapshot */}
            <div className="space-y-4 rounded-2xl border border-border/60 bg-muted/20 p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                <Building2 className="size-3.5 text-primary" />
                <span>Executive Context</span>
              </h3>

              <dl className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <dt className="text-muted-foreground">Organization</dt>
                  <dd className="font-semibold text-foreground">Budget Ndio Story</dd>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                  <dt className="text-muted-foreground">Role</dt>
                  <dd className="font-semibold text-primary">{member.role}</dd>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-muted-foreground" />
                    <span>Nairobi, Kenya</span>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Associated Initiatives */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                <Layers className="size-3.5 text-primary" />
                <span>Associated Work</span>
              </h3>

              <div className="space-y-2">
                {initiatives.map((init, i) => (
                  <Link
                    key={i}
                    href={init.link}
                    className="group block p-3 rounded-xl border border-border/50 bg-background/60 hover:border-primary/40 hover:bg-muted/40 transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-primary">
                        {init.type}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {init.badge}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between gap-1">
                      <span className="truncate">{init.title}</span>
                      <ArrowRight className="size-3 shrink-0 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Direct Connect / Inquiries */}
            <div className="rounded-2xl border border-border/60 bg-muted/10 p-6 space-y-3 text-center">
              <h4 className="text-sm font-bold text-foreground">Speaking &amp; Press Inquiries</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect directly with {firstName} for policy roundtables, keynote talks, or media commentary.
              </p>
              <Button asChild size="sm" className="w-full font-bold text-xs gap-1.5">
                <Link href={`/contact?intent=collaboration&member=${encodeURIComponent(member.name)}`}>
                  <Mail className="size-3.5" />
                  <span>Get In Touch</span>
                </Link>
              </Button>
            </div>
          </aside>
        </div>

        {/* Collective Footer Section */}
        <section className="pt-20 mt-20 border-t border-border/40 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Leadership Collective
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground mt-0.5">
                Meet Other Leaders
              </h2>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-bold w-fit">
              <Link href="/about#team">
                <span>View Full Team</span>
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
                  className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-card/60 p-5 transition-all duration-200 hover:border-primary/40 hover:bg-card hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <TeamAvatar
                        src={m.image}
                        alt={m.name}
                        initials={mInitials}
                        size="md"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-foreground transition-colors group-hover:text-primary">
                          {m.name}
                        </h3>
                        <p className="text-xs font-medium text-primary">
                          {m.role}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/30 flex items-center justify-between text-xs font-semibold text-primary">
                    <span>View Profile</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
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

