import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { StageDetailDrawer } from "../stage-detail-drawer";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

vi.mock("@/contexts/learn-context", () => ({
  useLearn: () => ({
    totalStages: 8,
    updateCurrentStep: vi.fn(),
  }),
}));


if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false, media: query, onchange: null, addListener: vi.fn(),
    removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
}

const mockStage: any = {
  id: 1, title: "Stage 1: Constitution", badge: "🛡️", badgeName: "DocNative",
  documentName: "Constitution of Kenya 2010", archive: "2010",
  link: "https://kenyalaw.org", status: "Published", credits: "Credits: BNS Team",
  description: "Learn about the foundations of public finance in Kenya under Chapter Twelve of the Constitution.",
  expectations: ["Decode your 5 core budget rights in Kenya."],
  steps: [
    {
      id: 1, title: "1. Public Finance Principles", youtubeId: "Ed9lP0-komE",
      audioUrl: "/audio/stage1_step1.mp3", transcript: "Hello citizens, welcome to Budget Ndio Story...",
      text: "The Kenyan Constitution sets the foundational framework for public finance under Chapter Twelve.",
      trivia: [{
        type: "multiple-choice",
        question: "Which article of the Kenyan Constitution details the principles of public finance?",
        options: ["Article 201", "Article 217", "Article 221", "Article 35"],
        answer: 0, explanation: "Article 201 sets out the principles of public finance.",
      }],
    },
    {
      id: 2, title: "2. Budget Cycle Overview", youtubeId: "abc123",
      audioUrl: "/audio/stage1_step2.mp3", transcript: "Step 2 transcript...",
      text: "The budget cycle has four main phases.",
      trivia: [{
        type: "multiple-choice",
        question: "How many phases are in the budget cycle?",
        options: ["Three", "Four", "Five", "Six"],
        answer: 1, explanation: "The budget cycle has four phases.",
      }],
    },
  ],
};

const mockProfile = {
  breakName: "Test User", pseudoName: "Tester", county: "Nairobi",
  sovereigns: 100, streakDays: 5, badges: [], stageProgress: [1], participationLogs: [],
};

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });
Object.defineProperty(globalThis, "localStorage", { value: mockLocalStorage });

describe("StageDetailDrawer", () => {
  let mockOnClose: any;
  let mockOnUpdateProfile: any;

  beforeEach(() => {
    mockOnClose = vi.fn();
    mockOnUpdateProfile = vi.fn();
    localStorage.clear();
  });

  it("renders Stage Overview initially", () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    expect(screen.getAllByText("Stage 1: Constitution")[0]).toBeInTheDocument();
    expect(screen.getByText("Start Learning Course")).toBeInTheDocument();
  });

  it("transitions to Step 1 and shows content formats", async () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    fireEvent.click(screen.getByText("Start Learning Course"));
    await waitFor(() => {
      expect(screen.getByText("🎥 Watch")).toBeInTheDocument();
    });
    expect(screen.getByText("📖 Read")).toBeInTheDocument();
  });

  it("advances to step 2 on Continue click", async () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    fireEvent.click(screen.getByText("Start Learning Course"));
    await waitFor(() => { expect(screen.getByText("🎥 Watch")).toBeInTheDocument(); });
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => {
      expect(screen.getByText("2. Budget Cycle Overview")).toBeInTheDocument();
    });
  });

  it("goes back to step 1 on Previous click", async () => {
    render(
      <StageDetailDrawer
        stage={mockStage} profile={mockProfile}
        onClose={mockOnClose} onUpdateProfile={mockOnUpdateProfile}
        hasPrev={false} hasNext={false}
      />
    );
    fireEvent.click(screen.getByText("Start Learning Course"));
    await waitFor(() => { expect(screen.getByText("🎥 Watch")).toBeInTheDocument(); });
    fireEvent.click(screen.getByText("Continue"));
    await waitFor(() => { expect(screen.getByText("2. Budget Cycle Overview")).toBeInTheDocument(); });
    fireEvent.click(screen.getByText((content) => content.includes("Previous")));
    await waitFor(() => {
      expect(screen.getByText("1. Public Finance Principles")).toBeInTheDocument();
    });
  });
});
