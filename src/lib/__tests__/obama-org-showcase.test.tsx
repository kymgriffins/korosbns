import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ObamaOrgShowcase } from "@/components/marketing/obama-org-showcase";

// Mock next/link to render basic anchors
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock motion/react to render clean elements
vi.mock("motion/react", () => ({
  motion: {
    div: ({ children, className, whileHover, whileTap, initial, animate, transition, ...props }: any) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

describe("ObamaOrgShowcase Component (Sovereign Preset)", () => {
  it("renders the top civic movement alert ribbon", () => {
    render(<ObamaOrgShowcase />);
    expect(screen.getByText(/FY2025\/2026 Devolution Audit:/i)).toBeInTheDocument();
    expect(screen.getByText(/Attend Assembly/i)).toBeInTheDocument();
  });

  it("renders the Sovereign split hero with the core civic headline", () => {
    render(<ObamaOrgShowcase />);
    expect(screen.getByText(/Hope is not a passive sentiment./i)).toBeInTheDocument();
    expect(screen.getByText(/It is civic work./i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore The Work/i })).toHaveAttribute(
      "href",
      "/programmes"
    );
    expect(screen.getByRole("link", { name: /Join An Assembly/i })).toHaveAttribute(
      "href",
      "/connect"
    );
  });

  it("renders the three movement tenets / pillars", () => {
    render(<ObamaOrgShowcase />);
    expect(screen.getByText("01 / LITERACY")).toBeInTheDocument();
    expect(screen.getByText("02 / FORENSICS")).toBeInTheDocument();
    expect(screen.getByText("03 / GRASSROOTS")).toBeInTheDocument();
    expect(screen.getByText("Civic Budget Literacy")).toBeInTheDocument();
    expect(screen.getByText("Investigative Newsrooms")).toBeInTheDocument();
    expect(screen.getByText("Community Assemblies")).toBeInTheDocument();
  });

  it("renders the frontline citizen testimony by Faith Muthoni", () => {
    render(<ObamaOrgShowcase />);
    expect(screen.getByText(/Faith Muthoni/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Citizen Auditor & Community Organizer · Nakuru County/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/uncovered KSh 18 Million had been allocated/i)).toBeInTheDocument();
  });

  it("renders the 4-metric civic impact ledger", () => {
    render(<ObamaOrgShowcase />);
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("KSh 4.2B")).toBeInTheDocument();
    expect(screen.getByText("12,400+")).toBeInTheDocument();
    expect(screen.getByText("350+")).toBeInTheDocument();
  });

  it("handles email dispatch subscription", () => {
    render(<ObamaOrgShowcase />);
    const emailInput = screen.getByPlaceholderText(/Enter your email address.../i);
    const submitBtn = screen.getByRole("button", { name: /Subscribe Free/i });

    fireEvent.change(emailInput, { target: { value: "citizen@budgetndiostory.org" } });
    fireEvent.click(submitBtn);

    expect(
      screen.getByText(/You are subscribed to the BNS Dispatch. Karibu!/i)
    ).toBeInTheDocument();
  });
});
