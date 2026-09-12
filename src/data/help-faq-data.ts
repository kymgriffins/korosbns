import faqJson from "@/content/faq.json";

export type HelpTopicId =
  | "programmes"
  | "budget"
  | "learning"
  | "reports"
  | "studios"
  | "community";

export interface HelpTopic {
  id: HelpTopicId;
  title: string;
  description: string;
  badge: string;
  iconName: string;
  popularSearch: string;
}

export interface HelpFaqItem {
  id: string;
  question: string;
  answer: string;
  topicId: HelpTopicId;
  tags: string[];
  programmeSlug?: "mashinani" | "connect" | "wanahabari-lab" | "studios";
  actionLink?: {
    label: string;
    href: string;
  };
}

type FaqSeed = typeof faqJson & {
  helpTopics?: HelpTopic[];
  helpFaqs?: HelpFaqItem[];
};

const seed = faqJson as FaqSeed;

/** CMS-backed help topics (`faq.json` → helpTopics). */
export const HELP_TOPICS: HelpTopic[] = (seed.helpTopics ?? []) as HelpTopic[];

/** CMS-backed help FAQs (`faq.json` → helpFaqs). */
export const HELP_FAQS: HelpFaqItem[] = (seed.helpFaqs ?? []) as HelpFaqItem[];
