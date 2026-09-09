import { citizenApi } from "@/lib/api-client";
import { withFallback } from "@/data/adapter";
import type { HubEvent } from "@/lib/citizen-content";
import { mapApiEvent } from "@/lib/citizen-content";

export type { HubEvent };

const DEFAULT_EVENTS: HubEvent[] = [
  {
    id: "event-afrodad-debt-conference-2026",
    title: "AFRODAD Pan-African Debt Conference 2026: Sovereign Fiscal Justice",
    starts_at: "2026-08-14T09:00:00+03:00",
    location: "Nairobi, Kenya · Pan-African Hybrid Plenary",
    location_url: "https://afrodad.org",
    programme: "connect",
    programme_label: "BNS Connect",
    image: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
    image_url: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
    image_aspect_ratio: 1.5,
    image_orientation: "landscape",
    snippet: "A BNS Connect Continental Dialogue with AFRODAD: Convening African fiscal policymakers, civil society leaders, and economic justice advocates to confront sovereign debt distress, illegitimate debt audits, and predatory international lending frameworks.",
    body: "Co-convened under BNS Connect in strategic partnership with AFRODAD (African Forum and Network on Debt and Development), this landmark conference gathers continental delegations, independent economists, and grassroots accountability leaders in Nairobi.\n\nJames Maingi Mutinda (Budget Ndio Story Executive Director) and Prof. George Wajackoyah led high-impact plenary interventions detailing how non-transparent commercial external loans and debt service obligations are directly suffocating municipal budgets, devolved healthcare, and public service delivery across East and Central Africa.\n\nThe symposium established three actionable African-led debt resolution mechanisms: mandatory legislative pre-approval for sovereign guarantees, citizen-led forensic debt audits, and an African Sovereign Borrowers Club to counter unilateral credit rating downgrades.",
    body_html: "<p>Co-convened under <strong>BNS Connect</strong> in strategic partnership with <strong>AFRODAD</strong> (African Forum and Network on Debt and Development), this landmark conference gathers continental delegations, independent economists, and grassroots accountability leaders in Nairobi.</p><p><strong>James Maingi Mutinda</strong> (Budget Ndio Story Executive Director) and <strong>Prof. George Wajackoyah</strong> led high-impact plenary interventions detailing how non-transparent commercial external loans and debt service obligations are directly suffocating municipal budgets, devolved healthcare, and public service delivery across East and Central Africa.</p><p>The symposium established three actionable African-led debt resolution mechanisms: mandatory legislative pre-approval for sovereign guarantees, citizen-led forensic debt audits, and an African Sovereign Borrowers Club to counter unilateral credit rating downgrades.</p>",
    key_speakers: [
      {
        name: "James Maingi Mutinda",
        role: "Executive Director",
        organization: "Budget Ndio Story",
        image_url: "/images/events/afrodad-2026/james-maingi-mutinda.jpeg"
      },
      {
        name: "Prof. George Wajackoyah",
        role: "Legal Scholar & Public Policy Advocate",
        organization: "Public Interest Legal Alliance",
        image_url: "/images/events/afrodad-2026/george-wajackoyah.jpeg"
      },
      {
        name: "AFRODAD Secretariat Delegation",
        role: "Sovereign Debt Specialists",
        organization: "AFRODAD"
      }
    ],
    gallery_images: [
      {
        url: "/images/events/afrodad-2026/james-maingi-mutinda.jpeg",
        alt: "James Maingi Mutinda addressing AFRODAD delegates",
        caption: "James Maingi Mutinda (Budget Ndio Story) presenting forensic evidence on sovereign debt service impacts.",
        width: 1024,
        height: 683,
        aspect_ratio: 1.5
      },
      {
        url: "/images/events/afrodad-2026/george-wajackoyah.jpeg",
        alt: "Prof. George Wajackoyah speaking at AFRODAD plenary",
        caption: "Prof. George Wajackoyah delivering address on legal sovereignty, public contract transparency, and debt cancellation.",
        width: 1024,
        height: 683,
        aspect_ratio: 1.5
      }
    ],
    sponsors: [
      {
        name: "AFRODAD (African Forum & Network on Debt & Development)",
        website_url: "https://afrodad.org",
        tier: "Convening Partner",
        description: "Pan-African platform championing debt cancellation, responsible borrowing, and sovereign fiscal independence."
      },
      {
        name: "Budget Ndio Story (BNS Connect)",
        website_url: "https://budgetndiostory.org",
        tier: "Lead Civic Co-Convener",
        description: "Empowering citizens through forensic budget intelligence and civic participation corridors."
      },
      {
        name: "House of Fiscal Wisdom",
        website_url: "https://www.house-of-fiscal-wisdom.org",
        tier: "Research Partner",
        description: "Global Commission on Financing Development headquartered in Nairobi."
      }
    ]
  },
  {
    id: "event-red-flags-book-launch",
    title: "Book Launch: 'Red Flags in Government Contracts' — Dr. Lyla Latif",
    starts_at: "2026-08-14T14:30:00+03:00",
    location: "Nairobi, Kenya · House of Fiscal Wisdom & AFRODAD Symposium Hall",
    location_url: "https://www.house-of-fiscal-wisdom.org",
    programme: "wanahabari-lab",
    programme_label: "Wanahabari Lab",
    image: "/images/events/red-flags-book-launch/red-flags-book-cover.jpeg",
    image_url: "/images/events/red-flags-book-launch/red-flags-book-cover.jpeg",
    image_aspect_ratio: 0.668,
    image_orientation: "portrait",
    video_url: "https://www.youtube.com/watch?v=G5ddu4I6mNs",
    video_title: "Learn about illicit financial flows in Benin and Cabo Verde — Dr. Lyla Latif",
    snippet: "A Wanahabari Lab Investigation & Monograph Launch with House of Fiscal Wisdom: Unveiling Dr. Lyla Latif's definitive investigative text on forensic indicators, procurement manipulation, and illicit capital flight disguised as sovereign public infrastructure contracts.",
    body: "In conjunction with Wanahabari Lab and the House of Fiscal Wisdom, Dr. Lyla Latif officially launched her groundbreaking investigative monograph: 'Red Flags in Government Contracts'.\n\nThe book provides citizen investigators, investigative journalists, and parliamentary budget committees with an empirical taxonomy of red flags: from single-sourced engineering kickbacks to transfer pricing schemes and offshore shell vehicles disguised as foreign direct investment.\n\nAccompanied by a live investigative briefing on illicit financial flows in Benin and Cabo Verde, the launch directly pairs academic rigor with open-source civic oversight tools developed under BNS Wanahabari Lab to empower citizens to read, interrogate, and challenge sovereign procurement contracts before public debt is locked in.",
    body_html: "<p>In conjunction with <strong>Wanahabari Lab</strong> and the <strong>House of Fiscal Wisdom</strong>, <strong>Dr. Lyla Latif</strong> officially launched her groundbreaking investigative monograph: <em>'Red Flags in Government Contracts'</em>.</p><p>The book provides citizen investigators, investigative journalists, and parliamentary budget committees with an empirical taxonomy of red flags: from single-sourced engineering kickbacks to transfer pricing schemes and offshore shell vehicles disguised as foreign direct investment.</p><p>Accompanied by a live investigative briefing on illicit financial flows in Benin and Cabo Verde, the launch directly pairs academic rigor with open-source civic oversight tools developed under BNS Wanahabari Lab to empower citizens to read, interrogate, and challenge sovereign procurement contracts before public debt is locked in.</p>",
    key_speakers: [
      {
        name: "Dr. Lyla Latif",
        role: "Author & Director",
        organization: "House of Fiscal Wisdom & University of Nairobi",
        image_url: "/images/events/red-flags-book-launch/dr-lyla-latif.jpeg"
      },
      {
        name: "BNS Forensic Research Desk",
        role: "Civic Data Lead",
        organization: "Budget Ndio Story (Wanahabari Lab)"
      }
    ],
    gallery_images: [
      {
        url: "/images/events/red-flags-book-launch/red-flags-book-cover.jpeg",
        alt: "Book Cover: Red Flags in Government Contracts by Dr. Lyla Latif",
        caption: "Official Monograph Cover: 'Red Flags in Government Contracts' by Dr. Lyla Latif (1024x1534 portrait monograph).",
        width: 1024,
        height: 1534,
        aspect_ratio: 0.668
      },
      {
        url: "/images/events/red-flags-book-launch/dr-lyla-latif.jpeg",
        alt: "Dr. Lyla Latif presenting forensic findings",
        caption: "Dr. Lyla Latif detailing contract manipulation mechanisms during the Nairobi book launch plenary.",
        width: 1024,
        height: 683,
        aspect_ratio: 1.5
      }
    ],
    sponsors: [
      {
        name: "House of Fiscal Wisdom",
        website_url: "https://www.house-of-fiscal-wisdom.org",
        tier: "Publishing & Research Host",
        description: "Global Commission on Financing Development conducting forensic public finance and tech governance investigations."
      },
      {
        name: "Budget Ndio Story (Wanahabari Lab)",
        website_url: "https://budgetndiostory.org",
        tier: "Forensic Media Partner",
        description: "Translating complex government contract data into actionable public investigative evidence."
      },
      {
        name: "AFRODAD",
        website_url: "https://afrodad.org",
        tier: "Continental Policy Partner",
        description: "Championing sovereign debt transparency and public procurement accountability across Africa."
      }
    ]
  }
];

let _events: HubEvent[] = [...DEFAULT_EVENTS];

function mergeDefaultEvents(apiEvents: HubEvent[]): HubEvent[] {
  const map = new Map<string, HubEvent>();
  for (const e of DEFAULT_EVENTS) {
    map.set(e.id, e);
  }
  for (const e of apiEvents) {
    map.set(e.id, e);
  }
  return Array.from(map.values()).sort((a, b) => {
    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
  });
}

export const eventData = {
  get: () => _events,
  set: (items: HubEvent[]) => { _events = items; },
  fetch: () =>
    withFallback(
      "events",
      () => citizenApi.getEvents().then((r) => {
        const results = (r as any).results ?? [];
        const mapped = results.map(mapApiEvent);
        const merged = mergeDefaultEvents(mapped);
        _events = merged;
        return merged;
      }),
      () => _events,
    ),
  fetchById: (id: string) =>
    withFallback(
      "events",
      () => citizenApi.getEvent(id).then(mapApiEvent),
      () => _events.find((e) => e.id === id) ?? DEFAULT_EVENTS.find((e) => e.id === id) ?? null,
    ),
};
