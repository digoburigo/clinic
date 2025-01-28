"use client";
"use no memo";

import { api } from "~/trpc/react";

import type { Patient } from "@zenstackhq/runtime/models";

import { useMemo } from "react";
import { DataTableRowAction } from "~/types";
import { useState } from "react";
import { getColumns } from "./patients-table-columns";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  type PaginationState,
  getFilteredRowModel,
  type ColumnFiltersState,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";

export function PatientsTable() {
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Patient> | null>(null);

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [patients] = api.patient.findMany.useSuspenseQuery({
    // take: pagination.pageSize,
    // skip: pagination.pageIndex * pagination.pageSize,
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });

  const [patientCount] = api.patient.count.useSuspenseQuery();

  const rowCount = patientCount;

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);

  const table = useReactTable({
    data: patients,
    columns,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    // state: {
    //   pagination,
    //   columnFilters,
    // },
    // manualPagination: true,
    // onPaginationChange: setPagination,
    // manualFiltering: true,
    // onColumnFiltersChange: setColumnFilters,
    debugTable: true,
  });

  return (
    <>
      <Input
        placeholder="Procurar por nome"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
      <DataTable table={table} />
    </>
  );
}
