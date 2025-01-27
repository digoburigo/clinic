"use client";

import { api } from "~/trpc/react";

import type { Patient } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "~/components/ui/data-table";

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
];

export function PatientsList() {
  const page = 1;
  const limit = 10;

  const skip = (page - 1) * limit;
  const take = limit;

  const [patients] = api.patient.findMany.useSuspenseQuery({
    take,
    skip,
    orderBy: {
      name: "asc",
    },
  });

  return (
    <DataTable
      columns={columns}
      data={patients}
      emptyMessage="Nenhum paciente encontrado"
    />
  );
}
