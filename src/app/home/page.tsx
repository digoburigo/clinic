import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { H3 } from "~/components/ui/typography";
import { UserMenu } from "~/components/user/user-menu";
import { auth } from "~/server/auth";
import { prefetch, trpc } from "~/trpc/server";
import { OrganizationList } from "./_components/organization-list";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  prefetch(
    trpc.organization.findMany.queryOptions({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    }),
  );

  return (
    <div className="container mx-auto space-y-8 p-4 pt-8">
      <div className="flex items-center justify-between">
        <div>
          <H3 className="mt-0">Bem-vindo, {session.user.name ?? "usuário"}</H3>
        </div>
        <div className="flex items-center space-x-2">
          <UserMenu />
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrganizationList userId={session.user.id} />
      </Suspense>
    </div>
  );
}
