import defaultTokens from "@/content/design-tokens.json";

export type BadgeShape = "pill" | "rounded" | "subtle" | "sharp";
export type BadgeVariant = "soft" | "outline" | "solid" | "glass";
export type BadgeColorScheme = "emerald" | "brand" | "amber" | "slate";
export type BadgeTypography = "uppercase" | "normal" | "mono";

export interface DesignTokens {
  brand?: {
    primary?: string;
    primaryForeground?: string;
    accent?: string;
    background?: string;
    foreground?: string;
    muted?: string;
    card?: string;
    border?: string;
    surfaceMuted?: string;
  };
  radii?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    "2xl"?: string;
    card?: string;
    button?: string;
    image?: string;
  };
  badges?: {
    shape?: BadgeShape;
    variant?: BadgeVariant;
    colorScheme?: BadgeColorScheme;
    typography?: BadgeTypography;
    showDot?: boolean;
  };
  buttons?: {
    borderRadius?: "full" | "lg" | "md" | "sm" | "none";
    defaultElevation?: "none" | "subtle" | "elevated";
    primaryBg?: string;
    primaryFg?: string;
    primaryHoverBg?: string;
    outlineBg?: string;
    outlineFg?: string;
    outlineBorder?: string;
  };
  typography?: {
    eyebrowTracking?: "wider" | "normal" | "tight";
    headlineWeight?: "bold" | "semibold" | "medium";
  };
}

const RADIUS_PRESET: Record<string, string> = {
  full: "9999px",
  lg: "0.75rem",
  md: "0.5rem",
  sm: "0.375rem",
  none: "0px",
};

export function resolveDesignTokens(override?: DesignTokens | null): DesignTokens {
  return {
    ...defaultTokens,
    ...(override || {}),
    brand: {
      ...defaultTokens.brand,
      ...(override?.brand || {}),
    },
    radii: {
      ...defaultTokens.radii,
      ...(override?.radii || {}),
    },
    badges: {
      ...defaultTokens.badges,
      ...(override?.badges || {}),
    },
    buttons: {
      ...defaultTokens.buttons,
      ...(override?.buttons || {}),
    },
    typography: {
      ...defaultTokens.typography,
      ...(override?.typography || {}),
    },
  } as DesignTokens;
}

function cssDecl(name: string, value: string | undefined, fallback?: string): string {
  const v = (value || fallback || "").trim();
  if (!v) return "";
  return `${name}:${v};`;
}

/** Serialize CMS tokens into `:root` CSS custom properties. */
export function designTokensToCssVars(override?: DesignTokens | null | Record<string, unknown>): string {
  const t = resolveDesignTokens((override || null) as DesignTokens | null);
  const buttonRadius =
    t.radii?.button ||
    RADIUS_PRESET[t.buttons?.borderRadius || "full"] ||
    "9999px";

  return [
    cssDecl("--primary", t.brand?.primary, defaultTokens.brand.primary),
    cssDecl(
      "--primary-foreground",
      t.brand?.primaryForeground,
      defaultTokens.brand.primaryForeground,
    ),
    cssDecl("--accent", t.brand?.accent, t.brand?.primary),
    cssDecl("--background", t.brand?.background),
    cssDecl("--foreground", t.brand?.foreground),
    cssDecl("--muted", t.brand?.muted),
    cssDecl("--card", t.brand?.card),
    cssDecl("--border", t.brand?.border),
    cssDecl("--surface-muted", t.brand?.surfaceMuted, t.brand?.muted),
    cssDecl("--radius", t.radii?.lg, defaultTokens.radii.lg),
    cssDecl("--bns-radius-xl", t.radii?.xl, defaultTokens.radii.xl),
    cssDecl("--bns-radius-2xl", t.radii?.["2xl"], defaultTokens.radii["2xl"]),
    cssDecl("--brand-radius-sm", t.radii?.sm),
    cssDecl("--brand-radius-md", t.radii?.md),
    cssDecl("--brand-radius-card", t.radii?.card, defaultTokens.radii.card),
    cssDecl("--brand-radius-image", t.radii?.image, defaultTokens.radii.image),
    cssDecl("--brand-button-radius", buttonRadius),
    cssDecl("--radius-pill", buttonRadius),
    cssDecl(
      "--brand-button-bg",
      t.buttons?.primaryBg,
      t.brand?.primary || defaultTokens.buttons.primaryBg,
    ),
    cssDecl(
      "--brand-button-fg",
      t.buttons?.primaryFg,
      t.brand?.primaryForeground || defaultTokens.buttons.primaryFg,
    ),
    cssDecl(
      "--brand-button-hover",
      t.buttons?.primaryHoverBg,
      defaultTokens.buttons.primaryHoverBg,
    ),
    cssDecl("--brand-button-outline-bg", t.buttons?.outlineBg),
    cssDecl("--brand-button-outline-fg", t.buttons?.outlineFg),
    cssDecl("--brand-button-outline-border", t.buttons?.outlineBorder),
  ]
    .filter(Boolean)
    .join("");
}

export function getBadgeShapeClass(shape: BadgeShape = "pill"): string {
  switch (shape) {
    case "pill":
      return "rounded-full";
    case "rounded":
      return "rounded-md";
    case "subtle":
      return "rounded-sm";
    case "sharp":
      return "rounded-none";
    default:
      return "rounded-full";
  }
}

export function getBadgeColorClass(
  variant: BadgeVariant = "soft",
  color: BadgeColorScheme = "emerald",
): string {
  if (variant === "solid") {
    switch (color) {
      case "emerald":
        return "bg-emerald-600 text-white border-transparent";
      case "brand":
        return "bg-primary text-primary-foreground border-transparent";
      case "amber":
        return "bg-amber-600 text-white border-transparent";
      case "slate":
        return "bg-neutral-800 text-white border-transparent";
    }
  }

  if (variant === "outline") {
    switch (color) {
      case "emerald":
        return "bg-transparent text-emerald-600 dark:text-emerald-400 border-emerald-500/40";
      case "brand":
        return "bg-transparent text-primary border-primary/40";
      case "amber":
        return "bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/40";
      case "slate":
        return "bg-transparent text-foreground/80 border-border";
    }
  }

  if (variant === "glass") {
    return "backdrop-blur-md bg-background/50 border-border/60 text-foreground";
  }

  switch (color) {
    case "emerald":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25";
    case "brand":
      return "bg-primary/10 text-primary border-primary/20";
    case "amber":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25";
    case "slate":
      return "bg-muted text-muted-foreground border-border/60";
  }
}

export function getBadgeTypographyClass(typography: BadgeTypography = "uppercase"): string {
  switch (typography) {
    case "uppercase":
      return "uppercase tracking-wider font-semibold text-[11px]";
    case "mono":
      return "font-mono font-bold text-[11px]";
    case "normal":
      return "normal-case font-medium text-xs";
    default:
      return "uppercase tracking-wider font-semibold text-[11px]";
  }
}

export function computeBadgeClasses(tokens?: DesignTokens | null): string {
  const t = resolveDesignTokens(tokens);
  const shapeCls = getBadgeShapeClass(t.badges?.shape);
  const colorCls = getBadgeColorClass(t.badges?.variant, t.badges?.colorScheme);
  const typoCls = getBadgeTypographyClass(t.badges?.typography);
  return `inline-flex items-center gap-1.5 px-3.5 py-1 border ${shapeCls} ${colorCls} ${typoCls} transition-all duration-200`;
}

export function getButtonRadiusClass(tokens?: DesignTokens | null): string {
  const t = resolveDesignTokens(tokens);
  switch (t.buttons?.borderRadius) {
    case "lg":
      return "rounded-lg";
    case "md":
      return "rounded-md";
    case "sm":
      return "rounded-sm";
    case "none":
      return "rounded-none";
    case "full":
    default:
      return "rounded-full";
  }
}
