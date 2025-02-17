import { ForgotPasswordForm } from "./forgot-password-form";

type SearchParams = Promise<{ email?: string }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const email = searchParams.email;

  return <ForgotPasswordForm email={email} />;
}
