import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";

/** Legacy global repository — documents now live inside each learning unit edition. */
export default function RepositoryRedirectPage() {
  redirect(Routes.Learn);
}
