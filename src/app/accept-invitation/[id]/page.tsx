import { Invitation } from "./invitation";

type Params = Promise<{ id: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const id = params.id;

  return <Invitation invitationId={id} />;
}
