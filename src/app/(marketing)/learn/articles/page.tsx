import { redirect } from "next/navigation";

/** Articles live inside modules — no separate catalogue. */
export default function LearnArticlesPage() {
  redirect("/learn");
}
