import defaultTokens from "@/content/design-tokens.json";

export type BadgeShape = "pill" | "rounded" | "subtle" | "sharp";
export type BadgeVariant = "soft" | "outline" | "solid" | "glass";
export type BadgeColorScheme = "emerald" | "brand" | "amber" | "slate";
export type BadgeTypography = "uppercase" | "normal" | "mono";

export interface DesignTokens {
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
  };
  typography?: {
    eyebrowTracking?: "wider" | "normal" | "tight";
    headlineWeight?: "bold" | "semibold" | "medium";
  };
}

export function resolveDesignTokens(override?: DesignTokens | null): DesignTokens {
  return {
    ...defaultTokens,
    ...(override || {}),
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
  color: BadgeColorScheme = "emerald"
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

  // default: soft
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
