import ResetPasswordForm from "./reset-password-form";

type Params = Promise<{ token: string }>;

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const token = params.token;

  return <ResetPasswordForm token={token} />;
}
