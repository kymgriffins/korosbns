import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: Promise<{ tab?: string }>;
};

export default async function LearnPage(_props: PageProps) {
  redirect("/projects");
}

