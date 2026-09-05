/**
 * Landing page typography & UI tokens.
 * Reference section: landing-youtube (SectionShell + LandingSectionHeader + LandingContent).
 *
 * Font roles (src/constants/fonts.ts):
 * - Neue Montreal: universal typeface across headings, body, UI, and captions
 */
export const LANDING_TYPOGRAPHY = {
  eyebrow: "landing-eyebrow",
  eyebrowMuted: "landing-eyebrow-muted",
  highlight: "landing-highlight",
  heroTitle: "gusto-heading",
  sectionTitle: "landing-section-title",
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
  inlineIcon: "landing-inline-icon",
  inlineTitle: "landing-inline-title",
  inlineTitleEnd: "landing-inline-title-end",
} as const;
