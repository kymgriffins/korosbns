import { programmeThemeToCssVars, type ProgrammeTheme } from "@/lib/programme-theme";
import type { DesignTokens } from "@/lib/design-tokens";
import { cn } from "@/utils";

type Props = {
  theme?: ProgrammeTheme | null;
  globalTokens?: DesignTokens | null;
  className?: string;
  children: React.ReactNode;
};

/**
 * Scopes brand CSS variables to a programme (or blog) surface so Connect can be
 * blue while Mashinani is red without changing the rest of the site.
 */
export function ProgrammeThemeScope({
  theme,
  globalTokens,
  className,
  children,
}: Props) {
  const preset = theme?.preset || "global";
  if (preset === "global" && !theme?.primary && !theme?.buttonBg) {
    return <div className={className}>{children}</div>;
  }

  const css = programmeThemeToCssVars(theme, globalTokens);
  const scopeId = `programme-theme-${preset}`;

  return (
    <div
      className={cn(scopeId, className)}
      data-programme-theme={preset}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.${scopeId}{${css}}`,
        }}
      />
      {children}
    </div>
  );
}
