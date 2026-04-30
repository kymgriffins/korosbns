# Seed Data

This file captures the current app seed data based on the existing constants and marketing components.

## Organization
- name: Budget Ndio Story
- short name: BNS
- description: Youth-led organization making Kenya's national and county budgets transparent, accessible, and easier to understand.

## Team Members

```json
[
  {
    "name": "Millicent Makina",
    "role": "Board Advisor",
    "image": "/images/avatars/team/Millicent Makina.jpeg",
    "socials": {
      "linkedin": "https://linkedin.com/in/millicent-makina",
      "x": "https://x.com/millicentmakina"
    }
  },
  {
    "name": "Movine Omondi",
    "role": "Executive Director",
    "image": "/images/avatars/team/Movine Omondi_HeadShot.jpg",
    "socials": {
      "linkedin": "https://linkedin.com/in/movineomondi",
      "x": "https://x.com/movineomondi"
    }
  },
  {
    "name": "James Maingi Mutinda",
    "role": "Director Partnerships",
    "image": "/images/avatars/team/James Mutinda.jpeg",
    "socials": {
      "linkedin": "https://linkedin.com/in/jamesmutinda",
      "x": "https://x.com/jamesmutinda"
    }
  },
  {
    "name": "Shem Odhiambo Ojunga",
    "role": "Director Media",
    "image": "/images/avatars/team/Shem Odhiambo Ojunga.jpeg",
    "socials": {
      "linkedin": "https://linkedin.com/in/shemojunga",
      "x": "https://x.com/shemojunga"
    }
  },
  {
    "name": "Nelly Maina",
    "role": "Lead Podcast Host",
    "image": "/images/avatars/team/Nelly Maina.jpg",
    "socials": {
      "linkedin": "https://linkedin.com/in/nellymaina",
      "x": "https://x.com/nellymaina"
    }
  },
  {
    "name": "Peculiar Koros",
    "role": "Director ICT",
    "image": "/images/avatars/team/Koros.jpeg",
    "socials": {
      "linkedin": "https://linkedin.com/in/peculiarkoros",
      "x": "https://x.com/peculiarkoros"
    }
  }
]
```

## Social Accounts

```json
{
  "socialLinks": [
    { "label": "X", "href": "https://x.com/budgetndiostory" },
    { "label": "LinkedIn", "href": "https://www.linkedin.com/company/budget-ndio-story/" },
    { "label": "WhatsApp", "href": "https://wa.me/254790631623" },
    { "label": "YouTube", "href": "https://youtube.com/@budgetndiostory" },
    { "label": "TikTok", "href": "https://www.tiktok.com/@budget.ndio.story" },
    { "label": "Instagram", "href": "https://instagram.com/budgetndiostory" }
  ],
  "contactSocials": [
    { "name": "X", "href": "https://x.com/budgetndiostory" },
    { "name": "YouTube", "href": "https://youtube.com/@budgetndiostory" },
    { "name": "Instagram", "href": "https://instagram.com/budgetndiostory" },
    { "name": "LinkedIn", "href": "https://www.linkedin.com/company/budget-ndio-story/" }
  ],
  "integrations": [
    { "name": "Instagram", "href": "https://www.instagram.com/budgetndiostory" },
    { "name": "X", "href": "https://x.com/budgetndiostory" },
    { "name": "TikTok", "href": "https://www.tiktok.com/@budget.ndio.story" },
    { "name": "WhatsApp", "href": "https://chat.whatsapp.com/something" },
    { "name": "LinkedIn", "href": "https://www.linkedin.com/company/budget-ndio-story/" },
    { "name": "YouTube", "href": "https://www.youtube.com/@budgetndiostory" }
  ]
}
```

## YouTube Data  ---- dynamic

```json
{
  "channel": "https://www.youtube.com/@budgetndiostory",
  
}
```

## Notes
- The team and social data are drawn directly from `src/constants/team.ts`, `src/constants/links.ts`, `src/components/marketing/contact.tsx`, and `src/components/marketing/integrations.tsx`.
- YouTube seeds include channel links and the current embedded videos referenced in `src/components/marketing/research.tsx`.
