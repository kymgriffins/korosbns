/**
 * Partner landing evidence stills — project/event imagery only (not team headshots).
 * Hero reel = project moments. Programme sections = one investment lede each.
 * Shared vocabulary (do not diverge): Connect / Mashinani / Wanahabari noun phrases.
 */
export type PartnerLandingStill = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  programme: "connect" | "mashinani" | "wanahabari-lab";
  /** Project moment title — not a programme pitch */
  storyTitle: string;
  /** One observational line — no investment ask */
  storyLine: string;
};

/** Canonical programme noun phrases — hero, sections, and CTA must reuse these. */
export const PARTNER_PROGRAMME_VOCAB = {
  connect: {
    slug: "connect" as const,
    label: "Connect",
    name: "BNS Connect",
    phrase: "National budget intelligence",
    href: "/programmes/connect",
  },
  mashinani: {
    slug: "mashinani" as const,
    label: "Mashinani",
    name: "BNS Mashinani",
    phrase: "County delivery verification",
    href: "/programmes/mashinani",
  },
  "wanahabari-lab": {
    slug: "wanahabari-lab" as const,
    label: "Wanahabari",
    name: "Wanahabari Lab",
    phrase: "Newsroom scrutiny",
    href: "/programmes/wanahabari-lab",
  },
} as const;

export const PARTNER_LANDING_STILLS: PartnerLandingStill[] = [
  {
    id: "maingi-afrodad",
    src: "/images/events/afrodad-2026/james-maingi-mutinda.jpeg",
    alt: "James Maingi Mutinda presenting at AFRODAD debt conference",
    caption: "James Maingi Mutinda · AFRODAD",
    programme: "connect",
    storyTitle: "Debt on the record",
    storyLine: "James Maingi Mutinda at AFRODAD — a continental forum, held for the brief.",
  },
  {
    id: "wajackoyah-afrodad",
    src: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
    alt: "Prof. George Wajackoyah speaking at AFRODAD plenary",
    caption: "Prof. George Wajackoyah · AFRODAD",
    programme: "connect",
    storyTitle: "Contracts in public light",
    storyLine: "Prof. George Wajackoyah — plenary scrutiny that outlives the room.",
  },
  {
    id: "budget-reading",
    src: "/images/treasury/budget-reading-2026.jpg",
    alt: "Budget reading documentation still",
    caption: "Budget reading · national cycle",
    programme: "connect",
    storyTitle: "When the PDF lands",
    storyLine: "Treasury publishes. Verification starts before the week goes quiet.",
  },
  {
    id: "nelly-mic",
    src: "/images/marketing newsletter subcribe/Nelly with The Mic.jpg",
    alt: "Nelly Maina recording Budget Mtaani field briefing",
    caption: "Nelly Maina · Budget Mtaani",
    programme: "mashinani",
    storyTitle: "County money, spoken",
    storyLine: "Nelly Maina on Budget Mtaani — equitable share, in plain language.",
  },
  {
    id: "nelly-reel",
    src: "/images/reels/nelly-maina-poster.jpg",
    alt: "Nelly Maina county budget tracking reel still",
    caption: "County delivery · Mashinani",
    programme: "mashinani",
    storyTitle: "Through the cycle",
    storyLine: "Estimates, assembly, disbursement — the embed stays.",
  },
  {
    id: "budget-sasa",
    src: "/images/treasury/budget sasa ni delivery.jpg",
    alt: "Budget Sasa ni Delivery project still",
    caption: "Budget Sasa ni Delivery",
    programme: "mashinani",
    storyTitle: "Delivery is the proof",
    storyLine: "County numbers only hold when clinics, roads, and schools show up.",
  },
  {
    id: "latif-launch",
    src: "/images/events/red-flags-book-launch/dr-lyla-latif.jpeg",
    alt: "Dr. Lyla Latif at Red Flags in Government Contracts launch",
    caption: "Dr. Lyla Latif · House of Fiscal Wisdom",
    programme: "wanahabari-lab",
    storyTitle: "Forensics after Budget Day",
    storyLine: "Dr. Lyla Latif — Red Flags, launched with House of Fiscal Wisdom.",
  },
  {
    id: "latif-cover",
    src: "/images/events/red-flags-book-launch/red-flags-book-cover.jpeg",
    alt: "Red Flags in Government Contracts monograph cover",
    caption: "Red Flags monograph",
    programme: "wanahabari-lab",
    storyTitle: "Evidence for the brief",
    storyLine: "A monograph newsrooms and partners can cite the same week.",
  },
];

/** Hero bottom-left: programme names only — phrase lives in sections. */
export const PARTNER_HERO_PROGRAMME_LINES = [
  PARTNER_PROGRAMME_VOCAB.connect,
  PARTNER_PROGRAMME_VOCAB.mashinani,
  PARTNER_PROGRAMME_VOCAB["wanahabari-lab"],
].map((p) => ({
  slug: p.slug,
  label: p.label,
  href: p.href,
}));

export type PartnerProgrammeExplain = {
  slug: "connect" | "mashinani" | "wanahabari-lab";
  name: string;
  eyebrow: string;
  /** Must equal PARTNER_PROGRAMME_VOCAB[slug].phrase */
  title: string;
  /** Single straightforward paragraph — no problem/how scaffolding */
  lede: string;
  /** Quiet lifecycle whisper */
  cycle: string;
  href: string;
  ctaLabel: string;
  stillIds: string[];
};

export const PARTNER_PROGRAMME_EXPLAINS: PartnerProgrammeExplain[] = [
  {
    slug: "connect",
    name: PARTNER_PROGRAMME_VOCAB.connect.name,
    eyebrow: PARTNER_PROGRAMME_VOCAB.connect.label,
    title: PARTNER_PROGRAMME_VOCAB.connect.phrase,
    lede:
      "We verify what Treasury publishes and keep national debt and allocation questions alive after Budget Day — so partners have a baseline they can fund against.",
    cycle: "Formulation → Budget Day → continuous scrutiny",
    href: PARTNER_PROGRAMME_VOCAB.connect.href,
    ctaLabel: "Partner on Connect",
    stillIds: ["maingi-afrodad", "wajackoyah-afrodad"],
  },
  {
    slug: "mashinani",
    name: PARTNER_PROGRAMME_VOCAB.mashinani.name,
    eyebrow: PARTNER_PROGRAMME_VOCAB.mashinani.label,
    title: PARTNER_PROGRAMME_VOCAB.mashinani.phrase,
    lede:
      "Full-cycle embeds in Kakamega, Kilifi, Nakuru, and Wajir — scorecards and field briefings that show whether equitable share reaches clinics, roads, and schools.",
    cycle: "Estimates → assembly → disbursement & delivery",
    href: PARTNER_PROGRAMME_VOCAB.mashinani.href,
    ctaLabel: "Partner on Mashinani",
    stillIds: ["nelly-mic", "nelly-reel"],
  },
  {
    slug: "wanahabari-lab",
    name: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].name,
    eyebrow: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].label,
    title: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].phrase,
    lede:
      "Training and co-production that keep journalists forensic after Budget Day — investigations and launches partners can brief against.",
    cycle: "Post–Budget Day → investigations & public narrative",
    href: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].href,
    ctaLabel: "Partner on Wanahabari Lab",
    stillIds: ["latif-launch", "latif-cover"],
  },
];

export function stillsForIds(ids: string[]): PartnerLandingStill[] {
  return ids
    .map((id) => PARTNER_LANDING_STILLS.find((s) => s.id === id))
    .filter((s): s is PartnerLandingStill => Boolean(s));
}
