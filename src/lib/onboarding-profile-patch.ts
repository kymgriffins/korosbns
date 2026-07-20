import type { UserProfileApi } from "@/lib/api-client";

export type OnboardingFormValues = {
  breakName: string;
  pseudoName: string;
  county: string;
  ward?: string;
  language: "EN" | "SW" | "SH" | string;
  educationLevel?: string;
  ageRange?: string;
  dateOfBirth?: string;
  notifications?: boolean;
  whatsappFallback?: boolean;
  phone?: string;
  consentGranted?: boolean;
  consentTimestamp?: string;
  /** Budget interest tags from registration (Healthcare, Education, …). */
  priorities?: string[];
};

/**
 * Maps onboarding form values to top-level Profile API fields.
 * Prefs must NOT live only under metadata — personalization depends on these columns.
 */
export function buildOnboardingProfilePatch(
  values: OnboardingFormValues,
): Partial<UserProfileApi> {
  const county = values.county.trim();
  const language = String(values.language || "EN").toUpperCase();
  const patch: Partial<UserProfileApi> = {
    display_name: values.breakName.trim(),
    break_name: values.breakName.trim(),
    pseudo_name: values.pseudoName.trim(),
    county,
    ward: (values.ward || "").trim() || undefined,
    location: county,
    language_preference: language,
    age_range: values.ageRange || undefined,
    education_level: values.educationLevel || undefined,
    phone_number: (values.phone || "").trim() || undefined,
    notifications_enabled: values.notifications ?? true,
    whatsapp_fallback: values.whatsappFallback ?? false,
    dpa_consent_granted: values.consentGranted ?? true,
    dpa_consent_timestamp: values.consentTimestamp || new Date().toISOString(),
    onboarding_completed_at: new Date().toISOString(),
  };
  if (values.priorities?.length) {
    patch.budget_priorities = values.priorities;
  }
  if (values.dateOfBirth) {
    patch.date_of_birth = values.dateOfBirth;
    patch.metadata = { date_of_birth: values.dateOfBirth };
  }
  return patch;
}
