import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Learn from "../learn";
import {
  countWords,
  estimateLineCount,
  MEET_BETA_EXAMPLE_COPY,
  STORY_PAGE_RULES,
} from "../story-page-rules";

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

describe("story content rules", () => {
  it("keeps Meet BETA example within line and word limits", () => {
    const words = countWords(MEET_BETA_EXAMPLE_COPY);
    const lines = estimateLineCount(MEET_BETA_EXAMPLE_COPY, STORY_PAGE_RULES.maxCharactersPerLine);

    expect(words).toBeLessThanOrEqual(STORY_PAGE_RULES.maxWordsPerCard);
    expect(lines).toBeLessThanOrEqual(STORY_PAGE_RULES.targetLinesPerCard);
  });
});

describe("story + quiz navigation rules", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("hides story nav buttons and dots and keeps tap navigation controls", () => {
    render(<Learn />);

    fireEvent.click(screen.getByRole("button", { name: /play story/i }));

    expect(screen.queryByRole("button", { name: /^next$/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/navigation dots/i)).not.toBeInTheDocument();
    expect(screen.getByTestId("story-tap-left")).toBeInTheDocument();
    expect(screen.getByTestId("story-tap-right")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("story-tap-right"));
    expect(screen.getByText("What is a BPS Actually? 🤔")).toBeInTheDocument();
  });

  it("hides quiz next button and uses tap zones for question navigation", () => {
    render(<Learn />);
    fireEvent.click(screen.getByRole("button", { name: /play story/i }));

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
