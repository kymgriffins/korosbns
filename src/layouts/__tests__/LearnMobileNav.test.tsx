import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { LearnMobileNav } from "../LearnMobileNav";

const mockSetActiveTab = vi.fn();

vi.mock("@/contexts/learn-context", () => ({
  useLearn: () => ({
    activeTab: "home",
    setActiveTab: mockSetActiveTab,
  }),
  LearnTab: {},
}));

vi.mock("@/lib/learn-nav", () => ({
  learnTabToHref: (tab: string) => `/learn/${tab}`,
}));

vi.mock("@/ui/avatar", () => ({
  Avatar: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="avatar" className={className}>{children}</div>
  ),
  AvatarFallback: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span data-testid="avatar-fallback" className={className}>{children}</span>
  ),
}));

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    length: 0,
    key: (_: number) => null,
  };
})();

Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage, configurable: true });

vi.mock("motion/react", () => ({
  motion: {
    nav: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <nav {...props}>{children}</nav>
    ),
  },
  useReducedMotion: () => false,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("LearnMobileNav", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders all five navigation tabs", () => {
    render(<LearnMobileNav />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Learn")).toBeInTheDocument();
    expect(screen.getByText("Forums")).toBeInTheDocument();
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("calls setActiveTab('forum') when Forums tab is clicked", () => {
    render(<LearnMobileNav />);
    fireEvent.click(screen.getByText("Forums"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("forum");
  });

  it("calls setActiveTab('home') when Dashboard tab is clicked", () => {
    render(<LearnMobileNav />);
    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("home");
  });

  it("calls setActiveTab('learn') when Learn tab is clicked", () => {
    render(<LearnMobileNav />);
    fireEvent.click(screen.getByText("Learn"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("learn");
  });

  it("calls setActiveTab('documents') when Documents tab is clicked", () => {
    render(<LearnMobileNav />);
    fireEvent.click(screen.getByText("Documents"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("documents");
  });

  it("calls setActiveTab('profile') when Profile tab is clicked", () => {
    render(<LearnMobileNav />);
    fireEvent.click(screen.getByText("Profile"));
    expect(mockSetActiveTab).toHaveBeenCalledWith("profile");
  });
});
