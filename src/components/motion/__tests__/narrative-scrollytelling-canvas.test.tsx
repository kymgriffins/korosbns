import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  NarrativeScrollytellingCanvas,
  type NarrativeBeat,
} from "../narrative-scrollytelling-canvas";

const TEST_BEATS: NarrativeBeat[] = [
  {
    id: "beat-1",
    eyebrow: "The Awakening",
    title: "Protesting after a bill is gazetted is 12 months too late.",
    paragraphs: [
      "First paragraph describing upstream fiscal intervention.",
      "Second paragraph detailing exchequer table analysis.",
    ],
    quote: {
      text: "Citizens must master the budget cycle 12 months in advance.",
      author: "Founding Lead",
    },
    metric: {
      value: "KSh 4.82T",
      label: "National Budget Tracked",
    },
    image: "/images/cohort1 groundworks/129A3964.jpg",
    imageAlt: "Test Alt 1",
    imageCaption: "Test Caption 1",
    imageBadge: "TEST BADGE 1",
  },
  {
    id: "beat-2",
    eyebrow: "The Legal Charter",
    title: "Article 201 is our editorial director.",
    paragraphs: ["Public finance must be open and accountable."],
    image: "/images/towwnhallmay/129A3863.jpg",
    imageAlt: "Test Alt 2",
    imageCaption: "Test Caption 2",
  },
];

describe("NarrativeScrollytellingCanvas", () => {
  it("renders narrative beats with titles, paragraphs, pullquotes, and metrics", () => {
    render(<NarrativeScrollytellingCanvas beats={TEST_BEATS} />);

    // Headings
    expect(
      screen.getByText(/Protesting after a bill is gazetted is 12 months too late/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Article 201 is our editorial director/i),
    ).toBeInTheDocument();

    // Paragraph text
    expect(
      screen.getByText(/First paragraph describing upstream fiscal intervention/i),
    ).toBeInTheDocument();

    // Pullquote
    expect(
      screen.getByText(/Citizens must master the budget cycle 12 months in advance/i),
    ).toBeInTheDocument();

    // Metrics (can be in both image canvas and text)
    expect(screen.getAllByText(/KSh 4.82T/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/National Budget Tracked/i).length).toBeGreaterThanOrEqual(1);

    // Badges & Captions
    expect(screen.getByText(/TEST BADGE 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Caption 1/i)).toBeInTheDocument();
  });
});
