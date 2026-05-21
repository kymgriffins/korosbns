import { redirect } from "next/navigation";
import { Routes } from "@/constants/routes";

interface Props {
  params: Promise<{ slug: string }>;
}

/** Legacy deep-dive URLs redirect to the articles index until API image parity ships. */
export default async function DeepDiveSlugRedirectPage({ params }: Props) {
  const { slug } = await params;
  redirect(`${Routes.Articles}?from=deep-dive&slug=${encodeURIComponent(slug)}`);
}
