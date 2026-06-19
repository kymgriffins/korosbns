import { describe, it, expect } from "vitest";

describe("registerServiceWorker", () => {
  it("does not throw when serviceWorker is not available", async () => {
    const mod = await import("../register-sw");
    expect(() => mod.registerServiceWorker()).not.toThrow();
  });

  it("does not throw when serviceWorker registration fails", async () => {
    const register = () => Promise.reject(new Error("no sw"));
    Object.defineProperty(navigator, "serviceWorker", {
      value: { register, ready: null },
      configurable: true,
      writable: true,
    });
    const mod = await import("../register-sw");
    expect(() => mod.registerServiceWorker()).not.toThrow();
  });
});

describe("unregisterServiceWorker", () => {
  it("does not throw when serviceWorker is not available", async () => {
    const mod = await import("../register-sw");
    expect(() => mod.unregisterServiceWorker()).not.toThrow();
  });
});
