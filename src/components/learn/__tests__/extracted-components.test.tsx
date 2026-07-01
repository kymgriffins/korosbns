import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { DrawerHeader } from "../drawer-header";
import { CourseOverview } from "../course-overview";
import { ProgressDots } from "../progress-dots";
import { NavigationFooter } from "../navigation-footer";
import { MasteryPage } from "../mastery-page";
import { StepContent } from "../step-content";
import { TriviaSection } from "../trivia-section";
import { DocumentsTab } from "../documents-tab";

vi.mock("@/components/ui/progress", () => ({
  Progress: ({ value, className }: { value: number; className?: string }) => (
    <div data-testid="progress" data-value={value} className={className} />
  ),
}));

vi.mock("@/constants/documents-registry", () => ({
  CONSTITUTION_HISTORICAL_DOCS: [
    {
      id: "2010", title: "2010 Constitution", year: 2010,
      description: "Current constitution",
      historicalContext: "Promulgated in 2010",
      isAvailable: true,
      pdfUrl: "/pdfs/2010.pdf",
      sourceUrl: "https://example.com/2010",
    },
  ],
  GovernmentDocument: {} as any,
}));

function mockLocationOrigin() {
  const originalLocation = window.location;
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { origin: "http://localhost" },
      writable: true,
    });
  });
  afterEach(() => {
    Object.defineProperty(window, "location", { value: originalLocation, writable: true });
  });
}

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false, media: query, onchange: null, addListener: vi.fn(),
    removeListener: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn(), dispatchEvent: vi.fn(),
  }));
}

describe("DrawerHeader", () => {
  it("renders title and badge", () => {
    render(
      <DrawerHeader
        title="Stage 1: Constitution" badge="🛡️" currentStep={0}
        activeSubTab="learn" onSubTabChange={vi.fn()}
        isCached={false} onClose={vi.fn()}
      />
    );
    expect(screen.getAllByText("Stage 1: Constitution")[0]).toBeInTheDocument();
    expect(screen.getByText("🛡️")).toBeInTheDocument();
  });

  it("shows Guided Journey and Documents tabs", () => {
    render(
      <DrawerHeader
        title="Test" badge="📘" currentStep={0}
        activeSubTab="learn" onSubTabChange={vi.fn()}
        isCached={false} onClose={vi.fn()}
      />
    );
    expect(screen.getByText("Journey")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
  });

  it("calls onSubTabChange when Documents is clicked", () => {
    const onSubTabChange = vi.fn();
    render(
      <DrawerHeader
        title="Test" badge="📘" currentStep={0}
        activeSubTab="learn" onSubTabChange={onSubTabChange}
        isCached={false} onClose={vi.fn()}
      />
    );
    fireEvent.click(screen.getByText("Docs"));
    expect(onSubTabChange).toHaveBeenCalledWith("documents");
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(
      <DrawerHeader
        title="Test" badge="📘" currentStep={0}
        activeSubTab="learn" onSubTabChange={vi.fn()}
        isCached={false} onClose={onClose}
      />
    );
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("accepts isCached prop without error", () => {
    const { container } = render(
      <DrawerHeader
        title="Test" badge="📘" currentStep={0}
        activeSubTab="learn" onSubTabChange={vi.fn()}
        isCached={true} onClose={vi.fn()}
      />
    );
    expect(container.querySelector('[class*="truncate"]')).toBeInTheDocument();
  });
});

describe("CourseOverview", () => {
  const defaultProps = {
    badge: "🛡️", title: "Stage 1: Constitution",
    description: "Learn about public finance in Kenya.",
    expectations: ["Decode your 5 core budget rights.", "Understand Chapter Twelve."],
    onStartLearning: vi.fn(),
  };

  it("renders title, badge, description", () => {
    render(<CourseOverview {...defaultProps} />);
    expect(screen.getByText("Stage 1: Constitution")).toBeInTheDocument();
    expect(screen.getByText("🛡️")).toBeInTheDocument();
    expect(screen.getByText("Learn about public finance in Kenya.")).toBeInTheDocument();
  });

  it("renders expectations list", () => {
    render(<CourseOverview {...defaultProps} />);
    expect(screen.getByText("Decode your 5 core budget rights.")).toBeInTheDocument();
    expect(screen.getByText("Understand Chapter Twelve.")).toBeInTheDocument();
  });

  it("shows credits when provided", () => {
    render(<CourseOverview {...defaultProps} credits="Credits: BNS Team" />);
    expect(screen.getByText("Credits: BNS Team")).toBeInTheDocument();
  });

  it("calls onStartLearning when button clicked", () => {
    const onStartLearning = vi.fn();
    render(<CourseOverview {...defaultProps} onStartLearning={onStartLearning} />);
    fireEvent.click(screen.getByText("Start Course"));
    expect(onStartLearning).toHaveBeenCalled();
  });
});

describe("ProgressDots", () => {
  it("renders correct number of dot elements", () => {
    const { container } = render(<ProgressDots currentStep={2} totalSteps={5} />);
    const dots = container.querySelector(".flex")?.children;
    expect(dots?.length).toBe(5);
  });
});

describe("NavigationFooter", () => {
  const baseProps = {
    currentStep: 0, totalSteps: 5,
    hasNext: true, hasPrev: false,
    onClose: vi.fn(), onPrevStep: vi.fn(),
    onNextStep: vi.fn(), onStartLearning: vi.fn(),
  };

  it("renders Back and Start Course on step 0", () => {
    render(<NavigationFooter {...baseProps} />);
    expect(screen.getByText("Overview")).toBeInTheDocument();
    expect(screen.getByText("Start")).toBeInTheDocument();
  });

  it("calls onStartLearning when Start clicked", () => {
    const onStartLearning = vi.fn();
    render(<NavigationFooter {...baseProps} onStartLearning={onStartLearning} />);
    fireEvent.click(screen.getByText("Start"));
    expect(onStartLearning).toHaveBeenCalled();
  });

  it("renders Previous and Continue on mid steps", () => {
    render(<NavigationFooter {...baseProps} currentStep={3} hasPrev={true} />);
    expect(screen.getByText((c) => c.includes("Prev"))).toBeInTheDocument();
    expect(screen.getByText((c) => c.includes("Continue"))).toBeInTheDocument();
  });

  it("renders Finish on last step", () => {
    render(<NavigationFooter {...baseProps} currentStep={6} totalSteps={5} hasNext={false} />);
    expect(screen.getByText("Finish")).toBeInTheDocument();
  });
});

describe("MasteryPage", () => {
  it("renders badge, title, and unlock badge", () => {
    render(
      <MasteryPage
        badge="🛡️" badgeName="DocNative"
        title="Constitution Mastered" hasNext={false}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText("🛡️")).toBeInTheDocument();
    expect(screen.getByText("DocNative Unlocked!")).toBeInTheDocument();
    expect(screen.getByText("Constitution Mastered")).toBeInTheDocument();
  });

  it("shows Finish Journey when no next stage", () => {
    render(
      <MasteryPage badge="🛡️" badgeName="DocNative" title="Mastered" hasNext={false} onClose={vi.fn()} />
    );
    expect(screen.getByText("Finish Journey")).toBeInTheDocument();
  });

  it("shows Continue to Next Stage when hasNext", () => {
    render(
      <MasteryPage badge="🛡️" badgeName="DocNative" title="Mastered" hasNext={true} onClose={vi.fn()} onNextStage={vi.fn()} />
    );
    expect(screen.getByText("Next Stage")).toBeInTheDocument();
  });

  it("calls onNextStage when Next Stage clicked", () => {
    const onNextStage = vi.fn();
    render(
      <MasteryPage badge="🛡️" badgeName="DocNative" title="Mastered" hasNext={true} onClose={vi.fn()} onNextStage={onNextStage} />
    );
    fireEvent.click(screen.getByText("Next Stage"));
    expect(onNextStage).toHaveBeenCalled();
  });

  it("calls onClose when Finish clicked", () => {
    const onClose = vi.fn();
    render(
      <MasteryPage badge="🛡️" badgeName="DocNative" title="Mastered" hasNext={false} onClose={onClose} />
    );
    fireEvent.click(screen.getByText("Finish Journey"));
    expect(onClose).toHaveBeenCalled();
  });

  it("shows rewards section", () => {
    render(
      <MasteryPage badge="🛡️" badgeName="DocNative" title="Mastered" hasNext={false} onClose={vi.fn()} />
    );
    expect(screen.getByText(/Rewards Earned/)).toBeInTheDocument();
    expect(screen.getByText(/\+25 SVG/)).toBeInTheDocument();
  });
});

describe("StepContent", () => {
  mockLocationOrigin();

  const step: import("@/types/learn").ChapterStep = {
    id: "1", title: "1. Public Finance Principles", order: 1,
    youtube_url: "abc123", audio_url: "", transcript: "", text: "Content text",
    takeaways: [], trivia: [], is_completed: false, is_locked: false,
  };

  it("renders step title and progress", () => {
    render(
      <StepContent
        step={step} currentStep={1} totalSteps={5}
        activeFormat="text" showTrivia={false} origin="http://localhost"
        getPersonalizedText={(t) => t} onFormatChange={vi.fn()}
        onStartTrivia={vi.fn()}
      />
    );
    expect(screen.getByText("1. Public Finance Principles")).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 5 · ~3 min")).toBeInTheDocument();
    expect(screen.getByTestId("progress")).toBeInTheDocument();
  });

  it("renders text content when activeFormat is text", () => {
    render(
      <StepContent
        step={step} currentStep={1} totalSteps={5}
        activeFormat="text" showTrivia={false} origin="http://localhost"
        getPersonalizedText={(t) => t} onFormatChange={vi.fn()}
        onStartTrivia={vi.fn()}
      />
    );
    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it("renders video when activeFormat is video and origin is set", () => {
    render(
      <StepContent
        step={step} currentStep={1} totalSteps={5}
        activeFormat="video" showTrivia={false} origin="http://localhost"
        getPersonalizedText={(t) => t} onFormatChange={vi.fn()}
        onStartTrivia={vi.fn()}
      />
    );
    const iframe = document.querySelector("iframe");
    expect(iframe).toBeInTheDocument();
    expect(iframe?.src).toContain("abc123");
  });

  it("hides content when showTrivia is true", () => {
    render(
      <StepContent
        step={step} currentStep={1} totalSteps={5}
        activeFormat="text" showTrivia={true} origin="http://localhost"
        getPersonalizedText={(t) => t} onFormatChange={vi.fn()}
        onStartTrivia={vi.fn()}
      />
    );
    expect(screen.queryByText("Watch")).not.toBeInTheDocument();
    expect(screen.queryByText("Content text")).not.toBeInTheDocument();
  });

  it("shows Start Knowledge Check button when step has trivia", () => {
    const stepWithTrivia = {
      ...step,
      trivia: [{
        type: "multiple-choice" as const,
        question: "Test Q?",
        options: ["A", "B"],
        answer: 0,
        explanation: "Test",
      }],
    };
    render(
      <StepContent
        step={stepWithTrivia} currentStep={1} totalSteps={5}
        activeFormat="text" showTrivia={false} origin="http://localhost"
        getPersonalizedText={(t) => t} onFormatChange={vi.fn()}
        onStartTrivia={vi.fn()}
      />
    );
    expect(screen.getByText("Knowledge Check")).toBeInTheDocument();
  });
});

describe("TriviaSection", () => {
  const trivia = [{
    type: "multiple-choice" as const,
    question: "What is 2+2?",
    options: ["3", "4", "5"],
    answer: 1,
    explanation: "Basic math.",
  }];

  const defaultProps = {
    trivia, stepId: 1,
    showTrivia: true,
    isStepTriviaPassed: () => false,
    onCorrectAnswer: vi.fn(),
    onFinish: vi.fn(),
  };

  it("rend nothing when showTrivia is false", () => {
    const { container } = render(<TriviaSection {...defaultProps} showTrivia={false} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows step complete banner when trivia passed", () => {
    render(<TriviaSection {...defaultProps} isStepTriviaPassed={() => true} />);
    expect(screen.getByText("Step Complete!")).toBeInTheDocument();
  });

  it("renders MCQ question and options", () => {
    render(<TriviaSection {...defaultProps} />);
    expect(screen.getByText((c) => c.includes("What is 2+2?"))).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onCorrectAnswer when correct option clicked", () => {
    const onCorrectAnswer = vi.fn();
    render(<TriviaSection {...defaultProps} onCorrectAnswer={onCorrectAnswer} />);
    fireEvent.click(screen.getByText("4"));
    expect(onCorrectAnswer).toHaveBeenCalledWith(0);
  });

  it("does not call onCorrectAnswer when wrong option clicked", () => {
    const onCorrectAnswer = vi.fn();
    render(<TriviaSection {...defaultProps} onCorrectAnswer={onCorrectAnswer} />);
    fireEvent.click(screen.getByText("3"));
    expect(onCorrectAnswer).not.toHaveBeenCalled();
  });
});

describe("DocumentsTab", () => {
  const defaultProps = {
    stageId: 1, documentName: "Constitution",
    selectedYear: 2026, constitutionTab: "current" as const,
    apiLoading: false, currentStageDocs: [], yearOptions: [2026, 2025],
    isDocTracked: false,
    onYearChange: vi.fn(), onConstitutionTabChange: vi.fn(),
    onToggleTrackDoc: vi.fn(), onCopyShareLink: vi.fn(),
    onRequestDocument: vi.fn(),
  };

  it("renders repository title", () => {
    render(<DocumentsTab {...defaultProps} />);
    expect(screen.getByText("Documents Repository")).toBeInTheDocument();
  });

  it("shows loading spinner when apiLoading", () => {
    render(<DocumentsTab {...defaultProps} apiLoading={true} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows year selector buttons", () => {
    render(<DocumentsTab {...defaultProps} />);
    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("shows no documents state", () => {
    render(<DocumentsTab {...defaultProps} />);
    expect(screen.getByText(/No documents for/)).toBeInTheDocument();
  });
});
