import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TriviaPage from "@/app/(marketing)/trivia/page";

const { getTriviaList } = vi.hoisted(() => ({
  getTriviaList: vi.fn(),
}));

vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

vi.mock("@/lib/api-client", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/api-client")>();
  return {
    ...mod,
    citizenApi: {
      ...mod.citizenApi,
      getTriviaList,
    },
  };
});

describe("TriviaPage", () => {
  beforeEach(() => {
    getTriviaList.mockReset();
  });

  it("renders trivia sets from the API", async () => {
    getTriviaList.mockResolvedValue({
      results: [
        {
          id: "t1",
          title: "Budget basics",
          questions: [{ id: "q1", question_text: "Q?", options: ["A", "B"], order: 1 }],
        },
      ],
    });

    render(<TriviaPage />);
    await waitFor(() => {
      expect(screen.getByText("Budget basics")).toBeInTheDocument();
    });
    expect(screen.getByRole("link", { name: /play/i })).toHaveAttribute("href", "/trivia/t1");
  });

  it("shows API error message on fetch failure", async () => {
    getTriviaList.mockRejectedValue(new Error("Unable to reach the API."));

    render(<TriviaPage />);
    await waitFor(() => {
      expect(screen.getByText("Unable to reach the API.")).toBeInTheDocument();
    });
  });
});
