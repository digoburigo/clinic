"use client";
"use no memo";

import { api } from "~/trpc/react";

import type { Patient } from "@zenstackhq/runtime/models";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
} from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Input } from "~/components/ui/input";
import { DataTableRowAction } from "~/types";
import { getColumns } from "./patients-table-columns";

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

  const utils = api.useUtils();
  const { mutate: deletePatient, isPending: isDeleting } =
    api.patient.delete.useMutation({
      onMutate: () => {
        toast.loading("Excluindo paciente...", { id: "delete-patient" });
      },
      onSettled: () => {
        toast.dismiss("delete-patient");
      },
      onSuccess: async () => {
        await Promise.all([
          utils.patient.findMany.invalidate(),
          utils.patient.count.invalidate(),
        ]);
        toast.success("Paciente excluído com sucesso");
        setRowAction(null);
      },
      onError: (error) => {
        toast.error(`Erro ao excluir paciente: ${error.message}`);
      },
    });

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
      <div className="flex justify-between gap-4">
        <Input
          placeholder="Procurar por nome"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button asChild className="dark:bg-white dark:text-black">
          <Link href="/patients/new">
            <PlusIcon className="h-4 w-4" />
            Novo paciente
          </Link>
        </Button>
      </div>

      <DataTable table={table} />

      <AlertDialog
        open={rowAction?.type === "delete"}
        onOpenChange={() => setRowAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              paciente <strong>{rowAction?.row.original.name}</strong> e todos os dados
              associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                if (rowAction?.row.original.id) {
                  deletePatient({
                    where: {
                      id: rowAction.row.original.id,
                    },
                  });
                }
              }}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
