import type { Page } from "@playwright/test";

/**
 * App uses `trailingSlash: true` in next.config.ts — always navigate with a trailing slash.
 */
export function appPath(path: string): string {
  if (!path || path === "/") return "/";
  const [pathname, search] = path.split("?", 2);
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  return search ? `${withSlash}?${search}` : withSlash;
}

/** Home shows a full-screen loader that blocks nav clicks until it finishes. */
export async function waitForAppShell(page: Page): Promise<void> {
  const loader = page.locator('[class*="z-[10000]"]');
  if (await loader.isVisible().catch(() => false)) {
    await loader.waitFor({ state: "hidden", timeout: 30_000 });
  }
}

export async function gotoApp(page: Page, path: string): Promise<void> {
  await page.goto(appPath(path));
  if (path === "/" || path === "") await waitForAppShell(page);
}
