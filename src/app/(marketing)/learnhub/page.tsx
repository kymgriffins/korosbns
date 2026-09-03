import { redirect } from "next/navigation";

/** Deprecated demo route — the learning hub lives at /learn. */
export default function LearnHubRedirect() {
  redirect("/learn");
}
