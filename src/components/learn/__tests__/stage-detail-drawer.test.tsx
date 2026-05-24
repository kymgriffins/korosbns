import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { StageDetailDrawer } from "../stage-detail-drawer";

// Mock global toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock window.matchMedia if not fully stubbed
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

const mockStage: any = {
  id: 1,
  title: "Stage 1: Constitution",
  badge: "🛡️",
  badgeName: "DocNative",
  documentName: "Constitution of Kenya 2010",
  archive: "2010",
  link: "https://kenyalaw.org",
  status: "Published",
  credits: "Credits: BNS Team",
  description: "Learn about the foundations of public finance in Kenya under Chapter Twelve of the Constitution.",
  expectations: ["Decode your 5 core budget rights in Kenya."],
  steps: [
    {
      id: 1,
      title: "1. Public Finance Principles",
      youtubeId: "Ed9lP0-komE",
      audioUrl: "/audio/stage1_step1.mp3",
      transcript: "Hello citizens, welcome to Budget Ndio Story...",
      text: "The Kenyan Constitution sets the foundational framework for public finance under Chapter Twelve.",
      trivia: [
        {
          type: "multiple-choice",
          question: "Which article of the Kenyan Constitution details the principles of public finance?",
          options: ["Article 201", "Article 217", "Article 221", "Article 35"],
          answer: 0,
          explanation: "Article 201 sets out the principles of public finance."
        }
      ]
    }
  ]
};

const mockProfile = {
  breakName: "Test User",
  pseudoName: "Tester",
  county: "Nairobi",
  sovereigns: 100,
  streakDays: 5,
  badges: [],
  stageProgress: [1],
  participationLogs: []
};

// Robust localStorage mock for vitest jsdom environment
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage });

describe("StageDetailDrawer - Step & Trivia Gating Flow", () => {
  let mockOnClose: any;
  let mockOnUpdateProfile: any;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockOnUpdateProfile = vi.fn();
    localStorage.clear();
  });


  it("renders Stage Overview step 0 initially", () => {
    render(
      <StageDetailDrawer
        stage={mockStage}
        profile={mockProfile}
        onClose={mockOnClose}
        onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false}
        hasNext={false}
      />
    );

    // Verify Overview header is visible
    expect(screen.getByText("Stage 1: Constitution Overview")).toBeInTheDocument();
    expect(screen.getByText("Start Learning Course")).toBeInTheDocument();
  });

  it("transitions to Step 1 and hides trivia initially", () => {
    render(
      <StageDetailDrawer
        stage={mockStage}
        profile={mockProfile}
        onClose={mockOnClose}
        onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false}
        hasNext={false}
      />
    );

    // Click Start Learning
    const startBtn = screen.getByText("Start Learning Course");
    fireEvent.click(startBtn);

    // Step 1 content header is visible
    expect(screen.getAllByText("1. Public Finance Principles")[0]).toBeInTheDocument();

    // Content formats are visible
    expect(screen.getByText("🎥 Video")).toBeInTheDocument();
    expect(screen.getByText("🎧 Audio")).toBeInTheDocument();
    expect(screen.getByText("📖 Text")).toBeInTheDocument();

    // Trivia is hidden by default
    expect(screen.queryByText("Quick Check 1 of 1")).not.toBeInTheDocument();
  });

  it("shows trivia and hides content player when Next button is clicked", () => {
    render(
      <StageDetailDrawer
        stage={mockStage}
        profile={mockProfile}
        onClose={mockOnClose}
        onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false}
        hasNext={false}
      />
    );

    // Enter step 1
    fireEvent.click(screen.getByText("Start Learning Course"));

    // Click Next to trigger trivia screen
    const nextBtn = screen.getByText("Next");
    fireEvent.click(nextBtn);

    // Trivia section is now visible
    expect(screen.getByText("Quick Check 1 of 1")).toBeInTheDocument();
    expect(screen.getByText("Which article of the Kenyan Constitution details the principles of public finance?")).toBeInTheDocument();

    // Content players & formats are hidden to reduce commotion
    expect(screen.queryByText("🎥 Video")).not.toBeInTheDocument();
    expect(screen.queryByText("📖 Text")).not.toBeInTheDocument();
  });

  it("transitions back to content player when Back button is clicked on trivia screen", () => {
    render(
      <StageDetailDrawer
        stage={mockStage}
        profile={mockProfile}
        onClose={mockOnClose}
        onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false}
        hasNext={false}
      />
    );

    // Enter step 1 and trigger trivia
    fireEvent.click(screen.getByText("Start Learning Course"));
    fireEvent.click(screen.getByText("Next"));

    // Verify trivia is active and content is hidden
    expect(screen.getByText("Quick Check 1 of 1")).toBeInTheDocument();
    expect(screen.queryByText("🎥 Video")).not.toBeInTheDocument();

    // Click footer Back button
    const backBtn = screen.getByText("Back");
    fireEvent.click(backBtn);

    // Verify back to content player, and trivia is hidden
    expect(screen.getByText("🎥 Video")).toBeInTheDocument();
    expect(screen.queryByText("Quick Check 1 of 1")).not.toBeInTheDocument();
  });

  it("enables Next button and completes step when trivia is skipped", () => {
    render(
      <StageDetailDrawer
        stage={mockStage}
        profile={mockProfile}
        onClose={mockOnClose}
        onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false}
        hasNext={false}
      />
    );

    // Enter step 1 and trigger trivia
    fireEvent.click(screen.getByText("Start Learning Course"));
    fireEvent.click(screen.getByText("Next"));

    // Click Skip for now
    const skipBtn = screen.getByText("Skip for now");
    fireEvent.click(skipBtn);

    // Trivia Skipped status banner is shown
    expect(screen.getByText("Trivia Skipped")).toBeInTheDocument();
  });
});
