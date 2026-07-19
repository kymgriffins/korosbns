import { describe, it, expect } from "vitest";
import { buildOnboardingProfilePatch } from "@/lib/onboarding-profile-patch";

describe("buildOnboardingProfilePatch (P1 personalization persistence)", () => {
  it("writes age_range, language_preference, and county as top-level fields", () => {
    const patch = buildOnboardingProfilePatch({
      breakName: "Amina",
      pseudoName: "Amina_Nairobi",
      county: "Nairobi",
      ward: "Westlands",
      language: "SW",
      educationLevel: "tertiary",
      ageRange: "age_18_24",
      phone: "0712345678",
      consentGranted: true,
    });

    expect(patch.county).toBe("Nairobi");
    expect(patch.ward).toBe("Westlands");
    expect(patch.language_preference).toBe("SW");
    expect(patch.age_range).toBe("age_18_24");
    expect(patch.education_level).toBe("tertiary");
    expect(patch.break_name).toBe("Amina");
    // Must not bury prefs only in metadata
    expect((patch.metadata as Record<string, unknown>)?.age_range).toBeUndefined();
    expect((patch.metadata as Record<string, unknown>)?.language).toBeUndefined();
  });

  it("includes budget_priorities and date_of_birth when provided", () => {
    const patch = buildOnboardingProfilePatch({
      breakName: "Juma",
      pseudoName: "Juma_Kisumu",
      county: "Kisumu",
      language: "EN",
      ageRange: "age_25_34",
      educationLevel: "secondary",
      priorities: ["Healthcare", "Education"],
      dateOfBirth: "2000-01-15",
    });
    expect(patch.budget_priorities).toEqual(["Healthcare", "Education"]);
    expect(patch.date_of_birth).toBe("2000-01-15");
  });
});
