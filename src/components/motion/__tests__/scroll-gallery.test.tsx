import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollGallery, type GalleryItem } from "../scroll-gallery";

const MOCK_ITEMS: GalleryItem[] = [
  { id: "1", title: "Grassroots Assembly", src: "/images/test1.jpg", category: "Baraza" },
  { id: "2", title: "Maternity Clinic Audit", src: "/images/test2.jpg", category: "Healthcare" },
  { id: "3", title: "Water Kiosk Pipeline", src: "/images/test3.jpg", category: "Water" },
  { id: "4", title: "Road Construction Site", src: "/images/test4.jpg", category: "Infrastructure" },
  {
    id: "5",
    title: "The Sovereign Shilling: 4K Anamorphic Feature",
    subtitle: "Investigating KSh 2.4B county procurement deviations across Western Kenya.",
    src: "/images/test5.jpg",
    category: "Cinema Feature",
    badge: "FLAGSHIP CINEMA",
  },
  { id: "6", title: "Youth Scrutiny Circle", src: "/images/test6.jpg", category: "Connect" },
  { id: "7", title: "Newsroom Leak Bureau", src: "/images/test7.jpg", category: "Wanahabari" },
  { id: "8", title: "County Assembly Hearing", src: "/images/test8.jpg", category: "Devolution" },
  { id: "9", title: "National Debt Policy", src: "/images/test9.jpg", category: "Treasury" },
];

describe("ScrollGallery Primitive", () => {
  it("renders 3x3 stage with headline and eyebrow", () => {
    render(
      <ScrollGallery
        items={MOCK_ITEMS}
        headline="Cinema Production Showcase"
        eyebrow="4K BROADCAST GRADE"
      />
    );

    expect(screen.getByText(/4K BROADCAST GRADE/i)).toBeInTheDocument();
    expect(screen.getByText(/Cinema Production Showcase/i)).toBeInTheDocument();
    expect(screen.getByText(/Centerpiece Zoom/i)).toBeInTheDocument();
  });

  it("renders center focal element with title and subtitle", () => {
    render(<ScrollGallery items={MOCK_ITEMS} />);

    expect(
      screen.getByRole("heading", { name: /The Sovereign Shilling: 4K Anamorphic Feature/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Investigating KSh 2.4B county procurement deviations/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/FLAGSHIP CINEMA/i)).toBeInTheDocument();
  });

  it("pads items up to 9 when fewer items are provided", () => {
    const fewItems = MOCK_ITEMS.slice(0, 3);
    const { container } = render(<ScrollGallery items={fewItems} />);

    // Grid should contain 9 tiles
    const tiles = container.querySelectorAll(".grid > div");
    expect(tiles.length).toBe(9);
  });
});
