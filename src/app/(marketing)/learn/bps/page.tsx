import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";

/** Legacy BPS deep-dive URL → BPS FY 2026 unit edition hub. */
export default function BpsLearnRedirectPage() {
  redirect(Routes.LearnUnitEdition("budget-policy-statement", 2026));
}
