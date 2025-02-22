"use client";
"use no memo";

import { useRouter } from "next/navigation";
import { useTRPC } from "~/trpc/react";

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

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function PatientsTable() {
  const trpc = useTRPC();
  const router = useRouter();
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Patient> | null>(null);

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data: patients } = useSuspenseQuery(
    trpc.patient.findMany.queryOptions({
      // take: pagination.pageSize,
      // skip: pagination.pageIndex * pagination.pageSize,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    }),
  );

  const { data: patientCount } = useSuspenseQuery(
    trpc.patient.count.queryOptions(),
  );

  const rowCount = patientCount;

  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);

  const queryClient = useQueryClient();

  const { mutate: deletePatient, isPending: isDeleting } = useMutation(
    trpc.patient.delete.mutationOptions({
      onMutate: () => {
        const loadingTimeout = setTimeout(() => {
          toast.loading("Excluindo paciente...", { id: "delete-patient" });
        }, 300);
        return loadingTimeout;
      },
      onSettled: (_, __, ___, context) => {
        if (context) {
          clearTimeout(context);
        }
        toast.dismiss("delete-patient");
      },
      onSuccess: async (data) => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.patient.findMany.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.patient.count.queryKey(),
          }),
        ]);
        toast.success(`Paciente ${data?.name} excluído com sucesso`);
        setRowAction(null);
      },
      onError: (error) => {
        toast.error(`Erro ao excluir paciente: ${error.message}`);
      },
    }),
  );

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
    meta: {
      onRowClick: (row: Patient) => {
        router.push(`/patients/${row.id}`);
      },
    },
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

        <Button asChild>
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
              paciente <strong>{rowAction?.row.original.name}</strong> e todos
              os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
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
