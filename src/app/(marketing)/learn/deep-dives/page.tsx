import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";

/** Deep-dive static pages are retired in favour of API-driven articles. */
export default function DeepDivesRedirectPage() {
  redirect(Routes.Articles);
}
