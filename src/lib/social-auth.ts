/**
 * Social Auth & OIDC Single Sign-On Adapter for Google & Apple Sign-In.
 */

export type SocialAuthProvider = "google" | "apple";

export type SocialUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  provider: SocialAuthProvider;
  token: string;
};

export const socialAuthAdapter = {
  getGoogleAuthUrl: (): string => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "bns-google-client-id.apps.googleusercontent.com";
    const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/auth/callback/google` : "https://budgetndiostory.org/auth/callback/google";
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email`;
  },

  getAppleAuthUrl: (): string => {
    const clientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "org.budgetndiostory.web";
    const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/auth/callback/apple` : "https://budgetndiostory.org/auth/callback/apple";
    return `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code%20id_token&response_mode=form_post`;
  },

  simulateSocialLogin: (provider: SocialAuthProvider, email?: string): SocialUser => {
    return {
      id: `usr-${provider}-${Date.now()}`,
      email: email || `citizen@budgetndiostory.org`,
      name: provider === "google" ? "Google Citizen User" : "Apple Citizen User",
      provider,
      token: `jwt-${provider}-token-spec-2026`,
    };
  },
};
