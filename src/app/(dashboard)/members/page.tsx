import type { Metadata } from "next";
import MembersList from "./_components/members-list";
import { H4 } from "~/components/ui/typography";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { SentInvite } from "./_components/sent-invite";
import { useSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { InvitesList } from "./_components/invites-list";

export const metadata: Metadata = {
  title: "Membros",
  description: "Lista de membros",
};

export default async function Page() {
  const session = await useSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <H4>Membros</H4>
          </div>
        </CardHeader>
        <CardContent>
          <MembersList organizationId={session.session.activeOrganizationId} />
        </CardContent>
      </Card>
      <Card className="border-none shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <H4>Convites</H4>
            <SentInvite organizationId={session.session.activeOrganizationId} />
          </div>
        </CardHeader>
        <CardContent>
          <InvitesList organizationId={session.session.activeOrganizationId} />
        </CardContent>
      </Card>
    </>
  );
}
