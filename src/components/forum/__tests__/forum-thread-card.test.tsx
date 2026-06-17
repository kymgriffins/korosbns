import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { ForumThreadCard } from "../forum-thread-card";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">{children}</a>
  ),
}));

const baseThread = {
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
};

describe("ForumThreadCard", () => {
  it("renders thread title", () => {
    render(<ForumThreadCard thread={baseThread} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("Understanding Chapter Twelve")).toBeInTheDocument();
  });

  it("renders author name", () => {
    render(<ForumThreadCard thread={baseThread} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("Alice Kamau")).toBeInTheDocument();
  });

  it("renders posts count", () => {
    render(<ForumThreadCard thread={baseThread} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders author initials when no avatar", () => {
    render(<ForumThreadCard thread={baseThread} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("AK")).toBeInTheDocument();
  });

  it("renders avatar image when provided", () => {
    const threadWithAvatar = {
      ...baseThread,
      author_avatar: "https://example.com/avatar.jpg",
    };
    render(<ForumThreadCard thread={threadWithAvatar} selected={false} onSelect={vi.fn()} />);
    const img = document.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/avatar.jpg");
  });

  it("calls onSelect when clicked", () => {
    const onSelect = vi.fn();
    render(<ForumThreadCard thread={baseThread} selected={false} onSelect={onSelect} />);
    fireEvent.click(screen.getByText("Understanding Chapter Twelve"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("renders the author link when author_id is present", () => {
    render(<ForumThreadCard thread={baseThread} selected={false} onSelect={vi.fn()} />);
    const link = screen.getByText("Alice Kamau").closest("a");
    expect(link).toHaveAttribute("href", "/learn/users/u1");
  });

  it("applies selected styling when selected is true", () => {
    const { container } = render(
      <ForumThreadCard thread={baseThread} selected={true} onSelect={vi.fn()} />
    );
    const button = container.querySelector("button");
    expect(button?.className).toContain("border-primary/30");
  });

  it("shows relative time", () => {
    const justNow = { ...baseThread, created_at: new Date().toISOString() };
    render(<ForumThreadCard thread={justNow} selected={false} onSelect={vi.fn()} />);
    expect(screen.getByText("Just now")).toBeInTheDocument();
  });
});
