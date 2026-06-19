export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <div>{/* TODO: learning path for {slug} */}</div>;
}
