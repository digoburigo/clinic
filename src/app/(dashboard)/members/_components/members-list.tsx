"use client";

import { DataTable } from "~/components/ui/data-table";
import { useTRPC } from "~/trpc/react";

import type { Member } from "@zenstackhq/runtime/models";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useQuery } from "@tanstack/react-query";

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

export default function MembersList({
  organizationId,
}: {
  organizationId: string | null | undefined;
}) {
  const trpc = useTRPC();
  const { data: members, isPending } = useQuery(
    trpc.member.findMany.queryOptions(
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
    ),
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
