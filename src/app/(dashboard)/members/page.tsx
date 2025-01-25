  
import type { Metadata } from "next";
import MembersList from "./_components/members-list";
import { H4 } from "~/components/ui/typography";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { AddMember } from "./_components/add-member";
import { useSession } from "~/server/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Membros",
  description: "Lista de membros",
};

export default async function Page() {
  const session = await useSession();

  if (!session) {
    redirect("/login");
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <div className="flex items-center justify-between">
          <H4>Lista de membros</H4>
          <AddMember organizationId={session.session.activeOrganizationId} />
        </div>
      </CardHeader>
      <CardContent>
        <MembersList organizationId={session.session.activeOrganizationId} />
      </CardContent>
    </Card>
  )
}

