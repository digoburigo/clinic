"use client";
"use no memo";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
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
import { useTRPC } from "~/trpc/react";
import { DataTableRowAction } from "~/types";
import { AppointmentWithPatient } from "~/types/db-entities";
import { withPatientName } from "../../utils/queries";
import { getColumns } from "./appointments-table-columns";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

const fallbackData: AppointmentWithPatient[] = [];

export function AppointmentsTable() {
  const trpc = useTRPC();
  const { data: appointments } = useSuspenseQuery(
    trpc.appointment.findMany.queryOptions<AppointmentWithPatient[]>(
      withPatientName,
    ),
  );

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<AppointmentWithPatient> | null>(null);

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable<AppointmentWithPatient>({
    data: appointments ?? fallbackData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  const queryClient = useQueryClient();
  const { mutate: deleteAppointment, isPending: isDeleting } = useMutation(
    trpc.appointment.delete.mutationOptions({
      onMutate: () => {
        toast.loading("Excluindo consulta...", { id: "delete-appointment" });
      },
      onSettled: () => {
        toast.dismiss("delete-appointment");
      },
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: trpc.appointment.findMany.queryKey(),
          }),
          queryClient.invalidateQueries({
            queryKey: trpc.appointment.count.queryKey(),
          }),
        ]);

        toast.success("Consulta excluída com sucesso");
        setRowAction(null);
      },
      onError: (error) => {
        toast.error(`Erro ao excluir consulta: ${error.message}`);
      },
    }),
  );

  return (
    <>
      <div className="flex justify-between gap-4">
        <Input
          placeholder="Procurar por paciente"
          value={(table.getColumn("patient")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("patient")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Button asChild className="dark:bg-white dark:text-black">
          <Link href="/patients/new">
            <PlusIcon className="h-4 w-4" />
            Nova consulta
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a
              consulta (ID <strong>{rowAction?.row.original.id}</strong>) e
              todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                if (rowAction?.row.original.id) {
                  deleteAppointment({
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
