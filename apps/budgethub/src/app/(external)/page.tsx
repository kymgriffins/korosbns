import { redirect } from "next/navigation";

export default function Home() {
  redirect("/budgethub/dashboard/default");
  return <>Coming Soon</>;
}
