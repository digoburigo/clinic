import { Invitation } from "./invitation";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ has: string }>;

export default async function Page(props: { params: Params, searchParams: SearchParams }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const id = params.id;
  const has = searchParams.has && searchParams.has === "true" ? true : false;
  
  return <Invitation invitationId={id} hasUser={has} />;
}
