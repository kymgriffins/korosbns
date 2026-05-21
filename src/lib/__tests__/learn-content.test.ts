import { describe, expect, it } from "vitest";
import {
  mapApiArticle,
  mapApiStory,
  mapStoriesJsonFallback,
  triviaToBrowseCards,
} from "@/lib/learn-content";
import type { TriviaSetApi } from "@/lib/api-client";

describe("mapApiStory", () => {
  it("maps API story fields and parses JSON body flow", () => {
    const { story, flow } = mapApiStory({
      id: "1",
      slug: "budget-101",
      title: "Budget 101",
      summary: "Intro",
      metadata: { duration: "3m", icon: "📊" },
      body: JSON.stringify([{ id: "card-1", title: "Slide" }]),
    });
    expect(story.id).toBe("budget-101");
    expect(story.duration).toBe("3m");
    expect(flow).toHaveLength(1);
  });

  it("falls back when body JSON is invalid", () => {
    const { flow } = mapApiStory({ id: "x", body: "not-json" });
    expect(flow).toEqual([]);
  });
});

describe("mapApiArticle", () => {
  it("wraps notion HTML and derives read time", () => {
    const article = mapApiArticle({
      slug: "health-budget",
      title: "Health",
      summary: "Snippet",
      body: "x".repeat(2500),
      body_html: "<p>Hello</p>",
    });
    expect(article.id).toBe("health-budget");
    expect(article.body_html).toContain("notion-content");
    expect(article.readTime).toMatch(/min read/);
  });
});

describe("mapStoriesJsonFallback", () => {
  it("returns stories and flows including budget-trivia slot", () => {
    const data = {
      stories: [{ id: "a", title: "A", subtitle: "", duration: "", gradient: "", icon: "", action: "" }],
      story_flows: { a: [{ id: "c1" }] },
    };
    const { stories, flows } = mapStoriesJsonFallback(data);
    expect(stories).toHaveLength(1);
    expect(flows.a).toHaveLength(1);
    expect(flows["budget-trivia"]).toEqual([]);
  });
});

describe("triviaToBrowseCards", () => {
  it("creates browse-only cards without exposing correct answers", () => {
    const sets: TriviaSetApi[] = [
      {
        id: "t1",
        title: "Quiz",
        questions: [
          { id: "q1", question_text: "Q?", options: ["A", "B"], order: 1, correct_index: 1 },
        ],
      },
    ];
    const cards = triviaToBrowseCards(sets);
    expect(cards[0].browseOnly).toBe(true);
    expect(cards.some((c) => c.id === "trivia-complete")).toBe(true);
    expect(cards[0]).not.toHaveProperty("correct");
  });
});
