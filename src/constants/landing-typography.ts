/**
 * Landing page typography system.
 *
 * Font roles (see src/constants/fonts.ts):
 * - font-base (Neue Montreal): body copy, UI labels, descriptions
 * - font-heading (Satoshi): section titles, emphasis highlights
 * - font-handwriting (Caveat): decorative accents only (not used on landing)
 *
 * Section audit (premium-landing-client.tsx):
 * | Section            | Eyebrow              | Title              | Highlight        | Body              |
 * |--------------------|----------------------|--------------------|------------------|-------------------|
 * | LandingHero        | —                    | gusto-heading      | landing-highlight| gusto-text scale  |
 * | LandingTikTokVideo | landing-eyebrow      | gusto-heading      | landing-highlight| landing-body      |
 * | LandingYoutube     | landing-eyebrow      | gusto-heading      | landing-highlight| landing-lead      |
 * | PartnersMarquee    | landing-eyebrow-muted| —                  | —                | —                 |
 * | LandingTeam        | landing-eyebrow      | gusto-heading      | landing-highlight| landing-lead      |
 * | TimelineBlock01    | Badge (shadcn)       | gusto-heading      | landing-highlight| landing-body      |
 * | Testimonials       | Badge (shadcn)       | gusto-heading      | —                | card copy         |
 * | CloudinaryGallery  | landing-eyebrow      | gusto-heading      | landing-highlight| landing-lead      |
 * | BNSStudioSection   | landing-eyebrow      | gusto-heading      | —                | gusto-text scale  |
 * | NewsletterPopup    | —                    | gusto-subheading   | —                | gusto-text        |
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
} as const;
