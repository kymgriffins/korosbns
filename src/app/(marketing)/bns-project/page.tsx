import { redirect } from "next/navigation";

/** Legacy index → canonical JSON-backed project list (not programmes dump). */
export default function BNSProjectPage() {
  redirect("/projects");
}
