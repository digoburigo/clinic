import { RegisterForm } from "./register-form";

type SearchParams = Promise<{ iup?: string }>;

export default async function Page(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const iup = searchParams.iup === "true" ? true : false;

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <RegisterForm iup={iup} />
    </div>
  );
}
