import { redirect } from "next/navigation";

export default function LmsAnalyticsRedirect() {
  redirect("/admin/dashboard/analytics");
}
