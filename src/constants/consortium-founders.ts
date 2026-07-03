export type ConsortiumFounder = {
  id: string;
  name: string;
  website: string;
  logoUrl: string;
  role: string;
  description: string;
};

export const CONSORTIUM_FOUNDERS: ConsortiumFounder[] = [
  {
    id: "continental-pot",
    name: "The Continental Pot",
    website: "https://continentalpot.africa/",
    logoUrl:
      "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284902/The-Continental-Pot-Vertical-removebg-preview_b9mpzf.png",
    role: "Consortium leadership and public interest strategy",
    description:
      "A leading platform for Pan-African narratives, focusing on governance, equity, and sustainable development across the continent. The Continental Pot anchors BNS consortium strategy and long-term civic impact.",
  },
  {
    id: "colour-twist-media",
    name: "Colour Twist Media",
    website: "https://colortwistmedia.com/",
    logoUrl:
      "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284904/colortwist_pv33rt.png",
    role: "Creative production and youth-facing media execution",
    description:
      "Experts in digital creativity, producing compelling visual content that mobilizes youth and simplifies complex fiscal data into formats young Kenyans actually watch and share.",
  },
  {
    id: "sen-media-events",
    name: "Sen Media & Events",
    website: "https://senmedia-events.co.ke/",
    logoUrl:
      "https://res.cloudinary.com/dn8lut2fc/image/upload/v1779284903/senmedia_ylb5wt.png",
    role: "Media production, events, and civic storytelling support",
    description:
      "Specializing in high-impact media events and civic storytelling that bridges the gap between policy debates and public understanding on the ground.",
  },
];

export const CONSORTIUM_SUMMARY =
  "BNS is a Kenya-wide youth-led consortium founded by The Continental Pot, Colour Twist Media, and Sen Media & Events — combining fiscal analysis, creative production, and events to grow budget literacy nationwide.";
