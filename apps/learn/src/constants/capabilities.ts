import { team } from "./team";

export const capabilities = [
    {
        id: 1,
        title: "Docu-Series",
        description: "\"Follow the Money\": A 6-part investigative series tracking budget allocations to local projects.",
        illustration: "/images/client.png",
        icon: "video"
    },
    {
        id: 2,
        title: "Podcasts",
        description: "\"Budget Mtaani\": Weekly deep-dives breaking down complex fiscal policies into street slang.",
        illustration: "/images/project.png",
        icon: "mic"
    },
    {
        id: 3,
        title: "Digital Explainers",
        description: "Viral infographics and 60-second explainers optimized for TikTok, Instagram, and WhatsApp.",
        illustration: "/images/community-pulse.png",
        icon: "zap"
    },
    {
        id: 4,
        title: "Actionable Insights",
        description: "Moving beyond outrage to evidence-based policy demands and youth-led accountability.",
        illustration: "/images/invoices.png",
        icon: "file-text"
    }
]

export const AVATAR_ITEMS = team.map((member, index) => ({
    id: index + 1,
    name: member.name,
    designation: member.role,
    image: member.image,
}));

export const stats = [
    {
        id: 1,
        value: "20k+",
        label: "young Kenyans reached",
        avatars: [
            "/images/avatars/team/Millicent Makina.jpeg",
            "/images/avatars/team/Movine Omondi_HeadShot.jpg",
            "/images/avatars/team/James Mutinda.jpeg",
            "/images/avatars/team/Shem Odhiambo Ojunga.jpeg",
            "/images/avatars/team/Nelly Maina.jpg",
            "/images/avatars/team/Koros.jpeg"
        ]
    },
    {
        id: 2,
        value: "1.2M+",
        label: "views",
        description: "Stories, reels and explainers making fiscal data easy to follow.",
        button: {
            text: "Follow us",
            href: "https://www.instagram.com/budgetndiostory"
        }
    }
];
