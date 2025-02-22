"use client";
"use no memo";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import * as React from "react";

import type { Appointment } from "@zenstackhq/runtime/models";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DataTable } from "~/components/ui/data-table";
import { useTRPC } from "~/trpc/react";
import { DataTableRowAction } from "~/types";
import { PatientWithAppointments } from "~/types/db-entities";
import { getColumns } from "./patient-appointments-list-columns";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
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

const fallbackData: PatientWithAppointments[] = [];

export function PatientAppointmentsList({ patientId }: { patientId: string }) {
  const trpc = useTRPC();
  const router = useRouter();

  const { data: patient } = useSuspenseQuery(
    trpc.patient.findUnique.queryOptions<PatientWithAppointments>({
      where: {
        id: patientId,
      },
      include: {
        appointments: true,
        vaccinations: {
          include: {
            vaccinationsValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        allergies: {
          include: {
            allergiesValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        medications: {
          include: {
            medicationsValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        comorbidities: {
          include: {
            comorbiditiesValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        examResults: {
          include: {
            examResultsValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        surgeries: {
          include: {
            surgeriesValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
        healthPlans: {
          include: {
            healthPlansValues: {
              select: {
                id: true,
                value: true,
              },
            },
          },
        },
      },
    }),
  );

  const queryClient = useQueryClient();
  const deleteAppointment = useMutation(
    trpc.appointment.delete.mutationOptions({
      onSuccess: async () => {
        toast.success("Consulta excluída com sucesso");
        await queryClient.invalidateQueries({
          queryKey: trpc.appointment.findMany.queryKey({
            where: {
              patientId,
            },
          }),
        });
      },
      onError: (error) => {
        toast.error("Erro ao excluir consulta");
      },
    }),
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowAction, setRowAction] =
    useState<DataTableRowAction<Appointment> | null>(null);

  const columns = useMemo(() => getColumns({ setRowAction }), [setRowAction]);

  const table = useReactTable<Appointment>({
    data: patient.appointments ?? fallbackData,
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
    meta: {
      onRowClick: (row: Appointment) => {
        router.push(`/patients/${patientId}/appointments/${row.id}`);
      },
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Consultas
          <Button>
            <Link href={`/patients/${patientId}/appointments/new`}>
              Nova Consulta
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <div className="rounded-md border">
            <DataTable table={table} emptyMessage="Nenhuma consulta" />

            <AlertDialog
              open={rowAction?.type === "delete"}
              onOpenChange={() => setRowAction(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir esta consulta?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive"
                    onClick={() => {
                      if (rowAction?.row.original.id) {
                        deleteAppointment.mutate({
                          where: {
                            id: rowAction.row.original.id,
                          },
                        });
                      }
                    }}
                  >
                    {deleteAppointment.isPending ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Próxima
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
