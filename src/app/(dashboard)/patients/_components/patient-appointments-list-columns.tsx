"use client";
"use no memo";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import type { Appointment } from "@zenstackhq/runtime/models";
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
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatDate } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";
import { DataTableRowAction } from "~/types";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Appointment> | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<Appointment>[] {
  const trpc = useTRPC();
  return [
    // {
    //   accessorKey: "id",
    //   header: ({ column }) => {
    //     return <div>Identificador único</div>;
    //   },
    //   size: 10,
    //   cell: ({ row }) => {
    //     return (
    //       <div className="w-fit">
    //         <Button variant="link" size="sm">
    //           <Link
    //             href={`/patients/${row.original.patientId}/appointments/${row.original.id}`}
    //           >
    //             {row.original.id}
    //           </Link>
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: "motive",
      header: ({ column }) => {
        return <div>Motivo</div>;
      },
      cell: ({ row }) => {
        return (
          <div className="max-w-[100px] truncate">{row.getValue("motive")}</div>
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
        const queryClient = useQueryClient();
        const deleteAppointment = useMutation(
          trpc.appointment.delete.mutationOptions({
            onSuccess: async () => {
              toast.success("Consulta excluída com sucesso");
              await queryClient.invalidateQueries({
                queryKey: trpc.appointment.findMany.queryKey({
                  where: {
                    patientId: row.original.patientId,
                  },
                }),
              });
            },
            onError: (error) => {
              toast.error("Erro ao excluir consulta");
            },
          }),
        );

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
}
