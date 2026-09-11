import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LivePagePreview } from "../LivePagePreview";

describe("LivePagePreview Component", () => {
  it("renders the browser bar with page title, badge, and live URL", () => {
    render(
      <LivePagePreview
        url="/programmes/connect"
        pageTitle="BNS Connect"
      />
    );

    expect(screen.getByText("BNS Connect")).toBeInTheDocument();
    expect(screen.getByText("Live Preview")).toBeInTheDocument();
    expect(screen.getByText(/\/programmes\/connect/)).toBeInTheDocument();
  });

  it("renders the preview iframe with expected src and accessible title", () => {
    render(
      <LivePagePreview
        url="/about"
        pageTitle="About Us"
      />
    );

    const iframe = screen.getByTitle("Preview of About Us") as HTMLIFrameElement;
    expect(iframe).toBeInTheDocument();
    expect(iframe.src).toContain("/about");
  });

  it("provides device viewport buttons for Desktop, Tablet, and Mobile", () => {
    const handleDeviceChange = vi.fn();

    render(
      <LivePagePreview
        url="/"
        pageTitle="Landing Page"
        device="desktop"
        onDeviceChange={handleDeviceChange}
      />
    );

    const tabletBtn = screen.getByTitle("Tablet View (768px)");
    const mobileBtn = screen.getByTitle("Mobile View (390px)");

    fireEvent.click(tabletBtn);
    expect(handleDeviceChange).toHaveBeenCalledWith("tablet");

    fireEvent.click(mobileBtn);
    expect(handleDeviceChange).toHaveBeenCalledWith("mobile");
  });

  it("triggers onRefresh callback when reload button is clicked", () => {
    const handleRefresh = vi.fn();

    render(
      <LivePagePreview
        url="/bns-studio"
        pageTitle="BNS Studios"
        onRefresh={handleRefresh}
      />
    );

    const reloadBtn = screen.getByTitle("Reload Preview");
    fireEvent.click(reloadBtn);

    expect(handleRefresh).toHaveBeenCalledTimes(1);
  });
});
