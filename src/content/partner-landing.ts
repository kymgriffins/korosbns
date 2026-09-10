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
    id: "townhall-room",
    src: "/images/cohort1 groundworks/129A3964.jpg",
    alt: "Audience seated in a town hall while a facilitator speaks at the front",
    caption: "Town hall · Mashinani",
    programme: "mashinani",
    storyTitle: "Hall full of questions",
    storyLine: "Desks filled, camera rolling — a May town hall listens from the back row.",
  },
  {
    id: "hall-workshop",
    src: "/images/hall/129A4248.jpg",
    alt: "Working groups at desks during a civic convening workshop",
    caption: "Convening · Mashinani",
    programme: "mashinani",
    storyTitle: "Tables mid-brief",
    storyLine: "Small groups lean over phones and notebooks while a facilitator checks in.",
  },
  {
    id: "townhall-brief",
    src: "/images/towwnhallmay/129A3912.jpg",
    alt: "Speaker with microphone and papers at a Budget Ndio Story town hall",
    caption: "Floor briefing · Mashinani",
    programme: "mashinani",
    storyTitle: "Mic and estimates",
    storyLine: "Papers in hand, mic open — the briefing stays close to the room.",
  },
  {
    id: "floor-voice",
    src: "/images/stakeholders/129A4113.jpg",
    alt: "Young speaker gesturing with a microphone at a civic convening",
    caption: "Floor mic · Connect",
    programme: "connect",
    storyTitle: "A point on the floor",
    storyLine: "A speaker takes the mic under the Budget Ndio Story banner.",
  },
  {
    id: "hall-camera",
    src: "/images/media/129A4039.jpg",
    alt: "Crew member filming a town hall on a gimbal camera",
    caption: "Field capture · Wanahabari",
    programme: "wanahabari-lab",
    storyTitle: "Recording the room",
    storyLine: "Gimbal up — the convening is filmed as it happens.",
  },
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
    id: "cabri-pfm",
    src: "https://i.ytimg.com/vi/kWpY4K1uI20/hqdefault.jpg",
    alt: "CABRI Digital PFM Reform Stories YouTube thumbnail",
    caption: "CABRI · Digital PFM reforms",
    programme: "connect",
    storyTitle: "Ministries on the record",
    storyLine: "CABRI country experiences — digital PFM, filmed for peer learning.",
  },
  {
    id: "latif-launch",
    src: "https://i.ytimg.com/vi/G5ddu4I6mNs/hqdefault.jpg",
    alt: "Illicit financial flows briefing YouTube thumbnail — Dr. Lyla Latif",
    caption: "Dr. Lyla Latif · House of Fiscal Wisdom",
    programme: "wanahabari-lab",
    storyTitle: "Forensics after Budget Day",
    storyLine: "Dr. Lyla Latif — illicit flows briefing partners can cite.",
  },
  {
    id: "terra-film",
    src: "https://i.ytimg.com/vi/it8rOKSYKnc/hqdefault.jpg",
    alt: "Project TERRA YouTube thumbnail",
    caption: "Project TERRA · House of Fiscal Wisdom",
    programme: "wanahabari-lab",
    storyTitle: "Platforms, women, revenue",
    storyLine: "Project TERRA — where platform tax design meets care work.",
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
    stillIds: ["floor-voice", "cabri-pfm"],
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
    stillIds: ["townhall-room", "townhall-brief"],
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
    stillIds: ["hall-camera", "latif-launch"],
  },
];

export function stillsForIds(ids: string[]): PartnerLandingStill[] {
  return ids
    .map((id) => PARTNER_LANDING_STILLS.find((s) => s.id === id))
    .filter((s): s is PartnerLandingStill => Boolean(s));
}
