import { redirect } from "next/navigation";

export default function LearnForumPage() {
  redirect("/learn?tab=forum");
}
