import { redirect } from "next/navigation";

export default function LearnDocumentsPage() {
  redirect("/learn?tab=documents");
}
