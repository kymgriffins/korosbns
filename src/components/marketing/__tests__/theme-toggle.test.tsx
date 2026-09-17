import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ThemeToggle, CMS_THEME_OPTIONS } from "../theme-toggle";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/stores/preferences/preferences-provider", () => {
  let currentPreset = "default";
  return {
    usePreferencesStore: (selector: any) =>
      selector({
        themePreset: currentPreset,
        setThemePreset: (p: string) => {
          currentPreset = p;
        },
      }),
  };
});

describe("ThemeToggle CMS Theme Selector", () => {
  beforeEach(() => {
    document.documentElement.removeAttribute("data-theme-preset");
  });

  it("renders the CMS theme toggle trigger button", () => {
    render(<ThemeToggle />);
    const trigger = screen.getByRole("button", { name: /CMS Theme/i });
    expect(trigger).toBeInTheDocument();
  });

  it("lists all CMS theme options: default, editorial, cinematic, brutalist", () => {
    render(<ThemeToggle />);
    const trigger = screen.getByRole("button", { name: /CMS Theme/i });
    fireEvent.pointerDown(trigger, { button: 0 });

    for (const opt of CMS_THEME_OPTIONS) {
      expect(screen.getByText(opt.label)).toBeInTheDocument();
    }
  });

  it("applies data-theme-preset when a theme is selected", () => {
    render(<ThemeToggle />);
    const trigger = screen.getByRole("button", { name: /CMS Theme/i });
    fireEvent.pointerDown(trigger, { button: 0 });

    const brutalistOption = screen.getByText(/Brutalist/i);
    fireEvent.click(brutalistOption);

    expect(document.documentElement.getAttribute("data-theme-preset")).toBe("brutalist");
  });

  it("renders the Save Theme to Live Production button in the dropdown", () => {
    render(<ThemeToggle />);
    const trigger = screen.getByRole("button", { name: /CMS Theme/i });
    fireEvent.pointerDown(trigger, { button: 0 });

    const publishBtn = screen.getByRole("button", {
      name: /Save Theme to Live Production/i,
    });
    expect(publishBtn).toBeInTheDocument();
  });
});
