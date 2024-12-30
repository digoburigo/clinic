import { ForgotPasswordForm } from "./forgot-password-form";

export default function Page({ searchParams }: { searchParams: { email?: string } }) {
  return <ForgotPasswordForm email={searchParams.email} />;
}
