"use client";

import { api } from "~/trpc/react";
import { DataTable } from "~/components/ui/data-table";

import type { Member } from "@zenstackhq/runtime/models";

import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";

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

  const table = useReactTable<Member>({
    data: members ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isPending) return <div>Loading...</div>;

  if (!members) return <div>Nenhum membro encontrado</div>;
  

  return <DataTable table={table} emptyMessage="Nenhum membro encontrado" />;
}
