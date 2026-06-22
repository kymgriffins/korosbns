import { redirect } from "next/navigation";

export default function Home() {
  redirect("/budgethub/dashboard/lms");
  return <>Coming Soon</>;
}
