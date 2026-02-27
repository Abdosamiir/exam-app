export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = await params;
  const { ...rest } = await searchParams;
  console.log(id, rest);
  return <div>page {id}</div>;
}
