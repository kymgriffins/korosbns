export const dynamicParams = true;
export const revalidate = 3600;
export const fallback = "blocking";

export async function generateStaticParams() {
  return [];
}

export default async function UnifiedReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <div>{/* TODO: render content for slug: {slug} */}</div>;
}
