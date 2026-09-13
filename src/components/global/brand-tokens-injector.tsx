import { getLiveDesignTokens } from "@/lib/cms-live-data";
import { designTokensToCssVars } from "@/lib/design-tokens";

/** Injects live CMS brand tokens as `:root` CSS variables (SSR-safe). */
export async function BrandTokensInjector() {
  const tokens = await getLiveDesignTokens();
  const css = designTokensToCssVars(tokens);

  return (
    <style
      id="bns-brand-tokens"
      dangerouslySetInnerHTML={{
        __html: `:root{${css}}`,
      }}
    />
  );
}
