import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ForumThreadDetail } from "../forum-thread-detail";

const mockUseForumThread = vi.fn();
const mockUseCreateForumPost = vi.fn();
const mockUseAuth = vi.fn();

vi.mock("@/hooks/use-forum", () => ({
  useForumThread: (...args: unknown[]) => mockUseForumThread(...args),
  useCreateForumPost: () => mockUseCreateForumPost(),
}));

vi.mock("@/contexts/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/constants/routes", () => ({
  Routes: { Login: "/login" },
}));

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">{children}</a>
  ),
}));

const mockPosts = [
  {
    id: "p1",
    content: "Great question! Article 201 explains it clearly.",
    author_name: "Alice Kamau",
    author_initials: "AK",
    author_id: "u1",
    author_avatar: null,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: "p2",
    content: "I found Chapter Twelve very informative.",
    author_name: "Bob Ochieng",
    author_initials: "BO",
    author_id: "u2",
    author_avatar: "https://example.com/bob.jpg",
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: "p3",
    content: "Thanks for sharing this perspective.",
    author_name: "Carol Wanjiku",
    author_initials: "CW",
    author_id: null,
    author_avatar: null,
    created_at: new Date(Date.now() - 60000).toISOString(),
  },
];

const mockThread = {
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
  posts: mockPosts,
};

const mockCreatePostMutateAsync = vi.fn();

function renderThreadDetail(threadId = "1") {
  return render(<ForumThreadDetail threadId={threadId} onBack={vi.fn()} />);
}

describe("ForumThreadDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCreateForumPost.mockReturnValue({
      mutateAsync: mockCreatePostMutateAsync,
      isPending: false,
    });
    mockUseAuth.mockReturnValue({ isLoggedIn: true, user: { display_name: "Alice Kamau", break_name: "" } });
  });

  it("shows loading spinner while fetching thread", () => {
    mockUseForumThread.mockReturnValue({ data: null, isLoading: true, isError: false });
    renderThreadDetail();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows error message when fetch fails", () => {
    mockUseForumThread.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: new Error("Failed to load thread"),
    });
    renderThreadDetail();
    expect(screen.getByText("Failed to load thread")).toBeInTheDocument();
  });

  it("shows 'Thread not found' when thread is null and not loading/error", () => {
    mockUseForumThread.mockReturnValue({ data: null, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByText("Thread not found.")).toBeInTheDocument();
  });

  it("renders thread title and author name", () => {
    mockUseForumThread.mockReturnValue({ data: mockThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByText("Understanding Chapter Twelve")).toBeInTheDocument();
    expect(screen.getAllByText(/Alice Kamau/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders all posts from all users", () => {
    mockUseForumThread.mockReturnValue({ data: mockThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByText("Great question! Article 201 explains it clearly.")).toBeInTheDocument();
    expect(screen.getByText("I found Chapter Twelve very informative.")).toBeInTheDocument();
    expect(screen.getByText("Thanks for sharing this perspective.")).toBeInTheDocument();
  });

  it("shows all author names in posts", () => {
    mockUseForumThread.mockReturnValue({ data: mockThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getAllByText(/Alice Kamau/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("Bob Ochieng")).toBeInTheDocument();
    expect(screen.getByText("Carol Wanjiku")).toBeInTheDocument();
  });

  it("shows 'No replies yet' when posts array is empty", () => {
    const emptyThread = { ...mockThread, posts: [] };
    mockUseForumThread.mockReturnValue({ data: emptyThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByText("No replies yet")).toBeInTheDocument();
  });

  it("shows message count correctly for 1 post", () => {
    const onePostThread = { ...mockThread, posts: [mockPosts[0]] };
    mockUseForumThread.mockReturnValue({ data: onePostThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByText(/1 message/)).toBeInTheDocument();
  });

  it("shows message count correctly for multiple posts", () => {
    mockUseForumThread.mockReturnValue({ data: mockThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByText(/3 messages/)).toBeInTheDocument();
  });

  it("shows composer when user is logged in", () => {
    mockUseForumThread.mockReturnValue({ data: mockThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByPlaceholderText("Reply to this thread…")).toBeInTheDocument();
  });

  it("shows sign in prompt when user is not logged in", () => {
    mockUseAuth.mockReturnValue({ isLoggedIn: false });
    mockUseForumThread.mockReturnValue({ data: mockThread, isLoading: false, isError: false });
    renderThreadDetail();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("to join the conversation.")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    const onBack = vi.fn();
    mockUseForumThread.mockReturnValue({ data: mockThread, isLoading: false, isError: false });
    render(<ForumThreadDetail threadId="1" onBack={onBack} />);
    fireEvent.click(screen.getByLabelText("Back to threads"));
    expect(onBack).toHaveBeenCalled();
  });
});
