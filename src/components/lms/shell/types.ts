/**
 * Learning Shell layer configuration.
 * @see docs/ljp-spec/implementation-roadmap.md Phase B
 */

export type LmsShellMode = "hub" | "immersive" | "account";

export type LmsShellLayers = {
  topNav: boolean;
  bottomNav: boolean;
  toast: boolean;
  dialog: boolean;
  bottomSheetHost: boolean;
};

export const SHELL_LAYERS_BY_MODE: Record<LmsShellMode, LmsShellLayers> = {
  hub: {
    topNav: true,
    bottomNav: true,
    toast: true,
    dialog: true,
    bottomSheetHost: true,
  },
  immersive: {
    topNav: true,
    bottomNav: false,
    toast: true,
    dialog: true,
    bottomSheetHost: true,
  },
  account: {
    topNav: false,
    bottomNav: false,
    toast: true,
    dialog: true,
    bottomSheetHost: false,
  },
};

export function resolveShellMode(pathname: string): LmsShellMode {
  if (pathname.startsWith("/learn/account")) return "account";
  if (pathname.includes("/lessons/")) return "immersive";
  return "hub";
}
