/**
 * Partner landing evidence stills — project/event imagery only (not team headshots).
 * Hero reel uses 8 story slides; explain sections reuse keyed stills.
 */
export type PartnerLandingStill = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  programme: "connect" | "mashinani" | "wanahabari-lab";
  /** Short story title for the reel (studio-style) */
  storyTitle: string;
  /** One-line story under the title */
  storyLine: string;
};

export const PARTNER_LANDING_STILLS: PartnerLandingStill[] = [
  {
    id: "maingi-afrodad",
    src: "/images/events/afrodad-2026/james-maingi-mutinda.jpeg",
    alt: "James Maingi Mutinda presenting at AFRODAD debt conference",
    caption: "James Maingi Mutinda · AFRODAD",
    programme: "connect",
    storyTitle: "National debt on the record",
    storyLine: "Connect turns sovereign debt forums into briefings partners can act on.",
  },
  {
    id: "wajackoyah-afrodad",
    src: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
    alt: "Prof. George Wajackoyah speaking at AFRODAD plenary",
    caption: "Prof. George Wajackoyah · AFRODAD",
    programme: "connect",
    storyTitle: "Public contracts, public light",
    storyLine: "National scrutiny that stays after the plenary ends.",
  },
  {
    id: "budget-reading",
    src: "/images/treasury/budget-reading-2026.jpg",
    alt: "Budget reading documentation still",
    caption: "Budget reading · national cycle",
    programme: "connect",
    storyTitle: "When the PDF lands",
    storyLine: "We verify Treasury releases before the conversation goes quiet.",
  },
  {
    id: "nelly-mic",
    src: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
    alt: "Nelly Maina recording Budget Mtaani field briefing",
    caption: "Nelly Maina · Budget Mtaani",
    programme: "mashinani",
    storyTitle: "County money, spoken clearly",
    storyLine: "Mashinani follows equitable share into wards and services.",
  },
  {
    id: "nelly-reel",
    src: "/images/reels/nelly-maina-poster.jpg",
    alt: "Nelly Maina county budget tracking reel still",
    caption: "County delivery · Mashinani",
    programme: "mashinani",
    storyTitle: "Stay through the cycle",
    storyLine: "Estimates, assembly, disbursement — not a fly-over visit.",
  },
  {
    id: "budget-sasa",
    src: "/images/treasury/budget sasa ni delivery.jpg",
    alt: "Budget Sasa ni Delivery project still",
    caption: "Budget Sasa ni Delivery",
    programme: "mashinani",
    storyTitle: "Delivery is the proof",
    storyLine: "County budgets only matter when services show up.",
  },
  {
    id: "latif-launch",
    src: "/images/events/red-flags-book-launch/dr-lyla-latif.jpeg",
    alt: "Dr. Lyla Latif at Red Flags in Government Contracts launch",
    caption: "Dr. Lyla Latif · House of Fiscal Wisdom",
    programme: "wanahabari-lab",
    storyTitle: "Forensics after Budget Day",
    storyLine: "Wanahabari keeps newsrooms capable when headlines fade.",
  },
  {
    id: "latif-cover",
    src: "/images/events/red-flags-book-launch/red-flags-book-cover.jpeg",
    alt: "Red Flags in Government Contracts monograph cover",
    caption: "Red Flags monograph",
    programme: "wanahabari-lab",
    storyTitle: "Evidence partners can brief",
    storyLine: "Investigations and launches built for institutional use.",
  },
];

/** Three minimal programme lines for the hero (bottom-left). */
export const PARTNER_HERO_PROGRAMME_LINES = [
  {
    slug: "connect" as const,
    label: "Connect",
    line: "Watches the national flow.",
    href: "/programmes/connect",
  },
  {
    slug: "mashinani" as const,
    label: "Mashinani",
    line: "Follows money into counties.",
    href: "/programmes/mashinani",
  },
  {
    slug: "wanahabari-lab" as const,
    label: "Wanahabari",
    line: "Keeps scrutiny after Budget Day.",
    href: "/programmes/wanahabari-lab",
  },
];

export type PartnerProgrammeExplain = {
  slug: "connect" | "mashinani" | "wanahabari-lab";
  name: string;
  eyebrow: string;
  title: string;
  problem: string;
  how: string;
  why: string;
  lifecycle: string;
  href: string;
  ctaLabel: string;
  stillIds: string[];
};

export const PARTNER_PROGRAMME_EXPLAINS: PartnerProgrammeExplain[] = [
  {
    slug: "connect",
    name: "BNS Connect",
    eyebrow: "01 · National flow",
    title: "How Connect watches the national budget.",
    problem:
      "Partners see a KSh 4.8T national budget land as PDFs — then go silent after Budget Day.",
    how:
      "We verify Treasury releases against published tables and package briefings, debt forums, and story products institutions can reuse — from AFRODAD plenaries with James Maingi Mutinda and Prof. George Wajackoyah to year-round Connect outputs.",
    why:
      "Without a national baseline, county embeds and newsroom work have nothing solid to measure against.",
    lifecycle:
      "Formulation → Budget Day → year-round national scrutiny",
    href: "/programmes/connect",
    ctaLabel: "Explore Connect",
    stillIds: ["maingi-afrodad", "wajackoyah-afrodad"],
  },
  {
    slug: "mashinani",
    name: "BNS Mashinani",
    eyebrow: "02 · County delivery",
    title: "How Mashinani follows money into counties.",
    problem:
      "Equitable share and county budgets disappear in fly-over reporting that never stays through the cycle.",
    how:
      "We embed in Kakamega, Kilifi, Nakuru, and Wajir across estimates, assembly, and delivery — field briefings and scorecards partners can cite, including county tracking led on air and on the ground with Nelly Maina.",
    why:
      "National numbers only matter if money reaches wards, clinics, and roads.",
    lifecycle:
      "C-BROP / estimates → county assembly → disbursement & delivery",
    href: "/programmes/mashinani",
    ctaLabel: "Explore Mashinani",
    stillIds: ["nelly-mic", "nelly-reel"],
  },
  {
    slug: "wanahabari-lab",
    name: "Wanahabari Lab",
    eyebrow: "03 · Newsroom capacity",
    title: "How Wanahabari keeps scrutiny after Budget Day.",
    problem:
      "Newsrooms lack forensic capacity for the 364 days after Budget Day theatre.",
    how:
      "We train and co-produce with journalists — investigations and launches partners can brief against, including Dr. Lyla Latif’s Red Flags work with House of Fiscal Wisdom.",
    why:
      "Scrutiny dies if media cannot interrogate contracts, debt, and procurement once headlines fade.",
    lifecycle:
      "Post–Budget Day → filings, investigations, public narrative",
    href: "/programmes/wanahabari-lab",
    ctaLabel: "Explore Wanahabari Lab",
    stillIds: ["latif-launch", "latif-cover"],
  },
];

export function stillsForIds(ids: string[]): PartnerLandingStill[] {
  return ids
    .map((id) => PARTNER_LANDING_STILLS.find((s) => s.id === id))
    .filter((s): s is PartnerLandingStill => Boolean(s));
}
