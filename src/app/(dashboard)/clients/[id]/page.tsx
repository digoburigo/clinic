export default async function Page({ params }: { params: { id: string } }) {
  const p = await params;

  return <div>ClientPage with id: {p.id}</div>;
}
