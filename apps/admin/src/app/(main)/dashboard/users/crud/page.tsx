import { redirect } from "next/navigation";

/** Legacy StudioKit CRUD — users writes are invitation/HTML-only; use /dashboard/users. */
export default function AdminUsersCrudRedirect() {
  redirect("/dashboard/users");
}
