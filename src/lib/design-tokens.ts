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
    heroHeadlineItalic?: boolean;
    heroHeadlineColor?: string;
    heroBodyColor?: string;
    sectionEyebrowColor?: string;
  };
  layout?: {
    heroAspect?: "4/3" | "16/10" | "16/9" | "1/1" | "auto";
    heroObjectFit?: "cover" | "contain" | "fill";
    footerRadius?: string;
    footerBackground?: "muted" | "background" | "card";
    featuredLayout?: "list" | "grid";
    featuredColumns?: 2 | 3 | 4;
  };
  /** Named colour themes editors can assign per programme / desk */
  programmePresets?: Record<
    string,
    {
      label: string;
      description?: string;
      brand: NonNullable<DesignTokens["brand"]>;
      buttons: NonNullable<DesignTokens["buttons"]>;
    }
  >;
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
      ...((defaultTokens as any).radii || {}),
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
    layout: {
      ...(defaultTokens as DesignTokens).layout,
      ...(override?.layout || {}),
    },
    programmePresets: {
      ...(defaultTokens as DesignTokens).programmePresets,
      ...(override?.programmePresets || {}),
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
    RADIUS_PRESET[t.buttons?.borderRadius || "md"] ||
    "4px";

  const primaryColor = t.brand?.primary || "#533afd";
  const foregroundColor = t.brand?.foreground || "#061b31";
  const hoverColor = t.buttons?.primaryHoverBg || "#7389ff";

  return [
    cssDecl("--color-indigo-ink", primaryColor),
    cssDecl("--color-indigo-hover", hoverColor),
    cssDecl("--color-midnight-ink", foregroundColor),
    cssDecl("--color-pure-white", t.brand?.primaryForeground || "#ffffff"),
    cssDecl("--color-mist", t.brand?.muted || "#f8fafd"),
    cssDecl("--color-frost", t.brand?.border || "#e5edf5"),
    cssDecl("--color-lavender-border", t.buttons?.outlineBorder || "#b9b9f9"),
    cssDecl("--primary", primaryColor, (defaultTokens as any).brand?.primary || "#0055FF"),
    cssDecl(
      "--primary-foreground",
      t.brand?.primaryForeground,
      (defaultTokens as any).brand?.primaryForeground || "#ffffff",
    ),
    cssDecl("--accent", t.brand?.accent, primaryColor),
    cssDecl("--background", t.brand?.background),
    cssDecl("--foreground", foregroundColor),
    cssDecl("--muted", t.brand?.muted),
    cssDecl("--card", t.brand?.card),
    cssDecl("--border", t.brand?.border),
    cssDecl("--surface-muted", t.brand?.surfaceMuted, t.brand?.muted),
    cssDecl("--radius", t.radii?.lg, (defaultTokens as any).radii?.lg || "0.5rem"),
    cssDecl("--bns-radius-xl", t.radii?.xl, (defaultTokens as any).radii?.xl || "0.75rem"),
    cssDecl("--bns-radius-2xl", t.radii?.["2xl"], (defaultTokens as any).radii?.["2xl"] || "1rem"),
    cssDecl("--brand-radius-sm", t.radii?.sm),
    cssDecl("--brand-radius-md", t.radii?.md),
    cssDecl("--brand-radius-card", t.radii?.card, (defaultTokens as any).radii?.card || "12px"),
    cssDecl("--brand-radius-image", t.radii?.image, (defaultTokens as any).radii?.image || "8px"),
    cssDecl("--brand-button-radius", buttonRadius),
    cssDecl("--radius-buttons", buttonRadius),
    cssDecl("--radius-cards", t.radii?.card || "4px"),
    cssDecl("--radius-inputs", t.radii?.sm || "4px"),
    cssDecl("--radius-pill", buttonRadius),
    cssDecl(
      "--brand-button-bg",
      t.buttons?.primaryBg,
      primaryColor,
    ),
    cssDecl(
      "--brand-button-fg",
      t.buttons?.primaryFg,
      t.brand?.primaryForeground || (defaultTokens.buttons as any).primaryFg || "#ffffff",
    ),
    cssDecl(
      "--brand-button-hover",
      hoverColor,
      (defaultTokens.buttons as any).primaryHoverBg || hoverColor,
    ),
    cssDecl("--brand-button-outline-bg", t.buttons?.outlineBg),
    cssDecl("--brand-button-outline-fg", t.buttons?.outlineFg || primaryColor),
    cssDecl("--brand-button-outline-border", t.buttons?.outlineBorder || "#b9b9f9"),
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

export function getHeroAspectClass(
  aspect?: DesignTokens["layout"] extends infer L
    ? L extends { heroAspect?: infer A }
      ? A
      : string
    : string,
): string {
  switch (aspect) {
    case "4/3":
      return "aspect-[4/3]";
    case "16/9":
      return "aspect-video";
    case "1/1":
      return "aspect-square";
    case "auto":
      return "min-h-[240px]";
    case "16/10":
    default:
      return "aspect-[16/10]";
  }
}

export function getHeroObjectFitClass(
  fit?: "cover" | "contain" | "fill" | string,
): string {
  switch (fit) {
    case "contain":
      return "object-contain";
    case "fill":
      return "object-fill";
    case "cover":
    default:
      return "object-cover object-center";
  }
}
