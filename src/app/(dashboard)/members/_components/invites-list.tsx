"use client";

import { DataTable } from "~/components/ui/data-table";
import { useTRPC } from "~/trpc/react";

import type { Invitation } from "@zenstackhq/runtime/models";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";

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

export function InvitesList({
  organizationId,
}: {
  organizationId: string | null | undefined;
}) {
  const trpc = useTRPC();
  const { data: invitations, isPending } = useQuery(
    trpc.invitation.findMany.queryOptions(
      {
        include: {
          user: true,
        },
      },
      {
        enabled: !!organizationId,
      },
    ),
  );

  const table = useReactTable<Invitation>({
    data: invitations ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) return <div>Loading...</div>;

  if (!invitations) return <div>Nenhum convite encontrado</div>;

  return <DataTable table={table} emptyMessage="Nenhum convite encontrado" />;
}
