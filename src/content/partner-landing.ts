/**
 * Partner landing evidence stills — project/event imagery only (not team headshots).
 * Hero reel = project moments. Programme sections = one investment lede each.
 * Shared vocabulary (do not diverge): Connect / Mashinani / Wanahabari noun phrases.
 *
 * Communication spine (RF-shaped, BNS-honest):
 * thesis → who/how → three bets → featured evidence → partner CTA.
 * No fabricated reach stats — proof is named programmes and published work.
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
    /** What we do */
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

/**
 * Brand-level promise + who/how — first text band after the hero reel.
 * Mirrors RF “Big Bets, Real Results” → commitment → path to proof.
 */
export const PARTNER_LANDING_THESIS = {
  eyebrow: "Who we are",
  title: "Three bets. Year-round accountability.",
  body:
    "Budget Ndio Story verifies what Treasury and counties publish, embeds where delivery happens, and trains newsrooms to stay forensic after Budget Day — so partners fund accountability they can brief and cite.",
  /** Shared method whisper — verify → embed → train/co-produce */
  method: "Verify → embed → train & co-produce",
} as const;

/** Featured-projects intro — stories behind the evidence (no vanity millions). */
export const PARTNER_FEATURED_INTRO = {
  eyebrow: "Stories behind the evidence",
  headline: "Projects partners can brief against",
  lede:
    "Published films and convenings — AFRODAD debt forums, Red Flags, and Project TERRA — with local event photography as cover art. Titles stay fresh from YouTube; reach claims stay off the page.",
} as const;

/** Closing partnership band — invest against the three phrases. */
export const PARTNER_LANDING_CTA = {
  eyebrow: "Partner with us",
  title: "Fund the bet that fits your mandate.",
  description:
    "Co-fund national budget intelligence, county delivery verification, or newsroom scrutiny — with production captured through BNS Studio.",
  ctaLabel: "Discuss a partnership",
  secondaryLabel: "View programmes",
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
    id: "movine-floor",
    src: "/images/avatars/movine/129A4293.jpg",
    alt: "Movine Omondi speaking beside a Budget Ndio Story banner at a civic convening",
    caption: "Movine Omondi · Floor",
    programme: "connect",
    storyTitle: "Banner and brief",
    storyLine: "Movine takes the floor under the Budget Ndio Story banner.",
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
    id: "wajackoyah-afrodad",
    src: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
    alt: "Prof. George Wajackoyah speaking on a panel at an AFRODAD civic convening",
    caption: "Prof. George Wajackoyah · AFRODAD",
    programme: "connect",
    storyTitle: "Panel under the brief",
    storyLine: "Wajackoyah on the mic — Read. Understand. Change the outcome.",
  },
  {
    id: "latif-launch",
    src: "/images/events/red-flags-book-launch/dr-lyla-latif.jpeg",
    alt: "Dr. Lyla Latif addressing partners at the Red Flags in Government Contracts launch",
    caption: "Dr. Lyla Latif · Red Flags",
    programme: "wanahabari-lab",
    storyTitle: "Red Flags in the room",
    storyLine: "Dr. Lyla Latif — AFRODAD week, Red Flags launch, mic still live.",
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
  /** Display index — RF-style numbered big bet */
  number: "01" | "02" | "03";
  name: string;
  eyebrow: string;
  /** Must equal PARTNER_PROGRAMME_VOCAB[slug].phrase */
  title: string;
  /** Plain stakes — what the programme does */
  lede: string;
  /** What success looks like — named proof, no fabricated metrics */
  success: string;
  /** Quiet lifecycle whisper */
  cycle: string;
  href: string;
  ctaLabel: string;
  stillIds: string[];
};

export const PARTNER_PROGRAMME_EXPLAINS: PartnerProgrammeExplain[] = [
  {
    slug: "connect",
    number: "01",
    name: PARTNER_PROGRAMME_VOCAB.connect.name,
    eyebrow: PARTNER_PROGRAMME_VOCAB.connect.label,
    title: PARTNER_PROGRAMME_VOCAB.connect.phrase,
    lede:
      "We verify what Treasury publishes and keep national debt and allocation questions alive after Budget Day.",
    success:
      "Success looks like a baseline partners can fund and cite — AFRODAD debt forums, continental panels, continuous scrutiny.",
    cycle: "Formulation → Budget Day → continuous scrutiny",
    href: PARTNER_PROGRAMME_VOCAB.connect.href,
    ctaLabel: "Read more",
    stillIds: ["maingi-afrodad", "wajackoyah-afrodad"],
  },
  {
    slug: "mashinani",
    number: "02",
    name: PARTNER_PROGRAMME_VOCAB.mashinani.name,
    eyebrow: PARTNER_PROGRAMME_VOCAB.mashinani.label,
    title: PARTNER_PROGRAMME_VOCAB.mashinani.phrase,
    lede:
      "Full-cycle embeds in Kakamega, Kilifi, Nakuru, and Wajir track whether equitable share reaches clinics, roads, and schools.",
    success:
      "Success looks like scorecards, town halls, and field briefings that show delivery — not estimates alone.",
    cycle: "Estimates → assembly → disbursement & delivery",
    href: PARTNER_PROGRAMME_VOCAB.mashinani.href,
    ctaLabel: "Read more",
    stillIds: ["townhall-room", "townhall-brief"],
  },
  {
    slug: "wanahabari-lab",
    number: "03",
    name: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].name,
    eyebrow: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].label,
    title: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].phrase,
    lede:
      "Training and co-production keep journalists forensic after Budget Day — when the spending story actually begins.",
    success:
      "Success looks like investigations and launches partners can brief against — Red Flags, TERRA, newsroom-ready scrutiny.",
    cycle: "Post–Budget Day → investigations & public narrative",
    href: PARTNER_PROGRAMME_VOCAB["wanahabari-lab"].href,
    ctaLabel: "Read more",
    stillIds: ["hall-camera", "latif-launch"],
  },
];

export function stillsForIds(ids: string[]): PartnerLandingStill[] {
  return ids
    .map((id) => PARTNER_LANDING_STILLS.find((s) => s.id === id))
    .filter((s): s is PartnerLandingStill => Boolean(s));
}
