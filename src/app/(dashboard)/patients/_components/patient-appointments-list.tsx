"use client";
"use no memo";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { api } from "~/trpc/react";
import type { Appointment } from "@zenstackhq/runtime/models";
import { formatDate } from "~/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toast } from "sonner";

export const columns: ColumnDef<Appointment>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <div>Identificador único</div>;
    },
    size: 10,
    cell: ({ row }) => {
      return (
        <div className="w-fit">
          <Button variant="link" size="sm">
            <Link
              href={`/patients/${row.original.patientId}/appointments/${row.original.id}`}
            >
              {row.original.id}
            </Link>
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "motive",
    header: ({ column }) => {
      return <div>Motivo</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="max-w-[100px] truncate">
          {row.getValue("motive")}
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return <div>Data de criação</div>;
    },
    cell: ({ row }) => {
      return (
        <div>
          {formatDate(row.getValue("createdAt") as Date, {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },

  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return <div>Última atualização</div>;
    },
    cell: ({ row }) => {
      return (
        <div>
          {formatDate(row.getValue("updatedAt") as Date, {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const utils = api.useUtils();
      const deleteAppointment = api.appointment.delete.useMutation({
        onSuccess: async () => {
          toast.success("Consulta excluída com sucesso");
          await utils.patient.findUnique.invalidate({
            where: {
              id: row.original.patientId,
            },
          });
        },
        onError: (error) => {
          toast.error("Erro ao excluir consulta");
        },
      });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-red-600"
                  onSelect={(e) => e.preventDefault()}
                >
                  Excluir consulta
                </DropdownMenuItem>
              </AlertDialogTrigger>
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
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      deleteAppointment.mutate({
                        where: {  
                          id: row.original.id,
                        },
                      });
                    }}
                  >
                    {deleteAppointment.isPending ? "Excluindo..." : "Excluir"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PatientAppointmentsList({ patientId }: { patientId: string }) {
  const [patient] = api.patient.findUnique.useSuspenseQuery({
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
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data: (patient as any)?.appointments,
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
          <div className="mb-4 flex items-center justify-between">
            {/* <Input
              placeholder="Filtrar por paciente..."
              value={
                (table.getColumn("patientName")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) => {
                table
                  .getColumn("patientName")
                  ?.setFilterValue(event.target.value);
              }}
              className="max-w-sm"
            /> */}
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhuma consulta encontrada.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
