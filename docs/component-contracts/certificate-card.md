# Component Contract — Certificate Card

## Component Name

`CertificateCard` (v2 — not yet implemented)

## Purpose

Celebrate **course completion** and provide shareable/downloadable credential.

## Used On

- Progress page (v2)
- Course complete modal (v2)
- Profile → Certificates (v2)

## Variants

| Variant | When |
|---------|------|
| Earned | Full color, download CTA |
| In progress | Locked preview |
| Share | Social share buttons |

## States

Locked · Earned · Downloading

## Interactions

| Action | Result |
|--------|--------|
| Download | PDF certificate |
| Share | Native share / copy link |

## Props / Data

```ts
courseTitle: string
completedAt: string
learnerName: string
credentialId: string
```

## Accessibility

- Download button labelled with course name
- Achievement announced on earn

## Motion

Earn: confetti + scale 1.05 → 1.0, 400ms (celebration exception to 250ms rule).

## Dependencies

- Course completion event
- `AchievementBadge`

## Design Tokens

- `LMS_RADIUS.cardLg`
- Minimal border, no heavy shadow

## Navigation Laws

13 — one primary CTA (Download OR Share, not both primary)

## Implementation Path

`src/components/lms/certificate-card.tsx` (future)

## Do Not

- Show before course 100% complete
- Replace lesson Continue flow
