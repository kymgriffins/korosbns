import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import storiesData from "@/constants/stories.json";
import { mapStoriesJsonFallback } from "@/lib/learn-content";
import Learn from "../learn";
import {
  countWords,
  estimateLineCount,
  MEET_BETA_EXAMPLE_COPY,
  STORY_PAGE_RULES,
} from "../story-page-rules";

const { stories, flows } = mapStoriesJsonFallback(storiesData);

const apiStories = stories.map((story) => ({
  id: story.id,
  slug: story.id,
  title: story.title,
  summary: story.subtitle,
  metadata: {
    duration: story.duration,
    icon: story.icon,
    gradient: story.gradient,
    action: story.action,
  },
  body: JSON.stringify(flows[story.id] || []),
}));

vi.mock("next/image", () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("@/lib/org-config", () => ({
  fetchPublicOrgConfig: vi.fn().mockResolvedValue({}),
}));

vi.mock("@/lib/api-client", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/api-client")>();
  return {
    ...mod,
    citizenApi: {
      ...mod.citizenApi,
      getStories: vi.fn().mockResolvedValue({ results: apiStories }),
      getArticles: vi.fn().mockResolvedValue({ results: [] }),
      getTriviaList: vi.fn().mockResolvedValue({ results: [] }),
    },
  };
});

vi.mock("motion/react", async () => {
  const ReactModule = await import("react");
  const passthrough = (tag: keyof React.JSX.IntrinsicElements) =>
    ReactModule.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"div">>(
      ({ children, ...props }, ref) => ReactModule.createElement(tag, { ...props, ref }, children),
    );

  return {
    motion: new Proxy(
      {},
      {
        get: (_, key: string) => passthrough((key as keyof React.JSX.IntrinsicElements) || "div"),
      },
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
  };
});

beforeEach(() => {
  window.localStorage.clear();
  global.fetch = vi.fn((url: string | URL | Request) => {
    const href = typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
    if (href.includes("/api/youtube") || href.includes("/api/gamification")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ videos: [], points: 0, level: 1, streak_days: 0 }),
      } as Response);
    }
    return Promise.reject(new Error(`Unmocked fetch: ${href}`));
  }) as typeof fetch;
});

describe("story content rules", () => {
  it("keeps Meet BETA example within line and word limits", () => {
    const words = countWords(MEET_BETA_EXAMPLE_COPY);
    const lines = estimateLineCount(MEET_BETA_EXAMPLE_COPY, STORY_PAGE_RULES.maxCharactersPerLine);

    expect(words).toBeLessThanOrEqual(STORY_PAGE_RULES.maxWordsPerCard);
    expect(lines).toBeLessThanOrEqual(STORY_PAGE_RULES.targetLinesPerCard);
  });
});

describe("story + quiz navigation rules", () => {
  it("hides story nav buttons and dots and keeps tap navigation controls", async () => {
    render(<Learn />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /play story/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole("button", { name: /play story/i })[0]!);

    expect(screen.queryByRole("button", { name: /^next$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/navigation dots/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("story-tap-left")).toBeInTheDocument();
    expect(screen.getByTestId("story-tap-right")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("story-tap-right"));
    expect(screen.getByText("What is a BPS Actually? 🤔")).toBeInTheDocument();
  });

  it("hides quiz next button and uses tap zones for question navigation", async () => {
    render(<Learn />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /play story/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByRole("button", { name: /play story/i })[0]!);

    await waitFor(() => screen.getByTestId("story-tap-right"));

    for (let i = 0; i < 20; i++) {
      if (screen.queryByRole("button", { name: /start quiz/i })) break;
      fireEvent.click(screen.getByTestId("story-tap-right"));
    }

    fireEvent.click(screen.getByRole("button", { name: /start quiz/i }));

    expect(screen.queryByRole("button", { name: /next question/i })).not.toBeInTheDocument();
    expect(screen.getByTestId("quiz-tap-left")).toBeInTheDocument();
    expect(screen.getByTestId("quiz-tap-right")).toBeInTheDocument();

    const correctOption = screen.getByText("February 15th").closest("button");
    expect(correctOption).toBeTruthy();
    fireEvent.click(correctOption!);
    fireEvent.click(screen.getByTestId("quiz-tap-right"));
    expect(screen.getByText(/question 2/i)).toBeInTheDocument();
  });
});
