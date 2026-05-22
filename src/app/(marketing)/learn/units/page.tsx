import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";

export default function LearnUnitsRedirectPage() {
  redirect(Routes.Learn);
}
