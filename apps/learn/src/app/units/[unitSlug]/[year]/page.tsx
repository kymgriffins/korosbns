export default async function UnitEditionPage({
  params,
}: {
  params: Promise<{ unitSlug: string; year: string }>;
}) {
  const { unitSlug, year } = await params;
  return <div>{/* TODO: unit {unitSlug} edition {year} */}</div>;
}
