"use client";

import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";

import type { Invitation } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Invitation>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "role",
    header: "Função",
  },
];

export function InvitesList({ organizationId }: { organizationId: string | null | undefined }) {
  const { data: invitations, isPending } = api.invitation.findMany.useQuery(
    {
      include: {
        user: true,
      },
    },
    {
      enabled: !!organizationId,
    },
  );

  console.log(`invitations:`, invitations)


  if (isPending) return <div>Loading...</div>;

  if (!invitations) return <div>Nenhum convite encontrado</div>;

  return <DataTable columns={columns} data={invitations} emptyMessage="Nenhum convite encontrado" />;
}
