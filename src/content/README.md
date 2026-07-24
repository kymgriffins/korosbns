# Marketing content (JSON)

All marketing copy, CTAs, navigation, and asset paths for layouts live here so they can move to another app without hunting through components.

| File | Owns |
|------|------|
| `media.json` | Local image paths + Cloudinary video/embed URLs |
| `programmes.json` | Programme pages, blurbs, partners, contact intents, closing CTA |
| `landing.json` | Homepage sections + desktop nav |
| `about.json` | About page |
| `timeline.json` | Budget-cycle timeline (structure untouched in UI) |
| `socials.json` | Social platform handles/stats/CTAs |

Import typed data from `@/content`. Legacy paths (`@/constants/programmes-content`, `bns-media-images`, `cloudinary`) re-export the same JSON.
