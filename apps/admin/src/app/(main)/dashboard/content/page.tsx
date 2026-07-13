import { redirect } from "next/navigation";

/** Legacy content library → Stories & Articles admin. */
export default function ContentRedirectPage() {
  redirect("/dashboard/stories");
}
