/**
 * Partner landing evidence stills — project/event imagery only (not team headshots).
 */
export type PartnerLandingStill = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  programme: "connect" | "mashinani" | "wanahabari-lab" | "studio";
};

export const PARTNER_LANDING_STILLS: PartnerLandingStill[] = [
  {
    id: "maingi-afrodad",
    src: "/images/events/afrodad-2026/james-maingi-mutinda.jpeg",
    alt: "James Maingi Mutinda presenting at AFRODAD debt conference",
    caption: "James Maingi Mutinda · AFRODAD · BNS Connect",
    programme: "connect",
  },
  {
    id: "wajackoyah-afrodad",
    src: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
    alt: "Prof. George Wajackoyah speaking at AFRODAD plenary",
    caption: "Prof. George Wajackoyah · AFRODAD · national debt scrutiny",
    programme: "connect",
  },
  {
    id: "nelly-mic",
    src: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
    alt: "Nelly Maina recording Budget Mtaani field briefing",
    caption: "Nelly Maina · Budget Mtaani · BNS Mashinani",
    programme: "mashinani",
  },
  {
    id: "nelly-reel",
    src: "/images/reels/nelly-maina-poster.jpg",
    alt: "Nelly Maina county budget tracking reel still",
    caption: "County equitable share · ground delivery",
    programme: "mashinani",
  },
  {
    id: "latif-launch",
    src: "/images/events/red-flags-book-launch/dr-lyla-latif.jpeg",
    alt: "Dr. Lyla Latif at Red Flags in Government Contracts launch",
    caption: "Dr. Lyla Latif · House of Fiscal Wisdom · Wanahabari Lab",
    programme: "wanahabari-lab",
  },
  {
    id: "latif-cover",
    src: "/images/events/red-flags-book-launch/red-flags-book-cover.jpeg",
    alt: "Red Flags in Government Contracts monograph cover",
    caption: "Red Flags monograph · forensic procurement evidence",
    programme: "wanahabari-lab",
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
