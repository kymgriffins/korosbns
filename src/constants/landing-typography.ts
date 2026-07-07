/**
 * Landing page typography & UI tokens.
 * Reference section: landing-youtube (SectionShell + LandingSectionHeader + LandingContent).
 *
 * Font roles (src/constants/fonts.ts):
 * - font-base (Neue Montreal): body, UI, captions
 * - font-heading (Satoshi): titles, highlights, card headings
 */
export const LANDING_TYPOGRAPHY = {
  eyebrow: "landing-eyebrow",
  eyebrowMuted: "landing-eyebrow-muted",
  highlight: "landing-highlight",
  sectionTitle: "gusto-heading",
  subheading: "gusto-subheading",
  lead: "landing-lead",
  body: "landing-body",
  prose: "gusto-text",
  cardTitle: "landing-card-title",
  itemTitle: "landing-item-title",
  role: "landing-role",
  caption: "landing-caption",
  marqueeLabel: "landing-marquee-label",
  btnPrimary: "landing-btn-primary",
  btnHero: "landing-btn-hero",
  btnOutline: "landing-btn-outline",
  mediaFrame: "landing-media-frame",
} as const;
