import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ModuleForum } from "../module-forum";

const mockThreads = [
  {
    id: "1",
    title: "Understanding Chapter Twelve",
    civic_module: "mod1",
    civic_chapter: null,
    posts_count: 3,
    author_name: "Alice Kamau",
    author_initials: "AK",
    author_id: "u1",
    author_avatar: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    title: "Budget Cycle Questions",
    civic_module: "mod1",
    civic_chapter: null,
    posts_count: 1,
    author_name: "Bob Ochieng",
    author_initials: "BO",
    author_id: "u2",
    author_avatar: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Public Participation Tips",
    civic_module: "mod1",
    civic_chapter: null,
    posts_count: 7,
    author_name: "Carol Wanjiku",
    author_initials: "CW",
    author_id: "u3",
    author_avatar: "https://example.com/avatar.jpg",
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
];

const mockUseForumThreads = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@/hooks/use-forum", () => ({
  useForumThreads: (...args: unknown[]) => mockUseForumThreads(...args),
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("../forum-thread-detail", () => ({
  ForumThreadDetail: ({ threadId, onBack }: { threadId: string; onBack: () => void }) => (
    <div data-testid="forum-thread-detail">
      <span data-testid="detail-thread-id">{threadId}</span>
      <button onClick={onBack} data-testid="back-button">Back</button>
    </div>
  ),
}));

vi.mock("../create-thread-dialog", () => ({
  CreateThreadDialog: ({ civicModuleId }: { civicModuleId?: string }) => (
    <div data-testid="create-thread-dialog" data-module-id={civicModuleId}>New topic</div>
  ),
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">{children}</a>
  ),
}));

vi.mock("@/constants/routes", () => ({
  Routes: { Login: "/login" },
}));

function renderModuleForum(moduleId = "mod1") {
  return render(<ModuleForum moduleId={moduleId} />);
}

describe("ModuleForum", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({ isLoggedIn: true });
  });

  it("shows loading spinner while fetching", () => {
    mockUseForumThreads.mockReturnValue({ data: null, isLoading: true, isError: false });
    renderModuleForum();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows error state when fetch fails", () => {
    mockUseForumThreads.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error("Network error"),
    });
    renderModuleForum();
    expect(screen.getByText("Could not load discussions")).toBeInTheDocument();
    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("shows empty state when no threads exist", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: [] },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    expect(screen.getByText("No discussions yet.")).toBeInTheDocument();
  });

  it("shows empty state when search yields no results", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    const searchInput = screen.getByPlaceholderText("Search discussions...");
    fireEvent.change(searchInput, { target: { value: "zzzznonexistent" } });
    expect(screen.getByText("No discussions match your search.")).toBeInTheDocument();
  });

  it("renders all threads from all users", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    expect(screen.getByText("Understanding Chapter Twelve")).toBeInTheDocument();
    expect(screen.getByText("Budget Cycle Questions")).toBeInTheDocument();
    expect(screen.getByText("Public Participation Tips")).toBeInTheDocument();
    expect(screen.getByText("Alice Kamau")).toBeInTheDocument();
    expect(screen.getByText("Bob Ochieng")).toBeInTheDocument();
    expect(screen.getByText("Carol Wanjiku")).toBeInTheDocument();
  });

  it("renders posts count for each thread", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("filters threads by title when searching", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    const searchInput = screen.getByPlaceholderText("Search discussions...");
    fireEvent.change(searchInput, { target: { value: "budget" } });
    expect(screen.queryByText("Understanding Chapter Twelve")).not.toBeInTheDocument();
    expect(screen.getByText("Budget Cycle Questions")).toBeInTheDocument();
    expect(screen.queryByText("Public Participation Tips")).not.toBeInTheDocument();
  });

  it("filters threads by author name when searching", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    const searchInput = screen.getByPlaceholderText("Search discussions...");
    fireEvent.change(searchInput, { target: { value: "alice" } });
    expect(screen.getByText("Understanding Chapter Twelve")).toBeInTheDocument();
    expect(screen.queryByText("Budget Cycle Questions")).not.toBeInTheDocument();
  });

  it("opens thread detail when a thread card is clicked", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    fireEvent.click(screen.getByText("Understanding Chapter Twelve"));
    expect(screen.getByTestId("forum-thread-detail")).toBeInTheDocument();
    expect(screen.getByTestId("detail-thread-id").textContent).toBe("1");
  });

  it("returns to thread list from detail via back button", () => {
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    fireEvent.click(screen.getByText("Understanding Chapter Twelve"));
    expect(screen.getByTestId("forum-thread-detail")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("back-button"));
    expect(screen.getByText("Understanding Chapter Twelve")).toBeInTheDocument();
  });

  it("shows New topic button when user is logged in", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: true });
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    expect(screen.getByTestId("create-thread-dialog")).toBeInTheDocument();
  });

  it("shows Sign In link when user is not logged in", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false });
    mockUseForumThreads.mockReturnValue({
      data: { results: mockThreads },
      isLoading: false,
      isError: false,
    });
    renderModuleForum();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getAllByTestId("next-link")[0]).toHaveAttribute("href", "/login");
  });
});
