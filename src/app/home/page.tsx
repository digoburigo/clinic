import { redirect } from "next/navigation";
import { useSession } from "~/server/auth";
import { OrganizationList } from "./_components/organization-list";
import { UserMenu } from "~/components/user/user-menu";
import {  H3 } from "~/components/ui/typography";
import { api } from "~/trpc/server";

export default async function HomePage() {
  const authSession = await useSession();

  if (!authSession?.user) {
    return redirect("/login");
  }

  const organizations = await api.organization.findMany({
    where: {
      members: {
        some: {
          userId: authSession.user.id,
        },
      },
    },
  });

  return (
    <div className="container mx-auto space-y-8 p-4 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <H3 className="mt-0">Bem-vindo, {authSession.user.name ?? "usuário"}</H3>
        </div>
        <div className="flex items-center space-x-2">
          <UserMenu />
        </div>
      </div>
      <OrganizationList organizations={organizations} />
    </div>
  );
}
