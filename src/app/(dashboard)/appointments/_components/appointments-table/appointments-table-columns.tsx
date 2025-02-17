import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatDate } from "~/lib/utils";
import { DataTableRowAction } from "~/types";
import { AppointmentWithPatient } from "~/types/db-entities";

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<AppointmentWithPatient> | null>
  >;
}

export function getColumns({
  setRowAction,
}: GetColumnsProps): ColumnDef<AppointmentWithPatient>[] {
  return [
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
      accessorKey: "patient",
      header: "Paciente",
      size: 10,
      cell: ({ row }) => {
        return (
          <div className="w-fit">
            <Button variant="link" size="sm">
              <Link href={`/patients/${row.original.patientId}`}>
                {row.original.patient.name}
              </Link>
            </Button>
          </div>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        return row.original.patient.name
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
    },
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
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "update" })}
              >
                Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500"
                onSelect={() => setRowAction({ row, type: "delete" })}
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
