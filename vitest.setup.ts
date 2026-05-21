import "@testing-library/jest-dom/vitest";

// jsdom cannot resolve relative fetch URLs (e.g. /api/youtube, /api/gamification/me/)
const nativeFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const href =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  if (href.startsWith("/")) {
    return nativeFetch(new URL(href, "http://localhost:3000").toString(), init);
  }
  return nativeFetch(input, init);
}) as typeof fetch;

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
