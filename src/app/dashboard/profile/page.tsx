import { redirect } from "next/navigation";

export default function ProfileRedirectPage() {
  // Redirect to the admin dashboard with the account sheet open.
  redirect("/admin/dashboard?manage=profile");
}
