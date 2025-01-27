"use client";

import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";

import type { Member } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "user.name",
    header: "Nome",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Função",
  },
];

export default function MembersList({ organizationId }: { organizationId: string | null | undefined }) {
  const { data: members, isPending } = api.member.findMany.useQuery(
    {
      where: {
        organizationId: organizationId as string,
      },
      include: {
        user: true,
      },
    },
    {
      enabled: !!organizationId,
    },
  );

  const { data: invitations } = api.invitation.findMany.useQuery();

  if (isPending) return <div>Loading...</div>;

  if (!members) return <div>Nenhum membro encontrado</div>;

  return <DataTable columns={columns} data={members} />;
}
